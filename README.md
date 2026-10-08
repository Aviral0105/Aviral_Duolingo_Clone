# Duolingo Web Application Clone (Fullstack)

A modern, responsive, pixel-perfect clone of the Duolingo web application built with **Next.js (TypeScript)**, **FastAPI (Python)**, and **SQLite**.

---

## 🌟 Highlights & Key Features

1. **Exact 1:1 UI/UX Replication**:
   - Signature Duolingo rubbery 3D buttons (`border-b-4 active:border-b-0`).
   - Undulating S-curve skill path with Section banners, progress nodes, and mascot flourishes.
   - Interactive popovers: **Course Switcher & Score roadmap (5 to 70)**, **October 2026 Streak Calendar**, **Shop / Super Duolingo**, **Energy & Hearts sheet**, and **Unit 1 Guidebook**.
   - Mascot interactions (Duo the owl and Lily character).

2. **Full Lesson Player Engine (The 5 Mandatory Exercise Types)**:
   - **Multiple Choice**: 2x2 image option cards with audio speech buttons.
   - **Word Bank / Tap to Translate**: Assembled sentence slot with interactive token pool.
   - **Match Pairs**: Real-time matching between foreign and English vocabulary.
   - **Fill in the Blank**: Sentence gap with selectable options.
   - **Type the Answer**: Free-text input with auto-focus and Enter key submission.

3. **Signature Feedback Drawer & Audio Feedback**:
   - **Correct Answer**: Slide-up light green drawer (`#d7ffb8`), green checkmark, and synthesized high chime.
   - **Wrong Answer**: Slide-up light red drawer (`#ffdfe0`), red cross, solution text, and error thud.
   - **Victory Screen**: Multi-color confetti explosion (`canvas-confetti`), victory fanfare, XP gained tally, and streak increment.

4. **Gamification & Progress Tracking**:
   - Hearts system (lose a heart on wrong answer; out-of-hearts modal).
   - Hearts refill via **Practice Hub** (`/practice`) and free demo refills.
   - Daily Streak counter and October calendar.
   - Silver League Leaderboard (`/leaderboard`) with ranked learners.
   - Learner Profile (`/profile`) with 4 overview stat pills (🔥 Streak, 🇫🇷 Level, 🏆 League, ⚡ Total XP) and achievements.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend: Next.js 16 (App Router + Tailwind CSS)"]
        Nav["Sidebar & Topbar Navigation"]
        Path["S-Curve Learning Path (/learn)"]
        Modals["Modals (Course, Streak Calendar, Energy, Shop, Guidebook)"]
        Engine["Lesson Engine (/lesson/[id])"]
        Exercises["5 Exercise Renderers (Choice, WordBank, Pairs, Blank, Type)"]
        Feedback["Feedback Drawer & Audio Synthesizer"]
    end

    subgraph Server ["Backend: Python FastAPI"]
        API["FastAPI REST Endpoints (/api/...)"]
        UserRouter["User & Gamification Router"]
        PathRouter["Learning Path Router"]
        LessonRouter["Lesson Engine Router"]
        LeadRouter["Leaderboard Router"]
    end

    subgraph Database ["Persistence: SQLite + SQLAlchemy"]
        DB[(duolingo.db)]
        Tables["Users, Courses, Units, Lessons, Exercises, UserProgress"]
    end

    Client -->|JSON over HTTP| API
    API --> Tables
    Tables --> DB
```

---

## 🗄️ Database Schema (SQLite)

```mermaid
erDiagram
    USER ||--o{ USER_PROGRESS : tracks
    COURSE ||--o{ UNIT : contains
    UNIT ||--o{ LESSON : contains
    LESSON ||--o{ EXERCISE : contains
    LESSON ||--o{ USER_PROGRESS : records

    USER {
        int id PK
        string username "Aviral Jain"
        string handle "@AVIRALJAIN213584"
        int xp "265"
        int streak "3"
        int hearts "5"
        int gems "126"
        boolean is_super "false"
        datetime last_active_date
    }

    COURSE {
        int id PK
        string code "fr"
        string title "French"
        string flag "🇫🇷"
    }

    UNIT {
        int id PK
        int course_id FK
        string section_title "SECTION 1, UNIT 1"
        string title "Order at a café"
        int order_index
    }

    LESSON {
        int id PK
        int unit_id FK
        string title "Basics 1"
        string icon "star"
        int xp_reward "10"
        int order_index
    }

    EXERCISE {
        int id PK
        int lesson_id FK
        string type "MULTIPLE_CHOICE | WORD_BANK | MATCH_PAIRS | FILL_BLANK | TYPE_ANSWER"
        string category_tag "NEW WORD"
        string prompt
        string audio_text
        json content
        string correct_answer
    }

    USER_PROGRESS {
        int id PK
        int user_id FK
        int lesson_id FK
        boolean is_completed
        int crowns
    }
```

---

## 🚀 Setup & Running Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Backend (Optional / Connected Mode)
```bash
cd backend
pip install -r requirements.txt
python run.py
```
Backend API will be running on [http://localhost:8000](http://localhost:8000). Interactive Swagger docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🧠 Interview Defense & Technical Decisions

- **Why Next.js App Router?** Provides clean component separation, automatic route prefetching, zero runtime overhead for static routes, and smooth client transitions.
- **Why Web Audio API for sound effects?** Zero network dependency, zero audio latency, and works offline without downloading heavy MP3 assets.
- **Why normalized SQLite schema with JSON exercise content?** Standard pattern in educational quiz engines: relational structure preserves rigid constraints for units/lessons/users, while polymorphic JSON content allows varied exercise types without schema fragmentation.
