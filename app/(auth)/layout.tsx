import type { ReactNode } from "react";
import AuthExperience from "@/components/AuthExperience";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthExperience>{children}</AuthExperience>;
}
