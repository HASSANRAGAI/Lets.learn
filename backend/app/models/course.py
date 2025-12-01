"""
Course and Lesson Models for MongoDB
Stores course content, lessons, and learning materials.
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field


class LessonContent(Document):
    """Content block within a lesson."""
    
    content_type: str  # text, video, animation, puzzle, activity
    order: int
    
    # Text content (supports bilingual)
    text: Optional[str] = None
    text_ar: Optional[str] = None
    
    # Media content
    media_url: Optional[str] = None
    
    # For puzzles/activities
    puzzle_data: Optional[dict] = None
    
    # Cartoon character hints/jokes
    character_name: Optional[str] = None
    character_joke: Optional[str] = None
    character_joke_ar: Optional[str] = None


class Lesson(Document):
    """Individual lesson document."""
    
    lesson_id: str = Field(..., description="Unique lesson identifier")
    course_id: str
    
    # Basic info (bilingual)
    title: str
    title_ar: str
    description: str
    description_ar: str
    
    # Lesson metadata
    order: int = Field(default=0)
    difficulty: str = Field(default="easy")  # easy, medium, hard
    duration_minutes: int = Field(default=10)
    
    # Content
    content_blocks: List[dict] = Field(default_factory=list)
    
    # Scratch blocks covered in this lesson
    scratch_blocks: List[str] = Field(default_factory=list)
    
    # Interactive elements
    has_puzzle: bool = Field(default=False)
    has_activity: bool = Field(default=False)
    has_video: bool = Field(default=False)
    
    # Rewards
    coins_reward: int = Field(default=10)
    
    # Cartoon character for this lesson
    character_name: str = Field(default="Scratchy")
    character_intro_joke: Optional[str] = None
    character_intro_joke_ar: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "lessons"
        
    class Config:
        json_schema_extra = {
            "example": {
                "lesson_id": "lesson_001",
                "course_id": "scratch_basics",
                "title": "Meet Scratch the Cat!",
                "title_ar": "تعرف على القط سكراتش!",
                "description": "Learn about your new friend Scratch",
                "description_ar": "تعرف على صديقك الجديد سكراتش",
                "difficulty": "easy",
                "duration_minutes": 10,
                "coins_reward": 10,
                "character_name": "Scratchy",
                "character_intro_joke": "Why did the cat sit on the computer? To keep an eye on the mouse!"
            }
        }


class Course(Document):
    """Course document containing multiple lessons."""
    
    course_id: str = Field(..., description="Unique course identifier")
    
    # Basic info (bilingual)
    title: str
    title_ar: str
    description: str
    description_ar: str
    
    # Course metadata
    difficulty: str = Field(default="beginner")  # beginner, intermediate, advanced
    estimated_hours: float = Field(default=1.0)
    order: int = Field(default=0)
    
    # Visual
    thumbnail: Optional[str] = None
    color_theme: str = Field(default="#4F46E5")
    
    # Course structure
    lesson_ids: List[str] = Field(default_factory=list)
    total_lessons: int = Field(default=0)
    
    # Rewards
    completion_coins: int = Field(default=50)
    completion_badge: Optional[str] = None
    
    # Status
    is_published: bool = Field(default=True)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "courses"
        
    class Config:
        json_schema_extra = {
            "example": {
                "course_id": "scratch_basics",
                "title": "Scratch Basics",
                "title_ar": "أساسيات سكراتش",
                "description": "Learn the basics of Scratch programming",
                "description_ar": "تعلم أساسيات برمجة سكراتش",
                "difficulty": "beginner",
                "total_lessons": 5,
                "completion_coins": 50
            }
        }
