from datetime import datetime
from .database import SessionLocal, engine, Base
from .models import User, Course, Unit, Lesson, Exercise, UserProgress, UserMistake, UserSetting, Achievement, UserFollow, SupportTicket, XPLedger

def _ensure_supplementary_data(db):
    # Fellow learners for search & follow
    mock_users = [
        {"id": 2, "username": "Priyanka M.", "handle": "@priyanka_m", "avatar": "👩🏽", "xp": 180},
        {"id": 3, "username": "Nitheesh Kumar B", "handle": "@nitheesh_k", "avatar": "🧑🏾‍🦱", "xp": 220},
        {"id": 4, "username": "Lucas Dupont", "handle": "@lucas_d", "avatar": "🧑🏼", "xp": 95},
        {"id": 5, "username": "Seyit Musevi", "handle": "@seyit_m", "avatar": "👦🏻", "xp": 140},
        {"id": 6, "username": "Sara Connor", "handle": "@sara_c", "avatar": "👩🏼", "xp": 75},
    ]
    for mu in mock_users:
        existing = db.query(User).filter((User.id == mu["id"]) | (User.handle == mu["handle"])).first()
        if not existing:
            db.add(User(
                id=mu["id"],
                username=mu["username"],
                handle=mu["handle"],
                avatar=mu["avatar"],
                xp=mu["xp"],
                email=f"{mu['handle'][1:]}@example.com",
                streak=2,
                hearts=5,
                gems=100
            ))
    
    # Achievements catalog
    if db.query(Achievement).count() == 0:
        default_achievements = [
            {"key": "wildfire", "title": "Wildfire", "description": "Reach a 3-day streak", "icon": "🔥", "target_value": 3},
            {"key": "sage", "title": "Sage", "description": "Earn 100 XP", "icon": "⚡", "target_value": 100},
            {"key": "champion", "title": "Champion", "description": "Advance to the next League", "icon": "🛡️", "target_value": 1},
            {"key": "sharpshooter", "title": "Sharpshooter", "description": "Complete a lesson with 100% accuracy", "icon": "🎯", "target_value": 1},
            {"key": "winner", "title": "Winner", "description": "Finish #1 on your leaderboard", "icon": "🏆", "target_value": 1},
            {"key": "friendly", "title": "Friendly", "description": "Follow 3 fellow learners", "icon": "👥", "target_value": 3},
            {"key": "weekend_warrior", "title": "Weekend Warrior", "description": "Complete a lesson on Saturday and Sunday", "icon": "⚔️", "target_value": 2},
            {"key": "photogenic", "title": "Photogenic", "description": "Upload or customize your avatar", "icon": "📸", "target_value": 1},
        ]
        for ach in default_achievements:
            db.add(Achievement(**ach))

    # Ensure sample learner has initial ledger entries corresponding to their XP
    user1 = db.query(User).filter(User.id == 1).first()
    if user1 and db.query(XPLedger).filter(XPLedger.user_id == user1.id).count() == 0:
        db.add_all([
            XPLedger(user_id=1, amount=100, base_xp=100, bonus_xp=0, multiplier=1, source_type="welcome", description="Welcome to Duolingo bonus"),
            XPLedger(user_id=1, amount=15, base_xp=10, bonus_xp=5, multiplier=1, source_type="lesson", source_id=1, description="Completed Basics 1 (Perfect 100%)"),
            XPLedger(user_id=1, amount=150, base_xp=150, bonus_xp=0, multiplier=1, source_type="milestone", description="Section 1 Foundation Milestone")
        ])
    db.commit()

