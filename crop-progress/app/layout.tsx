import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "Crop Sync",
  description: "Modern farm intelligence for the next generation of African agriculture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${nunito.variable} h-full antialiased`}
        data-theme="dark"
      >
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    
  );
}
