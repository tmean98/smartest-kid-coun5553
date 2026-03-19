from fpdf import FPDF

class StudyGuidePDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(80, 80, 80)
        self.cell(0, 8, "COUN 5173 - Crisis Counseling & Abuse | Exam Study Guide", align="C")
        self.ln(4)
        self.set_draw_color(180, 180, 180)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, f"Page {self.page_no()} | Smartest Kid Study Assistant - COUN 5173", align="C")

    def cover_page(self):
        self.add_page()
        self.ln(30)
        self.set_font("Helvetica", "B", 22)
        self.set_text_color(30, 60, 120)
        self.cell(0, 12, "COUN 5173: Crisis Counseling & Abuse", align="C")
        self.ln(12)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(50, 50, 50)
        self.cell(0, 10, "Exam Study Guide - Chapters 1-4 & 6", align="C")
        self.ln(8)
        self.set_font("Helvetica", "", 11)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "Dr. Esther McCartney  |  Northwest University  |  Spring 2026", align="C")
        self.ln(20)

        # Score box
        self.set_fill_color(240, 245, 255)
        self.set_draw_color(30, 60, 120)
        self.set_line_width(0.5)
        self.rect(40, self.get_y(), 130, 40, style="DF")
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(30, 60, 120)
        self.set_xy(40, self.get_y() + 6)
        self.cell(130, 8, "Practice Exam Performance", align="C")
        self.ln(9)
        self.set_font("Helvetica", "", 11)
        self.set_text_color(50, 50, 50)
        self.set_x(40)
        self.cell(130, 7, "Score: 46 / 60 (77%)   |   Drill: 9 / 12 (75%)", align="C")
        self.ln(9)
        self.set_x(40)
        self.set_font("Helvetica", "I", 10)
        self.cell(130, 6, "Exam covers: Chapters 1, 2, 3, 4, and 6  (closed book)", align="C")
        self.ln(20)

        self.set_font("Helvetica", "B", 11)
        self.set_text_color(30, 30, 30)
        self.cell(0, 8, "Topics Covered in This Guide:", align="C")
        self.ln(10)

        topics = [
            ("1", "Key Terms", "crisis, stress, trauma, coping, adaptation, resilience, ASD/PTSD"),
            ("2", "Double ABC-X Model", "Hill (1949) original; McCubbin & Patterson (1982) expansion"),
            ("3", "Six Guiding Principles of TIC", "SAMHSA (2014) framework"),
            ("4", "Ethics & Laws", "HIPAA, FERPA, Tarasoff, negligence, malpractice, confidentiality"),
            ("5", "SOLER & Microskills", "attending, listening sequence, de-escalation"),
            ("6", "Suicide Risk Levels", "low / moderate / high / acute vs. chronic; SLAP"),
            ("7", "Warning Signs vs. Risk Factors", "clinical distinction and application"),
        ]
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        for num, title, sub in topics:
            self.set_x(35)
            self.set_font("Helvetica", "B", 10)
            self.cell(8, 7, f"{num}.", )
            self.set_font("Helvetica", "B", 10)
            self.cell(45, 7, title)
            self.set_font("Helvetica", "", 10)
            self.set_text_color(100, 100, 100)
            self.cell(0, 7, sub)
            self.set_text_color(50, 50, 50)
            self.ln(7)

        self.ln(15)
        self.set_fill_color(255, 245, 230)
        self.set_draw_color(220, 150, 50)
        self.set_line_width(0.4)
        box_y = self.get_y()
        self.rect(25, box_y, 160, 20, style="DF")
        self.set_xy(25, box_y + 3)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(180, 100, 0)
        self.cell(160, 6, "  Flagged Weak Areas: SLAP letters . ABC-X attribution . Moderate risk level language", align="L")
        self.ln(6)
        self.set_x(25)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(150, 80, 0)
        self.cell(160, 5, "  These topics appear with extra emphasis and review boxes throughout this guide.", align="L")

    def section_title(self, text, color=(30, 60, 120)):
        self.ln(6)
        self.set_fill_color(*color)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(255, 255, 255)
        self.cell(0, 9, f"  {text}", fill=True)
        self.ln(5)
        self.set_text_color(30, 30, 30)

    def subsection(self, text):
        self.ln(3)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(30, 60, 120)
        self.cell(0, 7, text)
        self.ln(5)
        self.set_text_color(30, 30, 30)

    def body(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 6, text)
        self.ln(2)

    def bullet(self, label, text, indent=15):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(40, 40, 40)
        self.set_x(indent)
        label_w = 42
        self.cell(label_w, 6, label)
        self.set_font("Helvetica", "", 10)
        remaining = self.w - self.l_margin - self.r_margin - label_w - (indent - self.l_margin)
        self.multi_cell(remaining, 6, text)
        self.ln(1)

    def definition_box(self, term, definition, flag_weak=False):
        if flag_weak:
            self.set_fill_color(255, 248, 235)
            self.set_draw_color(220, 150, 50)
        else:
            self.set_fill_color(245, 248, 255)
            self.set_draw_color(180, 200, 240)
        self.set_line_width(0.3)
        x = self.get_x()
        y = self.get_y()
        # Estimate height
        self.set_font("Helvetica", "", 10)
        lines = len(definition) // 85 + 2
        h = max(16, lines * 6 + 8)
        self.rect(x, y, self.w - self.l_margin - self.r_margin, h, style="DF")
        self.set_xy(x + 3, y + 3)
        self.set_font("Helvetica", "B", 10)
        if flag_weak:
            self.set_text_color(180, 100, 0)
        else:
            self.set_text_color(30, 60, 120)
        self.cell(0, 6, term)
        self.ln(6)
        self.set_x(x + 3)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(self.w - self.l_margin - self.r_margin - 6, 6, definition)
        self.ln(4)

    def flag_box(self, text):
        self.set_fill_color(255, 240, 240)
        self.set_draw_color(200, 60, 60)
        self.set_line_width(0.4)
        y = self.get_y()
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(180, 30, 30)
        lines = len(text) // 90 + 1
        h = lines * 6 + 8
        self.rect(self.l_margin, y, self.w - self.l_margin - self.r_margin, h, style="DF")
        self.set_xy(self.l_margin + 3, y + 3)
        self.multi_cell(self.w - self.l_margin - self.r_margin - 6, 6, f"EXAM FLAG: {text}")
        self.ln(4)
        self.set_text_color(40, 40, 40)

    def table_row(self, col1, col2, col3="", header=False, shade=False):
        if header:
            self.set_fill_color(30, 60, 120)
            self.set_text_color(255, 255, 255)
            self.set_font("Helvetica", "B", 9)
        elif shade:
            self.set_fill_color(240, 244, 255)
            self.set_text_color(40, 40, 40)
            self.set_font("Helvetica", "", 9)
        else:
            self.set_fill_color(255, 255, 255)
            self.set_text_color(40, 40, 40)
            self.set_font("Helvetica", "", 9)

        w1 = 50
        w2 = 70
        w3 = 60 if col3 else 0
        h = 7

        self.cell(w1, h, f"  {col1}", border=1, fill=True)
        self.cell(w2, h, f"  {col2}", border=1, fill=True)
        if col3:
            self.cell(w3, h, f"  {col3}", border=1, fill=True)
        self.ln()


