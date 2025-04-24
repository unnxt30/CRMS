import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge, PriorityBadge } from "@/components/common/StatusBadge";
import { RequestStatus, RequestPriority } from "@/types";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { supervisorLinks } from "@/routes/sidebarLinks";
import { CreateWorkOrderDialog } from "@/components/supervisor/CreateWorkOrderDialog";

export default function SupervisorRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getRequestById, updateRequest, isLoading, workOrders, getWorkOrdersByRequestId } = useRepairRequests();
  
  const [request, setRequest] = useState(id ? getRequestById(id) : null);
  const [status, setStatus] = useState<RequestStatus | "">("");
  const [priority, setPriority] = useState<RequestPriority | "">("");
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [saving, setSaving] = useState(false);
  
  const relatedWorkOrders = id ? getWorkOrdersByRequestId(id) : [];
  
  useEffect(() => {
    if (id) {
      const requestData = getRequestById(id);
      setRequest(requestData);
      
      if (requestData) {
        setStatus(requestData.status);
        setPriority(requestData.priority || "");
        setInspectionNotes(requestData.inspectionNotes || "");
        
        if (requestData.estimatedCompletionDate) {
          const date = new Date(requestData.estimatedCompletionDate);
          setEstimatedCompletionDate(format(date, "yyyy-MM-dd"));
        }
      }
    }
  }, [id, getRequestById]);
  
  if (isLoading) {
    return (
      <DashboardLayout sidebarLinks={supervisorLinks} title="Supervisor Dashboard">
        <div className="flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!request) {
    return (
      <DashboardLayout sidebarLinks={supervisorLinks} title="Supervisor Dashboard">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Request Not Found</h2>
          <p className="mb-6">The repair request you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/supervisor/requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const handleStatusChange = (status: RequestStatus) => {
    setStatus(status);
  };
  
  const handlePriorityChange = (newPriority: RequestPriority) => {
    setPriority(newPriority);
  };
  
  const handleSave = async () => {
    if (!id) return;
    
    setSaving(true);
    
    try {
      const updates: any = {};
      
      if (status && status !== request.status) {
        updates.status = status;
      }
      
      if (priority && priority !== request.priority) {
        updates.priority = priority;
      }
      
      if (inspectionNotes !== (request.inspectionNotes || "")) {
        updates.inspectionNotes = inspectionNotes;
      }
      
      if (estimatedCompletionDate) {
        const date = new Date(estimatedCompletionDate);
        date.setHours(17, 0, 0, 0);
        updates.estimatedCompletionDate = date.toISOString();
      }
      
      if (Object.keys(updates).length > 0) {
        await updateRequest(id, updates);
        toast.success("Request updated successfully");
      } else {
        toast.info("No changes to save");
      }
    } catch (error) {
      toast.error("Failed to update request");
      console.error("Error updating request:", error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <DashboardLayout sidebarLinks={supervisorLinks} title="Supervisor Dashboard">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/supervisor/requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{request.title}</h1>
      <p className="text-gray-500 mb-6">Request ID: {request.id}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{request.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                    {request.location}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reported On</h3>
                  <p className="mt-1">
                    {format(new Date(request.submittedAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                  <p className="mt-1">
                    Resident ID: {request.submittedBy}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Inspection Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Add your inspection notes here..."
                className="h-32"
              />
            </CardContent>
          </Card>
          
          {request.images && request.images.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {request.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`Issue ${index + 1}`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {relatedWorkOrders.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Related Work Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedWorkOrders.map((workOrder) => (
                    <div key={workOrder.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{workOrder.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{workOrder.description}</p>
                        </div>
                        <StatusBadge status={workOrder.status} />
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(workOrder.startDate), "MMM d, yyyy")}</span>
                          {workOrder.endDate && (
                            <span> - {format(new Date(workOrder.endDate), "MMM d, yyyy")}</span>
                          )}
                        </div>
                        
                        {workOrder.assignedTo && workOrder.assignedTo.length > 0 && (
                          <div className="mt-2">
                            <span className="text-muted-foreground">Assigned to: </span>
                            <span>{Array.isArray(workOrder.assignedTo) ? workOrder.assignedTo.join(", ") : workOrder.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RequestStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={RequestStatus.INSPECTED}>Inspected</SelectItem>
                    <SelectItem value={RequestStatus.SCHEDULED}>Scheduled</SelectItem>
                    <SelectItem value={RequestStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={RequestStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={RequestStatus.REJECTED}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-1 text-sm text-gray-500">Current: <StatusBadge status={request.status} /></div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RequestPriority.LOW}>Low</SelectItem>
                    <SelectItem value={RequestPriority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={RequestPriority.HIGH}>High</SelectItem>
                    <SelectItem value={RequestPriority.EMERGENCY}>Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-1 text-sm text-gray-500">
                  Current: {request.priority ? (
                    <PriorityBadge priority={request.priority} />
                  ) : (
                    <span>Not set</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Estimated Completion Date</label>
                <input
                  type="date"
                  value={estimatedCompletionDate}
                  onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="mt-1 text-sm text-gray-500">
                  Current: {request.estimatedCompletionDate ? (
                    format(new Date(request.estimatedCompletionDate), "MMMM d, yyyy")
                  ) : (
                    <span>Not set</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resource Planning</CardTitle>
            </CardHeader>
            <CardContent>
              {request.status === RequestStatus.COMPLETED ? (
                <div className="text-center py-2">
                  <p className="text-green-600 mb-2">This request has been completed</p>
                  {relatedWorkOrders.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {relatedWorkOrders.length} work order(s) completed
                    </p>
                  )}
                </div>
              ) : request.status === RequestStatus.REJECTED ? (
                <div className="text-center py-2">
                  <p className="text-red-500">This request has been rejected</p>
                </div>
              ) : relatedWorkOrders.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    This request has {relatedWorkOrders.length} active work order(s)
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/supervisor/workorders")}>
                    View Work Orders
                  </Button>
                </div>
              ) : (
                <CreateWorkOrderDialog requestId={request.id} requestTitle={request.title} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
