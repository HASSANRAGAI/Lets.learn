"""
Achievement Model for MongoDB
Stores badges and achievements earned by users.
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field


class AchievementDefinition(Document):
    """Defines available achievements/badges."""
    
    achievement_id: str = Field(..., description="Unique achievement identifier")
    title: str
    title_ar: str  # Arabic translation
    description: str
    description_ar: str  # Arabic translation
    
    # Badge details
    icon: str = Field(default="🏆")
    category: str = Field(default="general")  # general, coding, creativity, streak
    
    # Requirements
    requirement_type: str  # lessons_completed, coins_earned, streak_days, etc.
    requirement_value: int
    
    # Rewards
    coins_reward: int = Field(default=0)
    
    # Fun factor - humorous descriptions for kids
    funny_message: str = Field(default="")
    funny_message_ar: str = Field(default="")
    
    class Settings:
        name = "achievement_definitions"
        
    class Config:
        json_schema_extra = {
            "example": {
                "achievement_id": "first_move",
                "title": "First Steps!",
                "title_ar": "الخطوات الأولى!",
                "description": "Complete your first lesson",
                "description_ar": "أكمل درسك الأول",
                "icon": "👣",
                "category": "general",
                "requirement_type": "lessons_completed",
                "requirement_value": 1,
                "coins_reward": 10,
                "funny_message": "You just made a cat walk! What's next, flying pigs?",
                "funny_message_ar": "لقد جعلت قطة تمشي! ما التالي، خنازير طائرة؟"
            }
        }


class Achievement(Document):
    """User's earned achievements."""
    
    user_id: str
    achievement_id: str
    
    # When earned
    earned_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Context when earned
    context: Optional[str] = None  # e.g., "Completed lesson: Meet Scratch"
    
    class Settings:
        name = "achievements"
        
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "achievement_id": "robot_burp",
                "context": "Made the robot character burp in playground"
            }
        }
