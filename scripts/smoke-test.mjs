const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(new URL(path, baseUrl), { ...options, signal: AbortSignal.timeout(10000) });
  return response;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await request("/api/health");
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error("Web server did not become healthy within 60 seconds.");
}

function cookieFrom(response) {
  const values = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie") || ""];
  return values.map(value => value.split(";")[0]).filter(Boolean).join("; ");
}

async function signUp(email, name) {
  const response = await request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: baseUrl },
    body: JSON.stringify({ name, email, password: "Test-Password-2026!" }),
  });
  if (!response.ok) throw new Error(`Sign-up failed (${response.status}): ${await response.text()}`);
  const cookie = cookieFrom(response);
  if (!cookie) throw new Error("Sign-up did not issue a session cookie.");
  return cookie;
}

async function main() {
  await waitForServer();

  const health = await request("/api/health");
  const healthBody = await health.json();
  if (healthBody.database !== "connected") throw new Error("Database health check failed.");

  const listResponse = await request("/api/lessons");
  if (!listResponse.ok) throw new Error("Published lesson list is unavailable.");
  const list = await listResponse.json();
  if (!Array.isArray(list.data) || list.data.length < 16) throw new Error("Expected at least sixteen seeded Pre-A1 lessons.");
  const requiredFirstConversationLessons = [
    "first-arabic-welcome",
    "first-arabic-expressions",
    "first-arabic-conversation",
  ];
  const publishedSlugs = new Set(list.data.map(item => item.slug));
  for (const slug of requiredFirstConversationLessons) {
    if (!publishedSlugs.has(slug)) throw new Error(`Missing published first-conversation lesson: ${slug}`);
    const response = await request(`/api/lessons/${slug}`);
    if (!response.ok) throw new Error(`Public lesson endpoint failed for ${slug}.`);
    const lesson = await response.json();
    if (lesson.data.content.sections.some(section => Object.hasOwn(section, "answer"))) {
      throw new Error(`Public lesson API exposed an answer key for ${slug}.`);
    }
  }

  const lessonResponse = await request("/api/lessons/first-greeting");
  if (!lessonResponse.ok) throw new Error("Public lesson endpoint failed.");
  const lesson = await lessonResponse.json();
  if (lesson.data.content.sections.some(section => Object.hasOwn(section, "answer"))) {
    throw new Error("Public lesson API exposed an answer key.");
  }

  const anonymousWrite = await request("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "complete", lessonSlug: "first-greeting" }),
  });
  if (anonymousWrite.status !== 401) throw new Error("Anonymous progress write was not rejected.");

  const cookieOne = await signUp("learner-one@adi-test.com", "Learner One");
  const attemptResponse = await request("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieOne },
    body: JSON.stringify({ action: "attempt", lessonSlug: "first-greeting", activityId: "practice-1", answer: "b" }),
  });
  if (!attemptResponse.ok) throw new Error(`Authenticated quiz attempt failed: ${await attemptResponse.text()}`);
  const attempt = await attemptResponse.json();
  if (attempt.data.isCorrect !== true) throw new Error("Server-side answer validation returned an unexpected result.");

  const firstConversationChecks = [
    { lessonSlug: "first-arabic-welcome", activityId: "welcome-direction-check", answer: "b" },
    { lessonSlug: "first-arabic-expressions", activityId: "expressions-question-check", answer: "a" },
    { lessonSlug: "first-arabic-conversation", activityId: "conversation-order", answer: "a" },
  ];
  for (const check of firstConversationChecks) {
    const response = await request("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieOne },
      body: JSON.stringify({ action: "attempt", ...check }),
    });
    if (!response.ok) throw new Error(`First-conversation attempt failed for ${check.lessonSlug}: ${await response.text()}`);
    const result = await response.json();
    if (result.data.isCorrect !== true) throw new Error(`First-conversation answer check failed for ${check.lessonSlug}.`);
  }

  const completeResponse = await request("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieOne },
    body: JSON.stringify({ action: "complete", lessonSlug: "first-greeting" }),
  });
  if (!completeResponse.ok) throw new Error("Authenticated lesson completion failed.");

  const progressResponse = await request("/api/progress", { headers: { Cookie: cookieOne } });
  const progress = await progressResponse.json();
  if (!progressResponse.ok || !progress.data.some(item => item.lesson.slug === "first-greeting" && item.completed)) {
    throw new Error("Learner progress was not persisted.");
  }

  const cookieTwo = await signUp("learner-two@adi-test.com", "Learner Two");
  const isolatedResponse = await request("/api/progress", { headers: { Cookie: cookieTwo } });
  const isolated = await isolatedResponse.json();
  if (!isolatedResponse.ok || isolated.data.length !== 0) throw new Error("Learner data isolation check failed.");

  const adminResponse = await request("/api/admin/lessons", { headers: { Cookie: cookieOne } });
  if (adminResponse.status !== 403) throw new Error("Learner account unexpectedly accessed admin API.");

  const deleteResponse = await request("/api/account", { method: "DELETE", headers: { Cookie: cookieTwo } });
  if (!deleteResponse.ok) throw new Error("Authenticated account deletion failed.");
  const afterDelete = await request("/api/progress", { headers: { Cookie: cookieTwo } });
  if (afterDelete.status !== 401) throw new Error("Deleted account session remained active.");

  console.log("PASS: health, 16+ lessons, first-conversation lesson delivery and answer-key privacy, authentication, quiz attempts, progress persistence, tenant isolation, admin authorization, and account deletion.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
