import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mayorLinks } from "@/routes/sidebarLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Plus, FileText } from "lucide-react"; // Change from FileChart to FileText

export default function GenerateReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { requests } = useRepairRequests();

  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    content: ""
  });

  const handleAddReport = () => {
    // In a real app, this would call the API to create the report
    toast.success("Report generated successfully");
    setIsDialogOpen(false);

    setNewReport({
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      content: ""
    });
  };

  const formattedDate = selectedDate
    ? format(selectedDate, "EEEE, MMMM d, yyyy")
    : "Select a date";

  return (
    <DashboardLayout sidebarLinks={mayorLinks} title="Mayor Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generate Reports</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Generate New Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Report</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Report Title</label>
                <Input
                  id="title"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="Enter report title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="Enter report description"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="date">Date</label>
                <Input
                  id="date"
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content">Content</label>
                <Textarea
                  id="content"
                  value={newReport.content}
                  onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  placeholder="Enter report content"
                />
              </div>
              <Button onClick={handleAddReport} type="button">Generate Report</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>No reports generated yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
