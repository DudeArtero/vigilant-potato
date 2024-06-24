import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Landing from "./landing/landing";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Vigilant Potato",
    description: "There is a meme for everything, and if not, you will create it.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Landing inter={inter}>{children}</Landing>
    );
}
