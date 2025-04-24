
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Resource } from "@/types";
import { toast } from "sonner";

// Mock data for demo
const mockResources: Resource[] = [
  {
    id: "res1",
    name: "Asphalt",
    type: "material",
    quantity: 5000,
    available: 750,
    unit: "kg"
  },
  {
    id: "res2",
    name: "Road Workers",
    type: "manpower",
    quantity: 50,
    available: 12,
    unit: "workers"
  },
  {
    id: "res3",
    name: "Asphalt Paver",
    type: "equipment",
    quantity: 5,
    available: 2,
    unit: "machines"
  },
  {
    id: "res4",
    name: "Street Light Fixtures",
    type: "material",
    quantity: 200,
    available: 45,
    unit: "lights"
  },
  {
    id: "res5",
    name: "Electricians",
    type: "manpower",
    quantity: 20,
    available: 5,
    unit: "workers"
  },
  {
    id: "res6",
    name: "Guardrail Sections",
    type: "material",
    quantity: 500,
    available: 120,
    unit: "sections"
  },
  {
    id: "res7",
    name: "Construction Workers",
    type: "manpower",
    quantity: 80,
    available: 15,
    unit: "workers"
  },
  {
    id: "res8",
    name: "Heavy Equipment",
    type: "equipment",
    quantity: 10,
    available: 3,
    unit: "machines"
  }
];

interface ResourceContextType {
  resources: Resource[];
  isLoading: boolean;
  updateResource: (id: string, updates: Partial<Resource>) => Promise<boolean>;
  addResource: (resource: Omit<Resource, "id">) => Promise<string | null>;
  getResourceById: (id: string) => Resource | null;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export function ResourceProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const updateResource = async (id: string, updates: Partial<Resource>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResources(prev => prev.map(res => 
        res.id === id ? { ...res, ...updates } : res
      ));
      
      toast.success("Resource updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addResource = async (resource: Omit<Resource, "id">): Promise<string | null> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newId = `res${resources.length + 1}`;
      const newResource: Resource = {
        id: newId,
        ...resource
      };
      
      setResources(prev => [...prev, newResource]);
      toast.success("Resource added successfully!");
      return newId;
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Failed to add resource. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getResourceById = (id: string): Resource | null => {
    return resources.find(res => res.id === id) || null;
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      isLoading,
      updateResource,
      addResource,
      getResourceById
    }}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error("useResources must be used within a ResourceProvider");
  }
  return context;
}
