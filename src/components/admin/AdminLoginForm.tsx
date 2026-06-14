"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { sanitizeAdminRedirect } from "@/lib/utils";
import Image from "next/image";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = sanitizeAdminRedirect(searchParams.get("from"));

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password. Please try again.");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white-600 shadow-lg shadow-red-900/40">
           <Image
               src="/flamze-logo.png"
               alt=""
              //  width={40}
              //  height={40}
               className="h-10 w-10 shrink-0 rounded shadow-lg shadow-red-950/40 transition-transform duration-300 group-hover:scale-105"
               priority
             />         
          </div>
          <h1 className="text-2xl font-bold text-white">FLAMEZ Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to manage your restaurant</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4"
        >
          <Input
            id="password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
