
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
import { RequestStatus } from "@/types";

export default function RepairHistory() {
  const { userRequests } = useRepairRequests();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredRequests = userRequests
    .filter(request => {
      if (filter === "all") return true;
      if (filter === "completed") return request.status === RequestStatus.COMPLETED;
      if (filter === "in-progress") return request.status === RequestStatus.IN_PROGRESS;
      if (filter === "pending") return request.status === RequestStatus.PENDING;
      return true;
    })
    .filter(request => 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
  return (
    <DashboardLayout title="Your Repair History" description="View the status and history of your repair requests">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Repair History</h1>
        <p className="text-muted-foreground">View the status and history of all your repair requests</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Repair Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Filter:</span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32 md:w-40">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>{format(new Date(request.submittedAt), "MMM d, yyyy")}</TableCell>
                      <TableCell><StatusBadge status={request.status} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/requests/${request.id}`}>
                              <Eye className="mr-1 h-4 w-4" /> View
                            </Link>
                          </Button>
                          
                          {request.status === RequestStatus.COMPLETED && (
                            <DownloadReportButton request={request} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No repair requests found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchQuery || filter !== "all" 
                  ? "Try changing your search or filter settings"
                  : "You haven't submitted any repair requests yet"}
              </p>
              <Button asChild className="mt-4">
                <Link to="/requests/new">
                  <Plus className="mr-2 h-4 w-4" /> Submit New Request
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

// Missing imports
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, History, Plus, Search } from "lucide-react";
