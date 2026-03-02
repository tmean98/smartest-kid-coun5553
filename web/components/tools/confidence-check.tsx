"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ConfidenceCheckProps {
  topics: Array<{ name: string; description: string }>;
  onSubmit?: (ratings: Record<string, string>) => void;
}

const LEVELS = [
  { value: "strong", label: "Strong", color: "bg-green-600" },
  { value: "okay", label: "Okay", color: "bg-yellow-500" },
  { value: "shaky", label: "Shaky", color: "bg-red-500" },
] as const;

export function ConfidenceCheck({ topics, onSubmit }: ConfidenceCheckProps) {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (topic: string, level: string) => {
    if (submitted) return;
    setRatings((prev) => ({ ...prev, [topic]: level }));
  };

  const allRated = topics.every((t) => ratings[t.name]);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.(ratings);
  };

  return (
    <Card className="my-3 border-blue-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-700 dark:text-blue-400">
            Confidence Check
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Rate your confidence on each topic so we can focus on your weak areas.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.map((topic) => (
          <div
            key={topic.name}
            className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border p-3"
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{topic.name}</p>
              <p className="text-xs text-muted-foreground">{topic.description}</p>
            </div>
            <div className="flex gap-1.5">
              {LEVELS.map((level) => {
                const isSelected = ratings[topic.name] === level.value;
                return (
                  <Button
                    key={level.value}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className={`text-xs px-3 ${
                      isSelected
                        ? `${level.color} text-white hover:opacity-90`
                        : ""
                    }`}
                    onClick={() => handleRate(topic.name, level.value)}
                    disabled={submitted}
                  >
                    {level.label}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={!allRated}
            className="w-full mt-2"
          >
            {allRated ? "Start Review" : "Rate all topics to continue"}
          </Button>
        )}

        {submitted && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Your ratings:</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => {
                const level = LEVELS.find((l) => l.value === ratings[t.name]);
                return (
                  <Badge
                    key={t.name}
                    className={`${level?.color || ""} text-white`}
                  >
                    {t.name}: {level?.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
