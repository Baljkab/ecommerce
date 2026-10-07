import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import FlyToCartLayer from "@/components/FlyToCartLayer";

export const metadata: Metadata = {
  title: "TechStore | Цахим дэлгүүр",
  description: "Технологийн бүтээгдэхүүний цахим дэлгүүр.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <AdminRouteGuard>{children}</AdminRouteGuard>
          <Footer />
          <FlyToCartLayer />
        </CartProvider>
      </body>
    </html>
  );
}
