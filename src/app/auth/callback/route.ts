import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = createClient();
		await supabase.auth.exchangeCodeForSession(code);
	}

	// URL to redirect to after sign up process completes
	return NextResponse.redirect(new URL(next, request.url));
}
