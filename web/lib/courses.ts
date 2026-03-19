export type CourseId = "coun5553" | "coun5773" | "coun5453" | "coun5173";

export interface ClassDateInfo {
  date: string;
  videoDatePrefixes?: string[];
}

export interface CourseConfig {
  id: CourseId;
  code: string;
  title: string;
  shortTitle: string;
  instructor: string;
  textbooks: string[];
  classDates: Record<number, ClassDateInfo>;
  classSlideMap: Record<number, string[]>;
  classReadingMap?: Record<number, string[]>; // patterns matching dedicated reading excerpt chunks
  classTopicMap?: Record<number, string[]>;   // topic/concept terms assigned for each class session
  mostRecentClass: number;
  knownTerms: string[];
  sourceWeights: Record<string, number>;
  instructorRefPattern: RegExp;
  welcomeExamples: string[];
  modes: string[];
}

export const COURSES: Record<CourseId, CourseConfig> = {
  coun5553: {
    id: "coun5553",
    code: "COUN 5553",
    title: "Professional Orientation, Law & Ethics",
    shortTitle: "Law & Ethics",
    instructor: "Dr. Rachel Kerrigan",
    textbooks: [
      "Remley & Herlihy, Ethical Legal Professional Issues in Counseling (7th ed)",
    ],
    classDates: {
      1: { date: "2026-01-15", videoDatePrefixes: ["Jan_15_2026", "Jan 15 2026"] },
      2: { date: "2026-01-22", videoDatePrefixes: ["Jan_22_2026", "Jan 22 2026"] },
      3: { date: "2026-01-29", videoDatePrefixes: ["Jan_29_2026", "Jan 29 2026"] },
      4: { date: "2026-02-12", videoDatePrefixes: ["Feb_12_2026", "Feb 12 2026"] },
      5: { date: "2026-02-19", videoDatePrefixes: ["Feb_19_2026", "Feb 19 2026"] },
      6: { date: "2026-03-12" },
      7: { date: "2026-03-26" },
      8: { date: "2026-04-16" },
    },
    // Patterns match chunk IDs (underscores) or titles (spaces), case-insensitive
    classSlideMap: {
      1: ["ethics_class_1", "class_1", "coun_w1", "csea_w1"],
      2: ["class_2"],
      3: ["class_3", "case_3"],               // class 3 slides + case study
      4: ["class_4", "tarasoff", "volk", "evidence_based"],
      5: ["class#_5"],                         // file is "class#_5_2026"
      6: ["washington_state_reporting", "child_abuse_and_neglect", "required_to_report", "week_6_case"],
      7: ["nouwen", "hamman"],
    },
    // Topics drawn from syllabus reading/lecture schedule (Remley & Herlihy chapter assignments)
    classTopicMap: {
      1: ["professional identity", "counseling history", "licensure", "virtue ethics", "principal ethics",
          "professional organizations", "cacrep", "professional associations", "credentialing"],
      2: ["multiculturalism", "social justice", "informed consent", "client rights", "fiduciary",
          "advocacy", "court mandated", "cultural", "diversity"],
      3: ["confidentiality", "privileged communication", "records", "subpoena", "privacy",
          "hipaa", "disclosure", "record keeping"],
      4: ["competence", "malpractice", "tarasoff", "volk", "duty to warn", "burnout",
          "self-care", "testing", "diagnosis", "negligence", "standard of care"],
      5: ["boundary", "dual relationship", "technology", "telehealth", "social media",
          "distance counseling", "online counseling"],
      6: ["children", "vulnerable adults", "families", "groups", "child abuse", "neglect",
          "mandated reporter", "mandatory reporting", "abuse reporting"],
      7: ["professional relationships", "counselor education", "private practice",
          "health care plans", "referral", "leadership"],
      8: ["supervision", "consultation", "professional writing", "research", "publishing"],
    },
    mostRecentClass: 5,
    knownTerms: [
      "tarasoff",
      "jaffee",
      "jaffee v redmond",
      "ewing",
      "peck",
      "hedlund",
      "mcintosh",
      "eisel",
      "volk",
      "demeerleer",
    ],
    sourceWeights: {
      textbook: 1.0,
      reading: 1.1,
      slides: 1.2,
      "aca-code": 1.1,
      syllabus: 0.8,
      "video-transcript": 1.3,
    },
    instructorRefPattern:
      /\b(dr\.?\s*kerrigan|professor|instructor|she said|he said|quote|lecture|in class|said in|talked about|mentioned|discussed in class)\b/,
    welcomeExamples: [
      "What are the key concepts from this week's slides?",
      "Quiz me on Chapter 4",
      "Explain informed consent like I'm explaining it to a client",
      "What case established the duty to warn?",
      "Review chapters 8-9 for the quiz",
    ],
    modes: ["quiz", "explain", "cases", "review", "discuss", "draft"],
  },

  coun5773: {
    id: "coun5773",
    code: "COUN 5773",
    title: "Theology and Counseling",
    shortTitle: "Theology & Counseling",
    instructor: "Dr. Marty Folsom",
    textbooks: [
      "Anderson, Christians who Counsel (Wipf & Stock)",
      "Callaway & Whitney, Theology for Psychology and Counseling (Baker Academic)",
    ],
    classDates: {
      1: { date: "2026-01-06" },
      2: { date: "2026-01-20" },
      3: { date: "2026-02-03" },
      4: { date: "2026-02-17" },
      5: { date: "2026-03-03" },
      6: { date: "2026-03-17" },
      7: { date: "2026-03-31" },
      8: { date: "2026-04-14" },
    },
    // Session slides follow naming pattern: THEOLOGY_OF/FOR_COUNSELING_session/SESSION_N
    classSlideMap: {
      1: ["session_final_1", "theology_of_counseling_session_final"],
      2: ["session_2"],
      3: ["session_3"],
      4: ["session_4"],
      5: ["powerpoint_week_5"],
    },
    // Class 3 has dedicated reading excerpts from both textbooks
    classReadingMap: {
      3: ["cwc_class_3", "theo_for_psych_class_3"],
    },
    // Topics drawn from syllabus reading/lecture schedule (Callaway/Whitney + Anderson assignments)
    classTopicMap: {
      1: ["integration", "theology", "counseling", "science of the personal", "constructive theology",
          "theological anthropology", "philosophical anthropology", "introduction"],
      2: ["whole person", "wholistic", "identity", "self", "health", "growth", "modern struggle",
          "counseling the whole person", "constructive theology"],
      3: ["trinitarian", "creation", "kingdom of god", "grace", "personhood", "therapeutic context",
          "theology of personhood", "being in relationship"],
      4: ["sin", "human development", "freedom", "prayer", "word of god", "healing praxis",
          "sanctification", "health freedom"],
      5: ["christology", "incarnation", "imago dei", "image of god", "relationality",
          "christian calling", "human person", "constitution of the human person"],
      6: ["bondage", "brokenness", "freedom", "justice", "experimental theology",
          "christian ministry", "psychology as theology", "research psychology"],
      7: ["community", "love", "spirit", "practical theology", "professional practice",
          "advocacy", "integration and disintegration"],
      8: ["contextual theology", "pastoral care", "moral advocate", "counseling praxis",
          "psychology as contextual theology", "incarnation", "god's being"],
    },
    mostRecentClass: 5, // Class 5 was Mar 3; class 6 is Mar 17
    knownTerms: [
      "imago dei",
      "incarnation",
      "trinitarian",
      "anthropology",
      "integration",
      "wholistic",
      "vocation",
      "personhood",
    ],
    sourceWeights: {
      textbook: 1.0,
      reading: 1.1,
      slides: 1.2,
      syllabus: 0.8,
      "video-transcript": 1.3,
    },
    instructorRefPattern:
      /\b(dr\.?\s*folsom|professor|instructor|he said|she said|quote|lecture|in class|said in|talked about|mentioned|discussed in class)\b/,
    welcomeExamples: [
      "What are the main topics from this week's reading?",
      "Quiz me on the Anderson chapters",
      "Explain the imago Dei and its relevance to counseling",
      "Help me prepare for my discussion board post",
      "Review weeks 1-4 for the self-narrative",
    ],
    modes: ["quiz", "explain", "review", "discuss", "draft"],
  },

  coun5453: {
    id: "coun5453",
    code: "COUN 5453",
    title: "Psychopathology and Diagnosis",
    shortTitle: "Psychopathology",
    instructor: "Dr. Robert Campbell",
    textbooks: [
      "DSM-5-TR (5th ed)",
      "Castonguay & Oltmanns, Psychopathology: From Science to Clinical Practice (2nd ed)",
      "Morrison, The First Interview (4th ed)",
    ],
    classDates: {
      1: { date: "2026-01-09", videoDatePrefixes: ["Jan_09_2026"] },
      2: { date: "2026-01-13", videoDatePrefixes: ["Jan_13_2026"] },
      3: { date: "2026-01-27", videoDatePrefixes: ["Jan_27_2026"] },
      4: { date: "2026-02-10", videoDatePrefixes: ["Feb_10_2026"] },
      5: { date: "2026-02-24", videoDatePrefixes: ["Feb_24_2026"] },
      6: { date: "2026-03-10" },
      7: { date: "2026-03-24" },
      8: { date: "2026-04-07" },
    },
    // Slide files follow naming: Psychopathology_Week_N-_*
    classSlideMap: {
      1: ["week_1"],
      2: ["week_2"],
      3: ["week_3"],
      4: ["week_4"],
      5: ["week_5"],
    },
    // Dedicated reading excerpts mapped to their class sessions
    classReadingMap: {
      1: ["diag_reading_1"],
      2: ["morrison_reading_1-4"],
      3: ["morrison_5-8", "diag_class_3"],
    },
    // Topics drawn from syllabus (Castonguay chapters + DSM-5-TR disorders assigned per class)
    classTopicMap: {
      1: ["depression", "major depressive", "generalized anxiety", "psychopathology", "introduction"],
      2: ["clinical interview", "chief complaint", "rapport", "opening", "depression", "generalized anxiety"],
      3: ["obsessive compulsive", "ocd", "panic disorder", "panic attack", "anxiety disorder"],
      4: ["eating disorder", "anorexia", "bulimia", "binge", "mental status exam",
          "sensitive subjects", "ptsd", "post traumatic stress"],
      5: ["personality disorder", "borderline", "narcissistic", "antisocial", "cultural",
          "substance use", "alcohol use disorder", "bipolar"],
      6: ["schizophrenia", "psychosis", "psychotic", "schizoaffective", "case formulation",
          "treatment plan", "bipolar disorder"],
      7: ["sexual dysfunction", "sleep", "sleep-wake", "insomnia", "hypersomnia",
          "marital", "relational problem"],
      8: ["suicide", "suicidal", "differential diagnosis", "final exam"],
    },
    mostRecentClass: 5, // Class 5 was Feb 24; class 6 is Mar 10
    knownTerms: [
      "dsm",
      "differential diagnosis",
      "vignette",
      "psychopathology",
      "clinical interview",
      "mental status exam",
      "specifiers",
      "diagnostic criteria",
    ],
    sourceWeights: {
      textbook: 1.0,
      reading: 1.1,
      slides: 1.2,
      syllabus: 0.8,
      "video-transcript": 1.3,
    },
    instructorRefPattern:
      /\b(dr\.?\s*campbell|professor|instructor|he said|she said|quote|lecture|in class|said in|talked about|mentioned|discussed in class)\b/,
    welcomeExamples: [
      "Quiz me on anxiety disorders from the DSM-5-TR",
      "Explain differential diagnosis step by step",
      "Walk me through a case vignette for depression",
      "What topics does the final exam cover?",
      "Review eating disorders and substance use disorders",
    ],
    modes: ["quiz", "explain", "cases", "review", "discuss", "draft"],
  },

  coun5173: {
    id: "coun5173",
    code: "COUN 5173",
    title: "Crisis Counseling and Abuse",
    shortTitle: "Crisis & Abuse",
    instructor: "Dr. Esther McCartney",
    textbooks: [
      "Jackson-Cherry & Erford, Crisis Assessment, Intervention, and Prevention (4th ed)",
      "Hunsinger, Bearing the Unbearable",
    ],
    classDates: {
      // Videos named by class number, not date: e.g. video_Class_1_part_1.txt
      1: { date: "2026-01-08", videoDatePrefixes: ["class_1_part"] },
      2: { date: "2026-02-05", videoDatePrefixes: ["class_2_part"] },
      3: { date: "2026-02-26", videoDatePrefixes: ["crisis_class_3"] },
      4: { date: "2026-03-05" },
      5: { date: "2026-03-19" },
      6: { date: "2026-04-02" },
      7: { date: "2026-04-09" },
    },
    // Slide files follow naming: Crisis_Counseling-Chapter_N_Summary, Chapter_N, etc.
    classSlideMap: {
      1: ["chapter_1-2_summary", "chapter_3_summary"],      // J-C Ch 1-3
      2: ["chapter_4_summary", "chapter_6_summary",         // J-C Ch 4, 6-7
          "chapter_7_crisis", "c-ssrs", "cams-ssf",
          "safetyplantemplate", "safety-plan", "safet", "tasci"],
      3: ["crisis_class_3", "crisis_chapter_8"],            // J-C Ch 8-9
      4: ["school_based", "institutional_disaster"],        // J-C Ch 12-13
    },
    // Dedicated reading excerpts mapped to class sessions
    classReadingMap: {
      1: ["crisis_reading_1"],
      2: ["ce_ch4"],
      3: ["crisis_class_3_reading"],
      4: ["dawson_college", "disaster_respons", "disaster_response_narrative", "disaster_source_pfa"],
    },
    // Topics drawn from syllabus (Jackson-Cherry & Erford + Hunsinger chapter assignments)
    classTopicMap: {
      1: ["crisis theory", "crisis model", "crisis assessment", "resilience",
          "biopsychosocial", "trauma", "lifespan crisis"],
      2: ["suicide", "suicidal", "risk assessment", "lethality", "safety plan",
          "crisis intervention skills", "self-harm", "lethal means", "self-harm"],
      3: ["domestic violence", "intimate partner violence", "ipv", "sexual violence",
          "sexual assault", "abuse", "partner abuse", "midterm"],
      4: ["disaster", "community crisis", "school crisis", "institutional",
          "pandemic", "natural disaster", "mass trauma", "psychological first aid"],
      5: ["child sexual abuse", "military", "first responder", "child abuse",
          "sexual abuse", "bearing the unbearable", "trauma gospel"],
      6: ["vicarious trauma", "compassion fatigue", "burnout", "self-care",
          "faith", "forgiveness", "cultural", "helper", "secondary trauma"],
      7: ["restoration", "ethics", "grief", "trauma recovery", "bereavement",
          "ethical considerations", "resilience"],
    },
    mostRecentClass: 4, // Class 4 was Mar 5; class 5 is Mar 19
    knownTerms: [
      "ptsd",
      "crisis intervention",
      "psychological first aid",
      "aces",
      "adverse childhood experiences",
      "vicarious trauma",
      "mandated reporter",
      "ipv",
      "domestic violence",
    ],
    sourceWeights: {
      textbook: 1.0,
      reading: 1.1,
      slides: 1.2,
      syllabus: 0.8,
      "video-transcript": 1.3,
    },
    instructorRefPattern:
      /\b(dr\.?\s*mccartney|professor|instructor|he said|she said|quote|lecture|in class|said in|talked about|mentioned|discussed in class)\b/,
    welcomeExamples: [
      "What are the key crisis intervention models?",
      "Quiz me on chapters 1-4 of Jackson-Cherry & Erford",
      "Explain psychological first aid step by step",
      "Walk me through the Nancy case study",
      "Review suicide risk assessment strategies",
    ],
    modes: ["quiz", "explain", "cases", "review", "discuss", "draft"],
  },
};
