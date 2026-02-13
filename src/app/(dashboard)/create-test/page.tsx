"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateTestPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/v2");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-corePurple border-t-transparent mx-auto" />
        <p className="text-sm text-zinc-600">Redirecting to test creation...</p>
      </div>
    </div>
  );
}
