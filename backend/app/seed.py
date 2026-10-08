from datetime import datetime
from .database import SessionLocal, engine, Base
from .models import User, Course, Unit, Lesson, Exercise, UserProgress, UserMistake, UserSetting

def seed_database(force: bool = False):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # If force, drop and recreate all tables
    if force:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    elif db.query(Course).first():
        # Check if full database is already seeded (e.g. >= 10 lessons and settings exist)
        total_exercises = db.query(Exercise).count()
        if total_exercises >= 30 and db.query(UserSetting).first():
            db.close()
            return
        else:
            db.query(UserMistake).delete()
            db.query(UserSetting).delete()
            db.query(UserProgress).delete()
            db.query(Exercise).delete()
            db.query(Lesson).delete()
            db.query(Unit).delete()
            db.query(Course).delete()
            db.query(User).delete()
            db.commit()

    # 1. Create Sample Learner: Aviral Jain
    user = User(
        id=1,
        username="Aviral Jain",
        handle="@AVIRALJAIN51695",
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

    # 1b. Create User Settings
    settings = UserSetting(
        user_id=1,
        sound_effects=True,
        animations=True,
        motivational_messages=True,
        listening_exercises=True,
        speaking_exercises=True,
        dark_mode="system"
    )
    db.add(settings)

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
        description="Learn everyday greetings, polite expressions, colors, and questions"
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

    all_exercises = [
        # ==========================================
        # LESSON 1 (Basics 1)
        # ==========================================
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
        ),

        # ==========================================
        # LESSON 2 (Basics 2)
        # ==========================================
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
        ),

        # ==========================================
        # LESSON 3 (Phrases 1)
        # ==========================================
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
        ),
        Exercise(
            lesson_id=3,
            order_index=3,
            type="FILL_BLANK",
            category_tag="FILL BLANK",
            prompt="Complete the phrase",
            audio_text="हाँ, धन्यवाद",
            content={
                "prefix": "हाँ,",
                "suffix": "।",
                "options": ["धन्यवाद", "लड़का", "किताब"]
            },
            correct_answer="धन्यवाद"
        ),

        # ==========================================
        # LESSON 4 (Unit 1 Milestone - Review & Chest)
        # ==========================================
        Exercise(
            lesson_id=4,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "Apple"?',
            audio_text="सेब",
            content={
                "target_word": "सेब",
                "options": [
                    {"id": "opt1", "text": "सेब", "icon": "🍎"},
                    {"id": "opt2", "text": "पानी", "icon": "💧"},
                    {"id": "opt3", "text": "किताब", "icon": "📖"}
                ]
            },
            correct_answer="सेब"
        ),
        Exercise(
            lesson_id=4,
            order_index=2,
            type="WORD_BANK",
            category_tag="TRANSLATE",
            prompt="Translate this sentence",
            audio_text="यह एक औरत है",
            content={
                "sentence_to_translate": "यह एक औरत है",
                "word_pool": ["This", "is", "a", "woman", "man", "water"]
            },
            correct_answer="This is a woman"
        ),
        Exercise(
            lesson_id=4,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            content={
                "pairs": [
                    {"hi": "सेब", "en": "Apple"},
                    {"hi": "औरत", "en": "Woman"},
                    {"hi": "पानी", "en": "Water"},
                    {"hi": "किताब", "en": "Book"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=4,
            order_index=4,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="यह किताब है",
            content={
                "sentence_to_translate": "यह किताब है",
                "hint": "This is a book"
            },
            correct_answer="This is a book"
        ),

        # ==========================================
        # LESSON 5 (Unit 2: Greetings)
        # ==========================================
        Exercise(
            lesson_id=5,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "Hello"?',
            audio_text="नमस्ते",
            content={
                "target_word": "नमस्ते",
                "options": [
                    {"id": "opt1", "text": "नमस्ते", "icon": "🙏"},
                    {"id": "opt2", "text": "अलविदा", "icon": "👋"},
                    {"id": "opt3", "text": "धन्यवाद", "icon": "✨"}
                ]
            },
            correct_answer="नमस्ते"
        ),
        Exercise(
            lesson_id=5,
            order_index=2,
            type="WORD_BANK",
            category_tag="LISTEN",
            prompt="Tap what you hear",
            audio_text="आप कैसे हैं",
            content={
                "sentence_to_translate": "आप कैसे हैं",
                "word_pool": ["आप", "कैसे", "हैं", "नमस्ते", "हाँ", "मैं"]
            },
            correct_answer="आप कैसे हैं"
        ),
        Exercise(
            lesson_id=5,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            content={
                "pairs": [
                    {"hi": "नमस्ते", "en": "Hello"},
                    {"hi": "अलविदा", "en": "Goodbye"},
                    {"hi": "शुभ प्रभात", "en": "Good morning"},
                    {"hi": "शुभ रात्रि", "en": "Good night"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=5,
            order_index=4,
            type="FILL_BLANK",
            category_tag="FILL BLANK",
            prompt="Complete the greeting",
            audio_text="आप कैसे हैं",
            content={
                "prefix": "आप",
                "suffix": "हैं?",
                "options": ["कैसे", "पानी", "किताब"]
            },
            correct_answer="कैसे"
        ),
        Exercise(
            lesson_id=5,
            order_index=5,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="मैं ठीक हूँ",
            content={
                "sentence_to_translate": "मैं ठीक हूँ",
                "hint": "I am fine"
            },
            correct_answer="I am fine"
        ),

        # ==========================================
        # LESSON 6 (Unit 2: Questions)
        # ==========================================
        Exercise(
            lesson_id=6,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "What"?',
            audio_text="क्या",
            content={
                "target_word": "क्या",
                "options": [
                    {"id": "opt1", "text": "क्या", "icon": "❓"},
                    {"id": "opt2", "text": "कहाँ", "icon": "📍"},
                    {"id": "opt3", "text": "कौन", "icon": "👤"}
                ]
            },
            correct_answer="क्या"
        ),
        Exercise(
            lesson_id=6,
            order_index=2,
            type="WORD_BANK",
            category_tag="TRANSLATE",
            prompt="Translate this sentence",
            audio_text="आपका नाम क्या है",
            content={
                "sentence_to_translate": "What is your name?",
                "word_pool": ["आपका", "नाम", "क्या", "है", "मेरा", "लड़का"]
            },
            correct_answer="आपका नाम क्या है"
        ),
        Exercise(
            lesson_id=6,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            content={
                "pairs": [
                    {"hi": "क्या", "en": "What"},
                    {"hi": "कहाँ", "en": "Where"},
                    {"hi": "कौन", "en": "Who"},
                    {"hi": "क्यों", "en": "Why"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=6,
            order_index=4,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="वह कौन है",
            content={
                "sentence_to_translate": "वह कौन है",
                "hint": "Who is that"
            },
            correct_answer="Who is that"
        ),

        # ==========================================
        # LESSON 7 (Unit 2 Milestone - Chest / Review)
        # ==========================================
        Exercise(
            lesson_id=7,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="TRANSLATE",
            prompt='Select the correct meaning',
            audio_text="धन्यवाद",
            content={
                "speech_bubble": "धन्यवाद",
                "options": [
                    {"id": "opt1", "text": "Thank you"},
                    {"id": "opt2", "text": "Hello"},
                    {"id": "opt3", "text": "Goodbye"}
                ]
            },
            correct_answer="Thank you"
        ),
        Exercise(
            lesson_id=7,
            order_index=2,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            content={
                "pairs": [
                    {"hi": "धन्यवाद", "en": "Thank you"},
                    {"hi": "माफ़ कीजिए", "en": "Excuse me"},
                    {"hi": "हाँ", "en": "Yes"},
                    {"hi": "नहीं", "en": "No"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=7,
            order_index=3,
            type="WORD_BANK",
            category_tag="LISTEN",
            prompt="Tap what you hear",
            audio_text="बहुत धन्यवाद",
            content={
                "sentence_to_translate": "बहुत धन्यवाद",
                "word_pool": ["बहुत", "धन्यवाद", "नमस्ते", "हाँ", "नहीं"]
            },
            correct_answer="बहुत धन्यवाद"
        ),

        # ==========================================
        # LESSON 8 (Unit 3: Family 1)
        # ==========================================
        Exercise(
            lesson_id=8,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "Mother"?',
            audio_text="माँ",
            content={
                "target_word": "माँ",
                "options": [
                    {"id": "opt1", "text": "माँ", "icon": "👩‍👧"},
                    {"id": "opt2", "text": "पिता", "icon": "👨‍👧"},
                    {"id": "opt3", "text": "भाई", "icon": "👦"}
                ]
            },
            correct_answer="माँ"
        ),
        Exercise(
            lesson_id=8,
            order_index=2,
            type="WORD_BANK",
            category_tag="TRANSLATE",
            prompt="Translate this sentence",
            audio_text="यह मेरी माँ है",
            content={
                "sentence_to_translate": "This is my mother",
                "word_pool": ["यह", "मेरी", "माँ", "है", "पिता", "भाई"]
            },
            correct_answer="यह मेरी माँ है"
        ),
        Exercise(
            lesson_id=8,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            content={
                "pairs": [
                    {"hi": "माँ", "en": "Mother"},
                    {"hi": "पिता", "en": "Father"},
                    {"hi": "भाई", "en": "Brother"},
                    {"hi": "बहन", "en": "Sister"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=8,
            order_index=4,
            type="FILL_BLANK",
            category_tag="FILL BLANK",
            prompt="Complete the sentence",
            audio_text="वह मेरा भाई है",
            content={
                "prefix": "वह मेरा",
                "suffix": "है।",
                "options": ["भाई", "चाय", "किताब"]
            },
            correct_answer="भाई"
        ),
        Exercise(
            lesson_id=8,
            order_index=5,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="यह मेरी बहन है",
            content={
                "sentence_to_translate": "यह मेरी बहन है",
                "hint": "This is my sister"
            },
            correct_answer="This is my sister"
        ),

        # ==========================================
        # LESSON 9 (Unit 3: Food & Drinks)
        # ==========================================
        Exercise(
            lesson_id=9,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "Tea"?',
            audio_text="चाय",
            content={
                "target_word": "चाय",
                "options": [
                    {"id": "opt1", "text": "चाय", "icon": "🍵"},
                    {"id": "opt2", "text": "पानी", "icon": "🥛"},
                    {"id": "opt3", "text": "सेब", "icon": "🍎"}
                ]
            },
            correct_answer="चाय"
        ),
        Exercise(
            lesson_id=9,
            order_index=2,
            type="WORD_BANK",
            category_tag="TRANSLATE",
            prompt="Translate this sentence",
            audio_text="मैं चाय पीता हूँ",
            content={
                "sentence_to_translate": "I drink tea",
                "word_pool": ["मैं", "चाय", "पीता", "हूँ", "पानी", "दूध"]
            },
            correct_answer="मैं चाय पीता हूँ"
        ),
        Exercise(
            lesson_id=9,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            content={
                "pairs": [
                    {"hi": "चाय", "en": "Tea"},
                    {"hi": "पानी", "en": "Water"},
                    {"hi": "रोटी", "en": "Bread"},
                    {"hi": "चावल", "en": "Rice"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=9,
            order_index=4,
            type="FILL_BLANK",
            category_tag="FILL BLANK",
            prompt="Complete the sentence",
            audio_text="चाय गर्म है",
            content={
                "prefix": "चाय",
                "suffix": "है।",
                "options": ["गर्म", "लड़का", "औरत"]
            },
            correct_answer="गर्म"
        ),
        Exercise(
            lesson_id=9,
            order_index=5,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="गर्म चाय और ठंडा पानी",
            content={
                "sentence_to_translate": "गर्म चाय और ठंडा पानी",
                "hint": "Hot tea and cold water"
            },
            correct_answer="Hot tea and cold water"
        ),

        # ==========================================
        # LESSON 10 (Unit 3: Section 1 Trophy - Grand Finale)
        # ==========================================
        Exercise(
            lesson_id=10,
            order_index=1,
            type="MULTIPLE_CHOICE",
            category_tag="NEW WORD",
            prompt='Which one of these is "India"?',
            audio_text="भारत",
            content={
                "target_word": "भारत",
                "options": [
                    {"id": "opt1", "text": "भारत", "icon": "🇮🇳"},
                    {"id": "opt2", "text": "घर", "icon": "🏠"},
                    {"id": "opt3", "text": "किताब", "icon": "📖"}
                ]
            },
            correct_answer="भारत"
        ),
        Exercise(
            lesson_id=10,
            order_index=2,
            type="WORD_BANK",
            category_tag="LISTEN",
            prompt="Tap what you hear",
            audio_text="नमस्ते भारत",
            content={
                "sentence_to_translate": "नमस्ते भारत",
                "word_pool": ["नमस्ते", "भारत", "मेरा", "देश", "है", "सुंदर"]
            },
            correct_answer="नमस्ते भारत"
        ),
        Exercise(
            lesson_id=10,
            order_index=3,
            type="MATCH_PAIRS",
            category_tag="PAIR MATCH",
            prompt="Tap the matching pairs",
            content={
                "pairs": [
                    {"hi": "नमस्ते", "en": "Hello"},
                    {"hi": "भारत", "en": "India"},
                    {"hi": "दोस्त", "en": "Friend"},
                    {"hi": "खुश", "en": "Happy"}
                ]
            },
            correct_answer="ALL_MATCHED"
        ),
        Exercise(
            lesson_id=10,
            order_index=4,
            type="TYPE_ANSWER",
            category_tag="WRITE",
            prompt="Write this in English",
            audio_text="मुझे हिन्दी पसंद है",
            content={
                "sentence_to_translate": "मुझे हिन्दी पसंद है",
                "hint": "I love Hindi"
            },
            correct_answer="I love Hindi"
        ),
    ]

    for ex in all_exercises:
        db.add(ex)

    db.commit()

    # 6. Sample Learner Progress:
    # Learner has completed Lesson 1 with 1 crown!
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
    print("Database successfully seeded with ALL 10 lessons across 3 Units with 42 varied exercises!")
