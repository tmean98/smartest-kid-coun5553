"""
Chapter 8 & 9 Flyby Outline PDF
Jackson-Cherry & Erford - Crisis Assessment, Intervention, and Prevention (4th ed.)
"""
from fpdf import FPDF


class OutlinePDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, "Jackson-Cherry & Erford | Crisis Assessment, Intervention & Prevention (4th ed.)", align="R")
        self.ln(2)
        self.set_draw_color(180, 180, 180)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 6, f"Page {self.page_no()}", align="C")

    def cover(self):
        self.add_page()
        self.set_fill_color(30, 60, 90)
        self.rect(0, 0, 210, 60, "F")
        self.set_y(14)
        self.set_font("Helvetica", "B", 20)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, "COUN 5173 - Pre-Class Flyby", align="C")
        self.ln(10)
        self.set_font("Helvetica", "B", 15)
        self.set_text_color(200, 220, 255)
        self.cell(0, 8, "Chapters 8 & 9 Outline", align="C")
        self.ln(8)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(170, 200, 240)
        self.cell(0, 6, "IPV/Domestic Violence  |  Sexual Violence", align="C")
        self.set_y(72)
        self.set_text_color(40, 40, 40)

    def ch_title(self, chapter_num, title, authors):
        self.set_fill_color(30, 60, 90)
        self.set_text_color(255, 255, 255)
        self.set_font("Helvetica", "B", 13)
        self.cell(0, 9, f"CHAPTER {chapter_num}: {title}", fill=True, ln=True)
        self.set_fill_color(70, 100, 140)
        self.set_font("Helvetica", "I", 9)
        self.cell(0, 6, f"  {authors}", fill=True, ln=True)
        self.set_text_color(40, 40, 40)
        self.ln(3)

    def section(self, title):
        self.set_fill_color(210, 225, 245)
        self.set_text_color(20, 50, 100)
        self.set_font("Helvetica", "B", 10)
        self.cell(0, 7, f"  {title}", fill=True, ln=True)
        self.set_text_color(40, 40, 40)
        self.ln(1)

    def bullet(self, text, indent=8, bold_prefix=None):
        self.set_font("Helvetica", "", 9)
        self.set_x(indent)
        bullet_char = "-"
        if bold_prefix:
            self.set_font("Helvetica", "B", 9)
            prefix_w = self.get_string_width(bold_prefix + "  ")
            self.cell(3, 5, bullet_char)
            self.cell(prefix_w, 5, bold_prefix + ":")
            self.set_font("Helvetica", "", 9)
            self.multi_cell(0, 5, "  " + text)
        else:
            self.cell(3, 5, bullet_char)
            self.multi_cell(0, 5, text)

    def sub_bullet(self, text, indent=14):
        self.set_font("Helvetica", "", 8.5)
        self.set_x(indent)
        self.cell(3, 5, "o")
        self.multi_cell(0, 5, text)

    def flag_box(self, title, text):
        self.set_x(self.l_margin)
        w = self.w - self.l_margin - self.r_margin
        self.set_fill_color(255, 240, 220)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(160, 60, 0)
        self.multi_cell(w, 6, f"  >> {title}", fill=True)
        self.set_x(self.l_margin)
        self.set_fill_color(255, 248, 235)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(80, 40, 0)
        self.multi_cell(w, 5, f"  {text}", fill=True)
        self.set_text_color(40, 40, 40)
        self.ln(2)

    def note_box(self, text):
        self.set_x(self.l_margin)
        w = self.w - self.l_margin - self.r_margin
        self.set_fill_color(235, 245, 235)
        self.set_font("Helvetica", "I", 8.5)
        self.set_text_color(40, 80, 40)
        self.multi_cell(w, 5, f"  Note: {text}", fill=True)
        self.set_text_color(40, 40, 40)
        self.ln(2)

    def spacer(self, h=3):
        self.ln(h)


pdf = OutlinePDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.set_margins(10, 18, 10)

# ---- COVER ----
pdf.cover()

# ============================================================
# CHAPTER 8
# ============================================================
pdf.add_page()
pdf.ch_title(8, "Intimate Partner Violence and Domestic Violence",
             "Lisa R. Jackson-Cherry & Bradley T. Erford")

