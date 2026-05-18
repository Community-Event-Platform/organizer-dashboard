import { useState, useRef, useEffect } from 'react';
import '../css/Navbar.css';

/**
 * Navbar - Top navigation bar
 * Shows: Logo, nav links, user profile (when logged in) or Login/Register buttons
 * Features: Avatar dropdown with logout, active tab highlighting
 */
const Navbar = ({ user, onLoginClick, onRegisterClick, onLogout, activeTab, onTabChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => onTabChange('home')}>
          <i className="bi bi-lightning-charge-fill" style={{ color: '#14AE5C', fontSize: '28px' }}></i>
          <span className="logo-text">EventHub</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav links */}
        <ul className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <a
              href="#"
              className={activeTab === 'home' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onTabChange('home'); setMobileMenuOpen(false); }}
            >
              Trang chủ
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'about' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onTabChange('about'); setMobileMenuOpen(false); }}
            >
              Giới thiệu
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (!user) {
                  alert('Bạn phải đăng nhập để sử dụng trang này.');
                } else {
                  // Handle events tab
                }
              }}
            >
              Sự kiện
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'participants' ? 'active' : ''}
              onClick={(e) => { 
                e.preventDefault(); 
                if (!user) {
                  alert('Bạn phải đăng nhập để sử dụng trang này.');
                } else {
                  onTabChange('participants'); 
                }
                setMobileMenuOpen(false); 
              }}
            >
              Người tham gia
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-profile" ref={dropdownRef} onClick={() => setShowDropdown(!showDropdown)}>
              <span className="user-name">
                {user.name}
              </span>
              <div className="user-avatar">
                <i className="bi bi-person-fill" style={{ fontSize: '18px', color: '#fff' }}></i>
              </div>
              <i className="bi bi-caret-down-fill dropdown-arrow"></i>

              {/* Dropdown menu */}
              {showDropdown && (
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{getInitials(user.name)}</div>
                    <div className="dropdown-info">
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { onLogout(); setShowDropdown(false); }}>
                    <i className="bi bi-box-arrow-right"></i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={onLoginClick}>Đăng nhập</button>
              <button className="btn-register" onClick={onRegisterClick}>Đăng ký</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
