"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopicBreakdown {
  topic: string;
  correct: number;
  total: number;
}

interface QuizSessionEndProps {
  total_questions: number;
  correct: number;
  score_percent: number;
  topic_breakdown: TopicBreakdown[];
  strong_areas: string[];
  weak_areas: string[];
  recommendation: string;
}

function getScoreColor(percent: number): string {
  if (percent >= 80) return "text-green-600 dark:text-green-400";
  if (percent >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getPassFail(percent: number): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (percent >= 80) return { label: "Pass", variant: "default" };
  if (percent >= 60) return { label: "Borderline", variant: "secondary" };
  return { label: "Needs Work", variant: "destructive" };
}

export function QuizSessionEnd({
  total_questions,
  correct,
  score_percent,
  topic_breakdown,
  strong_areas,
  weak_areas,
  recommendation,
}: QuizSessionEndProps) {
  const { label, variant } = getPassFail(score_percent);
  const scoreColor = getScoreColor(score_percent);

  return (
    <Card className="my-3 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Session Complete
          </Badge>
          <Badge variant={variant} className="text-xs">
            {label}
          </Badge>
        </div>
        <div className={`mt-2 text-3xl font-bold tabular-nums ${scoreColor}`}>
          {correct} / {total_questions}
          <span className="ml-2 text-xl font-semibold">
            — {Math.round(score_percent)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {topic_breakdown.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              By Topic
            </p>
            <table className="w-full text-sm">
              <tbody>
                {topic_breakdown.map((row, i) => {
                  const topicPct = row.total > 0 ? (row.correct / row.total) * 100 : 0;
                  const rowColor =
                    topicPct >= 80
                      ? "text-green-600 dark:text-green-400"
                      : topicPct >= 60
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400";
                  return (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-1.5 pr-4">{row.topic}</td>
                      <td className={`py-1.5 text-right font-medium ${rowColor}`}>
                        {row.correct}/{row.total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {strong_areas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">
              Strong Areas
            </p>
            <ul className="text-sm space-y-0.5">
              {strong_areas.map((area, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {weak_areas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">
              Needs Work
            </p>
            <ul className="text-sm space-y-0.5">
              {weak_areas.map((area, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-red-500">&#9888;</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendation && (
          <div className="border-t border-border pt-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Recommendation
            </p>
            <p className="text-sm leading-relaxed">{recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
