from datetime import datetime
from .database import SessionLocal, engine, Base
from .models import User, Course, Unit, Lesson, Exercise, UserProgress

def seed_database(force: bool = False):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # If force, clear old data first
    if force:
        db.query(UserProgress).delete()
        db.query(Exercise).delete()
        db.query(Lesson).delete()
        db.query(Unit).delete()
        db.query(Course).delete()
        db.query(User).delete()
        db.commit()
    elif db.query(Course).first():
        # If already seeded with Hindi, skip
        existing_course = db.query(Course).first()
        if existing_course and existing_course.code == "hi":
            db.close()
            return
        else:
            # Upgrade legacy Spanish/French seed to Hindi
            db.query(UserProgress).delete()
            db.query(Exercise).delete()
            db.query(Lesson).delete()
            db.query(Unit).delete()
            db.query(Course).delete()
            db.query(User).delete()
            db.commit()

    # 1. Create Sample Learner (Aviral Jain with active streak and progress)
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
        is_super=False,
        last_active_date=datetime.utcnow()
    )
    db.add(user)

    # 2. Create Language Course: Hindi 1 (हिन्दी)
    course = Course(
        id=1,
        code="hi",
        title="Hindi",
        flag="🇮🇳"
    )
    db.add(course)
    db.commit()

    # 3. Unit 1: Form basic sentences
    unit1 = Unit(
        id=1,
        course_id=course.id,
        order_index=1,
        section_title="SECTION 1, UNIT 1",
        title="Form basic sentences",
        description="Identify basic objects, people, and simple sentence structures in Hindi"
    )
    db.add(unit1)

    # Unit 2: Greet people & describe things
    unit2 = Unit(
        id=2,
        course_id=course.id,
        order_index=2,
        section_title="SECTION 1, UNIT 2",
        title="Greet people & describe things",
        description="Learn everyday greetings, polite expressions, colors, and numbers"
    )
    db.add(unit2)

    # Unit 3: Talk about family & food
    unit3 = Unit(
        id=3,
        course_id=course.id,
        order_index=3,
        section_title="SECTION 1, UNIT 3",
        title="Talk about family & food",
        description="Describe family members, daily meals, and favorite Indian drinks"
    )
    db.add(unit3)
    db.commit()

    # 4. Lessons for Unit 1, 2, and 3
    lessons_data = [
        # Unit 1 Lessons
        {"id": 1, "unit_id": unit1.id, "order_index": 1, "title": "Basics 1", "icon": "star", "xp_reward": 10},
        {"id": 2, "unit_id": unit1.id, "order_index": 2, "title": "Basics 2", "icon": "star", "xp_reward": 10},
        {"id": 3, "unit_id": unit1.id, "order_index": 3, "title": "Phrases 1", "icon": "headphones", "xp_reward": 15},
        {"id": 4, "unit_id": unit1.id, "order_index": 4, "title": "Unit 1 Milestone", "icon": "chest", "xp_reward": 25},
        # Unit 2 Lessons
        {"id": 5, "unit_id": unit2.id, "order_index": 1, "title": "Greetings", "icon": "star", "xp_reward": 10},
        {"id": 6, "unit_id": unit2.id, "order_index": 2, "title": "Questions", "icon": "headphones", "xp_reward": 15},
        {"id": 7, "unit_id": unit2.id, "order_index": 3, "title": "Unit 2 Milestone", "icon": "chest", "xp_reward": 25},
        # Unit 3 Lessons
        {"id": 8, "unit_id": unit3.id, "order_index": 1, "title": "Family 1", "icon": "star", "xp_reward": 10},
        {"id": 9, "unit_id": unit3.id, "order_index": 2, "title": "Food & Drinks", "icon": "camera", "xp_reward": 20},
        {"id": 10, "unit_id": unit3.id, "order_index": 3, "title": "Section 1 Trophy", "icon": "chest", "xp_reward": 50},
    ]

    for ld in lessons_data:
        l = Lesson(
            id=ld["id"],
            unit_id=ld["unit_id"],
            order_index=ld["order_index"],
            title=ld["title"],
            icon=ld["icon"],
            xp_reward=ld["xp_reward"]
        )
        db.add(l)
    db.commit()

    # 5. Exercises for Lesson 1 (Matches user's Hindi 1 video recording with all 5 types)
    exercises_lesson_1 = [
        # 1. MULTIPLE CHOICE
        Exercise(
            lesson_id=1,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "Man"?',
            audio_text="आदमी",
            content={
                "target_word": "आदमी",
                "options": [
                    {"id": "opt1", "text": "किताब", "icon": "📖"},
                    {"id": "opt2", "text": "औरत", "icon": "👩"},
                    {"id": "opt3", "text": "आदमी", "icon": "🧔"}
                ]
            },
            correct_answer="आदमी"
        ),
        # 2. WORD BANK (Translate to English)
        Exercise(
            lesson_id=1,
            order_index=2,
            type="WORD_BANK",
            category_tag="TRANSLATE",
            prompt="Write this in English",
            audio_text="वह औरत",
            content={
                "sentence_to_translate": "वह औरत",
                "word_pool": ["That", "woman", "apple", "man", "boy", "water"]
            },
            correct_answer="That woman"
        ),
        # 3. WORD BANK (Tap what you hear with Snail audio)
        Exercise(
            lesson_id=1,
            order_index=3,
            type="WORD_BANK",
            category_tag="LISTEN",
            prompt="Tap what you hear",
            audio_text="एक सेब",
            content={
                "sentence_to_translate": "एक सेब",
                "word_pool": ["एक", "सेब", "किताब", "लड़का", "औरत", "पानी"]
            },
            correct_answer="एक सेब"
        ),
        # 4. MATCH PAIRS
        Exercise(
            lesson_id=1,
            order_index=4,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            audio_text=None,
            content={
                "pairs": [
                    {"hi": "नमस्ते", "en": "Hello"},
                    {"hi": "किताब", "en": "Book"},
                    {"hi": "पानी", "en": "Water"},
                    {"hi": "औरत", "en": "Woman"},
                    {"hi": "आदमी", "en": "Man"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        # 5. FILL IN THE BLANK
        Exercise(
            lesson_id=1,
            order_index=5,
            type="FILL_BLANK",
            category_tag="FILL BLANK",
            prompt="Complete the sentence",
            audio_text="यह एक सेब है",
            content={
                "prefix": "यह एक",
                "suffix": "है।",
                "options": ["सेब", "पानी", "किताबें"]
            },
            correct_answer="सेब"
        ),
        # 6. TYPE THE ANSWER
        Exercise(
            lesson_id=1,
            order_index=6,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="यह पानी है",
            content={
                "sentence_to_translate": "यह पानी है",
                "hint": "This is water"
            },
            correct_answer="This is water"
        )
    ]

    for ex in exercises_lesson_1:
        db.add(ex)

    # Exercises for Lesson 2 (Basics 2)
    exercises_lesson_2 = [
        Exercise(
            lesson_id=2,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "Woman"?',
            audio_text="औरत",
            content={
                "target_word": "औरत",
                "options": [
                    {"id": "opt1", "text": "औरत", "icon": "👩"},
                    {"id": "opt2", "text": "लड़का", "icon": "👦"},
                    {"id": "opt3", "text": "घर", "icon": "🏠"}
                ]
            },
            correct_answer="औरत"
        ),
        Exercise(
            lesson_id=2,
            order_index=2,
            type="WORD_BANK",
            category_tag="TRANSLATE",
            prompt="Translate this sentence",
            audio_text="यह एक लड़का है",
            content={
                "sentence_to_translate": "This is a boy",
                "word_pool": ["यह", "एक", "लड़का", "है", "लड़की", "दूध"]
            },
            correct_answer="यह एक लड़का है"
        ),
        Exercise(
            lesson_id=2,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            audio_text=None,
            content={
                "pairs": [
                    {"hi": "लड़का", "en": "Boy"},
                    {"hi": "लड़की", "en": "Girl"},
                    {"hi": "सेब", "en": "Apple"},
                    {"hi": "दूध", "en": "Milk"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=2,
            order_index=4,
            type="FILL_BLANK",
            category_tag="FILL BLANK",
            prompt="Complete the sentence",
            audio_text="वह पानी पीता है",
            content={
                "prefix": "वह",
                "suffix": "पीता है।",
                "options": ["पानी", "किताब", "सेब"]
            },
            correct_answer="पानी"
        ),
        Exercise(
            lesson_id=2,
            order_index=5,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="लड़का दूध पीता है",
            content={
                "sentence_to_translate": "लड़का दूध पीता है",
                "hint": "The boy drinks milk"
            },
            correct_answer="The boy drinks milk"
        )
    ]

    for ex in exercises_lesson_2:
        db.add(ex)

    # Exercises for Lesson 3 (Phrases 1)
    exercises_lesson_3 = [
        Exercise(
            lesson_id=3,
            order_index=1,
            type="WORD_BANK",
            category_tag="LISTEN",
            prompt="Tap what you hear",
            audio_text="नमस्ते",
            content={
                "sentence_to_translate": "नमस्ते",
                "word_pool": ["नमस्ते", "हाँ", "नहीं", "धन्यवाद"]
            },
            correct_answer="नमस्ते"
        ),
        Exercise(
            lesson_id=3,
            order_index=2,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            audio_text=None,
            content={
                "pairs": [
                    {"hi": "हाँ", "en": "Yes"},
                    {"hi": "नहीं", "en": "No"},
                    {"hi": "धन्यवाद", "en": "Thank you"},
                    {"hi": "शुभ प्रभात", "en": "Good morning"}
                ]
            },
            correct_answer="ALL_MATCHED"
        )
    ]

    for ex in exercises_lesson_3:
        db.add(ex)

    db.commit()

    # 6. Sample Learner Progress:
    # Learner has completed Lesson 1 with 1 crown!
    # Lesson 2 is next available, while Unit 2 and 3 provide upcoming progression.
    prog1 = UserProgress(
        user_id=user.id,
        lesson_id=1,
        is_completed=True,
        crowns=1,
        completed_at=datetime.utcnow()
    )
    db.add(prog1)
    db.commit()
    db.close()
    print("Database successfully seeded with Hindi 1 course, units, varied exercises, and sample learner progress!")
