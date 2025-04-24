
import { useState } from "react";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { useResources } from "@/context/ResourceContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RequestStatus, RequestPriority } from "@/types";
import { Download, FileText, Filter, Calendar } from "lucide-react";
import { mayorLinks } from "@/routes/sidebarLinks";
import { format, subMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

export default function StatisticsPage() {
  const { requests } = useRepairRequests();
  const { resources } = useResources();
  const [timeRange, setTimeRange] = useState("6months");
  const [reportType, setReportType] = useState("status");
  
  // Filter requests based on selected time range
  const getFilteredRequests = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case "1month":
        startDate = subMonths(now, 1);
        break;
      case "3months":
        startDate = subMonths(now, 3);
        break;
      case "6months":
      default:
        startDate = subMonths(now, 6);
        break;
      case "1year":
        startDate = subMonths(now, 12);
        break;
    }
    
    return requests.filter(req => 
      new Date(req.submittedAt) >= startDate && 
      new Date(req.submittedAt) <= now
    );
  };
  
  const filteredRequests = getFilteredRequests();
  
  // Prepare data for charts based on report type
  const getChartData = () => {
    switch (reportType) {
      case "status": {
        const statusCounts = {
          [RequestStatus.PENDING]: 0,
          [RequestStatus.INSPECTED]: 0,
          [RequestStatus.SCHEDULED]: 0,
          [RequestStatus.IN_PROGRESS]: 0,
          [RequestStatus.COMPLETED]: 0,
          [RequestStatus.REJECTED]: 0,
        };
        
        filteredRequests.forEach(req => {
          statusCounts[req.status]++;
        });
        
        return Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          color: getStatusColor(status as RequestStatus),
        }));
      }
      
      case "priority": {
        const priorityCounts = {
          [RequestPriority.LOW]: 0,
          [RequestPriority.MEDIUM]: 0,
          [RequestPriority.HIGH]: 0,
          [RequestPriority.EMERGENCY]: 0,
          "unset": 0,
        };
        
        filteredRequests.forEach(req => {
          if (req.priority) {
            priorityCounts[req.priority]++;
          } else {
            priorityCounts.unset++;
          }
        });
        
        return Object.entries(priorityCounts).map(([priority, count]) => ({
          name: priority.charAt(0).toUpperCase() + priority.slice(1),
          value: count,
          color: getPriorityColor(priority as RequestPriority | "unset"),
        }));
      }
      
      case "monthly": {
        // Generate last 6 months data
        const monthlyData = [];
        const now = new Date();
        
        for (let i = 0; i < 6; i++) {
          const month = subMonths(now, i);
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          
          const monthlyRequests = requests.filter(req => 
            isWithinInterval(new Date(req.submittedAt), { start: monthStart, end: monthEnd })
          );
          
          const completed = monthlyRequests.filter(req => req.status === RequestStatus.COMPLETED).length;
          
          monthlyData.unshift({
            name: format(month, "MMM"),
            submitted: monthlyRequests.length,
            completed: completed,
          });
        }
        
        return monthlyData;
      }
      
      default:
        return [];
    }
  };
  
  const chartData = getChartData();
  
  // Utility functions for chart colors
  function getStatusColor(status: RequestStatus): string {
    switch (status) {
      case RequestStatus.PENDING: return "#FCD34D";
      case RequestStatus.INSPECTED: return "#60A5FA";
      case RequestStatus.SCHEDULED: return "#C084FC";
      case RequestStatus.IN_PROGRESS: return "#F97316";
      case RequestStatus.COMPLETED: return "#34D399";
      case RequestStatus.REJECTED: return "#EF4444";
      default: return "#94A3B8";
    }
  }
  
  function getPriorityColor(priority: RequestPriority | "unset"): string {
    switch (priority) {
      case RequestPriority.LOW: return "#60A5FA";
      case RequestPriority.MEDIUM: return "#FCD34D";
      case RequestPriority.HIGH: return "#F97316";
      case RequestPriority.EMERGENCY: return "#EF4444";
      case "unset": return "#94A3B8";
      default: return "#94A3B8";
    }
  }
  
  const handleExportReport = () => {
    // In a production app, this would generate a real PDF/CSV
    const element = document.createElement("a");
    
    const reportData = JSON.stringify(chartData, null, 2);
    const blob = new Blob([reportData], { type: "text/plain" });
    
    element.href = URL.createObjectURL(blob);
    element.download = `road-repairs-${reportType}-report.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <DashboardLayout sidebarLinks={mayorLinks} title="Mayor Dashboard">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Statistical Reports</h1>
        <Button onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <p className="text-sm font-medium mb-1.5">Time Period</p>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-48">
            <p className="text-sm font-medium mb-1.5">Report Type</p>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status Distribution</SelectItem>
                <SelectItem value="priority">Priority Breakdown</SelectItem>
                <SelectItem value="monthly">Monthly Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === "status" && "Request Status Distribution"}
            {reportType === "priority" && "Request Priority Breakdown"}
            {reportType === "monthly" && "Monthly Repair Trends"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {(reportType === "status" || reportType === "priority") && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {reportType === "monthly" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="submitted" 
                    name="Submitted Requests"
                    stroke="#60A5FA" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    name="Completed Repairs"
                    stroke="#34D399" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="mt-6 bg-muted/50 p-4 rounded-md">
            <h3 className="font-medium text-lg mb-2">Report Summary</h3>
            <p className="text-muted-foreground">
              {reportType === "status" && 
                `This report shows the distribution of repair requests by status over the selected time period. 
                ${chartData.find(d => d.name === "Completed")?.value || 0} requests have been completed, 
                with ${filteredRequests.length - (chartData.find(d => d.name === "Completed")?.value || 0)} still in various stages of processing.`
              }
              
              {reportType === "priority" && 
                `This report shows the distribution of repair requests by priority level over the selected time period.
                ${chartData.find(d => d.name === "High")?.value || 0} high priority and 
                ${chartData.find(d => d.name === "Emergency")?.value || 0} emergency requests were reported.`
              }
              
              {reportType === "monthly" && 
                `This report shows the monthly trend of submitted and completed repair requests over the past 6 months.
                ${chartData.reduce((sum, month) => sum + month.submitted, 0)} requests were submitted and
                ${chartData.reduce((sum, month) => sum + month.completed, 0)} were completed during this period.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
