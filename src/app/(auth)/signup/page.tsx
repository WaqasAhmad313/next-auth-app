"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        setError(data.message || "Failed to sign up");
      } else {
        setStep("otp");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Server error");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        setOtpError(data.message || "Invalid OTP");
      } else {
        router.push("/signin");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setOtpError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side – Form or OTP */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1B3C53] px-8 py-16">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md border border-gray-200">
          {step === "signup" ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-6 text-[#1B3C53]">
                Create Account
              </h1>
              {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#456882] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#456882] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#456882] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#456882] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#456882] text-white py-2 rounded-lg font-semibold hover:bg-[#1B3C53] transition-colors duration-300"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-4 text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="text-[#456882] hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-3 text-[#1B3C53]">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-600 text-center mb-5">
                We sent a 6-digit OTP to <span className="font-medium">{email}</span>.
              </p>

              {otpError && (
                <p className="text-red-600 mb-2 text-center">{otpError}</p>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-[#456882] focus:outline-none tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#456882] text-white py-2 rounded-lg font-semibold hover:bg-[#1B3C53] transition-colors duration-300"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right side – Branding / message */}
      <div className="hidden md:flex w-1/2 bg-[#f8f8f8] text-black flex-col justify-center items-center px-12">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Our Platform</h1>
        <p className="text-lg max-w-md text-center leading-relaxed opacity-90">
          Join a growing community of creators and developers.  
          Create your account and start exploring endless possibilities.
        </p>
      </div>
    </div>
  );
}
