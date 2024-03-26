import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/navbar";
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
        <div style={{ height: "100%" }} className="pt-24">{children}</div>
      </body>
    </html>
  );
}
