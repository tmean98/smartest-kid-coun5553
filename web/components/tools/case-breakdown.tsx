"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CaseBreakdownProps {
  case_name: string;
  year: string;
  facts: string;
  legal_question: string;
  ruling: string;
  precedent: string;
  impact: string;
  source: string;
}

function Section({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b last:border-b-0">
      <button
        className="flex w-full items-center justify-between py-2 text-sm font-semibold hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="pb-3 text-sm text-muted-foreground leading-relaxed">
          {children}
        </p>
      )}
    </div>
  );
}

export function CaseBreakdown({
  case_name,
  year,
  facts,
  legal_question,
  ruling,
  precedent,
  impact,
  source,
}: CaseBreakdownProps) {
  return (
    <Card className="my-3 border-amber-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-700 dark:text-amber-400">
            Case Law
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {year}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {source}
          </Badge>
        </div>
        <h3 className="mt-1 text-lg font-bold">{case_name}</h3>
      </CardHeader>
      <CardContent>
        <Section label="Facts" defaultOpen>
          {facts}
        </Section>
        <Section label="Legal Question" defaultOpen>
          {legal_question}
        </Section>
        <Section label="Ruling" defaultOpen>
          {ruling}
        </Section>
        <Section label="Precedent Established">
          {precedent}
        </Section>
        <Section label="Impact on Counseling Practice">
          {impact}
        </Section>
      </CardContent>
    </Card>
  );
}
