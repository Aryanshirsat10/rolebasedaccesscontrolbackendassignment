# Role-Based Access Control (RBAC) Application

## Project Structure
- `backend/`: Node.js Express backend
- `frontend/`: Next.js frontend application

## Setup

### Backend
1. Navigate to backend directory
```bash
cd backend
npm install
```

2. Create `.env` file:
```
PORT=5000
JWT_SECRET=your_super_secret_key
DB_STORAGE=./database.sqlite
DB_LOGGING=false
```

3. Run backend
```bash
npm run dev
```

### Frontend
1. Navigate to frontend directory
```bash
cd frontend
npm install
```

2. Create `.env.local` file:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

3. Run frontend
```bash
npm run dev
```

## Key Features
- First user automatically becomes admin
- Secure authentication with JWT
- Role-based access control

## Access
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`