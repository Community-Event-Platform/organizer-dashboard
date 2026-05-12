import React, { useState, useEffect } from 'react';
import { organizerLogin, organizerRegister } from '../services/api';
import '../css/AuthModal.css';

/**
 * AuthModal - Handles both Login and Register for Organizer
 * Features: Email validation, password toggle, loading state, toast notifications
 */
const AuthModal = ({ isOpen, mode: initialMode = 'login', onClose, onAuthSuccess, addToast }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    agree: false,
  });

  // Sync mode when prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrors({});
  }, [initialMode]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '', password: '', password_confirmation: '', agree: false });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (mode === 'register' && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (mode === 'register') {
      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Vui lòng xác nhận mật khẩu';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Mật khẩu xác nhận không khớp';
      }

      if (!formData.agree) {
        newErrors.agree = 'Bạn phải đồng ý với điều khoản dịch vụ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === 'login') {
        // ===== LOGIN =====
        const response = await organizerLogin({
          email: formData.email,
          password: formData.password,
        });

        const data = response.data;

        // Save token and organizer info to localStorage
        localStorage.setItem('token', data.token || data.access_token);
        localStorage.setItem('user', JSON.stringify(data.organizer || data.data));

        if (addToast) addToast('Đăng nhập thành công! 🎉', 'success');
        if (onAuthSuccess) onAuthSuccess(data.organizer || data.data);
        onClose();
      } else {
        // ===== REGISTER =====
        await organizerRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        });

        if (addToast) addToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        
        // Switch to login mode after successful registration
        setMode('login');
        setFormData({ name: '', email: formData.email, password: '', password_confirmation: '', agree: false });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      if (addToast) addToast(errorMessage, 'error');
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setFormData({ name: '', email: '', password: '', password_confirmation: '', agree: false });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-modal" onClick={onClose} aria-label="Close">
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-icon">
            <i className={`bi ${mode === 'login' ? 'bi-box-arrow-in-right' : 'bi-person-plus'}`}></i>
          </div>
          <h2>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản mới'}</h2>
          <p>
            {mode === 'login'
              ? 'Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục quản lý sự kiện của bạn.'
              : 'Hãy tham gia cộng đồng của chúng tôi và bắt đầu tạo ra những sự kiện tuyệt vời.'}
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="auth-error-banner">
            <i className="bi bi-exclamation-circle"></i>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name field - Register only */}
          {mode === 'register' && (
            <div className="auth-form-group">
              <label className="auth-label">Họ và tên</label>
              <div className={`auth-input-wrapper ${errors.name ? 'input-error' : ''}`}>
                <i className="bi bi-person auth-input-icon"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập họ tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              {errors.name && <span className="auth-field-error">{errors.name}</span>}
            </div>
          )}

          {/* Email field */}
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <div className={`auth-input-wrapper ${errors.email ? 'input-error' : ''}`}>
              <i className="bi bi-envelope auth-input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Password field */}
          <div className="auth-form-group">
            <label className="auth-label">Mật khẩu</label>
            <div className={`auth-input-wrapper ${errors.password ? 'input-error' : ''}`}>
              <i className="bi bi-lock auth-input-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password - Register only */}
          {mode === 'register' && (
            <div className="auth-form-group">
              <label className="auth-label">Xác nhận mật khẩu</label>
              <div className={`auth-input-wrapper ${errors.password_confirmation ? 'input-error' : ''}`}>
                <i className="bi bi-lock auth-input-icon"></i>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.password_confirmation && <span className="auth-field-error">{errors.password_confirmation}</span>}
            </div>
          )}

          {/* Agree checkbox - Register only */}
          {mode === 'register' && (
            <div className="auth-checkbox-group">
              <input
                type="checkbox"
                name="agree"
                id="agreeCheck"
                checked={formData.agree}
                onChange={handleChange}
                className="auth-checkbox"
              />
              <label htmlFor="agreeCheck" className="auth-checkbox-label">
                Tôi đồng ý với <a href="#" className="auth-link">Điều khoản dịch vụ</a> và{' '}
                <a href="#" className="auth-link">Chính sách bảo mật</a> của EventHub.
              </label>
              {errors.agree && <span className="auth-field-error">{errors.agree}</span>}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className={`auth-submit-btn ${mode === 'login' ? 'btn-login-green' : 'btn-register-orange'}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Đang xử lý...
              </>
            ) : (
              mode === 'login' ? 'Đăng nhập' : 'Đăng ký'
            )}
          </button>

          {/* Switch mode */}
          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                Bạn chưa có tài khoản?{' '}
                <span className="auth-switch-link" onClick={() => switchMode('register')}>
                  Đăng ký ngay
                </span>
              </>
            ) : (
              <>
                Bạn đã có tài khoản?{' '}
                <span className="auth-switch-link" onClick={() => switchMode('login')}>
                  Đăng nhập ngay
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
