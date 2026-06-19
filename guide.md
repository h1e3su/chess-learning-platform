# Hướng Dẫn Toàn Tập Dự Án Chess Platform

> **Mục đích tài liệu:** Tài liệu này là cuốn cẩm nang toàn diện ghi chép lại kiến trúc, cách cài đặt, cách thức hoạt động của từng thành phần, danh sách các công việc đã/đang thực hiện (Log/Roadmap), và đặc biệt là cuốn "sổ tay" lưu lại các lỗi (bugs) hóc búa kèm cách khắc phục để tránh lặp lại trong tương lai.

---

## 1. Kiến Trúc & Port Mapping

Dự án áp dụng kiến trúc Microservices phân tán sử dụng Spring Boot, Spring Cloud (Eureka, Gateway), cơ sở dữ liệu PostgreSQL, Redis và RabbitMQ.

### 1.1. Danh sách Port tĩnh
Việc quản lý port cực kỳ quan trọng để tránh xung đột trên máy local. Dưới đây là bảng quy hoạch:

| Dịch vụ (Service) | Loại | Port | Trách nhiệm cốt lõi |
| :--- | :--- | :--- | :--- |
| **PostgreSQL** | Infrastructure | `5432` | Cơ sở dữ liệu chính. Sử dụng chung một instance nhưng tạo Schema/Logical DB riêng biệt cho từng service. |
| **Redis** | Infrastructure | `6379` | Cache siêu tốc hỗ trợ Game Match, Leaderboard. |
| **RabbitMQ** | Infrastructure | `5672` / `15672`| Xử lý Message/Event (Giao diện Admin ở port 15672). |
| **Eureka Server** | Service Registry | `8761` | Đóng vai trò danh bạ, giúp các service tìm thấy nhau. |
| **API Gateway** | Gateway | `8080` | Bộ điều phối trung tâm. Điểm vào DUY NHẤT cho mọi request từ Frontend. Bao gồm cấu hình Global CORS và Centralized Swagger. |
| **User Service** | Microservice | `8081` | Quản lý tài khoản, ELO. Cung cấp API `GET /api/users`. |
| **Course Service** | Microservice | `8082` | Quản lý khóa học, puzzle, bài giảng. Cung cấp API `GET /api/courses`. |
| **Payment Service**| Microservice | `8083` | Tích hợp MoMo, quản lý giao dịch. Cung cấp API `GET /api/payments`. |
| **Game Service** | Microservice | `8084` | Quản lý ván đấu, WebSocket, Stockfish AI. Cung cấp API `GET /api/games`. |
| **Notification** | Microservice | `8085` | Thông báo In-app và Email. Cung cấp API `GET /api/notifications`. |
| **React Frontend** | Client UI | `5173` | Giao diện Web. Được xây dựng bằng Vite + React + TS. |

---

## 2. Hướng Dẫn Cài Đặt và Vận Hành (Setup & Run Guide)

### 2.1. Yêu cầu hệ thống
- Java 17+ (Dành cho Backend)
- Maven 3.8+ (Công cụ build)
- Docker & Docker Compose (Dành cho Infrastructure)
- Node.js 18+ (Dành cho Frontend)

### 2.2. Trình tự khởi chạy

**Bước 1: Khởi chạy Hạ tầng (Docker)**
Mở terminal tại thư mục gốc dự án (nơi có file `docker-compose.yml`) và gõ:
```bash
docker compose up -d
```
> Tác dụng: Lệnh này sẽ kéo image của Postgres, Redis, RabbitMQ và khởi động chúng trong nền.
> Tài khoản mặc định Postgres: `root` / `rootpassword`.

**Bước 2: Build & Khởi động Backend**
Thay vì phải mở từng terminal thủ công, hệ thống đã được tích hợp sẵn script tự động chạy tất cả microservices theo đúng trình tự bắt buộc.

1. Mở terminal (PowerShell) tại thư mục `chess-backend`.
2. Chạy script tự động:
   ```powershell
   .\start-all.ps1
   ```
> Tác dụng: Script sẽ tự động mở từng cửa sổ PowerShell mới để chạy `mvn spring-boot:run` cho từng service với thời gian chờ hợp lý (`eureka-server` chạy trước 15s).

