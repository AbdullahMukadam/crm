import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CommonLayout from "@/common-layout/common-layout";
import { ThemeProvider } from "@/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brcolageGrotesque = Bricolage_Grotesque({
  variable: "--font-brcolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio Flow",
  description: "All in One Project Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brcolageGrotesque.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CommonLayout>{children}</CommonLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
