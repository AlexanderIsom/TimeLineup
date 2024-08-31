import Navbar from "@/components/navbar";
import ScrollbarWrapper from "@/components/scrollbarWrapper";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";


import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";
import { getProfile } from "@/lib/utils";
import RegisterUsernameModal from "@/components/registerUsernameModal";

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
		<ReactQueryClientProvider>
			<html lang="en" className={`${inter.variable}`}>
				<body className="overflow-hidden">
					<div className="grid grid-rows-[auto_1fr] max-h-full h-screen w-screen">
						<Navbar />
						<ScrollbarWrapper defer options={{ scrollbars: { autoHide: "move" } }} className="row-start-2 row-end-3 min-h-0 max-h-full " >
							{children}
						</ScrollbarWrapper>
					</div>
					{user &&
						!profile.username && <RegisterUsernameModal />
					}
					<SpeedInsights />
					<Toaster />
				</body>
			</html>
		</ReactQueryClientProvider>
	);
}