def seed_database(force: bool = False):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # If force, drop and recreate all tables
    if force:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    elif db.query(Course).first():
        # Check if full database is already seeded (>= 70 exercises)
        total_exercises = db.query(Exercise).count()
        if total_exercises >= 70 and db.query(UserSetting).first():
            _ensure_supplementary_data(db)
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

    # 1. Create Sample Learner: Aviral Jain with generous gems for full testing
    user = User(
        id=1,
        username="Aviral Jain",
        handle="@AVIRALJAIN51695",
        avatar="🧑",
        xp=265,
        streak=3,
        hearts=5,
        gems=1500,
        daily_goal_xp=10,
        is_super=False,
        current_league="Gold League",
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

    # 3. Units for Hindi 1
    unit1 = Unit(
        id=1,
        course_id=course.id,
        order_index=1,
        section_title="SECTION 1, UNIT 1",
        title="Form basic sentences",
        description="Identify basic objects, people, and simple sentence structures in Hindi"
    )
    db.add(unit1)

    unit2 = Unit(
        id=2,
        course_id=course.id,
        order_index=2,
        section_title="SECTION 1, UNIT 2",
        title="Greet people & describe things",
        description="Learn everyday greetings, polite expressions, colors, and questions"
    )
    db.add(unit2)

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

    # 4. Lessons
    lessons_data = [
        {"id": 1, "unit_id": unit1.id, "order_index": 1, "title": "Basics 1", "icon": "star", "xp_reward": 10},
        {"id": 2, "unit_id": unit1.id, "order_index": 2, "title": "Basics 2", "icon": "star", "xp_reward": 10},
        {"id": 3, "unit_id": unit1.id, "order_index": 3, "title": "Phrases 1", "icon": "headphones", "xp_reward": 15},
        {"id": 4, "unit_id": unit1.id, "order_index": 4, "title": "Unit 1 Milestone", "icon": "chest", "xp_reward": 25},

        {"id": 5, "unit_id": unit2.id, "order_index": 1, "title": "Greetings", "icon": "star", "xp_reward": 10},
        {"id": 6, "unit_id": unit2.id, "order_index": 2, "title": "Questions", "icon": "headphones", "xp_reward": 15},
        {"id": 7, "unit_id": unit2.id, "order_index": 3, "title": "Unit 2 Milestone", "icon": "chest", "xp_reward": 25},

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

    # 5. Build Comprehensive Hindi 1 Exercises (100+ items)
    all_exercises = [
        # =========================================================================
        # LESSON 1: Basics 1 (Objects & People: Apple, Book, Boy, Girl, Man, Woman)
        # =========================================================================
        Exercise(
            lesson_id=1, order_index=1, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Apple"?', audio_text="सेब",
            content={"target_word": "सेब", "options": [{"id": "opt1", "text": "सेब", "icon": "🍎"}, {"id": "opt2", "text": "किताब", "icon": "📖"}, {"id": "opt3", "text": "पानी", "icon": "💧"}]},
            correct_answer="सेब"
        ),
        Exercise(
            lesson_id=1, order_index=2, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Book"?', audio_text="किताब",
            content={"target_word": "किताब", "options": [{"id": "opt1", "text": "लड़का", "icon": "👦"}, {"id": "opt2", "text": "किताब", "icon": "📖"}, {"id": "opt3", "text": "सेब", "icon": "🍎"}]},
            correct_answer="किताब"
        ),
        Exercise(
            lesson_id=1, order_index=3, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Boy"?', audio_text="लड़का",
            content={"target_word": "लड़का", "options": [{"id": "opt1", "text": "लड़की", "icon": "👧"}, {"id": "opt2", "text": "लड़का", "icon": "👦"}, {"id": "opt3", "text": "आदमी", "icon": "👨"}]},
            correct_answer="लड़का"
        ),
        Exercise(
            lesson_id=1, order_index=4, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Girl"?', audio_text="लड़की",
            content={"target_word": "लड़की", "options": [{"id": "opt1", "text": "लड़की", "icon": "👧"}, {"id": "opt2", "text": "औरत", "icon": "👩"}, {"id": "opt3", "text": "लड़का", "icon": "👦"}]},
            correct_answer="लड़की"
        ),
        Exercise(
            lesson_id=1, order_index=5, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Man"?', audio_text="आदमी",
            content={"target_word": "आदमी", "options": [{"id": "opt1", "text": "किताब", "icon": "📖"}, {"id": "opt2", "text": "औरत", "icon": "👩"}, {"id": "opt3", "text": "आदमी", "icon": "👨"}]},
            correct_answer="आदमी"
        ),
        Exercise(
            lesson_id=1, order_index=6, type="MULTIPLE_CHOICE", category_tag="MEANING",
            prompt='Select the correct meaning: "man"', audio_text="आदमी",
            content={"target_word": "man", "options": [{"id": "opt1", "text": "आदमी", "icon": "👨"}, {"id": "opt2", "text": "औरत", "icon": "👩"}, {"id": "opt3", "text": "लड़का", "icon": "👦"}]},
            correct_answer="आदमी"
        ),
        Exercise(
            lesson_id=1, order_index=7, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="वह औरत",
            content={"sentence_to_translate": "वह औरत", "word_pool": ["That", "woman", "apple", "man", "boy", "water"]},
            correct_answer="That woman"
        ),
        Exercise(
            lesson_id=1, order_index=8, type="WORD_BANK", category_tag="LISTEN",
            prompt="Tap what you hear", audio_text="एक सेब",
            content={"sentence_to_translate": "एक सेब", "word_pool": ["एक", "सेब", "किताब", "लड़का", "औरत", "पानी"]},
            correct_answer="एक सेब"
        ),
        Exercise(
            lesson_id=1, order_index=9, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="यह किताब है",
            content={"sentence_to_translate": "यह किताब है", "word_pool": ["This", "is", "a", "book", "that", "water", "boy"]},
            correct_answer="This is a book"
        ),
        Exercise(
            lesson_id=1, order_index=10, type="MATCH_PAIRS", category_tag="MATCH",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["apple", "book", "boy", "woman", "man"], "right_column": ["किताब", "सेब", "लड़की", "औरत", "आदमी", "लड़का"], "pairs": [{"en": "apple", "hi": "सेब"}, {"en": "book", "hi": "किताब"}, {"en": "boy", "hi": "लड़का"}, {"en": "woman", "hi": "औरत"}, {"en": "man", "hi": "आदमी"}]},
            correct_answer="apple:सेब,book:किताब,boy:लड़का,woman:औरत,man:आदमी"
        ),
        Exercise(
            lesson_id=1, order_index=11, type="FILL_BLANK", category_tag="FILL IN THE BLANK",
            prompt="Complete: यह एक ___ है", audio_text="यह एक सेब है",
            content={"prefix": "यह एक ", "suffix": " है", "options": [{"id": "opt1", "text": "सेब"}, {"id": "opt2", "text": "पानी"}, {"id": "opt3", "text": "हूँ"}]},
            correct_answer="सेब"
        ),
        Exercise(
            lesson_id=1, order_index=12, type="TYPE_ANSWER", category_tag="TYPE TRANSLATION",
            prompt='Translate "This is a book"', audio_text="यह किताब है",
            content={"original_phrase": "This is a book", "target_language": "Hindi"},
            correct_answer="यह किताब है"
        ),

        # =========================================================================
        # LESSON 2: Basics 2 (Simple Sentences, Neha, Raj, Water, Car)
        # =========================================================================
        Exercise(
            lesson_id=2, order_index=1, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Water"?', audio_text="पानी",
            content={"target_word": "पानी", "options": [{"id": "opt1", "text": "पानी", "icon": "💧"}, {"id": "opt2", "text": "चाय", "icon": "☕"}, {"id": "opt3", "text": "गाड़ी", "icon": "🚗"}]},
            correct_answer="पानी"
        ),
        Exercise(
            lesson_id=2, order_index=2, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Car"?', audio_text="गाड़ी",
            content={"target_word": "गाड़ी", "options": [{"id": "opt1", "text": "किताब", "icon": "📖"}, {"id": "opt2", "text": "गाड़ी", "icon": "🚗"}, {"id": "opt3", "text": "पानी", "icon": "💧"}]},
            correct_answer="गाड़ी"
        ),
        Exercise(
            lesson_id=2, order_index=3, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="राज एक लड़का है",
            content={"sentence_to_translate": "राज एक लड़का है", "word_pool": ["Raj", "is", "a", "boy", "Neha", "girl", "happy"]},
            correct_answer="Raj is a boy"
        ),
        Exercise(
            lesson_id=2, order_index=4, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="नेहा एक लड़की है",
            content={"sentence_to_translate": "नेहा एक लड़की है", "word_pool": ["Neha", "is", "a", "girl", "Raj", "woman", "book"]},
            correct_answer="Neha is a girl"
        ),
        Exercise(
            lesson_id=2, order_index=5, type="FILL_BLANK", category_tag="FILL IN THE BLANK",
            prompt="Complete the sentence: यह पानी ___", audio_text="यह पानी है",
            content={"prefix": "यह पानी ", "suffix": "", "options": [{"id": "opt1", "text": "है"}, {"id": "opt2", "text": "हूँ"}, {"id": "opt3", "text": "हो"}]},
            correct_answer="है"
        ),
        Exercise(
            lesson_id=2, order_index=6, type="WORD_BANK", category_tag="LISTEN",
            prompt="Tap what you hear", audio_text="मैं एक छात्र हूँ",
            content={"sentence_to_translate": "मैं एक छात्र हूँ", "word_pool": ["मैं", "एक", "छात्र", "हूँ", "लड़का", "है", "पानी"]},
            correct_answer="मैं एक छात्र हूँ"
        ),
        Exercise(
            lesson_id=2, order_index=7, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="मैं ठीक हूँ",
            content={"sentence_to_translate": "मैं ठीक हूँ", "word_pool": ["I", "am", "fine", "you", "good", "happy", "she"]},
            correct_answer="I am fine"
        ),
        Exercise(
            lesson_id=2, order_index=8, type="TYPE_ANSWER", category_tag="TYPE TRANSLATION",
            prompt='Translate "This is a car"', audio_text="यह गाड़ी है",
            content={"original_phrase": "This is a car", "target_language": "Hindi"},
            correct_answer="यह गाड़ी है"
        ),
        Exercise(
            lesson_id=2, order_index=9, type="MATCH_PAIRS", category_tag="MATCH",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["water", "car", "student", "fine", "is"], "right_column": ["गाड़ी", "पानी", "छात्र", "है", "ठीक"], "pairs": [{"en": "water", "hi": "पानी"}, {"en": "car", "hi": "गाड़ी"}, {"en": "student", "hi": "छात्र"}, {"en": "fine", "hi": "ठीक"}, {"en": "is", "hi": "है"}]},
            correct_answer="water:पानी,car:गाड़ी,student:छात्र,fine:ठीक,is:है"
        ),

        # =========================================================================
        # LESSON 3: Phrases 1 (Greetings & Etiquette: Namaste, Dhanyavaad, Haan, Nahi)
        # =========================================================================
        Exercise(
            lesson_id=3, order_index=1, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which of these is "Hello / Greetings"?', audio_text="नमस्ते",
            content={"target_word": "नमस्ते", "options": [{"id": "opt1", "text": "नमस्ते", "icon": "🙏"}, {"id": "opt2", "text": "अलविदा", "icon": "👋"}, {"id": "opt3", "text": "धन्यवाद", "icon": "✨"}]},
            correct_answer="नमस्ते"
        ),
        Exercise(
            lesson_id=3, order_index=2, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which of these is "Thank you"?', audio_text="धन्यवाद",
            content={"target_word": "धन्यवाद", "options": [{"id": "opt1", "text": "धन्यवाद", "icon": "🙏"}, {"id": "opt2", "text": "माफ़ कीजिए", "icon": "🙇"}, {"id": "opt3", "text": "कृपया", "icon": "🤲"}]},
            correct_answer="धन्यवाद"
        ),
        Exercise(
            lesson_id=3, order_index=3, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="नमस्ते, आप कैसे हैं?",
            content={"sentence_to_translate": "नमस्ते, आप कैसे हैं?", "word_pool": ["Hello", "how", "are", "you", "good", "morning", "fine"]},
            correct_answer="Hello how are you"
        ),
        Exercise(
            lesson_id=3, order_index=4, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="हाँ और नहीं",
            content={"sentence_to_translate": "हाँ और नहीं", "word_pool": ["Yes", "and", "no", "please", "thank", "you"]},
            correct_answer="Yes and no"
        ),
        Exercise(
            lesson_id=3, order_index=5, type="FILL_BLANK", category_tag="FILL IN THE BLANK",
            prompt="Complete: कृपया ___ बैठिए", audio_text="कृपया यहाँ बैठिए",
            content={"prefix": "कृपया ", "suffix": " बैठिए", "options": [{"id": "opt1", "text": "यहाँ"}, {"id": "opt2", "text": "नहीं"}, {"id": "opt3", "text": "हाँ"}]},
            correct_answer="यहाँ"
        ),
        Exercise(
            lesson_id=3, order_index=6, type="WORD_BANK", category_tag="LISTEN",
            prompt="Tap what you hear", audio_text="शुभ प्रभात",
            content={"sentence_to_translate": "शुभ प्रभात", "word_pool": ["शुभ", "प्रभात", "रात्रि", "नमस्ते", "धन्यवाद"]},
            correct_answer="शुभ प्रभात"
        ),
        Exercise(
            lesson_id=3, order_index=7, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="माफ़ कीजिए",
            content={"sentence_to_translate": "माफ़ कीजिए", "word_pool": ["Excuse", "me", "sorry", "thank", "you", "hello"]},
            correct_answer="Excuse me"
        ),
        Exercise(
            lesson_id=3, order_index=8, type="MATCH_PAIRS", category_tag="MATCH",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["hello", "thank you", "yes", "no", "please"], "right_column": ["धन्यवाद", "नमस्ते", "नहीं", "हाँ", "कृपया"], "pairs": [{"en": "hello", "hi": "नमस्ते"}, {"en": "thank you", "hi": "धन्यवाद"}, {"en": "yes", "hi": "हाँ"}, {"en": "no", "hi": "नहीं"}, {"en": "please", "hi": "कृपया"}]},
            correct_answer="hello:नमस्ते,thank you:धन्यवाद,yes:हाँ,no:नहीं,please:कृपया"
        ),

        # =========================================================================
        # LESSON 4: Unit 1 Milestone (Comprehensive Review of Unit 1)
        # =========================================================================
        Exercise(
            lesson_id=4, order_index=1, type="MULTIPLE_CHOICE", category_tag="MILESTONE",
            prompt='Select the correct Hindi word for "Good morning":', audio_text="शुभ प्रभात",
            content={"target_word": "Good morning", "options": [{"id": "opt1", "text": "शुभ प्रभात", "icon": "☀️"}, {"id": "opt2", "text": "शुभ रात्रि", "icon": "🌙"}, {"id": "opt3", "text": "नमस्ते", "icon": "🙏"}]},
            correct_answer="शुभ प्रभात"
        ),
        Exercise(
            lesson_id=4, order_index=2, type="WORD_BANK", category_tag="MILESTONE",
            prompt="Write this in English", audio_text="यह सेब मीठा है",
            content={"sentence_to_translate": "यह सेब मीठा है", "word_pool": ["This", "apple", "is", "sweet", "water", "red", "big"]},
            correct_answer="This apple is sweet"
        ),
        Exercise(
            lesson_id=4, order_index=3, type="WORD_BANK", category_tag="MILESTONE",
            prompt="Write this in English", audio_text="लड़का पानी पीता है",
            content={"sentence_to_translate": "लड़का पानी पीता है", "word_pool": ["The", "boy", "drinks", "water", "tea", "eats", "book"]},
            correct_answer="The boy drinks water"
        ),
        Exercise(
            lesson_id=4, order_index=4, type="FILL_BLANK", category_tag="MILESTONE",
            prompt="Complete: वह लड़की किताब ___ है", audio_text="वह लड़की किताब पढ़ती है",
            content={"prefix": "वह लड़की किताब ", "suffix": " है", "options": [{"id": "opt1", "text": "पढ़ती"}, {"id": "opt2", "text": "पीती"}, {"id": "opt3", "text": "खाती"}]},
            correct_answer="पढ़ती"
        ),
        Exercise(
            lesson_id=4, order_index=5, type="TYPE_ANSWER", category_tag="MILESTONE",
            prompt='Translate "Thank you very much"', audio_text="बहुत धन्यवाद",
            content={"original_phrase": "Thank you very much", "target_language": "Hindi"},
            correct_answer="बहुत धन्यवाद"
        ),
        Exercise(
            lesson_id=4, order_index=6, type="MATCH_PAIRS", category_tag="MILESTONE",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["apple", "water", "book", "boy", "girl"], "right_column": ["पानी", "सेब", "लड़की", "किताब", "लड़का"], "pairs": [{"en": "apple", "hi": "सेब"}, {"en": "water", "hi": "पानी"}, {"en": "book", "hi": "किताब"}, {"en": "boy", "hi": "लड़का"}, {"en": "girl", "hi": "लड़की"}]},
            correct_answer="apple:सेब,water:पानी,book:किताब,boy:लड़का,girl:लड़की"
        ),

        # =========================================================================
        # LESSON 5: Greetings (Unit 2: Aap kaise hain, Mera naam...)
        # =========================================================================
        Exercise(
            lesson_id=5, order_index=1, type="MULTIPLE_CHOICE", category_tag="NEW PHRASE",
            prompt='How do you ask "What is your name?" in Hindi?', audio_text="आपका नाम क्या है?",
            content={"target_word": "What is your name?", "options": [{"id": "opt1", "text": "आपका नाम क्या है?", "icon": "❓"}, {"id": "opt2", "text": "आप कैसे हैं?", "icon": "👋"}, {"id": "opt3", "text": "आप कहाँ हैं?", "icon": "📍"}]},
            correct_answer="आपका नाम क्या है?"
        ),
        Exercise(
            lesson_id=5, order_index=2, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="मेरा नाम राहुल है",
            content={"sentence_to_translate": "मेरा नाम राहुल है", "word_pool": ["My", "name", "is", "Rahul", "your", "friend", "happy"]},
            correct_answer="My name is Rahul"
        ),
        Exercise(
            lesson_id=5, order_index=3, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="आपसे मिलकर खुशी हुई",
            content={"sentence_to_translate": "आपसे मिलकर खुशी हुई", "word_pool": ["Nice", "to", "meet", "you", "good", "morning", "fine"]},
            correct_answer="Nice to meet you"
        ),
        Exercise(
            lesson_id=5, order_index=4, type="FILL_BLANK", category_tag="FILL IN THE BLANK",
            prompt="Complete: मैं भारत से ___", audio_text="मैं भारत से हूँ",
            content={"prefix": "मैं भारत से ", "suffix": "", "options": [{"id": "opt1", "text": "हूँ"}, {"id": "opt2", "text": "है"}, {"id": "opt3", "text": "हैं"}]},
            correct_answer="हूँ"
        ),
        Exercise(
            lesson_id=5, order_index=5, type="WORD_BANK", category_tag="LISTEN",
            prompt="Tap what you hear", audio_text="फिर मिलेंगे",
            content={"sentence_to_translate": "फिर मिलेंगे", "word_pool": ["फिर", "मिलेंगे", "नमस्ते", "अलविदा", "कल"]},
            correct_answer="फिर मिलेंगे"
        ),
        Exercise(
            lesson_id=5, order_index=6, type="MATCH_PAIRS", category_tag="MATCH",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["name", "happy", "see you again", "from", "friend"], "right_column": ["खुश", "नाम", "से", "फिर मिलेंगे", "दोस्त"], "pairs": [{"en": "name", "hi": "नाम"}, {"en": "happy", "hi": "खुश"}, {"en": "see you again", "hi": "फिर मिलेंगे"}, {"en": "from", "hi": "से"}, {"en": "friend", "hi": "दोस्त"}]},
            correct_answer="name:नाम,happy:खुश,see you again:फिर मिलेंगे,from:से,friend:दोस्त"
        ),

        # =========================================================================
        # LESSON 6: Questions & Locations (Where is Delhi? Station, Here, There)
        # =========================================================================
        Exercise(
            lesson_id=6, order_index=1, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which word means "Where"?', audio_text="कहाँ",
            content={"target_word": "कहाँ", "options": [{"id": "opt1", "text": "कहाँ", "icon": "📍"}, {"id": "opt2", "text": "क्या", "icon": "❓"}, {"id": "opt3", "text": "कब", "icon": "⏰"}]},
            correct_answer="कहाँ"
        ),
        Exercise(
            lesson_id=6, order_index=2, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="दिल्ली कहाँ है?",
            content={"sentence_to_translate": "दिल्ली कहाँ है?", "word_pool": ["Where", "is", "Delhi", "what", "India", "city"]},
            correct_answer="Where is Delhi"
        ),
        Exercise(
            lesson_id=6, order_index=3, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="स्टेशन यहाँ है",
            content={"sentence_to_translate": "स्टेशन यहाँ है", "word_pool": ["The", "station", "is", "here", "there", "where", "near"]},
            correct_answer="The station is here"
        ),
        Exercise(
            lesson_id=6, order_index=4, type="FILL_BLANK", category_tag="FILL IN THE BLANK",
            prompt="Complete: अस्पताल ___ है?", audio_text="अस्पताल कहाँ है?",
            content={"prefix": "अस्पताल ", "suffix": " है?", "options": [{"id": "opt1", "text": "कहाँ"}, {"id": "opt2", "text": "यहाँ"}, {"id": "opt3", "text": "वहाँ"}]},
            correct_answer="कहाँ"
        ),
        Exercise(
            lesson_id=6, order_index=5, type="TYPE_ANSWER", category_tag="TYPE TRANSLATION",
            prompt='Translate "This is a big city"', audio_text="यह बड़ा शहर है",
            content={"original_phrase": "This is a big city", "target_language": "Hindi"},
            correct_answer="यह बड़ा शहर है"
        ),
        Exercise(
            lesson_id=6, order_index=6, type="MATCH_PAIRS", category_tag="MATCH",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["where", "here", "there", "city", "big"], "right_column": ["यहाँ", "कहाँ", "शहर", "वहाँ", "बड़ा"], "pairs": [{"en": "where", "hi": "कहाँ"}, {"en": "here", "hi": "यहाँ"}, {"en": "there", "hi": "वहाँ"}, {"en": "city", "hi": "शहर"}, {"en": "big", "hi": "बड़ा"}]},
            correct_answer="where:कहाँ,here:यहाँ,there:वहाँ,city:शहर,big:बड़ा"
        ),

        # =========================================================================
        # LESSON 7: Unit 2 Milestone
        # =========================================================================
        Exercise(
            lesson_id=7, order_index=1, type="MULTIPLE_CHOICE", category_tag="MILESTONE",
            prompt='Translate: "How are you?"', audio_text="आप कैसे हैं?",
            content={"target_word": "आप कैसे हैं?", "options": [{"id": "opt1", "text": "आप कैसे हैं?", "icon": "❓"}, {"id": "opt2", "text": "आपका नाम क्या है?", "icon": "🏷️"}, {"id": "opt3", "text": "आप कहाँ हैं?", "icon": "🗺️"}]},
            correct_answer="आप कैसे हैं?"
        ),
        Exercise(
            lesson_id=7, order_index=2, type="WORD_BANK", category_tag="MILESTONE",
            prompt="Write this in English", audio_text="बाज़ार बहुत बड़ा है",
            content={"sentence_to_translate": "बाज़ार बहुत बड़ा है", "word_pool": ["The", "market", "is", "very", "big", "small", "city"]},
            correct_answer="The market is very big"
        ),
        Exercise(
            lesson_id=7, order_index=3, type="FILL_BLANK", category_tag="MILESTONE",
            prompt="Complete: मेरा घर ___ है", audio_text="मेरा घर वहाँ है",
            content={"prefix": "मेरा घर ", "suffix": " है", "options": [{"id": "opt1", "text": "वहाँ"}, {"id": "opt2", "text": "क्या"}, {"id": "opt3", "text": "कौन"}]},
            correct_answer="वहाँ"
        ),
        Exercise(
            lesson_id=7, order_index=4, type="WORD_BANK", category_tag="LISTEN",
            prompt="Tap what you hear", audio_text="नमस्ते, मेरा नाम अमित है",
            content={"sentence_to_translate": "नमस्ते, मेरा नाम अमित है", "word_pool": ["नमस्ते", "मेरा", "नाम", "अमित", "है", "आप", "लड़का"]},
            correct_answer="नमस्ते मेरा नाम अमित है"
        ),
        Exercise(
            lesson_id=7, order_index=5, type="MATCH_PAIRS", category_tag="MILESTONE",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["market", "house", "very", "small", "friend"], "right_column": ["घर", "बाज़ार", "छोटा", "बहुत", "दोस्त"], "pairs": [{"en": "market", "hi": "बाज़ार"}, {"en": "house", "hi": "घर"}, {"en": "very", "hi": "बहुत"}, {"en": "small", "hi": "छोटा"}, {"en": "friend", "hi": "दोस्त"}]},
            correct_answer="market:बाज़ार,house:घर,very:बहुत,small:छोटा,friend:दोस्त"
        ),

        # =========================================================================
        # LESSON 8: Family 1 (Maa, Pitaji, Bhai, Behan, Dost)
        # =========================================================================
        Exercise(
            lesson_id=8, order_index=1, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Mother"?', audio_text="माँ",
            content={"target_word": "माँ", "options": [{"id": "opt1", "text": "माँ", "icon": "👩"}, {"id": "opt2", "text": "पिताजी", "icon": "👨"}, {"id": "opt3", "text": "बहन", "icon": "👧"}]},
            correct_answer="माँ"
        ),
        Exercise(
            lesson_id=8, order_index=2, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Father"?', audio_text="पिताजी",
            content={"target_word": "पिताजी", "options": [{"id": "opt1", "text": "भाई", "icon": "👦"}, {"id": "opt2", "text": "पिताजी", "icon": "👨"}, {"id": "opt3", "text": "माँ", "icon": "👩"}]},
            correct_answer="पिताजी"
        ),
        Exercise(
            lesson_id=8, order_index=3, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="यह मेरा भाई है",
            content={"sentence_to_translate": "यह मेरा भाई है", "word_pool": ["This", "is", "my", "brother", "sister", "mother", "good"]},
            correct_answer="This is my brother"
        ),
        Exercise(
            lesson_id=8, order_index=4, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="मेरी बहन खुश है",
            content={"sentence_to_translate": "मेरी बहन खुश है", "word_pool": ["My", "sister", "is", "happy", "brother", "sad", "tall"]},
            correct_answer="My sister is happy"
        ),
        Exercise(
            lesson_id=8, order_index=5, type="FILL_BLANK", category_tag="FILL IN THE BLANK",
            prompt="Complete: वह मेरे ___ हैं", audio_text="वह मेरे पिताजी हैं",
            content={"prefix": "वह मेरे ", "suffix": " हैं", "options": [{"id": "opt1", "text": "पिताजी"}, {"id": "opt2", "text": "किताब"}, {"id": "opt3", "text": "पानी"}]},
            correct_answer="पिताजी"
        ),
        Exercise(
            lesson_id=8, order_index=6, type="MATCH_PAIRS", category_tag="MATCH",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["mother", "father", "brother", "sister", "family"], "right_column": ["पिताजी", "माँ", "बहन", "भाई", "परिवार"], "pairs": [{"en": "mother", "hi": "माँ"}, {"en": "father", "hi": "पिताजी"}, {"en": "brother", "hi": "भाई"}, {"en": "sister", "hi": "बहन"}, {"en": "family", "hi": "परिवार"}]},
            correct_answer="mother:माँ,father:पिताजी,brother:भाई,sister:बहन,family:परिवार"
        ),

        # =========================================================================
        # LESSON 9: Food & Drinks (Tea, Milk, Roti, Rice, Delicious)
        # =========================================================================
        Exercise(
            lesson_id=9, order_index=1, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Tea"?', audio_text="चाय",
            content={"target_word": "चाय", "options": [{"id": "opt1", "text": "चाय", "icon": "☕"}, {"id": "opt2", "text": "दूध", "icon": "🥛"}, {"id": "opt3", "text": "पानी", "icon": "💧"}]},
            correct_answer="चाय"
        ),
        Exercise(
            lesson_id=9, order_index=2, type="MULTIPLE_CHOICE", category_tag="NEW WORD",
            prompt='Which one of these is "Milk"?', audio_text="दूध",
            content={"target_word": "दूध", "options": [{"id": "opt1", "text": "पानी", "icon": "💧"}, {"id": "opt2", "text": "दूध", "icon": "🥛"}, {"id": "opt3", "text": "चाय", "icon": "☕"}]},
            correct_answer="दूध"
        ),
        Exercise(
            lesson_id=9, order_index=3, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="चाय गर्म है",
            content={"sentence_to_translate": "चाय गर्म है", "word_pool": ["The", "tea", "is", "hot", "cold", "water", "sweet"]},
            correct_answer="The tea is hot"
        ),
        Exercise(
            lesson_id=9, order_index=4, type="WORD_BANK", category_tag="TRANSLATE",
            prompt="Write this in English", audio_text="खाना स्वादिष्ट है",
            content={"sentence_to_translate": "खाना स्वादिष्ट है", "word_pool": ["The", "food", "is", "delicious", "hot", "bad", "bread"]},
            correct_answer="The food is delicious"
        ),
        Exercise(
            lesson_id=9, order_index=5, type="FILL_BLANK", category_tag="FILL IN THE BLANK",
            prompt="Complete: मुझे ___ और चावल पसंद हैं", audio_text="मुझे रोटी और चावल पसंद हैं",
            content={"prefix": "मुझे ", "suffix": " और चावल पसंद हैं", "options": [{"id": "opt1", "text": "रोटी"}, {"id": "opt2", "text": "किताब"}, {"id": "opt3", "text": "गाड़ी"}]},
            correct_answer="रोटी"
        ),
        Exercise(
            lesson_id=9, order_index=6, type="TYPE_ANSWER", category_tag="TYPE TRANSLATION",
            prompt='Translate "I drink cold water"', audio_text="मैं ठंडा पानी पीता हूँ",
            content={"original_phrase": "I drink cold water", "target_language": "Hindi"},
            correct_answer="मैं ठंडा पानी पीता हूँ"
        ),
        Exercise(
            lesson_id=9, order_index=7, type="MATCH_PAIRS", category_tag="MATCH",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["tea", "milk", "food", "hot", "bread"], "right_column": ["दूध", "चाय", "गर्म", "खाना", "रोटी"], "pairs": [{"en": "tea", "hi": "चाय"}, {"en": "milk", "hi": "दूध"}, {"en": "food", "hi": "खाना"}, {"en": "hot", "hi": "गर्म"}, {"en": "bread", "hi": "रोटी"}]},
            correct_answer="tea:चाय,milk:दूध,food:खाना,hot:गर्म,bread:रोटी"
        ),

        # =========================================================================
        # LESSON 10: Section 1 Trophy (Ultimate Section Milestone Challenge)
        # =========================================================================
        Exercise(
            lesson_id=10, order_index=1, type="MULTIPLE_CHOICE", category_tag="SECTION TROPHY",
            prompt='Which sentence translates "Raj and Neha are good friends"?', audio_text="राज और नेहा अच्छे दोस्त हैं",
            content={"target_word": "राज और नेहा अच्छे दोस्त हैं", "options": [{"id": "opt1", "text": "राज और नेहा अच्छे दोस्त हैं", "icon": "👫"}, {"id": "opt2", "text": "राज और नेहा भाई बहन हैं", "icon": "🏠"}, {"id": "opt3", "text": "राज और नेहा छात्र हैं", "icon": "🎓"}]},
            correct_answer="राज और नेहा अच्छे दोस्त हैं"
        ),
        Exercise(
            lesson_id=10, order_index=2, type="WORD_BANK", category_tag="SECTION TROPHY",
            prompt="Write this in English", audio_text="हम सब भारत में रहते हैं",
            content={"sentence_to_translate": "हम सब भारत में रहते हैं", "word_pool": ["We", "all", "live", "in", "India", "Delhi", "they", "happy"]},
            correct_answer="We all live in India"
        ),
        Exercise(
            lesson_id=10, order_index=3, type="WORD_BANK", category_tag="SECTION TROPHY",
            prompt="Write this in English", audio_text="नमस्ते, आपका बहुत बहुत धन्यवाद",
            content={"sentence_to_translate": "नमस्ते, आपका बहुत बहुत धन्यवाद", "word_pool": ["Hello", "thank", "you", "very", "much", "good", "morning"]},
            correct_answer="Hello thank you very much"
        ),
        Exercise(
            lesson_id=10, order_index=4, type="FILL_BLANK", category_tag="SECTION TROPHY",
            prompt="Complete: यह मेरी पसंदीदा ___ है", audio_text="यह मेरी पसंदीदा किताब है",
            content={"prefix": "यह मेरी पसंदीदा ", "suffix": " है", "options": [{"id": "opt1", "text": "किताब"}, {"id": "opt2", "text": "लड़का"}, {"id": "opt3", "text": "आदमी"}]},
            correct_answer="किताब"
        ),
        Exercise(
            lesson_id=10, order_index=5, type="TYPE_ANSWER", category_tag="SECTION TROPHY",
            prompt='Translate "See you tomorrow"', audio_text="कल मिलेंगे",
            content={"original_phrase": "See you tomorrow", "target_language": "Hindi"},
            correct_answer="कल मिलेंगे"
        ),
        Exercise(
            lesson_id=10, order_index=6, type="MATCH_PAIRS", category_tag="SECTION TROPHY",
            prompt="Select the matching pairs", audio_text="जोड़ियां मिलाइए",
            content={"left_column": ["hello", "thank you", "tomorrow", "friends", "tea"], "right_column": ["धन्यवाद", "नमस्ते", "दोस्त", "कल", "चाय"], "pairs": [{"en": "hello", "hi": "नमस्ते"}, {"en": "thank you", "hi": "धन्यवाद"}, {"en": "tomorrow", "hi": "कल"}, {"en": "friends", "hi": "दोस्त"}, {"en": "tea", "hi": "चाय"}]},
            correct_answer="hello:नमस्ते,thank you:धन्यवाद,tomorrow:कल,friends:दोस्त,tea:चाय"
        )
    ]

    for ex in all_exercises:
        db.add(ex)
    db.commit()

    # 6. Initial User Progress
    # Lesson 1 completed, Lesson 2 available
    db.query(UserProgress).delete()
    p1 = UserProgress(user_id=user.id, lesson_id=1, is_completed=True, crowns=1, completed_at=datetime.utcnow())
    p2 = UserProgress(user_id=user.id, lesson_id=2, is_completed=False, crowns=0)
    db.add(p1)
    db.add(p2)
    db.commit()

    # 7. Ensure fellow learners and achievements are always populated
    _ensure_supplementary_data(db)

    db.close()
    print("Database seeding completed successfully! Total exercises seeded:", len(all_exercises))

if __name__ == "__main__":
    seed_database(force=True)
