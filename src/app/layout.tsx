import Navbar from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";
import ScrollbarWrapper from "@/components/scrollbarWrapper";
import { ProfileModal } from "@/components/navbar/profile/profileModal";
import { createClient } from "@/utils/supabase/server";
import FriendsModal from "@/components/navbar/profile/manageFriends/friendsModal";
import LoginDialog from "@/components/login/loginDialog";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Timelineup",
	description: "",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	return (
		<html lang="en" className={`${inter.variable}`}>
			<body className="overflow-hidden">
				<ScrollbarWrapper defer options={{ scrollbars: { autoHide: "move" } }}>
					<Navbar />
					<div className="flex h-screen flex-col pt-24">{children}</div>
				</ScrollbarWrapper>
				{user ? (
					<>
						<ProfileModal />
						<FriendsModal />
					</>
				) : (
					<LoginDialog />
				)}
				<SpeedInsights />
				<Toaster />
			</body>
		</html>
	);
}
