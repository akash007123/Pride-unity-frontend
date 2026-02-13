import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  FileText,
  BarChart3,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { contactApi } from '@/services/contactApi';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Contacts',
    href: '/admin/contacts',
    icon: Mail,
    badge: 'new',
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    badge: null,
    disabled: true,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    badge: null,
    disabled: true,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
    disabled: true,
  },
];

function AdminSidebar() {
  const location = useLocation();
  const { data: stats } = useQuery({
    queryKey: ['contactStats'],
    queryFn: () => contactApi.getStats(),
  });

  const newContactsCount = stats?.data?.byStatus?.new || 0;

  return (
    <Sidebar className="border-r bg-card">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-none">Pride Admin</span>
            <span className="text-xs text-muted-foreground mt-1">v2.0.0</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href || 
                      (item.href !== '/admin' && location.pathname.startsWith(item.href))}
                    disabled={item.disabled}
                    className="relative"
                  >
                    <Link to={item.disabled ? '#' : item.href} className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge === 'new' && newContactsCount > 0 && (
                        <SidebarMenuBadge>
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                            {newContactsCount}
                          </Badge>
                        </SidebarMenuBadge>
                      )}
                      {item.disabled && (
                        <SidebarMenuBadge>
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                            Soon
                          </Badge>
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/contacts?status=new">
                    <Mail className="h-4 w-4" />
                    <span>View New Messages</span>
                    {newContactsCount > 0 && (
                      <SidebarMenuBadge>
                        <span className="text-xs font-medium">{newContactsCount}</span>
                      </SidebarMenuBadge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src="/avatars/admin.png" />
            <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs text-muted-foreground truncate mt-1">admin@pride.com</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/profile" className="cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function MobileSidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { data: stats } = useQuery({
    queryKey: ['contactStats'],
    queryFn: () => contactApi.getStats(),
  });

  const newContactsCount = stats?.data?.byStatus?.new || 0;

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-10 w-10"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex items-center gap-2 p-4 border-b">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <div>
              <span className="text-lg font-semibold">Pride Admin</span>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 bg-muted/50"
              />
            </div>
          </div>
          
          <SidebarMenu className="px-2">
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.href || 
                    (item.href !== '/admin' && location.pathname.startsWith(item.href))}
                  disabled={item.disabled}
                  className="w-full"
                >
                  <Link to={item.disabled ? '#' : item.href} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge === 'new' && newContactsCount > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                        {newContactsCount}
                      </Badge>
                    )}
                    {item.disabled && (
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                        Soon
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <div className="absolute bottom-0 left-0 right-0 border-t bg-card p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@pride.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function AdminLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 transition-all duration-200 ${
          isScrolled ? 'shadow-sm' : ''
        }`}>
          <MobileSidebar />
          
          <div className="flex-1 flex items-center justify-end md:justify-between">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:flex relative max-w-md flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts, users..."
                className="w-full pl-8 bg-muted/50 focus-visible:bg-background"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-auto">
                    {[1, 2, 3].map((i) => (
                      <DropdownMenuItem key={i} className="cursor-pointer py-3">
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
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatars/admin.png" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          admin@pride.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/profile" className="cursor-pointer">
                        <Users className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/" className="cursor-pointer text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-4 px-4 md:px-6 bg-card">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-muted-foreground">
              © 2024 Pride Admin Panel. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Badge variant="outline" className="text-[10px]">
                v2.0.0
              </Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}