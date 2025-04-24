
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supervisorLinks } from "@/routes/sidebarLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Badge } from "@/components/ui/badge";
import { format, addHours } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { RequestStatus } from "@/types";

export default function SchedulePage() {
  const { requests, workOrders, updateRequest } = useRepairRequests();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState<any[]>([
    {
      id: "task1",
      title: "Inspect Pothole on Main Street",
      requestId: "req1",
      start: "09:00",
      end: "11:00",
      assignees: ["John Doe", "Mike Smith"],
      type: "Inspection"
    },
    {
      id: "task2",
      title: "Fix Street Light on Park Road",
      requestId: "req2",
      start: "13:00",
      end: "16:00",
      assignees: ["Lisa Johnson", "Robert Brown"],
      type: "Repair"
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    requestId: "",
    start: "09:00",
    end: "11:00",
    assignees: "",
    type: "Inspection"
  });

  const pendingRequests = requests.filter(req => 
    req.status !== RequestStatus.COMPLETED && req.status !== RequestStatus.REJECTED
  );

  const handleAddTask = () => {
    const task = {
      id: `task${scheduledTasks.length + 1}`,
      ...newTask,
      assignees: newTask.assignees.split(",").map(a => a.trim())
    };
    
    setScheduledTasks([...scheduledTasks, task]);
    
    // If the task is linked to a request, update the request status
    if (newTask.requestId) {
      updateRequest(newTask.requestId, {
        status: RequestStatus.SCHEDULED,
        estimatedCompletionDate: selectedDate ? addHours(selectedDate, 8).toISOString() : undefined
      });
    }
    
    setNewTask({
      title: "",
      requestId: "",
      start: "09:00",
      end: "11:00",
      assignees: "",
      type: "Inspection"
    });
    
    setIsDialogOpen(false);
    toast.success("Task scheduled successfully");
  };

  const formattedDate = selectedDate 
    ? format(selectedDate, "EEEE, MMMM d, yyyy")
    : "Select a date";

  return (
    <DashboardLayout sidebarLinks={supervisorLinks} title="Supervisor Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Schedule New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Maintenance Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Task Title</label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="request">Related Request (Optional)</label>
                <Select value={newTask.requestId} onValueChange={(value) => setNewTask({ ...newTask, requestId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a request" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingRequests.map((req) => (
                      <SelectItem key={req.id} value={req.id}>{req.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="start">Start Time</label>
                  <Input
                    id="start"
                    type="time"
                    value={newTask.start}
                    onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="end">End Time</label>
                  <Input
                    id="end"
                    type="time"
                    value={newTask.end}
                    onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="assignees">Assigned Workers (comma separated)</label>
                <Input
                  id="assignees"
                  value={newTask.assignees}
                  onChange={(e) => setNewTask({ ...newTask, assignees: e.target.value })}
                  placeholder="e.g. John Doe, Jane Smith"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="type">Task Type</label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTask} type="button">Schedule Task</Button>
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
            {scheduledTasks.length > 0 ? (
              <div className="space-y-4">
                {scheduledTasks.map((task) => (
                  <div key={task.id} className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{task.start} - {task.end}</span>
                        </div>
                      </div>
                      <Badge variant={task.type === "Inspection" ? "secondary" : task.type === "Repair" ? "default" : "outline"}>
                        {task.type}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">Assigned to:</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {task.assignees.map((worker: string, idx: number) => (
                          <Badge key={idx} variant="outline">{worker}</Badge>
                        ))}
                      </div>
                    </div>
                    {task.requestId && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Related Request: {task.requestId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-2">No tasks scheduled for this day</p>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
