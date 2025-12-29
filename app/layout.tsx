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

// --- METADATA CONFIGURATION ---
export const metadata: Metadata = {
  // REPLACE with your actual domain when deployed
  metadataBase: new URL("https://crm-studioflow.vercel.app"),

  title: {
    default: "StudioFlow - All-in-One Studio Management Software",
    template: "%s | StudioFlow"
  },
  description:
    "The ultimate Freelance OS for UI/UX designers. Streamline your business with our CRM, Proposal Builder, Client Portal, and Invoicing tools. Manage your creative studio from lead to payment.",

  keywords: [
    // Core Product Keywords
    "studio management software",
    "freelance os",
    "client portal for designers",
    "proposal builder",
    "invoice generator",
    "freelance crm",

    // Feature-Specific
    "kanban board for freelancers",
    "figma integration client portal",
    "automated freelance invoices",
    "web design proposal templates",

    // Audience Targeted
    "software for ui ux designers",
    "tools for freelance developers",
    "creative agency software",
    "solo founder tools",

    // Problem Solving
    "manage freelance clients",
    "track project payments",
    "streamline design workflow",
    "professional client onboarding",

    // Tech Stack Context
    "nextjs dashboard",
    "react admin template",
    "studioflow"
  ].join(", "),

  authors: [{ name: "Abdullah Mukadam", url: "https://github.com/AbdullahMukadam" }],
  creator: "Abdullah Mukadam",
  publisher: "StudioFlow",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },

  // manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crm-studioflow.vercel.app",
    title: "StudioFlow - Manage Your Creative Business",
    description: "Stop juggling tools. Manage leads, proposals, projects, and payments in one beautiful dashboard.",
    siteName: "StudioFlow",
    images: [
      {
        url: "/og-image.png", // You need to create this image in /public
        width: 1200,
        height: 630,
        alt: "StudioFlow Dashboard Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "StudioFlow - The Freelance OS",
    description: "The all-in-one platform for designers and developers to win clients and get paid.",
    images: ["/og-image.png"],
    creator: "@abd_mukadam", // Add your handle
  },

  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "StudioFlow",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "description": "All-in-one studio management software for freelancers.",
              "author": {
                "@type": "Person",
                "name": "Abdullah Mukadam",
              },
            }),
          }}
        />
      </head>
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