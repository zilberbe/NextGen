# Functional Spec: Personal Study App

**October 2026**

A working spec for an exam-prep app inspired by Vaia (StudySmarter), for a single user. Mobile first, with an API designed up front for a future web version, and a full Hebrew and English interface including RTL support.

## Background and goals

| | |
|---|---|
| **Target audience** | One user (a student), no multi-user support |
| **First platform** | Android phone (confirmed). Web at a later phase |
| **Material input** | Camera first: photographing notes and book pages |
| **Study time** | 1-4 hours a day |
| **Student profile** | Name and school grade (she is in Grade 8), entered on the opening screen at first launch and editable on her own profile screen; the grade feeds AI content generation |
| **UI languages** | Hebrew and English, full RTL; chosen on the opening screen at first launch |
| **Inspiration** | Vaia / StudySmarter |

The daughter loved Vaia and exhausted its free tier. What she actually used every day: the practice tests and the summaries. The goal is not to clone Vaia, a platform built for millions of users, but to build the 20% that gave her all the value: practice tests and summaries first, then flashcards, spaced repetition and daily motivation, all generated from her own material.

Her own additions from reviewing the mocks: the app should know her school grade (Grade 8), so every summary, flashcard and test the AI generates matches her level, and she wants her own profile screen where she enters her name and grade. This is the student's profile, not a parent management screen - she explicitly declined that one. Her latest addition: an opening screen where she chooses the app language and enters her name and grade on first launch. She also asked for a profile photo on the settings page that she can replace herself - a nice-to-have, deliberately kept out of the MVP.

## Scope: what is in and what is out

### In scope

- Flashcards: manual creation and AI generation from her material
- Spaced repetition with the open-source FSRS algorithm
- Material import: camera capture of notes and book pages as the primary path, plus gallery photos and PDFs, with OCR
- Practice tests: multiple choice, true/false, sentence completion
- Summaries (study guides) from the material
- Progress tracking, streak and XP
- Full offline mode across the core learning flow
- Hebrew and English UI with full RTL

### Out of scope

- Community, set sharing and searching other users' content
- Ready-made content or Vaia's sets
- AI podcasts
- Subscription, payment or ads

> ⚠️ **Copyright:** Do not copy content, sets or questions from Vaia. All content in the app is generated from the daughter's own materials or entered manually. This is both simpler and legally safe.

## Vaia feature mapping

Vaia's public features from its Google Play listing, and the decision for each one in the personal app.

| Vaia feature | Decision |
|---|---|
| Manual flashcards + AI generation from notes and PDFs | The core of the app, built camera-first: photographing pages is the primary import path. Included in the MVP in full. |
| Spaced repetition and active recall | Open-source FSRS algorithm, no reinvention. MVP. |
| AI-based practice tests | A confirmed daily driver. Multiple choice and true/false in MVP; sentence completion and detailed AI feedback in phase 2. |
| Summaries and study guides from the material | A confirmed daily driver. Same AI pipeline as the flashcards. MVP. |
| XP, streak and progress tracking | Small in code, big in motivation. MVP. |
| Study planner (chapters and lessons) | In a simplified form: subjects and sets. Exam-date planning in phase 2. |
| Ask the AI questions about the material (chat) | Phase 2. |
| Offline mode | In Vaia this is paid. Here it is free: everything is local. MVP. |
| Community, shared content and searching other people's sets | Not included. A personal app for a single user. |
| AI podcasts from the material | Not included. A distant future option. |

## Functional requirements

### F1. Study material import (MVP)

- Camera capture is the primary import path: this is how the student already works, photographing her notes and book pages
- Fast multi-page capture: photograph several pages in a row into one material, with crop and retake before OCR
- Secondary paths: uploading photos from the gallery and uploading PDFs
- On-device OCR to extract Hebrew and English text
- Linking each material to a subject
- Keeping the source file alongside the content generated from it, for traceability

### F2. AI content generation (MVP)

- Generating question/answer flashcards from imported material, with control over quantity and difficulty
- Generating a structured summary from the same material
- Preview screen: approve, edit or delete each suggestion before it is saved
- The student's school grade (set at onboarding, editable in settings) is part of every generation prompt, so flashcards, summaries and tests are written at her level
- AI generation requires a network connection; the rest of the app does not

### F3. Flashcards (MVP)

- Manual create, edit and delete, with an optional image on each side
- Organization into sets under subjects, with tags
- A study screen using active recall: think of the answer before flipping the card
- After each card: rate Again / Hard / Good / Easy

### F4. Spaced repetition engine (FSRS) (MVP)

- Use the open-source ts-fsrs library instead of writing an algorithm from scratch
- A daily queue combining new cards with cards due for review
- A daily goal sized for a 1-4 hour study day (new cards plus reviews), configurable in settings
- The daily queue must scale to long sessions: enough new and due cards so a multi-hour session never runs dry
- Separate FSRS state per card: stability, difficulty and due date

### F5. Practice tests (basic MVP, full in phase 2)

