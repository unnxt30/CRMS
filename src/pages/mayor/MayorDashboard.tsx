
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/common/StatsCard";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { useResources } from "@/context/ResourceContext";
import { RequestStatus, RequestPriority } from "@/types";
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
} from "recharts";
import { BarChart2, Download, FileText, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { mayorLinks } from "@/routes/sidebarLinks";

export default function MayorDashboard() {
  const { requests } = useRepairRequests();
  const { resources } = useResources();
  
  // Calculate request statistics
  const totalRequests = requests.length;
  const completedRequests = requests.filter(req => req.status === RequestStatus.COMPLETED).length;
  const pendingRequests = requests.filter(req => req.status === RequestStatus.PENDING).length;
  const inProgressRequests = requests.filter(req => req.status === RequestStatus.IN_PROGRESS).length;
  const completionRate = Math.round((completedRequests / totalRequests) * 100) || 0;
  
  // Generate sample data for monthly trend
  const monthlyData = [
    { name: "Jan", requests: 45, completed: 35 },
    { name: "Feb", requests: 52, completed: 48 },
    { name: "Mar", requests: 49, completed: 42 },
    { name: "Apr", requests: 63, completed: 55 },
    { name: "May", requests: 57, completed: 50 },
    { name: "Jun", requests: 68, completed: 62 },
    { name: "Jul", requests: 72, completed: 58 },
  ];
  
  // Request types data for pie chart
  const requestTypesData = [
    { name: "Potholes", value: 35, color: "#60A5FA" },
    { name: "Street Lights", value: 22, color: "#F59E0B" },
    { name: "Drainage", value: 18, color: "#10B981" },
    { name: "Guardrails", value: 15, color: "#8B5CF6" },
    { name: "Road Markings", value: 10, color: "#EC4899" },
  ];
  
  // Resource utilization data
  const resourceData = [
    { name: "Manpower", total: 150, used: 115 },
    { name: "Asphalt", total: 5000, used: 3800 },
    { name: "Equipment", total: 35, used: 28 },
    { name: "Concrete", total: 2000, used: 1250 },
    { name: "Signage", total: 200, used: 125 },
  ];
  
  // Calculate district data
  const districtData = [
    { name: "Downtown", requests: 26, completed: 21 },
    { name: "North End", requests: 38, completed: 29 },
    { name: "West Side", requests: 30, completed: 25 },
    { name: "East Side", requests: 42, completed: 34 },
    { name: "South Side", requests: 35, completed: 28 },
  ];

  return (
    <DashboardLayout sidebarLinks={mayorLinks} title="Mayor Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mayor's Statistical Dashboard</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Requests" 
          value={totalRequests}
          icon={<FileText className="h-4 w-4" />}
          description="All time repair requests"
        />
        <StatsCard 
          title="Completion Rate" 
          value={`${completionRate}%`}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Requests successfully completed"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard 
          title="Pending Issues" 
          value={pendingRequests}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Awaiting action"
        />
        <StatsCard 
          title="In Progress" 
          value={inProgressRequests}
          icon={<Calendar className="h-4 w-4" />}
          description="Currently being addressed"
        />
      </div>
      
      {/* Monthly Trend Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Repair Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Total Requests"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Request Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {requestTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="used" stackId="a" fill="#82ca9d" name="Used" />
                  <Bar dataKey="total" stackId="a" fill="#8884d8" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* District Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>District Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={districtData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" name="Total Requests" fill="#8884d8" />
                <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Call to Action */}
      <div className="mt-6 bg-primary text-white p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Need a detailed report?</h3>
            <p>Download comprehensive statistics for city council meetings and planning.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="secondary">
              <FileText className="mr-2 h-4 w-4" /> Generate Full Report
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
