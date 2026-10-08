# Duolingo Web Clone — Master Page & Button Specification Directory

> **System Status**: 10 Pages Created • 142+ Interactive Buttons Cataloged • 10 Interactive Modals  
> **PDF Export**: A 15-page publication-grade PDF is generated in the repository root: [`DUOLINGO_MASTER_PAGE_AND_BUTTON_SPECIFICATION.pdf`](./DUOLINGO_MASTER_PAGE_AND_BUTTON_SPECIFICATION.pdf).  
> **Author**: Aviral Jain (`Aviral0105`)  
> **Repository**: [https://github.com/Aviral0105/duolingo-web-clone](https://github.com/Aviral0105/duolingo-web-clone)

---

## 1. Master Page & Route Overview

| Page ID | Page Name | Route / URL | Button Count | Primary Purpose |
|---|---|---|---|---|
| **Page 1** | Landing & Course Placement | `/` & `/welcome` | **12** | Hero presentation, course picker grid & placement assessment. |
| **Page 2** | Learning Path (Homepage) | `/learn` | **10** | S-curve path, radial progress ring, star nodes & Unit banner. |
| **Page 3** | Full Lesson Player Engine | `/lesson/[id]` | **14** | 5 exercise types, audio synth, mistake review loop & drawers. |
| **Page 4** | Lesson Celebration & Rewards | `/lesson/[id]/celebrate` | **6** | Confetti, XP, Hindi score, campfire streak & chest claim. |
| **Page 5** | Letters / Hindi Alphabet | `/characters` (`/letters`) | **46** | 42 Devanagari character cards with native audio synth & quiz. |
| **Page 6** | Leaderboards League | `/leaderboard` | **17** | Bronze League table, user rank & 12-emoji status picker. |
| **Page 7** | Quests & Daily Rewards | `/quests` | **5** | Purple Welcome banner, daily XP quests & Monthly challenge. |
| **Page 8** | Shop & Super Duolingo | `/shop` | **6** | Hearts refills, freeze equip, and Super Duolingo trial. |
| **Page 9** | Learner Profile | `/profile` | **10** | Avatar hero, stats matrix, Following/Followers hub & Add friends. |
| **Page 10** | Settings & Account Preferences | `/settings/account` | **11** | Sound & animation toggles, profile inputs & logout. |
| **Shell** | Persistent Left Sidebar | *(All Main Views)* | **14** | Nav pills, MORE popover menu (6 sub-actions), Super shortcut. |
| **Topbar** | Persistent Stat Bar | *(All Main Views)* | **4** | Course flag (`🇮🇳 5`), Streak (`🔥 1`), Gems (`💎 505`), Hearts (`❤️ 4`). |

---

## 2. Exhaustive Button Directory by Page

### Global Shell: Left Sidebar (14 Buttons)
1. **duolingo Logo**: Green bold logo -> Navigates to `/learn`.
2. **LEARN**: Cottage icon 🏠 -> Navigates to `/learn`.
3. **LETTERS**: Devanagari `क` icon -> Navigates to `/characters` (Hindi alphabet).
4. **LEADERBOARDS**: Shield icon 🛡️ -> Navigates to `/leaderboard`.
5. **QUESTS**: Chest icon 📦 -> Navigates to `/quests`.
6. **SHOP**: Store awning icon 🏪 -> Navigates to `/shop`.
7. **PROFILE**: Circular avatar badge `'A'` -> Navigates to `/profile`.
8. **... MORE**: Purple circle `•••` -> Toggles anchored floating popover with 6 options:
   - *Settings*: Navigates to `/settings/account`.
   - *Schools*: Opens Duolingo for Schools modal dialog.
   - *Podcast*: Opens Audio Stories & podcasts dialog.
   - *Dictionary*: Opens Hindi vocabulary lookup.
   - *Help*: Opens Help Center FAQ dialog.
   - *Log out*: Prompts logout confirmation.
9. **✨ Super Duolingo**: Full-width purple button -> Opens Super comparison modal / `/shop`.

### Global Shell: Topbar Header (4 Buttons)
1. **Course Flag (`🇮🇳 5`)**: Opens `CourseModal` (Course Switcher, `+ Add a new course`, `+ Add section`).
2. **Streak Counter (`🔥 1`)**: Opens `StreakModal` (October 2026 calendar, streak freeze status).
3. **Gems Counter (`💎 505`)**: Opens `ShopModal` (Gem balance & power-ups).
4. **Hearts / Energy Counter (`❤️ 4` / `⚡`)**: Opens `EnergyModal` (Refill for 350 gems, unlimited Super trial).

---

### Page 1: Landing & Course Placement (`/` & `/welcome`) — 12 Buttons
1. **GET STARTED**: Green 3D button -> Navigates to `/welcome/course-picker`.
2. **I ALREADY HAVE AN ACCOUNT**: White 3D button -> Opens Login modal.
3. **Course Cards (7 Cards)**: Spanish, French, German, Hindi, Japanese, Chess, Math -> Selects active language.
4. **CONTINUE (Picker)**: Green 3D button -> Advances to Placement assessment.
5. **Start from scratch**: Choice pill -> Boots into `/lesson/1`.
6. **Find my level**: Choice pill -> Launches placement diagnostic test.

---

### Page 2: Learning Path (`/learn`) — 10 Buttons
1. **GUIDEBOOK (📖)**: Book icon button -> Opens Section 1 Unit 1 Grammar notes (`/guidebook/1`).
2. **Active Star Node (⭐ 1)**: Green 3D circle with outer radial ring -> Opens `StartLessonModal` (`START +10 XP`).
3. **Locked Node 2 (⭐)**: Gray 3D node -> Displays locked requirement modal.
4. **Locked Node 3 (🎧 Audio)**: Gray listening node -> Displays audio lesson lock modal.
5. **Locked Node 4 (📖 Story)**: Gray story node -> Displays interactive story lock modal.
6. **Treasure Chest (📦)**: Gold milestone chest -> Displays chest unlock bounty.
7. **JUMP HERE? (⏩)**: Purple jump button -> Challenge test to skip unit.
8. **Scroll to Top (⬆️)**: Floating white circle button -> Smoothly scrolls to path banner.
9. **Super Promo "TRY FOR FREE"**: White button on purple card -> Navigates to `/shop`.
10. **Daily Quests "VIEW ALL"**: Cyan text -> Navigates to `/quests`.

---

### Page 3: Full Lesson Player Engine (`/lesson/[id]`) — 14 Buttons
1. **✕ Close Button**: Top-left cross -> Opens Exit confirmation dialog.
2. **Normal Audio Speaker (🔊)**: Web Audio speech synthesis at 1.0x speed.
3. **Slow Audio Turtle (🐢)**: Web Audio speech synthesis at 0.6x slowed speed.
4. **Choice Cards (1, 2, 3)**: Multiple-choice answer options with keyboard badges.
5. **Word Bank Chips (Pool)**: Word chips tapped into sentence assembly slot.
6. **Slotted Word Chips**: Word chips tapped to return back to available pool.
7. **CHECK Button**: Green 3D button (gray when disabled) -> Evaluates answer and opens feedback drawer.
8. **CONTINUE Button**: Green (correct) or Red (wrong) -> Advances to next exercise or Mistake loop.
9. **TOO EASY Pill**: Feedback drawer sub-action -> Submits difficulty telemetry.
10. **TOO DIFFICULT Pill**: Feedback drawer sub-action -> Submits difficulty telemetry.
11. **REPORT (🚩)**: Opens `ReportModal` (Audio issue, translation error, etc.).
12. **QUIT LESSON**: Red outline button in exit modal -> Aborts lesson, returns to `/learn`.
13. **KEEP LEARNING**: Green 3D button in exit modal -> Resumes lesson exercise.

---

### Page 4: Lesson Celebration & Rewards (`/lesson/[id]/celebrate`) — 6 Buttons
1. **CONTINUE (Screen 1)**: Green 3D button -> Advances past confetti & XP (+14) tally.
2. **CONTINUE (Screen 2)**: Green 3D button -> Advances past Duolingo Hindi Score (+5).
3. **CONTINUE (Screen 3)**: Green 3D button -> Advances past Campfire streak animation.
4. **Goal Selector Pills (7/14/30/50 days)**: Selects user commitment goal.
5. **I CAN DO IT!**: Green 3D button -> Commits goal and advances to rewards.
6. **CLAIM REWARD & FINISH**: Green 3D button -> Claims 5 gems, updates progress ring, and returns to `/learn`.

---

### Page 5: Letters / Hindi Alphabet (`/characters`) — 46 Buttons
1. **LEARN THE LETTERS**: White 3D button on cyan -> Opens practice quiz modal.
2. **Filter: All Letters (42)**: Displays all 42 Devanagari character cards.
3. **Filter: Vowels / स्वर (12)**: Filters to 12 vowels (अ to अः).
4. **Filter: Consonants / व्यंजन (30)**: Filters to 30 consonants (क to ह).
5. **42 Character Cards**: Each card triggers native Web Audio speech pronunciation (`hi-IN`) and animates green mastery bars.
6. **Quiz Audio Prompt (🔊)**: Cyan speaker button -> Replays phonetic audio challenge.
7. **Quiz Choices (4 Cards)**: Evaluates matching character choice.
8. **Quiz Exit Button**: Closes practice session.

---

### Page 6: Leaderboards League (`/leaderboard`) — 17 Buttons
1. **START A LESSON**: Green 3D button -> Boots into `/lesson/1` to earn XP when locked.
2. **Top 3 Ranked Learner Rows (3)**: Nitheesh Kumar B (#1), AVIRAL JAIN (#2), Seyit Musevi (#3).
3. **Emoji Status Grid (12 Buttons)**: 😎, 🎊, 💪, 👀, 🍿, 🇮🇳, 😠, 💯, 💩, 🏆, ⛏️, 😾 -> Updates user avatar sticker.
4. **League Info Tooltip**: Explains promotion/demotion zone to Silver League.

---

### Page 7: Quests & Daily Rewards (`/quests`) — 5 Buttons
1. **Active Quest Chest (📦)**: Gold chest button -> Claims completed 10 XP rewards.
2. **Locked Quest Card**: Gray padlock card -> Shows unlock requirement.
3. **START A LESSON (Right Rail)**: White 3D button with blue text -> Boots into active lesson.
4. **Footer Links (8 Links)**: About, Blog, Store, Efficacy, Careers, Investors, Terms, Privacy.

---

### Page 8: Shop & Super Duolingo (`/shop`) — 6 Buttons
1. **START MY 1 MONTH FREE TRIAL**: White 3D button on purple -> Opens Super comparison sheet.
2. **REFILL HEARTS (💎 350)**: Blue 3D button -> Deducts gems, restores hearts to 5 via backend API.
3. **GET UNLIMITED HEARTS**: Purple 3D button -> Activates Super mode (unlimited hearts ∞).
4. **EQUIP STREAK FREEZE (💎 200)**: Cyan button (`2/2 equipped`) -> Equips freeze protection.
5. **Super Modal: START FREE TRIAL**: Purple 3D button -> Activates Super status.
6. **Super Modal: ✕ Close**: Top-right close button.

---

### Page 9: Learner Profile (`/profile`) — 10 Buttons
1. **Avatar Silhouette (+)**: Pastel blue card with cyan dashed border -> Opens Avatar Builder modal.
2. **Pencil Edit Button (✏️)**: White rounded-2xl square -> Opens Profile editor dialog.
3. **0 Following Link**: Sky blue text -> Switches right rail to `FOLLOWING` tab.
4. **0 Followers Link**: Sky blue text -> Switches right rail to `FOLLOWERS` tab.
5. **Achievements VIEW ALL**: Cyan uppercase text -> Expands all 15+ achievements.
6. **Tab: FOLLOWING**: Active cyan underline -> Displays ensemble character artwork & community caption.
7. **Tab: FOLLOWERS**: Inactive gray text -> Displays follower referral links.
8. **Find friends Row**: 🔍 icon + `›` chevron -> Opens search dialog.
9. **Invite friends Row**: ✉️ green icon + `›` chevron -> Copies referral link to clipboard with toast.
10. **Avatar Modal: Save Avatar**: Green 3D button -> Saves customized avatar and displays toast.

---

### Page 10: Settings & Account Preferences (`/settings/account`) — 11 Buttons
1. **Toggle: Sound Effects**: Green pill switch -> Enables/disables answer chimes.
2. **Toggle: Animations**: Green pill switch -> Enables/disables confetti explosions.
3. **Toggle: Motivational Messages**: Green pill switch -> Enables/disables interstitial popups.
4. **Toggle: Listening Exercises**: Green pill switch -> Includes/excludes audio questions.
5. **SAVE CHANGES**: Green 3D button -> Commits settings to state and displays toast.
6. **CANCEL**: White 3D button -> Discards changes, returns to `/learn`.
7. **Nav: Account**: Active blue item -> Account credentials section.
8. **Nav: Sound & Audio**: Gray item -> Scrolls to sound toggles.
9. **Nav: Notifications**: Gray item -> Streak reminder settings.
10. **Nav: Super Duolingo**: Gray item -> Opens `/shop`.
11. **LOG OUT Button**: Red outline button -> Triggers account logout.

---

## 3. Global Interactive Modals Directory (10 Modals)

| Modal Name | Trigger Source | Internal Action Buttons | Connected Action |
|---|---|---|---|
| **CourseModal** | Topbar flag (`🇮🇳 5`) | Active Hindi, Switch French, `+ Add a new course`, `+ Add section`, `✕` | Switches language course and adds curriculum units. |
| **StreakModal** | Topbar flame (`🔥 1`) | October 2026 calendar, `EQUIP STREAK FREEZE`, `✕` | Displays streak history and freeze protection status. |
| **EnergyModal** | Topbar heart (`❤️ 4`) | `Refill Hearts (💎 350)`, `Get Unlimited with Super`, `✕` | Restores hearts via gems or activates Super trial. |
| **ShopModal** | Topbar gem (`💎 505`) | Gem balance overview, Shop navigation shortcut, `✕` | Quick balance dialog. |
| **StartLessonModal** | Path star node (⭐) | `START (+10 XP)`, `Back to path`, `✕` | Boots into `/lesson/1` or dismisses dialog. |
| **ExitLessonModal** | Lesson header `✕` | `QUIT LESSON`, `KEEP LEARNING` | Guards against accidental progress loss. |
| **ReportModal** | Feedback drawer (🚩) | Category checkboxes, `SUBMIT REPORT`, `CANCEL` | Submits exercise correction reports. |
| **LettersQuizModal** | Letters `LEARN THE LETTERS` | 🔊 Replay audio, 4 Letter choices, `Exit Practice` | Interactive phonetic character recognition quiz. |
| **AvatarModal** | Silhouette `+` / pencil `✏️` | Hair/Color options, `Save Avatar`, `Cancel` | Customizes avatar representation. |
| **FindFriendsModal** | Profile `Find friends` | Search input, `Done`, `✕` | Searches user accounts by handle and name. |

---

## 4. System Connection & Routing Matrix

```
[ Landing / Welcome (Page 1) ]
      │ (Get Started)
      ▼
[ Course Picker / Placement ]
      │ (Continue / Start from scratch)
      ▼
[ Learning Path (Page 2: /learn) ] ──(Click Star ⭐)──▶ [ Start Lesson Modal ]
      │                                                         │ (START)
      │                                                         ▼
      │                                            [ Lesson Engine (Page 3) ]
      │                                                         │
      │                                                (Score 100% / Review)
      │                                                         ▼
      │                                            [ Celebration (Page 4) ]
      │                                                         │
      │                                                  (Claim Rewards)
      │◄────────────────────────────────────────────────────────┘
      │
      ├──(LETTERS Tab)──────▶ [ Hindi Letters / Audio (Page 5: /characters) ]
      ├──(LEADERBOARDS Tab)─▶ [ Bronze League & Emoji (Page 6: /leaderboard) ]
      ├──(QUESTS Tab)───────▶ [ Daily Quests & Badges (Page 7: /quests) ]
      ├──(SHOP Tab)─────────▶ [ Power-ups & Super (Page 8: /shop) ]
      ├──(PROFILE Tab)──────▶ [ Identity, Stats, Social Hub (Page 9: /profile) ]
      └──(MORE Popover)─────▶ [ Settings & Preferences (Page 10: /settings/account) ]
```
