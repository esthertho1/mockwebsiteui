"use client";

import { redirect } from "next/navigation";
import { useParams } from "next/navigation";

export default function TestSettingsPage() {
  const params = useParams<{ testId: string }>();
  const testId = params?.testId ?? "";
  redirect(`/tests/${testId}`);
}
