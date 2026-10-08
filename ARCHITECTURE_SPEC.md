# Duolingo Web Clone - Master Application Specification

This document serves as the single source of truth for all pages, routes, components, and interaction states in the Duolingo Desktop Web application.

---

## 1. Global Shell & Layout Structure

### 1.1 Desktop Layout (3-Column Architecture)
```
┌─────────────────┬───────────────────────────────┬─────────────────────────────┐
│  LEFT SIDEBAR   │       CENTER CONTENT FEED     │     RIGHT STICKY PANEL      │
│  (Width: 256px) │        (Max-width: 600px)     │     (Width: 360px)          │
│                 │                               │                             │
│ • duolingo Logo │ • Active Route View           │ • Topbar (Flag, Streak,     │
│ • LEARN         │   (/learn, /characters, etc.) │   Gems, Hearts)             │
│ • LETTERS       │                               │ • Super Duolingo Promo      │
│ • LEADERBOARDS  │                               │ • Unlock Leaderboards Card  │
│ • QUESTS        │                               │ • Daily Quests (10/10 XP)   │
│ • SHOP          │                               │ • Discover More & Footer    │
│ • PROFILE       │                               │                             │
│ • MORE (...)    │                               │ (Static on /learn & letters)│
└─────────────────┴───────────────────────────────┴─────────────────────────────┘
```

---

## 2. Exhaustive Page & Modal Directory

### Page 1: Landing & Onboarding (`/` & `/welcome`)
* **Hero Banner**: Mascot Duo phone illustration + *"The most fun way to learn languages, chess, and more!"*.
* **Buttons**:
  * `GET STARTED` -> Navigates to `/welcome/course-picker`.
  * `I ALREADY HAVE AN ACCOUNT` -> Opens Login modal.
* **Course Picker (`/welcome/course-picker`)**:
  * 2-column grid of language cards (Spanish, French, German, Hindi, Japanese, Chess, Math).
  * Learner count subtitle (e.g. `42M learners`).
