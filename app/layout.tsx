import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Serenity | Seu tempo. Seus sentidos. Sua experiência.";
const description =
  "Experiências corporais, conteúdo editorial adulto responsável e plataforma digital exclusiva da Serenity.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "serenity-terapias.openai.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title,
    description,
    icons: {
      icon: "/assets/serenity-logo-white.png",
      shortcut: "/assets/serenity-logo-white.png",
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "Serenity Terapias Holísticas",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1024,
          height: 1024,
          alt: "Marca original Serenity Terapias Holísticas.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
