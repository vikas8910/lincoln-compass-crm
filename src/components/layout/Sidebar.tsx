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
import { LayoutDashboard, Users, Shield, UserCog } from "lucide-react";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { PermissionsEnum } from "@/lib/constants";

const MainSidebar = () => {
  const location = useLocation();
  const { authoritiesList } = useAuthoritiesList();

  const menuItems = [
    ...(authoritiesList.includes(PermissionsEnum.MANAGE_ROLES)
      ? [
          {
            title: "Dashboard",
            icon: LayoutDashboard,
            href: ["/dashboard"],
          },
        ]
      : []),
    {
      title: "Leads",
      icon: Users,
      href: ["/leads", "/leads-details"],
    },
    ...(authoritiesList.includes(PermissionsEnum.MANAGE_USERS)
      ? [
          {
            title: "User Management",
            icon: UserCog,
            href: ["/sales-officer-roles"],
          },
        ]
      : []),
    ...(authoritiesList.includes(PermissionsEnum.MANAGE_ROLES)
      ? [
          {
            title: "Roles & Permissions",
            icon: Shield,
            href: ["/roles", "/permissions"],
          },
        ]
      : []),
  ];

  return (
    <Sidebar className="bg-[#1A1F2C] text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Fix the highlighting logic to correctly handle the leads-mapping route
                const isActive = item.href.some(
                  (href) =>
                    location.pathname === href ||
                    (location.pathname.startsWith(href) &&
                      href !== "/dashboard" &&
                      href !== "/leads")
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-gray-300 hover:text-white hover:bg-blue-800/50"
                      }
                    >
                      <Link
                        to={item.href[0]}
                        className="flex items-center gap-2"
                      >
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
