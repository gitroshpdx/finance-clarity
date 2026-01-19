import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import {
  LayoutDashboard,
  FileText,
  PenLine,
  Sparkles,
  LogOut,
  TrendingUp,
  Moon,
  Sun,
  FolderOpen,
  BarChart3,
  Users,
  Rocket,
  Zap,
} from 'lucide-react';
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const mainNavItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'All Reports', url: '/admin/reports', icon: FileText },
  { title: 'Categories', url: '/admin/categories', icon: FolderOpen },
  { title: 'Subscribers', url: '/admin/subscribers', icon: Users },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
];

const baseCreateNavItems = [
  { title: 'Create Report', url: '/admin/reports/new', icon: PenLine },
  { title: 'AI Generate', url: '/admin/reports/ai', icon: Sparkles },
];

const superAdminCreateNavItems = [
  { title: 'Auto-Publish', url: '/admin/auto-publish', icon: Zap },
  { title: 'One-Click', url: '/admin/one-click', icon: Rocket },
];


export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { isSuperAdmin } = useSuperAdmin();

  const isDark = resolvedTheme === 'dark';
  
  // Combine create nav items based on super admin status
  const createNavItems = isSuperAdmin 
    ? [...baseCreateNavItems, ...superAdminCreateNavItems]
    : baseCreateNavItems;

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <div className={`flex items-center gap-3 ${collapsed ? 'hidden' : ''}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">MacroFinance</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
          {collapsed && (
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="flex items-center gap-3 hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Create</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex flex-col gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            onClick={toggleTheme}
            className="w-full justify-start"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="ml-2">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="ml-2">Dark Mode</span>}
              </>
            )}
          </Button>

          <Separator />

          {/* User info */}
          {!collapsed && user && (
            <div className="px-2 py-1">
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}

          {/* Sign out */}
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            onClick={signOut}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
