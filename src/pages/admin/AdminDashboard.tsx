
import { useNavigate } from "react-router-dom";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { useResources } from "@/context/ResourceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/common/StatsCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";
import { Users, Wrench, Truck, AlertTriangle, ArrowRight, BarChart4 } from "lucide-react";
import { adminLinks } from "@/routes/sidebarLinks";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { requests, workOrders } = useRepairRequests();
  const { resources } = useResources();
  
  // Resources by type
  const manpowerResources = resources.filter(r => r.type === "manpower");
  const equipmentResources = resources.filter(r => r.type === "equipment");
  const materialResources = resources.filter(r => r.type === "material");
  
  // Total available resources
  const totalManpower = manpowerResources.reduce((acc, r) => acc + r.available, 0);
  const totalUsedManpower = manpowerResources.reduce((acc, r) => acc + (r.quantity - r.available), 0);
  
  // Find low stock resources 
  const lowStockResources = resources.filter(r => (r.available / r.quantity) < 0.2);
  
  // Chart data for resource utilization
  const resourceData = resources.map(r => ({
    name: r.name,
    available: r.available,
    used: r.quantity - r.available,
  })).slice(0, 5); // Just show top 5 for clarity
  
  // Generate sample data for workload trend
  const workloadData = [
    { name: 'Week 1', workload: 35 },
    { name: 'Week 2', workload: 42 },
    { name: 'Week 3', workload: 38 },
    { name: 'Week 4', workload: 53 },
    { name: 'Week 5', workload: 45 },
    { name: 'Week 6', workload: 48 },
    { name: 'Week 7', workload: 61 },
  ];
  
  return (
    <DashboardLayout sidebarLinks={adminLinks} title="Admin Dashboard">
      <h1 className="text-2xl font-bold mb-6">Resource Management Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard 
          title="Total Manpower"
          value={`${totalManpower}/${manpowerResources.reduce((acc, r) => acc + r.quantity, 0)}`}
          icon={<Users className="h-4 w-4" />}
          description="Available workers"
        />
        <StatsCard 
          title="Equipment"
          value={`${equipmentResources.reduce((acc, r) => acc + r.available, 0)}/${equipmentResources.reduce((acc, r) => acc + r.quantity, 0)}`}
          icon={<Wrench className="h-4 w-4" />}
          description="Available equipment units"
        />
        <StatsCard 
          title="Materials"
          value={`${materialResources.length} types`}
          icon={<Truck className="h-4 w-4" />}
          description="Different materials in stock"
        />
        <StatsCard 
          title="Low Stock Items"
          value={lowStockResources.length}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Resources below 20% availability"
          trend={{ value: lowStockResources.length > 2 ? 15 : 0, isPositive: false }}
        />
      </div>
      
      {/* Resource Utilization Chart */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Resource Utilization</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/resources")}>
                Manage
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="used" stackId="a" fill="#F97316" name="Used" />
                  <Bar dataKey="available" stackId="a" fill="#60A5FA" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Work Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={workloadData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="workload" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    name="Man-hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Low Stock Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Low Stock Resources</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/resources")}>
              View All Resources
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockResources.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-green-600 font-medium">All resources are at healthy stock levels</p>
              <p className="text-sm text-muted-foreground mt-1">No items are below the 20% threshold</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockResources.map((resource) => {
                const percentAvailable = Math.round((resource.available / resource.quantity) * 100);
                
                return (
                  <div key={resource.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {resource.available} / {resource.quantity} {resource.unit}
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            percentAvailable < 10 ? 'bg-red-500' : 'bg-orange-400'
                          }`}
                          style={{width: `${percentAvailable}%`}}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{percentAvailable}% remaining</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
