"""
Badges Router
Handles badge definitions and user achievements.
"""

from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.models.achievement import AchievementDefinition

router = APIRouter(prefix="/api/badges", tags=["Badges"])


class BadgeResponse(BaseModel):
    """Badge definition response."""
    id: str
    title: str
    title_ar: str
    description: str
    description_ar: str
    icon: str
    category: str
    requirement_type: str
    requirement_value: int
    coins_reward: int
    funny_message: str
    funny_message_ar: str


@router.get("/", response_model=List[BadgeResponse])
async def get_all_badges():
    """Get all available badge definitions."""
    badges = await AchievementDefinition.find_all().to_list()
    
    return [
        BadgeResponse(
            id=badge.achievement_id,
            title=badge.title,
            title_ar=badge.title_ar,
            description=badge.description,
            description_ar=badge.description_ar,
            icon=badge.icon,
            category=badge.category,
            requirement_type=badge.requirement_type,
            requirement_value=badge.requirement_value,
            coins_reward=badge.coins_reward,
            funny_message=badge.funny_message,
            funny_message_ar=badge.funny_message_ar,
        )
        for badge in badges
    ]
