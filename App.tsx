import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Ticket, Wallet, User, Activity, ShieldCheck, 
  MapPin, HelpCircle, AlertCircle, Sparkles, Navigation,
  Search, X, Star, Clock, Zap, DollarSign, Check, CreditCard,
  Calendar, Crown
} from 'lucide-react';

import { ParkEasyProvider, useParkEasy } from './state/parkEasyState';
import NavBar from './components/navigation/NavBar';
import ParkEasyMap from './components/map/ParkEasyMap';
import MarketplaceView from './components/marketplace/MarketplaceView';
import BookingsView from './components/bookings/BookingsView';
import FinanceView from './components/finance/FinanceView';
import AccountView from './components/account/AccountView';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { playCinematicSound } from './components/AudioEngine';

function AppContent() {
  const { 
    mode, 
    activeTab, 
    setActiveTab,
    marketplaceSubTab,
    setMarketplaceSubTab,
    selectedListing, 
    setSelectedListing,
    searchQuery, 
    setSearchQuery,
    createNewBooking,
    driverWallet,
    activeNavigationListing,
    setActiveNavigationListing,
    listings,
    cityEvents,
    selectedEvent,
    setSelectedEvent,
    isVipSubscriber,
    bookVipParking,
    isWorkspaceOpen,
    setIsWorkspaceOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    setDriverWallet
  } = useParkEasy();

  // Booking states
  const [bookingHours, setBookingHours] = useState<number>(3);
  const [isBookingSuccess, setIsBookingSuccess] = useState<boolean>(false);
  const [successCode, setSuccessCode] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Payfast Integration States
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'payfast'>('payfast');
  const [payfastModalOpen, setPayfastModalOpen] = useState<boolean>(false);
  const [isPayfastProcessing, setIsPayfastProcessing] = useState<boolean>(false);
  const [payfastProcessingStep, setPayfastProcessingStep] = useState<number>(0);
  const [payfastTab, setPayfastTab] = useState<'eft' | 'card'>('eft');
  const [selectedBank, setSelectedBank] = useState<string>('Capitec');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');

  // Active subview pane
  const renderActiveView = () => {
    switch (activeTab) {
      case 'marketplace':
        return <MarketplaceView />;
      case 'bookings':
        return <BookingsView />;
      case 'finance':
        return <FinanceView />;
      case 'account':
        return <AccountView />;
      default:
        return <MarketplaceView />;
    }
  };

  const isParkMode = mode === 'PARK';
  const themeColor = isParkMode ? 'emerald' : 'blue';

  const handleCheckout = () => {
    if (!selectedListing) return;
    const cost = selectedListing.pricePerHour * bookingHours;

    if (selectedPaymentMethod === 'payfast') {
      // Trigger Payfast secure gateway checkout flow
      setPayfastModalOpen(true);
      setPayfastProcessingStep(0);
      setIsPayfastProcessing(false);
      playCinematicSound('ripple-sonar');
    } else {
      // Direct Local Wallet booking payment
      if (driverWallet < cost) {
        alert(`Insufficient funds. Booking requires R${cost.toFixed(2)}, but you only have R${driverWallet.toFixed(2)} in your wallet. Please top-up in the Finance workspace.`);
        return;
      }
      const code = `P-${Math.floor(100 + Math.random() * 900)}-${selectedListing.title.slice(0,3).toUpperCase()}`;
      setSuccessCode(code);
      createNewBooking(selectedListing, bookingHours, 'wallet');
      setIsBookingSuccess(true);
      playCinematicSound('vortex-reveal');
    }
  };

  // Simulated Payfast Process Trigger
  const triggerPayfastAuthorization = () => {
    if (payfastTab === 'card') {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        alert('Please complete all card details to authorize with Payfast.');
        return;
      }
    }
    setIsPayfastProcessing(true);
    setPayfastProcessingStep(1);
    playCinematicSound('glitch-tech');

    // Interval timers representing live API handshake sequences
    const t1 = setTimeout(() => {
      setPayfastProcessingStep(2);
      playCinematicSound('ripple-sonar');
    }, 1500);

    const t2 = setTimeout(() => {
      setPayfastProcessingStep(3);
      playCinematicSound('glitch-tech');
    }, 3000);

    const t3 = setTimeout(() => {
      setPayfastProcessingStep(4);
      playCinematicSound('vortex-reveal');
    }, 4500);

    const t4 = setTimeout(() => {
      setPayfastProcessingStep(5);
      if (selectedListing) {
        const code = `P-${Math.floor(100 + Math.random() * 900)}-${selectedListing.title.slice(0,3).toUpperCase()}`;
        setSuccessCode(code);
        createNewBooking(selectedListing, bookingHours, 'payfast');
        setIsBookingSuccess(true);
      }
      setPayfastModalOpen(false);
      setIsPayfastProcessing(false);
    }, 6000);
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 font-sans text-zinc-100 overflow-hidden relative select-none flex flex-col justify-between">
      
      {/* 1. IMMERSIVE FULL-BLEED 3D MAP BACKGROUND LAYOUT */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <ParkEasyMap />
      </div>

      {/* 2. FLOATING PREMIUM SEARCH BAR (Floating centered top block matching design mockup) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-30 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center gap-3 w-full glass-panel px-4 py-3.5 rounded-2xl pointer-events-auto transition-all hover:border-white/20 hover:shadow-[0_12px_45px_rgba(0,0,0,0.6)]">
          <Search className={`w-5 h-5 text-zinc-400`} />
          <input
            type="text"
            placeholder="Where are you going today?"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Auto focus to marketplace view to see filtered lists
              if (activeTab !== 'marketplace') {
                setActiveTab('marketplace');
              }
            }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              // Delay slightly so that clicking a dropdown suggestion completes before the dropdown is unmounted
              setTimeout(() => setIsSearchFocused(false), 250);
            }}
            className="flex-1 bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-550 focus:outline-none focus:ring-0 font-sans font-medium"
            id="global-where-to-search-bar"
          />
          {/* Active indicator capsule "● LIVE" matching provided screen design */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Dropdown Auto-suggest List */}
        <AnimatePresence>
          {isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full glass-panel rounded-2xl overflow-hidden p-3 flex flex-col gap-2 max-h-[350px] overflow-y-auto custom-scrollbar pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl"
            >
              {/* Heading */}
              <div className="flex justify-between items-center px-1.5 py-1 border-b border-zinc-900 pb-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                  {searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : '📍 SUGGESTED NEAREST PARKING SPOTS'}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  GPS POSITIONING
                </span>
              </div>

              {/* Suggestions items list */}
              {(() => {
                // Filter and sort listings
                const filtered = listings
                  .filter(l => {
                    if (!searchQuery) return true; // Show all nearest bays if empty
                    const q = searchQuery.toLowerCase();
                    return l.title.toLowerCase().includes(q) || l.address.toLowerCase().includes(q);
                  })
                  .sort((a, b) => (a.distance || 0) - (b.distance || 0));

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-6 text-xs text-zinc-500 font-medium">
                      No parking spots found nearby for "{searchQuery}"
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-1">
                    {filtered.map((listing) => (
                      <button
                        key={listing.id}
                        type="button"
                        onClick={() => {
                          setSelectedListing(listing);
                          setSearchQuery(listing.title);
                          // Switch to marketplace if we are not there
                          if (activeTab !== 'marketplace') {
                            setActiveTab('marketplace');
                          }
                          playCinematicSound('vortex-reveal');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-900/60 hover:border-zinc-800 border border-transparent transition-all text-left w-full cursor-pointer group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          {/* Mini Pin Graphic */}
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
                          </div>
                          
                          {/* Main texts */}
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition truncate">
                              {listing.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 line-clamp-1 truncate">
                              {listing.address}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {listing.isEV && (
                                <span className="text-[8px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-black">
                                  EV
                                </span>
                              )}
                              {listing.isCovered && (
                                <span className="text-[8px] font-mono uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-black">
                                  COVERED
                                </span>
                              )}
                              {listing.rating && (
                                <span className="text-[9px] text-amber-400 font-mono font-bold flex items-center gap-0.5">
                                  ★ {listing.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Distance & Price Badge */}
                        <div className="text-right flex flex-col shrink-0 pl-2">
                          <span className="text-xs font-mono font-black text-zinc-200">
                            R{listing.pricePerHour}
                            <span className="text-[9px] text-zinc-500 font-normal">/h</span>
                          </span>
                          <span className="text-[9px] text-emerald-400 font-mono font-bold">
                            {listing.distance} km away
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. MOBILE WATERMARK "N" COMPASS BUTTON */}
      <div className="absolute bottom-24 left-4 z-20 pointer-events-auto md:hidden">
        <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center font-black text-sm text-zinc-100 shadow-2xl" id="mockup-watermark-n">
          N
        </div>
      </div>

      {/* 4. DYNAMIC FLOATING WORKSPACE PANELS */}
      <div className="absolute inset-x-4 md:inset-x-6 top-24 bottom-24 pointer-events-none z-10 flex flex-col md:flex-row justify-start items-stretch gap-6">
        
        {/* DESKTOP SIDEBAR OR MOBILE PANEL SLIDE */}
        <AnimatePresence mode="wait">
          {activeTab && isWorkspaceOpen && (activeTab !== 'marketplace' || marketplaceSubTab === 'explore' || marketplaceSubTab === 'search' || marketplaceSubTab === 'live-map') && !selectedListing && !selectedEvent && (
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="w-full md:w-[380px] max-h-[62vh] md:max-h-full rounded-2xl glass-panel p-5 flex flex-col pointer-events-auto overflow-y-auto custom-scrollbar transition-all duration-300"
              id="active-tab-drawer-pane"
            >
              {/* Header with active action name */}
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900 mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isParkMode ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    {activeTab} Workspace
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsWorkspaceOpen(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="w-6 h-6 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-450 hover:text-white flex items-center justify-center cursor-pointer transition text-xs font-bold"
                  title="Minimize Workspace Panel"
                  id="close-active-workspace-panel-btn"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic scrollable subview workspace */}
              <div className="flex-1 min-h-0">
                {renderActiveView()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. GORGEOUS PARK BAY CHECKOUT DRAWER (Pops up when user clicks/selects a geo map pin!) */}
        <AnimatePresence>
          {selectedListing && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute bottom-2 md:bottom-auto md:top-0 md:left-0 w-full md:w-[380px] glass-panel rounded-2xl p-5 pointer-events-auto z-40 max-h-[70vh] md:max-h-full overflow-y-auto custom-scrollbar transition-all duration-300"
              id="selected-listing-checkout-drawer"
            >
              {isBookingSuccess ? (
                /* Success animation checkout pane with dynamic 3D Live Navigation launch controls */
                <div className="py-6 text-center flex flex-col items-center justify-center gap-4 h-full relative" id="booking-success-message-panel">
                  <button
                    onClick={() => {
                      setIsBookingSuccess(false);
                      setSelectedListing(null);
                      playCinematicSound('glitch-tech');
                    }}
                    className="absolute top-0 right-0 w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-450 hover:text-white flex items-center justify-center transition cursor-pointer"
                    id="close-success-drawer-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Bay Booking Confirmed!</h3>
                    <p className="text-xs text-zinc-400 max-w-xs mt-1">
                      SimplyPay has routed your payment to the host. Your designated bay is now locked.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-850 w-full">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-widest">ACCESS SECURITY CODE</span>
                    <strong className="text-xl font-mono text-emerald-400 tracking-wider block mt-1">{successCode}</strong>
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={() => {
                        setActiveNavigationListing(selectedListing);
                        setIsBookingSuccess(false);
                        setSelectedListing(null);
                        setActiveTab('marketplace');
                        setMarketplaceSubTab('live-map');
                        playCinematicSound('vortex-reveal');
                      }}
                      className="w-full py-3 px-4 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 fill-zinc-950" />
                      <span>Start 3D GPS Navigation</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsBookingSuccess(false);
                        setSelectedListing(null);
                        playCinematicSound('glitch-tech');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-850 text-zinc-400 transition cursor-pointer border border-zinc-800"
                    >
                      Dismiss
                    </button>
                  </div>

                  <p className="text-[9px] text-zinc-550 font-mono uppercase animate-pulse">Syncing smart gate systems...</p>
                </div>
              ) : (
                /* Main checkout pane */
                <div className="flex flex-col gap-4">
                  {/* Drawer Header block */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-widest">SECURED BAY SELECTION</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedListing(null);
                        playCinematicSound('glitch-tech');
                      }}
                      className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
                      id="close-checkout-drawer-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pricing and core information layout */}
                  <div className="flex flex-col gap-3">
                    {selectedListing.imageUrl && (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                        <img 
                          src={selectedListing.imageUrl} 
                          alt={selectedListing.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent" />
                        
                        {/* Verified Badge overlay in top corner for trust verification */}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-zinc-950 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                          <ShieldCheck className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                          <span>Verified Bay</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-black text-zinc-100 tracking-tight leading-tight">{selectedListing.title}</h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Trusted Listing" />
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{selectedListing.address}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-xs text-zinc-300">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {selectedListing.rating}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {selectedListing.distance} km away
                      </span>
                      {selectedListing.isEV && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-widest flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-emerald-400" /> EV CHARGER
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hours selector slider */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-900/80 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 font-mono uppercase tracking-wider font-semibold">Select Rental Time</span>
                      <strong className="text-emerald-400 font-bold font-mono text-sm">{bookingHours} hours</strong>
                    </div>
                    
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={bookingHours}
                      onChange={(e) => {
                        setBookingHours(parseInt(e.target.value));
                        playCinematicSound('glitch-tech');
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />

                    <div className="flex justify-between text-[10px] text-zinc-650 font-mono">
                      <span>1h</span>
                      <span>3h</span>
                      <span>6h</span>
                      <span>12h</span>
                    </div>
                  </div>

                  {/* Bullet features specs */}
                  <div className="flex flex-wrap gap-1.5">
                    {selectedListing.features.map((feat, idx) => (
                      <span key={idx} className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-850">
                        • {feat}
                      </span>
                    ))}
                  </div>

                  {/* Payment Method Selector Toggles */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest font-semibold">SECURE GATEWAY PAYMENT OPTION</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedPaymentMethod('payfast');
                          playCinematicSound('glitch-tech');
                        }}
                        className={`py-2.5 px-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          selectedPaymentMethod === 'payfast'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                            : 'bg-zinc-900 border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
                        }`}
                      >
                        <span className="text-[11px] font-black font-sans flex items-center gap-1">💳 Payfast</span>
                        <span className="text-[8px] font-mono uppercase mt-0.5 tracking-wider opacity-85">Instant EFT / Card</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPaymentMethod('wallet');
                          playCinematicSound('glitch-tech');
                        }}
                        className={`py-2.5 px-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          selectedPaymentMethod === 'wallet'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-zinc-900 border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
                        }`}
                      >
                        <span className="text-[11px] font-black font-sans flex items-center gap-1">👛 Wallet</span>
                        <span className="text-[8px] font-mono uppercase mt-0.5 tracking-wider opacity-85">R{driverWallet.toFixed(2)} Balance</span>
                      </button>
                    </div>
                  </div>

                  {/* Total summary breakdown & pay button */}
                  <div className="pt-3 border-t border-zinc-900 flex flex-col gap-3.5">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">TOTAL HOURLY BOOKING RATE</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-mono font-black text-zinc-100">R{(selectedListing.pricePerHour * bookingHours).toFixed(2)}</span>
                          <span className="text-xs text-zinc-500">(R{selectedListing.pricePerHour}/hr)</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider block">YOUR WALLET</span>
                        <strong className="text-zinc-300 font-mono">R{driverWallet.toFixed(2)}</strong>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-tight shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        selectedPaymentMethod === 'payfast'
                          ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/10 hover:shadow-rose-500/20'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/10 hover:shadow-emerald-500/20'
                      }`}
                      id="confirm-checkout-btn"
                    >
                      <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                      <span>{selectedPaymentMethod === 'payfast' ? 'Pay with Payfast' : 'Confirm Secure Booking'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveNavigationListing(selectedListing);
                        setSelectedListing(null);
                        playCinematicSound('vortex-reveal');
                      }}
                      className="w-full py-2.5 rounded-xl bg-zinc-950 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 fill-emerald-400" />
                      <span>Preview 3D Navigation Route</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5B. SPECTACULAR EVENT SUMMARY & VIP CHECKOUT DRAWER (Pops up when user selects an event marker) */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute bottom-2 md:bottom-auto md:top-0 md:left-0 w-full md:w-[380px] glass-panel rounded-2xl p-5 pointer-events-auto z-40 max-h-[70vh] md:max-h-full overflow-y-auto custom-scrollbar transition-all duration-300"
              id="selected-event-checkout-drawer"
            >
              <div className="flex flex-col gap-4">
                
                {/* Header Title with exit button */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-black">CITY EVENT LAYER</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      playCinematicSound('glitch-tech');
                    }}
                    className="w-6 h-6 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-450 flex items-center justify-center cursor-pointer transition text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Event Image & Title */}
                <div className="relative rounded-xl overflow-hidden border border-zinc-850 h-32 flex flex-col justify-end p-3 bg-zinc-950">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10">
                    <h3 className="text-xs font-black text-white leading-snug flex items-center gap-1.5 flex-wrap">
                      {selectedEvent.title}
                      {selectedEvent.isVerified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500 text-zinc-950 text-[8px] font-extrabold uppercase">
                          Verified
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-zinc-450 font-mono mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                      {selectedEvent.date} @ {selectedEvent.time}
                    </p>
                  </div>
                </div>

                {/* Info List */}
                <div className="flex flex-col gap-2 text-xs py-1">
                  <div className="flex justify-between items-center px-2 py-2 rounded-xl bg-zinc-950/40 border border-zinc-900">
                    <span className="text-zinc-500">📍 Venue Location</span>
                    <strong className="text-zinc-300 font-medium truncate max-w-[180px]">{selectedEvent.location}</strong>
                  </div>

                  <div className="flex justify-between items-center px-2 py-2 rounded-xl bg-zinc-950/40 border border-zinc-900">
                    <span className="text-zinc-500">👥 Attendees Estimate</span>
                    <strong className="text-fuchsia-400 font-mono">{selectedEvent.attendeesCount.toLocaleString()}+</strong>
                  </div>

                  <div className="flex justify-between items-center px-2 py-2 rounded-xl bg-zinc-950/40 border border-zinc-900">
                    <span className="text-zinc-500">🛡️ Authentic Security</span>
                    <strong className={selectedEvent.isVerified ? "text-amber-400 font-bold" : "text-zinc-400"}>
                      {selectedEvent.isVerified ? "🔒 Verified Map Sponsor" : "⚠️ Standard Listing"}
                    </strong>
                  </div>
                </div>

                {/* Description */}
                <div className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950/20 p-2.5 rounded-xl border border-zinc-900/60 font-sans">
                  {selectedEvent.description}
                </div>

                {/* VIP Parking Reservation Block */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-zinc-950 to-zinc-900/80 border border-amber-500/10 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-zinc-500 font-mono uppercase font-black">Reserved Deck Status</span>
                      <strong className={`text-[11px] font-mono mt-0.5 ${selectedEvent.vipParkingSpotsAvailable > 0 ? 'text-amber-400' : 'text-rose-500'}`}>
                        {selectedEvent.vipParkingSpotsAvailable > 0 ? `💎 ${selectedEvent.vipParkingSpotsAvailable} front bays left` : 'Fully Booked'}
                      </strong>
                    </div>

                    <div className="text-right flex flex-col">
                      <span className="text-[8px] text-zinc-500 font-mono uppercase">VIP Pass Cost</span>
                      <strong className="text-xs font-mono font-black text-amber-300">
                        {isVipSubscriber ? 'R0.00' : 'R150.00'}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const success = bookVipParking(selectedEvent);
                      if (success) {
                        alert(`🎉 VIP Parking reserved! Front-row bay code generated & saved to your bookings.`);
                      }
                    }}
                    disabled={selectedEvent.vipParkingSpotsAvailable <= 0}
                    className={`w-full py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      selectedEvent.vipParkingSpotsAvailable <= 0 
                        ? 'bg-zinc-900 text-zinc-650 border border-zinc-850 cursor-not-allowed'
                        : isVipSubscriber
                        ? 'bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black shadow-lg shadow-yellow-500/10'
                        : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>{isVipSubscriber ? 'Claim Free VIP Pass' : 'Book VIP Spot (R150)'}</span>
                  </button>

                  {!isVipSubscriber && (
                    <p className="text-[8px] text-center text-zinc-550 uppercase tracking-wide">
                      💡 Subscribe to VIP Premium for R299/mo to get this for FREE
                    </p>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 7. SECURE PAYFAST CHECKOUT GATEWAY SANDBOX */}
      <AnimatePresence>
        {payfastModalOpen && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/96 backdrop-blur-md z-50 p-4 flex items-center justify-center pointer-events-auto"
            id="payfast-gateway-checkout-modal"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-zinc-900 border border-rose-500/30 rounded-2xl shadow-[0_20px_50px_rgba(244,63,94,0.15)] flex flex-col overflow-hidden relative"
            >
              {/* Payfast Top branding header */}
              <div className="bg-gradient-to-r from-rose-600 to-rose-500 p-4 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 stroke-[2.5]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black tracking-tight uppercase leading-none">payfast</span>
                    <span className="text-[9px] text-rose-100 font-mono tracking-widest mt-0.5 uppercase font-semibold">SECURE CHECKOUT</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPayfastModalOpen(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Booking Invoice breakdown summary */}
              <div className="p-4 bg-zinc-950/60 border-b border-zinc-850 flex justify-between items-center text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Merchant / Reference</span>
                  <strong className="text-zinc-200">ParkEasy South Africa</strong>
                  <span className="text-[9px] text-zinc-500 font-mono mt-0.5">PE-B-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Total Amount</span>
                  <strong className="text-lg font-mono font-black text-rose-400">R{(selectedListing.pricePerHour * bookingHours).toFixed(2)}</strong>
                  <span className="text-[9px] text-zinc-500 block font-mono">incl. 15% VAT</span>
                </div>
              </div>

              {/* Payfast Payment Method selector tabs */}
              <div className="px-4 pt-4 shrink-0">
                <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-850">
                  <button
                    type="button"
                    onClick={() => {
                      setPayfastTab('eft');
                      playCinematicSound('glitch-tech');
                    }}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                      payfastTab === 'eft' 
                        ? 'bg-rose-600 text-white shadow-sm' 
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    🏦 Instant EFT
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayfastTab('card');
                      playCinematicSound('glitch-tech');
                    }}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                      payfastTab === 'card' 
                        ? 'bg-rose-600 text-white shadow-sm' 
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    💳 Card Payment
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Body */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
                {payfastTab === 'eft' ? (
                  /* 1. EFT BANK SELECTOR GRID */
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest font-semibold">Select Your Banking Institution</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Capitec', color: 'from-blue-600 to-red-600', code: 'CAP' },
                        { name: 'FNB', color: 'from-cyan-500 to-teal-500', code: 'FNB' },
                        { name: 'Standard Bank', color: 'from-blue-700 to-indigo-800', code: 'STD' },
                        { name: 'Absa', color: 'from-red-600 to-red-700', code: 'ABSA' },
                        { name: 'Nedbank', color: 'from-emerald-700 to-green-800', code: 'NED' },
                        { name: 'TymeBank', color: 'from-amber-500 to-yellow-400', code: 'TYME' },
                      ].map((bank) => {
                        const isSelected = selectedBank === bank.name;
                        return (
                          <button
                            key={bank.name}
                            type="button"
                            onClick={() => {
                              setSelectedBank(bank.name);
                              playCinematicSound('glitch-tech');
                            }}
                            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-14 cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-950 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                                : 'bg-zinc-950/40 border-zinc-850 hover:border-zinc-700'
                            }`}
                          >
                            <span className="text-[10px] font-black tracking-tight text-zinc-200 leading-none">{bank.name}</span>
                            <div className="flex items-center justify-between w-full mt-1">
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{bank.code}</span>
                              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${bank.color} opacity-80`} />
                            </div>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* 2. SECURE DEBIT/CREDIT CARD INPUTS */
                  <div className="flex flex-col gap-3 text-xs">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest font-semibold">Enter Card Details</span>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4000 1234 5678 9010"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ''))}
                        className="p-2.5 bg-zinc-950 border border-zinc-850 focus:border-rose-500 focus:outline-none rounded-xl text-zinc-200 placeholder-zinc-700 font-mono text-center tracking-wider"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Shaheen Toefy"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="p-2.5 bg-zinc-950 border border-zinc-850 focus:border-rose-500 focus:outline-none rounded-xl text-zinc-200 placeholder-zinc-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="p-2.5 bg-zinc-950 border border-zinc-850 focus:border-rose-500 focus:outline-none rounded-xl text-zinc-200 placeholder-zinc-700 text-center font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">CVV Code</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^\d]/g, ''))}
                          className="p-2.5 bg-zinc-950 border border-zinc-850 focus:border-rose-500 focus:outline-none rounded-xl text-zinc-200 placeholder-zinc-700 text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure pay trigger action footer */}
              <div className="p-4 border-t border-zinc-850 flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={triggerPayfastAuthorization}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 text-center"
                >
                  {payfastTab === 'eft' 
                    ? `Securely Pay via ${selectedBank} EFT` 
                    : 'Authorize Secure Card Payment'
                  }
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>3D Secure V2 • PCI-DSS Compliant</span>
                </div>
              </div>

              {/* Full overlay live payment processing feedback simulator animation */}
              <AnimatePresence>
                {isPayfastProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-zinc-950/98 z-50 p-5 flex flex-col justify-center items-center text-center gap-5"
                  >
                    {/* Animated spinning loader ring */}
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-rose-500/10" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-rose-500 animate-spin" />
                    </div>

                    <div className="flex flex-col gap-1 max-w-xs">
                      <span className="text-[10px] text-rose-500 font-mono uppercase tracking-widest font-black animate-pulse">
                        PROCESSING TRANSACTION
                      </span>
                      <h3 className="text-xs font-bold text-zinc-200 min-h-[30px] flex items-center justify-center">
                        {payfastProcessingStep === 1 && "Connecting securely to Payfast South Africa Core API..."}
                        {payfastProcessingStep === 2 && `Handshaking with ${payfastTab === 'eft' ? selectedBank : 'Visa/Mastercard'} Payment Gateway...`}
                        {payfastProcessingStep === 3 && "Verifying Multi-Factor Push Authentication (MFA)..."}
                        {payfastProcessingStep === 4 && "Deducting fees, routing 16% commission, updating host wallet..."}
                        {payfastProcessingStep === 5 && "Booking Confirmed! Transfer Completed Successfully."}
                      </h3>
                      <p className="text-[9px] text-zinc-500 mt-2 font-mono">
                        Reference ID: PE-SECURE-ID-7728
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. BOTTOM NAVIGATION WORKSPACE DOCK */}
      <div className="z-30 w-full relative">
        <NavBar />
      </div>

      {/* 7. HIGH-FIDELITY ONBOARDING & SIGN UP MODAL OVERLAY */}
      <AnimatePresence>
        {isOnboardingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto overflow-y-auto custom-scrollbar"
            id="onboarding-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 160 }}
              className="w-full max-w-xl my-auto"
            >
              <OnboardingView
                onComplete={(userData) => {
                  if (userData.initialDeposit) {
                    setDriverWallet(userData.initialDeposit);
                  }
                  setIsOnboardingOpen(false);
                  playCinematicSound('pulse-glow');
                }}
                onClose={() => {
                  setIsOnboardingOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <ParkEasyProvider>
      <AppContent />
    </ParkEasyProvider>
  );
}

