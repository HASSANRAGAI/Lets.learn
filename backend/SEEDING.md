# Database Seeding

This directory contains a script to seed the MongoDB database with initial data for the Lets Learn application.

## Running the Seed Script

Make sure MongoDB is running (either locally or via Docker Compose), then run:

```bash
cd backend
python seed_data.py
```

## What Gets Seeded

The seed script populates the database with:

1. **Lessons** (3 lessons in the `scratch_basics` course)
   - Meet Scratch the Cat!
   - Making Scratch Dance
   - Scratch Says Hello!

2. **Daily Challenges** (7 challenges)
   - Make the Cat Dance!
   - Say Hello Three Times!
   - Move in a Square!
   - Color Change Magic!
   - Hide and Seek!
   - Sound Effects Master!
   - Loop de Loop!

3. **Badge Definitions** (7 achievement badges)
   - First Steps!
   - Robot Burp!
   - Dance King!
   - Chatty Cat!
   - 3 Day Streak!
   - Puzzle Master!
   - Coin Collector!

All data includes both English and Arabic translations.

## Idempotency

The seed script is idempotent - it will check if data already exists and skip seeding if found. This means you can safely run it multiple times without creating duplicates.

## Clearing the Database

If you need to reset the database, you can manually delete the collections:

```bash
# Using mongosh
mongosh
use lets_learn
db.lessons.deleteMany({})
db.achievement_definitions.deleteMany({})
```

Then run the seed script again to repopulate with fresh data.
