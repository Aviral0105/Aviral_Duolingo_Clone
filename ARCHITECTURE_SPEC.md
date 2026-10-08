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

### Page 7: Quests & Daily Rewards (`/quests`)

#### Center Column: Quests Feed
| Element / Card | Exact Color & Styling | Details |
|---|---|---|
| **Welcome Banner** | Background: `#7c3aed` (Deep Violet)<br>Text: White, rounded-3xl | Mascot Duo raising gold chest with sparkles.<br>Title: **`Welcome!`**<br>Text: `Complete quests to earn rewards! Quests refresh every day.` |
| **Section Header** | Title: `Daily Quests` (`#4b4b4b` bold 20px)<br>Timer: `⏱️ 2 HOURS` in orange (`#ff9600`) | Header row with clock icon and remaining reset time. |
| **Active Quest Card: Earn 10 XP** | Background: `#ffffff`, Border: `2px solid #e5e5e5`, rounded-3xl<br>Left Icon: Yellow lightning bolt ⚡ (`#ffc800`) | Progress bar: Full gold fill (`#ffc800`) with centered text `10 / 10`.<br>Right side: Interactive treasure chest 📦. |
| **Locked Quest Card** | Background: `#ffffff`, Border: `2px solid #e5e5e5`, rounded-3xl<br>Opacity: `70%`, Icon: Gray padlock 🔒 | Text: `More quests unlock soon` (`#afafaf` bold). |

#### Right Column: Monthly Challenges Widget
| Element / Button | Exact Color & Styling | Details |
|---|---|---|
| **Top Stats** | Persistent right bar | `🇮🇳 5` • `🔥 1` • `💎 505` • `❤️ 4` |
| **Monthly Challenges Card** | Background: `#ffffff`, Border: `2px solid #e5e5e5`, rounded-3xl | Header: `Monthly challenges unlock soon!`<br>Subtitle: `Complete each month's challenge to earn exclusive badges`<br>Badge Illustration: Gold medal with lightning bolt 🪙✨. |
| **"START A LESSON" Button** | Background: `#ffffff`<br>Border: `2px solid #e5e5e5`, bottom `4px solid #d4d4d4`<br>Text: `#1cb0f6` (Sky blue), uppercase bold | Full-width 3D rubber button navigating into active lesson. |
| **Footer Links** | Gray text `#afafaf`, uppercase bold 10px | `ABOUT` • `BLOG` • `STORE` • `EFFICACY` • `CAREERS` • `INVESTORS` • `TERMS` • `PRIVACY` |


---

### Page 8: Shop & Super Duolingo (`/shop`)
* Banner: *"Get started with a 1 month free trial on Super"*.
* Hearts section: `Refill Hearts` (Full or 💎 350) and `Unlimited Hearts (Free Trial)`.
* Power-ups: `Streak Freeze (2/2 equipped)`.
* Super Duolingo comparison modal with astronaut Duo in space.

---

### Page 9: Learner Profile (`/profile`)

#### 1. Persistent Shell Components (Active Profile State)
| Element / Button | Exact Color & Styling | Details / Behavior |
|---|---|---|
| **Left Sidebar: PROFILE Tab** | Background: `#ddf4ff` (Sky tint)<br>Border: `2px solid #84d8ff`<br>Text: `#1cb0f6` (Duolingo Cyan), uppercase bold | Active route indicator. Left icon displays circular user badge `'A'` with cyan dotted ring outline. |
| **Topbar: Course Flag** | Badge with Indian flag 🇮🇳 and text `5` | Click opens Course Switcher modal (`+ Add a new course`, `+ Add section`). |
| **Topbar: Streak Counter** | Icon: 🔥 (`#ff9600`), Text: `1` | Click opens October 2026 Streak calendar modal with freeze status. |
| **Topbar: Gems Counter** | Icon: 💎 (`#1cb0f6`), Text: `505` | Click opens Shop modal with gem balance and refill options. |
| **Topbar: Hearts Counter** | Icon: ❤️ (`#ff4b4b`), Text: `4` | Click opens Hearts & Energy modal (Refill for 350 gems / Unlimited Super trial). |

