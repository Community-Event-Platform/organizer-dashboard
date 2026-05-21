import { useState, useEffect } from 'react';
import { organizerLogin, organizerRegister } from '../services/api';
import './css/AuthModal.css';

const AuthModal = ({ isOpen, mode: initialMode = 'login', onClose, onAuthSuccess, addToast }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    agree: false,
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMode(initialMode);
    setErrors({});
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      setFormData({ full_name: '', email: '', password: '', password_confirmation: '', agree: false });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'register' && !formData.full_name.trim()) {
      newErrors.full_name = 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    } else if (mode === 'register' && formData.password.length < 6) {
      newErrors.password = 'Password must have at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Please confirm your password';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Password confirmation does not match';
      }

      if (!formData.agree) {
        newErrors.agree = 'You must agree to the terms of service';
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
        const response = await organizerLogin({
          email: formData.email,
          password: formData.password,
        });

        const data = response.data;
        localStorage.setItem('token', data.token || data.access_token);
        localStorage.setItem('user', JSON.stringify(data.organizer || data.data));

        if (addToast) addToast('Login successful!', 'success');
        if (onAuthSuccess) onAuthSuccess(data.organizer || data.data);
        onClose();
      } else {
        await organizerRegister({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role: 'organizer',
        });

        if (addToast) addToast('Registration successful! Please login.', 'success');
        setMode('login');
        setFormData({ full_name: '', email: formData.email, password: '', password_confirmation: '', agree: false });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
      if (addToast) addToast(errorMessage, 'error');
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setFormData({ full_name: '', email: '', password: '', password_confirmation: '', agree: false });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} aria-label="Close">
          <i className="bi bi-x-lg"></i>
        </button>

        <div className="auth-modal-header">
          <div className="auth-logo-icon">
            <i className={`bi ${mode === 'login' ? 'bi-box-arrow-in-right' : 'bi-person-plus'}`}></i>
          </div>
          <h2>{mode === 'login' ? 'Login' : 'Register a new account'}</h2>
          <p>
            {mode === 'login'
              ? 'Welcome back! Please login to continue managing your events.'
              : 'Join our community and start creating great events.'}
          </p>
        </div>

        {errors.general && (
          <div className="auth-error-banner">
            <i className="bi bi-exclamation-circle"></i>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <div className={`auth-input-wrapper ${errors.full_name ? 'input-error' : ''}`}>
                <i className="bi bi-person auth-input-icon"></i>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              {errors.full_name && <span className="auth-field-error">{errors.full_name}</span>}
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <div className={`auth-input-wrapper ${errors.email ? 'input-error' : ''}`}>
              <i className="bi bi-envelope auth-input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className={`auth-input-wrapper ${errors.password ? 'input-error' : ''}`}>
              <i className="bi bi-lock auth-input-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
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

          {mode === 'register' && (
            <div className="auth-form-group">
              <label className="auth-label">Confirm Password</label>
              <div className={`auth-input-wrapper ${errors.password_confirmation ? 'input-error' : ''}`}>
                <i className="bi bi-lock auth-input-icon"></i>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  placeholder="Re-enter your password"
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
                I agree to the <a href="#" className="auth-link">Terms of Service</a> and{' '}
                <a href="#" className="auth-link">Privacy Policy</a> of EventHub.
              </label>
              {errors.agree && <span className="auth-field-error">{errors.agree}</span>}
            </div>
          )}

          <button
            type="submit"
            className={`auth-submit-btn ${mode === 'login' ? 'btn-login-green' : 'btn-register-orange'}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Processing...
              </>
            ) : (
              mode === 'login' ? 'Login' : 'Register'
            )}
          </button>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span className="auth-switch-link" onClick={() => switchMode('register')}>
                  Register now
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span className="auth-switch-link" onClick={() => switchMode('login')}>
                  Login now
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