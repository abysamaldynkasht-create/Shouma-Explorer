import { type User, type InsertUser, type RestaurantReview, type InsertRestaurantReview, type GroupTripRequest, type InsertGroupTripRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getRestaurantReviews(restaurantId: string): Promise<RestaurantReview[]>;
  createRestaurantReview(review: InsertRestaurantReview): Promise<RestaurantReview>;
  createGroupTripRequest(request: InsertGroupTripRequest): Promise<GroupTripRequest>;
  getGroupTripRequests(): Promise<GroupTripRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private restaurantReviews: Map<string, RestaurantReview>;
  private groupTripRequests: Map<number, GroupTripRequest>;
  private groupTripNextId: number;

  constructor() {
    this.users = new Map();
    this.restaurantReviews = new Map();
    this.groupTripRequests = new Map();
    this.groupTripNextId = 1;
    this.seedRestaurantReviews();
  }

  private seedRestaurantReviews() {
    const sampleReviews: RestaurantReview[] = [
      {
        id: "r1",
        restaurantId: "1",
        userName: "محمد العامري",
        rating: 5,
        comment: "مكان رائع وقهوة عمانية أصيلة، الأجواء التراثية مميزة جداً",
        date: "2024-01-15"
      },
      {
        id: "r2",
        restaurantId: "1",
        userName: "سارة البلوشي",
        rating: 4,
        comment: "الحلويات لذيذة والخدمة ممتازة، أنصح بزيارته",
        date: "2024-01-10"
      },
      {
        id: "r3",
        restaurantId: "3",
        userName: "أحمد الهاشمي",
        rating: 5,
        comment: "المضغوط الأفضل في البريمي بلا منازع!",
        date: "2024-02-01"
      },
      {
        id: "r4",
        restaurantId: "5",
        userName: "فاطمة الحارثي",
        rating: 5,
        comment: "إطلالة خيالية على قلعة نزوى، تجربة لا تُنسى",
        date: "2024-01-20"
      },
    ];
    sampleReviews.forEach(review => {
      this.restaurantReviews.set(review.id, review);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getRestaurantReviews(restaurantId: string): Promise<RestaurantReview[]> {
    return Array.from(this.restaurantReviews.values())
      .filter(review => review.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createRestaurantReview(insertReview: InsertRestaurantReview): Promise<RestaurantReview> {
    const id = randomUUID();
    const review: RestaurantReview = {
      ...insertReview,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    this.restaurantReviews.set(id, review);
    return review;
  }

  async createGroupTripRequest(request: InsertGroupTripRequest): Promise<GroupTripRequest> {
    const id = this.groupTripNextId++;
    const tripRequest: GroupTripRequest = {
      ...request,
      id,
      createdAt: new Date(),
    };
    this.groupTripRequests.set(id, tripRequest);
    return tripRequest;
  }

  async getGroupTripRequests(): Promise<GroupTripRequest[]> {
    return Array.from(this.groupTripRequests.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new MemStorage();
