const ZALO_API = "https://bot-api.zaloplatforms.com";
const MAX_RESULTS = 6;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "agrotech-zalo-assistant" });
    }

    if (request.method === "GET" && url.pathname === "/diagnostics/zalo-webhook") {
      if (!env.ZALO_BOT_TOKEN || !env.ZALO_SECRET_TOKEN) {
        return json({ ok: false, error: "zalo_secrets_not_configured" }, 503);
      }

      const webhookUrl = `${url.origin}/webhook/zalo`;
      const configured = await callZaloBotApi("setWebhook", env.ZALO_BOT_TOKEN, {
        url: webhookUrl,
        secret_token: env.ZALO_SECRET_TOKEN
      });
      const [info, test] = await Promise.all([
        callZaloBotApi("getWebhookInfo", env.ZALO_BOT_TOKEN),
        callZaloBotApi("testWebhook", env.ZALO_BOT_TOKEN)
      ]);
      return json({
        ok: configured.ok && info.ok && test.ok,
        webhook_set: configured.body,
        webhook_info: info.body,
        webhook_test: test.body
      });
    }

    if (request.method !== "POST" || url.pathname !== "/webhook/zalo") {
      return new Response("Not found", { status: 404 });
    }

    if (!env.ZALO_SECRET_TOKEN || !env.ZALO_BOT_TOKEN) {
      return json({ ok: false, error: "server_not_configured" }, 503);
    }

    const suppliedSecret = request.headers.get("X-Bot-Api-Secret-Token") || "";
    if (!safeEqual(suppliedSecret, env.ZALO_SECRET_TOKEN)) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    let event;
    try {
      event = await request.json();
    } catch {
      // Zalo may send an empty request while verifying a newly configured webhook.
      return json({ ok: true, verification: true });
    }

    const message = event?.message;
    const chatId = message?.chat?.id;
    if (!chatId || message?.from?.is_bot) return json({ ok: true, ignored: true });

    ctx.waitUntil(handleEvent(event, env).catch((error) => console.error("event_error", error)));
    return json({ ok: true });
  }
};

async function handleEvent(event, env) {
  const message = event.message;
  const chatId = message.chat.id;

  if (event.event_name === "message.image.received") {
    await sendMessage(chatId,
      "Em đã nhận ảnh. Bản hiện tại chưa chẩn đoán bệnh trực tiếp từ ảnh. Anh/chị vui lòng cho biết thêm cây trồng, triệu chứng, thời gian xuất hiện và khu vực canh tác; chuyên viên sẽ hỗ trợ xác nhận.",
      env.ZALO_BOT_TOKEN);
    return;
  }

  if (event.event_name !== "message.text.received" || !message.text?.trim()) {
    await sendMessage(chatId,
      "Hiện em hỗ trợ tốt nhất bằng tin nhắn văn bản. Anh/chị hãy gửi tên cây trồng, sâu bệnh/triệu chứng hoặc tên sản phẩm cần tra cứu.",
      env.ZALO_BOT_TOKEN);
    return;
  }

  const question = message.text.trim().slice(0, 1500);
  const products = await findProducts(question, env.CATALOG_URL);
  const answer = await createAnswer(question, products, env);
  await sendMessage(chatId, answer.slice(0, 2000), env.ZALO_BOT_TOKEN);
}

async function findProducts(question, catalogUrl) {
  const response = await fetch(catalogUrl, { cf: { cacheTtl: 3600, cacheEverything: true } });
  if (!response.ok) return [];

  const catalog = await response.json();
  const normalizedQuestion = normalize(question);
  const terms = meaningfulTerms(normalizedQuestion);
  if (!terms.length || !Array.isArray(catalog)) return [];

  return catalog.map((product) => {
    const registrations = Array.isArray(product.registered) ? product.registered : [];
    let score = 0;

    for (const item of registrations) {
      const crop = normalize(item.crop);
      const target = normalize(item.target);
      if (target && normalizedQuestion.includes(target)) score += 100;
      if (crop && normalizedQuestion.includes(crop)) score += 35;
      const cropTerms = new Set(crop.split(/\s+/));
      const targetTerms = new Set(target.split(/\s+/));
      for (const term of terms) {
        if (targetTerms.has(term)) score += 12;
        if (cropTerms.has(term)) score += 6;
      }
    }

    const nameTerms = new Set(normalize(product.name).split(/\s+/));
    const activeTerms = new Set(normalize(product.active).split(/\s+/));
    for (const term of terms) {
      if (nameTerms.has(term)) score += 8;
      if (activeTerms.has(term)) score += 5;
    }
    return { product, score };
  }).filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({ product }) => ({
      name: product.name,
      active: product.active,
      company: product.company,
      url: product.url,
      registered: (product.registered || []).slice(0, 8)
    }));
}

