# Lets Learn 🎮

A fun and interactive web app that teaches 7-year-old children how to start with Scratch programming. Making learning to code funny, informative, simple, easy, and not boring!

## Features

- 🎨 **Fun & Colorful Interface** - Designed specifically for young learners
- 📱 **PWA Support** - Works offline for learning anywhere
- 🐱 **Scratch Programming** - Kid-friendly introduction to coding concepts
- 🏆 **Achievement System** - Earn badges as you learn

## Project Structure

```
Lets.learn/
├── backend/          # Python FastAPI backend
│   ├── main.py       # Main API application
│   └── requirements.txt
├── frontend/         # Next.js frontend with PWA
│   ├── src/
│   │   └── app/      # Next.js App Router pages
│   ├── public/       # Static assets & PWA manifest
│   └── package.json
└── README.md
```

## Getting Started

### Backend (Python FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend (Next.js with PWA)

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/lessons` - Get list of Scratch lessons

## Tech Stack

- **Backend**: Python 3.12+, FastAPI, Uvicorn
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **PWA**: next-pwa for offline support

## License

MIT