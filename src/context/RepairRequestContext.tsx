
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RepairRequest, RequestStatus, RequestPriority, WorkOrder, Notification, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// Mock data for demo
const mockRepairRequests: RepairRequest[] = [
  {
    id: "req1",
    title: "Large pothole on Main Street",
    description: "There's a large pothole in the middle of Main Street near the intersection with Oak Avenue. It's about 2 feet wide and 6 inches deep.",
    location: "Main Street & Oak Avenue",
    latitude: 40.7128,
    longitude: -74.006,
    submittedBy: "user1",
    submittedAt: "2025-04-15T10:30:00Z",
    status: RequestStatus.IN_PROGRESS,
    priority: RequestPriority.HIGH,
    images: ["https://placehold.co/600x400?text=Pothole+Image"],
    estimatedCompletionDate: "2025-04-25T17:00:00Z",
    assignedTo: "user2",
    inspectionNotes: "This is a severe pothole that needs immediate attention. Risk of vehicle damage is high.",
    resourcesRequired: {
      materials: ["asphalt", "gravel"],
      manpower: 3,
      equipment: ["asphalt truck", "compactor"]
    }
  },
  {
    id: "req2",
    title: "Broken street light on Park Road",
    description: "The street light on Park Road near house number 142 is not working. The area is very dark at night.",
    location: "142 Park Road",
    latitude: 40.7125,
    longitude: -74.009,
    submittedBy: "user1",
    submittedAt: "2025-04-10T14:15:00Z",
    status: RequestStatus.SCHEDULED,
    priority: RequestPriority.MEDIUM,
    estimatedCompletionDate: "2025-04-23T12:00:00Z",
  },
  {
    id: "req3",
    title: "Clogged drain causing flooding",
    description: "The drain at the corner of Elm Street and River Road is clogged, causing flooding when it rains.",
    location: "Elm Street & River Road",
    submittedBy: "user1",
    submittedAt: "2025-04-18T08:45:00Z",
    status: RequestStatus.PENDING,
    priority: RequestPriority.LOW,
  },
  {
    id: "req4",
    title: "Damaged guardrail on Highway 7",
    description: "The guardrail on Highway 7 westbound, just after exit 23, is damaged and hanging into the road.",
    location: "Highway 7 Westbound, after exit 23",
    submittedBy: "user1",
    submittedAt: "2025-04-05T16:20:00Z",
    status: RequestStatus.COMPLETED,
    priority: RequestPriority.HIGH,
    estimatedCompletionDate: "2025-04-15T17:00:00Z",
    assignedTo: "user2",
  },
  {
    id: "req5",
    title: "Faded road markings on Central Avenue",
    description: "The road markings on Central Avenue between 5th and 8th Streets are very faded and barely visible, especially at night.",
    location: "Central Avenue between 5th and 8th Streets",
    submittedBy: "user1",
    submittedAt: "2025-04-12T11:05:00Z",
    status: RequestStatus.INSPECTED,
    priority: RequestPriority.MEDIUM,
    assignedTo: "user2",
  }
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo1",
    requestId: "req1",
    title: "Repair pothole on Main Street",
    description: "Fill and compact large pothole near intersection",
    assignedTo: ["worker1", "worker2", "worker3"],
    startDate: "2025-04-20T08:00:00Z",
    endDate: "2025-04-20T17:00:00Z",
    status: "in_progress",
    resources: [
      { resourceId: "res1", quantity: 50 },
      { resourceId: "res2", quantity: 3 },
      { resourceId: "res3", quantity: 2 }
    ]
  },
  {
    id: "wo2",
    requestId: "req2",
    title: "Replace street light on Park Road",
    description: "Replace broken light fixture and check wiring",
    assignedTo: ["worker4", "worker5"],
    startDate: "2025-04-23T09:00:00Z",
    endDate: "2025-04-23T12:00:00Z",
    status: "pending",
    resources: [
      { resourceId: "res4", quantity: 1 },
      { resourceId: "res5", quantity: 2 }
    ]
  },
  {
    id: "wo3",
    requestId: "req4",
    title: "Repair guardrail on Highway 7",
    description: "Replace damaged section and secure to posts",
    assignedTo: ["worker1", "worker6", "worker7"],
    startDate: "2025-04-10T07:00:00Z",
    endDate: "2025-04-10T15:00:00Z",
    status: "completed",
    resources: [
      { resourceId: "res6", quantity: 10 },
      { resourceId: "res7", quantity: 3 },
      { resourceId: "res8", quantity: 1 }
    ]
  }
];