pdf = StudyGuidePDF()
pdf.set_margins(15, 15, 15)
pdf.set_auto_page_break(auto=True, margin=18)

# ?? COVER ??????????????????????????????????????????????????????????????????????
pdf.cover_page()

# ??????????????????????????????????????????????????????????????????????????????
# SECTION 1 - KEY TERMS
# ??????????????????????????????????????????????????????????????????????????????
pdf.add_page()
pdf.section_title("SECTION 1 - Key Terms  (Chapters 1 & 2)")

pdf.subsection("What Is a Crisis?")
pdf.body(
    "A crisis is an event that may or may not be perceived as a disruption in life. It does NOT "
    "necessarily lead to trauma. Three elements (the 'trilogy definition') must all be present:"
)
pdf.bullet("Element 1:", "A precipitating event")
pdf.bullet("Element 2:", "A perception of the event that leads to subjective distress")
pdf.bullet("Element 3:", "Diminished functioning when distress is not alleviated by customary coping mechanisms")
pdf.flag_box(
    "PERCEPTION is the key variable - the same event may or may not become a crisis depending on "
    "how it is experienced. Crisis does NOT equal trauma."
)

pdf.subsection("Core Term Definitions")
pdf.definition_box("Stress", "A demand placed on an individual or family that requires a response or adjustment. "
    "Managed by ordinary coping mechanisms - does NOT necessarily overwhelm functioning.")
