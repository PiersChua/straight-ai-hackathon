import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { emailOTP } from "better-auth/plugins/email-otp";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    // minPasswordLength:
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true, // allows it to be passed in on creation
      },
      phoneNumber: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // seconds
      async sendVerificationOTP({ email, otp, type }) {
        if (type == "sign-in") {
        } else if (type == "email-verification") {
          await resend.emails.send({
            from: "Aptly<onboarding@resend.dev>",
            to: email,
            subject: "Verify your Aptly account",
            html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
              <h2>Verify your account</h2>
              <p>Your verification code:</p>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</p>
              <p style="color: #666;">This code expires in 5 minutes.</p>
            </div>
          `,
          });
        } else if (type == "forget-password") {
          await resend.emails.send({
            from: "Aptly<onboarding@resend.dev>",
            to: email,
            subject: "Change your Aptly account password",
            html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
              <h2>Verify your account</h2>
              <p>Your verification code:</p>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</p>
              <p style="color: #666;">This code expires in 5 minutes.</p>
            </div>
          `,
          });
        } else {
          // OTP for change email
        }
      },
      rateLimit: {
        max: 1,
        window: 60,
      },
    }),
  ],
});
