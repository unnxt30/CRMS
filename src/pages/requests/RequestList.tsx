
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RequestStatus } from "@/types";
import { format } from "date-fns";
import { Search, Plus } from "lucide-react";

export default function RequestList() {
  const navigate = useNavigate();
  const { userRequests, isLoading } = useRepairRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const filteredRequests = userRequests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <PageHeader 
          title="My Repair Requests" 
          description="Track and manage your submitted road repair requests."
          action={
            <Button onClick={() => navigate("/requests/new")}>
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          }
        />
        
        <Card className="mt-8">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
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
                {searchQuery || statusFilter
                  ? "Try changing your search or filter criteria."
                  : "You haven't submitted any repair requests yet."}
              </p>
              <Button onClick={() => navigate("/requests/new")}>
                <Plus className="mr-2 h-4 w-4" /> Submit a New Request
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.title}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>
                        {format(new Date(request.submittedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/requests/${request.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
