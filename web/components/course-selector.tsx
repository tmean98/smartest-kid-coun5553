"use client";

import { Card, CardContent } from "@/components/ui/card";
import { COURSES, type CourseId } from "@/lib/courses";
import { useCourse } from "@/lib/course-context";

const COURSE_ORDER: CourseId[] = ["coun5553", "coun5773", "coun5453", "coun5173"];

export function CourseSelector() {
  const { setCourseId } = useCourse();

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-12">
      <img
        src="/avatar.jpg"
        alt="Smartest Kid"
        className="size-20 rounded-full object-cover mb-4"
      />
      <h1 className="text-3xl font-bold tracking-tight mb-1">Smartest Kid</h1>
      <p className="text-muted-foreground text-xs italic mb-2">
        Your AI study partner who actually did the reading
      </p>
      <p className="text-muted-foreground text-sm mb-8">Choose your course</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {COURSE_ORDER.map((id) => {
          const course = COURSES[id];
          return (
            <Card
              key={id}
              className="cursor-pointer transition-all border-primary/20 hover:border-primary/50 hover:shadow-md"
              onClick={() => setCourseId(id)}
            >
              <CardContent className="p-5">
                <p className="text-xs font-mono text-muted-foreground mb-1">
                  {course.code}
                </p>
                <p className="text-sm font-semibold leading-snug mb-2">
                  {course.shortTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.instructor}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
