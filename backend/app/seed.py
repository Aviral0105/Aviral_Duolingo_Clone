from .database import SessionLocal, engine, Base
from .models import User, Course, Unit, Lesson, Exercise, UserProgress

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # If already seeded, skip
    if db.query(Course).first():
        db.close()
        return

    # 1. Create Default User (Matching Aviral's Profile)
    user = User(
        id=1,
        username="Aviral Jain",
        handle="@AVIRALJAIN213584",
        avatar="🧑",
        xp=265,
        streak=3,
        hearts=5,
        gems=126,
        daily_goal_xp=10,
        is_super=False
    )
    db.add(user)

    # 2. Create Course (Spanish)
    course = Course(
        id=1,
        code="es",
        title="Spanish",
        flag="🇪🇸"
    )
    db.add(course)
    db.commit()

    # 3. Create Unit 1
    unit1 = Unit(
        id=1,
        course_id=course.id,
        order_index=1,
        section_title="SECTION 1, UNIT 1",
        title="Order at a café",
        description="Greet people, order food and drinks at a café"
    )
    db.add(unit1)
    db.commit()

    # 4. Create Lessons for Unit 1
    lessons_data = [
        {"id": 1, "order_index": 1, "title": "Basics 1", "icon": "star", "xp_reward": 10},
        {"id": 2, "order_index": 2, "title": "Greetings", "icon": "star", "xp_reward": 10},
        {"id": 3, "order_index": 3, "title": "Café Audio", "icon": "headphones", "xp_reward": 15},
        {"id": 4, "order_index": 4, "title": "Unit Milestone", "icon": "chest", "xp_reward": 25},
        {"id": 5, "order_index": 5, "title": "Café Stories", "icon": "camera", "xp_reward": 20},
    ]

    for ld in lessons_data:
        l = Lesson(
            id=ld["id"],
            unit_id=unit1.id,
            order_index=ld["order_index"],
            title=ld["title"],
            icon=ld["icon"],
            xp_reward=ld["xp_reward"]
        )
        db.add(l)
    db.commit()

    # 5. Add ALL 5 EXERCISE TYPES to Lesson 1 (Mandated by assignment page 2)
    exercises = [
        # 1. MULTIPLE CHOICE (Matches User's Screenshot Exactly)
        Exercise(
            lesson_id=1,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt="Select the correct image",
            audio_text="café",
            content={
                "target_word": "café",
                "options": [
                    {"id": "opt1", "text": "croissant", "icon": "🥐"},
                    {"id": "opt2", "text": "eclair", "icon": "🥖"},
                    {"id": "opt3", "text": "tea", "icon": "🍵"},
                    {"id": "opt4", "text": "coffee", "icon": "☕"}
                ]
            },
            correct_answer="coffee"
        ),
        # 2. WORD BANK / TAP-THE-WORDS
        Exercise(
            lesson_id=1,
            order_index=2,
            type="WORD_BANK",
            category_tag="TRANSLATE",
            prompt="Translate this sentence",
            audio_text="El niño bebe leche",
            content={
                "sentence_to_translate": "The boy drinks milk",
                "word_pool": ["El", "niño", "bebe", "leche", "manzana", "agua", "la"]
            },
            correct_answer="El niño bebe leche"
        ),
        # 3. MATCH PAIRS
        Exercise(
            lesson_id=1,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            audio_text=None,
            content={
                "pairs": [
                    {"es": "Hola", "en": "Hello"},
                    {"es": "Agua", "en": "Water"},
                    {"es": "Pan", "en": "Bread"},
                    {"es": "Gracias", "en": "Thank you"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        # 4. FILL IN THE BLANK
        Exercise(
            lesson_id=1,
            order_index=4,
            type="FILL_BLANK",
            category_tag="FILL BLANK",
            prompt="Complete the sentence",
            audio_text="Yo bebo agua",
            content={
                "prefix": "Yo",
                "suffix": "agua.",
                "options": ["bebo", "bebe", "bebes"]
            },
            correct_answer="bebo"
        ),
        # 5. TYPE THE ANSWER
        Exercise(
            lesson_id=1,
            order_index=5,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in Spanish",
            audio_text="Buenos días",
            content={
                "sentence_to_translate": "Good morning",
                "hint": "B____ d___"
            },
            correct_answer="Buenos días"
        )
    ]
    for ex in exercises:
        db.add(ex)
    db.commit()

    # 6. Initialize Lesson 1 as available, others locked
    prog1 = UserProgress(
        user_id=1,
        lesson_id=1,
        is_completed=False,
        crowns=0
    )
    db.add(prog1)
    db.commit()

    db.close()
    print("Database successfully seeded with Spanish course and 5 exercise types.")

if __name__ == "__main__":
    seed_database()
