import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import 'overlayscrollbars/overlayscrollbars.css'

var cn = require("classnames");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Timelineup",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className} style={{ height: "100%" }}>
        <body className={cn("min-h-screen bg-background font-sans antialiased")} style={{ height: "100%" }}>
          <Navbar />
          <div className="pt-24" style={{ height: "100%" }}>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
