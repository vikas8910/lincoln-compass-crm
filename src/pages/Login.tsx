import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import { login } from "@/services/auth/auth";
import { useUser } from "@/context/UserProvider";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";

type UserType = "admin" | "sales";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const { setAuthoritiesList } = useAuthoritiesList();
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
    setIsLoading(true);

    try {
      // This is a mock authentication function
      // In a real app, you would make an API call to your backend
      const res = await authenticate(email, password);
      if (rememberMe) {
        localStorage.setItem("crm_email", email);
      } else {
        localStorage.removeItem("crm_email");
      }
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (email: string, password: string) => {
    const res = await login(email, password);
    localStorage.setItem("accessToken", res.accessToken);
    setAuthoritiesList(res.authorities);
    setUser(res.user);
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
  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

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
              {/* {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )} */}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter you email"
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
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                      <FiEyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FiEye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => 
                    setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm justify-evenly">
                  Remember me
                </Label> <Button
                    variant="link"
                    type="button"
                    className="p-0 text-xs"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </Button>
              </div> */}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
