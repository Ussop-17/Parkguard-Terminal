
import React, { useState } from 'react';
import { Shield, Menu, X, Camera, Search, FileText, Users, BookOpen, HelpCircle, Info, ShieldCheck, Database, Layout } from 'lucide-react';
import Modal from './Modal';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="flex flex-col gap-4 rounded-3xl bg-slate-50 p-6 transition-all hover:shadow-md">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
      {icon}
    </div>
    <div>
      <h4 className="mb-2 text-lg font-bold text-slate-900">{title}</h4>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  </div>
);

interface NavbarProps {
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [activeModal, setActiveModal] = useState<'features' | 'help' | 'about' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const modalContent = {
    features: {
      title: 'Our Features',
      content: 'This system uses AI and CCTV cameras to detect illegal parking, track vehicle duration, identify license plates, and automatically generate penalties for unauthorized vehicles.',
      icon: <Camera className="text-slate-900" size={32} />
    },
    help: {
      title: 'Help & Learning',
      content: 'Access comprehensive guides and tutorials to master the ParkGuard Terminal. Learn how to configure cameras, manage violations, and interpret AI analytics.',
      icon: <BookOpen className="text-slate-900" size={32} />
    },
    about: {
      title: 'About Us',
      content: 'ParkGuard Terminal is a community-driven parking enforcement solution. We combine cutting-edge AI with local licensing to ensure fair and efficient parking management for everyone.',
      icon: <ShieldCheck className="text-slate-900" size={32} />
    },
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div 
            className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
            onClick={() => onNavigate('home')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200">
              <Shield size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ParkGuard Terminal</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <button 
              onClick={() => setActiveModal('features')}
              className="text-sm font-bold text-slate-900 transition-colors hover:opacity-70"
            >
              Features
            </button>
            <button 
              onClick={() => setActiveModal('help')}
              className="text-sm font-bold text-slate-900 transition-colors hover:opacity-70"
            >
              Help & Learning
            </button>
            <button 
              onClick={() => setActiveModal('about')}
              className="text-sm font-bold text-slate-900 transition-colors hover:opacity-70"
            >
              About Us
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <button 
              onClick={() => onNavigate('login')}
              className="rounded-lg border border-slate-900 px-4 py-2 text-sm font-bold text-slate-900 transition-all hover:bg-slate-50"
            >
              Log In
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="rounded-lg p-2 text-slate-900 hover:bg-slate-100 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white p-4 md:hidden">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setActiveModal('features'); setIsMobileMenuOpen(false); }}
                className="text-left text-sm font-bold text-slate-900"
              >
                Features
              </button>
              <button 
                onClick={() => { setActiveModal('help'); setIsMobileMenuOpen(false); }}
                className="text-left text-sm font-bold text-slate-900"
              >
                Help & Learning
              </button>
              <button 
                onClick={() => { setActiveModal('about'); setIsMobileMenuOpen(false); }}
                className="text-left text-sm font-bold text-slate-900"
              >
                About Us
              </button>
              <hr className="border-slate-100" />
              <button 
                onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                className="w-full rounded-lg border border-slate-900 py-2 text-sm font-bold text-slate-900"
              >
                Log In
              </button>
              <button 
                onClick={() => { onNavigate('signup'); setIsMobileMenuOpen(false); }}
                className="w-full rounded-lg bg-slate-900 py-2 text-sm font-bold text-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      {activeModal && (
        <Modal 
          isOpen={!!activeModal} 
          onClose={() => setActiveModal(null)} 
          title={modalContent[activeModal].title}
        >
          <div className="flex flex-col items-center text-center p-4">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 shadow-inner">
              {modalContent[activeModal].icon}
            </div>
            <p className="text-lg leading-relaxed text-slate-900 font-medium max-w-lg">
              {modalContent[activeModal].content}
            </p>
            <button 
              onClick={() => setActiveModal(null)}
              className="mt-8 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