pdf.section("Key Definitions (LO 8.1)")
pdf.bullet("IPV (Intimate Partner Violence): physical, sexual, emotional aggression or stalking by a CURRENT OR FORMER intimate partner; applies to same- or opposite-sex couples.")
pdf.bullet("DV (Domestic Violence): broader legal term - Bureau of Justice Statistics includes 'spouses, cohabitants, non-married intimate partners'; varies by state statute.")
pdf.bullet("These terms overlap but are NOT interchangeable; IPV is a subset of DV.")
pdf.flag_box("Exam Note", "IPV is NOT the legal term used in federal/state statutes for mandated reporting. Know the difference for clinical and legal purposes.")
pdf.bullet("'Victim' vs 'survivor': Use 'victim' during crisis intervention to anchor legal status; 'survivor' signals healing and reclaimed power.")

pdf.spacer()
pdf.section("Cycle of Violence Theory (LO 8.2) - Walker (1980)")
pdf.bullet("Based on interviews with hundreds of women in abusive relationships; describes a 3-phase repeating pattern:")
pdf.sub_bullet("Phase 1 - Tension-Building: mounting pressure; victim 'walks on eggshells'; minor battering incidents; victim uses denial, rationalization, excuses.")
pdf.sub_bullet("Phase 2 - Acute Battering Incident: explosion; unpredictable, uncontrollable rage; can last hours or days; victim may dissociate; both partners rationalize after.")
pdf.sub_bullet("Phase 3 - Honeymoon Phase: abuser showers with gifts, apologies, promises; victim feels needed/loved; phase shortens over repeated cycles; guilt/humiliation grow.")
pdf.flag_box("Exam Note", "After repeated cycles, the honeymoon phase shrinks or disappears entirely. Risk of homicide is HIGHEST when victim tries to leave.")

pdf.spacer()
pdf.section("Helpful Theoretical Models (LO 8.3)")
pdf.bullet("Duluth Model (1984): Power & Control Wheel - abusive tactics include isolation, emotional abuse, coercion, using children, economic abuse, male privilege. Also has Equality Wheel showing what healthy relationships look like.")
pdf.bullet("Learned Helplessness (Seligman): repeated uncontrollable violence leads victim to stop trying to escape; criticized for pathologizing victim and ignoring systemic factors.")
pdf.bullet("Ecological Theory: sociocultural, institutional, interpersonal, and individual systems all influence why victim stays.")
pdf.bullet("Contextual Model of Family Stress (Rolling & Brosi): stressor + resources + perception + external/internal context; allows multi-domain intervention.")
pdf.bullet("Constructivist View: staying can be a rational cost-benefit decision; victim has inner resources (resilience, spirituality, hope).")

pdf.spacer()
pdf.section("Common Crisis Issues (LO 8.4)")
pdf.bullet("Overarching goal: SAFETY OF VICTIMS - regardless of whether they stay or leave.")
pdf.bullet("Attend to Physical Injury: may need emergency medical referral BEFORE counseling; refer to rape-specialized facilities if needed; ensure continuity of care.")
pdf.bullet("Establishing Immediate Safety: assess violence severity, resources, barriers; assess for suicide AND homicide; arrange emergency shelter if needed.")
pdf.bullet("Reporting to Police: varies by state; counselors not required to report IPV/DV unless suicidality, homicidality, specific injuries (gunshot/stab wounds), or child/elder/vulnerable person abuse is involved.")
pdf.flag_box("Key Rule", "DV mandated reporting is SEPARATE from child/elder abuse mandated reporting laws. If both are present, BOTH sets of laws apply.")

