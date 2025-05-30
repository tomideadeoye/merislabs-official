import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orion - Personal AI Assistant",
  description: "Your personal AI assistant for productivity and knowledge management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}