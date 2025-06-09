import { LeadsProvider } from "@/context/LeadsProvider";
import { Outlet } from "react-router-dom";

export const LeadsLayout = () => {
  return (
    <LeadsProvider initialStatusId="1">
      <Outlet />
    </LeadsProvider>
  );
};
