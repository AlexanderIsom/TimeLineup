import { NextRequest, NextResponse, userAgent } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl;
	const { device } = userAgent(request);
	const viewport = device.type === "mobile" ? "mobile" : "desktop";
	url.searchParams.set("viewport", viewport);

	const { supabase, response } = createClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.startsWith("/auth")) {
		const url = request.nextUrl;
		url.searchParams.set("dialog", "login");
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
