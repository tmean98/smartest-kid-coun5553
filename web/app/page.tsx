import { PasscodeGate } from "@/components/passcode-gate";
import { CourseGate } from "@/components/course-gate";

export default function Home() {
  return (
    <PasscodeGate>
      <CourseGate />
    </PasscodeGate>
  );
}
