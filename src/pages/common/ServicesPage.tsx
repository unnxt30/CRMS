
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Map, Bell } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Road Repair Requests",
      description: "Submit and track road repair requests in your area",
      icon: FileText,
    },
    {
      title: "Real-time Updates",
      description: "Get notifications on repair progress and completion",
      icon: Clock,
    },
    {
      title: "Location Tracking",
      description: "Track repair locations and view affected areas",
      icon: Map,
    },
    {
      title: "Notifications",
      description: "Receive alerts about repairs in your neighborhood",
      icon: Bell,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12">Our Services</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <service.icon className="w-8 h-8 mb-2" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
