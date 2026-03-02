"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Topic {
  name: string;
  question_count: number;
}

interface QuizSessionStartProps {
  title: string;
  instructions_summary: string;
  total_questions: number;
  topics: Topic[];
  question_types: string;
}

export function QuizSessionStart({
  title,
  instructions_summary,
  total_questions,
  topics,
  question_types,
}: QuizSessionStartProps) {
  return (
    <Card className="my-3 border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground text-xs">
            Test Brief
          </Badge>
          <Badge variant="outline" className="text-xs">
            {total_questions} Questions
          </Badge>
        </div>
        <p className="mt-2 text-sm font-semibold leading-snug">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {instructions_summary}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <table className="w-full text-sm mb-3">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Topic
              </th>
              <th className="text-right py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Questions
              </th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-1.5 pr-4">{topic.name}</td>
                <td className="py-1.5 text-right font-medium">
                  {topic.question_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">Format:</span>
          <span>{question_types}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-700 dark:text-green-400">
            Ready — let&apos;s go
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