- Generate a quiz from a set or a whole subject: multiple choice and true/false in MVP, sentence completion in phase 2
- Results screen with a score and error breakdown
- Add a missed question as a new flashcard in one tap
- Phase 2: detailed AI feedback on wrong answers, with a link to the relevant card

### F6. Progress and gamification (MVP)

- Daily streak with a personal record
- XP for actions: card studied, quiz completed, streak day
- Stats screen: cards per day, study time per day (she studies 1-4 hours daily), accuracy, retention rate, study-day calendar

### F7. Reminders (phase 2)

- A daily notification at a fixed time chosen in settings
- A notification when the streak is at risk near the end of the day

### F8. Offline mode (MVP)

- The entire learning core (flashcards, daily queue, quizzes, stats) works without a network
- Local on-device database, syncing to the server when the network returns

### F9. Language and direction (MVP)

- Full i18n (Hebrew and English) from day one: the language is chosen on the opening screen at first launch, with a switch in settings
- Full RTL in Hebrew: screen direction, mirrored icons, number and date formatting
- Card content is free in both languages, independent of the UI language

### F10. Settings (MVP)

- Daily goal, UI language, reminder time
- Student profile screen: name and school grade, the grade used by AI content generation
- Export and backup of all data
- Phase 2 (explicitly not MVP): a profile photo shown on the settings page, which she can choose and replace herself

## User flows

