import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
	const { supabase, response } = createClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.startsWith("/auth")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
