"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (data.success === false) {
          setError(data.message || "Failed to fetch user");
        } else {
          setUser(data.data);
        }
      } catch {
        setError("Something went wrong while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => (window.location.href = "/signin")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          User Profile
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="text-lg font-medium text-gray-800">{user?.name || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-medium text-gray-800">{user?.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Joined</p>
            <p className="text-lg font-medium text-gray-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
