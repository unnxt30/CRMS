
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RepairRequestProvider>
        <ResourceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Resident Routes */}
                <Route
                  path="/requests"
                  element={
                    <ProtectedRoute>
                      <RequestList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/new"
                  element={
                    <ProtectedRoute>
                      <NewRequest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/:id"
                  element={
                    <ProtectedRoute>
                      <RequestDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <RepairHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Supervisor Routes */}
                <Route
                  path="/supervisor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
                      <SupervisorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supervisor/requests"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
                      <RequestManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supervisor/requests/:id"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
                      <SupervisorRequestDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Administrator Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/resources"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
                      <ResourceManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Mayor Routes */}
                <Route
                  path="/mayor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.MAYOR]}>
                      <MayorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mayor/statistics"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.MAYOR]}>
                      <StatisticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ResourceProvider>
      </RepairRequestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