pdf.spacer()
pdf.section("Special Populations (LO 8.5)")
pdf.bullet("Race & Ethnicity: 54% of Black women and 44% of multiracial women experienced IPV/sexual assault/stalking in lifetime; underreporting due to mistrust of law enforcement, cultural factors, SES.")
pdf.bullet("SES: poverty linked to limited resources, substance use, social isolation; higher-SES groups often use private services (thus underreported in stats).")
pdf.bullet("Immigrant Status: language barriers, distrust of government, fear of deportation; 38% of women worldwide murdered by intimate partners.")
pdf.bullet("Religious/Spiritual: can work FOR or AGAINST help-seeking; faith can be a coping resource OR a reason to stay; religious leaders may be unprepared.")
pdf.bullet("Female-to-Male: 1 in 4 men physically abused by partner; underreported due to gender norms/'emasculation'; fewer shelter resources available.")
pdf.bullet("LGBTQ+: 4 in 10 lesbian women, 6 in 10 bisexual women affected; threat of 'outing' used as control; feminist framework doesn't explain same-sex IPV well.")
pdf.bullet("Disability: women with disabilities assaulted at twice the rate; dependency on partner for daily care increases vulnerability; mandated reporting laws apply.")
pdf.bullet("Elder Abuse: ~3.5M Americans 65+ abused; types include physical, sexual, emotional, neglect, abandonment, financial exploitation, self-neglect; all states have mandated reporting.")
pdf.bullet("Dating Violence (Adolescents): 23% of females and 14% of males experience IPV before age 18; ACEs are major risk factor; CDC programs: 'Preventing IPV Across the Lifespan' and 'Dating Matters'.")

pdf.add_page()
pdf.section("Counselor Response to IPV/DV Clients in Crisis (LO 8.6)")
pdf.bullet("Universal Screening: assess ALL clients for IPV/DV, just like suicidality/homicidality - make it standard of care.")
pdf.flag_box("TWO ABSOLUTES for IPV/DV Screening", "1) NEVER ask about abuse in the presence of the partner. 2) NEVER recommend leaving as the only path to safety - risk of harm INCREASES at point of separation.")
pdf.bullet("Q-Tree Assessment: structured branching questions covering type/severity/frequency, injuries, law enforcement involvement, stalking, weapons, others in home, children/pets.")
pdf.bullet("Lethality Assessment factors: severity of violence, criminal history of abuser, obsessive/stalking behavior, substance use, threats with weapons, failed past interventions, victim planning to leave.")
pdf.bullet("Response to Disclosure: validate experience ('no one deserves this'); communicate non-blame; document (notes, photos of injuries); provide resources (National DV Hotline: 1-800-799-SAFE).")

pdf.spacer()
pdf.section("Safety Planning vs. Harm Reduction Planning")
pdf.bullet("Safety Planning (client is LEAVING): identify safe locations (shelters), arrange transportation, contact law enforcement if needed. Note: protective orders violated ~50% of the time.")
pdf.bullet("Harm Reduction Planning (client is STAYING): read anger warning signs, avoid trigger rooms (bathroom, kitchen), code words for children/neighbors, escape bag (meds, keys, legal docs, money), stored outside home with trusted person.")
pdf.flag_box("Key Clinical Principle", "9% of homicides are by intimate partners - often around the decision to leave. Do not insist the client leave; help them be as SAFE AS POSSIBLE on their own timeline.")
pdf.bullet("Emotional Impact: PTSD, depression, low self-esteem, substance use, battered woman syndrome (disrupted relationships, body image issues, sexual problems); normalize symptoms as 'normal response to abnormal situation'.")

pdf.spacer()
pdf.section("COVID-19 & IPV/DV (LO 8.7)")
pdf.bullet("WHO issued global statements: social isolation dramatically increased IPV/DV risk; 'shadow pandemic' of domestic violence ran alongside COVID-19.")
pdf.bullet("Reduced access to support: shelters limited, telehealth could be overheard by abuser.")
pdf.bullet("WHO guidelines: limit news to 1-2hrs/day, maintain routines, develop safety plan, keep emergency docs/money accessible, be discreet.")

