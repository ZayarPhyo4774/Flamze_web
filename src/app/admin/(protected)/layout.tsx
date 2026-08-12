import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
