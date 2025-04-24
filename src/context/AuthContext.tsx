
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole, User } from "@/types";
import { toast } from "sonner";

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Resident",
    email: "resident@example.com",
    role: UserRole.RESIDENT,
    phone: "555-1234",
    address: "123 City Ave",
  },
  {
    id: "user2",
    name: "Sarah Supervisor",
    email: "supervisor@example.com",
    role: UserRole.SUPERVISOR,
    phone: "555-5678",
  },
  {
    id: "user3",
    name: "Alex Admin",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    phone: "555-9012",
  },
  {
    id: "user4",
    name: "Mayor Thompson",
    email: "mayor@example.com",
    role: UserRole.MAYOR,
    phone: "555-3456",
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  updateUserProfile: (updateData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth state on mount
    const savedUser = localStorage.getItem("cityRoadUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, find a matching user by email (in real app, would verify password too)
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("cityRoadUser", JSON.stringify(foundUser));
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("cityRoadUser");
    setUser(null);
    toast.info("Logged out successfully");
  };

  const register = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a new user in the database
      // For demo, we'll just pretend it worked
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updateData: Partial<User>) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user object
      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);
      localStorage.setItem("cityRoadUser", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