* **Assessment & Placement**:
  * Question: *"How much Hindi do you know?"* (Options: I'm new / I know some words / Conversations).
  * Choice: *"Start from scratch"* vs *"Find my level"*.
  * On completion: Boots into `/lesson/1`.

---

### Page 2: Learning Path (`/learn`)
* **Section 1, Unit 1 Banner**:
  * Title: `SECTION 1, UNIT 1 - Form basic sentences`.
  * Button: `GUIDEBOOK (📖)` -> Opens `/guidebook/1`.
* **S-Curve Path Nodes**:
  * **Concentric Progress Ring**: Outer radial ring displaying lesson completion (e.g., Level 1 of 5).
  * **Active Node (⭐)**: Bright green 3D circle with white star, bouncing `START` speech bubble.
  * **Locked Nodes (⭐, 🎧, 🎥, 🏆)**: Gray 3D circles with disabled status.
  * **Treasure Chest Milestone (📦)**: Gold/silver chest node awarding gems.
  * **Mascot Flourishes**: Duo the owl and character Lily sitting beside the path.
  * **Jump Shortcut (⏩)**: `JUMP HERE?` purple circular button.

---

### Page 3: Full Lesson Player Engine (`/lesson/[id]`)
* **Top Header**:
  * `✕` Exit button -> Confirmation dialog: *"Wait, don't go! All progress will be lost."* (`Keep Learning` vs `Quit Lesson`).
  * Smooth progress bar.
  * `X IN A ROW` flame badge (appears dynamically on 2+ consecutive correct answers).
  * Hearts counter `❤️ 5`. Decrements on wrong answer with heart pulse animation.
* **Exercise Roster (5 Mandatory Types)**:
  1. **Multiple Choice (Cards)**: Image illustration + text + keyboard shortcut badges (1, 2, 3).
  2. **Word Bank (Tap to Translate / Tap what you hear)**:
     - Voice speaker button 🔊 (normal and turtle/slow speed buttons).
     - Assembled sentence slot.
     - Interactive word chip pool.
  3. **Match Pairs**: 2 columns of vocabulary chips with real-time matching and numbers 1-0.
  4. **Fill in the Blank**: Inline sentence gap with selectable pill choices.
  5. **Type the Answer**: Textarea with auto-focus and Enter key submit.
* **Bottom Feedback Drawer**:
  * **Disabled**: Gray `CHECK` button.
  * **Correct**: Light green drawer (`#d7ffb8`), green checkmark circle, randomized praise (*"Awesome!"*, *"Nice job!"*, *"Excellent!"*), sub-action pills (`Too easy`, `Too difficult`, `Report`), and green `CONTINUE` button.
  * **Incorrect**: Light red drawer (`#ffdfe0`), red cross circle, `Correct solution: [expected text]`, heart loss, sub-action pills, and red `CONTINUE` button.
  * **Report Modal**: Checkbox dialog (`Audio not correct`, `Hints missing`, `My answer should be accepted`).
* **Smart Interstitials & Mistake Review Loop**:
  * **Encouragement Interstitial**: Duo peeks from the bottom: *"Your hard work is paying off!"*.
  * **Mistake Review Trigger**: At the end of exercises, Duo peeks: *"Let's review the exercises you missed!"*.
  * **Mistake Remediation**: Re-serves failed exercises with yellow badge `PREVIOUS MISTAKE` until user scores 100%.

---

### Page 4: Lesson Celebration & Rewards
1. **Screen 1**: Confetti explosion, Duo & Vikram celebrating, `TOTAL XP: +14`, `ACCURACY: 92%`.
2. **Screen 2**: Duolingo Hindi Score milestone unlocked (`5`).
3. **Screen 3**: Streak animation (`Day 2 of your streak starts tomorrow!`) with Duo at campfire 🔥.
4. **Screen 4**: Streak goal commitment (7, 14, 30, 50 days) with `I CAN DO IT!` button.
5. **Screen 5**: Daily Quests Complete (`Earn 10 XP [10/10]`).
6. **Screen 6**: Chest reward (`You earned 5 gems!`) -> Returns to `/learn` with incremented progress ring.

---

### Page 5: Letters / Alphabet (`/characters`)
* Header: *"Let's learn Hindi! Get to know the characters and sounds"*.
* Button: `LEARN THE LETTERS`.
* Phonetic grid: Consonants (क, ख, ग, घ), Vowels (अ, आ, इ, ई), and Combinations.
* Includes static right-hand sidebar widgets.

---

### Page 6: Leaderboards (`/leaderboard`)
* **Locked State**: *"Unlock Leaderboards! Complete 2 more lessons to start competing"* + button `START A LESSON`.
* **Active League State**: Trophies (Bronze, Silver, Gold), countdown timer, and ranked table of learners.

---

### Page 7: Quests (`/quests`)
* Daily Quest card: `Earn 10 XP [10/10]` with treasure chest.
* Monthly challenge card with badge.

---

### Page 8: Shop & Super Duolingo (`/shop`)
* Banner: *"Get started with a 1 month free trial on Super"*.
* Hearts section: `Refill Hearts` (Full or 💎 350) and `Unlimited Hearts (Free Trial)`.
* Power-ups: `Streak Freeze (2/2 equipped)`.
* Super Duolingo comparison modal with astronaut Duo in space.

---

### Page 9: Learner Profile (`/profile`)
* Avatar banner + avatar creator dialog.
* Profile header: `AVIRAL JAIN`, `@AVIRALJAIN51695`, joined date, followers/following.
* Statistics: 1 Day streak, Total XP, Current league, Top 3 finishes.
* Achievements: Wildfire, Sage, Champion, Sharpshooter, Winner, Friendly.

---

### Page 10: Settings & FAQ (`/settings/account`)
* Preferences toggles: Sound effects, Animations, Motivational messages, Listening exercises.
* Appearance: Dark mode dropdown.
* Help Center FAQ & Log out action.
