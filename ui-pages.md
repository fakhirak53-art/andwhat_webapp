Here's a complete breakdown of what the client is asking for:

---

## The Core Request — 3 Separate Landing Pages

The client wants to split the single landing page into **three targeted landing pages**, each speaking directly to a different audience, all connected to the same Supabase backend.

```
andwhat.app/              → Students (teenagers, Years 7-12)
andwhat.app/schools       → Teachers & School Admins
andwhat.app/wellbeing     → Wellbeing / MH & NDIS audience
```

He's asking whether separate sites would be cleaner — the answer is **no, separate sites aren't needed**. Three routes on the same Next.js app, same backend, just different page content and tone. Cleaner, cheaper, easier to maintain.

---

## Page 1 — Student Landing Page (`/`)

**Audience:** Teenagers, Years 7–12
**Tone:** Casual, fun, relatable, slightly cheeky — like a friend talking, not a teacher

**The "Sneaky Extension" concept is the hero message.** The client has basically written the copy already:

```
Hero headline concept:
  "Want to get better at school without studying more?"

The athlete analogy:
  Pro athletes train every day — not for the big match,
  but so the basics become automatic.
  School works the same way.

The problem they relate to:
  You learn something in class
  → forget half of it
  → stress-cram before exams
  → hope for the best

The solution (the extension):
  • Pick websites you visit heaps (TikTok, YouTube, Insta)
  • We block you for 20-30 seconds when you go there
  • A few questions pop up from what you learned in class
  • Answer them — and you're in

Why it works:
  • Quick low-effort practice throughout the week
  • Remember more without extra study
  • Random past questions = constantly reinforcing everything
  • By exam time you already know it

Closing line:
  "Sneaky? Yep. Effective? Absolutely."
```

**Visual direction he wants:**
- NOT AI-looking
- Relatable teen/school imagery — phones, headphones, study desks, social media vibes
- Replace the current generic feature box icons with recognisable student/teenager visuals
- Feels professionally designed, not template

**Three different visual concepts** to compare (he wants mockups to choose from):
- Concept A: Bold, dark, energetic — speaks to gaming/social media generation
- Concept B: Bright, clean, notebook feel — the current editorial direction
- Concept C: Illustrated/playful — hand-drawn feel, very teen-friendly

---

## Page 2 — Schools & Teachers Page (`/schools`)

**Audience:** Teachers, school admins, tutors, RTOs
**Tone:** Professional but warm, informative, trustworthy

**What needs to be on this page:**

```
SECTIONS:

1. Hero
   "Give your students the learning habit they'll actually keep"
   Subtext for teachers explaining the platform value

2. How it works for schools
   Step by step:
   → Register your school (school_code setup)
   → Upload question sets (CSV or manual)
   → Share reference numbers with students
   → Students enroll and the extension does the rest

3. Reference number system explained
   "Every question set gets a unique reference code (QS-XXXXXX)
    You share this with your class. Students enter it when they
    log in. That's how their quizzes connect to your content."

4. How to register
   CTA to contact/onboard — since admin accounts are created
   manually right now, this section explains the process

5. Data privacy & security section (IMPORTANT — client specifically mentioned this)
   "How we protect your students' data"
   Cover:
   → Australian Privacy Act compliance
   → Data stored in Australian data centres (Supabase)
   → School-scoped data (teachers only see their school)
   → Parent consent flows for under-18s
   → No data sold to third parties
   → Government privacy procedures followed

6. For RTOs (separate callout)
   RTOs have their own student type (rto_students table)
   Slightly different use case — adult learners, funded training
   This is also where PRICING lives (client said pricing only
   applies to the RTO page for now)
```

---

## Page 3 — Wellbeing Page (`/wellbeing`)

**Audience:** Students needing MH support, NDIS participants, parents, support workers
**Tone:** Calm, warm, safe, non-clinical — NOT educational assistance framing

**This is the most sensitive page.** The client made one critical point:

> "The wellbeing one needs to look specifically to MH/wellbeing help as NDIS won't be a part of anything that looks like education assistance for their students."

This means the wellbeing page must **not look or feel like a study tool**. It needs to stand completely on its own as a wellbeing product. No mention of quizzes, exams, or school performance on this page.

```
SECTIONS:

1. Hero
   Calm, supportive, warm
   "A daily check-in that fits into your day"
   NOT: "study better" or "learn more"
   YES: "feel supported", "take a breath", "you're not alone"

2. What the daily check-ins are
   Short daily cards — not quizzes
   "How are you feeling today?"
   Supportive response based on what they pick
   Takes 30 seconds. Shows up in your day naturally.

3. Three pillars (separate cards)
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │  Mental Health  │  │    Learning     │  │     Sleep       │
   │   & Wellbeing   │  │  Differences    │  │   & Recovery    │
   │                 │  │                 │  │                 │
   │ Daily check-ins │  │ You process     │  │ How sleep       │
   │ to help you     │  │ things          │  │ affects how     │
   │ feel seen and   │  │ differently.    │  │ you feel and    │
   │ supported       │  │ That's a        │  │ think every day │
   │                 │  │ strength.       │  │                 │
   └─────────────────┘  └─────────────────┘  └─────────────────┘

4. How it's different from other services
   Reference Kids Help Line / Batyr positioning
   "Not a crisis line. Not a therapy session.
    Just a friendly daily moment that's yours."

5. Opt-in section
   Two clear opt-in buttons:
   → "Start daily wellbeing check-ins" (MH + LD cards)
   → "Start daily sleep tips" (sleep content)
   Both link to student login/signup

6. Privacy reassurance
   Especially important for NDIS audience
   "Your check-ins are private. Your school can't see them.
    Only you."
```

---

## How the Three Pages Relate to the Backend

```
/ (students)       → auth/login, quiz system, question_logs
/schools           → admin registration info, no auth needed
                     links to /admin/login
/wellbeing         → mh_cards system, opt-in preferences
                     links to /dashboard (student login)

All three          → same Supabase backend
                   → same auth system
                   → same database
                   → no separate sites needed
```

---

## What the Client Wants You to Deliver

He was very specific about the format:

> "Do a quick mock up of what you think should be there and send it in a way I can make changes I think are needed directly in each section"

This means he wants **editable mockups** — not static images. The best format for this is either:
- HTML files he can open in a browser and edit text directly
- A Figma file (since you have Figma connected)
- Google Docs with the copy laid out section by section

He also said:
> "The contents aren't all that important just for now, it's deciding on a look"

So for the **student page** specifically, he wants **3 different visual concepts** to compare before committing to one direction.

---

## Summary of Action Items

| Task | Priority | Notes |
|---|---|---|
| 3 visual concepts for student landing page | High | Client chooses one direction |
| Schools/teachers page content + layout | High | Include privacy + RTO section |
| Wellbeing page — separate feel from education | High | NDIS-safe framing critical |
| Replace feature box icons with teen visuals | Medium | After direction is chosen |
| Opt-in toggles for wellbeing + sleep | Medium | Cursor prompt needed |
| mh_cards UI on student dashboard | Medium | Already in schema |
| Pricing page (RTO only) | Low | Content needed from client |

---

Want me to write the Cursor prompts for all three landing pages, or start with the three visual concept mockups for the student page for the client to choose from?