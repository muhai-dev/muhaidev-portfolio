# muhaidev-portfolio

Portfolio website with React frontend and Node.js Express backend for contact form submissions.

## Project Structure

```
port-folio/
├── src/                 # React frontend (Vite)
├── backend/             # Express API server
│   ├── config/         # Database config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose schemas
│   └── routes/         # API routes
└── ...
```

## Environment Variables

**⚠️ WARNING: Never commit `.env` files to Git!** They contain secrets. Use `.env.example` as a template.

### Frontend (optional)

Create `.env` in project root for custom API URL:

```bash
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000
```

### Backend (required)

See Backend Setup below.

## Frontend Setup

```bash
npm install
npm run dev
```

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

**⚠️ IMPORTANT: Never commit your `.env` file to Git!** It contains secrets like your database password.

Create a `.env` file in the `backend/` folder:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
FRONTEND_URL=http://localhost:5173
```

- **MONGO_URI**: Get a free MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/atlas)
- **FRONTEND_URL**: Your frontend URL (for CORS). Use `http://localhost:5173` for local dev.

### 3. Run the server

```bash
npm run dev
```

## API

- `POST /api/contact` - Submit contact form (rate limited: 5 requests/hour per IP)
- `GET /api/health` - Health check
