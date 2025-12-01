"""
Progress and Leaderboard Router
Handles user progress, leaderboards, and daily challenges.
"""

from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from app.models.user import User
from app.models.progress import Progress, LessonProgress
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Progress & Leaderboard"])


# Response Models
class LeaderboardEntry(BaseModel):
    """Leaderboard entry response."""
    rank: int
    user_id: str
    display_name: str
    avatar: str
    scratchy_coins: int


class DailyChallenge(BaseModel):
    """Daily challenge response."""
    id: str
    date: str
    title: str
    title_ar: str
    description: str
    description_ar: str
    coins_reward: int
    joke_of_the_day: str
    joke_of_the_day_ar: str
    puzzle_type: str = "drag-drop"


# Sample daily challenges
DAILY_CHALLENGES = [
    {
        "id": "dc_1",
        "title": "Make the Cat Dance!",
        "title_ar": "اجعل القط يرقص!",
        "description": "Help Scratch learn a cool dance move",
        "description_ar": "ساعد سكراتش ليتعلم حركة رقص رائعة",
        "coins_reward": 15,
        "joke_of_the_day": "Why do cats make terrible DJs? Because they always paws the music! 🎵",
        "joke_of_the_day_ar": "لماذا القطط دي جي سيئون؟ لأنهم دائماً يوقفون الموسيقى! 🎵",
        "puzzle_type": "drag-drop"
    },
    {
        "id": "dc_2",
        "title": "Say Hello Three Times!",
        "title_ar": "قل مرحبا ثلاث مرات!",
        "description": "Make Scratch greet everyone",
        "description_ar": "اجعل سكراتش يحيي الجميع",
        "coins_reward": 20,
        "joke_of_the_day": "What did the computer say to Scratch? You're a-meow-zing! 😸",
        "joke_of_the_day_ar": "ماذا قال الكمبيوتر لسكراتش؟ أنت مياو-ذهل! 😸",
        "puzzle_type": "drag-drop"
    },
    {
        "id": "dc_3",
        "title": "Move in a Square!",
        "title_ar": "تحرك في مربع!",
        "description": "Can you make Scratch walk in a square?",
        "description_ar": "هل يمكنك جعل سكراتش يمشي في مربع؟",
        "coins_reward": 25,
        "joke_of_the_day": "Why did the square go to therapy? It had too many issues! 😂",
        "joke_of_the_day_ar": "لماذا ذهب المربع للعلاج؟ كان لديه مشاكل كثيرة! 😂",
        "puzzle_type": "drag-drop"
    },
    {
        "id": "dc_4",
        "title": "Color Change Magic!",
        "title_ar": "سحر تغيير الألوان!",
        "description": "Make Scratch change colors like magic!",
        "description_ar": "اجعل سكراتش يغير ألوانه كالسحر!",
        "coins_reward": 20,
        "joke_of_the_day": "What's a cat's favorite color? Purrrrple! 💜",
        "joke_of_the_day_ar": "ما هو اللون المفضل للقطط؟ البنفسجي المواء! 💜",
        "puzzle_type": "drag-drop"
    },
    {
        "id": "dc_5",
        "title": "Hide and Seek!",
        "title_ar": "الغميضة!",
        "description": "Make Scratch disappear and reappear!",
        "description_ar": "اجعل سكراتش يختفي ويظهر!",
        "coins_reward": 15,
        "joke_of_the_day": "Where do cats go when they disappear? The purr-allel universe! 🌌",
        "joke_of_the_day_ar": "أين تذهب القطط عندما تختفي؟ إلى الكون المواء-وازي! 🌌",
        "puzzle_type": "drag-drop"
    },
    {
        "id": "dc_6",
        "title": "Sound Effects Master!",
        "title_ar": "سيد المؤثرات الصوتية!",
        "description": "Add funny sounds to Scratch",
        "description_ar": "أضف أصوات مضحكة لسكراتش",
        "coins_reward": 20,
        "joke_of_the_day": "What sound does a cat computer make? Click, click, meow! 🖱️",
        "joke_of_the_day_ar": "ما الصوت الذي يصدره كمبيوتر القط؟ نقر، نقر، مياو! 🖱️",
        "puzzle_type": "drag-drop"
    },
    {
        "id": "dc_7",
        "title": "Loop de Loop!",
        "title_ar": "حلقة دي حلقة!",
        "description": "Use a loop to make Scratch spin around",
        "description_ar": "استخدم حلقة لجعل سكراتش يدور",
        "coins_reward": 25,
        "joke_of_the_day": "Why did the cat keep spinning? It was caught in a fur-loop! 🔄",
        "joke_of_the_day_ar": "لماذا استمرت القطة في الدوران؟ كانت عالقة في حلقة الفرو! 🔄",
        "puzzle_type": "drag-drop"
    },
]


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = 10):
    """Get top users by Scratchy Coins."""
    # Get users sorted by coins
    users = await User.find_all().sort("-scratchy_coins").limit(limit).to_list()
    
    leaderboard = []
    for rank, user in enumerate(users, 1):
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            user_id=str(user.id),
            display_name=user.display_name,
            avatar=user.avatar or "default_avatar",
            scratchy_coins=user.scratchy_coins
        ))
    
    return leaderboard


