import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealInit from "@/components/RevealInit";

export const viewport: Viewport = {
  themeColor: "#00694A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "MSZRME — Run your dealership by the numbers",
    template: "MSZRME — %s",
  },
  description:
    "MSZRME is the performance platform for HVAC dealers. Turn two minutes of daily logging into live KPIs, real profit, and coaching that moves you to the next stage. Start a free trial, no credit card required.",
  openGraph: {
    type: "website",
    siteName: "MSZRME",
    title: "MSZRME — Run your dealership by the numbers",
    description:
      "Live KPIs, real profit, and coaching for HVAC dealers. Two minutes of daily logging, one clear path to the next stage.",
    // TODO: add `images: ['/og.png']` (1200x630) and `url` once hosted.
  },
  twitter: {
    card: "summary_large_image",
    title: "MSZRME — Run your dealership by the numbers",
    description: "Live KPIs, real profit, and coaching for HVAC dealers.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <RevealInit />
      </body>
    </html>
  );
}
