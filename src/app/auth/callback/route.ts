import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const otpType = request.nextUrl.searchParams.get("type");
  const requestedNext = request.nextUrl.searchParams.get("next");
  const fallbackPath =
    requestedNext === "/mon-espace/nouveau-mot-de-passe"
      ? requestedNext
      : "/mon-espace";
  let nextUrl = new URL(fallbackPath, request.url);

  if (requestedNext?.startsWith("/") && !requestedNext.startsWith("//")) {
    const candidateUrl = new URL(requestedNext, request.url);
    if (candidateUrl.origin === request.nextUrl.origin) {
      nextUrl = candidateUrl;
    }
  }

  if (tokenHash && otpType === "email") {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });

    if (!error) {
      return NextResponse.redirect(nextUrl);
    }
  } else if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(nextUrl);
    }
  }

  return NextResponse.redirect(
    new URL("/mon-espace?confirmation=error", request.url),
  );
}