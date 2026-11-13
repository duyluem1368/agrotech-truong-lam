const ZALO_API = "https://bot-api.zaloplatforms.com";
const WEBSITE_URL = "https://agrotechtruonglam.com.vn/#san-pham";
const HOTLINE = "0388 051 282";
const VERSION = "agrotech-crop-advisor-v2";
const KNOWN_CROPS = [
  "lúa", "ngô", "bắp", "sắn", "khoai", "khoai lang", "khoai tây", "rau", "bắp cải", "cải", "cải thảo", "cải xanh", "cà chua", "ớt", "dưa", "dưa leo", "dưa hấu", "bí", "mướp", "đậu", "lạc", "mía",
  "cà phê", "hồ tiêu", "điều", "cao su", "chè", "thanh long", "cam", "quýt", "bưởi", "chanh", "xoài", "nhãn", "vải", "sầu riêng", "bơ", "chuối", "dứa", "ổi", "nho", "hoa cúc", "hoa hồng"
];

// Danh mục bán hàng được tuyển chọn từ chính website Agrotech Trường Lâm.
// Không dùng catalog thị trường 6.919 sản phẩm để giới thiệu cho khách.
const AGROTECH_PRODUCTS = [
  { name: "TukTuk 20SC", type: "thuốc trừ sâu", active: "Lambda-cyhalothrin + Thiamethoxam", crops: [], targets: ["rầy nâu", "rệp mềm", "bọ phấn", "côn trùng chích hút", "sâu hại"], advantage: "phối hợp hai hoạt chất, hỗ trợ kiểm soát nhanh và kéo dài với nhóm sâu chích hút", package: "dạng chai" },
  { name: "Sharking 25SC", type: "thuốc trừ sâu", active: "Chlorantraniliprole 15% + Chlorfenapyr 10%", crops: ["ngô", "lúa"], targets: ["sâu keo", "sâu keo mùa thu", "sâu đục thân", "sâu đục thân lúa", "sâu đục quả", "sâu ăn lá"], advantage: "phối hợp hai cơ chế tác động, phù hợp nhóm sâu miệng nhai", registration: "đăng ký trừ sâu keo trên ngô", phi: "7 ngày", package: "gói 25 ml" },
  { name: "Pitako USA 18.5SC", type: "thuốc trừ sâu", active: "Chlorantraniliprole 18.5%", crops: ["ngô", "lúa"], targets: ["sâu keo", "sâu keo mùa thu", "sâu cuốn lá", "sâu đục thân"], advantage: "hoạt chất chuyên sâu miệng nhai, tác động tốt khi sâu còn tuổi nhỏ", package: "gói 25 ml" },
  { name: "SAMTAKO 20SC", type: "thuốc trừ sâu", active: "Chlorantraniliprole 16% + Indoxacarb 4%", crops: ["ngô", "lúa"], targets: ["sâu keo", "sâu keo mùa thu", "sâu đục thân", "sâu đục thân lúa", "sâu đục quả"], advantage: "hai hoạt chất bổ trợ giúp kiểm soát sâu miệng nhai", registration: "đăng ký trừ sâu keo trên ngô", phi: "7 ngày", package: "chai 240 ml" },
  { name: "Cetamiusavb 35WG", type: "thuốc trừ sâu", active: "Acetamiprid 15% + Flonicamid 20%", crops: ["hoa cúc"], targets: ["bọ trĩ", "bọ trĩ hoa cúc", "rệp mềm", "bọ phấn", "côn trùng chích hút"], advantage: "phối hợp hai hoạt chất phù hợp nhóm côn trùng chích hút", registration: "đăng ký trừ bọ trĩ trên hoa cúc", dose: "0,4 kg/ha", phi: "7 ngày", package: "gói 22 g" },
  { name: "Rhett 60WG", type: "thuốc trừ bệnh", active: "Metiram 55% + Pyraclostrobin 5%", crops: ["hoa cúc"], targets: ["rỉ sắt", "rỉ sắt hoa cúc", "nam benh"], advantage: "kết hợp tác động tiếp xúc và lưu dẫn để quản lý bệnh", registration: "đăng ký trừ rỉ sắt trên hoa cúc", dose: "1,3 kg/ha", phi: "7 ngày", package: "gói 45 g" },
  { name: "Rocky 150SC", type: "thuốc trừ sâu", active: "Bifenthrin 50 g/L + Flonicamid 100 g/L", crops: ["sắn"], targets: ["bọ phấn", "bọ phấn trắng", "bọ trĩ", "rầy xanh", "côn trùng chích hút"], advantage: "phối hợp tác động tiếp xúc và lưu dẫn cho nhóm côn trùng chích hút", registration: "đăng ký trừ bọ phấn trắng trên sắn", phi: "14 ngày", package: "chai 25 ml" },
  { name: "SV-Stellar 30SC", type: "thuốc trừ sâu", active: "Clothianidin 30%", crops: [], targets: ["rầy", "rệp", "bọ phấn", "côn trùng chích hút"], advantage: "hoạt chất lưu dẫn, phù hợp quản lý nhóm côn trùng chích hút", package: "dạng chai" },
  { name: "Unizeb M-45 80WP", type: "thuốc trừ bệnh", active: "Mancozeb 80%", crops: ["thanh long"], targets: ["thán thư", "thán thư thanh long", "nam benh"], advantage: "thuốc tiếp xúc phổ rộng, thích hợp dùng phòng bệnh theo đúng nhãn", registration: "đăng ký trừ thán thư trên thanh long", dose: "0,63%; lượng nước 600–800 lít/ha", package: "gói 1 kg" },
  { name: "IMITADO 350SC", type: "thuốc trừ sâu", active: "Imidacloprid 350 g/L", crops: [], targets: ["rầy", "rệp", "bọ phấn", "côn trùng chích hút"], advantage: "hoạt chất lưu dẫn, tập trung vào nhóm côn trùng chích hút", package: "chai 240 ml" },
  { name: "Nofada 822WP", type: "thuốc trừ bệnh", active: "Tricyclazole 440 + Isoprothiolane 350 + Hexaconazole 32 g/kg", crops: ["lúa"], targets: ["đạo ôn", "đạo ôn lúa", "cháy lá", "nam benh"], advantage: "tổ hợp ba hoạt chất và khả năng lưu dẫn, là lựa chọn Agrotech ưu tiên cho đạo ôn lúa", registration: "đăng ký trừ đạo ôn trên lúa", phi: "14 ngày", package: "gói 18 g" },
  { name: "Masterone 26SC", type: "thuốc trừ bệnh", active: "Fenoxanil 20% + Kresoxim-methyl 6%", crops: ["cà phê"], targets: ["thán thư", "thán thư cà phê", "nam benh"], advantage: "phối hợp hai hoạt chất để quản lý bệnh thán thư", registration: "đăng ký trừ thán thư trên cà phê", dose: "0,25%", phi: "10 ngày", package: "chai 28 ml" },
  { name: "Matsu Power 12SC", type: "thuốc trừ sâu", active: "Chlorfenapyr 9,5% + Lufenuron 2,5%", crops: ["ngô"], targets: ["sâu keo", "sâu keo mùa thu", "sâu ăn lá"], advantage: "vừa tác động lên chuyển hóa năng lượng vừa ức chế hình thành kitin", registration: "đăng ký trừ sâu keo mùa thu trên ngô", dose: "0,4 lít/ha", phi: "14 ngày", package: "chai 30 ml" },
  { name: "Techtimex 50WG", type: "thuốc trừ sâu", active: "Emamectin benzoate 49 g/kg + Matrine 1 g/kg", crops: ["lúa"], targets: ["sâu cuốn lá", "sâu cuốn lá lúa", "sâu ăn lá"], advantage: "tác động kép, được Agrotech ưu tiên cho sâu cuốn lá lúa", registration: "đăng ký trừ sâu cuốn lá trên lúa", dose: "100–150 g/ha", phi: "7 ngày", package: "gói 100 g" }
];

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
    return res.status(200).json({ ok: true, service: "agrotech-zalo-assistant-vercel", version: VERSION, source: "agrotech_website_products" });
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
      await sendMessage(chatId, buildAnswer(question).slice(0, 2000));
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

