import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { PermissionsEnum } from "@/lib/constants";
import { useSidebarContext } from "./MainLayout";

const MainSidebar = () => {
  const location = useLocation();
  const { authoritiesList } = useAuthoritiesList();
  const { isExpanded, setIsExpanded } = useSidebarContext();

  const menuItems = [
    ...(authoritiesList.includes(PermissionsEnum.MANAGE_ROLES_VIEW)
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
    ...(authoritiesList.includes(PermissionsEnum.MANAGE_ROLES_VIEW)
      ? [
          {
            title: "Roles & Permissions",
            icon: Shield,
            href: ["/roles", "/permissions"],
          },
        ]
      : []),
    ...(authoritiesList.includes(PermissionsEnum.MANAGE_USERS)
      ? [
          {
            title: "Master Data",
            icon: Database,
            href: ["/master-data"],
          },
        ]
      : []),
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="h-full w-full text-white flex flex-col z-50">
      {/* Toggle Button */}
      <div className="flex justify-end p-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4 text-gray-300" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-300" />
          )}
        </button>
      </div>

      {/* Menu Content */}
      <div className="flex-1 p-3">
        {isExpanded && (
          <div className="text-gray-400 text-sm font-medium mb-4 px-3">
            Main Menu
          </div>
        )}

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = item.href.some(
              (href) =>
                location.pathname === href ||
                (location.pathname.startsWith(href) &&
                  href !== "/dashboard" &&
                  href !== "/leads")
            );

            return (
              <div key={item.title} className="relative group">
                <Link
                  to={item.href[0]}
                  className={`flex items-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-300 hover:text-white hover:bg-blue-800/50"
                  } ${isExpanded ? "p-3 gap-3" : "p-3 justify-center"}`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="truncate font-medium">{item.title}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                      {item.title}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MainSidebar;
