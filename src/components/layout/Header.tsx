import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { FiLogOut } from "react-icons/fi";
import { logout } from "@/services/auth/auth";
import { useUser } from "@/context/UserProvider";
import { getAvatarColors } from "@/lib/utils";

const Header = () => {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const userEmail = user?.email;
  const userName = user?.name;
  const userInitial = userName.charAt(0).toUpperCase();

  const { bg, text } = getAvatarColors(userInitial);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  return (
    <header className="border-b border-border h-16 px-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <h1 className="font-bold text-xl text-primary">Lincoln CRM</h1>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-10">
              <div
                className={`${bg} ${text} h-10 w-10 rounded-lg flex items-center justify-center font-semibold text-sm shrink-0`}
              >
                {userInitial}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 shadow-md">
            <div className="flex items-center gap-3 p-3">
              <div
                className={`${bg} ${text} h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0`}
              >
                {userInitial}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
