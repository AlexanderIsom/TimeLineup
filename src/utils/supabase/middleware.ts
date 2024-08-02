import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getProfile } from "../utils";

export async function createClient(request: NextRequest) {
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

	const { profile, user } = await getProfile(supabase);

	if (!request.nextUrl.pathname.startsWith("/auth")) {
		if (request.nextUrl.pathname !== "/" && !user) {
			const url = new URL("/", request.nextUrl);
			url.searchParams.set("modal", "login");
			return NextResponse.redirect(url);
		}

		if (user && profile.username == null && !request.nextUrl.searchParams.has("modal", "register")) {
			const url = new URL("/", request.nextUrl);
			url.searchParams.set("modal", "register");
			return NextResponse.redirect(url);
		}
	}

	return supabaseResponse;
}
