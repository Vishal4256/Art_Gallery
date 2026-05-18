import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [recoveryData, setRecoveryData] = useState({ email: '', newPassword: '', confirmPassword: '' });
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

  const handleRecoverySubmit = async (e) => {
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
      const res = await api.post('/auth/reset-password', {
        email: recoveryData.email,
        newPassword: recoveryData.newPassword
      });
      setSuccessMsg(res.data.message || 'Password reset successfully!');
      setRecoveryData({ email: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setIsForgot(false);
        setSuccessMsg('');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your credentials.');
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
            {isForgot ? 'Recover Password' : isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto"></div>
        </div>

        {/* Status Alerts */}
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 text-sm mb-6 text-center">{error}</div>}
        {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 text-sm mb-6 text-center">{successMsg}</div>}

        {/* FORGOT PASSWORD FORM */}
        {isForgot ? (
          <form onSubmit={handleRecoverySubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Registered Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={recoveryData.email} 
                onChange={handleRecoveryChange} 
                required 
                className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-transparent focus:border-white focus:outline-none transition-colors" 
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
              {loading ? 'Processing...' : 'Reset Password'}
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
                    className="text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
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
