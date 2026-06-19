# Lộ trình Thực thi & Danh sách Công việc (To-Do List)

Danh sách công việc (To-Do List) chi tiết cho dự án VantageChess, giúp theo dõi tiến độ và tối ưu hóa hệ thống.

## 🟢 Giai đoạn 0 & 1: Khởi tạo Hạ tầng & Thông luồng API (Hoàn Thành)

* [x] **Refactor Kiến trúc DB:** Thống nhất dùng 100% PostgreSQL cho toàn bộ 5 Microservices (Polyglot to Monoglot).
* [x] **Docker & Hạ tầng:** Cấu hình `docker-compose.yml` cho Postgres, Redis, RabbitMQ.
* [x] **API Gateway & Swagger:** Gom tài liệu Swagger về cổng `8080`, khắc phục xung đột WebMVC/WebFlux.
* [x] **Data Seeding (Backend):** Sử dụng Spring `CommandLineRunner` nạp tự động dữ liệu giả (Tài khoản, Khóa học) cho `user-service` và `course-service`.

---

## 🟡 Giai đoạn 2: Xây dựng Giao diện & Luồng Xác thực (Hoàn Thành)

* [x] **Thiết lập Frontend & Design System:** Tích hợp Figma MCP Server, dựng khung React + Tailwind CSS phong cách VantageChess.
* [x] **Xây dựng Global Layout:** Hoàn thiện `<Sidebar />`, `<MainArena />` (Bàn cờ, đồng hồ), `<RightPanel />`.
* [x] **Thiết kế Form Xác thực:** Xây dựng UI Đăng ký / Đăng nhập (`<Login />`, `<Register />`) kết hợp hiệu ứng `framer-motion`.
* [x] **Quản lý Client State & Routing:** Cài đặt `react-router-dom`, khởi tạo Zustand store (`useAuthStore`).
* [x] **Tích hợp API Xác thực thực tế:** Chuyển đổi mock login sang gọi API POST thật từ `user-service` qua Axios.
* [x] **Xây dựng Trang Chủ (Home):** Hiển thị Dashboard, Biểu đồ ELO, và danh sách Khóa Học bám sát prototype.

---

## 🔵 Giai đoạn 3: Triển khai Event-Driven Architecture (Hoàn Thành)

* [x] **Cấu hình Exchange & Queue:** Định nghĩa `payment.exchange`, `course.payment.queue` trong cấu hình RabbitMQ.
* [x] **Payment Producer:** Khi xử lý IPN MoMo thành công, tự động publish `PaymentSuccessEvent` lên RabbitMQ.
* [x] **Course Consumer:** Tạo `@RabbitListener` trong `course-service` hứng sự kiện và ghi nhận học viên vào bảng `enrollments`.
* [x] **Notification Consumer:** Hứng sự kiện để gửi thông báo in-app/email cho người dùng.

---

## 🟣 Giai đoạn 4: Core Gameplay & Realtime (Game Focus)

* [ ] **Khởi tạo WebSocket Configuration:** Cấu hình Spring WebFlux WebSocket hoặc STOMP trong `game-service` (`ws://localhost:8080/ws/game`).
* [ ] **Tích hợp Thư viện Cờ vua (Frontend):** Cài đặt `react-chessboard` và `chess.js` vào dự án React để quản lý logic di chuyển, kiểm tra chiếu tướng (Checkmate) ngay tại Client.
* [ ] **Đồng bộ trạng thái Ván đấu:** Thiết lập luồng gửi/nhận nước đi (Move) qua WebSocket giữa 2 người chơi. Lưu trữ FEN và PGN liên tục vào Redis / PostgreSQL.
* [ ] **Hệ thống Matchmaking:** Tạo hàng đợi tìm trận dựa trên ELO sử dụng Redis (Matchmaking Queue).
* [ ] **Tích hợp Stockfish AI:** Tải và chạy Stockfish engine trên backend để phục vụ chế độ đấu PvE (Người vs Máy).

---

## 🟠 Giai đoạn 5: Hệ sinh thái Khóa Học & Cổng Thanh Toán (Features)

* [ ] **Quản lý Khóa Học & Video:** Xây dựng UI danh sách khóa học, hệ thống phát video bài giảng cho các học viên đã mua (`enrollments`).
* [ ] **Tích hợp Thanh toán MoMo:** Xây dựng luồng tạo mã QR thanh toán (Create Order) và cấu hình Ngrok để nhận IPN từ MoMo.
* [ ] **Nghiệm thu RabbitMQ:** Đảm bảo luồng MoMo IPN -> Payment -> RabbitMQ -> Course/Notification hoạt động không độ trễ.

---

## 🧪 Giai đoạn 6: Quality Assurance & Testing (Kiểm Thử Toàn Diện)

* [ ] **Unit Testing (Backend):** Viết test cho các Service quan trọng (như `UserService`, `PaymentService`, `GameLogic`) sử dụng **JUnit 5** và **Mockito**. Mục tiêu: Độ phủ code (Coverage) > 80%.
* [ ] **Integration Testing (Backend):** Sử dụng **Testcontainers** để dựng Docker tạm thời cho PostgreSQL, Redis, RabbitMQ. Test luồng tương tác DB thực tế thay vì mock.
* [ ] **Frontend Testing:** Tích hợp **Vitest** và **React Testing Library**. Viết test case cho các component phức tạp: Bàn cờ (Kéo thả), Giỏ hàng khóa học, và Form Đăng nhập.
* [ ] **End-to-End Testing (E2E):** Sử dụng **Cypress** hoặc Playwright viết kịch bản giả lập người dùng thật: *Đăng nhập -> Click tìm trận -> Đi 3 nước cờ -> Nhận thông báo Checkmate*.
* [ ] **Load Testing (Thử tải):** Dùng công cụ **k6** hoặc **JMeter** bắn thử 5,000 - 10,000 CCU (Connections) đồng thời vào WebSocket Gateway để kiểm tra giới hạn chịu đựng của Server.

---

## 🔴 Giai đoạn 7: Ánh xạ Mobile & Triển khai CI/CD (Production)

* [ ] **Ánh xạ UI E-sports sang Flutter Mobile:** Tạo app mobile độc lập dùng codebase Dart kết nối chung với bộ API Backend hiện tại.
* [ ] **CI/CD Pipeline:** Thiết lập GitHub Actions tự động chạy Unit Test, Build Docker Image và Push lên Docker Hub.
* [ ] **Triển khai Đám mây (Deployment):** Setup Kubernetes (K8s) hoặc Docker Swarm trên VPS thật (AWS / DigitalOcean) để đưa dự án ra Internet.
