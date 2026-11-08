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
  if (!Array.isArray(list.data) || list.data.length < 2) throw new Error("Expected at least two seeded Pre-A1 lessons.");

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

  const cookieOne = await signUp("learner-one@example.test", "Learner One");
  const attemptResponse = await request("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieOne },
    body: JSON.stringify({ action: "attempt", lessonSlug: "first-greeting", activityId: "practice-1", answer: "b" }),
  });
  if (!attemptResponse.ok) throw new Error(`Authenticated quiz attempt failed: ${await attemptResponse.text()}`);
  const attempt = await attemptResponse.json();
  if (attempt.data.isCorrect !== true) throw new Error("Server-side answer validation returned an unexpected result.");

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

  const cookieTwo = await signUp("learner-two@example.test", "Learner Two");
  const isolatedResponse = await request("/api/progress", { headers: { Cookie: cookieTwo } });
  const isolated = await isolatedResponse.json();
  if (!isolatedResponse.ok || isolated.data.length !== 0) throw new Error("Learner data isolation check failed.");

  const adminResponse = await request("/api/admin/lessons", { headers: { Cookie: cookieOne } });
  if (adminResponse.status !== 403) throw new Error("Learner account unexpectedly accessed admin API.");

  console.log("PASS: health, public lessons, answer-key privacy, auth, quiz attempts, progress persistence, tenant isolation, and admin authorization.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
