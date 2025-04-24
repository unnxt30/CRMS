
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogFooter,
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
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResources } from "@/context/ResourceContext";
import { adminLinks } from "@/routes/sidebarLinks";
import { Search, Plus, Edit } from "lucide-react";

interface ResourceFormData {
  name: string;
  type: "manpower" | "equipment" | "material";
  quantity: string;
  available: string;
  unit: string;
}

export default function ResourceManagement() {
  const { resources, isLoading, updateResource, addResource } = useResources();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ResourceFormData>({
    name: "",
    type: "material",
    quantity: "0",
    available: "0",
    unit: "units",
  });
  
  // Filter resources based on search and type
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "" || resource.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const handleInputChange = (field: keyof ResourceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleEditResource = (resourceId: string) => {
    const resource = resources.find((r) => r.id === resourceId);
    if (resource) {
      setFormData({
        name: resource.name,
        type: resource.type,
        quantity: resource.quantity.toString(),
        available: resource.available.toString(),
        unit: resource.unit,
      });
      setEditingResource(resourceId);
      setOpenDialog(true);
    }
  };
  
  const handleSubmit = async () => {
    // Validate form
    const quantity = parseInt(formData.quantity);
    const available = parseInt(formData.available);
    
    if (isNaN(quantity) || isNaN(available) || quantity < 0 || available < 0) {
      alert("Please enter valid numbers for quantity and available resources.");
      return;
    }
    
    if (available > quantity) {
      alert("Available resources cannot exceed total quantity.");
      return;
    }
    
    if (editingResource) {
      // Update existing resource
      await updateResource(editingResource, {
        name: formData.name,
        type: formData.type,
        quantity,
        available,
        unit: formData.unit,
      });
    } else {
      // Add new resource
      await addResource({
        name: formData.name,
        type: formData.type,
        quantity,
        available,
        unit: formData.unit,
      });
    }
    
    // Reset form and close dialog
    setFormData({
      name: "",
      type: "material",
      quantity: "0",
      available: "0",
      unit: "units",
    });
    setEditingResource(null);
    setOpenDialog(false);
  };
  
  const openNewResourceDialog = () => {
    setFormData({
      name: "",
      type: "material",
      quantity: "0",
      available: "0",
      unit: "units",
    });
    setEditingResource(null);
    setOpenDialog(true);
  };
  
  return (
    <DashboardLayout sidebarLinks={adminLinks} title="Admin Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resource Management</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={openNewResourceDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? "Edit Resource" : "Add New Resource"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Resource Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Asphalt, Road Worker, etc."
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value as any)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="manpower">Manpower</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Total Quantity
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="available" className="text-sm font-medium">
                    Available
                  </label>
                  <Input
                    id="available"
                    type="number"
                    min="0"
                    max={formData.quantity}
                    value={formData.available}
                    onChange={(e) => handleInputChange("available", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  placeholder="kg, workers, machines, etc."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit}>
                {editingResource ? "Save Changes" : "Add Resource"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="manpower">Manpower</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading resources...</div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || typeFilter
                  ? "Try changing your search or filter criteria."
                  : "No resources have been added yet."}
              </p>
              <Button onClick={openNewResourceDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Resource
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => {
                    const percentAvailable = Math.round((resource.available / resource.quantity) * 100);
                    let statusColor = "bg-green-500";
                    if (percentAvailable < 20) {
                      statusColor = "bg-red-500";
                    } else if (percentAvailable < 50) {
                      statusColor = "bg-yellow-500";
                    }
                    
                    return (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.name}</TableCell>
                        <TableCell className="capitalize">{resource.type}</TableCell>
                        <TableCell>{resource.available}</TableCell>
                        <TableCell>{resource.quantity}</TableCell>
                        <TableCell>{resource.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-gray-200 rounded-full">
                              <div
                                className={`h-full rounded-full ${statusColor}`}
                                style={{ width: `${percentAvailable}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{percentAvailable}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditResource(resource.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
