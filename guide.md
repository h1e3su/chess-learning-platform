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
- **Password**: `rootpassword`![alt text](image.png)

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

### 🐛 Bug 8: `course-service` / `notification-service` crash khi khởi động (`QueuesNotAvailableException`)
- **Mô tả:** Khi chạy `start-all.ps1`, `course-service` và `notification-service` văng lỗi `NOT_FOUND - no queue 'course.payment.queue' in vhost '/'` và crash ngay lập tức.
- **Nguyên nhân:** Hai service này có `@RabbitListener` lắng nghe hàng đợi (`course.payment.queue`, `notification.payment.queue`), nhưng các hàng đợi đó chỉ được khai báo (declare) bên `payment-service`. Nếu `payment-service` chưa khởi động trước hoặc chưa kịp tạo Queue, Consumer sẽ không tìm thấy Queue và crash.
- **Cách khắc phục:**
  1. Bổ sung `@Bean Queue` vào `RabbitMQConfig.java` của mỗi Consumer service.
  2. Cụ thể: `course-service` tự khai báo `new Queue("course.payment.queue", true)`, `notification-service` tự khai báo `new Queue("notification.payment.queue", true)`.
  3. Nhờ vậy, mỗi service sẽ tự tạo Queue nếu nó chưa tồn tại, bất kể thứ tự khởi chạy.

### 🐛 Bug 9: Duplicate CORS Headers ở API Gateway (`multiple values 'http://localhost:5173, ...'`)
- **Mô tả:** Frontend báo lỗi CORS nhưng lý do là `Access-Control-Allow-Origin` header chứa tới 2 giá trị giống hệt nhau.
- **Nguyên nhân:** Cả API Gateway (qua `globalcors`) và `game-service` (qua `.setAllowedOriginPatterns("*")` trong `WebSocketConfig`) đều cố gắng gắn thêm Header CORS vào Response, khiến Header bị nhân đôi và trình duyệt từ chối.
- **Cách khắc phục:** 
  Thêm filter `DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials, RETAIN_UNIQUE` vào `default-filters` của `api-gateway` để nó tự gộp các CORS header bị trùng lặp lại thành 1.

### 🐛 Bug 10: Spring Websocket âm thầm nuốt STOMP Message (`@Payload` không hoạt động)
- **Mô tả:** Frontend báo đã gửi STOMP message thành công (`stompClient.publish()`), nhưng Backend Controller (`@MessageMapping`) không hề nhận được và không văng bất kỳ lỗi nào.
- **Nguyên nhân:** Mặc định `stompClient` gửi dữ liệu đi dưới định dạng `text/plain`. Tuy nhiên Controller Java lại dùng `@Payload PvEMoveRequest` (yêu cầu định dạng JSON). Do không khớp kiểu, Spring Boot đã âm thầm huỷ message.
- **Cách khắc phục:**
  Luôn luôn bổ sung `headers: { 'content-type': 'application/json' }` vào hàm `publish` trên Frontend.

### 🐛 Bug 11: Java Backend không kết nối được RabbitMQ (Silent Failure)
- **Mô tả:** Hàm `rabbitTemplate.convertSendAndReceive` được gọi nhưng không bao giờ ném request vào queue, làm cho Frontend đứng chờ vô tận.
- **Nguyên nhân:** `game-service/application.yml` quên chưa cấu hình `spring.rabbitmq.username` và `password`. Spring dùng tài khoản mặc định `guest` để kết nối vào RabbitMQ Docker (đang yêu cầu tài khoản `root`). Kết nối thất bại ngầm.
- **Cách khắc phục:** 
  Bổ sung khối cấu hình `spring.rabbitmq.host`, `port`, `username`, `password` đầy đủ vào file `application.yml` của service con.

### 🐛 Bug 12: Python Worker thiếu binary (Errno 2: No such file or directory: 'stockfish')
- **Mô tả:** Python worker nhận được request FEN nhưng ném lỗi không tìm thấy `stockfish`.
- **Nguyên nhân:** Dù đã thêm lệnh `apt-get install -y stockfish` vào `Dockerfile`, nhưng khi chạy `docker-compose up -d`, Docker mặc định dùng lại Image cũ (cũ kĩ, chưa có stockfish) thay vì tự động build lại. Mặc khác, Stockfish được cài qua `apt-get` nằm ở `/usr/games/stockfish` chứ không nằm trong thư mục làm việc hiện tại hay trong `$PATH` mặc định.
- **Cách khắc phục:**
  1. Cập nhật đường dẫn tuyệt đối trong code Python: `STOCKFISH_PATH = "/usr/games/stockfish"` thay vì chỉ gọi `stockfish`.
  2. Ép Docker đập đi xây lại bằng cờ `--build`: `docker-compose up -d --build stockfish_worker`

