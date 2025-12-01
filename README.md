# Lets Learn 🎮

A fun and interactive web app that teaches 7-year-old children how to start with Scratch programming. Making learning to code funny, informative, simple, easy, and not boring!

## Features

- 🎨 **Fun & Colorful Interface** - Designed specifically for young learners
- 📱 **PWA Support** - Works offline for learning anywhere
- 🐱 **Scratch Programming** - Kid-friendly introduction to coding concepts
- 🏆 **Achievement System** - Earn badges as you learn
- 🪙 **Scratchy Coins** - Gamified progress system with rewards
- 🌍 **Bilingual Support** - English and Arabic languages
- 🗄️ **MongoDB Database** - Store user data, progress, achievements, and courses

## Project Structure

```
Lets.learn/
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── database/          # MongoDB connection
│   │   ├── models/            # Beanie ODM models
│   │   │   ├── user.py        # User profiles
│   │   │   ├── progress.py    # Learning progress
│   │   │   ├── achievement.py # Badges & achievements
│   │   │   └── course.py      # Courses & lessons
│   │   └── routers/           # API route handlers
│   ├── main.py                # Main API application
│   ├── requirements.txt
│   └── .env.example           # Environment variables template
├── frontend/                  # Next.js frontend with PWA
│   ├── src/
│   │   └── app/               # Next.js App Router pages
│   ├── public/                # Static assets & PWA manifest
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Database Setup (MongoDB)

1. Install MongoDB locally or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)

2. Create environment file:
```bash
cd backend
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=lets_learn
```

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

## Database Models

### User
- Profile information (username, display name, avatar)
- Gamification data (Scratchy Coins, unlocked skins)
- Language preference (English/Arabic)

### Progress
- Lesson and course completion tracking
- Time spent learning
- Daily streaks

### Achievement
- Humorous badges (e.g., "You just made a robot burp!")
- Bilingual titles and descriptions
- Coin rewards

### Course & Lesson
- Bilingual content (English/Arabic)
- Interactive elements (puzzles, activities, videos)
- Cartoon character jokes and hints

## Tech Stack

- **Backend**: Python 3.12+, FastAPI, Uvicorn
- **Database**: MongoDB with Motor (async driver) & Beanie ODM
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **PWA**: next-pwa for offline support

## License

MIT