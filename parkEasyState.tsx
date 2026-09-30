import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppMode, MainTab, ParkingListing, Booking, Transaction, CityEvent } from '../types/navigation';
import { playCinematicSound } from '../components/AudioEngine';

interface ParkEasyContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  marketplaceSubTab: 'search' | 'explore' | 'live-map';
  setMarketplaceSubTab: (tab: 'search' | 'explore' | 'live-map') => void;
  bookingsSubTab: 'upcoming' | 'active' | 'history' | 'listings' | 'list-space';
  setBookingsSubTab: (tab: 'upcoming' | 'active' | 'history' | 'listings' | 'list-space') => void;
  financeSubTab: 'wallet' | 'transactions' | 'payouts';
  setFinanceSubTab: (tab: 'wallet' | 'transactions' | 'payouts') => void;
  accountSubTab: 'profile' | 'kyc' | 'settings' | 'list-space';
  setAccountSubTab: (tab: 'profile' | 'kyc' | 'settings' | 'list-space') => void;
  listings: ParkingListing[];
  setListings: (listings: ParkingListing[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  driverWallet: number;
  setDriverWallet: (val: number) => void;
  hostWallet: number;
  setHostWallet: (val: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedListing: ParkingListing | null;
  setSelectedListing: (listing: ParkingListing | null) => void;
  activeNavigationListing: ParkingListing | null;
  setActiveNavigationListing: (listing: ParkingListing | null) => void;
  createNewBooking: (listing: ParkingListing, hours: number, paymentMethod?: 'wallet' | 'payfast') => void;
  createNewListing: (listing: Omit<ParkingListing, 'id' | 'rating' | 'distance'>) => void;
  triggerPayout: () => void;
  isMobileSubNavVisible: boolean;
  setIsMobileSubNavVisible: (visible: boolean) => void;
  isWorkspaceOpen: boolean;
  setIsWorkspaceOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  showEventsOnMap: boolean;
  setShowEventsOnMap: (show: boolean) => void;
  activeLayer: 'streets' | 'sonar';
  setActiveLayer: (layer: 'streets' | 'sonar') => void;
  
  // City Events and Premium VIP Tier Fields
  cityEvents: CityEvent[];
  setCityEvents: (events: CityEvent[]) => void;
  selectedEvent: CityEvent | null;
  setSelectedEvent: (event: CityEvent | null) => void;
  isVipSubscriber: boolean;
  setIsVipSubscriber: (val: boolean) => void;
  verifyEvent: (eventId: string) => void;
  createEvent: (event: Omit<CityEvent, 'id' | 'isVerified' | 'attendeesCount' | 'vipParkingSpotsAvailable'> & { sponsorFeePaid?: number }) => void;
  subscribeToVip: () => boolean;
  bookVipParking: (event: CityEvent) => boolean;
}

const ParkEasyContext = createContext<ParkEasyContextType | undefined>(undefined);

const INITIAL_LISTINGS: ParkingListing[] = [
  {
    id: 'l1',
    title: 'Waterfront Secured Bay',
    address: 'Breakwater Blvd, Victoria & Alfred Waterfront',
    pricePerHour: 45.0,
    rating: 4.9,
    distance: 0.3,
    lat: 110,
    lng: 60,
    latitude: -33.903,
    longitude: 18.421,
    features: ['CCTV', 'Security Patrol', 'Underground'],
    isEV: true,
    isCovered: true,
    status: 'available',
    hostEarnings: 1250.0,
    imageUrl: 'https://images.unsplash.com/photo-1506521788701-1e13a7e3b193?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l2',
    title: 'Bree Street Express Park',
    address: '142 Bree Street, City Centre',
    pricePerHour: 30.0,
    rating: 4.7,
    distance: 0.8,
    lat: 70,
    lng: 130,
    latitude: -33.922,
    longitude: 18.419,
    features: ['Instant Booking', 'Overnight Allowed'],
    isEV: false,
    isCovered: false,
    status: 'available',
    hostEarnings: 905.0,
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l3',
    title: 'De Waterkant Premium Loft Bay',
    address: 'Loader St, De Waterkant',
    pricePerHour: 48.0,
    rating: 4.95,
    distance: 1.1,
    lat: 50,
    lng: 80,
    latitude: -33.916,
    longitude: 18.414,
    features: ['Tesla Wall Connector', 'Gated Access', 'CCTV'],
    isEV: true,
    isCovered: true,
    status: 'available',
    hostEarnings: 2100.0,
    imageUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l4',
    title: 'Gardens Resident Driveway',
    address: 'Kloof Nek Rd, Gardens',
    pricePerHour: 25.0,
    rating: 4.5,
    distance: 1.7,
    lat: 150,
    lng: 150,
    latitude: -33.935,
    longitude: 18.408,
    features: ['Easy Access', 'Wide Space'],
    isEV: false,
    isCovered: false,
    status: 'available',
    hostEarnings: 450.0,
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    listingId: 'l1',
    listingTitle: 'Waterfront Secured Bay',
    address: 'Breakwater Blvd, Victoria & Alfred Waterfront',
    priceTotal: 135.0,
    startTime: '10:00 AM',
    endTime: '1:00 PM',
    timeLeftSeconds: 2100, // 35 minutes
    status: 'active',
    accessCode: 'P-992-SEC',
  },
  {
    id: 'b2',
    listingId: 'l3',
    listingTitle: 'De Waterkant Premium Loft Bay',
    address: 'Loader St, De Waterkant',
    priceTotal: 110.0,
    startTime: 'Tomorrow, 2:00 PM',
    endTime: 'Tomorrow, 4:00 PM',
    timeLeftSeconds: 7200,
    status: 'upcoming',
    accessCode: 'P-404-GTE',
  },
  {
    id: 'b3',
    listingId: 'l2',
    listingTitle: 'Bree Street Express Park',
    address: '142 Bree Street, City Centre',
    priceTotal: 60.0,
    startTime: 'Yesterday, 3:00 PM',
    endTime: 'Yesterday, 5:00 PM',
    timeLeftSeconds: 0,
    status: 'history',
    accessCode: 'P-881-OLD',
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'booking_payment',
    amount: -135.0,
    date: '2026-06-23',
    title: 'Waterfront Secured Booking',
    status: 'completed',
  },
  {
    id: 't2',
    type: 'deposit',
    amount: 500.0,
    date: '2026-06-22',
    title: 'Wallet Top-up via SimplyPay',
    status: 'completed',
  },
  {
    id: 't3',
    type: 'host_earnings',
    amount: 450.0,
    date: '2026-06-21',
    title: 'Earnings: Gardens Bay Rent',
    status: 'completed',
  },
  {
    id: 't4',
    type: 'host_payout',
    amount: -1200.0,
    date: '2026-06-20',
    title: 'Payout to Bank Account',
    status: 'completed',
  },
];

const INITIAL_EVENTS: CityEvent[] = [
  {
    id: 'e1',
    title: 'Cape Town Jazz Festival',
    description: 'The legendary annual gathering of local & international jazz icons. Expect beautiful sounds and massive crowds.',
    date: '2026-10-24',
    time: '18:00',
    location: 'CTICC, Waterfront',
    latitude: -33.903,
    longitude: 18.421,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
    ticketPrice: 'R450.00',
    attendeesCount: 15400,
    vipParkingSpotsAvailable: 8,
  },
  {
    id: 'e2',
    title: 'Sunset Concert Series',
    description: 'A magical outdoor summer concert experience under the mountain canopy. Featuring South Africa\'s top acoustic bands.',
    date: '2026-11-02',
    time: '17:00',
    location: 'Kirstenbosch Gardens',
    latitude: -33.935,
    longitude: 18.408,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
    ticketPrice: 'R220.00',
    attendeesCount: 4200,
    vipParkingSpotsAvailable: 5,
  },
  {
    id: 'e3',
    title: 'Waterfront Comedy Showcase',
    description: 'A hilarious night of stand-up comedy highlighting South Africa\'s legendary and emerging comedic talents.',
    date: '2026-09-15',
    time: '20:00',
    location: 'The Marquee Club, Waterfront',
    latitude: -33.916,
    longitude: 18.414,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    isVerified: false,
    ticketPrice: 'R150.00',
    attendeesCount: 120,
    vipParkingSpotsAvailable: 15,
  }
];

export const ParkEasyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('PARK');
  const [activeTab, setActiveTab] = useState<MainTab>('marketplace');
  const [marketplaceSubTab, setMarketplaceSubTab] = useState<'search' | 'explore' | 'live-map'>('live-map');
  const [bookingsSubTab, setBookingsSubTab] = useState<'upcoming' | 'active' | 'history' | 'listings' | 'list-space'>('active');
  const [financeSubTab, setFinanceSubTab] = useState<'wallet' | 'transactions' | 'payouts'>('wallet');
  const [accountSubTab, setAccountSubTab] = useState<'profile' | 'kyc' | 'settings' | 'list-space'>('profile');
  const [listings, setListings] = useState<ParkingListing[]>(INITIAL_LISTINGS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [driverWallet, setDriverWallet] = useState<number>(765.00);
  const [hostWallet, setHostWallet] = useState<number>(4705.00);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedListing, setSelectedListing] = useState<ParkingListing | null>(null);
  const [activeNavigationListing, setActiveNavigationListing] = useState<ParkingListing | null>(null);
  const [isMobileSubNavVisible, setIsMobileSubNavVisible] = useState<boolean>(true);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [showEventsOnMap, setShowEventsOnMap] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'streets' | 'sonar'>('sonar');

  // New state variables for City Events & Premium VIP tier
  const [cityEvents, setCityEvents] = useState<CityEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CityEvent | null>(null);
  const [isVipSubscriber, setIsVipSubscriber] = useState<boolean>(false);

  // Audio system integration: trigger beautiful coin sweep sound on mode flip
  const toggleMode = () => {
    const newMode = mode === 'PARK' ? 'HOST' : 'PARK';
    setMode(newMode);
    
    // Play corresponding synth sounds
    if (newMode === 'HOST') {
      // Deep majestic chime
      playCinematicSound('pulse-glow');
      setActiveTab('bookings');
      setBookingsSubTab('listings');
    } else {
      // Active high ripple radar sweep
      playCinematicSound('ripple-sonar');
      setActiveTab('marketplace');
      setMarketplaceSubTab('live-map');
      setBookingsSubTab('active');
    }
  };

  // Create local timers to tick active booking time left
  useEffect(() => {
    const interval = setInterval(() => {
      setBookings((prevBookings) =>
        prevBookings.map((b) => {
          if (b.status === 'active' && b.timeLeftSeconds > 0) {
            return { ...b, timeLeftSeconds: b.timeLeftSeconds - 1 };
          }
          return b;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const createNewBooking = (listing: ParkingListing, hours: number, paymentMethod: 'wallet' | 'payfast' = 'wallet') => {
    const totalCost = listing.pricePerHour * hours;
    
    if (paymentMethod === 'wallet') {
      if (driverWallet < totalCost) {
        alert('Insufficient funds in driver wallet. Please deposit money via SimplyPay in the Finance section first.');
        return;
      }
      // Deduct wallet
      setDriverWallet((prev) => Number((prev - totalCost).toFixed(2)));
    }

    // Create new booking
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      address: listing.address,
      priceTotal: totalCost,
      startTime: 'Just Now',
      endTime: `In ${hours} Hours`,
      timeLeftSeconds: hours * 3600,
      status: 'active',
      accessCode: `P-${Math.floor(100 + Math.random() * 900)}-${listing.title.slice(0, 3).toUpperCase()}`,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Create Driver Transaction
    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      type: 'booking_payment',
      amount: -totalCost,
      date: new Date().toISOString().split('T')[0],
      title: `${listing.title} Booking (${paymentMethod === 'payfast' ? 'Paid via Payfast Gateway' : 'Paid via Wallet'})`,
      status: 'completed',
    };

    // Calculate host earnings less 16% commission
    const commissionAmount = Number((totalCost * 0.16).toFixed(2));
    const netEarnings = Number((totalCost - commissionAmount).toFixed(2));

    // Update Host Wallet
    setHostWallet((prev) => Number((prev + netEarnings).toFixed(2)));

    // Create Host Earnings Transaction
    const hostTx: Transaction = {
      id: `t-${Date.now() + 1}`,
      type: 'host_earnings',
      amount: netEarnings,
      date: new Date().toISOString().split('T')[0],
      title: `Earning: ${listing.title} (less 16% commission)`,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, hostTx, ...prev]);
    setActiveTab('bookings');
    setSelectedListing(null);

    // Audio cue
    playCinematicSound('vortex-reveal');
  };

  const createNewListing = (newListingData: Omit<ParkingListing, 'id' | 'rating' | 'distance'>) => {
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    const newListing: ParkingListing = {
      ...newListingData,
      id: `l-${Date.now()}`,
      rating: 5.0,
      distance: 0.1, // Near user
      latitude: newListingData.latitude !== undefined ? newListingData.latitude : -33.9249 + latOffset,
      longitude: newListingData.longitude !== undefined ? newListingData.longitude : 18.4241 + lngOffset,
    };

    setListings((prev) => [newListing, ...prev]);
    
    // Add transaction for host list activation
    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      type: 'host_earnings',
      amount: 0.0,
      date: new Date().toISOString().split('T')[0],
      title: `Activated: ${newListing.title}`,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);
    
    // Play sparkle audio cue for list completion
    playCinematicSound('starlight');
  };

  const triggerPayout = () => {
    alert("⚠️ Weekly Automated Payout System:\n\nHosts payouts are processed automatically every Tuesday morning at 06:00 AM SAST directly into your linked bank account. No instant or manual payouts are permitted to ensure full security audit clearance.");
  };

  const verifyEvent = (eventId: string) => {
    setCityEvents(prev => prev.map(e => e.id === eventId ? { ...e, isVerified: true } : e));
    playCinematicSound('ripple-sonar');
  };

  const createEvent = (newEventData: Omit<CityEvent, 'id' | 'isVerified' | 'attendeesCount' | 'vipParkingSpotsAvailable'> & { sponsorFeePaid?: number }) => {
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    const isPaid = (newEventData.sponsorFeePaid || 0) > 0;
    
    const newEvent: CityEvent = {
      ...newEventData,
      id: `e-${Date.now()}`,
      isVerified: isPaid,
      attendeesCount: Math.floor(150 + Math.random() * 500),
      vipParkingSpotsAvailable: 10,
      latitude: newEventData.latitude !== undefined ? newEventData.latitude : -33.918 + latOffset,
      longitude: newEventData.longitude !== undefined ? newEventData.longitude : 18.423 + lngOffset,
    };

    setCityEvents(prev => [newEvent, ...prev]);

    if (isPaid) {
      // Deduct advertising fee from driver wallet
      setDriverWallet(prev => Number((prev - Number(newEventData.sponsorFeePaid)).toFixed(2)));
      
      const adTx: Transaction = {
        id: `t-ad-${Date.now()}`,
        type: 'ad_fee',
        amount: -Number(newEventData.sponsorFeePaid),
        date: new Date().toISOString().split('T')[0],
        title: `Advertising Sponsor Fee: "${newEvent.title}" on 3D Map`,
        status: 'completed',
      };
      setTransactions(prev => [adTx, ...prev]);
    }

    playCinematicSound('starlight');
  };

  const subscribeToVip = () => {
    const VIP_PRICE = 299.0;
    if (driverWallet < VIP_PRICE) {
      alert(`Insufficient funds in wallet to subscribe. R299.00 required, but you only have R${driverWallet.toFixed(2)}. Please top-up in the Finance section first.`);
      return false;
    }

    setDriverWallet(prev => Number((prev - VIP_PRICE).toFixed(2)));
    setIsVipSubscriber(true);

    const subTx: Transaction = {
      id: `t-vip-${Date.now()}`,
      type: 'vip_subscription',
      amount: -VIP_PRICE,
      date: new Date().toISOString().split('T')[0],
      title: 'ParkEasy VIP Premium - 1 Month Access',
      status: 'completed',
    };
    setTransactions(prev => [subTx, ...prev]);
    playCinematicSound('vortex-reveal');
    return true;
  };

  const bookVipParking = (event: CityEvent) => {
    if (event.vipParkingSpotsAvailable <= 0) {
      alert('Sorry, all VIP parking spots for this event have been fully booked.');
      return false;
    }

    // Check if user has enough money if not a subscriber
    if (!isVipSubscriber && driverWallet < 150.0) {
      alert('Insufficient funds. VIP Parking without a VIP Premium subscription costs R150.00. Please top up your wallet or subscribe to VIP Premium for unlimited free VIP parking!');
      return false;
    }

    // Decrease available spots
    setCityEvents(prev => prev.map(e => e.id === event.id ? { ...e, vipParkingSpotsAvailable: e.vipParkingSpotsAvailable - 1 } : e));

    const code = `VIP-${Math.floor(100 + Math.random() * 900)}-${event.title.slice(0, 3).toUpperCase()}`;
    const priceTotal = isVipSubscriber ? 0.0 : 150.0;
    
    const newBooking: Booking = {
      id: `b-vip-${Date.now()}`,
      listingId: `vip-${event.id}`,
      listingTitle: `💎 VIP Front-Row Spot: ${event.title}`,
      address: `VIP Exclusive Parking Deck, ${event.location}`,
      priceTotal: priceTotal,
      startTime: event.time,
      endTime: 'Event Close',
      timeLeftSeconds: 6 * 3600, // 6 hours
      status: 'active',
      accessCode: code,
      isVip: true,
    };

    setBookings(prev => [newBooking, ...prev]);

    if (!isVipSubscriber) {
      setDriverWallet(prev => Number((prev - 150.0).toFixed(2)));
    }

    const tx: Transaction = {
      id: `t-vippark-${Date.now()}`,
      type: 'booking_payment',
      amount: -priceTotal,
      date: new Date().toISOString().split('T')[0],
      title: isVipSubscriber ? `Complimentary VIP Event Pass: ${event.title}` : `VIP Event Parking: ${event.title}`,
      status: 'completed',
    };
    setTransactions(prev => [tx, ...prev]);

    playCinematicSound('vortex-reveal');
    setActiveTab('bookings');
    setBookingsSubTab('active');
    setSelectedEvent(null);
    return true;
  };

  return (
    <ParkEasyContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        activeTab,
        setActiveTab,
        marketplaceSubTab,
        setMarketplaceSubTab,
        bookingsSubTab,
        setBookingsSubTab,
        financeSubTab,
        setFinanceSubTab,
        accountSubTab,
        setAccountSubTab,
        listings,
        setListings,
        bookings,
        setBookings,
        transactions,
        addTransaction: (tx) => setTransactions((prev) => [tx, ...prev]),
        driverWallet,
        setDriverWallet,
        hostWallet,
        setHostWallet,
        searchQuery,
        setSearchQuery,
        selectedListing,
        setSelectedListing,
        activeNavigationListing,
        setActiveNavigationListing,
        createNewBooking,
        createNewListing,
        triggerPayout,
        isMobileSubNavVisible,
        setIsMobileSubNavVisible,
        isWorkspaceOpen,
        setIsWorkspaceOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        showEventsOnMap,
        setShowEventsOnMap,
        activeLayer,
        setActiveLayer,
        cityEvents,
        setCityEvents,
        selectedEvent,
        setSelectedEvent,
        isVipSubscriber,
        setIsVipSubscriber,
        verifyEvent,
        createEvent,
        subscribeToVip,
        bookVipParking,
      }}
    >
      {children}
    </ParkEasyContext.Provider>
  );
};

export const useParkEasy = () => {
  const context = useContext(ParkEasyContext);
  if (!context) {
    throw new Error('useParkEasy must be used within a ParkEasyProvider');
  }
  return context;
};