pdf.spacer()
pdf.section("Batterer Intervention (LO 8.8)")
pdf.bullet("Coordinated Community Response (CCR): collaboration of service providers - advocacy, criminal justice, child services, health care, education, vocation.")
pdf.bullet("3 Goals of Batterer Intervention Programs:", bold_prefix=None)
pdf.sub_bullet("1. Safety - separate victims from perpetrators if needed; incarceration provides temporary safety.")
pdf.sub_bullet("2. Cessation of Violence - discard denial ('I didn't do it'), minimizing ('I only hit her'), blaming ('she made me'); includes verbal/emotional abuse.")
pdf.sub_bullet("3. Accountability - change negative self-talk to positive; identify triggers (words, situations, physiological cues like muscle tension); develop alternatives to violence.")
pdf.bullet("Challenges: most are court-mandated (requires reporting first); dropout rates 40-70%; financial barriers (few funds for batterer programs vs victim programs).")
pdf.bullet("Batterer Risk Factors: access to guns, weapon use in prior incidents, threats to kill, forced sex, obsessive jealousy, prior criminal history, substance use, restraining order in place.")

# ============================================================
# CHAPTER 9
# ============================================================
pdf.add_page()
pdf.ch_title(9, "Sexual Violence", "Robin Lee & Jennifer Jordan")

pdf.section("Key Definitions & Historical Context (LO 9.1)")
pdf.bullet("Sexual Violence: a sexual act committed or attempted without freely given consent, including: forced/drug-facilitated penetration, unwanted sexual contact, noncontact unwanted experiences (harassment, pornography, filming without knowledge).")
pdf.bullet("Sexual Assault: broader than rape; includes attempted rape, forced oral sex, fondling/unwanted touching - it is a POWER AND CONTROL crime, not about sex.")
pdf.bullet("Rape: forced sexual intercourse via physical OR psychological coercion; includes penetration; covers same-gender victims.")
pdf.bullet("Consent: must be freely given by someone legally (not a minor, no intellectual disability) AND functionally (not intoxicated, unconscious, sleeping) competent to consent.")
pdf.flag_box("Affirmative Consent ('Yes Means Yes')", "Consent is mutually agreed upon, freely given, clearly understood, and never implied. Silence is NOT consent. Being in a relationship is NOT consent. Being too drunk to say no is NOT consent.")
pdf.bullet("Historical landmarks: VAWA (1994) - first federal law on violent crimes against women; reauthorized 2000, 2005, 2013, 2021. Most recent adds tribal jurisdiction, economic justice, housing protections.")

pdf.spacer()
pdf.section("Prevalence & Statistics (LO 9.2)")
pdf.bullet("Sexual assault occurs every 68 seconds in the U.S. (RAINN, 2022).")
pdf.bullet("1 in 5 women (23M) and 1 in 71 men (1.9M) will be raped in the U.S. (CDC/Breiding et al., 2014).")
pdf.bullet("2 out of 3 sexual assaults are NEVER REPORTED; reasons: fear of retaliation, doubt law enforcement will help, view as personal matter.")
pdf.bullet("90% of rape victims are female; women assaulted before 18 are 2x more likely to be assaulted as adults.")
pdf.bullet("80% of rapes are committed by someone KNOWN to the victim.")
pdf.flag_box("Rape Myths - Know These", "M1: Rape is about sex. FALSE - it's about power/control.\nM2: Victims deserve it due to dress/behavior. FALSE - no cause justifies assault.\nM3: False reports are common. FALSE - confirmed false reports ~5.2%.\nM4: Stranger rape is most common. FALSE - 80% are by known individuals.")

pdf.spacer()
pdf.section("Types of Rape")
pdf.bullet("Acquaintance Rape: RAINN discourages 'date rape' label (minimizes seriousness); prefer 'sexual assault by an acquaintance'; most common setting is college campuses.")
pdf.bullet("Drug-Facilitated Sexual Assault: (1) victim voluntarily used substances, OR (2) perpetrator deliberately drugged victim. Common drugs: alcohol, Rohypnol ('roofies'), GHB, ketamine.")
pdf.bullet("Intimate Partner Sexual Violence: rape within a relationship; criminalized in all 50 states since 1990s; rarely reported; handled same as other rape by law enforcement.")
pdf.bullet("Statutory Rape: based on age of consent (ranges 16-18 by state); 'Romeo and Juliet' clauses allow judicial discretion for close-in-age peers.")

