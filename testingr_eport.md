# Báo Cáo Kiểm Kê API Endpoints — Chess Platform

> Tổng hợp **17 API endpoints** trên toàn bộ 5 Microservices.
> Trạng thái: ✅ Đã test thực tế | ⚠️ Chưa test

---

## 1. User Service (`/api/users` — Port 8081)

| # | Method | Endpoint | Mô tả | Trạng thái |
|:--|:-------|:---------|:-------|:-----------|
| 1 | `GET` | `/api/users` | Lấy danh sách tất cả users | ✅ Đã test thực tế |
| 2 | `GET` | `/api/users/{id}` | Lấy thông tin 1 user theo UUID | ✅ Đã test thực tế |
| 3 | `POST` | `/api/users` | Đăng ký tài khoản mới (CreateUserRequest) | ✅ Đã kết nối Frontend `Register.tsx` |
| 4 | `POST` | `/api/users/login` | Đăng nhập (LoginRequest → LoginResponse) | ✅ Đã kết nối Frontend `Login.tsx` |

---

## 2. Course Service (`/api/courses` — Port 8082)

| # | Method | Endpoint | Mô tả | Trạng thái |
|:--|:-------|:---------|:-------|:-----------|
| 5 | `GET` | `/api/courses` | Lấy danh sách tất cả khóa học | ✅ Đã test thực tế |
| 6 | `GET` | `/api/courses/{id}` | Lấy chi tiết 1 khóa học theo UUID | ✅ Đã test thực tế |
| 7 | `POST` | `/api/courses` | Tạo khóa học mới | ✅ Đã test thực tế |

> [!NOTE]
> `course-service` cũng có **RabbitMQ Consumer** (`PaymentEventListener`) lắng nghe `course.payment.queue` để tự động tạo Enrollment. Đây không phải HTTP API nhưng cũng chưa được test luồng thật.

---

## 3. Payment Service (`/api/payments` — Port 8083)

| # | Method | Endpoint | Mô tả | Trạng thái |
|:--|:-------|:---------|:-------|:-----------|
| 8 | `GET` | `/api/payments` | Lấy danh sách đơn thanh toán | ⚠️ Chưa test |
| 9 | `GET` | `/api/payments/{id}` | Lấy chi tiết 1 đơn thanh toán theo UUID | ⚠️ Chưa test |
| 10 | `POST` | `/api/payments` | Tạo đơn thanh toán mới | ⚠️ Chưa test |

> [!NOTE]
> `PaymentService.processPaymentSuccess()` (phát sóng `PaymentSuccessEvent` lên RabbitMQ) hiện chỉ là hàm service nội bộ, **chưa có endpoint HTTP** expose ra ngoài. Cần bổ sung endpoint callback cho MoMo IPN.

---

## 4. Game Service (`/api/games` — Port 8084)

| # | Method | Endpoint | Mô tả | Trạng thái |
|:--|:-------|:---------|:-------|:-----------|
| 11 | `GET` | `/api/games` | Lấy danh sách các ván đấu | ⚠️ Chưa test |
| 12 | `GET` | `/api/games/{id}` | Lấy chi tiết 1 ván đấu theo UUID | ⚠️ Chưa test |
| 13 | `POST` | `/api/games` | Tạo ván đấu mới | ⚠️ Chưa test |

**WebSocket Endpoints (STOMP):**

| # | Type | Destination | Mô tả | Trạng thái |
|:--|:-----|:------------|:-------|:-----------|
| 14 | `CONNECT` | `ws://localhost:8084/ws/game` | Handshake kết nối WebSocket (SockJS) | ⚠️ Chưa test |
| 15 | `SEND` | `/app/game.move` | Client gửi nước đi lên Server | ⚠️ Chưa test |
| 16 | `SUBSCRIBE` | `/topic/match/{matchId}` | Client đăng ký nhận diễn biến ván đấu | ⚠️ Chưa test |

---

## 5. Notification Service (`/api/notifications` — Port 8085)

| # | Method | Endpoint | Mô tả | Trạng thái |
|:--|:-------|:---------|:-------|:-----------|
| 17 | `GET` | `/api/notifications` | Lấy danh sách thông báo | ⚠️ Chưa test |
| 18 | `GET` | `/api/notifications/{id}` | Lấy chi tiết 1 thông báo theo UUID | ⚠️ Chưa test |
| 19 | `POST` | `/api/notifications` | Tạo thông báo mới | ⚠️ Chưa test |

> [!NOTE]
> `notification-service` cũng có **RabbitMQ Consumer** (`PaymentNotificationListener`) lắng nghe `notification.payment.queue`. Chưa được test luồng thật.

---

## Tổng Kết

