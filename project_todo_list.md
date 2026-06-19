# Lộ trình Thực thi & Danh sách Công việc (To-Do List)

Để duy trì đà phát triển và áp dụng tinh thần cải tiến liên tục vào dự án, việc phân rã các tính năng lớn thành những mục tiêu nhỏ, có thể đo lường được là vô cùng quan trọng. Dưới đây là danh sách công việc (To-Do List) chi tiết cho các giai đoạn tiếp theo, giúp bạn dễ dàng theo dõi tiến độ và tối ưu hóa hệ thống qua từng bước nhỏ.

## 🔴 Giai đoạn 1: Thông luồng Giao tiếp Client - Server (Ưu tiên Cao nhất)

Đây là bước xác nhận kiến trúc vi dịch vụ của chúng ta đang hoạt động trơn tru từ đầu đến cuối.

* [x] **Thiết lập Axios Client (React):** Tạo file `src/api/axiosClient.ts`, cấu hình `baseURL` trỏ về API Gateway (`http://localhost:8080`).
* [x] **Kiểm thử API Gateway Định tuyến:** Viết một hàm gọi thử API `GET /api/users` từ React và in kết quả ra console để đảm bảo Gateway điều hướng đúng về `user-service`.
* [x] **Xử lý CORS trên API Gateway:** Cấu hình Spring Cloud Gateway cho phép các request từ `http://localhost:5173` (cổng mặc định của Vite) đi qua mà không bị trình duyệt chặn.

---

## 🟡 Giai đoạn 2: Xây dựng Giao diện & Luồng Xác thực (Frontend Focus)

Sau khi API đã thông, đây là lúc định hình trải nghiệm người dùng bám sát cấu trúc của các nền tảng cờ vua chuyên nghiệp.

* [x] **Xây dựng Global Layout:** Sử dụng Tailwind CSS để dựng khung 3 phần cơ bản:
    * `<Sidebar />`: Menu điều hướng dọc, ghim cố định bên trái.
    * `<MainArena />`: Không gian hiển thị linh hoạt ở giữa.
    * `<RightPanel />`: Khối thông tin tĩnh bên phải.
* [ ] **Thiết kế Form Xác thực:** Xây dựng UI cho trang Đăng ký / Đăng nhập (`<Login />`, `<Register />`) với hiệu ứng chuyển cảnh mượt mà.
* [ ] **Tích hợp API Xác thực:** Gắn Axios API gọi về `user-service` để xử lý logic đăng nhập.
* [ ] **Quản lý Client State:** Khởi tạo Zustand store (`useAuthStore`) để lưu trữ an toàn JWT token và thông tin người dùng (Avatar, Tên, ELO) sau khi đăng nhập thành công.

---

## 🔵 Giai đoạn 3: Triển khai Event-Driven Architecture (Backend Focus)

Mở dự án trên môi trường phát triển quen thuộc như IntelliJ IDEA để bắt đầu xử lý các logic nền tảng phức tạp, kết nối các service lại với nhau một cách lỏng lẻo.

* [ ] **Cấu hình Exchange & Queue:** Định nghĩa `payment.exchange`, `course.payment.queue`, và `notification.payment.queue` trong file cấu hình RabbitMQ của các service liên quan.
* [ ] **Payment Producer:** Viết logic trong `payment-service` để khi xử lý IPN MoMo thành công, tự động phát (publish) một `PaymentSuccessEvent` lên RabbitMQ.
* [ ] **Course Consumer:** Tạo `@RabbitListener` trong `course-service` để hứng sự kiện thanh toán, từ đó tự động ghi nhận học viên vào bảng `enrollments`.
* [ ] **Notification Consumer:** Tạo `@RabbitListener` trong `notification-service` để hứng sự kiện và ghi log/thực hiện gửi thông báo giả lập (hoặc email thực) cho người dùng.

---

## 🟢 Giai đoạn 4: Chuẩn bị cho Core Gameplay (Chuẩn bị Dữ liệu)

Trước khi ráp AI vào, chúng ta cần chuẩn bị cơ sở hạ tầng cho việc kết nối thời gian thực.

* [ ] **Khởi tạo WebSocket Configuration:** Setup Spring WebSocket trong `game-service` (`ws://localhost:8080/ws/game`).
* [ ] **Tích hợp Thư viện Cờ vua (Frontend):** Cài đặt `react-chessboard` và `chess.js` vào dự án React để thử nghiệm việc render bàn cờ và di chuyển quân cờ ở môi trường local offline.
