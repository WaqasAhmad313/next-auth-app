"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);

  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) setUser(JSON.parse(userParam));
  }, [searchParams]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
    </div>
  );
}
