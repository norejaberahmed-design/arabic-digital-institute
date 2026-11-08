import { PrismaClient, ProficiencyLevel } from "@prisma/client";

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
    where: { courseId_code: { courseId: course.id, code: ProficiencyLevel.PRE_A1 } },
    update: {},
    create: {
      courseId: course.id,
      code: ProficiencyLevel.PRE_A1,
      title: "Your first Arabic words",
      description: "Greetings and simple introductions.",
      position: 0,
    },
  });

  const remainingLevels = [
    { code: ProficiencyLevel.A1, title: "Everyday Arabic", description: "Family, food, time, routines, and places.", position: 1 },
    { code: ProficiencyLevel.A2, title: "Independent communication", description: "Work, travel, health, plans, and messages.", position: 2 },
    { code: ProficiencyLevel.B1, title: "Stories and opinions", description: "Experiences, problems, opinions, and everyday texts.", position: 3 },
    { code: ProficiencyLevel.B2, title: "Confident communication", description: "Discussion, media, current topics, and professional communication.", position: 4 },
    { code: ProficiencyLevel.C1, title: "Advanced Arabic", description: "Academic and professional discourse, reports, and argumentation.", position: 5 },
    { code: ProficiencyLevel.C2, title: "Mastery", description: "Nuance, precision, and advanced communication.", position: 6 },
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

  console.log("Seeded the contemporary Arabic course, seven CEFR-aligned levels, and two Pre-A1 lessons.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
