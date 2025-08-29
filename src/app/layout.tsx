import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./lib/SessionWrapper";
import { Inter } from "next/font/google";
import MaintenanceProvider from "../components/maintenance/MaintenanceProvider";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intranet Police Judiciaire FRRP",
  description: "Site PJ pour FRRP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${inter.className} ${geistSans.variable} ${geistMono.variable}`}
        >
          <ClientLayout>{children}</ClientLayout>
          <MaintenanceProvider />
        </body>
      </html>
    </SessionWrapper>
  );
}