**Bước 3: Khởi chạy Frontend**
Mở terminal tại thư mục `frontend`:
```bash
npm install
npm run dev
```

### 2.3. Hướng dẫn xem dữ liệu Database (PostgreSQL)
Để xem dữ liệu đang chạy ngầm trong Docker, bạn dùng phần mềm (VS Code Database Client, DBeaver, TablePlus...) với cấu hình sau:
- **Server Type**: Bắt buộc chọn **PostgreSQL** (cảnh báo: không chọn nhầm MySQL).
- **Host**: `127.0.0.1` (hoặc `localhost`)
- **Port**: `5433` (Đây là cổng public ra ngoài của Docker, không dùng cổng nội bộ 5432).
- **Database**: `chess_db`
- **Username**: `root`
- **Password**: `rootpassword`

*(Hoặc xem nhanh bằng dòng lệnh: `docker exec -it chess_postgres psql -U root -d chess_db`)*

---

## 3. Cách Thức Hoạt Động (How It Works)

### 3.1. Cơ chế API Gateway & Centralized Swagger
Hệ thống không yêu cầu Client phải nhớ các port `8081` đến `8085`.
- Khi React gọi URL `http://localhost:8080/api/users`, API Gateway sẽ tra cứu trong **Eureka Server** để tìm IP và Port thực sự của `user-service` và điều hướng request tới đó.
- Nhờ vậy, **Swagger UI** cũng được cấu hình tập trung. Bạn chỉ cần vào **`http://localhost:8080/swagger-ui.html`**, API Gateway sẽ kéo tài liệu OpenAPI dạng JSON từ `/v3/api-docs` của từng service con và hiển thị chung vào một giao diện thả xuống (dropdown) rất mượt.

### 3.2. Kết nối với Figma qua MCP Server (Mới)
Để tích hợp các file thiết kế UI/UX từ Figma trực tiếp vào IDE, chúng ta sử dụng công nghệ Model Context Protocol (MCP).
1. **Lấy Token Figma:** Vào Figma -> Nhấn vào Avatar góc phải trên -> Settings -> Thẻ "Personal Access Tokens" -> Generate new token (Ví dụ đặt tên là `IDE-MCP`) -> Copy dãy mã.
2. **Cấu hình MCP Server vào IDE:** 
   Thêm đoạn JSON sau vào phần cài đặt MCP (MCP Servers config) của IDE, thay thế `YOUR-KEY` bằng token vừa copy:
   ```json
   {
     "mcpServers": {
       "Framelink MCP for Figma": {
         "command": "npx",
         "args": [
           "-y",
           "figma-developer-mcp",
           "--figma-api-key=YOUR-KEY",
           "--stdio"
         ]
       }
     }
   }
   ```
3. Cấu hình này giúp công cụ AI có thể đọc bản vẽ Figma và tự động code UI chuẩn xác.

### 3.3. Quản lý State với Zustand và Lưu trữ Token (Frontend)
**Zustand là gì?**
Zustand (tiếng Đức nghĩa là "trạng thái") là một thư viện quản lý trạng thái (State Management) cực kỳ nhỏ gọn, đơn giản và nhanh chóng dành cho React. Nó thay thế cho các giải pháp cồng kềnh như Redux hay Context API phức tạp, giúp các component ở nhiều nơi khác nhau (như Sidebar, Navbar, Route Guard) có thể đọc và ghi chung một nguồn dữ liệu (như thông tin `User`, trạng thái đăng nhập) mà không cần truyền props rườm rà.

**Tại sao Token lại được kết hợp lưu vào trong Zustand?**
1. **Chia sẻ toàn cục dễ dàng:** Bất kỳ đâu trong ứng dụng (kể cả file cấu hình `axiosClient`) cũng có thể lấy được Token thông qua store Zustand để tự động gắn vào Header `Authorization` khi gửi API lên Backend.
2. **Kết hợp Persist (Lưu trữ bền vững):** Trong dự án này, Zustand được tích hợp middleware `persist`. Nhờ đó, trạng thái `user` và `token` không chỉ nằm trong bộ nhớ RAM mà còn được **tự động đồng bộ xuống Local Storage** của trình duyệt web. 
   - **Lợi ích tối thượng:** Khi người dùng ấn F5 (tải lại trang) hoặc tắt trình duyệt đi mở lại, mã Token từ Local Storage sẽ được Zustand tự động bơm lại lên Store. Nhờ vậy, người dùng không bị văng ra trang Login và vẫn duy trì được phiên đăng nhập.

