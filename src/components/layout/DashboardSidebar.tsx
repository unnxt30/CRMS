
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
}

function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 p-2 rounded-md",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-secondary transition-colors duration-200"
        )
      }
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

interface DashboardSidebarProps {
  links: {
    to: string;
    icon: ReactNode;
    label: string;
    roles?: UserRole[];
  }[];
  title?: string;
}

export function DashboardSidebar({ links, title = "Dashboard" }: DashboardSidebarProps) {
  const { user } = useAuth();
  
  const filteredLinks = links.filter(link => 
    !link.roles || !user?.role || link.roles.includes(user.role)
  );
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-5">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      
      <div className="px-3 py-2 space-y-1">
        {filteredLinks.map((link) => (
          <SidebarLink 
            key={link.to} 
            to={link.to} 
            icon={link.icon} 
            label={link.label} 
          />
        ))}
      </div>
    </aside>
  );
}