pdf.definition_box("Crisis", "Occurs when a stressor overwhelms ordinary coping and leads to diminished "
    "functioning. Perception determines whether an event becomes a crisis.")
pdf.definition_box("Trauma", "A deeply distressing or disturbing experience that overwhelms the ability to cope. "
    "A crisis may or may not become traumatic depending on perception and resources.")
pdf.definition_box("Coping", "Any behavioral or cognitive action taken to manage stress. Three types:\n"
    "  (1) Problem-focused - direct action to change the stressor environment\n"
    "  (2) Emotion-focused - reduce affective arousal, change meaning of stressor\n"
    "  (3) Avoidance-focused - distraction or diversion away from the stressor")
pdf.definition_box("Adaptation", "Long-term outcome variable - the degree to which functioning has changed over "
    "an extended period; measured by the fit between individual/family and environment. "
    "Can be POSITIVE (bonadaptation) or NEGATIVE (maladaptation).",
    flag_weak=True)
pdf.definition_box("Resilience", "The dynamics that contribute to positive adaptation following exposure to "
    "experiences that have the potential to disrupt functioning (Masten & Obradovic, 2008). "
    "Not a fixed trait - it can be built and strengthened.")

pdf.add_page()
pdf.subsection("ASD vs. PTSD - Know the Timeline")
pdf.table_row("Feature", "Acute Stress Disorder (ASD)", "PTSD", header=True)
pdf.table_row("Timeframe", "3 days to 1 month post-event", "More than 1 month post-event", shade=True)
pdf.table_row("Symptoms", "Hyperarousal, reexperiencing, avoidance, negative cognitions", "Same cluster - but persistent", shade=False)
pdf.table_row("Key differentiator", "Duration under 1 month", "Duration over 1 month", shade=True)
pdf.ln(3)
pdf.flag_box("Memory: ASD = Acute = under a month. PTSD = Persistent = over a month. Same symptoms, different timeline.")

pdf.subsection("Trauma Response Categories")
pdf.bullet("Physical:", "Palpitations, shortness of breath, nausea, muscle tension, headaches, fatigue")
pdf.bullet("Behavioral:", "Sleep/dietary changes, social withdrawal, increased substance use, avoidance")
pdf.bullet("Cognitive:", "Rumination, preoccupation, forgetfulness, difficulty concentrating")
pdf.bullet("Emotional:", "Distress, anxiety, impatience, irritability, anger, depression symptoms")
pdf.bullet("Spiritual:", "Existential questions, attempts to find meaning in the traumatic event")

pdf.subsection("Crisis Intervention vs. Traditional Counseling")
pdf.table_row("Feature", "Crisis Intervention", "Traditional Counseling", header=True)
pdf.table_row("Goal", "Stabilization + restore equilibrium", "Long-term therapeutic goals", shade=True)
pdf.table_row("Setting", "Any setting, unscheduled", "Predetermined, scheduled", shade=False)
pdf.table_row("Duration", "Minutes to hours", "45-60 minute sessions", shade=True)
pdf.table_row("Termination", "Ends with a referral", "Multi-session process", shade=False)
pdf.table_row("Diagnosis", "Usually none", "May include diagnosis", shade=True)


# ??????????????????????????????????????????????????????????????????????????????
# SECTION 2 - DOUBLE ABC-X MODEL
# ??????????????????????????????????????????????????????????????????????????????
pdf.add_page()
pdf.section_title("SECTION 2 - Double ABC-X Model  (Chapter 1)", color=(60, 100, 60))

pdf.flag_box(
    "WEAK AREA - Missed attribution on the practice exam. Drill: Hill (1949) = original ABC-X. "
    "McCubbin & Patterson (1982) = Double ABC-X."
)

pdf.subsection("Hill's Original ABC-X Model (1949)")
pdf.body("Reuben Hill proposed this model based on studies of families separated during war. "
    "It examines how a stressor event interacts with resources and perception to produce crisis.")
