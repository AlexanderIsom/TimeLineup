import type { Metadata } from "next";
import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import 'overlayscrollbars/overlayscrollbars.css'

var cn = require("classnames");

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Timelineup",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`} style={{ height: "100%" }}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")} style={{ height: "100%" }}>
        <Navbar />
        <div className="pt-24" style={{ height: "100%" }}>{children}</div>
      </body>
    </html>
  );
}
