import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@adi/database";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";
if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be set to a random value of at least 32 characters.");
}

export const auth = betterAuth({
  appName: "Arabic Digital Institute",
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret,
  baseURL,
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "LEARNER", input: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
  },
  plugins: [expo()],
  trustedOrigins: [
    baseURL,
    "adi://",
    ...(process.env.NODE_ENV === "development" ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"] : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false },
  },
});
