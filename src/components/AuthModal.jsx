import React, { useState } from 'react';
import '../css/AuthModal.css';

const API_BASE_URL = 'http://localhost:8000';

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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      <div className="auth-modal p-4" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close close-modal" onClick={onClose} aria-label="Close"></button>
        
        <div className="auth-modal-header text-center mb-4">
          <h2 className="fw-bold">{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản mới'}</h2>
          <p className="text-muted small">
            {mode === 'login' 
              ? 'Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục quản lý sự kiện của bạn.'
              : 'Hãy tham gia cộng đồng của chúng tôi và bắt đầu tạo ra những sự kiện tuyệt vời cho cộng đồng của bạn.'}
          </p>
        </div>

        {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label fw-semibold small">Full name:</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-person text-secondary"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  name="name"
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold small">Email:</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope text-secondary"></i>
              </span>
              <input 
                type="email" 
                className="form-control border-start-0" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Password:</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock text-secondary"></i>
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control border-start-0 border-end-0" 
                name="password"
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <span className="input-group-text bg-white border-start-0" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-secondary`}></i>
              </span>
            </div>
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label fw-semibold small">Confirm password:</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-lock text-secondary"></i>
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control border-start-0" 
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
            <div className="form-check mb-4 small">
              <input 
                className="form-check-input" 
                type="checkbox" 
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                id="agreeCheck"
                required 
              />
              <label className="form-check-label" htmlFor="agreeCheck">
                Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của EventHub.
              </label>
            </div>
          )}

          <button 
            type="submit" 
            className={`btn w-100 py-2 fw-bold mb-3 ${mode === 'login' ? 'btn-success btn-login-submit' : 'btn-warning btn-register-submit'}`}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
          </button>

          <div className="text-center small">
            {mode === 'login' ? (
              <>Bạn chưa có tài khoản? <span className="text-primary fw-bold cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => setMode('register')}>Đăng ký ngay</span></>
            ) : (
              <>Bạn đã có tài khoản? <span className="text-primary fw-bold cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => setMode('login')}>Đăng nhập ngay</span></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