async function createAnswer(question, products, env) {
  const fallback = fallbackAnswer(question, products);
  if (!env.AI) return fallback;

  const system = `Bạn là trợ lý tư vấn của Agrotech Trường Lâm. Trả lời tiếng Việt, thân thiện, ngắn gọn.
Chỉ dùng dữ liệu sản phẩm được cung cấp. Không tự bịa tên thuốc, hoạt chất, liều dùng, thời gian cách ly hoặc chẩn đoán chắc chắn.
- Quy tắc pháp lý bắt buộc: chỉ bản ghi `registered` có đúng cây trồng + đối tượng mới cho phép nói sản phẩm “đăng ký”. Tên sản phẩm, hoạt chất hoặc nhóm `targets` chỉ là căn cứ để phân tích/gợi ý tham khảo, tuyệt đối không được suy ra đăng ký. Không được tự thêm PHI hoặc liều cho sản phẩm không có bản ghi khớp.
- Tư vấn theo 2 tầng: ưu tiên trước hết sản phẩm có đăng ký khớp chính xác cây trồng và đối tượng; nếu chưa có đăng ký khớp thì mở rộng tự nhiên bằng phân tích hoạt chất, cơ chế tác động và nhóm sâu thường bị tác động (ví dụ sâu miệng nhai, sâu đục thân, sâu đục quả, sâu cuốn lá), rồi giới thiệu sản phẩm Trường Lâm có hoạt chất đó như “gợi ý tham khảo”.
- Không dùng cách diễn đạt cứng như “do dữ liệu hiện tại ghi nhận”. Nói rõ phần đăng ký cần đối chiếu nhãn hiện hành, còn phần hoạt chất/sản phẩm là hướng tham khảo; không khẳng định được phép sử dụng và không tự suy ra liều, số lần phun hay thời gian cách ly.
- Với sâu cuốn lá lúa, không mặc định ưu tiên Chlorantraniliprole; sau sản phẩm đăng ký đúng đối tượng, ưu tiên phân tích thêm Emamectin benzoate, Indoxacarb, Chlorfenapyr và Lufenuron theo đặc điểm sâu.
Nếu dữ liệu không đủ, hãy hỏi thêm cây trồng, triệu chứng/đối tượng, giai đoạn và khu vực; mời liên hệ 0388 051 282 để chuyên viên xác nhận.
Khi có liều lượng/cách ly, nói rõ đây là dữ liệu đăng ký tham khảo và người dùng phải đọc nhãn sản phẩm trước khi sử dụng.
Không khuyến nghị pha chung hoặc sử dụng ngoài đăng ký. Tối đa 1700 ký tự.`;

  const context = products.length
    ? JSON.stringify(products)
    : "Không tìm thấy sản phẩm phù hợp trong dữ liệu tra cứu.";

  try {
    const result = await env.AI.run(env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Câu hỏi: ${question}\n\nDữ liệu tra cứu: ${context}` }
      ],
      max_tokens: 500,
      temperature: 0.2
    });
    return result?.response?.trim() || fallback;
  } catch (error) {
    console.error("ai_error", error);
    return fallback;
  }
}

function fallbackAnswer(question, products) {
  if (!products.length) {
    return `Em chưa tìm thấy dữ liệu đủ chắc chắn cho “${question}”. Anh/chị cho em thêm: cây trồng, sâu bệnh hoặc triệu chứng, giai đoạn phát sinh và khu vực canh tác. Hotline chuyên viên: 0388 051 282.`;
  }

  const lines = products.slice(0, 3).map((product, index) => {
    const registration = product.registered?.[0];
    const detail = registration
      ? ` — đăng ký tham khảo: ${registration.crop}/${registration.target}`
      : "";
    return `${index + 1}. ${product.name} (${product.active || "chưa rõ hoạt chất"})${detail}`;
  });

  return `Em tìm thấy một số kết quả gần với “${question}”:\n${lines.join("\n")}\n\nVui lòng đọc kỹ nhãn và liên hệ 0388 051 282 để chuyên viên xác nhận đúng cây trồng, đối tượng, liều dùng và thời gian cách ly.`;
}

async function sendMessage(chatId, text, botToken) {
  const response = await fetch(`${ZALO_API}/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!response.ok) throw new Error(`Zalo sendMessage failed: ${response.status} ${await response.text()}`);
}

async function callZaloBotApi(method, botToken, payload = {}) {
  try {
    const response = await fetch(`${ZALO_API}/bot${botToken}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({ ok: false, error: "invalid_response" }));
    return { ok: response.ok && body?.ok !== false, status: response.status, body };
  } catch (error) {
    return { ok: false, status: 0, body: { ok: false, error: String(error) } };
  }
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function meaningfulTerms(value) {
  const stopwords = new Set(["toi", "can", "tim", "thuoc", "dac", "tri", "benh", "cho", "ma", "gi", "nao", "co", "khong", "giup", "voi", "anh", "chi", "em", "cua", "tren"]);
  return value.split(/[^a-z0-9]+/).filter((term) => term.length > 1 && !stopwords.has(term));
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return mismatch === 0;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
