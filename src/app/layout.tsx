import Navbar from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";
import ScrollbarWrapper from "@/components/scrollbarWrapper";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Timelineup",
	description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable}`}>
			<body className="overflow-hidden">
				<ScrollbarWrapper defer>
					<Navbar />
					<div className="flex h-screen flex-col pt-24">{children}</div>
				</ScrollbarWrapper>
				<SpeedInsights />
				<Toaster />
			</body>
		</html>
	);
}
