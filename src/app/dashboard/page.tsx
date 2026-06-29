export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getRoleDashboardPath } from "@/lib/permissions";

export default async function DashboardRedirect() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as any).role;
  const targetDashboard = getRoleDashboardPath(role);
  
  redirect(targetDashboard);
}

