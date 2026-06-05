# Vehicle Maintenance Scheduler

A production-quality scheduler for optimizing vehicle maintenance task allocation across multiple depots, maximizing total maintenance impact within available mechanic hours.

## Overview

The Vehicle Maintenance Scheduler solves the 0/1 knapsack problem to allocate maintenance tasks to depots:

- **Input**: Depots with available mechanic hours, and vehicles requiring maintenance
- **Output**: Optimized schedule maximizing total impact while respecting capacity constraints
- **Algorithm**: Dynamic programming-based 0/1 knapsack solver

## Features

- Minimal, clean architecture with no unnecessary abstraction
- External API integration for depots and vehicles
- Comprehensive logging via integrated logging middleware
- Dynamic programming-based optimal task scheduling
- RESTful API endpoints

## Project Structure

```
vehicle_maintenance/
├── server.js           # Express server with API endpoints
├── scheduler.js        # Scheduling logic and external API calls
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
API_BASE_URL=http://localhost:3001
PORT=3002
NODE_ENV=development
```

## Running the Service

```bash
npm start
```

The server will start on the configured port (default: 3002).

## API Endpoints

### Health Check

```
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "vehicle-maintenance-scheduler"
}
```

### Generate Schedule

```
GET /schedule
```

Fetches depots and vehicles from external APIs and generates an optimized schedule.

Response:

```json
{
  "success": true,
  "data": [
    {
      "DepotID": 1,
      "SelectedTasks": ["uuid-1", "uuid-2"],
      "TotalImpact": 14,
      "TotalDuration": 6,
      "AvailableCapacity": 60
    }
  ],
  "timestamp": "2026-06-05T10:30:00.000Z"
}
```

## Dependencies

- **express**: Web framework
- **axios**: HTTP client for external API calls
- **dotenv**: Environment variable management
- **logging_middleware**: Centralized logging service

## Logging

All operations are logged using the centralized logging middleware:

- API request start/completion
- Depot/vehicle fetch events
- Schedule generation progress and results
- Errors and warnings

Log format:

```javascript
await Log(
  "backend",
  "info|error|warn",
  "service|api",
  "Message"
);
```

## Algorithm Details

The scheduler uses a 0/1 knapsack dynamic programming solution:

- **Capacity**: Available mechanic hours per depot
- **Item Weight**: Task duration
- **Item Value**: Task impact
- **Goal**: Maximize total impact while respecting hour constraints

Time Complexity: O(n × capacity)
Space Complexity: O(n × capacity)

## Error Handling

- Failed API calls are logged and error responses returned
- Missing depots or vehicles are logged with appropriate warnings
- Unhandled errors are caught and logged before returning 500 response

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| API_BASE_URL | http://localhost:3001 | Base URL for evaluation service APIs |
| PORT | 3002 | Server port |
| NODE_ENV | development | Environment mode |

## Development

No additional build or compilation step required. Modify files and restart the server.

## License

MIT
