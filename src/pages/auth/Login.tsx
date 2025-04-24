
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Check, LogIn } from "lucide-react";
import { UserRole } from "@/types";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const from = location.state?.from?.pathname || "/";
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password) {
      return;
    }
    
    const success = await login(email, password);
    
    if (success) {
      // Redirect to appropriate dashboard based on role
      navigate(from, { replace: true });
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-md mx-auto py-10">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium leading-none">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p>Demo accounts (any password will work):</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setEmail("resident@example.com")}
                  className="text-xs"
                >
                  Resident
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEmail("supervisor@example.com")}
                  className="text-xs"
                >
                  Supervisor
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEmail("admin@example.com")}
                  className="text-xs"
                >
                  Administrator
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEmail("mayor@example.com")}
                  className="text-xs"
                >
                  Mayor
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-gray-500 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
