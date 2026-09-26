"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE_NAME } from "@/middleware";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function verifyAccessCode(formData: FormData) {
  const submitted = (formData.get("code") ?? "").toString().trim();
  const expected = (process.env.SITE_ACCESS_CODE ?? "").trim();

  if (!expected || submitted !== expected) {
    redirect("/access?error=1");
  }

  cookies().set(ACCESS_COOKIE_NAME, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_IN_SECONDS,
  });

  redirect("/");
}