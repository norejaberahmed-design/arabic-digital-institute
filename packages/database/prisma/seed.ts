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

  console.log("Seeded course, Pre-A1 level, and first published lesson.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