pdf.bullet("A =", "The PROVOKING STRESSOR EVENT - the situation itself")
pdf.bullet("B =", "RESOURCES - traits, characteristics, or abilities available at individual, family, or community level")
pdf.bullet("C =", "PERCEPTION / MEANING - how the family interprets the event (the most powerful variable)")
pdf.bullet("X =", "CRISIS - a state of acute disequilibrium and immobilization of the family system")
pdf.ln(2)
pdf.body("Formula: A + B + C -> X")

pdf.subsection("McCubbin & Patterson's Double ABC-X Model (1982)")
pdf.body("Expands Hill's model to add a TIME DIMENSION - recognizing that families face stressors over time, "
    "not in isolation, and that resources can be built during and after crisis.")

pdf.table_row("Factor", "Original (Hill)", "Double (McCubbin & Patterson)", header=True)
pdf.table_row("A (Stressor)", "Single provoking stressor event", "Stressor + PILE-UP of accumulated stressors", shade=True)
pdf.table_row("B (Resources)", "Resources at time of stressor", "Pre-existing + ACQUIRED/STRENGTHENED resources", shade=False)
pdf.table_row("C (Perception)", "Meaning of original stressor", "Meaning of entire situation (all stressors + coping)", shade=True)
pdf.table_row("X (Outcome)", "Crisis (acute disequilibrium)", "ADAPTATION - long-term outcome over time", shade=False)

pdf.ln(4)
pdf.flag_box(
    "ADAPTATION (Double X) is the long-term outcome variable - NOT a return to pre-crisis baseline. "
    "It can be bonadaptation (family stronger) or maladaptation (chronic imbalance). "
    "Missed on practice exam: adaptation is extended over time, measured by fit with environment."
)

pdf.subsection("Clinical Significance")
pdf.body(
    "The Double ABC-X model shows that crisis counseling intervention is trajectory-altering. "
    "By helping a family manage pile-up (double A), build new resources (double B), and reframe meaning "
    "(double C), the counselor actively shapes whether adaptation is positive or negative. "
    "Crisis work is not just damage control - it changes where the family ends up."
)


# ??????????????????????????????????????????????????????????????????????????????
# SECTION 3 - SIX GUIDING PRINCIPLES OF TIC
# ??????????????????????????????????????????????????????????????????????????????
pdf.add_page()
pdf.section_title("SECTION 3 - Six Guiding Principles of Trauma-Informed Care  (Ch. 1 & 2)", color=(80, 50, 120))

pdf.body("Source: SAMHSA (Substance Abuse and Mental Health Services Administration), 2014. "
    "TIC assists individuals in restoring a sense of SAFETY, POWER, and SELF-WORTH. "
    "TIC is NOT the same as crisis assessment - it is the lens through which all treatment is provided.")

pdf.subsection("The Six Principles - Memorize All Six")

principles = [
    ("1. Safety", "Creating an environment where clients feel physically and psychologically safe. "
        "The foundation of all trauma-informed work."),
    ("2. Trustworthiness\n    & Transparency", "Maintaining transparency about decisions and processes to build and maintain trust."),
    ("3. Peer Support", "Using relationships with peers who have shared lived experience to promote recovery and healing."),
    ("4. Collaboration\n    & Mutuality", "Recognizing that healing happens in relationships. Power differences are leveled; "
        "clients and staff work together. Engages ALL participants in a collective approach to treatment."),
    ("5. Empowerment,\n    Voice & Choice", "Prioritizing client strengths and experiences. Clients are given choices and encouraged "
        "to take back personal power."),
    ("6. Cultural, Historical\n    & Gender Issues", "Moving past cultural stereotypes and biases. Recognizing historical trauma and how "
        "culture and gender shape trauma responses."),
]
for title, desc in principles:
    pdf.definition_box(title, desc)

pdf.flag_box(
    "Memory device: ST-PC-EC | Safety, Trustworthiness, Peer Support, Collaboration, Empowerment, Cultural. "
    "SAMHSA (2014) is the source. Scored PERFECTLY on this section in the practice exam - keep it locked."
)

