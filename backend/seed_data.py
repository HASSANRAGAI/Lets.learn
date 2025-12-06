"""
Database Seed Script
Populates MongoDB with initial lessons, daily challenges, and badge definitions.
Run this script once to initialize the database with default data.
"""

import asyncio
from app.database.connection import init_db
from app.models.course import Lesson
from app.models.achievement import AchievementDefinition


async def seed_lessons():
    """Seed initial lessons into the database."""
    print("Seeding lessons...")
    
    # Check if lessons already exist
    existing_lessons = await Lesson.find_all().to_list()
    if existing_lessons:
        print(f"Found {len(existing_lessons)} existing lessons. Skipping lesson seeding.")
        return
    
    lessons_data = [
        {
            "lesson_id": "lesson_001",
            "course_id": "scratch_basics",
            "title": "Meet Scratch the Cat!",
            "title_ar": "تعرف على القط سكراتش!",
            "description": "Learn about your new friend Scratch and how to make him move!",
            "description_ar": "تعرف على صديقك الجديد سكراتش وكيف تجعله يتحرك!",
            "order": 1,
            "difficulty": "easy",
            "duration_minutes": 10,
            "coins_reward": 10,
            "character_name": "Scratchy",
            "character_intro_joke": "Why did the cat sit on the computer? To keep an eye on the mouse! 🐱",
        },
        {
            "lesson_id": "lesson_002",
            "course_id": "scratch_basics",
            "title": "Making Scratch Dance",
            "title_ar": "اجعل سكراتش يرقص",
            "description": "Teach Scratch some cool dance moves with simple commands!",
            "description_ar": "علم سكراتش بعض حركات الرقص الرائعة بأوامر بسيطة!",
            "order": 2,
            "difficulty": "easy",
            "duration_minutes": 15,
            "coins_reward": 15,
            "character_name": "Scratchy",
            "character_intro_joke": "What do you call a dancing cat? A meow-ver and shaker! 💃",
        },
        {
            "lesson_id": "lesson_003",
            "course_id": "scratch_basics",
            "title": "Scratch Says Hello!",
            "title_ar": "سكراتش يقول مرحبا!",
            "description": "Make Scratch talk and say funny things!",
            "description_ar": "اجعل سكراتش يتكلم ويقول أشياء مضحكة!",
            "order": 3,
            "difficulty": "easy",
            "duration_minutes": 10,
            "coins_reward": 10,
            "character_name": "Scratchy",
            "character_intro_joke": "Knock knock! Who's there? Scratch. Scratch who? Scratch my back and I'll teach you to code! 😄",
        },
    ]
    
    for lesson_data in lessons_data:
        lesson = Lesson(**lesson_data)
        await lesson.insert()
        print(f"  ✓ Created lesson: {lesson.title}")
    
    print(f"Successfully seeded {len(lessons_data)} lessons!")


