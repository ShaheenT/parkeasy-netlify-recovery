export type AppMode = 'PARK' | 'HOST';

export type MainTab = 'marketplace' | 'bookings' | 'finance' | 'account' | 'events';

export interface ParkingListing {
  id: string;
  title: string;
  address: string;
  pricePerHour: number;
  rating: number;
  distance: number; // in miles/kms
  lat: number; // relative map coordinate x
  lng: number; // relative map coordinate y
  latitude?: number;
  longitude?: number;
  features: string[];
  isEV: boolean;
  isCovered: boolean;
  status: 'available' | 'reserved' | 'occupied';
  hostEarnings?: number;
  imageUrl?: string;
  isVipOnly?: boolean; // For exclusive VIP spaces
}

export interface CityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  isVerified: boolean;
  ticketPrice?: string;
  attendeesCount: number;
  sponsorFeePaid?: number; // Advertising fee
  vipParkingSpotsAvailable: number;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  address: string;
  priceTotal: number;
  startTime: string;
  endTime: string;
  timeLeftSeconds: number;
  status: 'upcoming' | 'active' | 'history';
  accessCode: string;
  isVip?: boolean;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'booking_payment' | 'host_payout' | 'host_earnings' | 'ad_fee' | 'vip_subscription';
  amount: number;
  date: string;
  title: string;
  status: 'completed' | 'pending';
}