pdf.subsection("TIC vs. Crisis Assessment - Key Distinction")
pdf.body(
    "These terms are often used interchangeably but are NOT the same:\n"
    "  TIC - a treatment framework for restoring safety, power, and self-worth; shapes HOW you practice\n"
    "  Crisis assessment - a specific task focused on immediate risk evaluation and stabilization\n\n"
    "Components of TIC CAN be integrated into crisis assessment, but TIC is not crisis assessment."
)


# ??????????????????????????????????????????????????????????????????????????????
# SECTION 4 - ETHICS & LAWS
# ??????????????????????????????????????????????????????????????????????????????
pdf.add_page()
pdf.section_title("SECTION 4 - Ethics & Laws in Crisis Counseling  (Chapter 3)", color=(120, 50, 50))

pdf.subsection("HIPAA vs. FERPA - Side by Side")
pdf.table_row("Feature", "HIPAA (1996)", "FERPA (1974)", header=True)
pdf.table_row("Full name", "Health Insurance Portability & Accountability Act", "Family Educational Rights & Privacy Act", shade=True)
pdf.table_row("Year enacted", "1996", "1974", shade=False)
pdf.table_row("Protects", "Health/medical records", "Educational records", shade=True)
pdf.table_row("Setting", "Clinical / health care", "Schools / universities", shade=False)
pdf.table_row("Crisis exception", "Providers may act in patient's best interest during emergencies", "Schools may release records to protect health & safety of others", shade=True)
pdf.ln(2)

pdf.subsection("Tarasoff v. Regents of the University of California")
pdf.body(
    "In 1969, therapist Poddar confided intent to kill Tatiana Tarasoff. Campus police were notified "
    "but released him. The supervisor ordered all case notes destroyed and no further action taken. "
    "Tarasoff was never warned. Poddar killed her two months later.\n\n"
    "California Supreme Court ruling: therapists MUST break confidentiality when disclosure is "
    "necessary to avert danger to the client or others. This established the DUTY TO WARN."
)
pdf.flag_box(
    "Duty to warn vs. duty to protect are often used interchangeably but definitions VARY BY STATE. "
    "Do not assume Tarasoff applies nationally - research your state law. "
    "WA State (RCW 71.05.120): duty is discharged by warning victim AND law enforcement."
)

pdf.subsection("Duty to Consult Principle")
pdf.body(
    "Counselors should seek peer supervision and consultation - particularly when breaking "
    "confidentiality is being considered. This decreases liability and is a best practice "
    "in any Tarasoff-type situation. Document the consultation."
)

pdf.add_page()
pdf.subsection("The Four Ds of Malpractice")
pdf.flag_box("WEAK AREA - Missed 'dereliction' on the drill. It is dereliction, NOT deficiency.")
pdf.body("To prove malpractice, all four Ds must be present:")
pdf.bullet("Dereliction", "The counselor breached their professional duty")
pdf.bullet("of Duty", "Failed to act (omission) OR did something they should not have (commission)")
pdf.bullet("Directly results in", "Causal link between the breach and the harm")
pdf.bullet("Damages", "Actual harm occurred as a result")
pdf.ln(2)
pdf.body(
    "Professional negligence results when a counselor departs from the usual standard of care "
    "expected of professionals in a similar situation. INTENT is NOT required - negligent "
    "omission (e.g., failing to assess for lethality) is sufficient for a malpractice claim.\n\n"
    "Best protection: DOCUMENTATION. 'If it's not written down, it didn't happen.'"
)

pdf.subsection("Confidentiality")
pdf.body(
    "Definition: The professional, ethical, AND legal obligation of counselors not to disclose "
    "client information revealed during counseling without the client's written consent (Gladding, 2017).\n\n"
    "Crisis settings make confidentiality more challenging but do NOT suspend ethical obligations. "
    "Always explain confidentiality in developmentally appropriate language with children. "
    "ACA Code (2014) PROHIBITS abandonment - always provide referral information at termination."
)

pdf.subsection("Negligence vs. Malpractice - Quick Distinction")
pdf.bullet("Negligence:", "A breach of duty owed to another (any context)")
pdf.bullet("Malpractice:", "Negligence that occurs specifically in a PROFESSIONAL setting")


