
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RepairRequestProvider } from './context/RepairRequestContext';
import { ResourceProvider } from './context/ResourceContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import App from './App';
import Index from './pages/Index';
import AboutPage from './pages/common/AboutPage';
import ContactPage from './pages/common/ContactPage';
import ServicesPage from './pages/common/ServicesPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotificationsPage from './pages/common/NotificationsPage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Repair Request Pages
import RequestList from './pages/requests/RequestList';
import NewRequest from './pages/requests/NewRequest';
import RequestDetail from './pages/requests/RequestDetail';
import RepairHistory from './pages/requests/RepairHistory';

// Mayor Pages
import MayorDashboard from './pages/mayor/MayorDashboard';
import StatisticsPage from './pages/mayor/StatisticsPage';
import AreasReportPage from './pages/mayor/AreasReportPage';
import GenerateReportsPage from './pages/mayor/GenerateReportsPage';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import RequestManagement from './pages/supervisor/RequestManagement';
import SupervisorRequestDetail from './pages/supervisor/SupervisorRequestDetail';
import SchedulePage from './pages/supervisor/SchedulePage';
import WorkOrdersPage from './pages/supervisor/WorkOrdersPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ResourceManagement from './pages/admin/ResourceManagement';

// Error Page
import NotFound from './pages/NotFound';

import './index.css';
import ProtectedRoute from './routes/ProtectedRoute';
import { UserRole } from './types';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Index /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'services', element: <ServicesPage /> },
      
      // Auth routes
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      
      // Protected routes
      { 
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      
      // Request routes
      { 
        path: 'requests',
        element: (
          <ProtectedRoute>
            <RequestList />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'requests/new',
        element: (
          <ProtectedRoute>
            <NewRequest />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'requests/:id',
        element: (
          <ProtectedRoute>
            <RequestDetail />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'requests/history',
        element: (
          <ProtectedRoute>
            <RepairHistory />
          </ProtectedRoute>
        ),
      },
      
      // Mayor routes
      { 
        path: 'mayor/dashboard',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.MAYOR]}>
            <MayorDashboard />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'mayor/statistics',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.MAYOR]}>
            <StatisticsPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'mayor/areas',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.MAYOR]}>
            <AreasReportPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'mayor/reports',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.MAYOR]}>
            <GenerateReportsPage />
          </ProtectedRoute>
        ),
      },
      
      // Supervisor routes
      { 
        path: 'supervisor/dashboard',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
            <SupervisorDashboard />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'supervisor/requests',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
            <RequestManagement />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'supervisor/requests/:id',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
            <SupervisorRequestDetail />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'supervisor/schedule',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
            <SchedulePage />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'supervisor/workorders',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
            <WorkOrdersPage />
          </ProtectedRoute>
        ),
      },
      
      // Admin routes
      { 
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'admin/resources',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <ResourceManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RepairRequestProvider>
        <ResourceProvider>
          <RouterProvider router={router} />
          <Toaster />
          <SonnerToaster position="top-right" />
        </ResourceProvider>
      </RepairRequestProvider>
    </AuthProvider>
  </React.StrictMode>,
);
