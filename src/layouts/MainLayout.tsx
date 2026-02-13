import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

export const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1"><Outlet /></main>
    <Footer />
    <ScrollToTop />
  </div>
);
