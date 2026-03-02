"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const THEMES = ["light", "dark", "badboyz"] as const;

function nextTheme(current: string | undefined) {
  const idx = THEMES.indexOf(current as typeof THEMES[number]);
  return THEMES[(idx + 1) % THEMES.length];
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (theme === "badboyz") {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setTheme(nextTheme(theme))}
        aria-label="Toggle theme"
        title="Bad Boyz 4 Life Mode"
      >
        🤙
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(nextTheme(theme))}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
