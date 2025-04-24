
import { RequestStatus, RequestPriority } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case RequestStatus.INSPECTED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case RequestStatus.SCHEDULED:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case RequestStatus.IN_PROGRESS:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case RequestStatus.COMPLETED:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case RequestStatus.REJECTED:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: RequestStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-normal", getStatusColor(status), className)}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: RequestPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityColor = (priority: RequestPriority) => {
    switch (priority) {
      case RequestPriority.LOW:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case RequestPriority.MEDIUM:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case RequestPriority.HIGH:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case RequestPriority.EMERGENCY:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-normal", getPriorityColor(priority), className)}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
