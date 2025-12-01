"""
User Model for MongoDB
Stores user profile information for kids and parents/teachers.
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field


class User(Document):
    """User document model for MongoDB."""
    
    username: str = Field(..., min_length=3, max_length=50)
    display_name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = None
    password_hash: Optional[str] = None  # Hashed password for authentication
    avatar: Optional[str] = Field(default="default_avatar")
    role: str = Field(default="student")  # student, parent, teacher
    
    # Gamification
    scratchy_coins: int = Field(default=0)
    unlocked_skins: List[str] = Field(default_factory=list)
    
    # Settings
    preferred_language: str = Field(default="en")  # en, ar
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Settings:
        name = "users"
        
    class Config:
        json_schema_extra = {
            "example": {
                "username": "scratch_kid",
                "display_name": "Alex",
                "role": "student",
                "scratchy_coins": 150,
                "preferred_language": "en"
            }
        }