### 🐛 Bug 13: Vòng lặp Re-render cắt đứt kết nối WebSocket
- **Mô tả:** Frontend gửi lệnh nhưng không bao giờ nhận được phản hồi, trong khi đó Console liên tục báo `Connected to WebSocket` lặp đi lặp lại.
- **Nguyên nhân:** Hook `useGameSocket` có dependency array chứa hàm callback `onMoveReceived`. Hàm này được định nghĩa inline trong component `PlayArena`. Mỗi khi đi một nước cờ, `PlayArena` re-render -> hàm `onMoveReceived` bị tạo lại với địa chỉ ô nhớ mới -> `useEffect` trong `useGameSocket` chạy hàm dọn dẹp ngắt kết nối (disconnect) và thiết lập kết nối mới đúng vào khoảnh khắc AI chuẩn bị trả kết quả về.
- **Cách khắc phục:** 
  Sử dụng tuyệt kỹ `useRef` để giữ bản sao mới nhất của callback mà không làm kích hoạt lại `useEffect`:
  ```typescript
  const onMoveReceivedRef = useRef(onMoveReceived);
  useEffect(() => { onMoveReceivedRef.current = onMoveReceived; }, [onMoveReceived]);
  // Ở useEffect cấu hình Socket, chỉ dùng dependency [matchId], không truyền onMoveReceived.
  ```

### 🐛 Bug 14: Lỗi 500 UnknownHostException và 503 No servers available (Eureka Warm-up)
- **Mô tả:** Frontend gọi qua API Gateway bị văng lỗi 500 (khi dùng Gateway) hoặc 503 (No servers available) dù các service con đã chạy.
- **Nguyên nhân 1 (Lỗi DNS Windows):** Khi dùng `lb://GAME-SERVICE`, Eureka trả về Hostname của Windows (`*.mshome.net`) khiến trình giải mã DNS của Gateway (Netty) không hiểu và văng lỗi 500 `UnknownHostException`.
- **Cách khắc phục 1:** Thêm `eureka.instance.prefer-ip-address: true` vào TẤT CẢ các microservice để ép Eureka đăng ký bằng IP thật thay vì Hostname.
- **Nguyên nhân 2 (Warm-up Time):** Spring Cloud Gateway lấy danh sách service từ Eureka mỗi 30 giây. Khi vừa chạy script `start-all.ps1`, `game-service` (khởi động chậm do kết nối DB/RabbitMQ) chưa kịp đăng ký, hoặc Gateway chưa tới chu kỳ lấy dữ liệu mới, dẫn tới báo lỗi 503.
- **Cách khắc phục 2:** Đây là đặc tả bình thường của kiến trúc Microservices. Chỉ cần chờ 60-90 giây sau khi start server rồi F5 lại trình duyệt. (Ở môi trường Dev có thể ép `spring.cloud.loadbalancer.cache.enabled: false` để tắt cache).

### 🐛 Bug 15: Cấu hình CORS `DedupeResponseHeader` sai vị trí
- **Mô tả:** Dù đã thêm cấu hình `DedupeResponseHeader` để lọc CORS trùng lặp nhưng trình duyệt vẫn báo lỗi Duplicate Header `multiple values 'http://localhost:5173, http://localhost:5173'`.
- **Nguyên nhân:** Đặt nhầm `default-filters` vào bên trong block `cors-configurations` (của `globalcors`).
- **Cách khắc phục:** Phải đặt `default-filters` ở ngang hàng với `globalcors` (nằm trực tiếp dưới `spring.cloud.gateway`), đồng thời thêm cờ `RETAIN_UNIQUE` để Gateway tự động loại bỏ các header giống hệt nhau do WebFlux và Spring MVC cùng nhét vào.


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
- [x] **Tích hợp Thư viện Cờ vua (Frontend):** Cài đặt `react-chessboard` và `chess.js` vào dự án React.
- [x] **Tích hợp Stockfish AI:** Cấu hình Stockfish engine trên backend (Python Worker + RabbitMQ RPC) để phục vụ chế độ đấu với Máy.
- [ ] **Ánh xạ UI E-sports sang Flutter Mobile:** Tạo app mobile dùng codebase Dart bám sát thiết kế React.

---

## 6. Kiến Trúc & Tư Duy Thiết Kế (Architecture Patterns)

### 6.1. Ám ảnh Re-render trong React & Giải pháp Tách Lớp
Ứng dụng realtime bằng React rất dễ rơi vào "vòng lặp tử thần" (infinite loop) hoặc bị giật lag nếu không kiểm soát tốt việc render. Khi thiết kế trang PlayArena, chúng ta áp dụng tư duy:
- **UI Layer (The Canvas):** Chỉ chịu trách nhiệm hiển thị trạng thái hiện tại (FEN) và bắt sự kiện kéo thả (onPieceDrop) từ thư viện `react-chessboard`.
- **Logic Layer (The Brain):** Sử dụng `chess.js` giữ dưới dạng biến instance (bọc qua `useMemo` hoặc khai báo ngoài component) để tính toán luật cờ. `chess.js` không bao giờ trigger re-render trực tiếp.
- **State Management:** Khi `chess.js` xác nhận nước đi hợp lệ, ta mới lấy FEN cập nhật vào React State (`setFen`). Việc này báo cho React biết: *"Này, dữ liệu thay đổi rồi, vẽ lại cái bàn cờ đi"*. Nếu sai luật, state không đổi, React không làm gì, bàn cờ tự giật quân về chỗ cũ.

