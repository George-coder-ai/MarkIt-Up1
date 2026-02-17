
export interface ProductData {
  name: string;
  category: string;
  description: string;
  suggestedPrice: string;
  images: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  shopName: string;
  address: string;
  brandLogo?: string;
  connectedPlatforms: string[];
  connectedSocials: string[];
}

export interface Order {
  id: string;
  productName: string;
  quantity: number;
  buyerAddress: string;
  platform: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  timestamp: string;
}

export interface ReturnItem {
  id: string;
  orderId: string;
  productName: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Refunded';
}

export interface ScheduledPost {
  id: string;
  productName: string;
  platform: string;
  scheduledTime: string;
}

export interface ProductPerformance {
  productName: string;
  sales: number;
  reviews: number;
  rating: number;
  returns: number;
  cancellations: number;
}

export enum AppScreen {
  SPLASH = 'splash',
  LANGUAGE = 'language',
  LOGIN = 'login',
  SIGNUP = 'signup',
  DASHBOARD = 'dashboard',
  SETTINGS = 'settings'
}

export interface ProductContent {
  media: string[]; // base64 strings
  nativeAudio: string | null; // base64 string
  translatedText: string;
  productDetails: {
    name: string;
    category: string;
    price: string;
    quantity: string;
  };
}

export type DashboardTab = 'publish' | 'products' | 'orders' | 'profile' | 'performance' | 'social';
