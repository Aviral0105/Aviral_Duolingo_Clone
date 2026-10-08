import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Duolingo Clone - Master Page & Button Specification</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2b2b2b;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .page-break {
      page-break-before: always;
    }
    .cover {
      text-align: center;
      padding-top: 80px;
      padding-bottom: 60px;
    }
    .cover-title {
      color: #58cc02;
      font-size: 34pt;
      font-weight: 900;
      letter-spacing: -1px;
      margin-bottom: 5px;
    }
    .cover-subtitle {
      color: #1cb0f6;
      font-size: 18pt;
      font-weight: 800;
      margin-bottom: 25px;
    }
    .cover-meta {
      font-size: 12pt;
      color: #777;
      margin-top: 30px;
      line-height: 1.8;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 9pt;
      text-transform: uppercase;
    }
    .badge-green { background-color: #d7ffb8; color: #388e3c; }
    .badge-blue { background-color: #ddf4ff; color: #0288d1; }
    .badge-purple { background-color: #f3e8ff; color: #7e22ce; }
    .badge-orange { background-color: #ffedd5; color: #c2410c; }
    .badge-gray { background-color: #f3f4f6; color: #4b5563; }

    h1 {
      color: #1f2937;
      font-size: 18pt;
      font-weight: 900;
      border-bottom: 2px solid #58cc02;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    h2 {
      color: #374151;
      font-size: 14pt;
      font-weight: 800;
      margin-top: 18px;
      margin-bottom: 8px;
    }
    h3 {
      color: #4b5563;
      font-size: 11.5pt;
      font-weight: 700;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    p {
      margin-top: 4px;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 16px;
      font-size: 9.5pt;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f9fafb;
      color: #374151;
      font-weight: 800;
      font-size: 9.5pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    tr:nth-child(even) td {
      background-color: #fcfcfd;
    }
    .code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9pt;
      background-color: #f3f4f6;
      padding: 1px 4px;
      border-radius: 4px;
      color: #c026d3;
    }
    .summary-box {
      border: 2px solid #58cc02;
      background-color: #f7fee7;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 20px;
    }
    .summary-stat {
      display: inline-block;
      margin-right: 25px;
      font-weight: 800;
    }
    .summary-stat span {
      display: block;
      font-size: 18pt;
      color: #58cc02;
      font-weight: 900;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover">
    <div class="cover-title">duolingo</div>
    <div class="cover-subtitle">Web Application Clone — Master Page & Button Specification</div>
    <p style="font-size: 13pt; color: #4b4b4b; font-weight: 600; max-width: 500px; margin: 0 auto;">
      Complete Record of Routes, Pages, Buttons, Exact Connections, and Visual Styling
    </p>

    <div style="margin-top: 50px;">
      <div class="summary-box" style="display: inline-block; text-align: left; max-width: 500px;">
        <div class="summary-stat">
          <span>10</span>
          Total Pages Created
        </div>
        <div class="summary-stat">
          <span>142+</span>
          Total Interactive Buttons
        </div>
        <div class="summary-stat">
          <span>10</span>
          Interactive Modals
        </div>
      </div>
    </div>

    <div class="cover-meta">
      <strong>Author / Developer:</strong> Aviral Jain (Aviral0105)<br>
      <strong>Framework:</strong> Next.js 16 (App Router) + TypeScript + Tailwind CSS<br>
      <strong>Backend API:</strong> Python FastAPI + SQLite Relational Schema<br>
      <strong>Repository:</strong> https://github.com/Aviral0105/duolingo-web-clone<br>
      <strong>Documentation Date:</strong> October 2026
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 1: MASTER PAGE INDEX -->
  <h1>1. Master Page & Route Overview</h1>
  <p>The application consists of <strong>10 distinct full-stack pages</strong>, backed by a persistent three-column shell layout and 10 contextual modal dialogs.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Page ID</th>
        <th style="width: 25%;">Page Name</th>
        <th style="width: 23%;">Route / URL</th>
        <th style="width: 15%;">Button Count</th>
        <th style="width: 25%;">Primary Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Page 1</strong></td>
        <td>Landing & Placement</td>
        <td><span class="code">/</span> &amp; <span class="code">/welcome</span></td>
        <td><strong>12</strong></td>
        <td>Hero presentation, course picker grid &amp; placement assessment.</td>
      </tr>
      <tr>
        <td><strong>Page 2</strong></td>
        <td>Learning Path (Home)</td>
        <td><span class="code">/learn</span></td>
        <td><strong>10</strong></td>
        <td>S-curve path, radial progress ring, star nodes &amp; Unit banner.</td>
      </tr>
      <tr>
        <td><strong>Page 3</strong></td>
        <td>Full Lesson Player</td>
        <td><span class="code">/lesson/[id]</span></td>
        <td><strong>14</strong></td>
        <td>5 exercise types, audio synth, mistake review loop &amp; drawers.</td>
      </tr>
      <tr>
        <td><strong>Page 4</strong></td>
        <td>Celebration &amp; Rewards</td>
        <td><span class="code">/lesson/[id]/celebrate</span></td>
        <td><strong>6</strong></td>
        <td>Confetti, XP, Hindi score, campfire streak &amp; chest claim.</td>
      </tr>
      <tr>
        <td><strong>Page 5</strong></td>
        <td>Letters / Hindi Alphabet</td>
        <td><span class="code">/characters</span> (<span class="code">/letters</span>)</td>
        <td><strong>46</strong></td>
        <td>42 Devanagari character cards with native audio synth &amp; quiz.</td>
      </tr>
      <tr>
        <td><strong>Page 6</strong></td>
        <td>Leaderboards League</td>
        <td><span class="code">/leaderboard</span></td>
        <td><strong>17</strong></td>
        <td>Bronze League table, user rank &amp; 12-emoji status picker.</td>
      </tr>
      <tr>
        <td><strong>Page 7</strong></td>
        <td>Quests &amp; Daily Rewards</td>
        <td><span class="code">/quests</span></td>
        <td><strong>5</strong></td>
        <td>Purple Welcome banner, daily XP quests &amp; Monthly challenge.</td>
      </tr>
      <tr>
        <td><strong>Page 8</strong></td>
        <td>Shop &amp; Super Duolingo</td>
        <td><span class="code">/shop</span></td>
        <td><strong>6</strong></td>
        <td>Hearts refills, freeze equip, and Super Duolingo trial.</td>
      </tr>
      <tr>
        <td><strong>Page 9</strong></td>
        <td>Learner Profile</td>
        <td><span class="code">/profile</span></td>
        <td><strong>10</strong></td>
        <td>Avatar hero, stats matrix, Following/Followers hub &amp; Add friends.</td>
      </tr>
      <tr>
        <td><strong>Page 10</strong></td>
        <td>Settings &amp; Account</td>
        <td><span class="code">/settings/account</span></td>
        <td><strong>11</strong></td>
        <td>Sound &amp; animation toggles, profile inputs &amp; logout.</td>
      </tr>
      <tr>
        <td><strong>Shell</strong></td>
        <td>Persistent Left Sidebar</td>
        <td>(All Main Routes)</td>
        <td><strong>14</strong></td>
        <td>Nav pills, MORE popover menu (6 sub-items), Super shortcut.</td>
      </tr>
      <tr>
        <td><strong>Topbar</strong></td>
        <td>Persistent Stat Bar</td>
        <td>(All Main Routes)</td>
        <td><strong>4</strong></td>
        <td>Course flag (5), Streak (🔥1), Gems (💎505), Hearts (❤️4).</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 2: EXHAUSTIVE BUTTON DIRECTORY (PAGE BY PAGE) -->
  <h1>2. Exhaustive Button Directory &amp; Connections</h1>

  <!-- GLOBAL PERSISTENT SHELL -->
  <h2>Global Shell: Left Sidebar (14 Buttons)</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 35%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>duolingo Brand Logo</strong></td>
        <td>Green bold text <span class="code">#58cc02</span></td>
        <td><span class="code">/learn</span></td>
        <td>Navigates to the active Learning Path home.</td>
      </tr>
      <tr>
        <td><strong>LEARN</strong></td>
        <td>Cottage icon 🏠, Green active border</td>
        <td><span class="code">/learn</span></td>
        <td>Navigates to Learning Path with unit banners.</td>
      </tr>
      <tr>
        <td><strong>LETTERS</strong></td>
        <td>Devanagari <span class="code">क</span> icon, Blue border</td>
        <td><span class="code">/characters</span></td>
        <td>Navigates to Hindi alphabet &amp; phonetics roadmap.</td>
      </tr>
      <tr>
        <td><strong>LEADERBOARDS</strong></td>
        <td>Shield icon 🛡️, Yellow active border</td>
        <td><span class="code">/leaderboard</span></td>
        <td>Navigates to Bronze League rankings and emoji status.</td>
      </tr>
      <tr>
        <td><strong>QUESTS</strong></td>
        <td>Chest icon 📦, Orange active border</td>
        <td><span class="code">/quests</span></td>
        <td>Navigates to Daily Quests &amp; Monthly challenge hub.</td>
      </tr>
      <tr>
        <td><strong>SHOP</strong></td>
        <td>Store awning 🏪, Red active border</td>
        <td><span class="code">/shop</span></td>
        <td>Navigates to Duolingo Shop &amp; Power-ups store.</td>
      </tr>
      <tr>
        <td><strong>PROFILE</strong></td>
        <td>Circular badge <span class="code">A</span>, Cyan border</td>
        <td><span class="code">/profile</span></td>
        <td>Navigates to Learner Profile, statistics, and social hub.</td>
      </tr>
      <tr>
        <td><strong>... MORE</strong></td>
        <td>Purple circle <span class="code">•••</span></td>
        <td>Sidebar Popover Card</td>
        <td>Toggles anchored floating card with 6 sub-actions.</td>
      </tr>
      <tr>
        <td><em>Popover: Settings</em></td>
        <td>⚙️ Gray gear icon</td>
        <td><span class="code">/settings/account</span></td>
        <td>Navigates to Account &amp; Sound Settings.</td>
      </tr>
      <tr>
        <td><em>Popover: Schools</em></td>
        <td>🏫 Sky blue cap</td>
        <td>Schools Modal Dialog</td>
        <td>Opens Duolingo for Schools classroom portal.</td>
      </tr>
      <tr>
        <td><em>Popover: Podcast</em></td>
        <td>🎙️ Amber headphones</td>
        <td>Podcasts Dialog</td>
        <td>Opens Audio Stories &amp; Podcasts hub.</td>
      </tr>
      <tr>
        <td><em>Popover: Dictionary</em></td>
        <td>📖 Emerald open book</td>
        <td>Dictionary Dialog</td>
        <td>Opens Hindi vocabulary lookup.</td>
      </tr>
      <tr>
        <td><em>Popover: Help</em></td>
        <td>❓ Indigo question mark</td>
        <td>Help Center Dialog</td>
        <td>Opens FAQ and bug reporting modal.</td>
      </tr>
      <tr>
        <td><em>Popover: Log out</em></td>
        <td>🚪 Red exit icon</td>
        <td>Sign-out Handler</td>
        <td>Prompts session logout and redirects to <span class="code">/welcome</span>.</td>
      </tr>
      <tr>
        <td><strong>✨ Super Duolingo</strong></td>
        <td>Purple button <span class="code">bg-purple-50</span></td>
        <td><span class="code">/shop</span> or Modal</td>
        <td>Opens Super comparison sheet with Astronaut Duo.</td>
      </tr>
    </tbody>
  </table>

  <!-- TOPBAR HEADER -->
  <h2>Global Shell: Topbar Stat Header (4 Buttons)</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 35%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Course Flag (🇮🇳 5)</strong></td>
        <td>Indian flag + score level 5</td>
        <td><span class="code">CourseModal</span></td>
        <td>Opens Course Switcher, <span class="code">+ Add a new course</span>, and <span class="code">+ Add section</span>.</td>
      </tr>
      <tr>
        <td><strong>Streak Counter (🔥 1)</strong></td>
        <td>Orange flame <span class="code">#ff9600</span></td>
        <td><span class="code">StreakModal</span></td>
        <td>Opens October 2026 Streak calendar and freeze protection status.</td>
      </tr>
      <tr>
        <td><strong>Gems Counter (💎 505)</strong></td>
        <td>Cyan diamond <span class="code">#1cb0f6</span></td>
        <td><span class="code">ShopModal</span></td>
        <td>Opens quick gem balance dialog with direct purchase links.</td>
      </tr>
      <tr>
        <td><strong>Hearts Counter (❤️ 4)</strong></td>
        <td>Red heart / Super lightning</td>
        <td><span class="code">EnergyModal</span></td>
        <td>Opens Refill for 350 gems and Unlimited Super trial activation.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PAGE 1: LANDING & PLACEMENT -->
  <h2>Page 1: Landing &amp; Course Placement (<span class="code">/</span> &amp; <span class="code">/welcome</span>) — 12 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>GET STARTED</strong></td>
        <td>Green 3D Button <span class="code">#58cc02</span></td>
        <td><span class="code">/welcome/course-picker</span></td>
        <td>Navigates to multi-language course selector.</td>
      </tr>
      <tr>
        <td><strong>I ALREADY HAVE AN ACCOUNT</strong></td>
        <td>White 3D Button <span class="code">border-2</span></td>
        <td>Login Modal</td>
        <td>Opens existing credentials login sheet.</td>
      </tr>
      <tr>
        <td><strong>Language Grid (7 Cards)</strong></td>
        <td>Flags (🇪🇸 🇫🇷 🇩🇪 🇮🇳 🇯🇵 ♟️ ➕)</td>
        <td>Course Selection State</td>
        <td>Selects target curriculum (Hindi selected by default).</td>
      </tr>
      <tr>
        <td><strong>CONTINUE (Picker)</strong></td>
        <td>Green 3D Button</td>
        <td>Placement Assessment</td>
        <td>Advances to learner proficiency questionnaire.</td>
      </tr>
      <tr>
        <td><strong>Start from scratch</strong></td>
        <td>Radio Pill Choice</td>
        <td><span class="code">/lesson/1</span></td>
        <td>Boots immediately into Lesson 1 (Basic Greetings).</td>
      </tr>
      <tr>
        <td><strong>Find my level</strong></td>
        <td>Radio Pill Choice</td>
        <td>Placement Test Flow</td>
        <td>Launches diagnostic placement exam.</td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE 2: LEARNING PATH -->
  <h2>Page 2: Learning Path (<span class="code">/learn</span>) — 10 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>GUIDEBOOK (📖)</strong></td>
        <td>Transparent pill with book icon</td>
        <td><span class="code">/guidebook/1</span></td>
        <td>Opens Section 1 Unit 1 Grammar &amp; Vocabulary notes.</td>
      </tr>
      <tr>
        <td><strong>Active Star Node (⭐ 1)</strong></td>
        <td>Green 3D Node + radial ring</td>
        <td><span class="code">StartLessonModal</span></td>
        <td>Opens level popover with <span class="code">START (+10 XP)</span> and <span class="code">✕</span> close.</td>
      </tr>
      <tr>
        <td><strong>Locked Node 2 (⭐)</strong></td>
        <td>Gray 3D circle</td>
        <td><span class="code">LockedModal</span></td>
        <td>Displays *"Complete previous lesson to unlock"*.</td>
      </tr>
      <tr>
        <td><strong>Locked Node 3 (🎧 Audio)</strong></td>
        <td>Gray circle with headphones</td>
        <td><span class="code">LockedModal</span></td>
        <td>Displays listening lesson lock requirements.</td>
      </tr>
      <tr>
        <td><strong>Locked Node 4 (📖 Story)</strong></td>
        <td>Gray circle with open book</td>
        <td><span class="code">LockedModal</span></td>
        <td>Displays interactive story lock requirements.</td>
      </tr>
      <tr>
        <td><strong>Treasure Chest (📦)</strong></td>
        <td>Gold milestone chest</td>
        <td>Chest Milestone Modal</td>
        <td>Displays gem bounty unlock target.</td>
      </tr>
      <tr>
        <td><strong>JUMP HERE? (⏩)</strong></td>
        <td>Purple circular button</td>
        <td>Placement Jump Test</td>
        <td>Allows skipping Unit 1 via challenge quiz.</td>
      </tr>
      <tr>
        <td><strong>Scroll to Top (⬆️)</strong></td>
        <td>Floating circular white button</td>
        <td>Window Viewport</td>
        <td>Smoothly scrolls learning path to top banner.</td>
      </tr>
      <tr>
        <td><strong>Super Promo: TRY FOR FREE</strong></td>
        <td>White button on dark purple</td>
        <td><span class="code">/shop</span></td>
        <td>Navigates to Super Duolingo activation.</td>
      </tr>
      <tr>
        <td><strong>Daily Quests: VIEW ALL</strong></td>
        <td>Cyan text <span class="code">#1cb0f6</span></td>
        <td><span class="code">/quests</span></td>
        <td>Navigates to Quests &amp; Monthly challenges.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PAGE 3: FULL LESSON PLAYER ENGINE -->
  <h2>Page 3: Full Lesson Player Engine (<span class="code">/lesson/[id]</span>) — 14 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>✕ Close Button</strong></td>
        <td>Gray cross top-left</td>
        <td>Exit Confirmation Dialog</td>
        <td>Prompts *"Quit Lesson"* vs *"Keep Learning"*.</td>
      </tr>
      <tr>
        <td><strong>Speaker Normal (🔊)</strong></td>
        <td>Blue circular speaker button</td>
        <td>Web Audio Synth (1.0x)</td>
        <td>Synthesizes target sentence audio at natural speed.</td>
      </tr>
      <tr>
        <td><strong>Speaker Slow (🐢)</strong></td>
        <td>Turtle blue circular button</td>
        <td>Web Audio Synth (0.6x)</td>
        <td>Synthesizes target sentence audio at slowed speed.</td>
      </tr>
      <tr>
        <td><strong>Choice Cards (1, 2, 3)</strong></td>
        <td>White 3D cards with keyboard shortcuts</td>
        <td>Exercise Selection State</td>
        <td>Selects candidate answer in Multiple Choice.</td>
      </tr>
      <tr>
        <td><strong>Word Bank Chips (Pool)</strong></td>
        <td>White rounded-2xl chips</td>
        <td>Sentence Assembly Slot</td>
        <td>Moves clicked word chip into the user response.</td>
      </tr>
      <tr>
        <td><strong>Slotted Word Chips</strong></td>
        <td>Slotted rounded-2xl chips</td>
        <td>Word Bank Pool</td>
        <td>Returns slotted word chip back to available pool.</td>
      </tr>
      <tr>
        <td><strong>CHECK Button</strong></td>
        <td>Green 3D button (Gray disabled)</td>
        <td>Answer Evaluator</td>
        <td>Evaluates input, triggers chime, and opens Feedback Drawer.</td>
      </tr>
      <tr>
        <td><strong>CONTINUE Button</strong></td>
        <td>Green (Correct) / Red (Wrong) 3D</td>
        <td>Next Step Engine</td>
        <td>Advances to next question or triggers Mistake Review Loop.</td>
      </tr>
      <tr>
        <td><strong>TOO EASY Pill</strong></td>
        <td>Subtle gray pill button</td>
        <td>Feedback Dispatcher</td>
        <td>Logs difficulty telemetry for adaptive curriculum.</td>
      </tr>
      <tr>
        <td><strong>TOO DIFFICULT Pill</strong></td>
        <td>Subtle gray pill button</td>
        <td>Feedback Dispatcher</td>
        <td>Logs difficulty telemetry for adaptive curriculum.</td>
      </tr>
      <tr>
        <td><strong>REPORT (🚩)</strong></td>
        <td>Flag icon pill button</td>
        <td><span class="code">ReportModal</span></td>
        <td>Opens bug reporting dialog (Audio/Translation issue).</td>
      </tr>
      <tr>
        <td><strong>QUIT LESSON</strong></td>
        <td>Red outline button in exit modal</td>
        <td><span class="code">/learn</span></td>
        <td>Aborts lesson session and returns to path.</td>
      </tr>
      <tr>
        <td><strong>KEEP LEARNING</strong></td>
        <td>Green 3D button in exit modal</td>
        <td>Active Exercise</td>
        <td>Dismisses modal and resumes current question.</td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE 4: CELEBRATION & REWARDS -->
  <h2>Page 4: Lesson Celebration &amp; Rewards (<span class="code">/lesson/[id]/celebrate</span>) — 6 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CONTINUE (XP Screen)</strong></td>
        <td>Green 3D Button</td>
        <td>Score Milestone Screen</td>
        <td>Celebrates XP (+14) and accuracy percentage with confetti.</td>
      </tr>
      <tr>
        <td><strong>CONTINUE (Score Screen)</strong></td>
        <td>Green 3D Button</td>
        <td>Campfire Streak Screen</td>
        <td>Displays Duolingo Hindi Score milestone (+5).</td>
      </tr>
      <tr>
        <td><strong>CONTINUE (Streak Screen)</strong></td>
        <td>Green 3D Button</td>
        <td>Streak Goal Screen</td>
        <td>Displays animated campfire flame &amp; *"Day 2 starts tomorrow"*.</td>
      </tr>
      <tr>
        <td><strong>Goal Selector (7/14/30/50)</strong></td>
        <td>4 Selectable Option Cards</td>
        <td>Commitment State</td>
        <td>Selects personal streak commitment target.</td>
      </tr>
      <tr>
        <td><strong>I CAN DO IT!</strong></td>
        <td>Green 3D Button</td>
        <td>Chest Reward Screen</td>
        <td>Commits streak goal and opens quest reward screen.</td>
      </tr>
      <tr>
        <td><strong>CLAIM REWARD &amp; FINISH</strong></td>
        <td>Green 3D Button</td>
        <td><span class="code">/learn</span></td>
        <td>Credits 5 gems, updates progress ring, and returns to path.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PAGE 5: LETTERS / HINDI ALPHABET -->
  <h2>Page 5: Letters / Hindi Alphabet (<span class="code">/characters</span>) — 46 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>LEARN THE LETTERS</strong></td>
        <td>White 3D Button on cyan</td>
        <td>Practice Quiz Modal</td>
        <td>Opens phonetic listening practice modal.</td>
      </tr>
      <tr>
        <td><strong>Filter: All Letters (42)</strong></td>
        <td>Pill Tab (Active: Blue)</td>
        <td>Filter State</td>
        <td>Displays complete set of 42 Devanagari characters.</td>
      </tr>
      <tr>
        <td><strong>Filter: Vowels / स्वर (12)</strong></td>
        <td>Pill Tab</td>
        <td>Filter State</td>
        <td>Filters character grid to 12 vowels (अ to अः).</td>
      </tr>
      <tr>
        <td><strong>Filter: Consonants / व्यंजन (30)</strong></td>
        <td>Pill Tab</td>
        <td>Filter State</td>
        <td>Filters character grid to 30 consonants (क to ह).</td>
      </tr>
      <tr>
        <td><strong>Character Cards (42 Cards)</strong></td>
        <td>White cards, border-2, 🔊 icon, 3-bar green mastery</td>
        <td>Web Audio Synth (<span class="code">hi-IN</span>)</td>
        <td>Pronounces character aloud and pulses active border.</td>
      </tr>
      <tr>
        <td><strong>Quiz: Audio Prompt (🔊)</strong></td>
        <td>Large cyan speaker button</td>
        <td>Audio Speech Synth</td>
        <td>Replays phonetic audio challenge.</td>
      </tr>
      <tr>
        <td><strong>Quiz: Choices (4 Cards)</strong></td>
        <td>Devanagari letter cards</td>
        <td>Quiz Validator</td>
        <td>Evaluates matching phonetic character choice.</td>
      </tr>
      <tr>
        <td><strong>Quiz: Exit Practice</strong></td>
        <td>Gray outline button</td>
        <td>Letters Grid</td>
        <td>Dismisses practice modal.</td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE 6: LEADERBOARDS LEAGUE -->
  <h2>Page 6: Leaderboards League (<span class="code">/leaderboard</span>) — 17 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>START A LESSON</strong></td>
        <td>Green 3D Button</td>
        <td><span class="code">/lesson/1</span></td>
        <td>Appears in locked league view to earn prerequisite XP.</td>
      </tr>
      <tr>
        <td><strong>Top 3 Learner Rows (3)</strong></td>
        <td>Rank cards with Gold/Silver/Bronze medals</td>
        <td>Rank Details</td>
        <td>Nitheesh Kumar B (#1), AVIRAL JAIN (#2), Seyit Musevi (#3).</td>
      </tr>
      <tr>
        <td><strong>Emoji Status Grid (12 Buttons)</strong></td>
        <td>😎 🎊 💪 👀 🍿 🇮🇳 😠 💯 💩 🏆 ⛏️ 😾</td>
        <td>Status State Dispatcher</td>
        <td>Updates user leaderboard avatar sticker with instant feedback.</td>
      </tr>
      <tr>
        <td><strong>League Info Tooltip</strong></td>
        <td>Info button</td>
        <td>Promotion Dialog</td>
        <td>Explains top 10 promotion zone to Silver League.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PAGE 7: QUESTS & REWARDS -->
  <h2>Page 7: Quests &amp; Daily Rewards (<span class="code">/quests</span>) — 5 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Active Quest: Chest (📦)</strong></td>
        <td>Gold interactive chest</td>
        <td>Reward Claimer</td>
        <td>Claims completed 10 XP quest rewards.</td>
      </tr>
      <tr>
        <td><strong>Locked Quest Card</strong></td>
        <td>Gray card with padlock 🔒</td>
        <td>Quest Details</td>
        <td>Shows *"More quests unlock soon"*.</td>
      </tr>
      <tr>
        <td><strong>START A LESSON (Right Rail)</strong></td>
        <td>White 3D button with blue text</td>
        <td><span class="code">/lesson/1</span></td>
        <td>Launches active lesson to contribute toward monthly badges.</td>
      </tr>
      <tr>
        <td><strong>Footer Links (8 Links)</strong></td>
        <td>Gray uppercase text</td>
        <td>Informational Pages</td>
        <td>About, Blog, Store, Efficacy, Careers, Investors, Terms, Privacy.</td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE 8: SHOP & SUPER DUOLINGO -->
  <h2>Page 8: Shop &amp; Super Duolingo (<span class="code">/shop</span>) — 6 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>START MY 1 MONTH FREE TRIAL</strong></td>
        <td>White 3D button on purple gradient</td>
        <td>Super Comparison Modal</td>
        <td>Opens astronaut Duo Super comparison sheet.</td>
      </tr>
      <tr>
        <td><strong>REFILL HEARTS (💎 350)</strong></td>
        <td>Blue 3D button</td>
        <td>Backend <span class="code">refillHearts()</span></td>
        <td>Deducts 350 gems, refills user hearts to 5.</td>
      </tr>
      <tr>
        <td><strong>GET UNLIMITED HEARTS</strong></td>
        <td>Purple 3D button</td>
        <td>Super Trial Activator</td>
        <td>Activates Super mode with unlimited hearts (∞).</td>
      </tr>
      <tr>
        <td><strong>EQUIP STREAK FREEZE (💎 200)</strong></td>
        <td>Cyan button (<span class="code">2/2 equipped</span>)</td>
        <td>Streak Protection State</td>
        <td>Equips streak freeze to prevent loss on missed days.</td>
      </tr>
      <tr>
        <td><strong>Super Modal: START FREE TRIAL</strong></td>
        <td>Purple full-width 3D button</td>
        <td>Super State Dispatcher</td>
        <td>Activates Super status with celebratory animation.</td>
      </tr>
      <tr>
        <td><strong>Super Modal: ✕ Close</strong></td>
        <td>Top-right gray close button</td>
        <td>Shop View</td>
        <td>Dismisses comparison dialog.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PAGE 9: LEARNER PROFILE -->
  <h2>Page 9: Learner Profile (<span class="code">/profile</span>) — 10 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Avatar Silhouette (+)</strong></td>
        <td>Pastel blue card with cyan dashed border and white <span class="code">+</span></td>
        <td>Avatar Creator Modal</td>
        <td>Opens avatar builder to customize hair, clothing &amp; skin tone.</td>
      </tr>
      <tr>
        <td><strong>Pencil Edit Button (✏️)</strong></td>
        <td>White square rounded-2xl top-right</td>
        <td>Profile / Avatar Edit Modal</td>
        <td>Opens profile editor dialog.</td>
      </tr>
      <tr>
        <td><strong>0 Following Link</strong></td>
        <td>Sky blue bold text <span class="code">#1cb0f6</span></td>
        <td>Right Rail: FOLLOWING Tab</td>
        <td>Switches right rail social hub to Following view.</td>
      </tr>
      <tr>
        <td><strong>0 Followers Link</strong></td>
        <td>Sky blue bold text <span class="code">#1cb0f6</span></td>
        <td>Right Rail: FOLLOWERS Tab</td>
        <td>Switches right rail social hub to Followers view.</td>
      </tr>
      <tr>
        <td><strong>Achievements: VIEW ALL</strong></td>
        <td>Cyan uppercase bold text</td>
        <td>All Achievements Directory</td>
        <td>Expands all 15+ Duolingo badges (Wildfire, Sage, Scholar, etc.).</td>
      </tr>
      <tr>
        <td><strong>Tab: FOLLOWING</strong></td>
        <td>Active cyan underline <span class="code">#1cb0f6</span></td>
        <td>Following Social Hub</td>
        <td>Displays ensemble character art &amp; *"Learning is more fun when you connect"*.</td>
      </tr>
      <tr>
        <td><strong>Tab: FOLLOWERS</strong></td>
        <td>Inactive gray text</td>
        <td>Followers Social Hub</td>
        <td>Displays followers referral link and study buddy prompts.</td>
      </tr>
      <tr>
        <td><strong>Find friends Row</strong></td>
        <td>🔍 icon + Chevron <span class="code">›</span></td>
        <td>Find Friends Modal</td>
        <td>Opens username &amp; contact search dialog.</td>
      </tr>
      <tr>
        <td><strong>Invite friends Row</strong></td>
        <td>✉️ Green icon + Chevron <span class="code">›</span></td>
        <td>Clipboard Link Dispatcher</td>
        <td>Copies referral link with floating success toast.</td>
      </tr>
      <tr>
        <td><strong>Avatar Modal: Save Avatar</strong></td>
        <td>Green 3D Button</td>
        <td>User Profile State</td>
        <td>Commits customized avatar and displays toast.</td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE 10: SETTINGS & ACCOUNT PREFERENCES -->
  <h2>Page 10: Settings &amp; Account Preferences (<span class="code">/settings/account</span>) — 11 Buttons</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Button / Label</th>
        <th style="width: 20%;">Visual Styling</th>
        <th style="width: 25%;">Where It Is Connected</th>
        <th style="width: 30%;">Action &amp; Target State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Toggle: Sound Effects</strong></td>
        <td>Green iOS/Duolingo pill switch</td>
        <td>Audio Player State</td>
        <td>Enables/disables answer chimes and audio cues.</td>
      </tr>
      <tr>
        <td><strong>Toggle: Animations</strong></td>
        <td>Green iOS/Duolingo pill switch</td>
        <td>UI Animation State</td>
        <td>Enables/disables confetti explosions and mascot animations.</td>
      </tr>
      <tr>
        <td><strong>Toggle: Motivational Messages</strong></td>
        <td>Green iOS/Duolingo pill switch</td>
        <td>Lesson Player State</td>
        <td>Enables/disables Duo peeking encouragement interstitials.</td>
      </tr>
      <tr>
        <td><strong>Toggle: Listening Exercises</strong></td>
        <td>Green iOS/Duolingo pill switch</td>
        <td>Curriculum Filter</td>
        <td>Includes or excludes audio-listening questions.</td>
      </tr>
      <tr>
        <td><strong>SAVE CHANGES</strong></td>
        <td>Green 3D Button <span class="code">#58cc02</span></td>
        <td>Settings State Dispatcher</td>
        <td>Saves updated preferences and triggers floating green toast.</td>
      </tr>
      <tr>
        <td><strong>CANCEL</strong></td>
        <td>White 3D Button <span class="code">border-2</span></td>
        <td><span class="code">/learn</span></td>
        <td>Discards changes and returns to path.</td>
      </tr>
      <tr>
        <td><strong>Nav: Account</strong></td>
        <td>Active blue item <span class="code">#ddf4ff</span></td>
        <td><span class="code">/settings/account</span></td>
        <td>Displays account username and email credentials.</td>
      </tr>
      <tr>
        <td><strong>Nav: Sound &amp; Audio</strong></td>
        <td>Gray item + speaker icon</td>
        <td>Sound Settings Anchor</td>
        <td>Scrolls to audio toggles section.</td>
      </tr>
      <tr>
        <td><strong>Nav: Notifications</strong></td>
        <td>Gray item + bell icon</td>
        <td>Notifications Settings</td>
        <td>Configures streak reminder notifications.</td>
      </tr>
      <tr>
        <td><strong>Nav: Super Duolingo</strong></td>
        <td>Gray item + purple sparkle icon</td>
        <td><span class="code">/shop</span></td>
        <td>Navigates to Super subscription management.</td>
      </tr>
      <tr>
        <td><strong>LOG OUT Button</strong></td>
        <td>Red outline card button</td>
        <td>Logout Handler</td>
        <td>Signs user out and returns to welcome screen.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 3: INTERACTIVE MODALS CATALOG -->
  <h1>3. Global Interactive Modals (10 Modals)</h1>
  <p>The application implements 10 specialized modal dialogs that overlay the page without full reloads:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Modal Name</th>
        <th style="width: 25%;">Trigger Source</th>
        <th style="width: 23%;">Internal Buttons</th>
        <th style="width: 30%;">Behavior &amp; Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CourseModal</strong></td>
        <td>Topbar flag (🇮🇳 5)</td>
        <td>Switch Hindi, Switch French, <span class="code">+ Add a new course</span>, <span class="code">+ Add section</span>, <span class="code">✕</span></td>
        <td>Allows course switching, language additions, and curriculum expansion.</td>
      </tr>
      <tr>
        <td><strong>StreakModal</strong></td>
        <td>Topbar flame (🔥 1)</td>
        <td>Calendar navigation, <span class="code">EQUIP STREAK FREEZE</span>, <span class="code">✕</span></td>
        <td>Visualizes October 2026 calendar, streak history, and freeze protections.</td>
      </tr>
      <tr>
        <td><strong>EnergyModal</strong></td>
        <td>Topbar heart (❤️ 4)</td>
        <td><span class="code">Refill (💎 350)</span>, <span class="code">Get Unlimited</span>, <span class="code">✕</span></td>
        <td>Restores hearts with gems or starts Super trial.</td>
      </tr>
      <tr>
        <td><strong>ShopModal</strong></td>
        <td>Topbar gem (💎 505)</td>
        <td>Shop navigation shortcut, <span class="code">✕</span></td>
        <td>Quick gem overview dialog.</td>
      </tr>
      <tr>
        <td><strong>StartLessonModal</strong></td>
        <td>Path star node (⭐)</td>
        <td><span class="code">START (+10 XP)</span>, <span class="code">Back to path</span>, <span class="code">✕</span></td>
        <td>Boots into <span class="code">/lesson/1</span> or dismisses on backdrop/Escape.</td>
      </tr>
      <tr>
        <td><strong>ExitLessonModal</strong></td>
        <td>Lesson header <span class="code">✕</span></td>
        <td><span class="code">QUIT LESSON</span>, <span class="code">KEEP LEARNING</span></td>
        <td>Guards against accidental loss of lesson progress.</td>
      </tr>
      <tr>
        <td><strong>ReportModal</strong></td>
        <td>Lesson drawer flag (🚩)</td>
        <td>Checkboxes, <span class="code">SUBMIT REPORT</span>, <span class="code">CANCEL</span></td>
        <td>Submits question error reports to backend.</td>
      </tr>
      <tr>
        <td><strong>LettersQuizModal</strong></td>
        <td>Letters <span class="code">LEARN THE LETTERS</span></td>
        <td>🔊 Replay Audio, 4 Letter choices, <span class="code">Exit</span></td>
        <td>Interactive phonetic character matching quiz.</td>
      </tr>
      <tr>
        <td><strong>AvatarModal</strong></td>
        <td>Profile silhouette / pencil</td>
        <td>Color choices, <span class="code">Save Avatar</span>, <span class="code">Cancel</span></td>
        <td>Customizes avatar hairstyle and clothing.</td>
      </tr>
      <tr>
        <td><strong>FindFriendsModal</strong></td>
        <td>Profile <span class="code">Find friends</span></td>
        <td>Search input, <span class="code">Done</span>, <span class="code">✕</span></td>
        <td>Searches user accounts by handle and name.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 4: ARCHITECTURE FLOW MATRIX -->
  <h1>4. System Connection &amp; Routing Matrix</h1>
  <p>The following diagram outlines the deterministic transitions between all 10 pages:</p>

  <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 15px; font-family: monospace; font-size: 8.5pt; line-height: 1.4; white-space: pre;">
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
      ├──(LEADERBOARDS Tab)─▶ [ Bronze League &amp; Emoji (Page 6: /leaderboard) ]
      ├──(QUESTS Tab)───────▶ [ Daily Quests &amp; Badges (Page 7: /quests) ]
      ├──(SHOP Tab)─────────▶ [ Power-ups &amp; Super (Page 8: /shop) ]
      ├──(PROFILE Tab)──────▶ [ Identity, Stats, Social Hub (Page 9: /profile) ]
      └──(MORE Popover)─────▶ [ Settings &amp; Preferences (Page 10: /settings/account) ]
  </div>

  <div style="margin-top: 30px; text-align: center; color: #9ca3af; font-size: 9pt;">
    — End of Duolingo Web Clone Master Page &amp; Button Specification —
  </div>

</body>
</html>
"""

# 1. Write the HTML file to scratch/
html_path = os.path.abspath("scratch/master_specification.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"HTML specification written to: {html_path}")

# 2. Run Microsoft Edge headless to generate PDF
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
pdf_output = os.path.abspath("DUOLINGO_MASTER_PAGE_AND_BUTTON_SPECIFICATION.pdf")

cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_output}",
    html_path
]

print("Rendering PDF via headless Microsoft Edge...")
result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode == 0 and os.path.exists(pdf_output):
    print(f"SUCCESS: PDF created successfully at: {pdf_output} ({os.path.getsize(pdf_output)} bytes)")
else:
    print(f"Edge process exited with code {result.returncode}")
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
