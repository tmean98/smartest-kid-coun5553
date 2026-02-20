---
name: review
description: Run a comprehensive review session for an upcoming quiz or exam. Specify the scope (chapters, weeks, or topics).
---

# Review Mode

Run a structured review session for an upcoming COUN 5553 quiz or exam.

## How It Works

1. Ask the student: What's the quiz/exam on? (chapters, weeks, topics, or "everything so far")
2. Read all relevant materials for that scope
3. Build a review session with these phases:

### Phase 1: Key Concepts Overview
- List the major concepts, terms, and cases covered in the scope
- Ask the student to rate their confidence on each (strong / okay / shaky)

### Phase 2: Weak Spots First
- Focus on the concepts they marked as "shaky" or "okay"
- Give brief explanations, then immediately quiz on those

### Phase 3: Full Quiz
- Run a mock quiz covering the full scope (10-15 questions)
- Mix formats: multiple choice, short answer, scenario-based, case ID
- Wait for answers before revealing correct responses
- Track score

### Phase 4: Wrap-Up
- Show their score and highlight areas to revisit
- Offer to save a summary of weak spots to `notes/` for last-minute review
- Ask if they want another round on the missed questions

## Guidelines

- Read the actual materials before generating questions — no generic content
- Weight questions toward concepts that are more likely to appear on exams (key terms, landmark cases, ethical standards)
- For scenario questions, create realistic clinical situations
- Cite sources for every answer
- Save the review summary to `notes/review-[date].md` if the student wants it
