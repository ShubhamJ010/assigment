# GRC Risk Assessment & Heatmap Dashboard

A full-stack application for Governance, Risk, and Compliance (GRC) risk assessment using a standard risk matrix approach (likelihood × impact). The application allows users to input risks, compute scores automatically, store them persistently, and visualize via an interactive dashboard.

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [GRC Context](#grc-context)
- [Screenshots](#screenshots)
- [Development Notes](#development-notes)
- [Assumptions](#assumptions)

## Overview

This application implements a fundamental feature in real-world GRC software: risk assessment using a likelihood × impact matrix. Organizations use this approach to prioritize risks by calculating a risk score based on the probability of occurrence (likelihood) and the severity of impact if the risk materializes.

### Core Concept
1. Estimate **Likelihood** (how probable is it that this risk event will actually happen?) → usually scored 1 to 5
2. Estimate **Impact** (if it does happen, how bad will the damage be — financial, reputational, legal, operational?) → also scored 1 to 5
3. Multiply the two numbers → **Risk Score** (range 1–25)
4. Map the score to a **Risk Level** (Low / Medium / High / Critical)
5. Visualize all assessed risks on a **heatmap** (5×5 grid) so decision-makers can instantly see which risks are most urgent

## Tech Stack

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.5.0
- **Build Tool**: Maven
- **Database**: SQLite (using sqlite-jdbc)
- **Persistence**: Spring Data JPA
- **Validation**: Jakarta Validation
- **Web**: Spring Web

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Visualization**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Architecture

### Backend Architecture
```
Client (Frontend / API Consumer)
 |
 v
REST Controller Layer (RiskController)
 |
 v
Service Layer (RiskService/RiskServiceImpl)
 |
 v
Repository Layer (RiskRepository)
 |
 v
SQLite Database (risks.db)
```

#### Key Components
- **RiskController**: Handles HTTP requests for risk assessment endpoints
- **RiskService**: Contains business logic for scoring and risk level determination
- **RiskRepository**: JPA repository for CRUD operations on Risk entities
- **Risk Entity**: Database entity representing a risk assessment
- **RiskRequest/RiskResponse**: DTOs for API request/response contracts

### Frontend Architecture
```
App (Router)
 |
 v
Layout Component
 |
 v
Pages:
├── HomePage (Dashboard)
│   ├── RiskStats (Summary cards)
│   ├── RiskHeatmap (5x5 visualization)
│   └── RiskTable (Risk data table)
└── AddRiskPage
    └── RiskForm (Input form with real-time preview)
```

#### Key Components
- **RiskForm**: Captures new risk assessment input with real-time preview
- **RiskTable**: Displays risks in sortable, filterable table
- **RiskHeatmap**: Visualizes risk distribution on 5×5 matrix
- **RiskStats**: Displays summary statistics
- **API Layer**: Handles communication with backend API
- **Hooks**: Custom hooks for state management and data fetching

## Installation

### Prerequisites
- Java 17+
- Node.js 18+ (with npm)
- Git

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Build the project (downloads dependencies and compiles)
./mvnw clean install

# Or on Windows
mvnw.cmd clean install
```

### Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Backend
```bash
# Navigate to the backend directory
cd backend

# Run the application
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`.

### Frontend
In a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

## API Endpoints

### POST /api/assess-risk
Creates a new risk assessment.

**Request Body:**
```json
{
  "asset": "Customer Database",
  "threat": "Unauthorized Access",
  "likelihood": 3,
  "impact": 4
}
```

**Validation:**
- `asset`: Required, non-blank
- `threat`: Required, non-blank
- `likelihood`: Integer between 1 and 5
- `impact`: Integer between 1 and 5

**Response:**
```json
{
  "id": 1,
  "asset": "Customer Database",
  "threat": "Unauthorized Access",
  "likelihood": 3,
  "impact": 4,
  "score": 12,
  "level": "Medium"
}
```

**Risk Level Mapping:**
- Score 1–5: Low (Green)
- Score 6–12: Medium (Yellow)
- Score 13–18: High (Orange)
- Score 19–25: Critical (Red)

### GET /api/risks
Retrieves all risk assessments.

**Query Parameters:**
- `level` (optional): Filter by risk level (Low, Medium, High, Critical)

**Response:**
```json
[
  {
    "id": 1,
    "asset": "Customer Database",
    "threat": "Unauthorized Access",
    "likelihood": 3,
    "impact": 4,
    "score": 12,
    "level": "Medium"
  }
]
```

## Features

### Backend Features
- ✅ REST API for risk assessment
- ✅ Data validation (likelihood/impact between 1-5)
- ✅ Risk calculation (score = likelihood × impact)
- ✅ Risk level determination based on score ranges
- ✅ SQLite persistence
- ✅ CORS support for frontend integration
- ✅ Error handling with appropriate HTTP codes
- ✅ Automatic database schema creation

### Frontend Features
- ✅ Risk input form with real-time preview
- ✅ Asset and threat text inputs
- ✅ Sliders for likelihood and impact (1-5 range)
- ✅ Real-time calculation of score and level
- ✅ Interactive dashboard with risk table
- ✅ Sortable table columns (especially Score and Level)
- ✅ 5×5 Heatmap visualization showing risk distribution
- ✅ Color-coded heatmap cells by risk level
- ✅ Hover tooltips on heatmap cells
- ✅ Summary statistics cards (Total risks, High/Critical count, Average score)
- ✅ Risk filtering by level
- ✅ CSV export functionality
- ✅ Mitigation hint column in the table
- ✅ Responsive design for mobile devices
- ✅ Loading and empty states
- ✅ Error handling and user feedback

### Risk Level Colors
- **Low**: Green (#00FF00) - Accept / Monitor
- **Medium**: Yellow (#FFFF00) - Plan mitigation within 6 months
- **High**: Orange (#FFA500) - Prioritize action + compensating controls (NIST PR.AC)
- **Critical**: Red (#FF0000) - Immediate mitigation required + executive reporting

## GRC Context

This application aligns with industry-standard risk assessment methodologies such as NIST SP 800-30 for risk assessment. The 5×5 risk matrix is widely used in organizations for:
- ISO 27001 compliance
- NIST Cybersecurity Framework implementation
- Internal audit and risk management programs
- Regulatory compliance reporting

The matrix helps organizations prioritize risks based on their potential impact and probability, enabling efficient allocation of resources for risk mitigation.

## Screenshots

<img width="5088" height="3326" alt="image" src="https://github.com/user-attachments/assets/7a801e1a-56cb-427e-b12a-644564df8b70" />
<img width="5088" height="3326" alt="image" src="https://github.com/user-attachments/assets/49a8f031-f1c5-4b73-8b9d-dad38c6ed6bd" />
<img width="5088" height="3326" alt="image" src="https://github.com/user-attachments/assets/db9b7a2d-0c52-4673-bf4b-3672aa3f78c3" />
<img width="5088" height="3326" alt="image" src="https://github.com/user-attachments/assets/dad29ae9-280b-4cf3-9866-a88354d081ef" />



## Development Notes

### Backend Development
- Uses Spring Boot's auto-configuration for rapid development
- Implements proper separation of concerns with Controller, Service, and Repository layers
- Leverages Spring Data JPA for database operations
- Includes comprehensive validation using Jakarta Validation annotations
- Handles cross-origin requests for frontend integration

### Frontend Development
- Built with React functional components and TypeScript
- Uses React hooks for state management (useState, useEffect, useContext)
- Implements custom hooks for risk management and form handling
- Utilizes Tailwind CSS for utility-first styling
- Integrates Chart.js for heatmap visualization
- Implements responsive design principles

### Database Schema
The application creates a `risks` table automatically with the following structure:
```
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- asset (TEXT, NOT NULL)
- threat (TEXT, NOT NULL)
- likelihood (INTEGER, NOT NULL)
- impact (INTEGER, NOT NULL)
- score (INTEGER, NOT NULL)
- level (TEXT, NOT NULL)
```

## Assumptions
- No authentication or authorization required
- Single-user local application
- SQLite file (`risks.db`) is stored in the backend directory
- Frontend communicates with backend via HTTP at `http://localhost:8080`
- Application is for demonstration/assessment purposes only

## Challenges Addressed
- Handled async API calls with useEffect and proper error handling
- Implemented real-time risk calculation in the frontend form
- Created responsive heatmap visualization that works on different screen sizes
- Managed state effectively using custom hooks
- Integrated backend validation with frontend form validation

## Testing
Manually tested with 10+ risk assessments to verify:
- Accurate score calculations
- Correct risk level assignments
- Proper filtering functionality
- Heatmap count accuracy
- CSV export functionality

---

**Project Structure:**
```
grc-risk-tool/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/example/grc/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access layer
│   │   ├── domain/entity/   # Entity models
│   │   └── dto/            # Data transfer objects
│   ├── src/main/resources/
│   └── pom.xml             # Maven dependencies
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api/            # API service layer
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── risks.db                # SQLite database (created automatically)
└── README.md
```
