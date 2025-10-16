import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzleClient } from "./db/client.ts";
import { emailOTP } from "better-auth/plugins";
import * as schema from "./db/schema.ts";

export const auth = betterAuth({
  database: drizzleAdapter(drizzleClient, { provider: "sqlite", schema }),
  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: { enabled: false },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        switch (type) {
          case "sign-in":
            console.log(`Send sign-in OTP ${otp} to email ${email}.`);
            break;
          case "email-verification":
            console.log(
              `Send email verification OTP ${otp} to email ${email}.`,
            );
            break;
          case "forget-password":
            console.log(`Send forget password OTP ${otp} to email ${email}.`);
            break;
          default:
            throw new Error(`Invalid OTP type: ${type satisfies never}`);
        }
      },
    }),
  ],
});