const mockNotifications: Notification[] = [
  {
    id: "notif1",
    userId: "user1",
    title: "Request Update",
    message: "Your repair request for 'Large pothole on Main Street' has been inspected and scheduled for repair.",
    read: false,
    createdAt: "2025-04-16T14:30:00Z",
    type: "info",
    linkTo: "/requests/req1"
  },
  {
    id: "notif2",
    userId: "user2",
    title: "New Assignment",
    message: "You've been assigned to inspect a new repair request: 'Clogged drain causing flooding'",
    read: false,
    createdAt: "2025-04-18T09:15:00Z",
    type: "info",
    linkTo: "/supervisor/requests/req3"
  },
  {
    id: "notif3",
    userId: "user3",
    title: "Resource Alert",
    message: "Low inventory alert: Asphalt stock is below threshold (15% remaining)",
    read: true,
    createdAt: "2025-04-17T11:45:00Z",
    type: "warning",
    linkTo: "/admin/resources"
  }
];

interface RepairRequestContextType {
  requests: RepairRequest[];
  workOrders: WorkOrder[];
  notifications: Notification[];
  userRequests: RepairRequest[];
  userNotifications: Notification[];
  isLoading: boolean;
  createRequest: (request: Partial<RepairRequest>) => Promise<string | null>;
  updateRequest: (id: string, updates: Partial<RepairRequest>) => Promise<boolean>;
  getRequestById: (id: string) => RepairRequest | null;
  getWorkOrdersByRequestId: (requestId: string) => WorkOrder[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const RepairRequestContext = createContext<RepairRequestContextType | undefined>(undefined);

export function RepairRequestProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RepairRequest[]>(mockRepairRequests);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter requests and notifications for the current user
  const userRequests = requests.filter(req => 
    user?.role === UserRole.RESIDENT ? req.submittedBy === user.id : true
  );
  
  const userNotifications = notifications.filter(notif => 
    !notif.userId || notif.userId === user?.id
  );

  const createRequest = async (request: Partial<RepairRequest>): Promise<string | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: RepairRequest = {
        id: `req${requests.length + 1}`,
        title: request.title || "",
        description: request.description || "",
        location: request.location || "",
        latitude: request.latitude,
        longitude: request.longitude,
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        status: RequestStatus.PENDING,
        images: request.images || [],
      };
      
      setRequests(prev => [...prev, newRequest]);
      toast.success("Repair request submitted successfully!");
      
      // Add a notification for supervisors
      const supervisorNotif: Notification = {
        id: `notif${notifications.length + 1}`,
        userId: "user2", // Assumes user2 is a supervisor
        title: "New Repair Request",
        message: `A new repair request has been submitted: "${newRequest.title}"`,
        read: false,
        createdAt: new Date().toISOString(),
        type: "info",
        linkTo: `/supervisor/requests/${newRequest.id}`
      };
      
      setNotifications(prev => [...prev, supervisorNotif]);
      
      return newRequest.id;
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Failed to submit repair request. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequest = async (id: string, updates: Partial<RepairRequest>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, ...updates } : req
      ));
      
      // If status changed, create a notification for the resident
      const request = requests.find(r => r.id === id);
      if (request && updates.status && updates.status !== request.status) {
        const userNotif: Notification = {
          id: `notif${notifications.length + 1}`,
          userId: request.submittedBy,
          title: "Request Status Updated",
          message: `Your repair request "${request.title}" status has changed to ${updates.status}.`,
          read: false,
          createdAt: new Date().toISOString(),
          type: "info",
          linkTo: `/requests/${id}`
        };
        
        setNotifications(prev => [...prev, userNotif]);
      }
      
      toast.success("Repair request updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update repair request. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getRequestById = (id: string): RepairRequest | null => {
    return requests.find(req => req.id === id) || null;
  };

  const getWorkOrdersByRequestId = (requestId: string): WorkOrder[] => {
    return workOrders.filter(wo => wo.requestId === requestId);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    if (!user) return;
    
    setNotifications(prev => prev.map(notif => 
      notif.userId === user.id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <RepairRequestContext.Provider value={{
      requests,
      workOrders,
      notifications,
      userRequests,
      userNotifications,
      isLoading,
      createRequest,
      updateRequest,
      getRequestById,
      getWorkOrdersByRequestId,
      markNotificationAsRead,
      clearAllNotifications
    }}>
      {children}
    </RepairRequestContext.Provider>
  );
}

export function useRepairRequests() {
  const context = useContext(RepairRequestContext);
  if (context === undefined) {
    throw new Error("useRepairRequests must be used within a RepairRequestProvider");
  }
  return context;
}
