import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supervisorLinks } from "@/routes/sidebarLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { useResources } from "@/context/ResourceContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search, Plus, FileText, Clock, Calendar } from "lucide-react";
import { RequestStatus } from "@/types";

export default function WorkOrdersPage() {
  const navigate = useNavigate();
  const { requests, workOrders } = useRepairRequests();
  const { resources } = useResources();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: "",
    description: "",
    requestId: "",
    assignedTo: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    status: "pending"
  });
  
  const pendingRequests = requests.filter(req => 
    req.status !== RequestStatus.COMPLETED && req.status !== RequestStatus.REJECTED
  );
  
  const filteredWorkOrders = workOrders.filter(order => 
    order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.requestId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateWorkOrder = () => {
    // In a real app, this would call the API to create the work order
    toast.success("Work order created successfully");
    setIsDialogOpen(false);
    
    // Reset form
    setNewWorkOrder({
      title: "",
      description: "",
      requestId: "",
      assignedTo: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      status: "pending"
    });
  };
  
  return (
    <DashboardLayout sidebarLinks={supervisorLinks} title="Supervisor Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Orders</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Work Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Work Order</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={newWorkOrder.title}
                  onChange={(e) => setNewWorkOrder({ ...newWorkOrder, title: e.target.value })}
                  placeholder="Work order title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background p-2 text-sm"
                  value={newWorkOrder.description}
                  onChange={(e) => setNewWorkOrder({ ...newWorkOrder, description: e.target.value })}
                  placeholder="Detailed description of work to be done"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="request">Related Request</label>
                <Select 
                  value={newWorkOrder.requestId} 
                  onValueChange={(value) => setNewWorkOrder({ ...newWorkOrder, requestId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a request" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {pendingRequests.map((req) => (
                      <SelectItem key={req.id} value={req.id}>{req.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="assigned">Assigned Workers (comma separated)</label>
                <Input
                  id="assigned"
                  value={newWorkOrder.assignedTo}
                  onChange={(e) => setNewWorkOrder({ ...newWorkOrder, assignedTo: e.target.value })}
                  placeholder="e.g. worker1, worker2, worker3"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="date">Start Date</label>
                <Input
                  id="date"
                  type="date"
                  value={newWorkOrder.startDate}
                  onChange={(e) => setNewWorkOrder({ ...newWorkOrder, startDate: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateWorkOrder} type="button">Create Work Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filteredWorkOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.title}</TableCell>
                      <TableCell>
                        {order.requestId ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() => navigate(`/supervisor/requests/${order.requestId}`)}
                          >
                            View Request
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(order.startDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" /> Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No work orders found</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Work Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
