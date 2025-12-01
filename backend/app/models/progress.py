"""
Progress Model for MongoDB
Tracks user progress through courses, lessons, and challenges.
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field


class LessonProgress(Document):
    """Individual lesson progress tracking."""
    
    user_id: str
    lesson_id: str
    course_id: str
    
    # Progress status
    status: str = Field(default="not_started")  # not_started, in_progress, completed
    completion_percentage: int = Field(default=0, ge=0, le=100)
    
    # Activity tracking
    time_spent_seconds: int = Field(default=0)
    attempts: int = Field(default=0)
    hints_used: int = Field(default=0)
    
    # Rewards earned for this lesson
    coins_earned: int = Field(default=0)
    
    # Timestamps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "lesson_progress"


class Progress(Document):
    """Overall user progress document."""
    
    user_id: str
    
    # Overall stats
    total_lessons_completed: int = Field(default=0)
    total_courses_completed: int = Field(default=0)
    total_challenges_completed: int = Field(default=0)
    total_time_spent_seconds: int = Field(default=0)
    
    # Daily tracking
    current_streak: int = Field(default=0)
    longest_streak: int = Field(default=0)
    last_activity_date: Optional[datetime] = None
    
    # Daily challenges
    daily_challenges_completed: List[str] = Field(default_factory=list)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "progress"
        
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "total_lessons_completed": 5,
                "total_courses_completed": 1,
                "current_streak": 3
            }
        }
