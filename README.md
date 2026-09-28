# Job Scheduler — Frontend

A web-based dashboard for the Distributed Job Scheduler, built with **React and Vite**. It provides an interface to create and manage scheduled HTTP jobs, control their lifecycle, and inspect execution history and individual execution details.

This frontend works with the [Job Scheduler Backend](https://github.com/shivamkachawar/job-scheduler), a Spring Boot application backed by PostgreSQL and Apache Kafka.

## Features

### Job Dashboard

* View scheduled jobs and their current status.
* Inspect job details, including schedule configuration.
* Refresh job data after performing actions.

### Job Management

* Create jobs through a dedicated form.
* Configure one-time, interval-based, and cron schedules.
* Pause and resume jobs.
* Soft-delete jobs.
* View individual job details.

### Execution Monitoring

* View execution history for a job.
* Inspect individual execution details.
* Track execution status and timing.
* Inspect execution attempts and failure information exposed by the backend.

### User Interface

* React-based single-page application.
* Reusable components and state-driven UI updates.
* Modal-based job creation.
* Plain CSS for styling.
* Dashboard updates without requiring a full-page reload after job actions.

## Tech Stack

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| React            | UI components and application state     |
| Vite             | Development server and build tooling    |
| JavaScript       | Frontend application logic              |
| CSS              | Styling and layout                      |
| Fetch/API client | Communication with the backend REST API |

## Application Flow

```text
User
 |
 v
React Dashboard
 |
 +----> Job Management
 |
 +----> Execution History
 |
 v
Spring Boot REST API
 |
 v
PostgreSQL
```

The frontend is responsible for presenting job and execution information and sending user actions to the backend. Scheduling, persistence, execution processing, and retry handling are managed by the backend.

## Getting Started

### Prerequisites

* Node.js
* npm
* The Job Scheduler backend running and accessible

### 1. Clone the repository

```bash
git clone https://github.com/shivamkachawar/job-scheduler-ui
cd job-scheduler-ui
```

Replace the placeholders with the URL and directory name of this frontend repository.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend API

Make sure the frontend points to your running Spring Boot backend.

If the API URL is configurable through a Vite environment variable, set it in a local `.env` file using the variable name expected by the application.

Example:

```env
API_BASE_URL=http://localhost:8080
```

Adjust the variable name and URL to match your actual frontend configuration and backend port. Do not commit environment-specific secrets.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### 5. Create a production build

```bash
npm run build
```

Vite generates the production build in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Backend Integration

This frontend requires the Spring Boot backend for job and execution operations.

The backend provides the functionality for:

* Creating and retrieving jobs.
* Pausing, resuming, and deleting jobs.
* Retrieving execution history and details.
* Scheduling jobs and dispatching executions.
* Tracking execution attempts and outcomes.

Ensure the backend is running, its database and Kafka dependencies are available, and the frontend's API configuration points to the correct backend URL.

## Related Repository

**Backend:** [Distributed Job Scheduler — Spring Boot](https://github.com/shivamkachawar/job-scheduler)

The backend repository contains the scheduling engine, REST APIs, PostgreSQL persistence, Kafka integration, transactional outbox, and execution processing logic.

## Author

**Shivam Kachawar**

GitHub: [@shivamkachawar](https://github.com/shivamkachawar)