---

## 4. Nhật Ký (Changelog)

Dưới đây là nhật ký phát triển ghi nhận các cột mốc quan trọng từ lúc khởi tạo dự án:

### 4.1. Giai đoạn Khởi tạo (Phase 0: Project Setup)
- Khởi tạo kiến trúc Microservices (Eureka Server, API Gateway, User, Course, Payment, Game, Notification).
- Cấu hình hạ tầng Docker Compose (PostgreSQL, Redis, RabbitMQ).
- Hoàn tất Refactor Database từ MongoDB sang 100% PostgreSQL (Polyglot to Monoglot).

### 4.2. Giai đoạn 1: API & API Gateway (Phase 1)
- Xây dựng API cơ bản (CRUD) cho toàn bộ 5 microservices.
- Thiết lập Centralized Swagger trên API Gateway (port 8080).
- Khắc phục lỗi xung đột WebMVC/WebFlux và xử lý CORS toàn cục.

### 4.3. Giai đoạn 2: Giao diện & Luồng Xác thực (Phase 2)
- Thiết lập Frontend React (Vite + TS + Tailwind CSS).
- Tạo `uibuild.md` chuẩn hóa Design System (VantageChess style: Glassmorphism, Dark mode, Neon gradients).
- Hoàn thiện Global Layout gồm Sidebar, MainArena (Bàn cờ, đồng hồ đếm ngược) và RightPanel (Lịch sử nước đi, tabs).
- Tích hợp `react-router-dom` bảo vệ các route người dùng.
- Xây dựng form Đăng nhập (Login) / Đăng ký (Register) kết hợp hiệu ứng `framer-motion`.
- Tích hợp `zustand` quản lý trạng thái xác thực (`useAuthStore`).
- Thiết lập kết nối Axios Client ban đầu (`authApi.ts`).

### 4.4. Cấu hình Data Seeding (Backend)
- Cài đặt component `DataSeeder` (dùng `CommandLineRunner`) cho `user-service` và `course-service`.
- Tận dụng Hibernate `ddl-auto: update` tự tạo bảng và tự động bơm mock data (Tài khoản, Khóa học) ở môi trường Dev.

### 4.5. Danh sách Bugs & Fixes (Bugs Log)

Dưới đây là những "bài học xương máu" đã gặp phải và cách xử lý:

### 🐛 Bug 1: Lỗi Authentication PostgreSQL (`FATAL: password authentication failed for user "root"`)
- **Mô tả:** Khi chạy các microservices, Spring Boot liên tục báo lỗi không thể kết nối tới DB bằng tài khoản `root`.
- **Nguyên nhân:** Dù đã sửa `POSTGRES_USER=root` trong `docker-compose.yml`, nhưng Docker volume của Postgres đã lưu vết thông tin cấu hình cũ (chưa có tài khoản này) ở lần khởi chạy đầu tiên. Khi `docker compose up` lại, nó không tạo lại user.
- **Cách khắc phục triệt để:** Cần phải xóa sạch volume cũ bằng lệnh:
  ```bash
  docker compose down -v
  docker compose up -d
  ```

### 🐛 Bug 2: Gateway bị Crash vì đụng độ WebMVC và WebFlux (Class Conflict)
- **Mô tả:** API Gateway không thể khởi động được sau khi thêm thư viện Swagger vào Parent POM. Lỗi báo Spring Boot không xác định được nên dùng Server Tomcat (Blocking) hay Netty (Non-blocking).
- **Nguyên nhân:** Thư viện `springdoc-openapi-starter-webmvc-ui` chứa các class của WebMVC. Vì khai báo ở Parent POM, `api-gateway` kế thừa nó, gây xung đột trực tiếp với lõi WebFlux mặc định của Spring Cloud Gateway.
- **Cách khắc phục:**
  1. Xóa thư viện đó khỏi `pom.xml` cha.
  2. Bỏ thư viện `webmvc` thủ công vào từng service con (`user`, `course`, v.v.).
  3. Sử dụng phiên bản `springdoc-openapi-starter-webflux-ui` cài riêng cho `api-gateway`.