function findProducts(question) {
  const normalizedQuestion = normalize(question);
  const terms = meaningfulTerms(normalizedQuestion);
  if (!terms.length) return [];

  const ranked = AGROTECH_PRODUCTS.map((product) => {
    let score = 0;
    const targets = product.targets.map(normalize);
    const crops = product.crops.map(normalize);
    const searchable = normalize([product.name, product.active, product.type, product.registration, ...targets, ...crops].join(" "));
    for (const target of targets) if (target.length > 2 && normalizedQuestion.includes(target)) score += 120 + target.length;
    for (const crop of crops) if (crop.length > 1 && normalizedQuestion.includes(crop)) score += 45;
    if (product.registration && targets.some((target) => target.length > 2 && normalizedQuestion.includes(target))) score += 50;
    for (const term of terms) if (searchable.split(/\s+/).includes(term)) score += 8;
    if (normalizedQuestion.includes(normalize(product.name))) score += 200;
    return { product, score };
  }).filter((item) => item.score >= 8).sort((a, b) => b.score - a.score);
  const bestScore = ranked[0]?.score || 0;
  return ranked.filter((item) => item.score >= bestScore * 0.45).slice(0, 3).map(({ product }) => product);
}

function buildAnswer(question) {
  if (isGreeting(question)) {
    return `Xin chào anh/chị 👋 Em là trợ lý tư vấn của Agrotech Trường Lâm. Em rất vui được hỗ trợ anh/chị.\n\nAnh/chị đang cần:\n1. Tìm sản phẩm theo cây trồng hoặc sâu bệnh\n2. Tra cứu công dụng, hoạt chất, cách dùng\n3. Kết nối chuyên viên kỹ thuật\n\nAnh/chị cho em biết đang trồng cây gì và gặp sâu bệnh/triệu chứng nào nhé. Sản phẩm chính hãng: ${WEBSITE_URL}`;
  }
  const cropConsultation = buildCropConsultation(question);
  if (cropConsultation) return cropConsultation;
  if (!hasSpecificNeed(question)) {
    return `Dạ, anh/chị đang quan tâm cây trồng nào ạ? Anh/chị cho em biết thêm tên sâu bệnh hoặc triệu chứng (ví dụ: lúa bị đạo ôn, ngô có sâu keo, sắn có bọ phấn) để em chọn đúng sản phẩm Agrotech và giải thích chi tiết.\n\nDanh mục chính hãng: ${WEBSITE_URL}`;
  }
  const products = findProducts(question);
  if (!products.length) {
    return `Dạ, để tư vấn đúng sản phẩm Agrotech và tránh dùng sai thuốc, anh/chị cho em thêm 3 thông tin:\n• Cây trồng\n• Sâu bệnh hoặc triệu chứng đang thấy\n• Giai đoạn cây và diện tích\n\nEm chỉ ưu tiên giới thiệu sản phẩm Agrotech đang phân phối trên website, không gợi ý hàng ngoài danh mục. Xem sản phẩm: ${WEBSITE_URL}\nHotline chuyên viên: ${HOTLINE}.`;
  }
  const lines = products.map((product, index) => {
    const details = [product.registration, product.dose && `liều trên website: ${product.dose}`, product.phi && `cách ly: ${product.phi}`, product.package].filter(Boolean);
    return `${index + 1}. ${product.name} — ${product.type}\n• Hoạt chất: ${product.active}\n• Điểm nổi bật: ${product.advantage}${details.length ? `\n• Thông tin: ${details.join("; ")}` : ""}`;
  });
  return `Xin chào anh/chị 👋 Với nhu cầu “${question}”, sản phẩm Agrotech phù hợp nhất là:\n\n${lines.join("\n\n")}\n\nAnh/chị xem hình ảnh và danh mục chính hãng tại: ${WEBSITE_URL}\nĐể chốt đúng liều theo tình trạng ruộng/vườn, vui lòng gửi thêm ảnh thực tế hoặc gọi ${HOTLINE}. Luôn đọc kỹ nhãn và tuân thủ thời gian cách ly.`;
}

