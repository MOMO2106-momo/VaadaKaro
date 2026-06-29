export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPromiseById } from "@/lib/actions/promiseActions";
import PromiseDetailClient from "./PromiseDetailClient";

export default async function PromiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Please log in to view this promise.</div>;
  }

  const promise = await getPromiseById(id);
  if (!promise) notFound();

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1.5rem" }}>
      <Link href="/dashboard/promises" style={{ display: "inline-block", color: "#1e3a8a", marginBottom: "1.5rem", fontWeight: 600, textDecoration: "none" }}>
        ← Back to Promises
      </Link>
      <PromiseDetailClient promise={JSON.parse(JSON.stringify(promise))} />
    </div>
  );
}
