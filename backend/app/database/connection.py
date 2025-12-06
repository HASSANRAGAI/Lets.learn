"""
MongoDB Database Connection Configuration
Uses Motor (async MongoDB driver) with Beanie ODM
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection settings
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "lets_learn")


async def init_db():
    """Initialize MongoDB connection and Beanie ODM."""
    from app.models.user import User
    from app.models.progress import Progress
    from app.models.achievement import Achievement, AchievementDefinition
    from app.models.course import Course, Lesson

    client = AsyncIOMotorClient(MONGODB_URL)
    
    await init_beanie(
        database=client[DATABASE_NAME],
        document_models=[User, Progress, Achievement, AchievementDefinition, Course, Lesson]
    )


async def close_db():
    """Close MongoDB connection."""
    # Motor handles connection pooling, explicit close not typically needed
    pass
