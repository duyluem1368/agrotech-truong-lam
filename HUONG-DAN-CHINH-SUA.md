# Hướng dẫn chỉnh sửa website Agrotech Trường Lâm

Website dùng HTML, CSS và JavaScript thuần, không cần cài phần mềm hay cơ sở dữ liệu.

## Mở website

Mở file `index.html` bằng Chrome, Edge hoặc Safari.

## Cấu trúc mã nguồn

- `index.html`: nội dung trang và danh sách sản phẩm.
- `styles.css`: màu sắc, bố cục và giao diện chính.
- `catalog.css`: giao diện danh mục, bộ lọc sản phẩm.
- `script.js`: menu, hiệu ứng, bộ lọc và hộp thông tin.
- `assets/`: logo và ảnh sản phẩm.

## Thêm sản phẩm

1. Chép ảnh sản phẩm vào thư mục `assets/`. Nên đặt tên không dấu, viết thường, dùng dấu gạch ngang, ví dụ `thuoc-moi-25sc.jpg`.
2. Mở `index.html` bằng trình soạn thảo văn bản.
3. Tìm phần có dòng `catalog-card`.
4. Sao chép một thẻ `<article class="catalog-card ...">...</article>` có sẵn.
5. Thay tên ảnh, tên sản phẩm, hoạt chất, công dụng, liều lượng, quy cách và thời gian cách ly.
6. Chọn đúng nhóm:
   - `data-category="insecticide"` cho thuốc trừ sâu.
   - `data-category="fungicide"` cho thuốc trừ bệnh.
7. Lưu file rồi tải lại trang.

## Xóa sản phẩm

Trong `index.html`, xóa toàn bộ thẻ `<article class="catalog-card ...">...</article>` của sản phẩm cần bỏ.

## Thay số điện thoại

Trong `index.html`, tìm `0388051282` và `0388 051 282`, sau đó thay bằng số mới. Dạng trong liên kết `tel:` phải viết liền, không có khoảng trắng.

## Thay logo

Thay file `assets/logo-agrotech-truong-lam.jpg` bằng logo mới có cùng tên. Nếu dùng tên khác, sửa đường dẫn ảnh tương ứng trong `index.html`.

## Lưu ý nội dung thuốc bảo vệ thực vật

Chỉ đăng thông tin đúng theo nhãn đã được phê duyệt: hoạt chất, đối tượng phòng trừ, liều lượng, cách sử dụng, thời gian cách ly và cảnh báo an toàn.

