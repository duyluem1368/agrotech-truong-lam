const ZALO_API = "https://bot-api.zaloplatforms.com";
const CATALOG_URL = "https://agrotechtruonglam.com.vn/assets/catalog.json";

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query?.setup === "1") {
      if (!process.env.ZALO_BOT_TOKEN || !process.env.ZALO_SECRET_TOKEN) {
        return res.status(503).json({ ok: false, error: "zalo_secrets_not_configured" });
      }
      const webhookUrl = `https://${req.headers.host}/api/zalo`;
      const configured = await callZalo("setWebhook", {
        url: webhookUrl,
        secret_token: process.env.ZALO_SECRET_TOKEN
      });
      const test = await callZalo("testWebhook");
      return res.status(200).json({ ok: configured.ok && test.ok, webhook_url: webhookUrl, webhook_set: configured, webhook_test: test });
    }
    return res.status(200).json({ ok: true, service: "agrotech-zalo-assistant-vercel" });
  }

  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  if (!process.env.ZALO_BOT_TOKEN || !process.env.ZALO_SECRET_TOKEN) {
    return res.status(503).json({ ok: false, error: "zalo_secrets_not_configured" });
  }

  const suppliedSecret = req.headers["x-bot-api-secret-token"] || "";
  if (!safeEqual(String(suppliedSecret), process.env.ZALO_SECRET_TOKEN)) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  const event = typeof req.body === "object" && req.body ? req.body : {};
  const message = event.message;
  const chatId = message?.chat?.id;
  if (!chatId || message?.from?.is_bot) return res.status(200).json({ ok: true, ignored: true });

  try {
    if (event.event_name !== "message.text.received" || !message.text?.trim()) {
      await sendMessage(chatId, "Hiện em hỗ trợ tốt nhất bằng tin nhắn văn bản. Anh/chị hãy gửi tên cây trồng, sâu bệnh/triệu chứng hoặc tên sản phẩm cần tra cứu.");
    } else {
      const question = message.text.trim().slice(0, 1500);
      const products = await findProducts(question);
      await sendMessage(chatId, fallbackAnswer(question, products).slice(0, 2000));
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("zalo_event_error", error);
    return res.status(500).json({ ok: false, error: "event_processing_failed" });
  }
};

async function callZalo(method, payload = {}) {
  const response = await fetch(`${ZALO_API}/bot${process.env.ZALO_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json().catch(() => ({ ok: false, error: "invalid_response" }));
  return { ok: response.ok && body?.ok !== false, status: response.status, body };
}

async function sendMessage(chatId, text) {
  const response = await fetch(`${ZALO_API}/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!response.ok) throw new Error(`Zalo sendMessage failed: ${response.status} ${await response.text()}`);
}

async function findProducts(question) {
  const response = await fetch(process.env.CATALOG_URL || CATALOG_URL);
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
  }).filter((item) => item.score > 1).sort((a, b) => b.score - a.score).slice(0, 3).map(({ product }) => product);
}

function fallbackAnswer(question, products) {
  if (!products.length) {
    return `Em chưa tìm thấy dữ liệu đủ chắc chắn cho “${question}”. Anh/chị cho em thêm cây trồng, sâu bệnh hoặc triệu chứng và khu vực canh tác. Hotline chuyên viên: 0388 051 282.`;
  }
  const lines = products.map((product, index) => {
    const registration = product.registered?.[0];
    const detail = registration ? ` — đăng ký tham khảo: ${registration.crop}/${registration.target}` : "";
    return `${index + 1}. ${product.name} (${product.active || "chưa rõ hoạt chất"})${detail}`;
  });
  return `Em tìm thấy một số kết quả gần với “${question}”:\n${lines.join("\n")}\n\nVui lòng đọc kỹ nhãn và liên hệ 0388 051 282 để chuyên viên xác nhận.`;
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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
