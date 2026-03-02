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
      1: {
        date: "2026-01-15",
        videoDatePrefixes: ["Jan_15_2026", "Jan 15 2026"],
      },
      2: {
        date: "2026-01-22",
        videoDatePrefixes: ["Jan_22_2026", "Jan 22 2026"],
      },
      3: {
        date: "2026-01-29",
        videoDatePrefixes: ["Jan_29_2026", "Jan 29 2026"],
      },
      4: {
        date: "2026-02-12",
        videoDatePrefixes: ["Feb_12_2026", "Feb 12 2026"],
      },
      5: {
        date: "2026-02-19",
        videoDatePrefixes: ["Feb_19_2026", "Feb 19 2026"],
      },
    },
    classSlideMap: {
      1: ["ethics_class_1", "class_1"],
      2: ["class_2"],
      3: ["class_3"],
      4: ["class_4"],
      5: ["class_5", "evidence_based", "washington_state_reporting", "volk"],
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
    classSlideMap: {},
    mostRecentClass: 4,
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
      1: { date: "2026-01-09" },
      2: { date: "2026-01-13" },
      3: { date: "2026-01-27" },
      4: { date: "2026-02-10" },
      5: { date: "2026-02-24" },
      6: { date: "2026-03-10" },
      7: { date: "2026-03-24" },
      8: { date: "2026-04-07" },
    },
    classSlideMap: {},
    mostRecentClass: 4,
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
      1: { date: "2026-01-08" },
      2: { date: "2026-02-05" },
      3: { date: "2026-02-26" },
      4: { date: "2026-03-05" },
      5: { date: "2026-03-19" },
      6: { date: "2026-04-02" },
      7: { date: "2026-04-09" },
    },
    classSlideMap: {},
    mostRecentClass: 2,
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