### 6.2. Tách biệt Socket Layer và Message STOMP (SockJS & Gateway)
- **SockJS & Quá trình Handshake:** Khác với WebSocket thuần túy (`ws://`), SockJS bắt đầu bằng các HTTP request thông thường (gọi tới `/ws/game/info`) để "đàm phán" với Backend xem trình duyệt có hỗ trợ WebSocket hay không. Do đó, API Gateway chỉ cần định tuyến chuẩn HTTP (`lb://GAME-SERVICE` với `Path=/ws/game/**`) là luồng đàm phán này sẽ tự động được Gateway Upgrade thành WebSocket mà không cần cấu hình giao thức `ws://` lằng nhằng.
- **STOMP (Simple Text Oriented Messaging Protocol):** Là giao thức giúp chúng ta gửi message có cấu trúc (header, body) qua WebSocket, tương tự như HTTP.
- **Tách Lớp (Decoupling):** Không bao giờ nhét code `new SockJS()` hay `stompClient.connect()` trực tiếp vào trong component giao diện `PlayArena.tsx`. Chúng sẽ được tách ra một **Custom Hook** (ví dụ: `useGameSocket.ts`) hoặc **Zustand Store**.
- **Luồng dữ liệu (Data Flow):** 
  1. WebSocket nhận message từ server.
  2. Socket Layer dịch message, kiểm tra hợp lệ.
  3. Bơm nước đi mới vào `chess.js` (The Brain).
  4. Lấy FEN mới đẩy vào State (UI Layer).
=> UI không cần biết dữ liệu đến từ người chơi bấm chuột hay từ mạng internet.

### 6.3. "Fail Fast, Fail Cheap" (Tiếp cận Offline First)
Trước khi tốn thời gian code WebSocket hay AI phức tạp, chúng ta xây dựng chế độ Offline (2 người chơi trên 1 máy) để test độ ổn định của `chess.js` và UI trước.

### 6.4. Xử lý Lỗi Tương Thích React & Quản lý Global State
- **Downgrade React 18:** Phiên bản `react-chessboard@5.x` (sử dụng `@dnd-kit/core`) gặp lỗi nghiêm trọng với luồng ref của **React 19**, khiến bàn cờ bị "liệt" hoàn toàn sự kiện kéo thả (không throw error, không log). Giải pháp "đặc trị" là hạ cấp dự án xuống `React 18.3.1` và `react-chessboard@4.2.2`, đồng thời gỡ bỏ `<StrictMode>` ở `main.tsx` để tránh double-mount làm crash bộ dnd.
- **Zustand cho Move History:** Vì `PlayArena` và `RightPanel` nằm ngang hàng (sibling) trong Layout, việc đồng bộ mảng PGN (`history`) được giải quyết thanh lịch bằng Global Store `useGameStore`. Nhờ vậy, RightPanel có thể tách thuật toán `reduce` để parse dữ liệu và hiển thị bảng lịch sử Real-time mượt mà, đúng chuẩn cờ vua.

### 6.5. Kiến Trúc RPC AI với RabbitMQ & Python Worker
Thay vì nhúng trực tiếp thư viện Stockfish Java vào `game-service` (dễ gây quá tải CPU cho toàn bộ Backend, block thread), chúng ta sử dụng kiến trúc RPC (Remote Procedure Call) kết hợp Microservices:
- **Ngôn ngữ/Môi trường tối ưu:** Stockfish được chạy bằng `subprocess` trong một Docker container `stockfish-worker` sử dụng Python siêu nhẹ. Do container này độc lập với Java, nó không bị ảnh hưởng bởi Garbage Collector của JVM và có thể scale linh hoạt (thêm nhiều container Python khi đông người chơi đấu với AI).
- **Giao tiếp qua Message Broker:** `game-service` gọi `rabbitTemplate.convertSendAndReceive()` để gửi chuỗi FEN vào hàng đợi `stockfish.jobs.queue`. Nó sẽ gán kèm một `correlation_id` (Mã vé dò) và một hàng đợi tạm thời (`reply_to`) để chờ kết quả.
- **Python Worker xử lý & trả về:** Worker Python nhặt JSON, kích hoạt file nhị phân Stockfish Linux lấy `bestmove` (ví dụ `e7e5`), và bắn ngược kết quả vào hàng đợi `reply_to` với đúng mã `correlation_id`. Nhờ vậy, hàng chục yêu cầu song song từ nhiều user khác nhau không bao giờ bị lẫn lộn kết quả cờ.
Thay vì code cả UI, Logic và Network cùng lúc, chúng ta làm UI và Logic chơi Offline (2 người chung 1 máy) trước. 
- Giúp xác định ngay lỗi nếu có là do `chess.js` hay `react-chessboard`. 
- Khi phần khung đã vững, việc cắm thêm WebSocket (Socket Layer) vào chỉ là việc thay thế nút bấm bằng tín hiệu mạng.
