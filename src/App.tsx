import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/hooks/useTheme";
import { PageLoader } from "@/components/PageLoader";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import About from "./pages/About";
import MyStory from "./pages/MyStory";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import EventDetail from "./pages/EventDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AccessibilityPage from "./pages/Accessibility";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContacts from "./pages/AdminContacts";

const queryClient = new QueryClient();

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <PageLoader />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes with MainLayout (includes header, navbar, footer) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/my-story" element={<PageWrapper><MyStory /></PageWrapper>} />
              <Route path="/resources" element={<PageWrapper><Resources /></PageWrapper>} />
              <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
              <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
              <Route path="/events/:id" element={<PageWrapper><EventDetail /></PageWrapper>} />
              <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
              <Route path="/blog/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />
              <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
              <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
              <Route path="/accessibility" element={<PageWrapper><AccessibilityPage /></PageWrapper>} />
              <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Route>
            
            {/* Admin routes with clean AdminLayout (no header, navbar, footer) */}
            <Route path="/admin" element={
              <SidebarProvider>
                <AdminLayout />
              </SidebarProvider>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
