import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: "contemporary-arabic" },
    update: {},
    create: {
      slug: "contemporary-arabic",
      title: "Contemporary Arabic",
      description: "Practical, widely understood Arabic for real-life communication.",
      language: "ar",
      instructionLanguage: "en",
    },
  });

  const level = await prisma.level.upsert({
    where: { courseId_code: { courseId: course.id, code: "PRE_A1" } },
    update: {},
    create: {
      courseId: course.id,
      code: "PRE_A1",
      title: "Your first Arabic words",
      description: "Greetings and simple introductions.",
      position: 0,
    },
  });

  const remainingLevels = [
    { code: "A1", title: "Everyday Arabic", description: "Family, food, time, routines, and places.", position: 1 },
    { code: "A2", title: "Independent communication", description: "Work, travel, health, plans, and messages.", position: 2 },
    { code: "B1", title: "Stories and opinions", description: "Experiences, problems, opinions, and everyday texts.", position: 3 },
    { code: "B2", title: "Confident communication", description: "Discussion, media, current topics, and professional communication.", position: 4 },
    { code: "C1", title: "Advanced Arabic", description: "Academic and professional discourse, reports, and argumentation.", position: 5 },
    { code: "C2", title: "Mastery", description: "Nuance, precision, and advanced communication.", position: 6 },
  ];

  for (const item of remainingLevels) {
    await prisma.level.upsert({
      where: { courseId_code: { courseId: course.id, code: item.code } },
      update: { title: item.title, description: item.description, position: item.position },
      create: { courseId: course.id, ...item },
    });
  }

  await prisma.lesson.upsert({
    where: { levelId_slug: { levelId: level.id, slug: "first-greeting" } },
    update: {
      title: "Say hello",
      summary: "Learn a friendly greeting and respond to someone.",
      objective: "Greet someone and understand a simple reply.",
      durationMin: 7,
      status: "PUBLISHED",
      position: 0,
      content: {
        version: 1,
        language: "ar",
        instructionLanguage: "en",
        sections: [
          {
            id: "dialogue",
            type: "dialogue",
            title: "A first meeting",
            lines: [
              { speaker: "A", arabic: "مرحبا", transliteration: "marhaban", english: "Hello" },
              { speaker: "B", arabic: "أهلا", transliteration: "ahlan", english: "Hi / Welcome" }
            ]
          },
          {
            id: "vocabulary",
            type: "vocabulary",
            title: "Useful words",
            items: [
              { arabic: "مرحبا", transliteration: "marhaban", english: "Hello" },
              { arabic: "أهلا", transliteration: "ahlan", english: "Hi / Welcome" },
              { arabic: "شكرا", transliteration: "shukran", english: "Thank you" }
            ]
          },
          {
            id: "practice-1",
            type: "multiple-choice",
            title: "Check your understanding",
            prompt: "Which Arabic expression means “Hello”?",
            options: [
              { id: "a", label: "شكرا" },
              { id: "b", label: "مرحبا" },
              { id: "c", label: "مع السلامة" }
            ],
            answer: "b",
            explanation: "مرحبا (marhaban) is a common way to say hello."
          }
        ]
      }
    },
    create: {
      levelId: level.id,
      slug: "first-greeting",
      title: "Say hello",
      summary: "Learn a friendly greeting and respond to someone.",
      objective: "Greet someone and understand a simple reply.",
      durationMin: 7,
      status: "PUBLISHED",
      position: 0,
      content: {
        version: 1,
        language: "ar",
        instructionLanguage: "en",
        sections: [
          {
            id: "dialogue",
            type: "dialogue",
            title: "A first meeting",
            lines: [
              { speaker: "A", arabic: "مرحبا", transliteration: "marhaban", english: "Hello" },
              { speaker: "B", arabic: "أهلا", transliteration: "ahlan", english: "Hi / Welcome" }
            ]
          },
          {
            id: "vocabulary",
            type: "vocabulary",
            title: "Useful words",
            items: [
              { arabic: "مرحبا", transliteration: "marhaban", english: "Hello" },
              { arabic: "أهلا", transliteration: "ahlan", english: "Hi / Welcome" },
              { arabic: "شكرا", transliteration: "shukran", english: "Thank you" }
            ]
          },
          {
            id: "practice-1",
            type: "multiple-choice",
            title: "Check your understanding",
            prompt: "Which Arabic expression means “Hello”?",
            options: [
              { id: "a", label: "شكرا" },
              { id: "b", label: "مرحبا" },
              { id: "c", label: "مع السلامة" }
            ],
            answer: "b",
            explanation: "مرحبا (marhaban) is a common way to say hello."
          }
        ]
      }
    }
  });

  await prisma.lesson.upsert({
    where: { levelId_slug: { levelId: level.id, slug: "introduce-yourself" } },
    update: {
      title: "Introduce yourself",
      summary: "Ask someone's name and introduce yourself.",
      objective: "Ask and answer a simple question about names.",
      durationMin: 8,
      status: "PUBLISHED",
      position: 1,
      content: {
        version: 1,
        language: "ar",
        instructionLanguage: "en",
        sections: [
          {
            id: "dialogue",
            type: "dialogue",
            title: "Meeting someone",
            lines: [
              { speaker: "A", arabic: "ما اسمك؟", transliteration: "ma ismuk?", english: "What is your name?" },
              { speaker: "B", arabic: "اسمي سارة", transliteration: "ismi Sarah", english: "My name is Sarah." }
            ]
          },
          {
            id: "vocabulary",
            type: "vocabulary",
            title: "Useful expressions",
            items: [
              { arabic: "اسم", transliteration: "ism", english: "name" },
              { arabic: "ما", transliteration: "ma", english: "what" },
              { arabic: "اسمي", transliteration: "ismi", english: "my name" }
            ]
          },
          {
            id: "practice-name",
            type: "multiple-choice",
            title: "Check your understanding",
            prompt: "How do you say “My name is…”?",
            options: [
              { id: "a", label: "ما اسمك؟" },
              { id: "b", label: "اسمي ..." },
              { id: "c", label: "شكرا" }
            ],
            answer: "b",
            explanation: "اسمي (ismi) means “my name”."
          }
        ]
      }
    },
    create: {
      levelId: level.id,
      slug: "introduce-yourself",
      title: "Introduce yourself",
      summary: "Ask someone's name and introduce yourself.",
      objective: "Ask and answer a simple question about names.",
      durationMin: 8,
      status: "PUBLISHED",
      position: 1,
      content: {
        version: 1,
        language: "ar",
        instructionLanguage: "en",
        sections: [
          {
            id: "dialogue",
            type: "dialogue",
            title: "Meeting someone",
            lines: [
              { speaker: "A", arabic: "ما اسمك؟", transliteration: "ma ismuk?", english: "What is your name?" },
              { speaker: "B", arabic: "اسمي سارة", transliteration: "ismi Sarah", english: "My name is Sarah." }
            ]
          },
          {
            id: "vocabulary",
            type: "vocabulary",
            title: "Useful expressions",
            items: [
              { arabic: "اسم", transliteration: "ism", english: "name" },
              { arabic: "ما", transliteration: "ma", english: "what" },
              { arabic: "اسمي", transliteration: "ismi", english: "my name" }
            ]
          },
          {
            id: "practice-name",
            type: "multiple-choice",
            title: "Check your understanding",
            prompt: "How do you say “My name is…”?",
            options: [
              { id: "a", label: "ما اسمك؟" },
              { id: "b", label: "اسمي ..." },
              { id: "c", label: "شكرا" }
            ],
            answer: "b",
            explanation: "اسمي (ismi) means “my name”."
          }
        ]
      }
    }
  });

  const foundationLessons = [
    {
      slug: "arabic-script-basics",
      title: "How Arabic writing works",
      summary: "Learn the writing direction and recognize your first Arabic letters.",
      objective: "Read from right to left and recognize ا ب ت ث.",
      durationMin: 8,
      position: -2,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "writing-direction", type: "reading", title: "Start from the right", items: [
          { arabic: "العربية", transliteration: "al-arabiyya", english: "Arabic" },
          { arabic: "ا", transliteration: "alif", english: "The letter alif" },
          { arabic: "ب", transliteration: "ba", english: "The letter ba" },
          { arabic: "ت", transliteration: "ta", english: "The letter ta" },
          { arabic: "ث", transliteration: "tha", english: "The letter tha (th as in think)" }
        ]},
        { id: "direction-practice", type: "multiple-choice", title: "Check your understanding", prompt: "In which direction is Arabic normally written?", options: [
          { id: "a", label: "Left to right" }, { id: "b", label: "Right to left" }, { id: "c", label: "Top to bottom" }
        ], answer: "b", explanation: "Arabic text is normally written from right to left." }
      ]}
    },
    {
      slug: "first-arabic-words",
      title: "Read your first Arabic words",
      summary: "Read a few short words using familiar Arabic letters.",
      objective: "Recognize باب, بيت, and بنت without vowel marks.",
      durationMin: 8,
      position: -1,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "first-words", type: "reading", title: "Read these words", items: [
          { arabic: "باب", transliteration: "baab", english: "door" },
          { arabic: "بيت", transliteration: "bayt", english: "house" },
          { arabic: "بنت", transliteration: "bint", english: "girl" }
        ]},
        { id: "word-practice", type: "multiple-choice", title: "Check your reading", prompt: "What does بيت mean?", options: [
          { id: "a", label: "Door" }, { id: "b", label: "House" }, { id: "c", label: "Girl" }
        ], answer: "b", explanation: "بيت (bayt) means house." }
      ]}
    }
  ];

  for (const lessonData of foundationLessons) {
    await prisma.lesson.upsert({
      where: { levelId_slug: { levelId: level.id, slug: lessonData.slug } },
      update: { ...lessonData, status: "PUBLISHED" },
      create: { levelId: level.id, ...lessonData, status: "PUBLISHED" },
    });
  }

  const extraBeginnerLessons = [
    { slug: "where-are-you-from", title: "Where are you from?", summary: "Ask where someone is from and answer simply.", objective: "Ask and answer a question about a country.", durationMin: 7, position: 2,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "dialogue", type: "dialogue", title: "A simple introduction", lines: [
          { speaker: "A", arabic: "من أين أنت؟", transliteration: "min ayna anta?", english: "Where are you from?" },
          { speaker: "B", arabic: "أنا من أمريكا", transliteration: "ana min Amrika", english: "I am from America." }
        ]},
        { id: "vocabulary", type: "vocabulary", title: "Useful words", items: [
          { arabic: "من أين", transliteration: "min ayna", english: "from where" },
          { arabic: "أنا", transliteration: "ana", english: "I" },
          { arabic: "من", transliteration: "min", english: "from" }
        ]},
        { id: "practice-country", type: "multiple-choice", title: "Practice", prompt: "Which phrase means “I am from America”?", options: [
          { id: "a", label: "أنا من أمريكا" }, { id: "b", label: "ما اسمك؟" }, { id: "c", label: "إلى اللقاء" }
        ], answer: "a", explanation: "أنا من أمريكا means “I am from America”." }
      ]}
    },
    { slug: "what-language-do-you-speak", title: "What language do you speak?", summary: "Talk about the languages you speak.", objective: "Ask about a language and name one you speak.", durationMin: 7, position: 3,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "dialogue", type: "dialogue", title: "Talking about language", lines: [
          { speaker: "A", arabic: "ما اللغة التي تتحدثها؟", transliteration: "ma al-lugha allati tatahaddathuha?", english: "What language do you speak?" },
          { speaker: "B", arabic: "أتحدث الإنجليزية", transliteration: "atahadath al-ingliziyya", english: "I speak English." }
        ]},
        { id: "vocabulary", type: "vocabulary", title: "Language words", items: [
          { arabic: "لغة", transliteration: "lugha", english: "language" },
          { arabic: "أتحدث", transliteration: "atahadath", english: "I speak" },
          { arabic: "الإنجليزية", transliteration: "al-ingliziyya", english: "English" }
        ]},
        { id: "practice-language", type: "multiple-choice", title: "Practice", prompt: "How do you say “I speak English”?", options: [
          { id: "a", label: "أنا من أمريكا" }, { id: "b", label: "أتحدث الإنجليزية" }, { id: "c", label: "ما اسمك؟" }
        ], answer: "b", explanation: "أتحدث الإنجليزية means “I speak English”." }
      ]}
    },
    { slug: "numbers-one-to-ten", title: "Numbers one to ten", summary: "Recognize and use the first ten Arabic numbers.", objective: "Identify common Arabic number words from one to ten.", durationMin: 8, position: 4,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "numbers", type: "vocabulary", title: "Count from one to ten", items: [
          { arabic: "واحد", transliteration: "wahid", english: "one" }, { arabic: "اثنان", transliteration: "ithnan", english: "two" },
          { arabic: "ثلاثة", transliteration: "thalatha", english: "three" }, { arabic: "أربعة", transliteration: "arba'a", english: "four" },
          { arabic: "خمسة", transliteration: "khamsa", english: "five" }, { arabic: "ستة", transliteration: "sitta", english: "six" },
          { arabic: "سبعة", transliteration: "sab'a", english: "seven" }, { arabic: "ثمانية", transliteration: "thamaniya", english: "eight" },
          { arabic: "تسعة", transliteration: "tis'a", english: "nine" }, { arabic: "عشرة", transliteration: "ashara", english: "ten" }
        ]},
        { id: "practice-number", type: "multiple-choice", title: "Practice", prompt: "Which word means “five”?", options: [
          { id: "a", label: "ثلاثة" }, { id: "b", label: "خمسة" }, { id: "c", label: "عشرة" }
        ], answer: "b", explanation: "خمسة (khamsa) means five." }
      ]}
    },
    { slug: "my-family", title: "My family", summary: "Name close family members in simple sentences.", objective: "Recognize and name mother, father, and family.", durationMin: 8, position: 5,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "dialogue", type: "dialogue", title: "Talking about family", lines: [
          { speaker: "A", arabic: "من هذا؟", transliteration: "man hadha?", english: "Who is this?" },
          { speaker: "B", arabic: "هذا أبي", transliteration: "hadha abi", english: "This is my father." },
          { speaker: "A", arabic: "ومن هذه؟", transliteration: "wa-man hadhihi?", english: "And who is this?" },
          { speaker: "B", arabic: "هذه أمي", transliteration: "hadhihi ummi", english: "This is my mother." }
        ]},
        { id: "vocabulary", type: "vocabulary", title: "Family words", items: [
          { arabic: "أب", transliteration: "ab", english: "father" }, { arabic: "أم", transliteration: "umm", english: "mother" },
          { arabic: "أخي", transliteration: "akhi", english: "my brother" }, { arabic: "أختي", transliteration: "ukhti", english: "my sister" }
        ]},
        { id: "practice-family", type: "multiple-choice", title: "Practice", prompt: "Which phrase means “my mother”?", options: [
          { id: "a", label: "أبي" }, { id: "b", label: "أخي" }, { id: "c", label: "أمي" }
        ], answer: "c", explanation: "أمي (ummi) means my mother." }
      ]}
    },
    { slug: "at-the-cafe", title: "At the cafe", summary: "Use a polite phrase to ask for water or coffee.", objective: "Make a simple request politely.", durationMin: 8, position: 6,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "dialogue", type: "dialogue", title: "Making a request", lines: [
          { speaker: "A", arabic: "ماذا تريد؟", transliteration: "madha turid?", english: "What would you like?" },
          { speaker: "B", arabic: "أريد ماء من فضلك", transliteration: "urid ma'an min fadlik", english: "I would like water, please." },
          { speaker: "A", arabic: "تفضل", transliteration: "tafaddal", english: "Here you are." }
        ]},
        { id: "vocabulary", type: "vocabulary", title: "Useful words", items: [
          { arabic: "أريد", transliteration: "urid", english: "I would like" }, { arabic: "ماء", transliteration: "ma", english: "water" },
          { arabic: "قهوة", transliteration: "qahwa", english: "coffee" }, { arabic: "من فضلك", transliteration: "min fadlik", english: "please" }
        ]},
        { id: "practice-cafe", type: "multiple-choice", title: "Practice", prompt: "Which phrase politely means “please”?", options: [
          { id: "a", label: "من فضلك" }, { id: "b", label: "من أين" }, { id: "c", label: "أنا" }
        ], answer: "a", explanation: "من فضلك is a polite way to say please." }
      ]}
    },
    { slug: "everyday-expressions", title: "Everyday expressions", summary: "Use thank you, excuse me, and goodbye.", objective: "Choose an appropriate expression in a simple interaction.", durationMin: 7, position: 7,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "dialogue", type: "dialogue", title: "A polite exchange", lines: [
          { speaker: "A", arabic: "شكرا", transliteration: "shukran", english: "Thank you." },
          { speaker: "B", arabic: "عفوا", transliteration: "afwan", english: "You're welcome." },
          { speaker: "A", arabic: "إلى اللقاء", transliteration: "ila al-liqa", english: "Goodbye." }
        ]},
        { id: "vocabulary", type: "vocabulary", title: "Useful expressions", items: [
          { arabic: "شكرا", transliteration: "shukran", english: "thank you" }, { arabic: "عفوا", transliteration: "afwan", english: "you're welcome / excuse me" },
          { arabic: "إلى اللقاء", transliteration: "ila al-liqa", english: "goodbye" }
        ]},
        { id: "practice-expressions", type: "multiple-choice", title: "Practice", prompt: "What do you say to thank someone?", options: [
          { id: "a", label: "عفوا" }, { id: "b", label: "شكرا" }, { id: "c", label: "إلى اللقاء" }
        ], answer: "b", explanation: "شكرا (shukran) means thank you." }
      ]}
    },
    { slug: "where-is-it", title: "Where is it?", summary: "Ask where a place or object is.", objective: "Ask a simple where-question and understand here or there.", durationMin: 7, position: 8,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "dialogue", type: "dialogue", title: "Finding a place", lines: [
          { speaker: "A", arabic: "أين المقهى؟", transliteration: "ayna al-maqha?", english: "Where is the cafe?" },
          { speaker: "B", arabic: "هناك", transliteration: "hunak", english: "Over there." }
        ]},
        { id: "vocabulary", type: "vocabulary", title: "Place words", items: [
          { arabic: "أين", transliteration: "ayna", english: "where" }, { arabic: "هنا", transliteration: "huna", english: "here" },
          { arabic: "هناك", transliteration: "hunak", english: "there" }, { arabic: "المقهى", transliteration: "al-maqha", english: "the cafe" }
        ]},
        { id: "practice-where", type: "multiple-choice", title: "Practice", prompt: "Which word means “where”?", options: [
          { id: "a", label: "هناك" }, { id: "b", label: "أين" }, { id: "c", label: "هنا" }
        ], answer: "b", explanation: "أين (ayna) means where." }
      ]}
    },
    { slug: "pre-a1-review", title: "Your first Arabic review", summary: "Review greetings, names, countries, numbers, and polite expressions.", objective: "Use your first Arabic expressions in a short practical review.", durationMin: 9, position: 9,
      content: { version: 1, language: "ar", instructionLanguage: "en", sections: [
        { id: "review-vocabulary", type: "vocabulary", title: "Remember these expressions", items: [
          { arabic: "مرحبا", transliteration: "marhaban", english: "hello" }, { arabic: "اسمي", transliteration: "ismi", english: "my name" },
          { arabic: "أنا من", transliteration: "ana min", english: "I am from" }, { arabic: "شكرا", transliteration: "shukran", english: "thank you" },
          { arabic: "من فضلك", transliteration: "min fadlik", english: "please" }
        ]},
        { id: "review-1", type: "multiple-choice", title: "Review 1", prompt: "Someone says مرحبا. What does it mean?", options: [
          { id: "a", label: "Hello" }, { id: "b", label: "Thank you" }, { id: "c", label: "Goodbye" }
        ], answer: "a", explanation: "مرحبا is a common greeting." },
        { id: "review-2", type: "multiple-choice", title: "Review 2", prompt: "Which phrase means “My name is…”?", options: [
          { id: "a", label: "أين" }, { id: "b", label: "اسمي" }, { id: "c", label: "ماء" }
        ], answer: "b", explanation: "اسمي introduces your name." }
      ]}
    }
  ];

  for (const lessonData of extraBeginnerLessons) {
    await prisma.lesson.upsert({
      where: { levelId_slug: { levelId: level.id, slug: lessonData.slug } },
      update: { ...lessonData, status: "PUBLISHED" },
      create: { levelId: level.id, ...lessonData, status: "PUBLISHED" },
    });
  }


  // First structured letter-and-sound studio lesson. Upsert keeps this seed safe to rerun.
  await prisma.lesson.upsert({
    where: { levelId_slug: { levelId: level.id, slug: "letter-studio-first-four" } },
    update: {
      title: "Meet your first four Arabic letters",
      summary: "Explore alif, baa, taa, and thaa, compare their connected shapes, and add short vowel marks.",
      objective: "Recognize four Arabic letters, identify their positional forms, read باب, and add fatHa and damma to a letter.",
      durationMin: 12,
      status: "PUBLISHED",
      position: -3,
      content: {
        version: 2,
        language: "ar",
        instructionLanguage: "en",
        learningOutcomes: [
          "Recognize ا ب ت ث by shape and name.",
          "Identify isolated, initial, medial, and final forms of ب ت ث.",
          "Explain that ا does not connect to the following letter.",
          "Recognize ث as the English th sound in think, not this.",
          "Read باب and add selected short-vowel marks."
        ],
        sections: [
          {
            id: "letter-shapes",
            type: "vocabulary",
            title: "Explore the four letters and their shapes",
            items: [
              { arabic: "ا", transliteration: "alif", english: "Alif. It can represent a long aa vowel. It does not connect to the letter that follows it." },
              { arabic: "ب   بـ   ـبـ   ـب", transliteration: "baa", english: "Baa: isolated · beginning · middle · end. One dot below." },
              { arabic: "ت   تـ   ـتـ   ـت", transliteration: "taa", english: "Taa: isolated · beginning · middle · end. Two dots above." },
              { arabic: "ث   ثـ   ـثـ   ـث", transliteration: "thaa", english: "Thaa: isolated · beginning · middle · end. Three dots above." }
            ]
          },
          {
            id: "sound-contrast",
            type: "reading",
            title: "Hear and notice the sounds",
            items: [
              { arabic: "ب", transliteration: "b", english: "Like b in boy. Close your lips, then release the sound." },
              { arabic: "ت", transliteration: "t", english: "Like t in top. Touch the tongue just behind the upper teeth." },
              { arabic: "ث", transliteration: "th", english: "Like th in think. Let the tongue lightly meet the teeth; it is not the sound in this." },
              { arabic: "ا", transliteration: "aa", english: "Often lengthens the open aa vowel, as in the learner-friendly model باب (baab)." }
            ]
          },
          {
            id: "right-to-left",
            type: "multiple-choice",
            title: "Check the writing direction",
            prompt: "When you read an Arabic word, where do you begin?",
            options: [
              { id: "a", label: "At the left" },
              { id: "b", label: "At the right" },
              { id: "c", label: "At the bottom" }
            ],
            answer: "b",
            explanation: "Arabic words are read from right to left."
          },
          {
            id: "letter-b",
            type: "multiple-choice",
            title: "Recognize the letter",
            prompt: "Which letter represents the b sound in boy?",
            options: [
              { id: "a", label: "ت" },
              { id: "b", label: "ب" },
              { id: "c", label: "ث" }
            ],
            answer: "b",
            explanation: "ب is baa. Its single dot is below the main shape."
          },
          {
            id: "letter-th",
            type: "multiple-choice",
            title: "Distinguish taa and thaa",
            prompt: "Which letter has three dots above it and the th sound in think?",
            options: [
              { id: "a", label: "ت" },
              { id: "b", label: "ب" },
              { id: "c", label: "ث" }
            ],
            answer: "c",
            explanation: "ث is thaa. It has three dots above the shape."
          },
          {
            id: "add-fatha",
            type: "text-input",
            title: "You add the vowel mark: fatHa",
            prompt: "Build baa with fatHa. Enter the letter ب, then add fatHa above it. Your answer should be بَ.",
            inputTools: ["ب", "ت", "َ", "ِ", "ُ"],
            answer: "بَ",
            explanation: "FatHa is the short a mark written above the consonant: بَ."
          },
          {
            id: "add-damma",
            type: "text-input",
            title: "You add the vowel mark: damma",
            prompt: "Build taa with damma. Your answer should be تُ.",
            inputTools: ["ب", "ت", "َ", "ِ", "ُ"],
            answer: "تُ",
            explanation: "Damma is the short u mark written above the consonant: تُ."
          },
          {
            id: "read-first-word",
            type: "vocabulary",
            title: "Read your first complete word",
            items: [
              { arabic: "بَاب", transliteration: "baab", english: "door. The long aa is represented by alif." },
              { arabic: "باب", transliteration: "baab", english: "The same word is commonly written without short-vowel marks." }
            ]
          },
          {
            id: "meaning-bab",
            type: "multiple-choice",
            title: "Understand the word",
            prompt: "What does باب mean?",
            options: [
              { id: "a", label: "Door" },
              { id: "b", label: "Book" },
              { id: "c", label: "House" }
            ],
            answer: "a",
            explanation: "باب means door. Read from right to left: ب + ا + ب."
          },
          {
            id: "write-bab",
            type: "text-input",
            title: "Build the word yourself",
            prompt: "Type the three letters of باب in the correct order.",
            inputTools: ["ب", "ا"],
            answer: "باب",
            explanation: "باب is written with baa, alif, then baa, read from right to left."
          }
        ]
      }
    },
    create: {
      levelId: level.id,
      slug: "letter-studio-first-four",
      title: "Meet your first four Arabic letters",
      summary: "Explore alif, baa, taa, and thaa, compare their connected shapes, and add short vowel marks.",
      objective: "Recognize four Arabic letters, identify their positional forms, read باب, and add fatHa and damma to a letter.",
      durationMin: 12,
      status: "PUBLISHED",
      position: -3,
      content: {
        version: 2,
        language: "ar",
        instructionLanguage: "en",
        learningOutcomes: [
          "Recognize ا ب ت ث by shape and name.",
          "Identify isolated, initial, medial, and final forms of ب ت ث.",
          "Explain that ا does not connect to the following letter.",
          "Recognize ث as the English th sound in think, not this.",
          "Read باب and add selected short-vowel marks."
        ],
        sections: [
          {
            id: "letter-shapes",
            type: "vocabulary",
            title: "Explore the four letters and their shapes",
            items: [
              { arabic: "ا", transliteration: "alif", english: "Alif. It can represent a long aa vowel. It does not connect to the letter that follows it." },
              { arabic: "ب   بـ   ـبـ   ـب", transliteration: "baa", english: "Baa: isolated · beginning · middle · end. One dot below." },
              { arabic: "ت   تـ   ـتـ   ـت", transliteration: "taa", english: "Taa: isolated · beginning · middle · end. Two dots above." },
              { arabic: "ث   ثـ   ـثـ   ـث", transliteration: "thaa", english: "Thaa: isolated · beginning · middle · end. Three dots above." }
            ]
          },
          {
            id: "sound-contrast",
            type: "reading",
            title: "Hear and notice the sounds",
            items: [
              { arabic: "ب", transliteration: "b", english: "Like b in boy. Close your lips, then release the sound." },
              { arabic: "ت", transliteration: "t", english: "Like t in top. Touch the tongue just behind the upper teeth." },
              { arabic: "ث", transliteration: "th", english: "Like th in think. Let the tongue lightly meet the teeth; it is not the sound in this." },
              { arabic: "ا", transliteration: "aa", english: "Often lengthens the open aa vowel, as in the learner-friendly model باب (baab)." }
            ]
          },
          {
            id: "right-to-left",
            type: "multiple-choice",
            title: "Check the writing direction",
            prompt: "When you read an Arabic word, where do you begin?",
            options: [{ id: "a", label: "At the left" }, { id: "b", label: "At the right" }, { id: "c", label: "At the bottom" }],
            answer: "b",
            explanation: "Arabic words are read from right to left."
          },
          {
            id: "letter-b",
            type: "multiple-choice",
            title: "Recognize the letter",
            prompt: "Which letter represents the b sound in boy?",
            options: [{ id: "a", label: "ت" }, { id: "b", label: "ب" }, { id: "c", label: "ث" }],
            answer: "b",
            explanation: "ب is baa. Its single dot is below the main shape."
          },
          {
            id: "letter-th",
            type: "multiple-choice",
            title: "Distinguish taa and thaa",
            prompt: "Which letter has three dots above it and the th sound in think?",
            options: [{ id: "a", label: "ت" }, { id: "b", label: "ب" }, { id: "c", label: "ث" }],
            answer: "c",
            explanation: "ث is thaa. It has three dots above the shape."
          },
          {
            id: "add-fatha",
            type: "text-input",
            title: "You add the vowel mark: fatHa",
            prompt: "Build baa with fatHa. Enter the letter ب, then add fatHa above it. Your answer should be بَ.",
            inputTools: ["ب", "ت", "َ", "ِ", "ُ"],
            answer: "بَ",
            explanation: "FatHa is the short a mark written above the consonant: بَ."
          },
          {
            id: "add-damma",
            type: "text-input",
            title: "You add the vowel mark: damma",
            prompt: "Build taa with damma. Your answer should be تُ.",
            inputTools: ["ب", "ت", "َ", "ِ", "ُ"],
            answer: "تُ",
            explanation: "Damma is the short u mark written above the consonant: تُ."
          },
          {
            id: "read-first-word",
            type: "vocabulary",
            title: "Read your first complete word",
            items: [
              { arabic: "بَاب", transliteration: "baab", english: "door. The long aa is represented by alif." },
              { arabic: "باب", transliteration: "baab", english: "The same word is commonly written without short-vowel marks." }
            ]
          },
          {
            id: "meaning-bab",
            type: "multiple-choice",
            title: "Understand the word",
            prompt: "What does باب mean?",
            options: [{ id: "a", label: "Door" }, { id: "b", label: "Book" }, { id: "c", label: "House" }],
            answer: "a",
            explanation: "باب means door. Read from right to left: ب + ا + ب."
          },
          {
            id: "write-bab",
            type: "text-input",
            title: "Build the word yourself",
            prompt: "Type the three letters of باب in the correct order.",
            inputTools: ["ب", "ا"],
            answer: "باب",
            explanation: "باب is written with baa, alif, then baa, read from right to left."
          }
        ]
      }
    }
  });

  console.log("Seeded the contemporary Arabic course, seven proficiency levels, and twelve original Pre-A1 lessons.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
