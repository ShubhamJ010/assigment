# GRC Risk Assessment Backend – Architecture & Design Plan

## 1. Scope Clarification (Backend Ownership Only)

This document defines the **backend architecture** for the **GRC Risk Assessment & Heatmap Dashboard** application.

### Explicit In-Scope

- REST API for risk assessment
- Business logic for scoring & risk levels
- Persistent storage
- Validation and error handling
- Minimal configuration & bootstrapping

### Explicitly Out-of-Scope

- Authentication / authorization
- User management
- Frontend logic or visualization
- Cloud deployment
- Microservices or distributed systems

This is a **single, local, monolithic backend**, intentionally simple.

Source: Assignment specification :contentReference[oaicite:0]{index=0}

---

## 2. Technology Stack Decisions

### Language & Runtime

- **Java 17**
  - Required by instruction
  - LTS, modern language features, strong ecosystem

### Framework

- **Spring Boot 3**
  - Production-grade REST support
  - Built-in validation, exception handling, and JPA integration
  - Jakarta EE aligned (important for Spring Boot 3)

### Build Tool

- **Maven**
  - Explicit dependency control
  - Widely understood and expected in Java backend roles

### Database

- **SQLite**
  - Matches assignment requirements
  - File-based, zero-config
  - Sufficient for local persistence

### Persistence Layer

- **Spring Data JPA**
  - Reduces boilerplate
  - Clean domain modeling
  - No complex queries required

---

## 3. High-Level Architecture
```
Client (Frontend / API Consumer)
|
v
REST Controller Layer
|
v
Service Layer (Business Logic)
|
v
Repository Layer (JPA)
|
v
SQLite Database (risks.db)
```

### POST `/assess-risk`

#### Responsibility

- Accept raw risk input
- Validate data
- Compute score & level
- Persist result
- Return stored entity

#### Validation Rules

- `likelihood` ∈ [1,5]
- `impact` ∈ [1,5]
- `asset` not blank
- `threat` not blank

#### Failure Behavior

- HTTP 400
- Clear error message
- No partial writes

---

### GET `/risks`

#### Responsibility

- Retrieve stored risks
- Optional filtering by level

#### Query Parameters

| Param | Description |
|-----|------------|
| level | Optional filter (Low / Medium / High / Critical) |

#### Edge Cases

- Empty DB → return `[]`
- Unknown level → return `[]` (not error)

---

## 7. Layer Responsibilities

### Controller Layer

- HTTP request/response handling
- Input DTO binding
- Delegates logic to Service
- No business rules

### Service Layer (Core Logic)

- Input validation enforcement
- Risk score calculation
- Risk level determination
- Compliance hint mapping (bonus)
- Transaction boundary

### Repository Layer

- CRUD access to `Risk`
- Simple queries only
- Optional derived query: `findByLevel(...)`

---

## 8. Validation & Error Handling Strategy

### Validation

- Bean Validation (Jakarta Validation)
- Enforced at API boundary
- Prevents invalid data from entering system

### Error Handling

- Centralized `@ControllerAdvice`
- Consistent error response format
- No stack traces exposed to client

---

## 9. Persistence Strategy

### Database

- SQLite file: `risks.db`
- Auto-created on application startup

### Schema Management

- JPA auto DDL (create/update)
- No migrations needed (assignment scope)

### Data Integrity

- No uniqueness constraints
- Duplicate risks explicitly allowed

---

## 10. Configuration & Bootstrapping

### Application Startup Responsibilities

- Initialize SQLite connection
- Auto-create table if missing
- Application runs locally without manual DB setup

### CORS

- Enabled for `localhost`
- Required for frontend integration

---

## 11. Non-Functional Considerations

### Performance

- Expected dataset: <100 rows
- No pagination required
- In-memory sorting acceptable

### Security

- No auth by design
- Input validation prevents obvious abuse
- Local-only execution assumed

### Extensibility

- Easy to add:
  - CSV export endpoint
  - Update/delete endpoints
  - Risk categories
  - Audit timestamps

---

## 12. What Is Intentionally NOT Done

- No user accounts
- No roles or permissions
- No async processing
- No message queues
- No microservices
- No cloud deployment
- No over-abstraction

This backend is **intentionally boring** — because boring, correct, and maintainable beats clever.

---

## 13. Backend Success Criteria

The backend is considered complete when:

- API starts with a single command
- Risks are validated correctly
- Scores and levels are accurate
- Data persists across restarts
- GET and POST behave exactly as specified

Anything beyond this is optional polish.

---

## 14. Summary

This backend design:

- Matches the assignment exactly
- Uses industry-standard Java architecture
- Avoids unnecessary complexity
- Demonstrates strong backend fundamentals

It is realistic, reviewable, and production-aligned for a GRC-style system.

--- 
