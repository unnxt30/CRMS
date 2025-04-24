
import {
  BarChart,
  Users,
  Truck,
  Map,
  FileText,
  Calendar,
  Settings,
  Home,
  Clock,
  User,
  Bell,
} from "lucide-react";

export const supervisorLinks = [
  {
    to: "/supervisor/dashboard",
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
  },
  {
    to: "/supervisor/requests",
    icon: <FileText className="h-5 w-5" />,
    label: "Repair Requests",
  },
  {
    to: "/supervisor/schedule",
    icon: <Calendar className="h-5 w-5" />,
    label: "Scheduling",
  },
  {
    to: "/supervisor/workorders",
    icon: <Clock className="h-5 w-5" />,
    label: "Work Orders",
  },
  {
    to: "/profile",
    icon: <User className="h-5 w-5" />,
    label: "My Profile",
  },
  {
    to: "/notifications",
    icon: <Bell className="h-5 w-5" />,
    label: "Notifications",
  },
];

export const adminLinks = [
  {
    to: "/admin/dashboard",
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
  },
  {
    to: "/admin/resources",
    icon: <Truck className="h-5 w-5" />,
    label: "Resources",
  },
  {
    to: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    label: "User Management",
  },
  {
    to: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
    label: "System Settings",
  },
  {
    to: "/profile",
    icon: <User className="h-5 w-5" />,
    label: "My Profile",
  },
  {
    to: "/notifications",
    icon: <Bell className="h-5 w-5" />,
    label: "Notifications",
  },
];

export const mayorLinks = [
  {
    to: "/mayor/dashboard",
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
  },
  {
    to: "/mayor/statistics",
    icon: <BarChart className="h-5 w-5" />,
    label: "Statistics",
  },
  {
    to: "/mayor/areas",
    icon: <Map className="h-5 w-5" />,
    label: "Area Reports",
  },
  {
    to: "/mayor/reports",
    icon: <FileText className="h-5 w-5" />,
    label: "Generate Reports",
  },
  {
    to: "/profile",
    icon: <User className="h-5 w-5" />,
    label: "My Profile",
  },
  {
    to: "/notifications",
    icon: <Bell className="h-5 w-5" />,
    label: "Notifications",
  },
];
