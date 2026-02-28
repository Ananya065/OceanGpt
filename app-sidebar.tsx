import { 
  Home, 
  MessageSquare, 
  Map as MapIcon, 
  Activity, 
  Database,
  Waves
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "OceanGPT Chat", url: "/chat", icon: MessageSquare },
  { title: "Global Map", url: "/map", icon: MapIcon },
  { title: "Digital Twin", url: "/simulator", icon: Activity },
  { title: "Data Proofs", url: "/blockchain", icon: Database },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-border/50 glass">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2 mt-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Waves className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-gradient">OceanGPT</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 uppercase tracking-wider font-semibold text-xs mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        transition-all duration-200 py-5 rounded-xl
                        ${isActive 
                          ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
