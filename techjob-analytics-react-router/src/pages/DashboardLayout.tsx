import { Outlet } from "react-router-dom";
import { Sidebar } from "@/modules/dashboard/components/Sidebar";
import { FilterBar } from "@/modules/dashboard/components/FilterBar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#F4F5F8] dark:bg-[#0E0F12]">
      <Sidebar />
      <div className="ml-60 flex flex-1 flex-col transition-all duration-200 min-w-0">
        <FilterBar />
        <main className="flex-1 p-4 md:p-5 space-y-4 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
