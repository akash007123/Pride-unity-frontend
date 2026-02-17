import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Users, 
  Menu,
  ChevronDown,
  Bell,
  Search,
  LayoutDashboard,
  Mail,
  UserPlus,
  Calendar,
  BarChart3,
  Moon,
  Sun,
  Shield,
  Activity,
  Zap,
  HelpCircle,
  Keyboard,
  Maximize2,
  Minimize2,
  CircleUser
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { contactApi } from '@/services/contactApi';
import { volunteerApi } from '@/services/volunteerApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

// Type for admin roles
type AdminRole = 'Admin' | 'Sub Admin' | 'Volunteer' | 'Member';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  color: string;
  disabled?: boolean;
  roles?: AdminRole[];
}

const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
    color: 'from-blue-500 to-cyan-500',
    roles: ['Admin', 'Sub Admin', 'Volunteer', 'Member']
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Shield,
    badge: null,
    color: 'from-red-500 to-orange-500',
    roles: ['Admin']
  },
  {
    title: 'Contacts',
    href: '/admin/contacts',
    icon: Mail,
    badge: 'new',
    color: 'from-purple-500 to-pink-500',
    roles: ['Admin', 'Sub Admin']
  },
  {
    title: 'Community',
    href: '/admin/community',
    icon: Users,
    badge: 'new',
    color: 'from-green-500 to-emerald-500',
    roles: ['Admin', 'Sub Admin']
  },
  {
    title: 'Volunteer',
    href: '/admin/volunteer',
    icon: UserPlus,
    badge: 'new',
    color: 'from-amber-500 to-orange-500',
    roles: ['Admin', 'Sub Admin']
  },
  {
    title: 'Events',
    href: '/admin/events',
    icon: Calendar,
    badge: null,
    color: 'from-red-500 to-rose-500',
    roles: ['Admin', 'Sub Admin', 'Volunteer']
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    badge: null,
    color: 'from-indigo-500 to-purple-500',
    roles: ['Admin']
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
    color: 'from-gray-500 to-slate-500',
    roles: ['Admin']
  },
];

