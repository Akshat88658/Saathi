import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import BecomeSaathi from './components/BecomeSaathi';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

import BookingModal from './components/BookingModal';
import ApplyModal from './components/ApplyModal';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import ClientDashboard from './components/ClientDashboard';
import SaathiDashboard from './components/SaathiDashboard';

type AppView =
  | 'home'
  | 'services'
  | 'how-it-works'
  | 'why-saathi'
  | 'join-us'
  | 'faq'
  | 'jobs'
  | 'client-dashboard'
  | 'saathi-dashboard';

interface UserProfile {
  role: 'client' | 'saathi';
  name: string;
  phone: string;
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load saved profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('saathi_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch {
        localStorage.removeItem('saathi_profile');
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [currentView]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('saathi_profile', JSON.stringify(profile));
    // Auto-navigate to correct dashboard
    const target = profile.role === 'saathi' ? 'saathi-dashboard' : 'client-dashboard';
    setCurrentView(target);
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('saathi_profile');
    setCurrentView('home');
    showToast('Logged out successfully.', 'success');
  };

  const renderContent = () => {
    switch (currentView) {
      // ── Dashboards ────────────────────────────────────────────────────────
      case 'client-dashboard':
        if (!userProfile || userProfile.role !== 'client') {
          setCurrentView('home');
          setIsLoginOpen(true);
          return null;
        }
        return (
          <ClientDashboard
            userProfile={userProfile}
            showToast={showToast}
          />
        );

      case 'saathi-dashboard':
        if (!userProfile || userProfile.role !== 'saathi') {
          setCurrentView('home');
          setIsLoginOpen(true);
          return null;
        }
        return (
          <SaathiDashboard
            userProfile={userProfile}
            showToast={showToast}
          />
        );

      // ── Legacy jobs console (redirects saathis) ───────────────────────────
      case 'jobs':
        if (userProfile?.role === 'saathi') {
          setCurrentView('saathi-dashboard');
          return null;
        }
        setCurrentView('home');
        setIsLoginOpen(true);
        return null;

      // ── Static pages ──────────────────────────────────────────────────────
      case 'services':
        return (
          <>
            <div style={{ paddingTop: '6rem', minHeight: '80vh' }}>
              <Services onBookClick={() => setIsBookingOpen(true)} />
            </div>
            <Footer />
          </>
        );
      case 'how-it-works':
        return (
          <>
            <div style={{ paddingTop: '6rem', minHeight: '80vh' }}>
              <HowItWorks />
            </div>
            <Footer />
          </>
        );
      case 'why-saathi':
        return (
          <>
            <div style={{ paddingTop: '6rem', minHeight: '80vh' }}>
              <Benefits />
            </div>
            <Footer />
          </>
        );
      case 'join-us':
        return (
          <>
            <div style={{ paddingTop: '6rem', minHeight: '80vh' }}>
              <BecomeSaathi onApplyClick={() => setIsApplyOpen(true)} />
            </div>
            <Footer />
          </>
        );
      case 'faq':
        return (
          <>
            <div style={{ paddingTop: '6rem', minHeight: '80vh' }}>
              <FAQ />
            </div>
            <Footer />
          </>
        );

      // ── Home ──────────────────────────────────────────────────────────────
      case 'home':
      default:
        return (
          <main>
            <Hero
              onBookClick={() => {
                if (userProfile?.role === 'client') setCurrentView('client-dashboard');
                else { setIsBookingOpen(true); }
              }}
              onApplyClick={() => {
                if (userProfile?.role === 'saathi') setCurrentView('saathi-dashboard');
                else setIsLoginOpen(true);
              }}
            />
            <Services onBookClick={() => setIsBookingOpen(true)} />
            <HowItWorks />
            <Benefits />
            <BecomeSaathi onApplyClick={() => setIsApplyOpen(true)} />
            <Testimonials />
            <FAQ />
            <Footer />
          </main>
        );
    }
  };

  return (
    <div className="noise-overlay" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar
        onBookClick={() => {
          if (userProfile?.role === 'client') setCurrentView('client-dashboard');
          else setIsBookingOpen(true);
        }}
        onJobsClick={() => {
          if (userProfile?.role === 'saathi') setCurrentView('saathi-dashboard');
          else setIsLoginOpen(true);
        }}
        onNavigate={setCurrentView}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        currentView={currentView}
        userProfile={userProfile}
      />

      {renderContent()}

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        showToast={showToast}
      />

      <ApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        showToast={showToast}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        showToast={showToast}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
