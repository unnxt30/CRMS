
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RepairRequestProvider } from "@/context/RepairRequestContext";
import { ResourceProvider } from "@/context/ResourceContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { UserRole } from "./types";
import {Outlet} from "react-router-dom"

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RequestList from "./pages/requests/RequestList";
import NewRequest from "./pages/requests/NewRequest";
import RequestDetail from "./pages/requests/RequestDetail";
import RepairHistory from "./pages/requests/RepairHistory";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import RequestManagement from "./pages/supervisor/RequestManagement";
import SupervisorRequestDetail from "./pages/supervisor/SupervisorRequestDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ResourceManagement from "./pages/admin/ResourceManagement";
import MayorDashboard from "./pages/mayor/MayorDashboard";
import StatisticsPage from "./pages/mayor/StatisticsPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/profile/ProfilePage";
import AboutPage from "./pages/common/AboutPage";
import ServicesPage from "./pages/common/ServicesPage";
import ContactPage from "./pages/common/ContactPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RepairRequestProvider>
          <ResourceProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Outlet />
            </TooltipProvider>
          </ResourceProvider>
        </RepairRequestProvider>
      </AuthProvider>
  </QueryClientProvider>
);

export default App;
