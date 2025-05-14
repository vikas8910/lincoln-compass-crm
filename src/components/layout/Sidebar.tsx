
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
  FiLayout,
  FiUsers,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiSettings,
  FiBarChart2,
  FiFolder,
  FiGitBranch
} from "react-icons/fi";

const MainSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: FiLayout,
      href: "/dashboard",
    },
    {
      title: "Sales Officers",
      icon: FiUser,
      href: "/sales-officers",
    },
    {
      title: "Leads",
      icon: FiUsers,
      href: "/leads",
    },
    {
      title: "Lead Pipeline",
      icon: FiGitBranch,
      href: "/lead-pipeline",
    },
    {
      title: "Companies",
      icon: FiBriefcase,
      href: "/companies",
    },
    {
      title: "Calendar",
      icon: FiCalendar,
      href: "/calendar",
    },
    {
      title: "Documents",
      icon: FiFolder,
      href: "/documents",
    },
    {
      title: "Reports",
      icon: FiBarChart2,
      href: "/reports",
    },
    {
      title: "Settings",
      icon: FiSettings,
      href: "/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.href}>
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
