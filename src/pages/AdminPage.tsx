import { useState, useEffect } from 'react';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, AlertCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from '@/lib/api-client';
import type { AdminUser, Dispute } from '../../shared/types';
import { Skeleton } from '@/components/ui/skeleton';
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
  disputed: { text: 'Disputed', variant: 'destructive' },
};
export function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoadingUsers(true);
        setLoadingDisputes(true);
        const [usersData, disputesData] = await Promise.all([
          api<AdminUser[]>('/api/admin/users'),
          api<Dispute[]>('/api/admin/disputes'),
        ]);
        setUsers(usersData);
        setDisputes(disputesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch admin data.');
      } finally {
        setLoadingUsers(false);
        setLoadingDisputes(false);
      }
    };
    fetchAdminData();
  }, []);
  const renderUserTable = () => {
    if (loadingUsers) {
      return Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ));
    }
    return users.map(user => (
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
    ));
  };
  const renderDisputeTable = () => {
    if (loadingDisputes) {
      return Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
      ));
    }
    return disputes.map(dispute => (
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
    ));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-16 md:py-24">
        <header className="mb-12">
          <h1 className="text-4xl font-bold font-display text-foreground">Admin Panel</h1>
          <p className="mt-2 text-lg text-muted-foreground">Oversee platform operations and manage users.</p>
        </header>
        {error && <div className="text-destructive text-center mb-4">{error}</div>}
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
                  <TableBody>{renderUserTable()}</TableBody>
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
                  <TableBody>{renderDisputeTable()}</TableBody>
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
  );
}