import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true, // allows it to be passed in on creation
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    // requireEmailVerification: true,
    // minPasswordLength:
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
});
