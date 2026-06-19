# Chess Platform Backend

> **Core microservices engine** for the Chess Learning & Playing Platform.  
> Manages the complete ecosystem of users, real-time gameplay, course learning, and transactions.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [Running the Services](#running-the-services)
- [Microservices Portfolio](#microservices-portfolio)
- [API Reference](#api-reference)
- [Data & Messaging](#data--messaging)
- [Environment Variables](#environment-variables)

---

## Overview

The Chess Platform Backend is the **operational core** of the application. It orchestrates everything from user accounts and learning to real-time PvP chess games:

- **User Management** — Registration, authentication, profile management, and ELO rating tracking.
- **Real-time Gameplay** — WebSocket-based real-time chess engine with Stockfish AI integration.
- **E-Learning (Courses)** — Management of chess courses, puzzles, and interactive lessons.
- **Payments** — Integration with MoMo wallet for course purchases and premium features.
- **Notifications** — Event-driven in-app alerts and emails.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Java 17+ |
| **Framework** | Spring Boot 3.2+ |
| **Microservices** | Spring Cloud (Eureka, API Gateway) |
| **Database** | PostgreSQL 15+ |
| **ORM** | Spring Data JPA / Hibernate |
| **Cache & Real-time**| Redis, WebSockets |
| **Message Broker** | RabbitMQ |
| **API Docs** | SpringDoc OpenAPI (Centralized Swagger UI) |
| **Build** | Maven |

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway (:8080)                         │
│                    (Centralized Swagger)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │
│  │ /api/users │  │/api/courses│  │/api/games  │  │   ...     │  │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └─────┬─────┘  │
│         │               │               │              │        │
└─────────┼───────────────┼───────────────┼──────────────┼────────┘
          │               │               │              │
 ┌────────▼─────┐ ┌───────▼────┐ ┌────────▼─────┐ ┌──────▼───────┐
 │ User Service │ │Course Svc  │ │ Game Service │ │ Payment Svc  │
 │    :8081     │ │   :8082    │ │    :8084     │ │    :8083     │
 └──────┬───────┘ └───────┬────┘ └────────┬─────┘ └──────┬───────┘
        │                 │               │              │
        │         ┌───────▼───────────────▼───────┐      │
        └─────────►          PostgreSQL           ◄──────┘
                  │ (Logical DBs per Microservice)│
                  └───────────────────────────────┘
        
        [ RabbitMQ ] <--- Event Streams ---> [ Notification Svc :8085 ]
        [ Redis    ] <--- Cache & Matchmaking
```

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Docker & Docker Compose (for PostgreSQL, Redis, RabbitMQ)

### Configuration

**1. Infrastructure (Docker)**

Start the core infrastructure services (Database, Redis, Message Broker):

```bash
docker compose up -d
```
> **Note:** PostgreSQL is mapped to port `5433` (default user: `root` / `rootpassword`) to avoid conflicts with local installations.

**2. Database Initialization**
Spring Boot's `ddl-auto: update` is configured to automatically create and update tables upon startup. 

### Running the Services

To compile the entire project, run from the root directory:
```bash
mvn clean compile
```

**Startup Order is important!**
1. **Eureka Server** (`eureka-server` on port 8761) - Wait for it to fully start.
2. **API Gateway** (`api-gateway` on port 8080).
3. **Core Services**:
   - `user-service` (8081)
   - `course-service` (8082)
   - `payment-service` (8083)
   - `game-service` (8084)
   - `notification-service` (8085)

> **Pro Tip for Windows Users**: You can start all services at once by running the provided PowerShell script:
> ```powershell
> .\start-all.ps1
> ```

---

## Microservices Portfolio

| Service | Port | Endpoint Prefix | Primary Responsibilities |
|---|---|---|---|
| **API Gateway** | `8080` | `/api/*` | Global entry point, Routing, Central Swagger UI, CORS. |
| **User Service** | `8081` | `/api/users` | Player accounts, BCrypt password hashing, ELO tracking. |
| **Course Service**| `8082` | `/api/courses` | Learning paths, puzzles, course progression. |
| **Payment Service**| `8083` | `/api/payments`| MoMo integration, invoices, premium subscriptions. |
| **Game Service** | `8084` | `/api/games` | Matchmaking, WebSocket rooms, Stockfish AI PvE. |
| **Notification** | `8085` | `/api/notifications` | Email receipts, real-time Socket.io alerts. |

---

## API Reference

> **Base path through API Gateway**: `http://localhost:8080`

The project utilizes a **Centralized Swagger UI**. Instead of checking each service individually, the API Gateway aggregates all OpenAPI specs.

Once the Gateway and microservices are running, access the documentation at:
**[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

Use the top-right dropdown to switch between API specs (e.g., User Service, Game Service).

---

## Data & Messaging

### Event-Driven Workflow (RabbitMQ)

We use RabbitMQ to handle asynchronous tasks and ensure microservices remain loosely coupled.

**Example Scenario (Course Purchase):**
1. User pays via MoMo (`payment-service`).
2. `payment-service` publishes a `PaymentCompletedEvent` to RabbitMQ.
3. `course-service` consumes the event and unlocks the course for the user.
4. `notification-service` consumes the event and sends an email receipt.

---

## Environment Variables

Common variables configured across `application.yml` files:

| Variable / Property | Description | Default (Local) |
|---|---|---|
| `spring.datasource.url` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5433/chess_db` |
| `spring.datasource.username` | DB Username | `root` |
| `spring.datasource.password` | DB Password | `rootpassword` |
| `eureka.client.serviceUrl.defaultZone`| Eureka Server URL | `http://localhost:8761/eureka/` |

---

## Enterprise Configuration & Gotchas

To ensure seamless transition from local development (Windows/macOS) to production (Docker/Kubernetes), we have implemented several enterprise-grade configurations:

### 1. Eureka DNS Resolution on Windows
When running Eureka locally on Windows, microservices default to registering with the host's DNS name (e.g., `*.mshome.net`). This causes `UnknownHostException` in the API Gateway.
**Solution:** All microservices are configured with `eureka.instance.prefer-ip-address=true` to force IP-based registration.

### 2. Eureka Warm-up Time (503 Errors)
After starting the system with `start-all.ps1`, the API Gateway might temporarily throw `503 Service Unavailable` or `No servers available`.
**Reason:** The Spring Cloud LoadBalancer fetches the registry from Eureka every 30 seconds. Heavy services (like `game-service`) take time to start and register.
**Solution:** Wait 60-90 seconds after running the startup script before hitting the frontend.

### 3. API Gateway Duplicate CORS Headers
If both the API Gateway (`globalcors`) and a backend service (e.g., `game-service` WebSocket configuration) attempt to add CORS headers, the browser will block the request due to duplicate values.
**Solution:** The API Gateway is equipped with a `DedupeResponseHeader` filter using the `RETAIN_UNIQUE` strategy to merge and clean up duplicate CORS headers automatically.

### 4. SockJS & WebSocket Routing
SockJS uses HTTP requests (`/info`) for its initial handshake before upgrading to WebSockets.
**Solution:** The API Gateway route uses the standard `lb://GAME-SERVICE` instead of `lb:ws://GAME-SERVICE`. This allows the initial HTTP handshake to succeed, and Spring Cloud Gateway handles the subsequent WebSocket upgrade natively.
