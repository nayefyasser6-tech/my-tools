import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { LanguageProvider } from "../components/LanguageProvider";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "أدوات | PDF مجانية بالعربي وصور",
  description: "صانع سيرة ذاتية بالعربي، إزالة خلفية الصور، تحويل Word و PDF، دمج وضغط وتوقيع PDF.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}