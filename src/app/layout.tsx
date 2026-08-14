import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const siteUrl = "https://consultores.biodiversidad.cl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Biodiversidad - Plataforma Sustentable',
  url: siteUrl,
  logo: `${siteUrl}/assets/LogotipoBlanco.png`,
  description: 'Conectamos personas con la biodiversidad. Una plataforma sustentable, abierta y humana para el ecosistema verde.',
  sameAs: [
    'https://www.facebook.com/biodiversidad',
    'https://twitter.com/biodiversidad'
  ]
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Biodiversidad - Plataforma Sustentable",
  description: "Conectamos personas con la biodiversidad. Una plataforma sustentable, abierta y humana para el ecosistema verde.",
  openGraph: {
    title: "Biodiversidad - Plataforma Sustentable",
    description: "Conectamos personas con la biodiversidad. Una plataforma sustentable, abierta y humana para el ecosistema verde.",
    url: siteUrl,
    siteName: "Biodiversidad",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: `${siteUrl}/assets/LogotipoBlanco.png`,
        width: 1200,
        height: 630,
        alt: "Biodiversidad - Plataforma Sustentable",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biodiversidad - Plataforma Sustentable",
    description: "Conectamos personas con la biodiversidad. Una plataforma sustentable, abierta y humana para el ecosistema verde.",
    images: [`${siteUrl}/assets/LogotipoBlanco.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
