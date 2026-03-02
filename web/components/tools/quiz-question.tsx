"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correct_answer: string;
  explanation: string;
  source: string;
  onAnswer?: (answer: string, correct: boolean) => void;
  disabled?: boolean;
}

export function QuizQuestion({
  question,
  type,
  options,
  correct_answer,
  explanation,
  source,
  onAnswer,
  disabled = false,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [shortAnswer, setShortAnswer] = useState("");
  const [nextSent, setNextSent] = useState(false);

  const handleSelect = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    // Don't auto-send — wait for "Next Question" button
  };

  const handleShortAnswerSubmit = () => {
    if (revealed) return;
    setRevealed(true);
    // Don't auto-send — wait for "Next Question" button
  };

  const isCorrect = (option: string) => {
    // For MC: check if option starts with correct letter or matches
    const correctLetter = correct_answer.trim().toUpperCase().charAt(0);
    const optionLetter = option.trim().toUpperCase().charAt(0);

    // Check by index
    if (options) {
      const correctIndex = correctLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
      const optionIndex = options.indexOf(option);
      if (optionIndex === correctIndex) return true;
    }

    return option.toLowerCase() === correct_answer.toLowerCase();
  };

  const handleNext = () => {
    if (nextSent || !onAnswer) return;
    setNextSent(true);
    if (type === "short_answer") {
      onAnswer(shortAnswer, false); // let AI evaluate short answers
    } else {
      onAnswer(selected ?? "", selected ? isCorrect(selected) : false);
    }
  };

  const typeLabel =
    type === "multiple_choice"
      ? "Multiple Choice"
      : type === "true_false"
      ? "True / False"
      : "Short Answer";

  return (
    <Card className="my-3 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {typeLabel}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {source}
          </Badge>
        </div>
        <p className="mt-2 text-sm font-medium leading-relaxed">{question}</p>
      </CardHeader>
      <CardContent className="pb-3">
        {(type === "multiple_choice" || type === "true_false") && options && (
          <div className="flex flex-col gap-2">
            {options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              const wasSelected = selected === option;
              const correct = isCorrect(option);

              let variant: "outline" | "default" | "destructive" = "outline";
              let className = "justify-start text-left h-auto py-2 px-3 whitespace-normal";

              if (revealed) {
                if (correct) {
                  className += " border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100";
                } else if (wasSelected && !correct) {
                  className += " border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100";
                } else {
                  className += " opacity-50";
                }
              } else {
                className += " hover:bg-primary/5 cursor-pointer";
              }

              return (
                <Button
                  key={i}
                  variant={variant}
                  className={className}
                  onClick={() => handleSelect(option)}
                  disabled={revealed || disabled}
                >
                  <span className="font-semibold mr-2">{letter}.</span>
                  {option}
                </Button>
              );
            })}
          </div>
        )}
        {type === "short_answer" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              placeholder={disabled ? "Waiting for response..." : "Type your answer..."}
              disabled={revealed || disabled}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !disabled) handleShortAnswerSubmit();
              }}
            />
            {!revealed && (
              <Button onClick={handleShortAnswerSubmit} size="sm" disabled={disabled}>
                Check
              </Button>
            )}
          </div>
        )}
      </CardContent>
      {revealed && (
        <CardFooter className="flex-col items-start gap-2 border-t pt-3">
          <div className="flex items-center gap-2">
            {selected && isCorrect(selected) ? (
              <Badge className="bg-green-600">Correct!</Badge>
            ) : type === "short_answer" ? (
              <Badge variant="secondary">Answer</Badge>
            ) : (
              <Badge variant="destructive">Incorrect</Badge>
            )}
            <span className="text-sm font-medium">
              Correct answer: {correct_answer}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
          {onAnswer && (
            <Button
              size="sm"
              className="mt-1 self-end"
              onClick={handleNext}
              disabled={nextSent}
            >
              {nextSent ? "Loading..." : "Next Question →"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
