from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

router = APIRouter(prefix="/api/guidebook", tags=["Guidebook"])

GUIDEBOOKS_DATA: Dict[int, Dict[str, Any]] = {
    1: {
        "unit_id": 1,
        "section_title": "SECTION 1, UNIT 1",
        "unit_title": "Form basic sentences",
        "description": "Master plural pronouns, basic sentence structures, and essential food and drink vocabulary in Hindi.",
        "key_phrases": [
            {
                "id": 1,
                "hi": "वे औरतें हैं।",
                "en": "They are women.",
                "audio_text": "वे औरतें हैं।",
                "words": [
                    {"hi": "वे", "en": "They / Those"},
                    {"hi": "औरतें", "en": "women"},
                    {"hi": "हैं।", "en": "are"}
                ]
            },
            {
                "id": 2,
                "hi": "ये सेब हैं।",
                "en": "These are apples.",
                "audio_text": "ये सेब हैं।",
                "words": [
                    {"hi": "ये", "en": "These"},
                    {"hi": "सेब", "en": "apples"},
                    {"hi": "हैं।", "en": "are"}
                ]
            },
            {
                "id": 3,
                "hi": "हम केले और सेब खाते हैं।",
                "en": "We eat bananas and apples.",
                "audio_text": "हम केले और सेब खाते हैं।",
                "words": [
                    {"hi": "हम", "en": "We"},
                    {"hi": "केले", "en": "bananas"},
                    {"hi": "और", "en": "and"},
                    {"hi": "सेब", "en": "apples"},
                    {"hi": "खाते", "en": "eat"},
                    {"hi": "हैं।", "en": "are"}
                ]
            },
            {
                "id": 4,
                "hi": "राज और नेहा पानी पीते हैं।",
                "en": "Raj and Neha drink water.",
                "audio_text": "राज और नेहा पानी पीते हैं।",
                "words": [
                    {"hi": "राज", "en": "Raj"},
                    {"hi": "और", "en": "and"},
                    {"hi": "नेहा", "en": "Neha"},
                    {"hi": "पानी", "en": "water"},
                    {"hi": "पीते", "en": "drink"},
                    {"hi": "हैं।", "en": "are"}
                ]
            },
            {
                "id": 5,
                "hi": "लड़के चाय नहीं पीते।",
                "en": "The boys do not drink tea.",
                "audio_text": "लड़के चाय नहीं पीते।",
                "words": [
                    {"hi": "लड़के", "en": "The boys"},
                    {"hi": "चाय", "en": "tea"},
                    {"hi": "नहीं", "en": "do not"},
                    {"hi": "पीते।", "en": "drink"}
                ]
            },
            {
                "id": 6,
                "hi": "नमस्ते! आप कैसे हैं?",
                "en": "Hello! How are you?",
                "audio_text": "नमस्ते! आप कैसे हैं?",
                "words": [
                    {"hi": "नमस्ते!", "en": "Hello / Greetings!"},
                    {"hi": "आप", "en": "you (polite)"},
                    {"hi": "कैसे", "en": "how"},
                    {"hi": "हैं?", "en": "are?"}
                ]
            },
            {
                "id": 7,
                "hi": "लड़कियाँ किताबें पढ़ती हैं।",
                "en": "The girls read books.",
                "audio_text": "लड़कियाँ किताबें पढ़ती हैं।",
                "words": [
                    {"hi": "लड़कियाँ", "en": "The girls"},
                    {"hi": "किताबें", "en": "books"},
                    {"hi": "पढ़ती", "en": "read"},
                    {"hi": "हैं।", "en": "are"}
                ]
            },
            {
                "id": 8,
                "hi": "यह एक बड़ा और मीठा सेब है।",
                "en": "This is a big and sweet apple.",
                "audio_text": "यह एक बड़ा और मीठा सेब है।",
                "words": [
                    {"hi": "यह", "en": "This"},
                    {"hi": "एक", "en": "a / one"},
                    {"hi": "बड़ा", "en": "big"},
                    {"hi": "और", "en": "and"},
                    {"hi": "मीठा", "en": "sweet"},
                    {"hi": "सेब", "en": "apple"},
                    {"hi": "है।", "en": "is"}
                ]
            }
        ],
        "grammar_tips": [
            {
                "title": "Tip: Making Things Plural (बहुवचन)",
                "summary": "In Hindi, plural formation depends on gender and noun endings.",
                "rules": [
                    {
                        "category": "Feminine nouns ending in consonants",
                        "change": "Add -एँ (-en)",
                        "examples": "औरत (woman) → औरतें (women), किताब (book) → किताबें (books)"
                    },
                    {
                        "category": "Masculine nouns ending in -आ (-aa)",
                        "change": "Change -आ to -ए (-e)",
                        "examples": "लड़का (boy) → लड़के (boys), केला (banana) → केले (bananas)"
                    },
                    {
                        "category": "Invariable masculine nouns",
                        "change": "No change in direct plural",
                        "examples": "सेब (apple) → सेब (apples), आदमी (man) → आदमी (men)"
                    }
                ]
            },
            {
                "title": "Tip: Demonstrative Pronouns (यह/ये and वह/वे)",
                "summary": "Use different demonstrative pronouns for near vs. far objects and singular vs. plural.",
                "table": [
                    {"pronoun": "यह (yeh)", "distance": "Near", "number": "Singular", "meaning": "This / He / She", "verb": "है (hai)"},
                    {"pronoun": "ये (ye)", "distance": "Near", "number": "Plural", "meaning": "These / They", "verb": "हैं (hain)"},
                    {"pronoun": "वह (vah)", "distance": "Far", "number": "Singular", "meaning": "That / He / She", "verb": "है (hai)"},
                    {"pronoun": "वे (ve)", "distance": "Far", "number": "Plural", "meaning": "Those / They", "verb": "हैं (hain)"}
                ]
            },
            {
                "title": "Tip: Verb Agreement & Negation (क्रिया और नकार)",
                "summary": "Verbs agree in gender and number with the subject. In negative sentences, 'नहीं' comes right before the verb.",
                "examples": [
                    {"hi": "राज पानी पीता है।", "en": "Raj drinks water. (Masculine Singular: -ता है)"},
                    {"hi": "नेहा पानी पीती है।", "en": "Neha drinks water. (Feminine Singular: -ती है)"},
                    {"hi": "लड़के पानी पीते हैं।", "en": "The boys drink water. (Masculine Plural: -ते हैं)"},
                    {"hi": "लड़के चाय नहीं पीते।", "en": "The boys do not drink tea. (Negation: नहीं before verb)"}
                ]
            }
        ],
        "vocabulary": [
            {"category": "Pronouns", "devanagari": "वे", "transliteration": "ve", "meaning": "they / those"},
            {"category": "Pronouns", "devanagari": "ये", "transliteration": "ye", "meaning": "these"},
            {"category": "Pronouns", "devanagari": "हम", "transliteration": "ham", "meaning": "we"},
            {"category": "People", "devanagari": "औरतें", "transliteration": "auraten", "meaning": "women"},
            {"category": "People", "devanagari": "लड़के", "transliteration": "ladke", "meaning": "boys"},
            {"category": "People", "devanagari": "लड़कियाँ", "transliteration": "ladkiyan", "meaning": "girls"},
            {"category": "Food & Drinks", "devanagari": "सेब", "transliteration": "seb", "meaning": "apple(s)"},
            {"category": "Food & Drinks", "devanagari": "केले", "transliteration": "kele", "meaning": "bananas"},
            {"category": "Food & Drinks", "devanagari": "पानी", "transliteration": "paani", "meaning": "water"},
            {"category": "Food & Drinks", "devanagari": "चाय", "transliteration": "chaay", "meaning": "tea"},
            {"category": "Actions", "devanagari": "खाते हैं", "transliteration": "khaate hain", "meaning": "eat (plural)"},
            {"category": "Actions", "devanagari": "पीते हैं", "transliteration": "peete hain", "meaning": "drink (plural)"}
        ]
    },
    2: {
        "unit_id": 2,
        "section_title": "SECTION 1, UNIT 2",
        "unit_title": "Greet people & describe things",
        "description": "Learn everyday greetings, how to introduce yourself, and how to ask simple questions in Hindi.",
        "key_phrases": [
            {
                "id": 1,
                "hi": "नमस्ते!",
                "en": "Hello!",
                "audio_text": "नमस्ते!",
                "words": [
                    {
                        "hi": "नमस्ते!",
                        "en": "Hello / Greetings"
                    }
                ]
            },
            {
                "id": 2,
                "hi": "आपका नाम क्या है?",
                "en": "What is your name?",
                "audio_text": "आपका नाम क्या है?",
                "words": [
                    {
                        "hi": "आपका",
                        "en": "your (formal)"
                    },
                    {
                        "hi": "नाम",
                        "en": "name"
                    },
                    {
                        "hi": "क्या",
                        "en": "what"
                    },
                    {
                        "hi": "है?",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 3,
                "hi": "मेरा नाम राहुल है।",
                "en": "My name is Rahul.",
                "audio_text": "मेरा नाम राहुल है।",
                "words": [
                    {
                        "hi": "मेरा",
                        "en": "my"
                    },
                    {
                        "hi": "नाम",
                        "en": "name"
                    },
                    {
                        "hi": "राहुल",
                        "en": "Rahul"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 4,
                "hi": "आपसे मिलकर खुशी हुई।",
                "en": "Nice to meet you.",
                "audio_text": "आपसे मिलकर खुशी हुई।",
                "words": [
                    {
                        "hi": "आपसे",
                        "en": "with you"
                    },
                    {
                        "hi": "मिलकर",
                        "en": "on meeting"
                    },
                    {
                        "hi": "खुशी",
                        "en": "happiness"
                    },
                    {
                        "hi": "हुई।",
                        "en": "happened"
                    }
                ]
            },
            {
                "id": 5,
                "hi": "आप कैसे हैं?",
                "en": "How are you?",
                "audio_text": "आप कैसे हैं?",
                "words": [
                    {
                        "hi": "आप",
                        "en": "you (formal)"
                    },
                    {
                        "hi": "कैसे",
                        "en": "how"
                    },
                    {
                        "hi": "हैं?",
                        "en": "are"
                    }
                ]
            },
            {
                "id": 6,
                "hi": "मैं ठीक हूँ।",
                "en": "I am fine.",
                "audio_text": "मैं ठीक हूँ।",
                "words": [
                    {
                        "hi": "मैं",
                        "en": "I"
                    },
                    {
                        "hi": "ठीक",
                        "en": "fine"
                    },
                    {
                        "hi": "हूँ।",
                        "en": "am"
                    }
                ]
            },
            {
                "id": 7,
                "hi": "दिल्ली कहाँ है?",
                "en": "Where is Delhi?",
                "audio_text": "दिल्ली कहाँ है?",
                "words": [
                    {
                        "hi": "दिल्ली",
                        "en": "Delhi"
                    },
                    {
                        "hi": "कहाँ",
                        "en": "where"
                    },
                    {
                        "hi": "है?",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 8,
                "hi": "यह बड़ा शहर है।",
                "en": "This is a big city.",
                "audio_text": "यह बड़ा शहर है।",
                "words": [
                    {
                        "hi": "यह",
                        "en": "this"
                    },
                    {
                        "hi": "बड़ा",
                        "en": "big"
                    },
                    {
                        "hi": "शहर",
                        "en": "city"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 9,
                "hi": "फिर मिलेंगे।",
                "en": "See you again.",
                "audio_text": "फिर मिलेंगे।",
                "words": [
                    {
                        "hi": "फिर",
                        "en": "again"
                    },
                    {
                        "hi": "मिलेंगे।",
                        "en": "we will meet"
                    }
                ]
            }
        ],
        "grammar_tips": [
            {
                "title": "Tip: Question Words (प्रश्नवाचक शब्द)",
                "summary": "Hindi question words usually sit just before the verb. The word order of the rest of the sentence stays the same.",
                "rules": [
                    {
                        "category": "क्या (kya) - what",
                        "change": "Placed before है/हैं",
                        "examples": "आपका नाम क्या है? (What is your name?)"
                    },
                    {
                        "category": "कहाँ (kahaan) - where",
                        "change": "Placed before है/हैं",
                        "examples": "दिल्ली कहाँ है? (Where is Delhi?)"
                    },
                    {
                        "category": "कैसे (kaise) - how",
                        "change": "Placed before है/हैं",
                        "examples": "आप कैसे हैं? (How are you?)"
                    }
                ]
            },
            {
                "title": "Tip: The Verb 'to be' (होना)",
                "summary": "The present tense of 'to be' changes with the subject. Use हैं with आप because it is the respectful form.",
                "rules": [
                    {
                        "category": "मैं (I)",
                        "change": "हूँ (hoon)",
                        "examples": "मैं ठीक हूँ। (I am fine.)"
                    },
                    {
                        "category": "यह / वह / singular nouns",
                        "change": "है (hai)",
                        "examples": "यह बड़ा शहर है। (This is a big city.)"
                    },
                    {
                        "category": "आप (you, formal) and plurals",
                        "change": "हैं (hain)",
                        "examples": "आप कैसे हैं? (How are you?)"
                    }
                ]
            },
            {
                "title": "Tip: Saying 'My' and 'Your' (मेरा / आपका)",
                "summary": "Possessives match the gender of the thing owned, not the owner. Masculine nouns take -आ, feminine nouns take -ई.",
                "examples": [
                    {
                        "hi": "मेरा नाम राहुल है।",
                        "en": "My name is Rahul. (नाम is masculine: मेरा)"
                    },
                    {
                        "hi": "आपका नाम क्या है?",
                        "en": "What is your name? (नाम is masculine: आपका)"
                    }
                ]
            }
        ],
        "vocabulary": [
            {
                "category": "Greetings",
                "devanagari": "नमस्ते",
                "transliteration": "namaste",
                "meaning": "hello"
            },
            {
                "category": "Greetings",
                "devanagari": "फिर मिलेंगे",
                "transliteration": "phir milenge",
                "meaning": "see you again"
            },
            {
                "category": "Greetings",
                "devanagari": "खुशी",
                "transliteration": "khushi",
                "meaning": "happiness / joy"
            },
            {
                "category": "Question Words",
                "devanagari": "क्या",
                "transliteration": "kya",
                "meaning": "what"
            },
            {
                "category": "Question Words",
                "devanagari": "कहाँ",
                "transliteration": "kahaan",
                "meaning": "where"
            },
            {
                "category": "Question Words",
                "devanagari": "कैसे",
                "transliteration": "kaise",
                "meaning": "how"
            },
            {
                "category": "Describing",
                "devanagari": "ठीक",
                "transliteration": "theek",
                "meaning": "fine / okay"
            },
            {
                "category": "Describing",
                "devanagari": "बड़ा",
                "transliteration": "bada",
                "meaning": "big"
            },
            {
                "category": "Places",
                "devanagari": "शहर",
                "transliteration": "shahar",
                "meaning": "city"
            },
            {
                "category": "Places",
                "devanagari": "यहाँ",
                "transliteration": "yahaan",
                "meaning": "here"
            },
            {
                "category": "Places",
                "devanagari": "वहाँ",
                "transliteration": "wahaan",
                "meaning": "there"
            },
            {
                "category": "Names",
                "devanagari": "नाम",
                "transliteration": "naam",
                "meaning": "name"
            }
        ]
    },
    3: {
        "unit_id": 3,
        "section_title": "SECTION 1, UNIT 3",
        "unit_title": "Talk about family & food",
        "description": "Describe family members, everyday meals, and favorite Indian drinks in Hindi.",
        "key_phrases": [
            {
                "id": 1,
                "hi": "यह मेरा भाई है।",
                "en": "This is my brother.",
                "audio_text": "यह मेरा भाई है।",
                "words": [
                    {
                        "hi": "यह",
                        "en": "this"
                    },
                    {
                        "hi": "मेरा",
                        "en": "my"
                    },
                    {
                        "hi": "भाई",
                        "en": "brother"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 2,
                "hi": "मेरी बहन खुश है।",
                "en": "My sister is happy.",
                "audio_text": "मेरी बहन खुश है।",
                "words": [
                    {
                        "hi": "मेरी",
                        "en": "my"
                    },
                    {
                        "hi": "बहन",
                        "en": "sister"
                    },
                    {
                        "hi": "खुश",
                        "en": "happy"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 3,
                "hi": "मेरी माँ चाय पीती है।",
                "en": "My mother drinks tea.",
                "audio_text": "मेरी माँ चाय पीती है।",
                "words": [
                    {
                        "hi": "मेरी",
                        "en": "my"
                    },
                    {
                        "hi": "माँ",
                        "en": "mother"
                    },
                    {
                        "hi": "चाय",
                        "en": "tea"
                    },
                    {
                        "hi": "पीती",
                        "en": "drinks"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 4,
                "hi": "पिताजी रोटी खाते हैं।",
                "en": "Father eats bread (roti).",
                "audio_text": "पिताजी रोटी खाते हैं।",
                "words": [
                    {
                        "hi": "पिताजी",
                        "en": "father"
                    },
                    {
                        "hi": "रोटी",
                        "en": "roti / bread"
                    },
                    {
                        "hi": "खाते",
                        "en": "eat"
                    },
                    {
                        "hi": "हैं।",
                        "en": "are"
                    }
                ]
            },
            {
                "id": 5,
                "hi": "मैं ठंडा पानी पीता हूँ।",
                "en": "I drink cold water.",
                "audio_text": "मैं ठंडा पानी पीता हूँ।",
                "words": [
                    {
                        "hi": "मैं",
                        "en": "I"
                    },
                    {
                        "hi": "ठंडा",
                        "en": "cold"
                    },
                    {
                        "hi": "पानी",
                        "en": "water"
                    },
                    {
                        "hi": "पीता",
                        "en": "drink"
                    },
                    {
                        "hi": "हूँ।",
                        "en": "am"
                    }
                ]
            },
            {
                "id": 6,
                "hi": "चाय गर्म है।",
                "en": "The tea is hot.",
                "audio_text": "चाय गर्म है।",
                "words": [
                    {
                        "hi": "चाय",
                        "en": "tea"
                    },
                    {
                        "hi": "गर्म",
                        "en": "hot"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 7,
                "hi": "खाना स्वादिष्ट है।",
                "en": "The food is delicious.",
                "audio_text": "खाना स्वादिष्ट है।",
                "words": [
                    {
                        "hi": "खाना",
                        "en": "food"
                    },
                    {
                        "hi": "स्वादिष्ट",
                        "en": "delicious"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            },
            {
                "id": 8,
                "hi": "मेरा परिवार बड़ा है।",
                "en": "My family is big.",
                "audio_text": "मेरा परिवार बड़ा है।",
                "words": [
                    {
                        "hi": "मेरा",
                        "en": "my"
                    },
                    {
                        "hi": "परिवार",
                        "en": "family"
                    },
                    {
                        "hi": "बड़ा",
                        "en": "big"
                    },
                    {
                        "hi": "है।",
                        "en": "is"
                    }
                ]
            }
        ],
        "grammar_tips": [
            {
                "title": "Tip: 'My' Matches the Family Member (मेरा / मेरी)",
                "summary": "Use मेरा for masculine nouns and मेरी for feminine nouns.",
                "rules": [
                    {
                        "category": "Masculine",
                        "change": "मेरा",
                        "examples": "मेरा भाई (my brother), मेरा परिवार (my family)"
                    },
                    {
                        "category": "Feminine",
                        "change": "मेरी",
                        "examples": "मेरी बहन (my sister), मेरी माँ (my mother)"
                    }
                ]
            },
            {
                "title": "Tip: Respectful Plural for Elders",
                "summary": "Hindi uses the plural verb form (हैं) for parents and elders to show respect, even when talking about one person.",
                "examples": [
                    {
                        "hi": "पिताजी रोटी खाते हैं।",
                        "en": "Father eats roti. (plural verb shows respect)"
                    },
                    {
                        "hi": "मेरी माँ चाय पीती है।",
                        "en": "My mother drinks tea. (informal singular)"
                    }
                ]
            },
            {
                "title": "Tip: 'I eat / I drink' Depends on the Speaker (-ता / -ती)",
                "summary": "With मैं, the verb ending shows the speaker's gender: -ता हूँ for a male speaker and -ती हूँ for a female speaker.",
                "examples": [
                    {
                        "hi": "मैं पानी पीता हूँ।",
                        "en": "I drink water. (male speaker)"
                    },
                    {
                        "hi": "मैं पानी पीती हूँ।",
                        "en": "I drink water. (female speaker)"
                    }
                ]
            }
        ],
        "vocabulary": [
            {
                "category": "Family",
                "devanagari": "माँ",
                "transliteration": "maa",
                "meaning": "mother"
            },
            {
                "category": "Family",
                "devanagari": "पिताजी",
                "transliteration": "pitaaji",
                "meaning": "father"
            },
            {
                "category": "Family",
                "devanagari": "भाई",
                "transliteration": "bhai",
                "meaning": "brother"
            },
            {
                "category": "Family",
                "devanagari": "बहन",
                "transliteration": "behen",
                "meaning": "sister"
            },
            {
                "category": "Family",
                "devanagari": "परिवार",
                "transliteration": "parivaar",
                "meaning": "family"
            },
            {
                "category": "Food & Drinks",
                "devanagari": "चाय",
                "transliteration": "chaay",
                "meaning": "tea"
            },
            {
                "category": "Food & Drinks",
                "devanagari": "दूध",
                "transliteration": "doodh",
                "meaning": "milk"
            },
            {
                "category": "Food & Drinks",
                "devanagari": "खाना",
                "transliteration": "khaana",
                "meaning": "food"
            },
            {
                "category": "Food & Drinks",
                "devanagari": "रोटी",
                "transliteration": "roti",
                "meaning": "roti / bread"
            },
            {
                "category": "Describing",
                "devanagari": "गर्म",
                "transliteration": "garm",
                "meaning": "hot"
            },
            {
                "category": "Describing",
                "devanagari": "ठंडा",
                "transliteration": "thanda",
                "meaning": "cold"
            },
            {
                "category": "Describing",
                "devanagari": "स्वादिष्ट",
                "transliteration": "svaadisht",
                "meaning": "delicious"
            }
        ]
    }
}

@router.get("")
@router.get("/")
def get_default_guidebook():
    return GUIDEBOOKS_DATA.get(1)

@router.get("/{unit_id}")
def get_unit_guidebook(unit_id: int):
    guidebook = GUIDEBOOKS_DATA.get(unit_id)
    if not guidebook:
        # Fall back to unit 1 guidebook with updated unit_id
        fallback = dict(GUIDEBOOKS_DATA[1])
        fallback["unit_id"] = unit_id
        fallback["section_title"] = f"SECTION 1, UNIT {unit_id}"
        return fallback
    return guidebook
