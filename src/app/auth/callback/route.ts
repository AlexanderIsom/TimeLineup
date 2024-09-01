import { getCurrentProfile } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = createClient();
		await supabase.auth.exchangeCodeForSession(code);
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard/events";
		const { profile } = await getCurrentProfile();
		if (profile?.username === null) {
			url.searchParams.set("dialog", "register");
		}
		return NextResponse.redirect(url);
	}

	// URL to redirect to after sign up process completes
	return NextResponse.redirect(new URL(next, request.url));
}
