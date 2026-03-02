"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export function MarinersDecor() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || theme !== "light") return null;

  return (
    <div className="pointer-events-none select-none" aria-hidden>
      {/* Julio — bottom-left, leaning in (+15%) */}
      <div className="fixed bottom-0 left-0 z-0 hidden md:block">
        <Image
          src="/Julio.png"
          alt=""
          width={253}
          height={391}
          className="object-contain object-bottom drop-shadow-xl"
          style={{ transform: "rotate(-4deg) translateX(-18px)" }}
        />
      </div>

      {/* Cal — right side, vertically centered, large, peeking in from edge */}
      <div className="fixed right-0 z-0 hidden lg:block" style={{ top: "50%", transform: "translateY(-50%) rotate(3deg) translateX(40px)" }}>
        <Image
          src="/cal.png"
          alt=""
          width={360}
          height={560}
          className="object-contain drop-shadow-xl"
        />
      </div>

      {/* Josh Naylor — bottom-right, big energy */}
      <div className="fixed bottom-0 right-0 z-0 hidden lg:block">
        <Image
          src="/Josh naylor.png"
          alt=""
          width={200}
          height={310}
          className="object-contain object-bottom drop-shadow-xl"
          style={{ transform: "rotate(-3deg) translateX(10px)" }}
        />
      </div>
    </div>
  );
}
