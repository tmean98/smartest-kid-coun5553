---
name: quiz
description: Generate quiz questions from course materials. Optionally specify a chapter, topic, or week.
---

# Quiz Mode

Generate quiz questions based on the course materials for COUN 5553.

## How It Works

1. If the user specifies a chapter, topic, week, or slide deck — read those specific materials first
2. If no topic is specified, ask what they want to be quizzed on
3. Generate 5-10 questions at a time, mixing formats:
   - Multiple choice (good for terms and definitions)
   - Short answer (good for explaining concepts)
   - Scenario-based (good for applying ethics to clinical situations)
   - Case identification ("Which landmark case established...?")
4. Wait for the student's answer before revealing the correct answer
5. When giving the answer, **always cite the source material** and explain WHY it's correct
6. After each batch, ask if they want more questions, want to focus on what they got wrong, or are done

## Guidelines

- Pull questions from the actual course materials in `materials/`, not from general knowledge
- For legal terms, test both the formal definition and their ability to explain it plainly
- For ethical codes, reference specific ACA Code sections
- Include the occasional curveball edge case — those are what show up on exams
- Track which questions they got wrong and offer to revisit those topics
