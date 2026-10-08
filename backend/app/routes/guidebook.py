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
