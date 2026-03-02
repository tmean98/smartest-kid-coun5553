"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function hasCookie(name: string): boolean {
  return document.cookie.split(";").some((c) => c.trim().startsWith(name + "="));
}

export function PasscodeGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthed(hasCookie("sk-auth"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        setAuthed(true);
      } else {
        setError("Wrong passcode");
        setPasscode("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Still checking cookie
  if (authed === null) return null;

  if (authed) return <>{children}</>;

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <img
          src="/avatar.jpg"
          alt="Smartest Kid"
          className="size-16 rounded-full object-cover"
        />
        <h1 className="text-xl font-bold tracking-tight">Smartest Kid</h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter the passcode to continue
        </p>

        <Input
          type="password"
          placeholder="Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          autoFocus
        />

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading || !passcode}>
          {loading ? "Checking..." : "Enter"}
        </Button>
      </form>
    </div>
  );
}
