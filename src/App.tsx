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
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleRoute from "@/components/auth/RoleRoute";
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
import AdminCommunity from "./pages/AdminCommunity";
import AdminVolunteers from "./pages/AdminVolunteers";
import AdminEvents from "./pages/AdminEvents";
import AdminEventRegistrations from "./pages/AdminEventRegistrations";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminUsers from "./pages/AdminUsers";
import AdminAllUsers from "./pages/AdminAllUsers";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";

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
        <AuthProvider>
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

              {/* Admin auth routes (public) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />

              {/* Admin routes with authentication */}
              <Route
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <AdminLayout />
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" index element={<AdminDashboard />} />
                <Route path="admin/contacts" element={<RoleRoute allowedRoles={['Admin', 'Sub Admin']}><AdminContacts /></RoleRoute>} />
                <Route path="admin/community" element={<RoleRoute allowedRoles={['Admin', 'Sub Admin']}><AdminCommunity /></RoleRoute>} />
                <Route path="admin/volunteer" element={<RoleRoute allowedRoles={['Admin', 'Sub Admin']}><AdminVolunteers /></RoleRoute>} />
                <Route path="admin/events" element={<RoleRoute allowedRoles={['Admin', 'Sub Admin', 'Volunteer']}><AdminEvents /></RoleRoute>} />
                <Route path="admin/events/:id/registrations" element={<RoleRoute allowedRoles={['Admin', 'Sub Admin', 'Volunteer']}><AdminEventRegistrations /></RoleRoute>} />
                <Route path="admin/users" element={<RoleRoute allowedRoles={['Admin']}><AdminUsers /></RoleRoute>} />
                <Route path="admin/all-users" element={<RoleRoute allowedRoles={['Admin']}><AdminAllUsers /></RoleRoute>} />
                <Route path="admin/reports" element={<RoleRoute allowedRoles={['Admin']}><AdminReports /></RoleRoute>} />
                <Route path="admin/settings" element={<RoleRoute allowedRoles={['Admin']}><AdminSettings /></RoleRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
