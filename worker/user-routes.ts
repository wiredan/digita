import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserProfileEntity, ProductEntity, OrderEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MOCK_USER_PROFILE, MOCK_ORDERS, MOCK_USER_PRODUCTS } from "../src/lib/constants";
import type { LoginResponse, Product } from "@shared/types";
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
    // In a real app, sellerName would come from the authenticated user session.
    const newProduct: Product = {
      id: `prod_${crypto.randomUUID()}`,
      sellerName: MOCK_USER_PROFILE.name, // Mocked for now
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
    // Ensure the ID from the URL is used, not from the body
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
  // AUTHENTICATION
  app.post('/api/auth/login', async (c) => {
    const userProfile = MOCK_USER_PROFILE;
    const userOrders = MOCK_ORDERS;
    // For mock purposes, we return a subset of all products as "user products"
    const allProducts = (await ProductEntity.list(c.env)).items;
    const userProducts = allProducts.filter(p => p.sellerName === MOCK_USER_PROFILE.name);
    const response: LoginResponse = {
      user: userProfile,
      orders: userOrders,
      products: userProducts.length > 0 ? userProducts : MOCK_USER_PRODUCTS, // Fallback for initial seed
    };
    return ok(c, response);
  });
}