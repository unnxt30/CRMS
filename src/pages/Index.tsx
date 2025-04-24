
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRightIcon, CheckCircle2, MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function Index() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Making Our City Roads Better Together
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Report road issues, track repairs, and be part of the solution. 
              Our platform connects citizens with city officials for faster, more efficient road repairs.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg" className="font-semibold">
                  <Link to="/requests/new">
                    Report an Issue <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="font-semibold">
                  <Link to="/login">
                    Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-accent/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-secondary/40 rounded-full blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1506739407668-a3740611b9f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="City Road" 
                className="rounded-2xl shadow-2xl relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* How it works section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform streamlines the road repair process from citizen reports to completed repairs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg overflow-hidden border-t-4 border-primary">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <MapPin size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Report an Issue</h3>
                <p className="text-gray-600">
                  Submit details about road issues in your area, including location and photos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg overflow-hidden border-t-4 border-primary">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Clock size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Track Progress</h3>
                <p className="text-gray-600">
                  Follow the status of your reported issues through real-time updates and notifications.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg overflow-hidden border-t-4 border-primary">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Problem Solved</h3>
                <p className="text-gray-600">
                  See your reported issues resolved and contribute to making our city better.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Benefits section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use City Road Rescue Hub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers benefits for both citizens and city officials.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Process</h3>
              <p className="text-gray-600">
                Track repairs from submission to completion with full transparency.
              </p>
            </div>
            
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Faster Resolution</h3>
              <p className="text-gray-600">
                Efficiently prioritized repairs mean faster resolution of issues.
              </p>
            </div>
            
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Priority Assignment</h3>
              <p className="text-gray-600">
                Critical issues are identified and addressed with proper urgency.
              </p>
            </div>
            
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Local Impact</h3>
              <p className="text-gray-600">
                Contribute directly to improving your neighborhood and community.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Our City Roads?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of citizens who are already making a difference in our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/requests/new">Report an Issue</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <Link to="/register">Create an Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold text-white border-white hover:bg-white/10">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
