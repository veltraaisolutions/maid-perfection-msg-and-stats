import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  MessageSquare,
  Sparkles,
  Crown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Booked Jobs", url: "/jobs", icon: ClipboardList },
  // { title: "Enquiries", url: "/enquiries", icon: Users },
  { title: "Message Logs", url: "/messages", icon: MessageSquare },
  // { title: "Schedule", url: "/schedule", icon: CalendarDays },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center glow-gold-sm">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground tracking-tight">
              Maid To Perfection
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Crown className="h-3 w-3 text-primary" />
              Admin Dashboard
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        w-full h-11 px-3 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20 glow-gold-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      `}
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isActive ? "text-primary" : ""
                          }`}
                        />
                        <span className="font-medium text-sm">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="glass-card rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">KL</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Kayleigh
              </p>
              <p className="text-xs text-muted-foreground">Owner</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