# ??????????????????????????????????????????????????????????????????????????????
# SECTION 5 - SOLER & MICROSKILLS
# ??????????????????????????????????????????????????????????????????????????????
pdf.add_page()
pdf.section_title("SECTION 5 - SOLER & Microskills  (Chapter 4)", color=(30, 90, 100))

pdf.subsection("SOLER - Framework to Show Presence (Nonverbal Attending)")
pdf.bullet("S -", "Sit squarely facing the client")
pdf.bullet("O -", "Open posture")
pdf.bullet("L -", "Lean toward the client")
pdf.bullet("E -", "Eye contact (maintained appropriately; varies by culture)")
pdf.bullet("R -", "Relax")
pdf.ln(2)
pdf.body(
    "Most meaningful communication is nonverbal. SOLER communicates interest, warmth, and "
    "understanding before you say a word. In crisis work, your physical calm is one of the most "
    "powerful de-escalation tools available."
)

pdf.subsection("Basic Listening Sequence - Three Goals")
pdf.bullet("Goal 1:", "Obtain an overall summary and understanding of the client's presenting issue")
pdf.bullet("Goal 2:", "Identify the key facts of the client's situation")
pdf.bullet("Goal 3:", "Identify the core emotions and feelings the client is experiencing")

pdf.subsection("Questioning Skills")
pdf.table_row("Type", "Purpose", "Key Guidance", header=True)
pdf.table_row("Open Questions", "Elicit fuller, more meaningful responses; begin with what, how, could, would", "Try open first; use carefully with 'why' - can feel accusatory", shade=True)
pdf.table_row("Closed Questions", "Obtain specific, concrete information quickly (yes/no or specific facts)", "Useful for risk assessment; avoid overuse - can shut clients down", shade=False)

pdf.subsection("Reflecting Skills")
pdf.bullet("Paraphrasing:", "Mirror the client's communication IN YOUR OWN WORDS; check for accuracy ('Did I hear you right?'); conveys empathic understanding")
pdf.bullet("Restating:", "Use the CLIENT'S EXACT WORDS to focus/direct the priority of the crisis; risk issues first")
pdf.bullet("Reflecting Feelings:", "Name and identify the client's emotions - even if not stated directly; infer from nonverbals")
pdf.bullet("Summarizing:", "Distill key themes, feelings, and issues across the conversation")

pdf.subsection("Three Types of Summaries")
pdf.table_row("Type", "When Used", "Purpose", header=True)
pdf.table_row("Focusing Summary", "BEGINNING of session", "Pull together prior info; set focus for session", shade=True)
pdf.table_row("Signal Summary", "MID-session", "Signal topic is captured; transition to next area", shade=False)
pdf.table_row("Planning Summary", "END of session", "Recap progress, plans, recommendations; provide closure", shade=True)

pdf.add_page()
pdf.subsection("De-Escalation Formula")
pdf.flag_box(
    "Missed on practice exam - the exact formula is: "
    "'You feel ___ because ___ and you want (or need) ___.' "
    "This names the feeling, identifies the reason, AND reflects the underlying need or goal."
)
pdf.body(
    "The formula: 'You feel ___ because ___ and you want (or need) ___.\"\n\n"
    "Three functions: (1) validates the emotional experience, (2) shows you understand the context, "
    "(3) reflects the underlying NEED - this is what moves from venting to problem-solving. "
    "Always check for accuracy after using this skill."
)

pdf.subsection("Four Types of Aggression")
pdf.table_row("Type", "Characteristic", "Response", header=True)
pdf.table_row("Instrumental", "Learned - uses threats to get their way", "Unspecified counteroffers", shade=True)
pdf.table_row("Fear-Driven", "Defensive - aggressive to protect against being hurt", "Extra space; match client's pace/rhythm", shade=False)
pdf.table_row("Irritable (boundary violation)", "Response to humiliation or interpersonal violation", "Agree anger is valid; redirect to resolution", shade=True)
pdf.table_row("Irritable (chronic anger)", "Angry at world; looking for an excuse to explode", "Emotionless; repetitive choices/options", shade=False)

pdf.subsection("Four Primary Objectives with Agitated Clients")
pdf.bullet("1.", "Safety")
pdf.bullet("2.", "Client emotion management to regain control")
pdf.bullet("3.", "Avoidance of physical restraint")
pdf.bullet("4.", "Avoidance of escalating coercive interventions")
pdf.body("Key principle: 'Reasoning with angry, out-of-control people is not likely possible. "
    "De-escalation becomes the primary goal.'")


