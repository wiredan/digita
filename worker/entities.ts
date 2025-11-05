import { IndexedEntity } from "./core-utils";
import type { UserProfile, Product, Order } from "@shared/types";
import { MOCK_PRODUCTS, MOCK_USER_PROFILE, MOCK_ORDERS, MOCK_USER_PRODUCTS } from "../src/lib/constants";

export class UserProfileEntity extends IndexedEntity<UserProfile> {
  static readonly entityName = "userProfile";
  static readonly indexName = "userProfiles";
  static readonly initialState: UserProfile = { id: "", name: "", email: "", kycStatus: 'not_started' };
  static seedData = [MOCK_USER_PROFILE];
}

export class ProductEntity extends IndexedEntity<Product> {
  static readonly entityName = "product";
  static readonly indexName = "products";
  static readonly initialState: Product = { id: "", name: "", description: "", price: 0, imageUrl: "", sellerName: "", category: "" };
  static seedData = MOCK_PRODUCTS;
}

export class OrderEntity extends IndexedEntity<Order> {
  static readonly entityName = "order";
  static readonly indexName = "orders";
  static readonly initialState: Order = {
    id: "",
    orderNumber: "",
    product: MOCK_PRODUCTS[0],
    buyerId: "",
    status: 'placed',
    date: new Date().toISOString()
  };
  static seedData = MOCK_ORDERS;
}