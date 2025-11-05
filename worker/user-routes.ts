import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserProfileEntity, ProductEntity, OrderEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MOCK_USER_PROFILE, MOCK_USER_PRODUCTS, MOCK_EDUCATION_CONTENT } from "../src/lib/constants";
import type { LoginResponse, Product, Order, UserProfile, AdminUser, Dispute } from "@shared/types";
import { format } from 'date-fns';
export function userRoutes(app: Hono<{Bindings: Env;}>) {
  app.use('/api/*', async (c, next) => {
    await Promise.all([
    UserProfileEntity.ensureSeed(c.env),
    ProductEntity.ensureSeed(c.env),
    OrderEntity.ensureSeed(c.env)]
    );
    await next();
  });
  // PRODUCTS
  app.get('/api/products', async (c) => {
    const { items } = await ProductEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/products/:id', async (c) => {
    const { id } = c.req.param();
    const product = new ProductEntity(c.env, id);
    if (!(await product.exists())) {
      return notFound(c, 'Product not found');
    }
    return ok(c, await product.getState());
  });
  app.post('/api/products', async (c) => {
    const body = await c.req.json<Omit<Product, 'id' | 'sellerName'>>();
    if (!body.name || !body.description || !body.price || !body.category || !body.imageUrl) {
      return bad(c, 'Missing required product fields');
    }
    const newProduct: Product = {
      id: `prod_${crypto.randomUUID()}`,
      sellerName: MOCK_USER_PROFILE.name,
      ...body,
    };
    await ProductEntity.create(c.env, newProduct);
    return ok(c, newProduct);
  });
  app.put('/api/products/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Product>();
    const product = new ProductEntity(c.env, id);
    if (!(await product.exists())) {
      return notFound(c, 'Product not found');
    }
    const updatedProductData: Product = { ...body, id };
    await product.save(updatedProductData);
    return ok(c, updatedProductData);
  });
  app.delete('/api/products/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ProductEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Product not found');
    }
    return ok(c, { id });
  });
  // ORDERS
  app.get('/api/orders', async (c) => {
    const { items } = await OrderEntity.list(c.env);
    // In a real app, we'd filter by authenticated user ID
    const userOrders = items.filter(o => o.buyerId === MOCK_USER_PROFILE.id);
    return ok(c, userOrders);
  });
  app.get('/api/orders/:id', async (c) => {
    const { id } = c.req.param();
    const order = new OrderEntity(c.env, id);
    if (!(await order.exists())) {
      return notFound(c, 'Order not found');
    }
    return ok(c, await order.getState());
  });
  app.post('/api/orders', async (c) => {
    const { items, totalAmount } = await c.req.json<{ items: Product[], totalAmount: number }>();
    if (!items || items.length === 0 || !totalAmount) {
      return bad(c, 'Missing required order fields');
    }
    const newOrder: Order = {
      id: `order_${crypto.randomUUID()}`,
      orderNumber: `VD-${Math.floor(Math.random() * 900000) + 100000}`,
      items,
      totalAmount,
      buyerId: MOCK_USER_PROFILE.id, // Mocked for now
      status: 'placed',
      date: new Date().toISOString(),
    };
    await OrderEntity.create(c.env, newOrder);
    return ok(c, newOrder);
  });
  app.post('/api/orders/:id/dispute', async (c) => {
    const { id } = c.req.param();
    const order = new OrderEntity(c.env, id);
    if (!(await order.exists())) {
      return notFound(c, 'Order not found');
    }
    await order.mutate(o => ({ ...o, status: 'disputed' }));
    return ok(c, { message: 'Dispute submitted successfully' });
  });
  // AUTH & PROFILE
  app.post('/api/auth/login', async (c) => {
    const userProfile = MOCK_USER_PROFILE;
    const allOrders = (await OrderEntity.list(c.env)).items;
    const userOrders = allOrders.filter(o => o.buyerId === MOCK_USER_PROFILE.id);
    const allProducts = (await ProductEntity.list(c.env)).items;
    const userProducts = allProducts.filter(p => p.sellerName === MOCK_USER_PROFILE.name);
    const response: LoginResponse = {
      user: userProfile,
      orders: userOrders,
      products: userProducts.length > 0 ? userProducts : MOCK_USER_PRODUCTS,
    };
    return ok(c, response);
  });
  app.put('/api/profile', async (c) => {
    const body = await c.req.json<Partial<Pick<UserProfile, 'name' | 'avatarUrl'>>>();
    const user = new UserProfileEntity(c.env, MOCK_USER_PROFILE.id);
    if (!(await user.exists())) {
      return notFound(c, 'User not found');
    }
    const updatedUser = await user.mutate(u => ({ ...u, ...body }));
    return ok(c, updatedUser);
  });
  // EDUCATION
  app.get('/api/education', (c) => {
    return ok(c, MOCK_EDUCATION_CONTENT);
  });
  app.get('/api/education/:id', (c) => {
    const { id } = c.req.param();
    const article = MOCK_EDUCATION_CONTENT.find(a => a.id === id);
    if (!article) {
      return notFound(c, 'Article not found');
    }
    return ok(c, article);
  });
  // ADMIN
  app.get('/api/admin/users', async (c) => {
    const { items } = await UserProfileEntity.list(c.env);
    const adminUsers: AdminUser[] = items.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      kycStatus: u.kycStatus,
      joinDate: format(new Date(), 'yyyy-MM-dd'), // Mock join date
    }));
    return ok(c, adminUsers);
  });
  app.get('/api/admin/disputes', async (c) => {
    const { items } = await OrderEntity.list(c.env);
    const disputedOrders = items.filter(o => o.status === 'disputed');
    const disputes: Dispute[] = disputedOrders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      productName: o.items[0]?.name || 'N/A',
      status: 'disputed',
      date: o.date,
    }));
    return ok(c, disputes);
  });
}