# ??????????????????????????????????????????????????????????????????????????????
# SECTION 6 - SUICIDE RISK LEVELS
# ??????????????????????????????????????????????????????????????????????????????
pdf.add_page()
pdf.section_title("SECTION 6 - Suicide Risk Assessment  (Chapter 6)", color=(100, 50, 30))

pdf.subsection("Risk Levels at a Glance")
pdf.flag_box(
    "WEAK AREA - Moderate risk level language. Key: Moderate = serious thoughts + IDEAS of a plan "
    "+ often NO ACCESS yet + SOME social support but also some risk factors."
)
pdf.table_row("Level", "Characteristics", header=True)
pdf.table_row("No Risk", "No suicidal risk detected - ALWAYS document this explicitly", shade=False)
pdf.table_row("Low Risk", "Suicidal ideation present; infrequent thoughts; NO plan; NO means", shade=True)
pdf.table_row("Moderate Risk", "Serious thoughts; desire to die; IDEAS of a plan; often no access; SOME social support; some risk factors", shade=False)
pdf.table_row("High Risk", "Detailed plan AND means to carry it out; risk factors present; protective factors ABSENT", shade=True)
pdf.ln(2)

pdf.subsection("Acute vs. Chronic Suicidal Risk")
pdf.bullet("Acute Risk:", "Desire to die in a FORESEEABLE TIMEFRAME (usually 24 hours or less); specific plan, intent, means, and method. Requires IMMEDIATE professional intervention.")
pdf.bullet("Chronic Risk:", "Long-term patterns of relationship difficulties, interpersonal conflicts, poor decision making, repetitive destructive patterns. Requires ongoing management and long-term care.")

pdf.subsection("Three NSPL Dimensions - Desire, Capability, Intent")
pdf.flag_box("WEAK AREA - Mixed up capability and intent on practice exam. Capability = HISTORY/CURRENT STATE. Intent = ACTIVE PLANNING.")
pdf.table_row("Dimension", "Key Indicators", header=True)
pdf.table_row("Desire", "Hopelessness, helplessness, feeling trapped, perceiving oneself as a burden, desire to harm self", shade=True)
pdf.table_row("Capability", "History of attempts, exposure to another's suicide, access to means, current intoxication, extreme agitation, dramatic mood changes, history of violence", shade=False)
pdf.table_row("Intent", "Attempt in progress, specific plan with known method, PREPARATORY BEHAVIORS (giving away possessions, counting pills, saying goodbye, rehearsing method), stated intent to die", shade=True)

pdf.subsection("SLAP Framework")
pdf.flag_box("WEAK AREA - Missed 'Specificity' and 'Proximity' on the drill. These are the two most commonly forgotten.")
pdf.bullet("S - Specificity:", "Are there specific steps, or just general thoughts?")
pdf.bullet("L - Lethality:", "Would this plan actually result in death?")
pdf.bullet("A - Availability:", "Does the client have access to the items needed?")
pdf.bullet("P - Proximity:", "How CLOSE are those items to the client RIGHT NOW? (Biggest differentiator - pills at home vs. pills in hand)")

pdf.add_page()
pdf.subsection("Warning Signs vs. Risk Factors - Critical Distinction")
pdf.flag_box("WEAK AREA - Prior suicide attempt: RISK FACTOR (historical), not a warning sign. A warning sign is happening NOW.")
pdf.table_row("Warning Signs (NOW)", "Risk Factors (BACKGROUND)", header=True)
pdf.table_row("Talking about wanting to die", "Prior suicide attempt(s)", shade=True)
pdf.table_row("Researching methods; rehearsing plan", "Diagnosis of mental illness (bipolar, depression)", shade=False)
pdf.table_row("Talking about feeling trapped or hopeless", "Military veteran / first responder status", shade=True)
pdf.table_row("Talking about being a burden to others", "LGBTQ+ youth; Native American community", shade=False)
pdf.table_row("Giving away possessions; saying goodbye", "Substance use disorder", shade=True)
pdf.table_row("Increasing alcohol or drug use (acute)", "Social isolation; lack of support system", shade=False)
pdf.table_row("Recent hospital discharge (acute indicator)", "History of trauma or abuse", shade=True)
pdf.ln(2)
pdf.body(
    "Clinical principle: Risk factors tell you WHO IS VULNERABLE. Warning signs tell you WHO NEEDS HELP NOW.\n\n"
    "A client can have multiple risk factors and not be in immediate danger. A client can have few "
    "apparent risk factors and be in acute crisis. Assess BOTH simultaneously."
)

