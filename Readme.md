# PayAssured CRM – Invoice Recovery Tracker

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL

## Setup

### 1. Database
```bash
psql -U postgres -c "CREATE DATABASE payassured;"
psql -U postgres -d payassured -f db/schema.sql
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your DB credentials
uvicorn main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /clients | Create client |
| GET | /clients | List clients |
| POST | /cases | Create case |
| GET | /cases?status=&sort= | List cases with filters |
| GET | /cases/{id} | Get case detail |
| PATCH | /cases/{id} | Update status / notes |