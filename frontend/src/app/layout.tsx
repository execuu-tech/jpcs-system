import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ParallaxWrapper from "@/src/components/ParallaxWrapper";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "JPCS - CSPC Chapter",
    description: "Junior Philippine Computer Society - Camarines Sur Polytechnic Colleges Chapter",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}>
                <ParallaxWrapper>
                    <Header />
                    <main className="flex-grow">
                        {children}
                        <Toaster position="top-center" reverseOrder={false} />
                    </main>
                    <Footer />
                </ParallaxWrapper>
            </body>
        </html>
    );
}