function AdminSidebar() {
  const location = useLocation();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const { open, setOpen, toggleSidebar } = useSidebar();
  
  const { data: stats } = useQuery({
    queryKey: ['contactStats'],
    queryFn: () => contactApi.getStats(),
  });

  const { data: volunteerStats } = useQuery({
    queryKey: ['volunteerStats'],
    queryFn: () => volunteerApi.getStats(),
  });

  const newContactsCount = stats?.data?.byStatus?.new || 0;
  const newVolunteersCount = volunteerStats?.data?.byStatus?.pending || 0;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <Sidebar 
      className="border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-screen sticky top-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarHeader className="border-b border-border/50">
        <motion.div 
          className="flex items-center gap-3 px-4 py-4"
          animate={{ scale: isHovered ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-purple-600 shadow-lg relative overflow-hidden"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <span className="text-lg font-bold text-primary-foreground relative z-10">P</span>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-none bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Pride Admin
            </span>
            <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              v2.0.0
            </span>
          </div>
        </motion.div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems
                .filter((item) => {
                  if (!item.roles) return true;
                  return item.roles.some(role => 
                    (admin?.role || '').toLowerCase() === role.toLowerCase()
                  );
                })
                .map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href));
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            disabled={item.disabled}
                            className={`relative overflow-hidden group ${
                              isActive ? `bg-gradient-to-r ${item.color} text-white` : ''
                            }`}
                          >
                            <Link to={item.disabled ? '#' : item.href} className="flex items-center">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative"
                              >
                                <item.icon className={`h-4 w-4 ${
                                  isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                                }`} />
                              </motion.div>
                              <span className={`flex-1 ${
                                isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                              }`}>
                                {item.title}
                              </span>
                              {item.badge === 'new' && item.href === '/admin/contacts' && newContactsCount > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <SidebarMenuBadge>
                                    <Badge variant="destructive" className="h-5 px-1.5 mb-5 text-[10px] animate-pulse">
                                      {newContactsCount}
                                    </Badge>
                                  </SidebarMenuBadge>
                                </motion.div>
                              )}
                              {item.badge === 'new' && item.href === '/admin/volunteer' && newVolunteersCount > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <SidebarMenuBadge>
                                    <Badge variant="destructive" className="h-5 px-1.5 mb-5 text-[10px] animate-pulse">
                                      {newVolunteersCount}
                                    </Badge>
                                  </SidebarMenuBadge>
                                </motion.div>
                              )}
                              {item.disabled && (
                                <SidebarMenuBadge>
                                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                                    Soon
                                  </Badge>
                                </SidebarMenuBadge>
                              )}
                              {isActive && (
                                <motion.div
                                  className="absolute inset-0 bg-white/20"
                                  initial={{ x: '-100%' }}
                                  animate={{ x: '100%' }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="bg-border/50" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/contacts?status=new" className="flex items-center group">
                    <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span>View New Messages</span>
                    {newContactsCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <Badge variant="destructive" className="animate-pulse">
                          {newContactsCount}
                        </Badge>
                      </motion.div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider">
            Shortcuts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="flex items-center group w-full">
                    <Keyboard className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span>Keyboard Shortcuts</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/help" className="flex items-center group">
                    <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span>Help & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 p-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/20 ring-2 ring-background">
              <AvatarImage src={admin?.profilePic || '/avatars/admin.png'} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                {admin?.name?.charAt(0).toUpperCase() || 'AD'}
              </AvatarFallback>
            </Avatar>
            <motion.div 
              className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{admin?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground truncate mt-1">{admin?.email || 'admin@pride.com'}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{admin?.name || 'Admin User'}</span>
                  <span className="text-xs text-muted-foreground">{admin?.email || 'admin@pride.com'}</span>
                  <Badge variant="outline" className="mt-1 w-fit text-xs">
                    {admin?.role || 'Member'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/profile" className="cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <motion.div 
          className="mt-3 pt-3 border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              System
            </span>
            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-200">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 animate-pulse" />
              Online
            </Badge>
          </div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}

function MobileSidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  
  const { data: stats } = useQuery({
    queryKey: ['contactStats'],
    queryFn: () => contactApi.getStats(),
  });

  const { data: volunteerStats } = useQuery({
    queryKey: ['volunteerStats'],
    queryFn: () => volunteerApi.getStats(),
  });

  const newContactsCount = stats?.data?.byStatus?.new || 0;
  const newVolunteersCount = volunteerStats?.data?.byStatus?.pending || 0;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 relative"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
          {(newContactsCount > 0 || newVolunteersCount > 0) && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive animate-ping" />
          )}
        </Button>
      </motion.div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0">
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full"
          >
            <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-lg font-bold text-white">P</span>
              </motion.div>
              <div>
                <span className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Pride Admin
                </span>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
            
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                />
              </div>
            </div>
            
            <SidebarMenu className="px-2">
              {adminNavItems
                .filter((item) => {
                  if (!item.roles) return true;
                  return item.roles.some(role => 
                    (admin?.role || '').toLowerCase() === role.toLowerCase()
                  );
                })
                .map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href));
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      disabled={item.disabled}
                      className={`w-full ${isActive ? `bg-gradient-to-r ${item.color} text-white` : ''}`}
                    >
                      <Link to={item.disabled ? '#' : item.href} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                          <span>{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.badge === 'new' && item.href === '/admin/contacts' && newContactsCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] animate-pulse">
                              {newContactsCount}
                            </Badge>
                          )}
                          {item.badge === 'new' && item.href === '/admin/volunteer' && newVolunteersCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] animate-pulse">
                              {newVolunteersCount}
                            </Badge>
                          )}
                          {item.disabled && (
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                              Soon
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            
            <motion.div 
              className="absolute bottom-0 left-0 right-0 border-t bg-card p-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={admin?.profilePic} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                    {admin?.name?.charAt(0).toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{admin?.name || 'Admin User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{admin?.email || 'admin@pride.com'}</p>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function AdminLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { open, setOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
      if (e.key === 'f' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block h-full">
        <AdminSidebar />
      </div>
      
      {/* Main content - takes full remaining space */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header - Fixed height */}
        <motion.header 
          className={`flex-none h-14 md:h-16 flex items-center gap-2 md:gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 md:px-6 transition-all duration-200 ${
            isScrolled ? 'shadow-lg' : ''
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <MobileSidebar />
          
          <div className="flex-1 flex items-center justify-end md:justify-between">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:flex relative max-w-md flex-1">
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary/5"
                initial={false}
                animate={{ scale: searchOpen ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts, users... (⌘K)"
                className="w-full pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {/* Sidebar Toggle Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={toggleSidebar}
                    >
                      {open ? <Minimize2 className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{open ? 'Close Sidebar' : 'Open Sidebar'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Mobile-optimized icons row - visible on all screens */}
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle Fullscreen (⌘⇧F)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle Theme</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="relative h-10 w-10">
                      <Bell className="h-5 w-5" />
                      <motion.span 
                        className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        3
                      </motion.span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge variant="outline" className="text-xs">3 new</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-auto">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <DropdownMenuItem className="cursor-pointer py-3 hover:bg-muted/50">
                          <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Mail className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">New contact message</p>
                              <p className="text-xs text-muted-foreground">From: John Doe</p>
                              <p className="text-xs text-muted-foreground">2 minutes ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </motion.div>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/notifications" className="cursor-pointer text-center text-primary">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu - Desktop */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={admin?.profilePic || '/avatars/admin.png'} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                            {admin?.name?.charAt(0).toUpperCase() || 'AD'}
                          </AvatarFallback>
                        </Avatar>
                        <motion.span 
                          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{admin?.name || 'Admin User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {admin?.email || 'admin@pride.com'}
                        </p>
                        <Badge variant="outline" className="mt-1 w-fit text-xs">
                          {admin?.role || 'Member'}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/profile" className="cursor-pointer">
                        <Users className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                      {theme === 'dark' ? (
                        <Sun className="h-4 w-4 mr-2" />
                      ) : (
                        <Moon className="h-4 w-4 mr-2" />
                      )}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content - Takes remaining space with scroll */}
        <main className="flex-1 overflow-auto">
          <motion.div 
            className="min-h-full p-3 sm:p-4 md:p-5 lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </motion.div>
        </main>

        {/* Footer - Fixed height */}
        <motion.footer 
          className="flex-none border-t py-3 px-3 md:px-6 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <p className="text-muted-foreground">
              © 2024 Pride Admin Panel. All rights reserved.
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                Help
              </Link>
              <Badge variant="outline" className="text-[10px] bg-primary/5">
                <Zap className="h-2.5 w-2.5 mr-1" />
                v2.0.0
              </Badge>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-1/2 top-20 w-full max-w-xl -translate-x-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-2 shadow-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Input
                      autoFocus
                      placeholder="Search contacts, users, events..."
                      className="border-0 focus-visible:ring-0 text-lg"
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        New Contact
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}