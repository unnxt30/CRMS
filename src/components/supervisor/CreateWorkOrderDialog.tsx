import { useState, useEffect } from "react";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { useResources } from "@/context/ResourceContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

interface CreateWorkOrderDialogProps {
  requestId: string;
  requestTitle: string;
}

export function CreateWorkOrderDialog({ requestId, requestTitle }: CreateWorkOrderDialogProps) {
  const { resources } = useResources();
  const { updateRequest } = useRepairRequests();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<{id: string, quantity: number}[]>([]);
  const [formData, setFormData] = useState({
    title: `Work order for: ${requestTitle}`,
    description: "",
    assignedWorkers: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    estimatedDuration: "1"
  });

  const handleSelectResource = (resourceId: string) => {
    const exists = selectedResources.find(r => r.id === resourceId);
    
    if (exists) {
      setSelectedResources(selectedResources.filter(r => r.id !== resourceId));
    } else {
      setSelectedResources([...selectedResources, { id: resourceId, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (resourceId: string, quantity: number) => {
    setSelectedResources(selectedResources.map(r => 
      r.id === resourceId ? { ...r, quantity } : r
    ));
  };

  const handleCreateWorkOrder = () => {
    // Update the request status
    updateRequest(requestId, {
      status: RequestStatus.IN_PROGRESS,
      estimatedCompletionDate: addDays(new Date(formData.startDate), parseInt(formData.estimatedDuration)).toISOString()
    });
    
    toast.success("Work order created successfully");
    setIsOpen(false);
    
    // Reset form
    setSelectedResources([]);
    setFormData({
      title: `Work order for: ${requestTitle}`,
      description: "",
      assignedWorkers: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      estimatedDuration: "1"
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Create Work Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Work Order</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Work Order Title</label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of work to be performed"
              className="h-24"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="startDate">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="duration">Estimated Duration (days)</label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="workers">Assigned Workers (comma separated)</label>
            <Input
              id="workers"
              value={formData.assignedWorkers}
              onChange={(e) => setFormData({ ...formData, assignedWorkers: e.target.value })}
              placeholder="e.g. John Doe, Jane Smith"
            />
          </div>
          
          <div className="grid gap-2">
            <label>Required Resources</label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`resource-${resource.id}`}
                      checked={selectedResources.some(r => r.id === resource.id)}
                      onChange={() => handleSelectResource(resource.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`resource-${resource.id}`} className="text-sm font-medium">
                      {resource.name} ({resource.available}/{resource.quantity} {resource.unit} available)
                    </label>
                  </div>
                  
                  {selectedResources.some(r => r.id === resource.id) && (
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        min="1"
                        max={resource.available}
                        value={selectedResources.find(r => r.id === resource.id)?.quantity || 1}
                        onChange={(e) => handleQuantityChange(resource.id, parseInt(e.target.value) || 1)}
                        className="w-20 h-7 text-sm"
                      />
                      <span className="text-xs text-muted-foreground">{resource.unit}</span>
                    </div>
                  )}
                </div>
              ))}
              
              {resources.length === 0 && (
                <p className="text-sm text-muted-foreground">No resources available</p>
              )}
            </div>
          </div>
          
          <Button onClick={handleCreateWorkOrder} className="mt-2">Create Work Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
