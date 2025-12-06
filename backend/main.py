"""
Lets Learn Backend API
A backend service for the Lets Learn educational platform
that teaches 7-year-old children Scratch programming.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import init_db
from app.routers import auth, progress, badges


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle - initialize and cleanup resources."""
    # Startup: Initialize MongoDB connection
    await init_db()
    yield
    # Shutdown: Cleanup (if needed)


app = FastAPI(
    title="Lets Learn API",
    description="API for the Lets Learn educational platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(progress.router)
app.include_router(badges.router)


@app.get("/")
async def root():
    """Root endpoint returning welcome message."""
    return {"message": "Welcome to Lets Learn API!"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/api/lessons")
async def get_lessons():
    """Get list of Scratch programming lessons for kids."""
    # Import here to avoid circular imports during startup
    from app.models.course import Lesson
    
    # Get lessons from MongoDB (excluding daily challenges)
    lessons = await Lesson.find(Lesson.course_id != "daily_challenges").sort("+order").to_list()
    
    return {
        "lessons": [
            {
                "id": lesson.lesson_id,
                "title": lesson.title,
                "title_ar": lesson.title_ar,
                "description": lesson.description,
                "description_ar": lesson.description_ar,
                "difficulty": lesson.difficulty,
                "duration_minutes": lesson.duration_minutes,
                "coins_reward": lesson.coins_reward,
                "character_name": lesson.character_name,
                "character_joke": lesson.character_intro_joke
            }
            for lesson in lessons
        ]
    }

