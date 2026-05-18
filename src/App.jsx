import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Hero from './components/pages/Hero'
import Dashboard from './components/pages/Dashboard'
import Footer from './components/layout/Footer'
import AuthModal from './components/AuthModal'
import { ToastContainer, useToast } from './components/Toast'
import './components/css/App.css'

/**
 * App - Root component for EventHub Organizer Dashboard
 * Manages: authentication state, tab navigation, toast notifications
 */
function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState('home');
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const { toasts, addToast, removeToast } = useToast();

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('home');
    addToast('Đăng xuất thành công!', 'success');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setActiveTab('home');
  };

  // Render main content based on login state and active tab
  const renderContent = () => {
    if (!user) {
      return <Hero />;
    }
    switch (activeTab) {
      case 'home':
      default:
        return <Dashboard addToast={addToast} />;
    }
  };

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Navigation */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLoginClick={() => openAuthModal('login')}
        onRegisterClick={() => openAuthModal('register')}
        onLogout={handleLogout}
      />

      {/* Main content */}
      {renderContent()}

      {/* Footer */}
      <Footer />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
        addToast={addToast}
      />
    </>
  )
}

export default App
