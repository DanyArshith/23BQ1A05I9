# Vehicle Maintenance Scheduler

## Run

```bash
npm install
npm start
```

## Environment

Create `vehicle_maintenance/.env` or set these variables in the terminal:

```env
EMAIL=
NAME=
ROLL_NO=
ACCESS_CODE=
CLIENT_ID=
CLIENT_SECRET=
PORT=3000
EVAL_BASE_URL=http://4.224.186.213/evaluation-service
```

## Endpoint

```http
GET http://localhost:3000/api/schedule
```

The endpoint gets a fresh access token, fetches depots and vehicles, logs events, runs 0/1 knapsack for each depot, and returns:

```json
{
  "success": true,
  "depotSchedules": []
}
```
