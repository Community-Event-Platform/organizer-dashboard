import React, { useState } from 'react';
import '../css/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    agree: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/login' : '/api/register';
    const payload = mode === 'login' 
      ? { email: formData.email, password: formData.password }
      : { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          password_confirmation: formData.password_confirmation,
          role: 'organizer' 
        };

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Success
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      if (onAuthSuccess) onAuthSuccess(data.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const UserIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const EmailIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  const LockIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>&times;</button>
        
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản mới'}</h2>
          <p>
            {mode === 'login' 
              ? 'Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục quản lý sự kiện của bạn.'
              : 'Hãy tham gia cộng đồng của chúng tôi và bắt đầu tạo ra những sự kiện tuyệt vời cho cộng đồng của bạn.'}
          </p>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth-form-group">
              <label>Full name:</label>
              <div className="input-container">
                <span className="input-icon"><UserIcon /></span>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          )}

          <div className="auth-form-group">
            <label>Email:</label>
            <div className="input-container">
              <span className="input-icon"><EmailIcon /></span>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label>Password:</label>
            <div className="input-container">
              <span className="input-icon"><LockIcon /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                <EyeIcon />
              </span>
            </div>
          </div>

          {mode === 'register' && (
            <div className="auth-form-group">
              <label>Confirm password:</label>
              <div className="input-container">
                <span className="input-icon"><LockIcon /></span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password_confirmation"
                  placeholder="Confirm enter your password" 
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="auth-checkbox-group">
              <input 
                type="checkbox" 
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required 
              />
              <span>Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của EventHub.</span>
            </div>
          )}

          <button 
            type="submit" 
            className={`auth-btn ${mode === 'login' ? 'btn-login-submit' : 'btn-register-submit'}`}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
          </button>

          <div className="auth-switch-text">
            {mode === 'login' ? (
              <>Bạn chưa có tài khoản? <span className="auth-switch-link" onClick={() => setMode('register')}>Đăng ký ngay</span></>
            ) : (
              <>Bạn đã có tài khoản? <span className="auth-switch-link" onClick={() => setMode('login')}>Đăng nhập ngay</span></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