pdf.spacer()
pdf.section("Other Types of Sexual Violence (LO 9.3)")
pdf.bullet("Sexual Harassment: EEOC definition - unwelcome sexual advances affecting employment/work environment; governed by Title VII of Civil Rights Act (1964); gender neutral.")
pdf.bullet("Stalking: repeated unwanted contacts causing fear; 3.8M victims per year; 69% know their stalker; cyberstalking includes GPS tracking, video cameras, unwanted e-communication. ALL 50 states + federal government have criminal stalking laws.")
pdf.bullet("Human Trafficking (TVPA 2000): sex trafficking (commercial sex via force/fraud/coercion) and labor trafficking; minors in commercial sex = victims regardless of force. Victims: overwhelmingly female, racial-ethnic minorities, under 18. 89% depressed, 55% PTSD, 84% substance abuse, 67% STI.")
pdf.bullet("Sexual Violence & School-Age Children: Title IX requires schools to address hostile environments; schools must investigate even off-campus incidents; creates confidentiality tension for school counselors.")
pdf.flag_box("4 Key Aspects of Treating Sex Trafficking Victims", "1) Ensure safety & confidentiality  2) Trauma-informed care  3) Comprehensive needs assessment  4) Coordinated physical/mental health and legal case management")

pdf.add_page()
pdf.section("Effects of Sexual Violence (LO 9.4)")
pdf.bullet("Rape Trauma Syndrome (Burgess & Holmstrom, 1974): cluster of symptoms parallel to PTSD:")
pdf.sub_bullet("Acute Phase: days to weeks; heightened stress, intrusive thoughts, sleep disturbance, hypervigilance, guilt, fear, numbness.")
pdf.sub_bullet("Reorganization Phase: longer-term integration; victim regains sense of control over life.")
pdf.note_box("Psychoeducation is KEY during the acute phase: normalize responses as 'normal to an abnormal event.'")
pdf.bullet("Physical Effects: chronic pain, sleep disturbances, headaches, STIs, pregnancy (~3M rape-related pregnancies in U.S.), GI disorders, cervical cancer.")
pdf.bullet("Cognitive-Behavioral Effects: impaired memory/concentration, compulsive safety checking, hyperalertuness, paranoia, imaginary audience ('people can tell I was assaulted').")
pdf.bullet("Emotional/Psychological Effects: guilt, self-blame, shame, humiliation, anxiety, depression, numbness.")
pdf.bullet("PTSD: DSM-5 first edition to list sexual assault as specific traumatic event; 20% of female and 5.2% of male contact sexual violence survivors develop PTSD symptoms.")
pdf.bullet("ASD: symptoms must appear AND resolve within 3-30 days post-trauma; differentiates from PTSD by shorter duration; 20-50% of sexual violence victims.")
pdf.bullet("Depression & Self-Harm: depression is leading PTSD comorbidity; suicide risk elevated; self-harm used as coping.")
pdf.bullet("Eating Disorders: focus on food as attempt at control; 30% of eating disorder patients have history of sexual violence.")
pdf.bullet("Addiction: rape victims 13x more likely to misuse alcohol, 26x more likely to misuse drugs; childhood sexual assault greatly increases addiction risk.")

pdf.spacer()
pdf.section("Medical & Law Enforcement Response (LO 9.5)")
pdf.bullet("Two Entry Points: Emergency Department (ED) OR Sexual Assault Crisis Center; law enforcement often directs victims to one of these.")
pdf.bullet("SANE (Sexual Assault Nurse Examiner): specially trained to conduct Sexual Assault Forensic Exams (SAFEs).")
pdf.bullet("SAFE Process (~4 hours): biological samples (blood, urine, hair, saliva), oral/vaginal/anal swabs, DNA analysis; clothing collected; donated clothing provided.")
pdf.flag_box("Preserve Evidence - Tell Clients BEFORE the exam", "Do NOT: bathe, shower, wash hands, brush teeth, eat, drink, or change clothes before the forensic exam. Counselors must know this to prepare victims.")
pdf.bullet("Medical Follow-up: STI testing at 1-2 weeks; syphilis/HIV testing at 6, 12, and 24 weeks post-assault.")
pdf.bullet("Law Enforcement: trained specialized units; investigation leads to prosecutor's office; victims can submit VICTIM IMPACT STATEMENTS at sentencing (Justice for All Act, 2004).")
pdf.bullet("Victim Rights (Justice for All Reauthorization 2013): right to be informed of plea bargains, right to know about victims' services eligibility.")

