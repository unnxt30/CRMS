
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { mayorLinks, supervisorLinks, adminLinks } from "@/routes/sidebarLinks";
import { UserRole } from "@/types";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userNotifications, markNotificationAsRead, clearAllNotifications } = useRepairRequests();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  // Determine which sidebar links to use based on user role
  let sidebarLinks = supervisorLinks;
  if (user?.role === UserRole.MAYOR) {
    sidebarLinks = mayorLinks;
  } else if (user?.role === UserRole.ADMIN) {
    sidebarLinks = adminLinks;
  }
  
  // Filter notifications based on selected filter
  const filteredNotifications = filter === "all" 
    ? userNotifications 
    : userNotifications.filter(notif => !notif.read);
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Handle clicking on a notification
  const handleNotificationClick = (id: string, linkTo?: string) => {
    markNotificationAsRead(id);
    if (linkTo) {
      navigate(linkTo);
    }
  };
  
  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <DashboardLayout sidebarLinks={sidebarLinks} title={`${user?.role || "User"} Dashboard`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "unread" ? "default" : "outline"} 
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button 
            variant="outline" 
            onClick={clearAllNotifications}
            disabled={!filteredNotifications.some(n => !n.read)}
          >
            Mark All as Read
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            <span>Your Notifications</span>
            {userNotifications.filter(n => !n.read).length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {userNotifications.filter(n => !n.read).length} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`flex gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-background' 
                      : 'bg-secondary/20 border-primary/20'
                  }`}
                  onClick={() => handleNotificationClick(notification.id, notification.linkTo)}
                >
                  <div className="shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {notification.message}
                    </p>
                    {notification.linkTo && (
                      <div className="mt-2">
                        <Button variant="link" className="p-0 h-auto text-sm text-primary">
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="shrink-0 self-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-3" />
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