async def seed_daily_challenges():
    """Seed daily challenges as lessons with a special category."""
    print("Seeding daily challenges...")
    
    # Check if daily challenges already exist
    existing_challenges = await Lesson.find(Lesson.course_id == "daily_challenges").to_list()
    if existing_challenges:
        print(f"Found {len(existing_challenges)} existing daily challenges. Skipping daily challenge seeding.")
        return
    
    challenges_data = [
        {
            "lesson_id": "dc_001",
            "course_id": "daily_challenges",
            "title": "Make the Cat Dance!",
            "title_ar": "اجعل القط يرقص!",
            "description": "Help Scratch learn a cool dance move",
            "description_ar": "ساعد سكراتش ليتعلم حركة رقص رائعة",
            "order": 1,
            "difficulty": "easy",
            "duration_minutes": 5,
            "coins_reward": 15,
            "character_name": "Scratchy",
            "character_intro_joke": "Why do cats make terrible DJs? Because they always paws the music! 🎵",
        },
        {
            "lesson_id": "dc_002",
            "course_id": "daily_challenges",
            "title": "Say Hello Three Times!",
            "title_ar": "قل مرحبا ثلاث مرات!",
            "description": "Make Scratch greet everyone",
            "description_ar": "اجعل سكراتش يحيي الجميع",
            "order": 2,
            "difficulty": "easy",
            "duration_minutes": 5,
            "coins_reward": 20,
            "character_name": "Scratchy",
            "character_intro_joke": "What did the computer say to Scratch? You're a-meow-zing! 😸",
        },
        {
            "lesson_id": "dc_003",
            "course_id": "daily_challenges",
            "title": "Move in a Square!",
            "title_ar": "تحرك في مربع!",
            "description": "Can you make Scratch walk in a square?",
            "description_ar": "هل يمكنك جعل سكراتش يمشي في مربع؟",
            "order": 3,
            "difficulty": "medium",
            "duration_minutes": 5,
            "coins_reward": 25,
            "character_name": "Scratchy",
            "character_intro_joke": "Why did the square go to therapy? It had too many issues! 😂",
        },
        {
            "lesson_id": "dc_004",
            "course_id": "daily_challenges",
            "title": "Color Change Magic!",
            "title_ar": "سحر تغيير الألوان!",
            "description": "Make Scratch change colors like magic!",
            "description_ar": "اجعل سكراتش يغير ألوانه كالسحر!",
            "order": 4,
            "difficulty": "easy",
            "duration_minutes": 5,
            "coins_reward": 20,
            "character_name": "Scratchy",
            "character_intro_joke": "What's a cat's favorite color? Purrrrple! 💜",
        },
        {
            "lesson_id": "dc_005",
            "course_id": "daily_challenges",
            "title": "Hide and Seek!",
            "title_ar": "الغميضة!",
            "description": "Make Scratch disappear and reappear!",
            "description_ar": "اجعل سكراتش يختفي ويظهر!",
            "order": 5,
            "difficulty": "easy",
            "duration_minutes": 5,
            "coins_reward": 15,
            "character_name": "Scratchy",
            "character_intro_joke": "Where do cats go when they disappear? The purr-allel universe! 🌌",
        },
        {
            "lesson_id": "dc_006",
            "course_id": "daily_challenges",
            "title": "Sound Effects Master!",
            "title_ar": "سيد المؤثرات الصوتية!",
            "description": "Add funny sounds to Scratch",
            "description_ar": "أضف أصوات مضحكة لسكراتش",
            "order": 6,
            "difficulty": "easy",
            "duration_minutes": 5,
            "coins_reward": 20,
            "character_name": "Scratchy",
            "character_intro_joke": "What sound does a cat computer make? Click, click, meow! 🖱️",
        },
        {
            "lesson_id": "dc_007",
            "course_id": "daily_challenges",
            "title": "Loop de Loop!",
            "title_ar": "حلقة دي حلقة!",
            "description": "Use a loop to make Scratch spin around",
            "description_ar": "استخدم حلقة لجعل سكراتش يدور",
            "order": 7,
            "difficulty": "medium",
            "duration_minutes": 5,
            "coins_reward": 25,
            "character_name": "Scratchy",
            "character_intro_joke": "Why did the cat keep spinning? It was caught in a fur-loop! 🔄",
        },
    ]
    
    for challenge_data in challenges_data:
        challenge = Lesson(**challenge_data)
        await challenge.insert()
        print(f"  ✓ Created daily challenge: {challenge.title}")
    
    print(f"Successfully seeded {len(challenges_data)} daily challenges!")


