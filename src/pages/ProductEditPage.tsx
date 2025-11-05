import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserStore } from '@/stores/userStore';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { ArrowLeft } from 'lucide-react';
import type { Product } from '@shared/types';
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string({ required_error: "Please select a category." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
});
const categories = ["Fruits", "Vegetables", "Bakery", "Dairy & Eggs", "Pantry"];
export function ProductEditPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const user = useUserStore(s => s.user);
  const userProducts = useUserStore(s => s.products);
  const addProduct = useUserStore(s => s.addProduct);
  const updateProduct = useUserStore(s => s.updateProduct);
  const productToEdit = isEditMode ? userProducts.find(p => p.id === productId) : null;
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditMode && productToEdit ? {
      name: productToEdit.name,
      description: productToEdit.description,
      price: productToEdit.price,
      category: productToEdit.category,
      imageUrl: productToEdit.imageUrl,
    } : {
      name: "",
      description: "",
      price: 0,
      category: undefined,
      imageUrl: "",
    },
  });
  const onSubmit = (values: z.infer<typeof productSchema>) => {
    if (!user) return;
    if (isEditMode && productToEdit) {
      const updatedProduct: Product = {
        ...productToEdit,
        ...values,
      };
      updateProduct(updatedProduct);
      toast.success("Product updated successfully!");
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        sellerName: user.name,
        ...values,
      };
      addProduct(newProduct);
      toast.success("Product created successfully!");
    }
    setTimeout(() => navigate('/profile'), 1500);
  };
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/profile"><ArrowLeft className="mr-2 h-4 w-4" />Back to Profile</Link>
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>{isEditMode ? 'Edit Product' : 'Create New Listing'}</CardTitle>
                <CardDescription>
                  {isEditMode ? 'Update the details of your product.' : 'Fill out the form to list a new product on the marketplace.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Organic Hass Avocados" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe your product in detail..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl><Input type="number" step="0.01" placeholder="e.g., 2.50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                        <FormDescription>Enter a direct link to your product image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Listing'}</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </MainLayout>
  );
}