pdf.spacer()
pdf.section("Treatment - Short-Term (LO 9.6)")
pdf.bullet("Psychological First Aid (PFA): most evidence-supported IMMEDIATE intervention; used within 24 hrs; originally for disasters, now supported for sexual violence.")
pdf.bullet("PFA 8 Core Actions:", bold_prefix=None)
pdf.sub_bullet("1) Contact & Engagement  2) Safety & Comfort  3) Stabilization  4) Information Gathering")
pdf.sub_bullet("5) Practical Assistance  6) Connection with Social Supports  7) Info on Coping  8) Linkage with Services")
pdf.flag_box("PFA Clinical Principle", "Let the VICTIM determine what role you will have. Allow control. Do not direct conversation toward the incident. Active listening and empathy have the most impact. Victim must feel in control throughout.")

pdf.spacer()
pdf.section("Treatment - Long-Term (LO 9.6 continued)")
pdf.bullet("TF-CBT (Trauma-Focused Cognitive-Behavioral Therapy - Cohen et al.): for children, adolescents, families; PRACTICE acronym:")
pdf.sub_bullet("Psychoeducation - Relaxation - Affective Expression - Cognitive Coping - Trauma Narration - In Vivo Mastery - Conjoint Sessions - Enhancing Safety")
pdf.bullet("Prolonged Exposure Therapy (Foa & Rothbaum): repeated imaginal exposure to trauma in safety of counselor's office; sessions recorded for home review; most effective for PTSD.")
pdf.bullet("Dialectical Behavior Therapy (DBT - Linehan): targets suicidal ideation, self-harm, substance use; emotional/cognitive regulation; used with child sexual abuse survivors.")
pdf.bullet("ACT (Acceptance & Commitment Therapy): psychological flexibility; 6 core processes: acceptance, cognitive defusion, being present, self as context, values, committed action.")
pdf.bullet("CPT (Cognitive Processing Therapy): 12-session group or individual; schema-based; targets 5 core areas: safety, trust, self-esteem, power/control, intimacy. Best evidence for depression and long-term PTSD improvement (up to 6 years).")
pdf.bullet("EMDR: bilateral stimulation (eye movement, tapping, sounds); 8 phases; reprocesses trauma memories; strong evidence for PTSD.")
pdf.bullet("SIT (Stress Inoculation Training - Meichenbaum): 3 phases: conceptualization, skills acquisition/rehearsal, application/follow-through.")
pdf.bullet("Relaxation Training: deep breathing, deep muscle relaxation, cue-controlled relaxation; must be practiced IN session before assigning for home use.")
pdf.bullet("Group Counseling: screen clients first; individual therapy should precede group; most effective when client is past acute guilt/shame and ready to move forward.")
pdf.bullet("Expressive Arts: art, music, dance, writing therapies for when words are difficult.")
pdf.bullet("Emerging: Internal Family Systems, Brainspotting, TF-CBT for children, sandtray, animal-assisted therapy.")
pdf.flag_box("7 Evidence-Based Long-Term Treatments for Female Survivors", "Assertion training, clinician-assisted emotional disclosure, CPT, EMDR, prolonged exposure therapy, stress inoculation therapy, supportive psychotherapy with information. (Parcesepe et al., 2015 systematic review)")