Flow 1 is the reference format, approved October 31, 2026; the other key flows follow the same format. Screen-by-screen mocks in English and Hebrew (RTL) live in the companion File: [User flow mocks (EN + HE)](https://files.instinct.com/g3kig8tq6fa6-study-app-user-flow-mocks-en).

### Flow 1: import material by camera and prepare for a test

*Approved October 31, 2026 as the reference format*

1. The student opens the app and taps "New study set" > "Camera".
2. She photographs the pages one by one. After each shot the app shows a crop/retake preview; she taps "Done" when finished.
3. The app runs OCR on the photos, then the AI generates a summary, flashcards and a practice test. A progress indicator shows while it works.
4. The "Study set ready" screen appears, summary on top.
5. She reviews the summary and can edit or delete anything irrelevant.
6. She taps "Practice test" and answers question by question (multiple choice / true-false), with immediate feedback after each answer.
7. The score screen shows her result with weak topics highlighted, and offers "Add weak points as flashcards".
8. If she accepts, those cards enter the spaced-repetition queue and are scheduled into her next sessions.
9. The next day, a study reminder (streak) brings her back; the review queue opens with due cards first.

### Flow 2: daily review session (spaced repetition)

*The daily habit loop*

1. She opens the app, from the daily reminder or directly. Home shows today's queue: due cards first, then new cards up to the daily goal.
2. She taps "Start review". The first card appears question-side up: active recall before any answer shows.
3. She thinks of the answer, then taps "Show answer" to flip the card.
4. She rates herself: Again, Hard, Good or Easy. FSRS reschedules the card accordingly.
5. The next card appears immediately. A card rated "Again" returns later in the same session.
6. When the queue is done, a session summary shows cards reviewed, accuracy and XP earned, and the streak updates.
7. On long days (up to 4 hours) she taps "Keep studying" and the queue extends with more new cards, so a session never runs dry.

### Flow 3: manual flashcard creation

*For material she writes herself*

1. Inside a subject she taps "New card" (or "Add card" inside a set).
2. She types the question and the answer, with an optional photo on either side.
3. She saves. The card joins the set and enters the spaced-repetition queue as a new card.
4. "Add another" keeps her on the same screen for rapid entry.

### Flow 4: import from gallery or PDF

*The secondary import paths*

1. "New study set" > "Gallery" or "PDF".
2. She picks one or more photos, or a single PDF.
3. The same OCR and AI generation pipeline runs as in flow 1.
4. From here it continues exactly like flow 1, step 4 onward.

### Flow 5: practice test on an existing set

*Without importing anything new*

1. She opens a subject or a set and taps "Practice test".
2. She picks the scope (this set or the whole subject) and the number of questions.
3. The app generates a fresh quiz: multiple choice and true/false.
4. Flow 1 steps 6-8 follow: immediate feedback, a score screen with weak topics, and one tap to add weak points as flashcards.

### Flow 6: progress and motivation

*Checking how she is doing*

1. She opens "Stats" from the bottom navigation.
2. She sees her current streak and personal record, cards per day, study time per day, accuracy, retention and a study-day calendar.
3. XP and the streak update on their own after every session; no action needed.

### Flow 7: settings

*One-time setup and ongoing tweaks*

1. On first launch, an opening screen asks her to choose the app language (Hebrew or English, full RTL) and to enter her name and school grade; the app uses the grade in every AI generation so the content matches her level.
2. She opens "Settings" from the bottom navigation.
3. She sets the daily goal (sized for her 1-4 hour days), the UI language (Hebrew/English with a full RTL switch) and the reminder time, and can update her name and school grade on the profile screen.
4. Export and backup of all data live here too.

## Data model

| Entity | Description |
|---|---|
| **Profile** | The student: name, school grade, UI language, daily goal, reminder time. The grade feeds every AI generation prompt. A profile photo joins in phase 2. |
| **Subject** | A school subject: name, color/icon, default content language. |
| **Material** | Source material: camera photos (the primary path), gallery images or PDFs, text after OCR, linked to a subject. |
| **CardSet** | A set of flashcards under a subject: name, tags. |
| **Card** | Question, answer, optional image on each side, origin (manual / AI + link to Material). |
| **CardSchedulerState** | FSRS state per card: stability, difficulty, due, reps, lapses. |
| **Review** | A single review record: card, rating (Again/Hard/Good/Easy), timestamp. |
| **Quiz / QuizQuestion** | A generated quiz: question type, options, correct answer, link to the source card. |
| **QuizAttempt** | A quiz attempt: answers, score, identified gaps. |
| **UserStats** | Current and best streak, XP, daily goal, study-day history. |

## Architecture: API-first

The mobile app is a thin client over a single REST API. The same API will serve the web version in phase 3 with no server changes.

- `POST /materials` - upload material, OCR and text extraction
- `POST /generate/flashcards`, `/generate/summary`, `/generate/quiz` - AI content generation; every call includes the student's school grade from her profile, so output matches her level
- `GET/POST/PATCH/DELETE /cards` and `/card-sets` - flashcard management
- `GET /queue/today` - the daily queue; `POST /reviews` - report a review and update FSRS
- `GET/POST /quizzes`, `POST /quizzes/:id/attempts` - quizzes
- `GET /stats`, `GET /streak` - progress and gamification

The AI layer sits behind a single interface on the server, so the LLM provider can be swapped without touching the app. Offline sync: a local database (SQLite) with a change queue that syncs against the server.

## Build phases

1. **MVP - mobile:** Camera-first import with OCR (camera, gallery, PDF), AI generation of flashcards and summaries with editing before save, manual flashcards, FSRS engine and daily queue, multiple-choice and true/false quizzes, streak + XP, basic stats, Hebrew/English UI with full RTL, offline mode.
2. **Phase 2 - depth:** Detailed AI feedback on quizzes, sentence completion, free-form questions to the AI about the material, exam-date study planning, smart reminders (streak at risk), cloud backup, a profile photo on the settings page.
3. **Phase 3 - web:** A web app (PWA or React) on exactly the same API, with full sync against the phone.

## Non-functional requirements

- **Privacy:** the user is a minor. Aim for zero data collection, and send only the study material itself to the LLM, with no identifying details
- **Performance:** the daily queue opens in under a second, even with thousands of cards
- **Reliability:** full data backup; losing a streak to a bug is a severe failure
- **Accessibility:** a readable default font, proper contrast, support for font scaling

## Questions for the daughter: all 5 answered

1. **What did she actually use in Vaia every day, and what did she never touch?** Answered October 31, 2026: the practice tests and the summaries. They are the heart of the MVP and set the work order.
2. **Which question types helped her most: multiple choice, true/false, or plain flashcards?** Answered October 31, 2026: no preference. The spec keeps the planned mix: flashcards plus multiple choice and true/false in the MVP, sentence completion in phase 2.
3. **Which phone does she have (iOS or Android)?** Answered October 31, 2026: Android. The spec now targets Android first.
4. **Who enters the material: she does herself, or do you want a parent management screen?** Answered October 31, 2026: she manages it herself. No parent management screen; the app is single-user, and the student owns all of her material end to end.
5. **How much time a day does she study?** Answered October 31, 2026: 1-4 hours a day. The daily goal and queue are sized for long sessions.

## Recommended technologies

- Spaced repetition: ts-fsrs, an open-source FSRS library for TypeScript
- On-device OCR: Google ML Kit, supports Hebrew and English
- Mobile: Android confirmed as the first platform. React Native or Flutter with an Android build first, or native Kotlin
- Server: Node or FastAPI with Postgres

Sources: [ts-fsrs on GitHub](https://github.com/open-spaced-repetition/ts-fsrs), [Vaia on Google Play](https://play.google.com/store/apps/details?id=com.studysmarter)

---

Based on Vaia's public feature listing on Google Play, checked October 31, 2026. Updated October 31, 2026 with the student's answers: Android phone, camera-first import, 1-4 study hours a day, no parent management screen (she manages everything herself). All open questions are now answered. User flows added October 31, 2026: flow 1 was approved as the reference format, and a companion File shows its screens mocked in English and Hebrew. Later on October 31, 2026 the student reviewed the mocks and asked for two additions: her school grade in the app (it now lives in the profile and feeds every AI generation) and pastel styling (applied in the mocks File). She then asked for her own profile screen (name + grade entry), distinct from the parent screen she declined; it is mocked as screen 10 in the mocks File. She then asked (in Hebrew) for an opening screen with language selection and name and grade entry; it is mocked as screen 0 in the mocks File, and onboarding in flow 7 now starts there. Her latest request (October 31, 2026): a replaceable profile photo on the settings page, recorded as a phase 2 feature. Requirements marked phase 2 or phase 3 are not part of the MVP.
