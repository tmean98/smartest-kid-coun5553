"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CourseId } from "./courses";

interface CourseContextValue {
  courseId: CourseId | null;
  setCourseId: (id: CourseId | null) => void;
}

const CourseContext = createContext<CourseContextValue>({
  courseId: null,
  setCourseId: () => {},
});

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 90}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0`;
}

const VALID_IDS = new Set(["coun5553", "coun5773", "coun5453", "coun5173"]);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courseId, setCourseIdState] = useState<CourseId | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = getCookie("sk-course");
    if (stored && VALID_IDS.has(stored)) {
      setCourseIdState(stored as CourseId);
    }
    setLoaded(true);
  }, []);

  const setCourseId = (id: CourseId | null) => {
    setCourseIdState(id);
    if (id) {
      setCookie("sk-course", id);
    } else {
      deleteCookie("sk-course");
    }
  };

  if (!loaded) return null;

  return (
    <CourseContext.Provider value={{ courseId, setCourseId }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  return useContext(CourseContext);
}
