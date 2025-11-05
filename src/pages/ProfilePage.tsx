import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, AlertCircle, Truck, Package, MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
const kycStatusMap = {
  verified: { text: 'Verified', variant: 'default', icon: <CheckCircle className="mr-2 h-4 w-4" /> },
  pending: { text: 'Pending', variant: 'secondary', icon: <Clock className="mr-2 h-4 w-4" /> },
  rejected: { text: 'Rejected', variant: 'destructive', icon: <AlertCircle className="mr-2 h-4 w-4" /> },
  not_started: { text: 'Not Started', variant: 'outline', icon: <AlertCircle className="mr-2 h-4 w-4" /> },
};
const orderStatusMap = {
  placed: { text: 'Placed', icon: <Package className="h-4 w-4 text-blue-500" /> },
  shipped: { text: 'Shipped', icon: <Truck className="h-4 w-4 text-orange-500" /> },
  delivered: { text: 'Delivered', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  cancelled: { text: 'Cancelled', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
  disputed: { text: 'Disputed', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
};
const settingsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});
type SettingsFormValues = z.infer<typeof settingsSchema>;
export function ProfilePage() {
  const user = useUserStore(s => s.user);
  const orders = useUserStore(s => s.orders);
  const products = useUserStore(s => s.products);
  const deleteProduct = useUserStore(s => s.deleteProduct);
  const updateProfile = useUserStore(s => s.updateProfile);
  const navigate = useNavigate();
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  const handleSettingsSubmit = async (values: SettingsFormValues) => {
    setIsSettingsLoading(true);
    try {
      await updateProfile(values);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSettingsLoading(false);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product.");
    }
  };
  const { text: kycText, variant: kycVariant, icon: kycIcon } = kycStatusMap[user.kycStatus];
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <header className="mb-12">
            <h1 className="text-4xl font-bold font-display text-foreground">My Profile</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage your account details and view your activity.</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-3xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center">
                    <Badge variant={kycVariant as any} className="text-sm">
                      {kycIcon}
                      KYC Status: {kycText}
                    </Badge>
                  </div>
                  {user.kycStatus !== 'verified' && (
                    <Button className="mt-4 w-full" asChild>
                      <Link to="/kyc">Complete Verification</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Tabs defaultValue="orders">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Orders</CardTitle>
                      <CardDescription>A list of your recent purchases. Click an order to see details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map(order => (
                            <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/order/${order.id}`)}>
                              <TableCell className="font-medium">{order.orderNumber}</TableCell>
                              <TableCell>{order.items.length} item(s)</TableCell>
                              <TableCell>{format(new Date(order.date), 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {orderStatusMap[order.status].icon}
                                  <span>{orderStatusMap[order.status].text}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="listings">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Product Listings</CardTitle>
                        <CardDescription>Manage the products you are selling on the marketplace.</CardDescription>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <Button asChild disabled={user.kycStatus !== 'verified'}>
                                <Link to="/profile/listings/new"><PlusCircle className="mr-2 h-4 w-4" />Create New Listing</Link>
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {user.kycStatus !== 'verified' && (
                            <TooltipContent>
                              <p>KYC verification is required to list products.</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map(product => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <AlertDialog>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem asChild><Link to={`/profile/listings/edit/${product.id}`}>Edit</Link></DropdownMenuItem>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                      </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your product listing.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...settingsForm}>
                        <form onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-6">
                          <FormField
                            control={settingsForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={settingsForm.control}
                            name="avatarUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Avatar URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/avatar.png" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isSettingsLoading}>
                            {isSettingsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Profile
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </>
  );
}