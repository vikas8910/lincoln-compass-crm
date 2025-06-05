import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // Use sonner toast consistently
import {
  FiBell,
  FiSearch,
  FiSettings,
  FiUser,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "@/services/auth/auth";

const Header = () => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const userType = localStorage.getItem("user_type") || "guest";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
    // In a real app, this would trigger a search
  };

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

      {/* <form onSubmit={handleSearch} className="hidden sm:flex items-center max-w-md w-full relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          type="search" 
          placeholder="Search leads, contacts, companies..."
          className="pl-10 bg-secondary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form> */}

      <div className="flex items-center gap-3">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <FiBell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* <Button variant="ghost" size="icon">
          <FiSettings className="h-5 w-5" />
        </Button> */}

        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild> */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleLogout}
          >
            <FiLogOut className="h-5 w-5" />
          </Button>
          {/* </DropdownMenuTrigger> */}
          <DropdownMenuContent align="end">
            {/* <div className="px-3 py-2">
              <p className="text-sm font-medium">User Account</p>
              <p className="text-xs text-muted-foreground">
                {userType.charAt(0).toUpperCase() + userType.slice(1)} Role
              </p>
            </div> */}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
