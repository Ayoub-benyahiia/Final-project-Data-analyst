import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/modules/dashboard/components/Sidebar";
import { FilterBar } from "@/modules/dashboard/components/FilterBar";
import { cn } from "@/lib/utils";

function DashboardContent() {
  const { collapsed } = useSidebar();

  return (
    <div className="relative flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f3f1] text-[#242424] font-mono selection:bg-[#cfdaf5] selection:text-[#2b59d1]">
      {/* Main content area */}
      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col transition-all duration-200 min-w-0 w-full max-w-full overflow-x-hidden",
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <FilterBar />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-8 sm:space-y-12 max-w-[1432px] w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}

