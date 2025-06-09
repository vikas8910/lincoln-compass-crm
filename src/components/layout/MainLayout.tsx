import React, { createContext, useContext, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  paddingClassName?: string; // Optional padding prop
}

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: false,
  setIsExpanded: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

const MainLayout = ({
  children,
  paddingClassName = "p-6",
}: MainLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <SidebarProvider>
        <div className="min-h-screen w-full bg-gray-50">
          <div className="flex h-screen">
            {/* Sidebar Container */}
            <div
              className={`bg-[#1A1F2C] transition-all duration-300 ease-in-out flex-shrink-0 ${
                isExpanded ? "w-64" : "w-16"
              }`}
            >
              <MainSidebar />
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              <Header />
              <main
                className={`flex-1 overflow-auto bg-muted/20 ${paddingClassName}`}
              >
                {children}
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </SidebarContext.Provider>
  );
};

export default MainLayout;
