# Cấu trúc Cơ sở dữ liệu (Database Schema)

Tài liệu này mô tả chi tiết cách thức cấu hình và các bảng dữ liệu (Tables) trong PostgreSQL của dự án Chess Platform.

## 1. Khởi tạo Database

Dự án sử dụng cơ chế tự động tạo cơ sở dữ liệu qua **Docker Compose**. 
Trong file `docker-compose.yml`, chúng ta đã định nghĩa biến môi trường:
```yaml
POSTGRES_USER: root
POSTGRES_PASSWORD: rootpassword
POSTGRES_DB: chess_db
```
Do đó, ngay khi chạy lệnh `docker compose up -d`, PostgreSQL sẽ tự động tạo một cơ sở dữ liệu mang tên **`chess_db`**.
Tất cả 5 Microservices đều kết nối chung vào `chess_db` thông qua URL: `jdbc:postgresql://localhost:5432/chess_db`. 
(Trong thực tế môi trường Production, mỗi service nên có một logical database riêng hoặc schema riêng, nhưng ở môi trường dev, chúng được lưu chung vào `chess_db`).

Cấu hình `spring.jpa.hibernate.ddl-auto: update` trong `application.yml` của các services đảm bảo các bảng (tables) tự động được tạo ra (hoặc cập nhật) dựa trên định nghĩa Java Entity.

---

## 2. Chi tiết các Bảng và Thuộc tính (Tables & Attributes)

Dưới đây là danh sách các bảng (tables) được tạo ra bởi từng Microservice. Tất cả các ID (khóa chính) trong hệ thống đều sử dụng kiểu `UUID` để đảm bảo tính phân tán duy nhất.

### 2.1. User Service (Dịch vụ Người dùng)

**Bảng `users`**
Quản lý thông tin đăng nhập, hồ sơ và điểm ELO.
- `id` (UUID, PK): Khóa chính.
- `username` (VARCHAR, Unique, Not Null): Tên đăng nhập.
- `email` (VARCHAR, Unique, Not Null): Địa chỉ email.
- `password` (VARCHAR, Not Null): Mật khẩu (đã mã hóa).
- `elo_rating` (INTEGER): Điểm ELO của người chơi (Mặc định: 1200).
- `role_id` (UUID, FK): Khóa ngoại chỉ tới bảng `roles`.
- `created_at` (TIMESTAMP): Thời gian tạo tài khoản.

**Bảng `roles`**
Lưu trữ các quyền hạn (Role-based Access Control).
- `id` (UUID, PK): Khóa chính.
- `name` (VARCHAR, Unique, Not Null): Tên quyền (VD: ROLE_USER, ROLE_ADMIN).

---

### 2.2. Course Service (Dịch vụ Khóa học)

**Bảng `courses`**
Thông tin các khóa học cờ vua.
- `id` (UUID, PK): Khóa chính.
- `title` (VARCHAR, Not Null): Tên khóa học.
- `description` (TEXT): Mô tả khóa học.
- `price` (NUMERIC, Not Null): Giá bán (Mặc định: 0).
- `thumbnail_url` (VARCHAR): Link ảnh bìa.
- `created_at` (TIMESTAMP): Thời gian tạo.

**Bảng `lessons`**
Quản lý các bài giảng/bài tập thuộc về một khóa học.
- `id` (UUID, PK): Khóa chính.
- `course_id` (UUID, Not Null): Khóa ngoại (logical). **[Đã Index]**
- `title` (VARCHAR, Not Null): Tên bài học.
- `video_url` (VARCHAR): Link video.
- `order_index` (INTEGER, Not Null): Thứ tự bài học.
- `type` (VARCHAR, Enum, Not Null): Loại bài học (VIDEO, PUZZLE, TEXT).

