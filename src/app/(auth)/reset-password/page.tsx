"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("OTP sent to your email. Please check your inbox.");
        setStep("verify");
      } else {
        setError(data.message || "Failed to send OTP. Try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => (window.location.href = "/signin"), 2500);
      } else {
        setError(data.message || "Invalid OTP or failed to reset password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#F8F8F8] px-8 py-16">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#1B3C53]">
            Reset Password
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
              {message}
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#456882] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#456882] text-white py-2 rounded-lg font-semibold hover:bg-[#1B3C53] transition-colors duration-300"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP + New Password */}
          {step === "verify" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#456882] focus:outline-none text-center tracking-widest"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#456882] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#456882] text-white py-2 rounded-lg font-semibold hover:bg-[#1B3C53] transition-colors duration-300"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-gray-500 hover:text-gray-700 text-sm"
              >
                Back
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-gray-600 text-sm">
            Remember your password?{" "}
            <Link href="/signin" className="text-[#456882] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - info panel */}
      <div className="hidden md:flex w-1/2 bg-[#1B3C53] text-white flex-col justify-center items-center px-12">
        <h1 className="text-4xl font-extrabold mb-4">Forgot Your Password? 🔒</h1>
        <p className="text-lg max-w-md text-center leading-relaxed opacity-90">
          Don’t worry! Enter your registered email and we’ll send you a secure OTP
          to help you reset your password quickly and safely.
        </p>
      </div>
    </div>
  );
}