| Metric | Số lượng |
|:-------|:---------|
| **Tổng API HTTP** | 16 endpoints |
| **Tổng WebSocket** | 3 destinations |
| ✅ **Đã test thực tế** | **7** (4 User + 3 Course) |
| ⚠️ **Chưa test** | **9 HTTP + 3 WebSocket = 12** |
| **Tỷ lệ coverage** | ~36.8% |

> [!WARNING]
> Hiện tại có **7/19** endpoints (~37%) đã được test thực tế qua Frontend và Swagger UI. Còn lại Payment, Game, Notification và WebSocket chưa được test.

---

## Chiến Lược Kiểm Thử 4 Cấp Độ

### 🔴 Cấp độ 1: Tự động hóa API cục bộ (Quick Wins)

Mục tiêu: Test nhanh 14 endpoint HTTP bị bỏ ngỏ bằng file `.http` chạy trực tiếp trong IDE.

**Đã tạo sẵn các file test tại thư mục `tests/`:**

| File | Service | Số endpoint |
|:-----|:--------|:------------|
| [`user-api.http`](file:///d:/THAYDAUIEU/tests/user-api.http) | User Service | 4 (GET all, GET by ID, POST register, POST login) |
| [`course-api.http`](file:///d:/THAYDAUIEU/tests/course-api.http) | Course Service | 3 (GET all, GET by ID, POST create) |
| [`payment-api.http`](file:///d:/THAYDAUIEU/tests/payment-api.http) | Payment Service | 3 (GET all, GET by ID, POST create) |
| [`game-api.http`](file:///d:/THAYDAUIEU/tests/game-api.http) | Game Service | 3 HTTP + hướng dẫn WebSocket |
| [`notification-api.http`](file:///d:/THAYDAUIEU/tests/notification-api.http) | Notification Service | 3 (GET all, GET by ID, POST create) |
| [`http-client.env.json`](file:///d:/THAYDAUIEU/tests/http-client.env.json) | Biến môi trường | Chứa các UUID placeholder |

**Cách sử dụng:**
1. Mở file `.http` trong IntelliJ IDEA / VS Code (cài REST Client extension).
2. Click vào nút ▶ (Run) bên cạnh từng request.
3. Sau khi chạy `GET /api/users`, copy UUID thật điền vào `http-client.env.json` để test `GET by ID`.

---

### 🟡 Cấp độ 2: Integration Test cho Microservices & RabbitMQ

Mục tiêu: Test logic nghiệp vụ phụ thuộc DB và Message Queue bằng môi trường Docker thật.

**Công cụ:**
- **Testcontainers** — Tự động spin-up PostgreSQL + RabbitMQ container khi chạy test, tự xóa sau khi xong.
- **Spring Boot Test + @AutoConfigureMockMvc** — Giả lập HTTP request gọi vào Controller.
- **Mockito** — Mock các lời gọi cross-service.

**Kịch bản ưu tiên:**
1. `UserServiceTest`: Test luồng đăng ký → kiểm tra BCrypt password hash → test đăng nhập.
2. `PaymentServiceTest`: Test luồng `processPaymentSuccess` → verify `PaymentSuccessEvent` được publish lên RabbitMQ.
3. `PaymentEventListenerTest`: Gửi mock event → verify Enrollment được tạo trong DB.

---

### 🔵 Cấp độ 3: End-to-End Testing (Frontend)

Mục tiêu: Giả lập hành vi người dùng thật trên trình duyệt.

**Công cụ:** Cypress hoặc Playwright (TypeScript).

**Kịch bản E2E ưu tiên:**
1. *Luồng Xác thực:* Mở `/register` → Điền form → Submit → Redirect về `/home` → Kiểm tra Sidebar hiển thị username.
2. *Luồng Khóa học:* Đăng nhập → Vào trang Courses → Click mua → Thanh toán → Kiểm tra khóa học xuất hiện trong "Khóa học của tôi".
3. *Luồng Chơi cờ:* Đăng nhập → Click "Quick Play" → Bàn cờ render → Kéo thả 1 nước cờ → Kiểm tra FEN cập nhật.

---

### 🟢 Cấp độ 4: Test WebSocket (Game Service)

Mục tiêu: Kiểm tra kết nối hai chiều real-time.

**Test thủ công (Postman):**
1. Mở Postman → New → WebSocket Request.
2. Kết nối tới `ws://localhost:8084/ws/game`.
3. Subscribe kênh `/topic/match/test-match-001`.
4. Gửi payload JSON tới `/app/game.move`.
5. Xác nhận echo trả về đúng kênh.

**Test tự động (Java):**
- Dùng `WebSocketStompClient` trong Spring Boot Test.
- Giả lập 2 client (White & Black) cùng kết nối.
- Gửi nước đi qua lại và verify cả 2 nhận được broadcast.