@router.get("/daily-challenge", response_model=DailyChallenge)
async def get_daily_challenge():
    """Get today's daily challenge."""
    # Get challenge based on day of year
    today = date.today()
    challenge_index = today.timetuple().tm_yday % len(DAILY_CHALLENGES)
    challenge = DAILY_CHALLENGES[challenge_index]
    
    return DailyChallenge(
        id=challenge["id"],
        date=today.isoformat(),
        title=challenge["title"],
        title_ar=challenge["title_ar"],
        description=challenge["description"],
        description_ar=challenge["description_ar"],
        coins_reward=challenge["coins_reward"],
        joke_of_the_day=challenge["joke_of_the_day"],
        joke_of_the_day_ar=challenge["joke_of_the_day_ar"],
        puzzle_type=challenge["puzzle_type"]
    )


@router.post("/daily-challenge/complete")
async def complete_daily_challenge(
    current_user: User = Depends(get_current_user)
):
    """Complete today's daily challenge and earn coins."""
    today = date.today()
    challenge_index = today.timetuple().tm_yday % len(DAILY_CHALLENGES)
    challenge = DAILY_CHALLENGES[challenge_index]
    
    # Check if already completed today
    progress = await Progress.find_one(Progress.user_id == str(current_user.id))
    
    if progress and today.isoformat() in progress.daily_challenges_completed:
        raise HTTPException(
            status_code=400,
            detail="Already completed today's challenge"
        )
    
    # Award coins
    current_user.scratchy_coins += challenge["coins_reward"]
    await current_user.save()
    
    # Update progress
    if not progress:
        progress = Progress(
            user_id=str(current_user.id),
            total_challenges_completed=1,
            daily_challenges_completed=[today.isoformat()]
        )
        await progress.insert()
    else:
        progress.total_challenges_completed += 1
        progress.daily_challenges_completed.append(today.isoformat())
        progress.updated_at = datetime.utcnow()
        await progress.save()
    
    return {
        "message": "Challenge completed!",
        "coins_earned": challenge["coins_reward"],
        "total_coins": current_user.scratchy_coins
    }


@router.get("/progress")
async def get_user_progress(
    current_user: User = Depends(get_current_user)
):
    """Get current user's progress."""
    progress = await Progress.find_one(Progress.user_id == str(current_user.id))
    
    if not progress:
        return {
            "total_lessons_completed": 0,
            "total_courses_completed": 0,
            "total_challenges_completed": 0,
            "total_time_spent_seconds": 0,
            "current_streak": 0,
            "longest_streak": 0
        }
    
    return {
        "total_lessons_completed": progress.total_lessons_completed,
        "total_courses_completed": progress.total_courses_completed,
        "total_challenges_completed": progress.total_challenges_completed,
        "total_time_spent_seconds": progress.total_time_spent_seconds,
        "current_streak": progress.current_streak,
        "longest_streak": progress.longest_streak
    }


@router.post("/progress/lesson/{lesson_id}/complete")
async def complete_lesson(
    lesson_id: str,
    coins_earned: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Mark a lesson as completed."""
    # Award coins
    current_user.scratchy_coins += coins_earned
    await current_user.save()
    
    # Update progress
    progress = await Progress.find_one(Progress.user_id == str(current_user.id))
    
    if not progress:
        progress = Progress(
            user_id=str(current_user.id),
            total_lessons_completed=1,
            last_activity_date=datetime.utcnow(),
            current_streak=1,
            longest_streak=1
        )
        await progress.insert()
    else:
        progress.total_lessons_completed += 1
        
        # Update streak
        today = date.today()
        last_activity = progress.last_activity_date.date() if progress.last_activity_date else None
        
        if last_activity:
            days_diff = (today - last_activity).days
            if days_diff == 1:
                progress.current_streak += 1
            elif days_diff > 1:
                progress.current_streak = 1
        else:
            progress.current_streak = 1
        
        progress.longest_streak = max(progress.longest_streak, progress.current_streak)
        progress.last_activity_date = datetime.utcnow()
        progress.updated_at = datetime.utcnow()
        await progress.save()
    
    return {
        "message": "Lesson completed!",
        "coins_earned": coins_earned,
        "total_coins": current_user.scratchy_coins,
        "current_streak": progress.current_streak
    }
