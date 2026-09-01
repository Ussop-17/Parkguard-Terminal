
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Shield, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
import { User } from '../types';

interface SignUpProps {
  onSignUp: (user: User) => void;
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    aadharNumber: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        role: 'user',
        location: formData.address,
        password: formData.password, // In a real app, we'd hash this
      };
      onSignUp(newUser);
      alert('Account created successfully! Please log in.');
    }
  };

  const inputClasses = (field: string) => `
    w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none
    ${errors[field] 
      ? 'border-red-200 bg-red-50 focus:border-red-500' 
      : 'border-slate-200 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900'}
  `;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onNavigate={onNavigate} />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
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
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
              <p className="mt-2 text-slate-500">Join ParkGuard Terminal to start monitoring</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">First Name</label>
                <input 
                  type="text" 
                  placeholder="John"
                  className={inputClasses('firstName')}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                {errors.firstName && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  className={inputClasses('lastName')}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {errors.lastName && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.lastName}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Username</label>
                <input 
                  type="text" 
                  placeholder="johndoe_enforce"
                  className={inputClasses('username')}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                {errors.username && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Aadhar Number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012"
                  className={inputClasses('aadharNumber')}
                  value={formData.aadharNumber}
                  onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                />
                {errors.aadharNumber && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.aadharNumber}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  className={inputClasses('phoneNumber')}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                {errors.phoneNumber && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</label>
                <textarea 
                  placeholder="Enter your full property address..."
                  rows={3}
                  className={`${inputClasses('address')} resize-none`}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                {errors.address && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.address}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className={inputClasses('password')}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className={inputClasses('confirmPassword')}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="flex items-center gap-1 text-[10px] font-medium text-red-500"><AlertCircle size={10} /> {errors.confirmPassword}</p>}
              </div>

              <div className="mt-4 sm:col-span-2">
                <button 
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 py-4 text-lg font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-2xl"
                >
                  Create Account
                </button>
                <p className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="font-bold text-slate-900 hover:underline"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 size={14} />
              Verified Property
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 size={14} />
              Secure Data
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 size={14} />
              AI Compliance
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SignUp;
