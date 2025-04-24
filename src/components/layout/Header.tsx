import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRepairRequests } from "@/context/RepairRequestContext";
import { UserRole } from "@/types";
import { Bell, Home, Map, LogOut, User, Settings, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { userNotifications, markNotificationAsRead } = useRepairRequests();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const unreadNotifications = userNotifications.filter(n => !n.read);
  
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Map className="h-8 w-8" />
          <span className="font-bold text-xl hidden sm:inline-block">City Road Rescue Hub</span>
          <span className="font-bold text-xl sm:hidden">CRRH</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-secondary-foreground transition-colors">Home</Link>
          <Link to="/services" className="hover:text-secondary-foreground transition-colors">Services</Link>
          <Link to="/about" className="hover:text-secondary-foreground transition-colors">About</Link>
          <Link to="/contact" className="hover:text-secondary-foreground transition-colors">Contact</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-xs flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2 font-medium">Notifications</div>
                  <DropdownMenuSeparator />
                  {userNotifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    userNotifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem key={notification.id} asChild>
                        <Link
                          to={notification.linkTo || "#"}
                          className={`p-3 block ${!notification.read ? "bg-secondary/50" : ""}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground">{notification.message}</div>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="justify-center font-medium">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* Role-specific menu items */}
                  {user?.role === UserRole.RESIDENT && (
                    <DropdownMenuItem asChild>
                      <Link to="/requests" className="cursor-pointer">
                        <Map className="mr-2 h-4 w-4" />
                        <span>My Requests</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {user?.role === UserRole.SUPERVISOR && (
                    <DropdownMenuItem asChild>
                      <Link to="/supervisor/dashboard" className="cursor-pointer">
                        <BarChart4 className="mr-2 h-4 w-4" />
                        <span>Supervisor Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {user?.role === UserRole.ADMINISTRATOR && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {user?.role === UserRole.MAYOR && (
                    <DropdownMenuItem asChild>
                      <Link to="/mayor/dashboard" className="cursor-pointer">
                        <BarChart4 className="mr-2 h-4 w-4" />
                        <span>Mayor Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="secondary">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-foreground text-primary">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="px-3 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="px-3 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="px-3 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/notifications" 
                  className="px-3 py-2 rounded-md hover:bg-secondary flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notifications
                  </span>
                  {unreadNotifications.length > 0 && (
                    <span className="h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center text-xs">
                      {unreadNotifications.length}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md hover:bg-secondary flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Link>
                
                {user?.role === UserRole.RESIDENT && (
                  <Link 
                    to="/requests" 
                    className="px-3 py-2 rounded-md hover:bg-secondary flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Map className="mr-2 h-5 w-5" />
                    My Requests
                  </Link>
                )}
                
                {user?.role === UserRole.SUPERVISOR && (
                  <Link 
                    to="/supervisor/dashboard" 
                    className="px-3 py-2 rounded-md hover:bg-secondary flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart4 className="mr-2 h-5 w-5" />
                    Supervisor Dashboard
                  </Link>
                )}
                
                {user?.role === UserRole.ADMINISTRATOR && (
                  <Link 
                    to="/admin/dashboard" 
                    className="px-3 py-2 rounded-md hover:bg-secondary flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Admin Dashboard
                  </Link>
                )}
                
                {user?.role === UserRole.MAYOR && (
                  <Link 
                    to="/mayor/dashboard" 
                    className="px-3 py-2 rounded-md hover:bg-secondary flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart4 className="mr-2 h-5 w-5" />
                    Mayor Dashboard
                  </Link>
                )}
                
                <button 
                  className="px-3 py-2 rounded-md hover:bg-secondary flex items-center text-left w-full"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
