const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tourism-web-backend.onrender.com";

const DUMMY_CREDENTIALS = [
  {
    email: "admin@travelhub.com",
    password: "admin123",
    user: {
      id: "1",
      email: "admin@travelhub.com",
      name: "Admin User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "admin" as const,
    },
  },
  {
    email: "user@travelhub.com",
    password: "user123",
    user: {
      id: "2",
      email: "user@travelhub.com",
      name: "John Traveler",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "user" as const,
    },
  },
  {
    email: "demo@travelhub.com",
    password: "demo123",
    user: {
      id: "3",
      email: "demo@travelhub.com",
      name: "Demo User",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "user" as const,
    },
  },
];

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  amenities: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  hotelId?: string;
  destinationId?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

class ApiService {
  private get isMockMode(): boolean {
    return (
      process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL
    );
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("auth_token");

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    if (this.isMockMode) {
      const credential = DUMMY_CREDENTIALS.find(
        (cred) => cred.email === email && cred.password === password
      );
      if (credential) {
        return {
          user: credential.user,
          token: `mock_token_${credential.user.id}`,
        };
      } else {
        throw new Error("Invalid credentials");
      }
    }

    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    if (this.isMockMode) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        role: "user",
      };
      return {
        user: newUser,
        token: `mock_token_${newUser.id}`,
      };
    }

    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout(): Promise<void> {
    if (this.isMockMode) {
      return Promise.resolve();
    }

    return this.request("/auth/logout", { method: "POST" });
  }

  // Destinations endpoints
  async getDestinations(params?: {
    search?: string;
    category?: string;
    featured?: boolean;
  }): Promise<Destination[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.featured) searchParams.append("featured", "true");

    return this.request(`/destinations?${searchParams.toString()}`);
  }

  async getDestination(id: string): Promise<Destination> {
    return this.request(`/destinations/${id}`);
  }

  // Hotels endpoints
  async getHotels(
    destinationId?: string,
    params?: { search?: string; minPrice?: number; maxPrice?: number }
  ): Promise<Hotel[]> {
    const searchParams = new URLSearchParams();
    if (destinationId) searchParams.append("destinationId", destinationId);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.minPrice)
      searchParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice)
      searchParams.append("maxPrice", params.maxPrice.toString());

    return this.request(`/hotels?${searchParams.toString()}`);
  }

  async getHotel(id: string): Promise<Hotel> {
    return this.request(`/hotels/${id}`);
  }

  // Bookings endpoints
  async createBooking(
    booking: Omit<Booking, "id" | "status" | "createdAt">
  ): Promise<Booking> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    });
  }

  async getUserBookings(): Promise<Booking[]> {
    return this.request("/bookings/user");
  }

  async cancelBooking(id: string): Promise<void> {
    return this.request(`/bookings/${id}/cancel`, { method: "PUT" });
  }

  // Reviews endpoints
  async getReviews(
    hotelId?: string,
    destinationId?: string
  ): Promise<Review[]> {
    const searchParams = new URLSearchParams();
    if (hotelId) searchParams.append("hotelId", hotelId);
    if (destinationId) searchParams.append("destinationId", destinationId);

    return this.request(`/reviews?${searchParams.toString()}`);
  }

  async createReview(
    review: Omit<Review, "id" | "createdAt" | "user">
  ): Promise<Review> {
    return this.request("/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    });
  }

  // Admin endpoints
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalBookings: number;
    totalRevenue: number;
    recentBookings: Booking[];
  }> {
    return this.request("/admin/stats");
  }

  async getAllUsers(): Promise<User[]> {
    return this.request("/admin/users");
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.request("/admin/bookings");
  }
}

export const api = new ApiService();
