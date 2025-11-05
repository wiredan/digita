import { MainLayout } from '@/components/layout/MainLayout';
import { useUserStore } from '@/stores/userStore';
import { Navigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_ORDERS } from '@/lib/constants';
import { CheckCircle, Clock, AlertCircle, Truck, Package } from 'lucide-react';
import { format } from 'date-fns';
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
export function ProfilePage() {
  const user = useUserStore(s => s.user);
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  const { text: kycText, variant: kycVariant, icon: kycIcon } = kycStatusMap[user.kycStatus];
  return (
    <MainLayout>
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
                    <Button className="mt-4 w-full">Complete Verification</Button>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Tabs defaultValue="orders">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Orders</CardTitle>
                      <CardDescription>A list of your recent purchases.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {MOCK_ORDERS.map(order => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.orderNumber}</TableCell>
                              <TableCell>{order.product.name}</TableCell>
                              <TableCell>{format(new Date(order.date), 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {orderStatusMap[order.status].icon}
                                  <span>{orderStatusMap[order.status].text}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">${order.product.price.toFixed(2)}</TableCell>
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
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground">Settings form will be implemented here.</p>
                      <Button>Update Profile</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}