#### 2. Center Column: Profile Identity, Stats & Achievements
| Element / Button | Exact Color & Styling | Details / Behavior |
|---|---|---|
| **Avatar Banner Card** | Background: `#dff2fb` (Soft pastel sky blue), rounded-3xl, height ~240px | Hero container framing the user's avatar silhouette. |
| **Avatar Silhouette & Plus** | Silhouette: `#a3d9f8` fill with `#1cb0f6` cyan dashed stroke.<br>Center badge: White circle with cyan `+` icon | Prompts user to customize avatar. Click opens Avatar Builder modal. |
| **Pencil Edit Button** | Rounded-2xl square button, background `#f0f0f0` / hover white, border `2px solid #e5e5e5`, dark slate pencil icon ✏️ | Positioned at top-right corner of avatar box. Click opens Profile & Avatar Edit modal. |
| **Display Name** | Text: `AVIRAL JAIN` (`#3c3c3c`, bold 24px) | Full user display name. |
| **Username Handle** | Text: `AVIRALJAIN51695` (`#afafaf`, bold 14px) | Unique Duolingo account handle. |
| **Account Creation Date** | Text: `Joined October 2026` (`#afafaf`, semibold 14px) | Profile join milestone. |
| **Following Link** | Text: `0 Following` (`#1cb0f6`, bold 15px, hover underline) | Click switches right rail or opens modal to view followed accounts. |
| **Followers Link** | Text: `0 Followers` (`#1cb0f6`, bold 15px, hover underline) | Click switches right rail or opens modal to view follower accounts. |
| **Learning Flag Badge** | Indian Flag 🇮🇳 in subtle border pill | Positioned at right side across from profile name. |
| **Statistics Header** | Text: `Statistics` (`#3c3c3c`, bold 20px) | Section header introducing the 2x2 stats matrix. |
| **Stat Card 1: Day Streak** | White card, border `2px solid #e5e5e5`, rounded-2xl p-4.<br>Icon: 🔥 (`#ff9600`) | Main: `1` (`#3c3c3c` bold 20px)<br>Subtitle: `Day streak` (`#afafaf` bold 12px) |
| **Stat Card 2: Total XP** | White card, border `2px solid #e5e5e5`, rounded-2xl p-4.<br>Icon: ⚡ (`#ffc800`) | Main: `15` (`#3c3c3c` bold 20px)<br>Subtitle: `Total XP` (`#afafaf` bold 12px) |
| **Stat Card 3: Current League** | White card, border `2px solid #e5e5e5`, rounded-2xl p-4 relative.<br>Icon: 🛡️ (Bronze shield) | Main: `Bronze` (`#3c3c3c` bold 20px)<br>Subtitle: `Current league` (`#afafaf` bold 12px)<br>Badge: Top-right corner pill `WEEK 1` in orange (`#ff9600` bg, white bold text). |
| **Stat Card 4: Top 3 Finishes** | White card, border `2px solid #e5e5e5`, rounded-2xl p-4.<br>Icon: 🏅 (Gray ribbon medal) | Main: `0` (`#3c3c3c` bold 20px)<br>Subtitle: `Top 3 finishes` (`#afafaf` bold 12px) |
| **Achievements Header** | Text: `Achievements` (`#3c3c3c`, bold 20px) | Section header with `VIEW ALL` link on the right. |
| **"VIEW ALL" Link** | Text: `VIEW ALL` (`#1cb0f6`, uppercase bold 12px, hover underline) | Click navigates/expands full 15+ Duolingo achievements list. |
| **Achievement Cards** | White cards with custom tier badges and progress meters | 1. **Wildfire** (🔥 Streak milestones)<br>2. **Sage** (⚡ XP milestones)<br>3. **Scholar** (📚 Word vocabulary count)<br>4. **Champion** (👑 League advancement) |

#### 3. Right Rail: Social Hub & Add Friends (Circled Reference)
| Element / Button | Exact Color & Styling | Details / Behavior |
|---|---|---|
| **Top Card: Social Hub** | Background: `#ffffff`, Border: `2px solid #e5e5e5`, rounded-3xl overflow-hidden | Houses following/followers tabs and community illustration. |
| **"FOLLOWING" Tab** | Active: Text `#1cb0f6`, font-black 13px uppercase, bottom border `2px solid #1cb0f6` | Default selected tab showing accounts you follow. |
| **"FOLLOWERS" Tab** | Inactive: Text `#afafaf`, font-black 13px uppercase, bottom border transparent | Click toggles to followers view. |
| **Character Ensemble Graphic** | Colorful cartoon illustration | Cast members celebrating together (Lily, Zari, Junior, Bea, Lin, Vikram, Oscar, Eddy, Lucy). |
| **Social Value Proposition** | Text: `Learning is more fun and effective when you connect with others.` | Centered subtitle (`#777777`, font-medium 13px, leading-relaxed). |
| **Bottom Card: Add Friends** | Background: `#ffffff`, Border: `2px solid #e5e5e5`, rounded-3xl p-5 | Friends discovery and referral widget. |
| **Card Header** | Text: `Add friends` (`#3c3c3c`, bold 18px) | Widget header. |
| **"Find friends" Row Button** | Left Icon: 🔍 Magnifying glass<br>Text: `Find friends` (`#4b4b4b`, bold 15px)<br>Right Icon: Chevron `>` (`#afafaf`) | Click opens friend search drawer with username, contact sync, and Facebook search. |
| **"Invite friends" Row Button** | Left Icon: 📭 Green Duo envelope / referral gift<br>Text: `Invite friends` (`#4b4b4b`, bold 15px)<br>Right Icon: Chevron `>` (`#afafaf`) | Click copies referral link `duolingo.com/invite/AVIRALJAIN51695` to clipboard with animated toast notification. |
| **Footer Links** | Gray text `#afafaf`, uppercase bold 10px flex-wrap gap-2 | `ABOUT` • `BLOG` • `STORE` • `EFFICACY` • `CAREERS` • `INVESTORS` • `TERMS` • `PRIVACY` |

---

### Page 10: Settings & FAQ (`/settings/account`)
* Preferences toggles: Sound effects, Animations, Motivational messages, Listening exercises.
* Appearance: Dark mode dropdown.
* Help Center FAQ & Log out action.
