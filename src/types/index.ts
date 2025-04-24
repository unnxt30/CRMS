
export enum UserRole {
  RESIDENT = "resident",
  SUPERVISOR = "supervisor",
  ADMINISTRATOR = "administrator",
  MAYOR = "mayor"
}

export enum RequestStatus {
  PENDING = "pending",
  INSPECTED = "inspected",
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  REJECTED = "rejected"
}

export enum RequestPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  EMERGENCY = "emergency"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface RepairRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  submittedBy: string;
  submittedAt: string;
  status: RequestStatus;
  priority?: RequestPriority;
  images?: string[];
  estimatedCompletionDate?: string;
  assignedTo?: string;
  inspectionNotes?: string;
  resourcesRequired?: {
    materials: string[];
    manpower: number;
    equipment: string[];
  };
}

export interface Resource {
  id: string;
  name: string;
  type: "manpower" | "equipment" | "material";
  quantity: number;
  available: number;
  unit: string;
}

export interface WorkOrder {
  id: string;
  requestId: string;
  title: string;
  description: string;
  assignedTo: string[];
  startDate: string;
  endDate: string;
  status: "pending" | "in_progress" | "completed" | "delayed";
  resources: {
    resourceId: string;
    quantity: number;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "info" | "warning" | "success" | "error";
  linkTo?: string;
}
