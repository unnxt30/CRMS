
import { useState } from "react";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DownloadReportButton } from "@/components/resident/DownloadReportButton";
import { format } from "date-fns";
import { Clock, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function RepairHistory() {
  const { userRequests } = useRepairRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  // Sort requests by submission date (newest first)
  const sortedRequests = [...userRequests].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  
  // Filter requests based on search query and status filter
  const filteredRequests = sortedRequests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout sidebarLinks={[]} title="Request History">
      <h1 className="text-2xl font-bold mb-6">Your Repair Request History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Past Requests</span>
            <div className="flex gap-2 text-sm">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inspected">Inspected</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h3 className="font-medium text-lg">No request history found</h3>
              <p className="text-gray-500">
                {statusFilter || searchQuery 
                  ? "Try changing your search or filter criteria" 
                  : "You haven't submitted any repair requests yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{format(new Date(request.submittedAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.location}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        {request.status === "completed" && request.estimatedCompletionDate 
                          ? format(new Date(request.estimatedCompletionDate), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DownloadReportButton request={request} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
