# Architecture

## Frontend

This project utilizes Next.js (App Router) as the primary frontend framework. Given the requirement for the system to operate reliably in environments with low or intermittent internet connectivity, the following design decisions were implemented:

**1. Real-Time Data Dashboard: Long Polling**

WebSockets at first was the strategy to hit the real-time data strategy. However, given the constraints within the assignment, I opted for Long Polling. WebSockets require a persistent connection that frequently drops in low-bandwidth areas, leading to reconnection overhead. By using Long Polling, I shift the responsibility of the "heartbeat" to the frontend client. This ensures that even with a spotty connection, the frontend can request updates at its own pace without the state-management complexity of broken socket pipes. As well to prevent any potential data loss.

I also though about the option of Server-Sent Events (SSE) but I realize when the low latency is on the client's side, there was the possibility the server side event could be missed if the client was not in internet range leading to potential drift.

**2.Client Side Data Persistent: IndexDB**

To prevent data loss during manual ingestion, I implement a "Local-First" buffer using IndexedDB.

I chose IndexedDB was chosen over localStorage as IndexedDB handles complex JavaScript objects and larger datasets more efficiently. I also picked IndexedDb for offline resilience and keeping the data persisted locally. This means a lost connection doesn't result in lost work and lost data.

With the IndexDB. We keep the data until is submitted and a 200 OK confirmation is received from the backend.

**3. Submission Strategy: Exponential Backoff**

To handle the transition from offline to online in spotty internet areas, the ingestion form utilizes an Exponential Backoff retry strategy.

When a user submits data, the system attempts to reach the API. If the connection fails, the system retries at increasing intervals ($2^n$). This is good strategy regardless if you need to constantly keep hitting the backend, but also a good strategy for testing with an spotty internet connection.

## Backend

The backend is built using Fastify, chosen for its extremely low overhead and high throughput capabilities. The system follows an Event-Driven Architecture designed to handle high-frequency data ingestion without compromising consistency.

**1. Ingestion Engine: Command/Processor Pattern**

To handle bulk measurement uploads, I implemented a structured Command/Processor pattern.

Atomic Transactions: Every batch ingestion runs within a database transaction. This ensures Atomicity—either the entire batch is saved, or none of it is, preventing "partial data" states.

Row-Level Locking: During ingestion, we implement row-level locking to prevent race conditions during high-concurrency writes.

Deduplication Logic: The processor includes a deduplication layer that identifies and filters out duplicate readings within the same batch before they hit the database layer.

Failure Recovery: If a transaction fails, a clear error is returned to the frontend, which triggers the IndexedDB fallback mentioned in the frontend section, ensuring zero data loss.

**2. Decoupled Design & Dependency Injection (DI)**

I utilize Dependency Injection to manage our services and repositories as DI decouples our business logic from specific implementations. While we currently use Drizzle ORM, this architecture allows us to swap out the database layer from PSQL, to MYSQL, NoSQL etc or the mailing service without refactoring the core logic. This also allows for a much easier to maintain codebase.

**3. Observability & Error Handling**

Asynchronous Logging: I use Pino for logging. Because it is non-blocking, it allows the server to remain performant even under heavy load while providing detailed JSON logs for debugging.

Custom Error Contract (HighwoodError): I implemented a centralized error class to enforce strict error structures.

Global Error Hook: This works in tandem with Fastify’s error hook, which intercepts HighwoodError instances to ensure the client receives consistent, meaningful HTTP status codes and messages.

**4. API Versioning & Evolution**

To ensure the system can grow without breaking existing client installations (especially important given the "offline-first" nature of the frontend). All HTTP endpoints are explicitly versioned (e.g., /v1/measurements). This allows us to deploy new features in a /v2 while maintaining backwards compatibility.

## Shared - Backend and Frontend

**1. Type Management & Monorepo Structure**

I maintain a strict typing system to ensure consistency between the client and the rest of the stack:

Local Types: Are found within the both the backend and frontend's directory

Shared Types: Located in the `/shared` folder of the monorepo. These define the contracts for API responses and database schemas, ensuring that the frontend and backend are always in sync regarding the data shape.

**2. Zod**

I also maintain zod contracts in the `/shared` folder as the shared (FE and BE) types are inferred from the Zod types.

#### In terms of the assignment, with the architecture I was able to complete the following:

> Backend: Node.js preferred (NestJS is our standard), but other modern runtimes are acceptable.

✅ **I used Fastify**

> Frontend: React preferred (Next.js App Router is our standard), but other frameworks like Vue or Svelte are also fine.

✅ **I used NextJS**

> Database: PostgreSQL is required.

✅ **I used Psql**

> Cache: Redis is optional (provided in the docker-compose).

❌ **I did not use Redis**

> Tools: Any ORM (Drizzle/Prisma) and Validation libraries (Zod) are encouraged.

✅ **I used Drizzle and Zod**

#### Optional Tasks

> Concurrency Control: How does the system handle 10 concurrent sources updating the same site_id? Implement a protection strategy (e.g., Optimistic or Pessimistic locking).

❌ **I did not do either of these. I ended up using row level locking.**

> Architecture Pattern: Demonstrate a scalable approach, such as Command/Processor patterns (OOP) or an Event-Driven model.

✅ **I did both of these strategies**

> Database Scalability: Describe or implement a Partitioning strategy for the measurements table (e.g., by month/year) to handle 100M+ rows.

**Lets chat =)**

> Transactional Outbox: Implement the Outbox Pattern to ensure that once a measurement is saved, a downstream "Alerting Service" is guaranteed to be notified.

❌ **I had started this but ran out of time**

> Developer Experience (DX): Provide a seamless setup. Ensure the project can be started with a single command (e.g., docker-compose) including migrations and initial seed data.

✅ **I did this**

> Observability: Implement basic logging or metrics that track how many requests were identified and rejected as duplicates.

✅ **I did this**

> Type-Safe Contract: Share schemas (e.g., Zod) between the backend and frontend to ensure end-to-end type safety.

✅ **I did this**

> API Versioning: Implement a versioning strategy that ensures backward compatibility for older IoT sensors.

✅ **I did this**
