"use client";

import { CourseProvider, useCourse } from "@/lib/course-context";
import { CourseSelector } from "@/components/course-selector";
import { Chat } from "@/components/chat/chat";

function CourseGateInner() {
  const { courseId } = useCourse();

  if (!courseId) return <CourseSelector />;
  return <Chat />;
}

export function CourseGate() {
  return (
    <CourseProvider>
      <CourseGateInner />
    </CourseProvider>
  );
}
