import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "../session";

export async function updateSession(request: NextRequest) {
	// Create an unmodified response
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	const { profile, user } = await getCurrentProfile(false);

	if (!user) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth/sign-in";
		return NextResponse.redirect(url);
	}

	if (user && profile!.username == null && !request.nextUrl.searchParams.has("dialog", "register")) {
		const url = request.nextUrl.clone();
		url.searchParams.set("dialog", "register");
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
