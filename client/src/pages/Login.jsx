import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Primary States
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Form Data States
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryData, setRecoveryData] = useState({ otp: '', newPassword: '', confirmPassword: '' });
  
  // Feedback & Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecoveryChange = (e) => {
    setRecoveryData({ ...recoveryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? formData : { email: formData.email, password: formData.password };
      
      const res = await api.post(endpoint, payload);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Gmail
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await api.post('/auth/forgot-password', { email: recoveryEmail });
      setOtpSent(true);
      setSuccessMsg('Verification OTP has been sent successfully to your Gmail inbox!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (recoveryData.newPassword !== recoveryData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/reset-password-otp', {
        email: recoveryEmail,
        otp: recoveryData.otp,
        newPassword: recoveryData.newPassword
      });
      setSuccessMsg(res.data.message || 'Password updated successfully!');
      
      // Reset recovery states
      setRecoveryData({ otp: '', newPassword: '', confirmPassword: '' });
      setRecoveryEmail('');
      setOtpSent(false);

      setTimeout(() => {
        setIsForgot(false);
        setSuccessMsg('');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your credentials or OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[var(--color-dark-bg)]">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-white uppercase tracking-widest mb-2">
            {isForgot ? (otpSent ? 'Verify OTP' : 'Forgot Password') : isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto"></div>
        </div>

        {/* Status Alerts */}
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 text-sm mb-6 text-center">{error}</div>}
        {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 text-sm mb-6 text-center">{successMsg}</div>}

        {/* FORGOT PASSWORD FLOW */}
        {isForgot ? (
          !otpSent ? (
            /* STAGE 1: Request OTP Form */
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Registered Email Address</label>
                <input 
                  type="email" 
                  value={recoveryEmail} 
                  onChange={(e) => setRecoveryEmail(e.target.value)} 
                  required 
                  placeholder="Enter email to get OTP"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-8 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 font-bold"
              >
                {loading ? 'Sending Code...' : 'Send OTP to Gmail'}
              </button>

              <div className="mt-8 text-center">
                <button 
                  type="button"
                  onClick={() => { setIsForgot(false); setError(''); setSuccessMsg(''); }} 
                  className="text-gray-400 text-sm hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            /* STAGE 2: Verify OTP & Reset Password Form */
            <form onSubmit={handleVerifyAndReset} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">6-Digit Verification OTP</label>
                <input 
                  type="text" 
                  name="otp" 
                  value={recoveryData.otp} 
                  onChange={handleRecoveryChange} 
                  required 
                  maxLength={6}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors text-center tracking-[0.3em] font-mono text-lg font-bold" 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={recoveryData.newPassword} 
                  onChange={handleRecoveryChange} 
                  required 
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={recoveryData.confirmPassword} 
                  onChange={handleRecoveryChange} 
                  required 
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-8 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 font-bold"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Reset'}
              </button>

              <div className="mt-8 text-center flex justify-between px-4">
                <button 
                  type="button"
                  onClick={() => { setOtpSent(false); setError(''); setSuccessMsg(''); }} 
                  className="text-gray-400 text-xs hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                >
                  Resend OTP
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsForgot(false); setOtpSent(false); setError(''); setSuccessMsg(''); }} 
                  className="text-gray-400 text-xs hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )
        ) : (
          /* STANDARD SIGN-IN / REGISTER FORM */
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors" 
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-widest text-gray-400">Password</label>
                {!isRegister && (
                  <button 
                    type="button"
                    onClick={() => { setIsForgot(true); setError(''); setSuccessMsg(''); }}
                    className="text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors font-bold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-8 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 font-bold"
            >
              {loading ? 'Processing...' : (isRegister ? 'Register' : 'Sign In')}
            </button>

            <div className="mt-8 text-center">
              <button 
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMsg(''); }} 
                className="text-gray-400 text-sm hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
              >
                {isRegister ? 'Already have an account? Sign In' : 'New to Lumina? Create Account'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
