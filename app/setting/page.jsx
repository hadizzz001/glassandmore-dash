"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((res) => setUsername(res.user.username))
      .catch(() => router.push("/login"));
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();

    await fetch("/api/auth/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: pw }),
    });

    alert("updated!");
  }

  return (
    <form onSubmit={handleUpdate} className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl mb-4 font-bold">Update Login Info</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full mb-3"
        placeholder="New username"
      />

      <input
        type="password"
        onChange={(e) => setPw(e.target.value)}
        className="border p-2 w-full mb-3"
        placeholder="New password"
      />

      <button className="bg-blue-600 text-white p-2 w-full">Save</button>
    </form>
  );
}
