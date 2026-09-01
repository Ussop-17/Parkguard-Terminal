
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { User } from '../types';
import Navbar from './Navbar';
import Modal from './Modal';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Check hardcoded admin for convenience
    if (trimmedUsername === 'admin' && trimmedPassword === 'admin') {
      onLogin({
        id: '1',
        username: 'admin',
        role: 'admin',
        location: 'Main Terminal',
      });
      return;
    }

    // Check against registered users
    const user = users.find(u => u.username === trimmedUsername && u.password === trimmedPassword);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onNavigate={onNavigate} />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md"
        >
          <button 
            onClick={() => onNavigate('home')}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200 sm:p-12">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                <Shield size={32} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
              <p className="mt-2 text-slate-500">Log in to your terminal account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Username</label>
                <input 
                  type="text" 
                  placeholder="Enter your username"
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
                    error ? 'border-red-200 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                  <button 
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-900"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
                      error ? 'border-red-200 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              <button 
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-4 text-lg font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-2xl"
              >
                Log In
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <button 
                onClick={() => onNavigate('signup')}
                className="font-bold text-slate-900 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </motion.div>
      </main>

      <Modal 
        isOpen={isForgotModalOpen} 
        onClose={() => setIsForgotModalOpen(false)} 
        title="Reset Password"
      >
        <p>Reset your password by visiting the nearest Meeseva center.</p>
      </Modal>
    </div>
  );
};

export default Login;
