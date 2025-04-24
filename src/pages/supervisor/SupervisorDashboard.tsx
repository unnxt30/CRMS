
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { useResources } from "@/context/ResourceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatus, RequestPriority } from "@/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/common/StatsCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, CheckCircle, Clock, MapPin, AlertTriangle, FileText } from "lucide-react";

import { supervisorLinks } from "@/routes/sidebarLinks";

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const { requests, workOrders } = useRepairRequests();
  const { resources } = useResources();
  
  // Calculate request statistics
  const pendingRequests = requests.filter(req => req.status === RequestStatus.PENDING);
  const inspectedRequests = requests.filter(req => req.status === RequestStatus.INSPECTED);
  const scheduledRequests = requests.filter(req => req.status === RequestStatus.SCHEDULED);
  const inProgressRequests = requests.filter(req => req.status === RequestStatus.IN_PROGRESS);
  const completedRequests = requests.filter(req => req.status === RequestStatus.COMPLETED);
  
  // Priority statistics
  const highPriorityCount = requests.filter(req => req.priority === RequestPriority.HIGH).length;
  const mediumPriorityCount = requests.filter(req => req.priority === RequestPriority.MEDIUM).length;
  const lowPriorityCount = requests.filter(req => req.priority === RequestPriority.LOW).length;
  const emergencyPriorityCount = requests.filter(req => req.priority === RequestPriority.EMERGENCY).length;
  
  // Recent requests
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);
  
  // Chart data
  const statusChartData = [
    { name: "Pending", value: pendingRequests.length, color: "#FCD34D" },
    { name: "Inspected", value: inspectedRequests.length, color: "#60A5FA" },
    { name: "Scheduled", value: scheduledRequests.length, color: "#C084FC" },
    { name: "In Progress", value: inProgressRequests.length, color: "#F97316" },
    { name: "Completed", value: completedRequests.length, color: "#34D399" }
  ];
  
  const priorityChartData = [
    { name: "Low", value: lowPriorityCount, color: "#60A5FA" },
    { name: "Medium", value: mediumPriorityCount, color: "#FCD34D" },
    { name: "High", value: highPriorityCount, color: "#F97316" },
    { name: "Emergency", value: emergencyPriorityCount, color: "#EF4444" }
  ];
  
  // Calculate resource utilization
  const resourceUtilization = resources.map(resource => ({
    name: resource.name,
    available: resource.available,
    used: resource.quantity - resource.available
  }));
  
  return (
    <DashboardLayout sidebarLinks={supervisorLinks} title="Supervisor Dashboard">
      <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard 
          title="Pending Requests"
          value={pendingRequests.length}
          icon={<Clock className="h-4 w-4" />}
          description="Waiting for inspection"
        />
        <StatsCard 
          title="In Progress"
          value={inProgressRequests.length}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Currently being repaired"
        />
        <StatsCard 
          title="Scheduled"
          value={scheduledRequests.length}
          icon={<Calendar className="h-4 w-4" />}
          description="Ready for repair"
        />
        <StatsCard 
          title="Completed"
          value={completedRequests.length}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Successfully repaired"
          trend={{ value: 12, isPositive: true }}
        />
      </div>
      
      {/* Charts and statistics */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Requests">
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Request Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Recent Repair Requests</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/supervisor/requests")}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-secondary">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{request.title}</h4>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {request.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{request.location}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0" onClick={() => navigate(`/supervisor/requests/${request.id}`)}>
                  View
                </Button>
              </div>
            ))}
            
            {recentRequests.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No recent requests found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