pdf.add_page()
pdf.section("Multicultural, Spiritual & LGBTQ+ Issues (LO 9.7)")
pdf.bullet("Confidentiality: counselors ethically obligated to maintain confidentiality even when reporting seems in client's best interest; cannot persuade clients to report or undergo forensic exam against their will.")
pdf.bullet("Subpoenas: not all are legally valid; obtain client consent even for client's own attorney's subpoena; seek legal counsel when legal system is involved.")
pdf.bullet("Spirituality: positive religious coping (seeking meaning, helping others, church involvement) = better outcomes; negative coping (bargaining, avoidance, dissatisfaction with God) = worse outcomes; severity of trauma correlates with more negative coping.")
pdf.bullet("ASERVIC Competencies: govern how counselors address spiritual/religious issues in counseling.")
pdf.bullet("Male Victims: reluctant to disclose; fear of stigma; confidentiality especially important; fewer resources; honor preferences for provider gender.")
pdf.bullet("LGBTQ+ Victims: bisexual women have HIGHEST rates of sexual violence; barriers to reporting include fear of outing, losing LGBTQ+ community support, internalized homophobia; few LGBTQ+-affirmative shelters and services.")
pdf.bullet("Multicultural Barriers: cultural values discouraging medical exam for unmarried women; loss of virginity = family shame in some cultures; language barriers; distrust of legal system.")
pdf.flag_box("ACA Ethics - Values Imposition", "Counselors must NOT impose personal values on clients. Do NOT persuade a victim to report. DO empower clients to make their own decisions about their bodies and legal options.")

pdf.spacer()
pdf.section("Sexual Offenders & Treatment (LO 9.8)")
pdf.bullet("Sexual offenders come from ALL socioeconomic, racial, geographic, educational backgrounds - not a single 'type.'")
pdf.bullet("Cycle of offending: often groom victims over time; plan and select targets; rationalize and minimize behavior.")
pdf.bullet("Treatment: cognitive-behavioral approaches addressing distorted thinking, empathy deficits, social skills; relapse prevention; community supervision.")
pdf.bullet("Assessment tools: specialized polygraph, STATIC-99 (risk assessment), Abel Assessment for Sexual Interest.")
pdf.bullet("Mandatory sex offender registries vary by state; treatment goal is accountability + preventing recidivism, not just punishment.")

pdf.spacer()
pdf.section("RAPID-FIRE KEY TERMS - Both Chapters")
terms = [
    ("Cycle of Violence", "Tension-building -> Acute battering -> Honeymoon (Walker, 1980)"),
    ("Duluth Model", "Power & Control Wheel; Equality Wheel; developed 1984 from survivor experiences"),
    ("Learned Helplessness", "Repeated uncontrollable abuse -> passivity; criticized for victim-blaming"),
    ("CCR", "Coordinated Community Response - multi-system collaboration in DV response"),
    ("Batterer Goals", "Safety, Cessation of Violence, Accountability"),
    ("Rape Trauma Syndrome", "Burgess & Holmstrom (1974); Acute Phase + Reorganization Phase"),
    ("SAFE", "Sexual Assault Forensic Exam; conducted by SANE; ~4 hours; DNA + biological evidence"),
    ("PFA Core Actions", "8 actions: Contact, Safety, Stabilize, Info Gather, Practical, Social Supports, Coping Info, Linkage"),
    ("CPT 5 Core Areas", "Safety, Trust, Self-Esteem, Power & Control, Intimacy"),
    ("TF-CBT Acronym", "PRACTICE (Psycho, Relax, Affect, Cognitive, Trauma narration, In vivo, Conjoint, Enhancing)"),
    ("EMDR Phases", "8 phases: History, Prep, Assessment, Desensitization, Installation, Body Scan, Closure, Reevaluation"),
    ("VAWA", "1994; reauthorized 2000, 2005, 2013, 2021; covers sexual assault, DV, dating violence, stalking"),
    ("Affirmative Consent", "'Yes means yes'; must be freely given, mutually agreed, never assumed"),
    ("Title IX", "Prohibits sex discrimination in federally funded education; schools must investigate sexual violence"),
    ("Title VII", "Civil Rights Act 1964; governs sexual harassment in workplace"),
    ("TVPA 2000", "Trafficking Victims Protection Act; defines sex & labor trafficking; minors = victims regardless of force"),
]
col1_w = 52
col2_w = 138
for term, definition in terms:
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_fill_color(240, 240, 250)
    pdf.cell(col1_w, 5, term + ":", fill=True, ln=False)
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_fill_color(250, 250, 255)
    pdf.multi_cell(col2_w, 5, definition, fill=True)
    pdf.ln(1)

output = "/Users/thomasmeaney/Coding Praccy/smartest-kid-coun5553/notes/Ch8_Ch9_Flyby_Outline.pdf"
pdf.output(output)
print(f"PDF saved: {output}")
