import { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

export const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <ScrollToTop />
  </div>
);
