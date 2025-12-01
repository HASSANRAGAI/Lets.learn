"""
Lets Learn Backend API
A backend service for the Lets Learn educational platform
that teaches 7-year-old children Scratch programming.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Lets Learn API",
    description="API for the Lets Learn educational platform",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    return {
        "lessons": [
            {
                "id": 1,
                "title": "Meet Scratch the Cat!",
                "description": "Learn about your new friend Scratch and how to make him move!",
                "difficulty": "easy",
                "duration_minutes": 10
            },
            {
                "id": 2,
                "title": "Making Scratch Dance",
                "description": "Teach Scratch some cool dance moves with simple commands!",
                "difficulty": "easy",
                "duration_minutes": 15
            },
            {
                "id": 3,
                "title": "Scratch Says Hello!",
                "description": "Make Scratch talk and say funny things!",
                "difficulty": "easy",
                "duration_minutes": 10
            }
        ]
    }
