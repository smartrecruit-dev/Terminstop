import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.terminstop.de"),
  title: {
    default: "TerminStop – Automatische SMS-Erinnerungen für Ihren Betrieb",
    template: "%s | TerminStop",
  },
  description:
    "TerminStop ist das digitale Terminbüro für Friseure, Werkstätten, Praxen und Handwerksbetriebe. Automatische SMS-Erinnerungen, Kundenkartei und Kalender – ab €1,30/Tag.",
  keywords: ["SMS Erinnerung", "Terminverwaltung", "Terminbüro", "Ausfälle reduzieren", "Friseur Software", "Handwerk Termine"],
  authors: [{ name: "TerminStop" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.terminstop.de",
    siteName: "TerminStop",
    title: "TerminStop – Automatische SMS-Erinnerungen für Ihren Betrieb",
    description:
      "Kein Hinterhertelefonieren mehr. TerminStop sendet automatisch SMS-Erinnerungen an Ihre Kunden – 24h vor jedem Termin. In 10 Minuten eingerichtet.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TerminStop – Digitales Terminbüro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TerminStop – Automatische SMS-Erinnerungen",
    description: "Kein Hinterhertelefonieren mehr. SMS-Erinnerungen laufen automatisch – ab €1,30/Tag.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
