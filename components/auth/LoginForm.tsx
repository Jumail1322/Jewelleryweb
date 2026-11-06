"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

/** Email → one-time code login used by /account and the checkout. */
export function LoginForm({ onDone }: { onDone?: () => void }) {
  const { requestOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (step === "email") {
    return (
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          run(async () => {
            await requestOtp(email.trim());
            setStep("otp");
          });
        }}
      >
        <label className="field">
          <span className="form__label">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button-solid" disabled={busy}>
          {busy ? "Sending code…" : "Send login code"}
        </button>
      </form>
    );
  }

  return (
    <form
      className="auth-form"
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          await verifyOtp(email.trim(), otp.trim());
          onDone?.();
        });
      }}
    >
      <p className="sma-body-text">
        We sent a code to <strong>{email}</strong>.
      </p>
      <label className="field">
        <span className="form__label">Login code</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="button-solid" disabled={busy}>
        {busy ? "Checking…" : "Log in"}
      </button>
      <button
        type="button"
        className="link-button"
        onClick={() => {
          setStep("email");
          setOtp("");
          setError(null);
        }}
      >
        Use a different email
      </button>
    </form>
  );
}