async def seed_badge_definitions():
    """Seed badge definitions into the database."""
    print("Seeding badge definitions...")
    
    # Check if badges already exist
    existing_badges = await AchievementDefinition.find_all().to_list()
    if existing_badges:
        print(f"Found {len(existing_badges)} existing badge definitions. Skipping badge seeding.")
        return
    
    badges_data = [
        {
            "achievement_id": "first_steps",
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
            "funny_message_ar": "لقد جعلت قطة تمشي! ما التالي، خنازير طائرة؟",
        },
        {
            "achievement_id": "robot_burp",
            "title": "Robot Burp!",
            "title_ar": "تجشؤ الروبوت!",
            "description": "You just made a robot burp!",
            "description_ar": "لقد جعلت الروبوت يتجشأ!",
            "icon": "🤖",
            "category": "coding",
            "requirement_type": "special_action",
            "requirement_value": 1,
            "coins_reward": 15,
            "funny_message": "BURRRP! That robot needs some manners!",
            "funny_message_ar": "بررررب! هذا الروبوت يحتاج بعض الأدب!",
        },
        {
            "achievement_id": "dance_king",
            "title": "Dance King!",
            "title_ar": "ملك الرقص!",
            "description": "Made Scratch dance for the first time",
            "description_ar": "جعلت سكراتش يرقص لأول مرة",
            "icon": "💃",
            "category": "creativity",
            "requirement_type": "dance_lesson_completed",
            "requirement_value": 1,
            "coins_reward": 15,
            "funny_message": "Scratch has got the moves! Can YOU dance like that?",
            "funny_message_ar": "سكراتش يرقص بروعة! هل تستطيع الرقص مثله؟",
        },
        {
            "achievement_id": "chatty_cat",
            "title": "Chatty Cat!",
            "title_ar": "قط ثرثار!",
            "description": "Made Scratch say 5 things",
            "description_ar": "جعلت سكراتش يقول 5 أشياء",
            "icon": "💬",
            "category": "creativity",
            "requirement_type": "speech_blocks_used",
            "requirement_value": 5,
            "coins_reward": 20,
            "funny_message": "Scratch talks more than my grandma now!",
            "funny_message_ar": "سكراتش يتكلم أكثر من جدتي الآن!",
        },
        {
            "achievement_id": "streak_3",
            "title": "3 Day Streak!",
            "title_ar": "سلسلة 3 أيام!",
            "description": "Learn for 3 days in a row",
            "description_ar": "تعلم لمدة 3 أيام متتالية",
            "icon": "🔥",
            "category": "streak",
            "requirement_type": "streak_days",
            "requirement_value": 3,
            "coins_reward": 25,
            "funny_message": "You're on fire! Not literally though, stay cool! 🧊",
            "funny_message_ar": "أنت مشتعل! ليس حرفياً، ابق هادئاً! 🧊",
        },
        {
            "achievement_id": "puzzle_master",
            "title": "Puzzle Master!",
            "title_ar": "سيد الألغاز!",
            "description": "Complete 5 puzzle games",
            "description_ar": "أكمل 5 ألعاب ألغاز",
            "icon": "🧩",
            "category": "coding",
            "requirement_type": "puzzles_completed",
            "requirement_value": 5,
            "coins_reward": 30,
            "funny_message": "You solved puzzles like a detective! 🕵️",
            "funny_message_ar": "حللت الألغاز مثل المحقق! 🕵️",
        },
        {
            "achievement_id": "coin_collector",
            "title": "Coin Collector!",
            "title_ar": "جامع العملات!",
            "description": "Earn 100 Scratchy Coins",
            "description_ar": "اكسب 100 عملة سكراتشي",
            "icon": "🪙",
            "category": "general",
            "requirement_type": "total_coins",
            "requirement_value": 100,
            "coins_reward": 50,
            "funny_message": "Cha-ching! You're rich in Scratchy Coins! 💰",
            "funny_message_ar": "تشا-تشينغ! أنت غني بعملات سكراتشي! 💰",
        },
    ]
    
    for badge_data in badges_data:
        badge = AchievementDefinition(**badge_data)
        await badge.insert()
        print(f"  ✓ Created badge: {badge.title}")
    
    print(f"Successfully seeded {len(badges_data)} badge definitions!")


async def main():
    """Main function to run all seeding operations."""
    print("=" * 60)
    print("Starting Database Seeding...")
    print("=" * 60)
    
    # Initialize database connection
    await init_db()
    
    # Run all seeding operations
    await seed_lessons()
    print()
    await seed_daily_challenges()
    print()
    await seed_badge_definitions()
    
    print()
    print("=" * 60)
    print("Database seeding completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