### 🐛 Bug 3: Nhầm lẫn `localhost` và Tên container (`db`) khi kết nối Database
- **Mô tả:** Khi kết nối Java với PostgreSQL trong Docker, nếu dùng `url: jdbc:postgresql://db:5432/chess_db` thì Java báo lỗi `Unknown Host`.
- **Nguyên nhân:** Do các Microservices Java đang được chạy bằng lệnh `mvn spring-boot:run` (chạy trực tiếp trên hệ điều hành Windows), chứ KHÔNG bị nhốt trong Docker. Việc gọi `db` chỉ hoạt động trong mạng nội bộ của Docker. Còn với Windows, Docker đã mở cổng `5432` ra ngoài, nên máy ảo Docker chính là `localhost`.
- **Cách khắc phục:** 
  Luôn cấu hình `url: jdbc:postgresql://localhost:5432/chess_db` ở tất cả các file `application.yml` khi code Java được chạy ngoài Docker.

### 🐛 Bug 4: Lỗi `password authentication failed for user "root"` do đụng Port 5432
- **Mô tả:** Khi chạy `mvn spring-boot:run`, Java báo lỗi không thể đăng nhập bằng user `root` (Connection refused hoặc password failed), dù Docker chạy Postgres cực kỳ bình thường.
- **Nguyên nhân:** Dưới máy tính cá nhân (Host) đang có sẵn một dịch vụ PostgreSQL (ví dụ user là `sa`) chiếm dụng cổng `5432`. Khi Java gọi vào `localhost:5432`, hệ điều hành Windows đã đưa kết nối này vào PostgreSQL của Windows thay vì Docker.
- **Cách khắc phục triệt để:**
  1. Vào file `docker-compose.yml`, đổi cổng map ra ngoài của Postgres thành `5433:5432`.
  2. Vào toàn bộ file cấu hình `application.yml` của các microservice, sửa URL thành `jdbc:postgresql://127.0.0.1:5433/chess_db`.
  3. Chạy `docker compose down` và `docker compose up -d` để khởi động lại ở cổng mới.

### 🐛 Bug 5: Gateway báo lỗi 500 Internal Server Error khi truy cập Swagger/API
- **Mô tả:** Giao diện Swagger tải được khung ngoài, nhưng khi bấm chọn từng API (như User API) thì báo lỗi chữ đỏ "Fetch error: Internal Server Error /user-service/v3/api-docs".
- **Nguyên nhân:** Trong Spring Cloud bản mới, thư viện Ribbon (chuyên dùng để phân giải URL kiểu `lb://USER-SERVICE`) đã bị loại bỏ. Nếu không có thư viện thay thế, Gateway không hiểu `lb://` là gì và tự động bị crash (văng lỗi 500) khi cố gắng định tuyến request.
- **Cách khắc phục:**
  Mở `api-gateway/pom.xml` và thêm thư viện `spring-cloud-starter-loadbalancer` vào là Gateway sẽ định tuyến mượt mà.

### 🐛 Bug 6: Lỗi `password authentication failed for user "root"` khi chạy notification-service
- **Mô tả:** Chạy `notification-service` thông qua Maven (`spring-boot:run`) nhưng bị văng lỗi `org.postgresql.util.PSQLException: FATAL: password authentication failed for user "root"`. Hibernate không thể khởi tạo SessionFactory.
- **Nguyên nhân:** Lỗi này có nguyên nhân tương tự Bug 4, thông thường do `notification-service` vẫn đang được cấu hình trỏ vào port `5432` mặc định (đang bị dịch vụ Postgres của Windows chiếm) thay vì port `5433` của Docker, hoặc thông tin cấu hình username/password trong `application.yml` của `notification-service` bị sai/chưa đồng bộ.
- **Cách khắc phục:** 
  1. Kiểm tra lại `notification-service/src/main/resources/application.yml`.
  2. Đảm bảo cấu hình trỏ đúng về `jdbc:postgresql://localhost:5433/chess_db` thay vì `5432`.
  3. Đảm bảo thông tin `spring.datasource.username` và `spring.datasource.password` là `root` và `rootpassword` (như trong Docker).

