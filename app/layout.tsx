import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "TechStore | Цахим дэлгүүр",
  description: "Технологийн бүтээгдэхүүний цахим дэлгүүр.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn">
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
