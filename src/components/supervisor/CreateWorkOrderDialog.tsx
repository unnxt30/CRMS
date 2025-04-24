
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useResources } from "@/context/ResourceContext";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Resource, RequestStatus } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Wrench } from "lucide-react";

interface CreateWorkOrderDialogProps {
  requestId: string;
  requestTitle: string;
}

export function CreateWorkOrderDialog({ requestId, requestTitle }: CreateWorkOrderDialogProps) {
  const { resources } = useResources();
  const { updateRequest } = useRepairRequests();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<{id: string, quantity: number}[]>([]);
  const [title, setTitle] = useState(`Work Order - ${requestTitle}`);
  const [description, setDescription] = useState("");
  const [workers, setWorkers] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResourceSelection = (resource: Resource, isChecked: boolean) => {
    if (isChecked) {
      setSelectedResources(prev => [...prev, { id: resource.id, quantity: 1 }]);
    } else {
      setSelectedResources(prev => prev.filter(r => r.id !== resource.id));
    }
  };

  const handleQuantityChange = (resourceId: string, quantity: number) => {
    setSelectedResources(prev => 
      prev.map(r => r.id === resourceId ? { ...r, quantity } : r)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update request status
      await updateRequest(requestId, {
        status: RequestStatus.IN_PROGRESS,
        estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
      });
      
      // Reset form
      setTitle(`Work Order - ${requestTitle}`);
      setDescription("");
      setWorkers("");
      setSelectedResources([]);
      
      toast.success("Work order created successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating work order:", error);
      toast.error("Failed to create work order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Create Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" /> Create Work Order
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium mb-1 block">Work Order Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter work order title"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work to be done"
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label htmlFor="workers" className="text-sm font-medium mb-1 block">Assigned Workers (comma separated)</label>
            <Input
              id="workers"
              value={workers}
              onChange={(e) => setWorkers(e.target.value)}
              placeholder="e.g. John Doe, Jane Smith"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Required Resources</label>
            <div className="space-y-3 max-h-[200px] overflow-y-auto p-2 border rounded-md">
              {resources.length > 0 ? (
                resources.map((resource) => {
                  const isSelected = selectedResources.some(r => r.id === resource.id);
                  const selectedResource = selectedResources.find(r => r.id === resource.id);
                  
                  return (
                    <div key={resource.id} className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id={`resource-${resource.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleResourceSelection(resource, checked as boolean)
                          }
                        />
                        <div>
                          <label
                            htmlFor={`resource-${resource.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {resource.name}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Available: {resource.available} {resource.unit}
                          </p>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center space-x-2">
                          <label className="text-xs" htmlFor={`quantity-${resource.id}`}>Quantity:</label>
                          <Input
                            id={`quantity-${resource.id}`}
                            type="number"
                            min={1}
                            max={resource.available}
                            value={selectedResource?.quantity || 1}
                            onChange={(e) => handleQuantityChange(resource.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No resources available</p>
              )}
            </div>
          </div>
          
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Work Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
