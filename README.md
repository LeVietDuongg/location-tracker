# Dự Án Theo Dõi Vị Trí

Đây là một dự án web đơn giản cho phép bạn tạo và chia sẻ các liên kết. Khi người dùng khác nhấp vào liên kết, bạn có thể thu thập thông tin về vị trí của họ.

## Cách sử dụng

1. Mở file `index.html` để tạo và quản lý các liên kết
2. Nhập tên cho liên kết mới và nhấn "Tạo Link"
3. Sao chép liên kết và chia sẻ cho người dùng
4. Khi người dùng nhấp vào liên kết và chia sẻ vị trí, thông tin sẽ được lưu lại
5. Bạn có thể xem các vị trí đã thu thập trong trang chính của ứng dụng

## Tính năng

- Tạo liên kết với giao diện giveaway hấp dẫn
- Thu thập vị trí của người dùng (vĩ độ, kinh độ, độ chính xác)
- Tự động lấy địa chỉ từ tọa độ
- Lưu trữ dữ liệu cục bộ bằng localStorage
- Giao diện thân thiện với người dùng

## Cấu trúc thư mục

- `index.html` - Trang quản lý của admin
- `giveaway.html` - Trang giả làm trang quay số trúng thưởng
- `app.js` - Mã JavaScript cho trang chủ
- `tracker.js` - Mã JavaScript để theo dõi vị trí
- `styles.css` - CSS cho toàn bộ ứng dụng

## Lưu ý quan trọng

- Dự án này chỉ dùng cho mục đích học tập và nghiên cứu
- Đảm bảo bạn có quyền pháp lý và sự đồng ý khi thu thập thông tin vị trí của người khác
- Dữ liệu được lưu trữ cục bộ trong trình duyệt của bạn và không được gửi đến bất kỳ máy chủ nào

## Yêu cầu kỹ thuật

- Trình duyệt hiện đại hỗ trợ Geolocation API và localStorage
- Hỗ trợ JavaScript ES6
- Kết nối Internet để lấy địa chỉ từ tọa độ

## Cách triển khai

1. Tải toàn bộ mã nguồn
2. Tải lên máy chủ web của bạn hoặc chạy cục bộ
3. Mở file `index.html` trong trình duyệt để bắt đầu sử dụng
4. Thay đổi URL trong mã JavaScript (`app.js`) để phù hợp với tên miền của bạn nếu cần