**Bảng `enrollments`**
Bảng quản lý việc ghi danh khóa học của học viên.
- `id` (UUID, PK): Khóa chính.
- `user_id` (UUID, Not Null): ID của học viên. **[Đã Index]**
- `course_id` (UUID, Not Null): ID của khóa học.
- `enrolled_at` (TIMESTAMP, Not Null): Thời gian ghi danh.
- `status` (VARCHAR, Enum, Not Null): Trạng thái (ACTIVE, COMPLETED, CANCELLED).
*(Ràng buộc: `UNIQUE(user_id, course_id)` để đảm bảo một user chỉ được mua một khóa học duy nhất)*

---

### 2.3. Payment Service (Dịch vụ Thanh toán)

**Bảng `payment_orders`**
Lưu trữ thông tin các giao dịch mua khóa học/nạp tiền.
- `id` (UUID, PK): Khóa chính.
- `momo_order_id` (VARCHAR, Unique, Not Null): Mã giao dịch hệ thống sinh ra.
- `momo_trans_id` (VARCHAR): Mã giao dịch thực tế từ MoMo trả về (Dùng cho đối soát kế toán/Refund).
- `user_id` (UUID, Not Null): ID của người thanh toán.
- `course_id` (UUID, Not Null): ID của khóa học đang được mua.
- `amount` (NUMERIC(12,2), Not Null): Số tiền thanh toán (Chính xác đến 2 chữ số thập phân).
- `extra_data` (JSONB): Toàn bộ log raw từ MoMo (Đề phòng tranh chấp giao dịch).
- `status` (VARCHAR, Enum, Not Null): Trạng thái (PENDING, SUCCESS, FAILED).
- `created_at` (TIMESTAMP): Thời điểm tạo đơn.
- `updated_at` (TIMESTAMP): Thời điểm cập nhật cuối cùng.

---

### 2.4. Game Service (Dịch vụ Ván đấu)

**Bảng `game_matches`**
Quản lý trạng thái và nước đi của một ván cờ.
- `id` (UUID, PK): Khóa chính.
- `white_player_id` (UUID): ID của người cầm quân Trắng.
- `black_player_id` (UUID): ID của người cầm quân Đen.
- `pgn` (TEXT): Lịch sử các nước đi (Lưu ý: Chỉ ghi xuống PostgreSQL khi ván cờ đã COMPLETED, trạng thái LIVE được lưu trên Redis để tránh nghẽn I/O).
- `fen` (VARCHAR): Trạng thái bàn cờ hiện tại.
- `status` (VARCHAR, Enum, Not Null): Trạng thái ván đấu (WAITING, PLAYING, COMPLETED, ABORTED).
- `start_time` (TIMESTAMP): Thời điểm bắt đầu.
- `end_time` (TIMESTAMP): Thời điểm kết thúc.

---

### 2.5. Notification Service (Dịch vụ Thông báo)

**Bảng `notifications`**
Ghi nhận các thông báo hệ thống gửi đến người dùng.
- `id` (UUID, PK): Khóa chính.
- `user_id` (UUID, Not Null): ID của người nhận thông báo. **[Đã Index]**
- `title` (VARCHAR): Tiêu đề thông báo.
- `message` (TEXT): Nội dung thông báo.
- `type` (VARCHAR, Enum, Not Null): Loại thông báo.
- `is_read` (BOOLEAN, Not Null): Đã đọc hay chưa.
- `created_at` (TIMESTAMP): Thời điểm tạo thông báo.

---

## 3. Quy Trình Vận Hành (DevOps Note)
Việc sử dụng `ddl-auto: update` rất tiện trong môi trường phát triển (Dev) để tự động ánh xạ cấu trúc từ Java Entity xuống Postgres. Tuy nhiên, `update` không thể xóa cột hoặc đổi tên cột an toàn (sẽ sinh ra cột mới và bỏ hoang cột cũ).
**Chiến lược dài hạn:** Trong các Phase sau (đặc biệt khi lên Production), hệ thống sẽ cần chuyển đổi sang sử dụng **Flyway** hoặc **Liquibase** để quản lý phiên bản database (Database Migration) nhằm kiểm soát tuyệt đối cấu trúc lược đồ dữ liệu.
