
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mayorLinks } from "@/routes/sidebarLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { RequestStatus, RequestPriority } from "@/types";
import { Download, MapPin, Map, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AreasReportPage() {
  const { requests } = useRepairRequests();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("6months");
  
  // Sample city districts
  const districts = [
    "Downtown",
    "North End",
    "West Side",
    "East Side",
    "South Side"
  ];
  
  // Map requests to districts (in a real app this would come from the database)
  const districtMapping: Record<string, string> = {
    "req1": "Downtown",
    "req2": "North End",
    "req3": "West Side",
    "req4": "East Side",
    "req5": "South Side",
  };
  
  // Filter requests based on district and time range
  const filteredRequests = requests.filter(req => {
    const isInSelectedDistrict = selectedDistrict === "all" || 
      districtMapping[req.id] === selectedDistrict;
    
    // Would apply time filtering here in a real app
    
    return isInSelectedDistrict;
  });
  
  // Calculate statistics for each district
  const calculateDistrictStats = () => {
    const stats = districts.map(district => {
      const districtRequests = requests.filter(req => districtMapping[req.id] === district);
      const completedCount = districtRequests.filter(req => req.status === RequestStatus.COMPLETED).length;
      const inProgressCount = districtRequests.filter(req => req.status === RequestStatus.IN_PROGRESS).length;
      const pendingCount = districtRequests.filter(req => req.status === RequestStatus.PENDING).length;
      const highPriorityCount = districtRequests.filter(req => req.priority === RequestPriority.HIGH || req.priority === RequestPriority.EMERGENCY).length;
      
      return {
        district,
        totalRequests: districtRequests.length,
        completed: completedCount,
        inProgress: inProgressCount,
        pending: pendingCount,
        highPriority: highPriorityCount,
        completionRate: districtRequests.length > 0 ? Math.round((completedCount / districtRequests.length) * 100) : 0
      };
    });
    
    return stats;
  };
  
  const districtStats = calculateDistrictStats();
  const selectedDistrictStats = selectedDistrict === "all" 
    ? districtStats 
    : districtStats.filter(stat => stat.district === selectedDistrict);
  
  // Calculate top issues for the selected district
  const topIssues = [
    { name: "Potholes", count: selectedDistrict === "Downtown" ? 12 : selectedDistrict === "North End" ? 8 : 5 },
    { name: "Street Lights", count: selectedDistrict === "East Side" ? 15 : selectedDistrict === "South Side" ? 9 : 4 },
    { name: "Drainage", count: selectedDistrict === "West Side" ? 10 : selectedDistrict === "Downtown" ? 7 : 3 },
    { name: "Guardrails", count: selectedDistrict === "North End" ? 6 : selectedDistrict === "East Side" ? 8 : 2 },
    { name: "Road Markings", count: selectedDistrict === "South Side" ? 11 : selectedDistrict === "West Side" ? 5 : 1 }
  ];
  
  // Data for comparative district chart
  const districtComparisonData = districtStats.map(stat => ({
    name: stat.district,
    requests: stat.totalRequests,
    completed: stat.completed,
    high: stat.highPriority,
    rate: stat.completionRate
  }));
  
  // Export report function
  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      district: selectedDistrict,
      timeRange: selectedTimeRange,
      districtStats: selectedDistrict === "all" ? districtStats : selectedDistrictStats,
      topIssues
    };
    
    const jsonData = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `area-report-${selectedDistrict}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Report exported successfully");
  };
  
  return (
    <DashboardLayout sidebarLinks={mayorLinks} title="Mayor Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Area Reports</h1>
        <Button onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <p className="text-sm font-medium mb-1.5">District</p>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-48">
            <p className="text-sm font-medium mb-1.5">Time Period</p>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
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
        </CardContent>
      </Card>
      
      {selectedDistrict !== "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {selectedDistrictStats.map((stat) => (
            <Card key={stat.district}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {stat.district}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Requests:</span>
                    <span className="font-medium">{stat.totalRequests}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium text-green-600">{stat.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">In Progress:</span>
                    <span className="font-medium text-orange-500">{stat.inProgress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-medium text-yellow-500">{stat.pending}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">High Priority:</span>
                    <span className="font-medium text-red-500">{stat.highPriority}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completion Rate:</span>
                    <span className="font-bold">{stat.completionRate}%</span>
                  </div>
                  
                  {/* Simple progress bar for completion rate */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        stat.completionRate > 75 ? 'bg-green-600' : 
                        stat.completionRate > 50 ? 'bg-yellow-500' : 
                        'bg-orange-500'
                      }`}
                      style={{ width: `${stat.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>District Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={districtComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" name="Total Requests" fill="#8884d8" />
                  <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
                  <Bar dataKey="high" name="High Priority" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Issues in {selectedDistrict === "all" ? "All Districts" : selectedDistrict}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topIssues}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Reports" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests in {selectedDistrict === "all" ? "All Districts" : selectedDistrict}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {filteredRequests.slice(0, 6).map((request) => (
                  <div key={request.id} className="p-3 border rounded-lg">
                    <h3 className="font-medium">{request.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === RequestStatus.COMPLETED ? 'bg-green-100 text-green-700' : 
                        request.status === RequestStatus.IN_PROGRESS ? 'bg-orange-100 text-orange-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status}
                      </span>
                      {request.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          request.priority === RequestPriority.HIGH ? 'bg-red-100 text-red-700' : 
                          request.priority === RequestPriority.MEDIUM ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {request.priority}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-3" />
                <h3 className="text-lg font-medium mb-1">No requests found</h3>
                <p className="text-muted-foreground">Try changing your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5" />
            Area Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center h-80">
            <Map className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Interactive Map Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-md">
              An interactive map showing repair requests across the city will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
