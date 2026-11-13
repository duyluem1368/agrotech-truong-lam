# Agrotech Zalo Assistant

Cloudflare Worker nhận webhook từ Zalo Bot Platform và trả lời bằng Workers AI cùng dữ liệu sản phẩm công khai của Agrotech Trường Lâm.

## Secrets bắt buộc

- `ZALO_BOT_TOKEN`
- `ZALO_SECRET_TOKEN`

Không commit hai giá trị này vào GitHub. Thiết lập bằng Cloudflare Dashboard hoặc `wrangler secret put`.

## Endpoint

- Health check: `GET /health`
- Zalo webhook: `POST /webhook/zalo`

Webhook chỉ chấp nhận request có header `X-Bot-Api-Secret-Token` khớp với `ZALO_SECRET_TOKEN`.