### 🐛 Bug 7: Lỗi MCP Server `ECONNREFUSED 127.0.0.1:3845` khi tích hợp Figma
- **Mô tả:** Khi IDE cố gắng chạy lệnh npx của Figma MCP (`figma-developer-mcp`), console văng lỗi `Connection error: [TypeError: fetch failed] ... connect ECONNREFUSED 127.0.0.1:3845`.
- **Nguyên nhân:** Tool `figma-developer-mcp` hoạt động bằng cách kết nối với phần mềm Figma Desktop đang chạy trên máy tính của bạn thông qua port 3845. Nếu bạn chưa mở Figma Desktop, chưa đăng nhập, hoặc chưa bật tính năng Dev Mode MCP, port này sẽ bị đóng gây ra lỗi từ chối kết nối.
- **Cách khắc phục:**
  1. Cài đặt và mở ứng dụng **Figma Desktop** (bắt buộc, không dùng bản web).
  2. Đăng nhập vào tài khoản có quyền Dev Mode.
  3. Trong ứng dụng Figma Desktop, nhấn vào Menu ở góc trên trái (logo Figma) -> **Preferences** -> chọn **"Enable Dev Mode MCP Server"**.
  4. Khởi động lại IDE và thử kết nối lại.

---

## 5. Lộ Trình Phát Triển (Roadmap)

### 5.1. Những việc ĐÃ LÀM (Done)
- [x] **Refactor Kiến trúc DB & Setup Hạ tầng:** 100% PostgreSQL, cấu hình Docker Compose (Postgres, Redis, RabbitMQ).
- [x] **Tích hợp Swagger OpenAPI & Gateway:** Fix xung đột WebMVC/WebFlux, Gom tài liệu về cổng 8080.
- [x] **Khởi tạo React Frontend & Design System:** Tích hợp Figma MCP Server, setup Vite + React + TS, thiết lập TailwindCSS với phong cách VantageChess.
- [x] **Xây dựng Global Layout (Frontend):** Thiết kế Sidebar, MainArena (bàn cờ chuẩn E-sports), RightPanel.
- [x] **Quản lý Xác thực & State (Frontend):** Setup `react-router-dom`, Code xong form Đăng ký / Đăng nhập (animation `framer-motion`), tích hợp `zustand` và `axios` client.
- [x] **Kết nối API Xác thực thực tế:** Chuyển đổi mock data sang gọi API thật (`POST /api/users/login`) từ `user-service`.
- [x] **Xây dựng Trang Chủ (Home):** Hiển thị Dashboard, ELO Chart, thẻ Khóa Học bám sát prototype.
- [x] **Data Seeding (Backend):** Tự động bơm mock data cho `user-service` và `course-service` qua `CommandLineRunner` để phục vụ test nhanh ở môi trường Dev.
- [x] **Event-Driven với RabbitMQ:** Thiết lập producer (`payment-service`) / consumer (`course-service`, `notification-service`) cho luồng: thanh toán MoMo -> Kích hoạt khóa học -> Gửi thông báo.

### 5.2. Những việc ĐANG LÀM (In Progress)
- [ ] **WebSocket cho Game Service:** Viết luồng truyền nhận dữ liệu thời gian thực (real-time) cho các ván cờ.

### 5.3. Những việc SẼ PHẢI LÀM (To-do)
- [ ] **Tích hợp Thư viện Cờ vua (Frontend):** Cài đặt `react-chessboard` và `chess.js` vào dự án React.
- [ ] **Tích hợp Stockfish AI:** Cấu hình Stockfish engine trên backend để phục vụ chế độ đấu với Máy.
- [ ] **Ánh xạ UI E-sports sang Flutter Mobile:** Tạo app mobile dùng codebase Dart bám sát thiết kế React.
