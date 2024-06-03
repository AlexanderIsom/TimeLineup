"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const signOut = async () => {
	"use server";
	const supabase = createClient();
	await supabase.auth.signOut();
	revalidatePath("/", "layout");
	return redirect("/");
};
