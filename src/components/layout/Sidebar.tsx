
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  UserRound,
  Users,
  ClipboardList,
  Shield,
  UserCog,
} from "lucide-react";

const MainSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Sales Officers",
      icon: UserRound,
      href: "/sales-officers",
    },
    {
      title: "Leads",
      icon: Users,
      href: "/leads",
    },
    {
      title: "Lead Assignment",
      icon: ClipboardList,
      href: "/lead-assignment",
    },
    {
      title: "User Roles Allocation",
      icon: UserCog,
      href: "/sales-officer-roles",
    },
    {
      title: "Roles & Permissions",
      icon: Shield,
      href: "/roles-permissions",
    },
  ];

  return (
    <Sidebar className="bg-[#1A1F2C] text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={isActive ? "bg-blue-700 text-white" : "text-gray-300 hover:text-white hover:bg-blue-800/50"}
                    >
                      <Link to={item.href} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
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
};

export default MainSidebar;
