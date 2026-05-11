import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import './css/App.css'

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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
  };

  return (
    <>
      <Navbar 
        user={user} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLoginClick={() => openAuthModal('login')} 
        onRegisterClick={() => openAuthModal('register')} 
        onLogout={handleLogout}
      />
      {user ? (
        activeTab === 'dashboard' ? <Dashboard /> : <div className="container py-5"><h2>Guest Management (Coming Soon)</h2></div>
      ) : <Hero />}
      <Footer />
      
      <AuthModal 
        isOpen={authModal.isOpen} 
        mode={authModal.mode} 
        onClose={closeAuthModal}
        onAuthSuccess={(userData) => setUser(userData)}
      />
    </>
  )
}

export default App
