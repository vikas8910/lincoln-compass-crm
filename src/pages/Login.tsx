
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User } from "lucide-react";

type UserType = "admin" | "sales";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);

    try {
      // This is a mock authentication function
      // In a real app, you would make an API call to your backend
      await mockAuthenticate(email, password);
      
      if (rememberMe) {
        localStorage.setItem("crm_email", email);
      } else {
        localStorage.removeItem("crm_email");
      }

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock authentication function - replace with actual API call in production
  const mockAuthenticate = async (email: string, password: string): Promise<UserType> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate admin login
        if (email === "admin@example.com" && password === "admin123") {
          localStorage.setItem("user_type", "admin");
          resolve("admin");
        } 
        // Simulate sales officer login
        else if (email === "sales@example.com" && password === "sales123") {
          localStorage.setItem("user_type", "sales");
          resolve("sales");
        } 
        else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000); // Simulate network delay
    });
  };

  const handleForgotPassword = () => {
    toast.info("Password reset functionality will be implemented soon.");
    // In a real app, you would redirect to a password reset page or show a modal
  };

  // Check if there's a remembered email on component mount
  useState(() => {
    const savedEmail = localStorage.getItem("crm_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Lincoln CRM</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>
        
        <Card className="border shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the CRM system
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    variant="link"
                    type="button"
                    className="p-0 text-xs"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => 
                    setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Demo credentials: <br />
            Admin: admin@example.com / admin123 <br />
            Sales: sales@example.com / sales123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
