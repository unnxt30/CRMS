
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge, PriorityBadge } from "@/components/common/StatusBadge";
import { RequestStatus, RequestPriority } from "@/types";
import { MapPin, Calendar, Clock, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function RequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getRequestById, isLoading } = useRepairRequests();
  const [request, setRequest] = useState(id ? getRequestById(id) : null);
  
  useEffect(() => {
    if (id) {
      setRequest(getRequestById(id));
    }
  }, [id, getRequestById]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }
  
  if (!request) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Request Not Found</h2>
            <p className="mb-6">The repair request you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/requests")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const statusMessages = {
    [RequestStatus.PENDING]: "Your request has been received and is awaiting review by our team.",
    [RequestStatus.INSPECTED]: "Our team has inspected the issue and is determining the best course of action.",
    [RequestStatus.SCHEDULED]: "Repairs have been scheduled. Work will begin soon.",
    [RequestStatus.IN_PROGRESS]: "Repairs are currently underway. Thank you for your patience.",
    [RequestStatus.COMPLETED]: "Repairs have been completed. Thank you for reporting this issue.",
    [RequestStatus.REJECTED]: "We're unable to proceed with this request. Please see the notes for details.",
  };
  
  const statusIcons = {
    [RequestStatus.PENDING]: <Clock className="h-6 w-6 text-yellow-500" />,
    [RequestStatus.INSPECTED]: <AlertTriangle className="h-6 w-6 text-blue-500" />,
    [RequestStatus.SCHEDULED]: <Calendar className="h-6 w-6 text-purple-500" />,
    [RequestStatus.IN_PROGRESS]: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    [RequestStatus.COMPLETED]: <CheckCircle className="h-6 w-6 text-green-500" />,
    [RequestStatus.REJECTED]: <AlertTriangle className="h-6 w-6 text-red-500" />,
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Button>
        </div>
        
        <PageHeader 
          title={request.title}
          description={`Request ID: ${request.id}`}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{request.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                      {request.location}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reported On</h3>
                    <p className="mt-1">
                      {formatDate(request.submittedAt)}
                    </p>
                  </div>
                  
                  {request.estimatedCompletionDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Estimated Completion</h3>
                      <p className="mt-1">
                        {formatDate(request.estimatedCompletionDate)}
                      </p>
                    </div>
                  )}
                  
                  {request.inspectionNotes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Inspection Notes</h3>
                      <p className="mt-1">{request.inspectionNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {request.images && request.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {request.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-md">
                        <img
                          src={image}
                          alt={`Issue ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {statusIcons[request.status]}
                  <StatusBadge status={request.status} className="text-base px-3 py-1" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {statusMessages[request.status]}
                </p>
                
                {request.priority && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                    <PriorityBadge priority={request.priority} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {request.resourcesRequired && (
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {request.resourcesRequired.manpower > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Manpower</h3>
                        <p>{request.resourcesRequired.manpower} workers</p>
                      </div>
                    )}
                    
                    {request.resourcesRequired.materials && request.resourcesRequired.materials.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Materials</h3>
                        <ul className="list-disc pl-5 text-sm">
                          {request.resourcesRequired.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {request.resourcesRequired.equipment && request.resourcesRequired.equipment.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Equipment</h3>
                        <ul className="list-disc pl-5 text-sm">
                          {request.resourcesRequired.equipment.map((equipment, index) => (
                            <li key={index}>{equipment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
