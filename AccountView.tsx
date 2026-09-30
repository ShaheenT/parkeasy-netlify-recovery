import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ShieldCheck, Settings2, PlusCircle, Bell, 
  MapPin, CheckCircle, ChevronRight, HelpCircle, LogOut,
  Sparkles, ShieldAlert, KeyRound, Eye, ToggleLeft, ToggleRight,
  DollarSign, Map, Hammer, Zap, Info, Shield, CheckCircle2,
  Share2, Gift, Star, CreditCard, Camera, Palette, FileText, Check, Activity
} from 'lucide-react';
import ReactMap, { Marker as MapboxMarker } from 'react-map-gl/mapbox';
import { useParkEasy } from '../../state/parkEasyState';
import { playCinematicSound } from '../AudioEngine';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = (import.meta as any).env?.VITE_MAPBOX_TOKEN || (import.meta as any).env?.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1Ijoic2hhaGVlbi1wZSIsImEiOiJjbXBmd2RudXgwYWN0MnhyMjkxcDI5amVmIn0.RKm7zN6DTjL7uiBsoB-UNQ";

export default function AccountView() {
  const { mode, toggleMode, createNewListing, accountSubTab, setAccountSubTab, setActiveTab, setIsOnboardingOpen, setBookingsSubTab } = useParkEasy();

  // KYC Verification state simulator
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified'>('pending');
  
  // Settings switches
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [gpsUpdatesEnabled, setGpsUpdatesEnabled] = useState<boolean>(true);

  // Interactive Account States
  const [shareNotification, setShareNotification] = useState<string | null>(null);
  const [rewardsOpen, setRewardsOpen] = useState<boolean>(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

  const [personalDetailsOpen, setPersonalDetailsOpen] = useState<boolean>(false);
  const [personalName, setPersonalName] = useState<string>('Shaheen Toefy');
  const [personalPhone, setPersonalPhone] = useState<string>('+27 82 555 1234');
  const [personalEmail, setPersonalEmail] = useState<string>('shaheentoefy@gmail.com');
  const [isDetailsSaved, setIsDetailsSaved] = useState<boolean>(false);
  
  const [profilePhotoOpen, setProfilePhotoOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [appearanceOpen, setAppearanceOpen] = useState<boolean>(false);
  const [termsOpen, setTermsOpen] = useState<boolean>(false);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);

  // Map Pin Coordinates Selector State
  const [pinningModalOpen, setPinningModalOpen] = useState<boolean>(false);
  const [pinnedLatitude, setPinnedLatitude] = useState<number>(-33.9249);
  const [pinnedLongitude, setPinnedLongitude] = useState<number>(18.4241);
  const [hasPinnedLocation, setHasPinnedLocation] = useState<boolean>(false);

  // New listing form state (Visible to HOST mode only)
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('25.00');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [hasEV, setHasEV] = useState<boolean>(false);
  const [hasCovered, setHasCovered] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const PRESET_PHOTOS = [
    { id: 'spot1', url: 'https://images.unsplash.com/photo-1506521788701-1e13a7e3b193?auto=format&fit=crop&w=600&q=80', label: 'Secured Garage' },
    { id: 'spot2', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80', label: 'Bree Street Express' },
    { id: 'spot3', url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80', label: 'Underground Lot' },
    { id: 'spot4', url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80', label: 'Premium Driveway' },
  ];

  // Submit new parking bay slot (Host mode)
  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newTitle || !newAddress) {
      setFormError('Please fill in both Listing Title and Street Address.');
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price)) {
      setFormError('Please enter a valid hourly rate.');
      return;
    }

    if (price < 18 || price > 50) {
      setFormError('Compulsory limit: Hourly price must be between R18 and R50 South African ZAR.');
      return;
    }

    if (!newPhotoUrl.trim()) {
      setFormError('Compulsory requirement: You must provide or select a photo of your parking bay.');
      return;
    }

    // Build the listings features array
    const features: string[] = ['Instant Booking'];
    if (hasEV) features.push('Tesla Wall Connector');
    if (hasCovered) features.push('Underground');

    // Add listing to global state listings array
    createNewListing({
      title: newTitle,
      address: newAddress,
      pricePerHour: price,
      lat: Math.floor(60 + Math.random() * 120),
      lng: Math.floor(60 + Math.random() * 120),
      ...(hasPinnedLocation ? { latitude: pinnedLatitude, longitude: pinnedLongitude } : {}),
      features,
      isEV: hasEV,
      isCovered: hasCovered,
      status: 'available',
      imageUrl: newPhotoUrl.trim(),
    });

    // Reset Form
    setNewTitle('');
    setNewAddress('');
    setNewPrice('25.00');
    setNewPhotoUrl('');
    setHasEV(false);
    setHasCovered(false);
    setFormError('');
    setHasPinnedLocation(false);
    setPinnedLatitude(-33.9249);
    setPinnedLongitude(18.4241);

    alert('Your new ParkEasy bay is live with photo validation and ready to earn!');
  };

  // Submit KYC document
  const triggerKycSubmit = () => {
    playCinematicSound('pulse-glow');
    setKycStatus('verified');
  };

  if (isSessionLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-zinc-100 h-full" id="account-session-locked-screen">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/25 flex items-center justify-center animate-pulse shadow-lg mb-5">
          <KeyRound className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-black tracking-widest text-zinc-100 uppercase font-mono">Session Locked</h3>
        <p className="text-[11px] text-zinc-400 max-w-xs mt-1.5 leading-relaxed font-sans">
          Your secure decentralised keys have been safely cleared from sandbox memory. Re-authenticate to restore your driver profile.
        </p>
        
        <button
          onClick={() => {
            playCinematicSound('pulse-glow');
            setIsSessionLocked(false);
          }}
          className="mt-6 w-full max-w-xs py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black tracking-widest uppercase text-[10px] shadow-lg shadow-emerald-500/15 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 font-mono"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Scan Secure Keys & Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-zinc-100" id="account-profile-view">
      
      {/* 1. SECURE SUB NAVIGATION BAR */}
      <div className="flex p-1 glass-card rounded-xl" id="account-sub-tabs">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'kyc', label: 'KYC Verification', icon: Shield },
          { id: 'settings', label: 'Settings', icon: Settings2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = accountSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setAccountSubTab(tab.id as any);
                playCinematicSound('ripple-sonar');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                isSelected 
                  ? 'bg-white/10 text-emerald-400 font-bold border border-white/5' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              id={`account-tab-${tab.id}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ================= PROFILE SUB-TAB ================= */}
        {accountSubTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            {/* Account Title & Info */}
            <div className="flex flex-col gap-0.5 pb-1">
              <h3 className="text-sm font-black tracking-wider text-zinc-100 uppercase font-mono flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> Account
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">Manage profile, earnings, and preferences</p>
            </div>

            {/* Driver Profile Hero Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex items-center justify-between" id="account-profile-header-new">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 relative overflow-hidden">
                  {profilePhotoUrl ? (
                    <img src={profilePhotoUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-6 h-6 text-emerald-400" />
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center border border-zinc-900">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-100 uppercase tracking-wide">Driver Profile</span>
                  <span className="text-[10px] text-zinc-500 font-semibold">Verified ParkEasy Member</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 font-mono text-[10px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-550 uppercase tracking-widest text-[8px]">Status</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 uppercase text-[9px] font-black">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-zinc-550 uppercase tracking-widest text-[8px]">Rating</span>
                  <span className="text-yellow-400 flex items-center gap-0.5 text-[10px] font-black">
                    4.8 <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </span>
                </div>
              </div>
            </div>

            {/* Share & Earn Referral Program Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">Referral Program</h4>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500 text-zinc-950 tracking-widest uppercase font-mono animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-200 mt-1">Share ParkEasy & Earn Rewards</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Invite friends and unlock parking credits</p>
                </div>
              </div>
              
              <div className="flex gap-2.5 mt-1">
                <button
                  onClick={() => {
                    playCinematicSound('ripple-sonar');
                    setShareNotification("Share link copied to clipboard! Share and earn R150 credit.");
                    navigator.clipboard?.writeText?.("https://parkeasy.io/invite/shaheen");
                    setTimeout(() => setShareNotification(null), 3000);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 hover:text-emerald-400 transition flex items-center justify-center gap-1.5 text-[10px] font-bold cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share App</span>
                </button>
                
                <button
                  onClick={() => {
                    playCinematicSound('pulse-glow');
                    setRewardsOpen(true);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition flex items-center justify-center gap-1.5 text-[10px] font-extrabold cursor-pointer shadow-md shadow-emerald-500/5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Rewards</span>
                </button>
              </div>

              {shareNotification && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono text-center animate-pulse">
                  {shareNotification}
                </div>
              )}
            </div>

            {/* Interactive Options list requested by the user */}
            <div className="flex flex-col gap-1.5 mt-1" id="account-interactive-options-list">
              {[
                { 
                  id: 'personal-details', 
                  title: 'Personal Details', 
                  subtitle: 'Name, phone, email', 
                  icon: User,
                  action: () => {
                    playCinematicSound('ripple-sonar');
                    setPersonalDetailsOpen(true);
                  }
                },
                { 
                  id: 'wallet-earnings', 
                  title: 'Wallet & Earnings', 
                  subtitle: 'Payments, balance, payouts', 
                  icon: CreditCard,
                  action: () => {
                    playCinematicSound('vortex-reveal');
                    // Switch to finance view!
                    setActiveTab('finance');
                  }
                },
                { 
                  id: 'kyc-verification', 
                  title: 'KYC Verification', 
                  subtitle: 'Identity & compliance status', 
                  icon: Shield,
                  action: () => {
                    playCinematicSound('ripple-sonar');
                    setAccountSubTab('kyc');
                  }
                },
                { 
                  id: 'profile-photo', 
                  title: 'Profile Photo', 
                  subtitle: 'Update avatar', 
                  icon: Camera,
                  action: () => {
                    playCinematicSound('ripple-sonar');
                    setProfilePhotoOpen(true);
                  }
                },
                { 
                  id: 'notifications', 
                  title: 'Notifications', 
                  subtitle: 'Push & email preferences', 
                  icon: Bell,
                  action: () => {
                    playCinematicSound('ripple-sonar');
                    setNotificationsOpen(true);
                  }
                },
                { 
                  id: 'appearance', 
                  title: 'Appearance', 
                  subtitle: 'Dark mode settings', 
                  icon: Palette,
                  action: () => {
                    playCinematicSound('ripple-sonar');
                    setAppearanceOpen(true);
                  }
                },
                { 
                  id: 'terms-privacy', 
                  title: 'Terms & Privacy', 
                  subtitle: 'Legal information', 
                  icon: FileText,
                  action: () => {
                    playCinematicSound('ripple-sonar');
                    setTermsOpen(true);
                  }
                },
                { 
                  id: 'logout', 
                  title: 'Logout', 
                  subtitle: 'Sign out of account', 
                  icon: LogOut,
                  action: () => {
                    playCinematicSound('glitch-tech');
                    setLogoutOpen(true);
                  },
                  isDanger: true
                },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={opt.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-850/40 hover:bg-zinc-900/80 hover:border-zinc-850 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        opt.isDanger 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-zinc-950 border border-zinc-850 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5'
                      } transition`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold transition-all ${
                          opt.isDanger ? 'text-red-400' : 'text-zinc-200 group-hover:text-zinc-100'
                        }`}>{opt.title}</span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">{opt.subtitle}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-zinc-650 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all`} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ================= KYC SUB-TAB ================= */}
        {accountSubTab === 'kyc' && (
          <motion.div
            key="kyc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            {/* Government ID Checker */}
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-850 flex flex-col gap-3 animate-fade-in" id="kyc-progress-tracker">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Government Identity KYC Check</h4>
                  <span className="text-[10px] text-zinc-500">Verified identity unlock limits and insurance coverage.</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shrink-0 uppercase tracking-wider ${
                  kycStatus === 'verified' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-950' 
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {kycStatus === 'verified' ? 'Verified (Secure)' : 'Incomplete'}
                </span>
              </div>

              {kycStatus === 'pending' ? (
                <div className="flex flex-col gap-2 p-3 bg-zinc-950 rounded-xl border border-zinc-850">
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Your driver license scan has not been verified yet. Complete verification to activate premium 10M liability insurance!
                  </p>
                  <button
                    onClick={triggerKycSubmit}
                    className="mt-1 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold rounded-lg transition active:scale-[0.98] shadow-md shadow-emerald-500/10 cursor-pointer"
                    id="submit-kyc-documents"
                  >
                    Verify License Instantly
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-950/60 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-semibold">KYC Completed. Host eligibility and driver benefits are fully unlocked.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= SETTINGS SUB-TAB ================= */}
        {accountSubTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            {/* Host promotional card (Visible to HOST mode only) */}
            {mode === 'HOST' ? (
              <div className="p-5 rounded-2xl glass-card flex flex-col gap-3 relative overflow-hidden" id="host-listings-creation-promo">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100">Host Earning Center</h3>
                </div>

                <div className="text-xs text-zinc-300 leading-relaxed flex flex-col gap-2">
                  <p>
                    Earn up to <strong className="text-emerald-400">R12,500/month</strong> by renting out your unused parking bay, driveway, or garage space in South Africa.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Pricing is regulated between R18/hr and R50/hr to ensure high occupancy and happy drivers.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('bookings');
                    setBookingsSubTab('list-space');
                    playCinematicSound('pulse-glow');
                  }}
                  className="mt-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition shadow-lg shadow-emerald-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List a Parking Bay Now</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-zinc-850/60 bg-zinc-950/20 text-xs text-zinc-400 flex justify-between items-center">
                <span>Switch to Host mode to publish listings and manage space parameters.</span>
                <button
                  onClick={toggleMode}
                  className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-zinc-950 text-[10px] font-bold shrink-0 transition"
                >
                  Flip to Host
                </button>
              </div>
            )}

            {/* General Settings */}
            <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850 flex flex-col gap-3" id="general-settings-block">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" /> General Configuration
              </h4>

              <div className="flex flex-col gap-2.5 text-xs">
                {/* Sound */}
                <div className="flex justify-between items-center py-1.5 border-b border-zinc-850/60">
                  <div className="flex flex-col gap-0.5">
                    <span>Haptic Audio Feeds</span>
                    <span className="text-[10px] text-zinc-550">Synth effects trigger on interactions.</span>
                  </div>
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      playCinematicSound('glitch-tech');
                    }}
                    className="text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                    id="sound-toggle-switch"
                  >
                    {soundEnabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-zinc-650" />
                    )}
                  </button>
                </div>

                {/* GPS */}
                <div className="flex justify-between items-center py-1.5">
                  <div className="flex flex-col gap-0.5">
                    <span>Continuous GPS Stream</span>
                    <span className="text-[10px] text-zinc-550">Dynamic coordinates update in background.</span>
                  </div>
                  <button
                    onClick={() => {
                      setGpsUpdatesEnabled(!gpsUpdatesEnabled);
                      playCinematicSound('glitch-tech');
                    }}
                    className="text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                    id="gps-toggle-switch"
                  >
                    {gpsUpdatesEnabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-zinc-650" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Demos & Walkthroughs */}
            <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850 flex flex-col gap-3" id="demo-walkthroughs-settings-block">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Onboarding & Security
              </h4>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Experience our high-fidelity, interactive driver onboarding, vehicle custom-profiling setup, and secure gateway pass generation.
              </p>
              <button
                onClick={() => {
                  setIsOnboardingOpen(true);
                  playCinematicSound('vortex-reveal');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                id="launch-onboarding-demo-btn"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Onboarding & Sign-Up Walkthrough</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PERSONAL DETAILS DIALOG */}
      <AnimatePresence>
        {personalDetailsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-5 rounded-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-zinc-850">
                <span className="font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" /> Personal Details
                </span>
                <button 
                  onClick={() => {
                    setPersonalDetailsOpen(false);
                    setIsDetailsSaved(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="text-zinc-550 hover:text-zinc-300 font-bold transition font-mono"
                >
                  ESC
                </button>
              </div>

              {isDetailsSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold font-mono">
                  ✓ PERSONAL DETAILS SECURED
                </div>
              )}

              <div className="flex flex-col gap-3.5 mt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500 uppercase tracking-widest text-[9px] font-mono font-bold">FULL NAME</label>
                  <input 
                    type="text" 
                    value={personalName} 
                    onChange={(e) => setPersonalName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500 uppercase tracking-widest text-[9px] font-mono font-bold">PHONE NUMBER</label>
                  <input 
                    type="text" 
                    value={personalPhone} 
                    onChange={(e) => setPersonalPhone(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500 uppercase tracking-widest text-[9px] font-mono font-bold">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    value={personalEmail} 
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playCinematicSound('pulse-glow');
                setIsDetailsSaved(true);
                setTimeout(() => {
                  setPersonalDetailsOpen(false);
                  setIsDetailsSaved(false);
                }, 1200);
              }}
              className="w-full mt-4 py-3 bg-emerald-500 text-zinc-950 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-emerald-400 transition"
            >
              Apply Updates
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. REFERRAL REWARDS DIALOG */}
      <AnimatePresence>
        {rewardsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-5 rounded-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-zinc-850">
                <span className="font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-400" /> Referral Rewards
                </span>
                <button 
                  onClick={() => {
                    setRewardsOpen(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="text-zinc-550 hover:text-zinc-300 font-bold transition font-mono"
                >
                  ESC
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850 text-center flex flex-col gap-1 relative overflow-hidden">
                <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">CLAIMABLE BALANCE</span>
                <strong className="text-2xl font-mono text-emerald-400 tracking-tight">R300.00</strong>
                <span className="text-[8px] text-zinc-650 font-mono">2 successful invites completed</span>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-zinc-500 font-mono text-[9px] tracking-wider uppercase font-bold">INVITE HISTORY</span>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center p-2.5 bg-zinc-900/40 border border-zinc-850/60 rounded-xl">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-200">Zayd Toefy</span>
                      <span className="text-[9px] text-zinc-500">Joined June 2026</span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">+R150.00</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-zinc-900/40 border border-zinc-850/60 rounded-xl">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-200">Nuraan Solomons</span>
                      <span className="text-[9px] text-zinc-500">Joined May 2026</span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">+R150.00</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playCinematicSound('ripple-sonar');
                alert("R300.00 has been credited to your SimplyPay driver wallet!");
                setRewardsOpen(false);
              }}
              className="w-full mt-4 py-3 bg-emerald-500 text-zinc-950 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-emerald-400 transition"
            >
              Claim to Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. PROFILE PHOTO DIALOG */}
      <AnimatePresence>
        {profilePhotoOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-5 rounded-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-zinc-850">
                <span className="font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" /> Update Avatar
                </span>
                <button 
                  onClick={() => {
                    setProfilePhotoOpen(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="text-zinc-550 hover:text-zinc-300 font-bold transition font-mono"
                >
                  ESC
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-zinc-500 font-mono text-[9px] tracking-wider uppercase font-bold">SELECT DRIVER AVATAR PRESET</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'av1', label: 'Urban Rider', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
                    { id: 'av2', label: 'Tech Pilot', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80' },
                    { id: 'av3', label: 'Eco Navigator', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
                    { id: 'av4', label: 'Stealth Cruiser', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
                  ].map((av) => {
                    const isSelected = profilePhotoUrl === av.url;
                    return (
                      <div 
                        key={av.id}
                        onClick={() => {
                          setProfilePhotoUrl(av.url);
                          playCinematicSound('ripple-sonar');
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition ${
                          isSelected ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-850 hover:border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-10 h-10 rounded-full object-cover border border-zinc-800" referrerPolicy="no-referrer" />
                        <span className="text-[9px] font-bold tracking-tight uppercase">{av.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playCinematicSound('pulse-glow');
                setProfilePhotoOpen(false);
              }}
              className="w-full mt-4 py-3 bg-emerald-500 text-zinc-950 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-emerald-400 transition"
            >
              Apply Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. NOTIFICATIONS PREFERENCES DIALOG */}
      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-5 rounded-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-zinc-850">
                <span className="font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-400" /> Notifications
                </span>
                <button 
                  onClick={() => {
                    setNotificationsOpen(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="text-zinc-550 hover:text-zinc-300 font-bold transition font-mono"
                >
                  ESC
                </button>
              </div>

              <span className="text-zinc-500 font-mono text-[9px] tracking-wider uppercase font-bold">CHANNELS PREFERENCES</span>

              <div className="flex flex-col gap-3">
                {[
                  { id: 'n1', label: 'Push Bookings Updates', desc: 'Alerts when your reserved bay changes status.' },
                  { id: 'n2', label: 'Host Revenue Alerts', desc: 'Instant feedback when payments clear.' },
                  { id: 'n3', label: 'GPS Tracking Stream', desc: 'Real-time turn-by-turn instruction reminders.' },
                  { id: 'n4', label: 'Promo & Rewards', desc: 'Receive credit vouchers and extra bonuses.' },
                ].map((item) => (
                  <label key={item.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-850 transition cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-zinc-800 bg-zinc-950 text-emerald-500 mt-0.5 focus:ring-0 focus:ring-offset-0" 
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-zinc-200">{item.label}</span>
                      <span className="text-[9px] text-zinc-500 leading-normal">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                playCinematicSound('pulse-glow');
                setNotificationsOpen(false);
              }}
              className="w-full mt-4 py-3 bg-emerald-500 text-zinc-950 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-emerald-400 transition"
            >
              Save Preferences
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. APPEARANCE SETTINGS DIALOG */}
      <AnimatePresence>
        {appearanceOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-5 rounded-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-zinc-850">
                <span className="font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-emerald-400" /> Theme & Style
                </span>
                <button 
                  onClick={() => {
                    setAppearanceOpen(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="text-zinc-550 hover:text-zinc-300 font-bold transition font-mono"
                >
                  ESC
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-zinc-500 font-mono text-[9px] tracking-wider uppercase font-bold">NEON GLOW HIGHLIGHTS</span>
                
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'emerald', label: 'Emerald Green', desc: 'Secure verification green (Standard)', activeColor: 'bg-emerald-400' },
                    { id: 'cyan', label: 'Cyberpunk Blue', desc: 'Ocean Cape Town blue highlights', activeColor: 'bg-cyan-400' },
                    { id: 'gold', label: 'Sol Gold', desc: 'High brightness daylight solar look', activeColor: 'bg-yellow-500' },
                  ].map((color) => {
                    const isSelected = color.id === 'emerald';
                    return (
                      <div 
                        key={color.id}
                        onClick={() => {
                          playCinematicSound('ripple-sonar');
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected ? 'bg-zinc-900 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/40 border-zinc-850/60 text-zinc-400 hover:border-zinc-800'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-zinc-200">{color.label}</span>
                          <span className="text-[9px] text-zinc-550">{color.desc}</span>
                        </div>
                        <span className={`w-3.5 h-3.5 rounded-full ${color.activeColor} ${isSelected ? 'ring-4 ring-emerald-500/20' : ''}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-850 text-center">
                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider font-mono">Ambient Space Glow</span>
                <p className="text-[9px] text-zinc-550 leading-normal">
                  Injects slow pulsing ambient backdrop radar fields onto the Map grid for advanced immersion.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playCinematicSound('pulse-glow');
                setAppearanceOpen(false);
              }}
              className="w-full mt-4 py-3 bg-emerald-500 text-zinc-950 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-emerald-400 transition"
            >
              Confirm Theme
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. TERMS & PRIVACY DIALOG */}
      <AnimatePresence>
        {termsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-5 rounded-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-zinc-850">
                <span className="font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> Legal & Terms
                </span>
                <button 
                  onClick={() => {
                    setTermsOpen(false);
                    playCinematicSound('glitch-tech');
                  }}
                  className="text-zinc-550 hover:text-zinc-300 font-bold transition font-mono"
                >
                  ESC
                </button>
              </div>

              <div className="flex flex-col gap-3.5 max-h-[36vh] overflow-y-auto pr-1 text-[10px] text-zinc-400 leading-relaxed font-sans custom-scrollbar">
                <div>
                  <h5 className="font-bold text-zinc-200 uppercase tracking-wider font-mono mb-1">1. SECURE DECENTRALIZATION</h5>
                  <p>
                    All ParkEasy secure barrier passcodes and driver credentials are encrypted using localized cryptographic keys. ParkEasy never sells telemetry location data or personal contact coordinates to third parties.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-200 uppercase tracking-wider font-mono mb-1">2. SOUTH AFRICAN BYLAWS</h5>
                  <p>
                    Listing prices are heavily regulated in South African ZAR (ZAR R18 to R50 per hour) to promote accessible parking spaces, avoid highway overcrowding, and remain compliant with Cape Town municipal bylaws.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-200 uppercase tracking-wider font-mono mb-1">3. LIABILITY INSURANCE</h5>
                  <p>
                    Verified KYC drivers are automatically backed by a premium R10,000,000 third-party civil liability policy whenever actively navigating, checking in, or parked inside a host's designated premises.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playCinematicSound('ripple-sonar');
                setTermsOpen(false);
              }}
              className="w-full mt-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl font-bold uppercase text-[10px] tracking-wider transition cursor-pointer"
            >
              Acknowledge
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. LOGOUT CONFIRMATION */}
      <AnimatePresence>
        {logoutOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-5 rounded-2xl flex flex-col justify-center text-center gap-5"
          >
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 border border-red-500/25 flex items-center justify-center mx-auto animate-bounce">
              <LogOut className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[10px] text-red-400 font-mono uppercase tracking-widest font-black">Disconnect Session</span>
              <h3 className="text-sm font-bold text-zinc-100 mt-1">Are you sure you want to log out?</h3>
              <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Your encrypted local session token will be destroyed. You will need to re-scan security keys to access your wallet and active bookings.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2 w-full max-w-xs mx-auto">
              <button
                onClick={() => {
                  playCinematicSound('glitch-tech');
                  setLogoutOpen(false);
                  setIsSessionLocked(true);
                }}
                className="w-full py-3 bg-red-500 hover:bg-red-400 text-zinc-950 font-black uppercase text-[10px] tracking-wider rounded-xl transition cursor-pointer"
              >
                Disconnect Instantly
              </button>

              <button
                onClick={() => {
                  playCinematicSound('ripple-sonar');
                  setLogoutOpen(false);
                }}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800 rounded-xl font-bold text-[10px] tracking-wider transition cursor-pointer"
              >
                Stay Connected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. GEOGRAPHICAL MAP PINNING DIALOG */}
      <AnimatePresence>
        {pinningModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-zinc-950/98 z-50 p-4 rounded-2xl flex flex-col"
            id="map-pinning-dialog-modal"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-2.5 border-b border-zinc-850 shrink-0">
              <div className="flex flex-col">
                <span className="font-bold uppercase tracking-wider text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400 animate-pulse" /> Pin exact location on map
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-sans">Click any street in Cape Town to plant your secure booking pin</span>
              </div>
              <button 
                onClick={() => {
                  setPinningModalOpen(false);
                  playCinematicSound('glitch-tech');
                }}
                className="text-zinc-550 hover:text-zinc-300 font-bold transition font-mono text-xs cursor-pointer bg-zinc-900 px-2 py-1 rounded"
              >
                ESC / CLOSE
              </button>
            </div>

            {/* Map Canvas Section */}
            <div className="flex-1 w-full rounded-2xl overflow-hidden mt-3 border border-zinc-900 relative bg-zinc-950">
              <ReactMap
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  longitude: pinnedLongitude || 18.4241,
                  latitude: pinnedLatitude || -33.9249,
                  zoom: 13.5,
                  pitch: 30,
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                style={{ width: '100%', height: '100%' }}
                onClick={(evt) => {
                  if (evt.lngLat) {
                    setPinnedLatitude(evt.lngLat.lat);
                    setPinnedLongitude(evt.lngLat.lng);
                    setHasPinnedLocation(true);
                    playCinematicSound('ripple-sonar');
                  }
                }}
              >
                {/* Selected location marker */}
                <MapboxMarker
                  longitude={pinnedLongitude}
                  latitude={pinnedLatitude}
                  anchor="bottom"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="absolute rounded-full -top-12 w-14 h-14 bg-emerald-500/20 animate-ping" />
                    
                    {/* Glowing Teardrop Pin */}
                    <div className="relative">
                      <svg width="32" height="36" viewBox="0 0 24 28" fill="none" className="drop-shadow-lg">
                        <path
                          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 12 26 12 26C12 26 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                          fill="#10b981"
                          stroke="#34d399"
                          strokeWidth="1.5"
                        />
                        <text
                          x="9"
                          y="15"
                          fill="#09090b"
                          fontSize="8px"
                          fontWeight="black"
                          fontFamily="monospace"
                        >
                          P
                        </text>
                      </svg>
                    </div>
                  </div>
                </MapboxMarker>
              </ReactMap>

              {/* Top layer floating coordinates badge */}
              <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-900/80 backdrop-blur-md px-3 py-2 rounded-xl flex flex-col gap-0.5">
                <span className="text-[8px] font-mono tracking-wider text-zinc-500 uppercase">GPS SYSTEM WATERMARK</span>
                <span className="text-[11px] font-mono text-zinc-200 font-bold">
                  {pinnedLatitude.toFixed(5)}° S, {pinnedLongitude.toFixed(5)}° E
                </span>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="mt-3.5 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setHasPinnedLocation(true);
                  setPinningModalOpen(false);
                  playCinematicSound('vortex-reveal');
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl font-bold uppercase text-[10px] tracking-wider transition cursor-pointer text-center"
              >
                Confirm Location Pin
              </button>
              <button
                type="button"
                onClick={() => {
                  setPinningModalOpen(false);
                  playCinematicSound('glitch-tech');
                }}
                className="py-3 px-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 rounded-xl font-bold uppercase text-[10px] tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
