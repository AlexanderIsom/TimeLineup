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
import RegisterUsernameModal from "@/components/navbar/profile/registerUsernameModal";
import { getProfile } from "@/utils/utils";

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
	const { profile, user } = await getProfile(supabase);

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
						{!profile.username && <RegisterUsernameModal />}
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
