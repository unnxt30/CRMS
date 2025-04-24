
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge, PriorityBadge } from "@/components/common/StatusBadge";
import { RequestStatus, RequestPriority } from "@/types";
import { format } from "date-fns";
import { Search, Filter } from "lucide-react";

import { supervisorLinks } from "@/routes/sidebarLinks";

export default function RequestManagement() {
  const navigate = useNavigate();
  const { requests, isLoading } = useRepairRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "" || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  return (
    <DashboardLayout sidebarLinks={supervisorLinks} title="Supervisor Dashboard">
      <h1 className="text-2xl font-bold mb-6">Request Management</h1>
      
      <Card>
        <div className="p-4 border-b flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value={RequestStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={RequestStatus.INSPECTED}>Inspected</SelectItem>
                  <SelectItem value={RequestStatus.SCHEDULED}>Scheduled</SelectItem>
                  <SelectItem value={RequestStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={RequestStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={RequestStatus.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value={RequestPriority.LOW}>Low</SelectItem>
                  <SelectItem value={RequestPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={RequestPriority.HIGH}>High</SelectItem>
                  <SelectItem value={RequestPriority.EMERGENCY}>Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse">Loading requests...</div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No requests found</h3>
            <p className="text-gray-500 mb-4">
              Try changing your search or filter criteria.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
              setPriorityFilter("");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {request.location}
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.submittedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      {request.priority ? (
                        <PriorityBadge priority={request.priority} />
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/supervisor/requests/${request.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
