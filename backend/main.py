"""
Lets Learn Backend API
A backend service for the Lets Learn educational platform
that teaches 7-year-old children Scratch programming.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import init_db
from app.routers import auth, progress


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
    
    # Try to get lessons from MongoDB, fallback to defaults if empty
    lessons = await Lesson.find_all().to_list()
    
    if lessons:
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
    
    # Default lessons if database is empty
    return {
        "lessons": [
            {
                "id": 1,
                "title": "Meet Scratch the Cat!",
                "title_ar": "تعرف على القط سكراتش!",
                "description": "Learn about your new friend Scratch and how to make him move!",
                "description_ar": "تعرف على صديقك الجديد سكراتش وكيف تجعله يتحرك!",
                "difficulty": "easy",
                "duration_minutes": 10,
                "coins_reward": 10,
                "character_name": "Scratchy",
                "character_joke": "Why did the cat sit on the computer? To keep an eye on the mouse! 🐱"
            },
            {
                "id": 2,
                "title": "Making Scratch Dance",
                "title_ar": "اجعل سكراتش يرقص",
                "description": "Teach Scratch some cool dance moves with simple commands!",
                "description_ar": "علم سكراتش بعض حركات الرقص الرائعة بأوامر بسيطة!",
                "difficulty": "easy",
                "duration_minutes": 15,
                "coins_reward": 15,
                "character_name": "Scratchy",
                "character_joke": "What do you call a dancing cat? A meow-ver and shaker! 💃"
            },
            {
                "id": 3,
                "title": "Scratch Says Hello!",
                "title_ar": "سكراتش يقول مرحبا!",
                "description": "Make Scratch talk and say funny things!",
                "description_ar": "اجعل سكراتش يتكلم ويقول أشياء مضحكة!",
                "difficulty": "easy",
                "duration_minutes": 10,
                "coins_reward": 10,
                "character_name": "Scratchy",
                "character_joke": "Knock knock! Who's there? Scratch. Scratch who? Scratch my back and I'll teach you to code! 😄"
            }
        ]
    }