function buildCropConsultation(question) {
  const text = normalize(question);
  const crop = extractCrop(text);
  const hasYellowing = /vang la|la vang|vang la gan|vang ngon|vang tu/.test(text);
  const hasWilting = /heo|he(o|u) ru|rot re|thoi re|chet cay/.test(text);
  const hasLeafSpot = /dom la|chay la|vet nau|vet den|moc|phan trang/.test(text);
  const hasChewing = /thung la|rach la|bi an la|sau an/.test(text);
  const hasSucking = /xoan la|qu(e|ă)n la|dinh la|bo tri|ray|rep|bo phan/.test(text);

  if (hasYellowing) {
    return `Dạ, em đã nhận được cây ${crop || "trồng"} bị vàng lá. Vàng lá là triệu chứng, chưa thể kết luận ngay là một bệnh nên em chưa vội giới thiệu thuốc. Anh/chị kiểm tra giúp em:\n\n1. Lá già phía dưới vàng trước hay lá non phía ngọn vàng trước?\n2. Lá có đốm nâu/đen, cháy mép hoặc mốc không?\n3. Cây có héo, gốc mềm, rễ nâu/thối hay đất đang úng không?\n4. Mặt dưới lá có rệp, bọ phấn, bọ trĩ hoặc nhện nhỏ không?\n\n• Vàng đều, không có vết bệnh: thường cần kiểm tra dinh dưỡng, pH và úng/rễ trước.\n• Có đốm/cháy/mốc: nghi nhóm bệnh do nấm hoặc vi khuẩn.\n• Có côn trùng mặt dưới lá: xử lý theo đúng loại sâu chích hút.\n\nAnh/chị trả lời các dấu hiệu trên, em sẽ phân loại sâu hay bệnh rồi mới đối chiếu sản phẩm Trường Lâm phù hợp. Nếu cần xem ảnh thực tế hoặc danh mục chưa có sản phẩm đăng ký đúng đối tượng, chuyên viên ${HOTLINE} sẽ kiểm tra thêm; em không gợi ý bừa.\nSản phẩm Trường Lâm: ${WEBSITE_URL}`;
  }

  if (hasWilting || hasLeafSpot || hasChewing || hasSucking) {
    const category = hasChewing ? "sâu ăn lá/miệng nhai" : hasSucking ? "côn trùng chích hút" : hasWilting ? "bệnh vùng gốc–rễ hoặc điều kiện úng" : "bệnh trên lá";
    return `Dạ, biểu hiện trên cây ${crop || "trồng"} đang nghiêng về nhóm ${category}. Để chọn đúng sản phẩm Trường Lâm, anh/chị mô tả thêm vị trí bị hại, bệnh xuất hiện bao lâu và đang lan nhanh hay chậm. Em sẽ đối chiếu đúng cây trồng, đúng đối tượng đăng ký và chỉ tư vấn sản phẩm phù hợp trên ${WEBSITE_URL}. Nếu cần kiểm tra ảnh thực tế, liên hệ chuyên viên ${HOTLINE}.`;
  }

  if (crop && !hasSpecificNeed(question)) {
    return `Dạ, với cây ${crop}, anh/chị đang cần phòng trừ vấn đề nào ạ?\n\n• Lá bị ăn thủng/cuốn lá → kiểm tra sâu miệng nhai\n• Lá xoăn, có rệp/rầy/bọ trĩ/bọ phấn → kiểm tra côn trùng chích hút\n• Lá có đốm, cháy, mốc → kiểm tra nhóm bệnh trên lá\n• Cây vàng, héo, rễ nâu/thối → kiểm tra dinh dưỡng, úng và bệnh vùng rễ\n\nAnh/chị mô tả dấu hiệu hoặc gửi ảnh, em sẽ phân loại trước rồi ưu tiên sản phẩm Trường Lâm đúng đối tượng; không chọn thuốc chỉ dựa vào tên cây. Danh mục: ${WEBSITE_URL}`;
  }
  return "";
}

function extractCrop(normalizedText) {
  return [...KNOWN_CROPS].sort((a, b) => b.length - a.length).find((crop) => normalizedText.includes(normalize(crop))) || "";
}

function isGreeting(value) {
  const text = normalize(value).trim();
  return /^(xin chao|chao|hello|hi|alo|bat dau|start)(\s+(anh|chi|em|ad|bot))?[.! ]*$/.test(text);
}

function hasSpecificNeed(value) {
  const text = normalize(value);
  return AGROTECH_PRODUCTS.some((product) =>
    text.includes(normalize(product.name)) ||
    product.targets.some((target) => normalize(target).length > 2 && text.includes(normalize(target))) ||
    text.includes(normalize(product.active))
  );
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
