import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000"
});

export const { signIn, signUp, useSession } = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(), // <-- pass your server auth type
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true, // allows it to be passed in on creation
      },
    },
  },
});
export const signInWithGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};
