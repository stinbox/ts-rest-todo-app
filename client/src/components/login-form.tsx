import { useState } from "react";
import { authClient } from "../lib/auth-client";

export const LoginForm: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await authClient.emailOtp.sendVerificationOtp({
      type: "sign-in",
      email,
    });
    if (result.data?.success) {
      setStep("otp");
    } else {
      alert(`Failed to send OTP: ${result.error?.message}`);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const otpInput = form.elements.namedItem("otp") as HTMLInputElement;
    const otp = otpInput.value;
    await authClient.signIn.emailOtp({ email, otp });
  };

  return (
    <div className="h-dvh w-dvw flex flex-col justify-center items-center gap-8 p-4">
      <h1 className="text-2xl font-bold text-center">
        {step === "email" ? "Sign In with Email" : "Enter OTP"}
      </h1>
      {step === "email" ? (
        <form
          onSubmit={handleEmailSubmit}
          className="w-full max-w-md flex items-center join"
        >
          <label className="floating-label join-item input">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </label>
          <button className="btn btn-primary join-item" type="submit">
            Send OTP
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleOtpSubmit}
          className="w-full max-w-md flex items-center join"
        >
          <label className="floating-label join-item input">
            <input
              name="otp"
              placeholder="One-Time Password"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <span>One-Time Password</span>
          </label>
          <button className="btn btn-primary join-item" type="submit">
            Send OTP
          </button>
        </form>
      )}
    </div>
  );
};
