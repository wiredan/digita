import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    <path fill="none" d="M1 1h22v22H1z"/>
  </svg>
);
const AppleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19.3,4.36a4.7,4.7,0,0,0-3.83,2.12,4.35,4.35,0,0,0-3.47-2.1,4.46,4.46,0,0,0-4.2,3.29A6.24,6.24,0,0,0,4.4,13.2a6.42,6.42,0,0,0,4.5,5.43,4.63,4.63,0,0,0,3.38-1.25,1.2,1.2,0,0,1,1.44,0,4.4,4.4,0,0,0,3.29,1.25,4.38,4.38,0,0,0,4.2-3.37,6.4,6.4,0,0,0-2.89-5.88A4.55,4.55,0,0,0,19.3,4.36ZM12,3.18a3.1,3.1,0,0,1,2.25.9,3.3,3.3,0,0,1,1.13,2.4,3.37,3.37,0,0,1-2.23,3.1,3.09,3.09,0,0,1-3.29-2.2A3.32,3.32,0,0,1,12,3.18Z"/>
    </svg>
);
const MicrosoftIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1,1H11V11H1Z"/>
        <path fill="#7FBA00" d="M13,1H23V11H13Z"/>
        <path fill="#00A4EF" d="M1,13H11V23H1Z"/>
        <path fill="#FFB900" d="M13,13H23V23H13Z"/>
    </svg>
);
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
export function AuthPage() {
  const navigate = useNavigate();
  const login = useUserStore(s => s.login);
  const [isLoading, setIsLoading] = useState(false);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "alex.doe@example.com", password: "password123" },
  });
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const handleAuthSubmit = async (isLogin: boolean, values: any) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast.success(`${isLogin ? 'Login' : 'Signup'} successful! Redirecting...`);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      toast.error(`${isLogin ? 'Login' : 'Signup'} failed. Please try again.`);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 flex items-center justify-center">
          <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Log In</CardTitle>
                  <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((v) => handleAuthSubmit(true, v))}>
                    <CardContent className="space-y-4">
                      <FormField control={loginForm.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={loginForm.control} name="password" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log In
                      </Button>
                    </CardContent>
                  </form>
                </Form>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <CardFooter className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" onClick={() => handleAuthSubmit(true, {email: 'alex.doe@example.com', password: 'password123'})}><GoogleIcon /> Google</Button>
                  <Button variant="outline" className="w-full" onClick={() => handleAuthSubmit(true, {email: 'alex.doe@example.com', password: 'password123'})}><MicrosoftIcon /> Microsoft</Button>
                  <Button variant="outline" className="w-full" onClick={() => handleAuthSubmit(true, {email: 'alex.doe@example.com', password: 'password123'})}><AppleIcon /> Apple</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>Create a new account to start trading.</CardDescription>
                </CardHeader>
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit((v) => handleAuthSubmit(false, v))}>
                    <CardContent className="space-y-4">
                      <FormField control={signupForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={signupForm.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={signupForm.control} name="password" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster richColors />
    </>
  );
}