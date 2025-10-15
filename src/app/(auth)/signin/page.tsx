"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );

      const userData = {
        id: session?.user?.id,
        name: session?.user?.name,
        email: session?.user?.email,
      };

      router.push(
        `/dashboard?user=${encodeURIComponent(JSON.stringify(userData))}`
      );
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - text/branding */}
      <div className="hidden md:flex w-1/2 bg-[#D2C1B6] text-[#1B3C53] flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-extrabold mb-4">Welcome Back</h1>
        <p className="text-lg max-w-md text-center leading-relaxed">
          Sign in to continue your journey. Manage your projects, stay connected, 
          and keep growing with us.
        </p>
      </div>

      {/* Right side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1B3C53]">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#1B3C53]">
            Sign In
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-[#1B3C53]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#1B3C53]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/reset-password"
                className="text-sm text-[#456882] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#456882] text-white font-semibold py-2 rounded-lg hover:bg-[#1B3C53] transition-colors duration-300"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FcGoogle className="text-xl mr-2" />
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#456882] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
