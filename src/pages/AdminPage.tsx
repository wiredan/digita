import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_ADMIN_USERS, MOCK_DISPUTES } from '@/lib/constants';
import { CheckCircle, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const kycStatusMap = {
  verified: { text: 'Verified', variant: 'default', icon: <CheckCircle className="mr-2 h-4 w-4" /> },
  pending: { text: 'Pending', variant: 'secondary', icon: <Clock className="mr-2 h-4 w-4" /> },
  rejected: { text: 'Rejected', variant: 'destructive', icon: <AlertCircle className="mr-2 h-4 w-4" /> },
  not_started: { text: 'Not Started', variant: 'outline', icon: <AlertCircle className="mr-2 h-4 w-4" /> },
};
const disputeStatusMap = {
  open: { text: 'Open', variant: 'destructive' },
  resolved: { text: 'Resolved', variant: 'default' },
  escalated: { text: 'Escalated', variant: 'secondary' },
};
export function AdminPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <header className="mb-12">
            <h1 className="text-4xl font-bold font-display text-foreground">Admin Panel</h1>
            <p className="mt-2 text-lg text-muted-foreground">Oversee platform operations and manage users.</p>
          </header>
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
              <TabsTrigger value="settings">Platform Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>View and manage all registered users.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_ADMIN_USERS.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={kycStatusMap[user.kycStatus].variant as any}>
                              {kycStatusMap[user.kycStatus].icon}
                              {kycStatusMap[user.kycStatus].text}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Suspend User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="disputes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Disputes</CardTitle>
                  <CardDescription>Review and resolve user-reported disputes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Raised</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_DISPUTES.map(dispute => (
                        <TableRow key={dispute.id}>
                          <TableCell className="font-medium">{dispute.orderNumber}</TableCell>
                          <TableCell>{dispute.productName}</TableCell>
                          <TableCell>
                            <Badge variant={disputeStatusMap[dispute.status].variant as any}>
                              {disputeStatusMap[dispute.status].text}
                            </Badge>
                          </TableCell>
                          <TableCell>{dispute.date}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Resolve</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure global settings for the marketplace.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Global settings form will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}