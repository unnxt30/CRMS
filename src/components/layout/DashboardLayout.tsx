
import { ReactNode } from "react";
import { Header } from "./Header";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarLinks: any[];
  title?: string;
}

export function DashboardLayout({ children, sidebarLinks, title }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex">
        <DashboardSidebar links={sidebarLinks} title={title} />
        <main className="flex-grow p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
