import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserProfileEntity, ProductEntity, OrderEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MOCK_USER_PROFILE, MOCK_ORDERS, MOCK_USER_PRODUCTS } from "../src/lib/constants";
import type { LoginResponse } from "@shared/types";
export function userRoutes(app: Hono<{Bindings: Env;}>) {

  app.use('/api/*', async (c, next) => {
    await Promise.all([
    UserProfileEntity.ensureSeed(c.env),
    ProductEntity.ensureSeed(c.env),
    OrderEntity.ensureSeed(c.env)]
    );
    await next();
  });

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

  app.post('/api/auth/login', async (c) => {


    const userProfile = MOCK_USER_PROFILE;
    const userOrders = MOCK_ORDERS;
    const userProducts = MOCK_USER_PRODUCTS;
    const response: LoginResponse = {
      user: userProfile,
      orders: userOrders,
      products: userProducts
    };
    return ok(c, response);
  });
}