pdf.subsection("Safety Planning - Current Best Practice")
pdf.body(
    "Safety planning (Stanley & Brown) is the INDUSTRY STANDARD. No-suicide contracts are NOT "
    "considered best practice. A comprehensive safety plan addresses:\n"
    "  (1) When to use the plan\n"
    "  (2) Coping and self-comfort strategies\n"
    "  (3) Reasons for living\n"
    "  (4) Who to contact (personal supports)\n"
    "  (5) Professional crisis contacts\n"
    "  (6) How to make the environment safe (means restriction)\n"
    "  (7) What to do if still not feeling safe\n\n"
    "MEANS RESTRICTION: Use a safety partner to assist - do not rely solely on the client to "
    "remove means. Voluntary hospitalization is preferred over involuntary when possible."
)


# ??????????????????????????????????????????????????????????????????????????????
# FINAL PAGE - RAPID-FIRE REVIEW
# ??????????????????????????????????????????????????????????????????????????????
pdf.add_page()
pdf.section_title("RAPID-FIRE REVIEW - Say These Out Loud Before the Exam", color=(40, 40, 40))

pdf.subsection("Must-Know Attributions")
pdf.bullet("Reuben Hill (1949):", "Original ABC-X model")
pdf.bullet("McCubbin & Patterson (1982):", "Double ABC-X model")
pdf.bullet("SAMHSA (2014):", "Six Guiding Principles of Trauma-Informed Care")
pdf.bullet("Beverley Raphael (2000):", "Coined 'Psychological First Aid'")
pdf.bullet("Gerald Caplan:", "Preventive psychiatry - early intervention promotes growth")
pdf.bullet("Erich Lindemann:", "Acute grief; somatic distress; Cocoanut Grove fire")
pdf.bullet("Stanley & Brown:", "Safety planning experts - industry standard")

pdf.subsection("Six TIC Principles - Recite From Memory")
for i, p in enumerate(["Safety", "Trustworthiness & Transparency", "Peer Support",
                         "Collaboration & Mutuality", "Empowerment, Voice & Choice",
                         "Cultural, Historical & Gender Issues"], 1):
    pdf.bullet(f"{i}.", p)

pdf.subsection("SLAP")
for item in [("S", "Specificity"), ("L", "Lethality"), ("A", "Availability"), ("P", "Proximity")]:
    pdf.bullet(f"{item[0]} =", item[1])

pdf.subsection("Four Ds of Malpractice")
pdf.body("Dereliction of Duty that Directly results in Damages")

pdf.subsection("De-Escalation Formula")
pdf.body('"You feel ___ because ___ and you want (or need) ___."')

pdf.subsection("Three Summary Types")
pdf.bullet("Focusing:", "Beginning of session - pull together prior info")
pdf.bullet("Signal:", "Mid-session - topic captured, move on")
pdf.bullet("Planning:", "End of session - recap progress and plans")

pdf.subsection("Coping Types")
pdf.bullet("Problem-focused:", "Direct action to change the stressor")
pdf.bullet("Emotion-focused:", "Change the meaning; reduce affective arousal")
pdf.bullet("Avoidance-focused:", "Distraction or diversion away from the stressor")

pdf.subsection("National Crisis Resources")
pdf.bullet("988 Suicide & Crisis Lifeline:", "Call or text 988")
pdf.bullet("King County:", "1-866-4-CRISIS or 206-461-3222")
pdf.bullet("Crisis Text Line:", "Text START to 741741")

output_path = "/Users/thomasmeaney/Coding Praccy/smartest-kid-coun5553/notes/COUN5173_Exam_Study_Guide.pdf"
pdf.output(output_path)
print(f"PDF saved: {output_path}")
