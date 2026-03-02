"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface FlashcardProps {
  front: string;
  back: string;
  source: string;
}

export function Flashcard({ front, back, source }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="my-3">
      <div
        className="relative cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="w-full rounded-lg border-2 border-primary/20 bg-card p-6 shadow-sm"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="text-xs">
                Flashcard
              </Badge>
              <span className="text-xs text-muted-foreground">
                Click to flip
              </span>
            </div>
            <p className="text-lg font-semibold leading-relaxed">{front}</p>
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs">
                {source}
              </Badge>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full rounded-lg border-2 border-green-500/30 bg-green-50 dark:bg-green-950/30 p-6 shadow-sm"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-green-600 text-xs">Answer</Badge>
              <span className="text-xs text-muted-foreground">
                Click to flip back
              </span>
            </div>
            <p className="text-sm leading-relaxed">{back}</p>
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs">
                {source}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
