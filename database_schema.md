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
- `course_id` (UUID, Not Null): Khóa ngoại (logical) chỉ định khóa học chứa bài giảng này.
- `title` (VARCHAR, Not Null): Tên bài học.
- `video_url` (VARCHAR): Link video (nếu là bài giảng video).
- `order_index` (INTEGER, Not Null): Thứ tự bài học trong danh sách khóa học.
- `type` (VARCHAR, Enum, Not Null): Loại bài học (VIDEO, PUZZLE, TEXT).

**Bảng `enrollments`**
Bảng trung gian quản lý việc ghi danh khóa học của học viên.
- `id` (UUID, PK): Khóa chính.
- `user_id` (UUID, Not Null): ID của học viên.
- `course_id` (UUID, Not Null): ID của khóa học.
- `enrolled_at` (TIMESTAMP, Not Null): Thời gian ghi danh.
- `status` (VARCHAR, Enum, Not Null): Trạng thái học (ACTIVE, COMPLETED, CANCELLED).

---

### 2.3. Payment Service (Dịch vụ Thanh toán)

**Bảng `payment_orders`**
Lưu trữ thông tin các giao dịch mua khóa học/nạp tiền.
- `id` (UUID, PK): Khóa chính.
- `momo_order_id` (VARCHAR, Unique, Not Null): Mã giao dịch sinh ra cho MoMo.
- `user_id` (UUID, Not Null): ID của người thanh toán.
- `course_id` (UUID, Not Null): ID của khóa học đang được mua.
- `amount` (NUMERIC, Not Null): Số tiền thanh toán.
- `status` (VARCHAR, Enum, Not Null): Trạng thái giao dịch (PENDING, SUCCESS, FAILED).
- `created_at` (TIMESTAMP): Thời điểm tạo đơn.
- `updated_at` (TIMESTAMP): Thời điểm cập nhật cuối cùng (khi MoMo gửi callback).

---

### 2.4. Game Service (Dịch vụ Ván đấu)

**Bảng `game_matches`**
Quản lý trạng thái và nước đi của một ván cờ.
- `id` (UUID, PK): Khóa chính của ván đấu.
- `white_player_id` (UUID): ID của người cầm quân Trắng.
- `black_player_id` (UUID): ID của người cầm quân Đen.
- `pgn` (TEXT): Chuỗi Portable Game Notation (Lịch sử các nước đi của ván cờ).
- `fen` (VARCHAR): Forsyth-Edwards Notation (Trạng thái bàn cờ hiện tại).
- `status` (VARCHAR, Enum, Not Null): Trạng thái ván đấu (WAITING, PLAYING, COMPLETED, ABORTED).
- `start_time` (TIMESTAMP): Thời điểm bắt đầu đánh.
- `end_time` (TIMESTAMP): Thời điểm kết thúc ván.

---

### 2.5. Notification Service (Dịch vụ Thông báo)

**Bảng `notifications`**
Ghi nhận các thông báo hệ thống gửi đến người dùng.
- `id` (UUID, PK): Khóa chính.
- `user_id` (UUID, Not Null): ID của người nhận thông báo.
- `title` (VARCHAR): Tiêu đề thông báo.
- `message` (TEXT): Nội dung thông báo.
- `type` (VARCHAR, Enum, Not Null): Loại thông báo (SYSTEM, PROMOTIONAL, GAME_INVITE, PAYMENT_ALERT).
- `is_read` (BOOLEAN, Not Null): Đã đọc hay chưa (Mặc định: false).
- `created_at` (TIMESTAMP): Thời điểm tạo thông báo.
