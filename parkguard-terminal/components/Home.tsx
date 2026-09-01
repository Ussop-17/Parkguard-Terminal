
import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Camera, Car, ShieldAlert, FileText } from 'lucide-react';
import Navbar from './Navbar';

interface HomeProps {
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar onNavigate={onNavigate} />
      
      <main className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Smart Parking <br />
              <span className="text-slate-400">Enforcement</span> <br />
              Made Simple
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              Automatically detect illegal parking, track violations, and generate penalties using AI-powered surveillance.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button 
                onClick={() => onNavigate('signup')}
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-2xl"
              >
                Get Started
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-12 flex items-center gap-6 opacity-50 grayscale">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldAlert size={24} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Camera size={24} />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <FileText size={24} />
                <span>Automated</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl shadow-slate-200">
              {/* Dashboard Mockup */}
              <div className="rounded-2xl border border-slate-50 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-6 w-32 rounded-full bg-slate-200" />
                </div>
                
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* CCTV Feed */}
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                      <Camera size={48} />
                    </div>
                    <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-red-500/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      LIVE FEED
                    </div>
                    {/* Detection Box */}
                    <div className="absolute top-1/4 left-1/4 h-1/2 w-1/2 rounded-lg border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                      <div className="absolute -top-6 left-0 rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-900">
                        VEHICLE DETECTED
                      </div>
                    </div>
                  </div>
                  
                  {/* Alert Panel */}
                  <div className="flex flex-col gap-3">
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">License Plate Recognition</div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-12 items-center justify-center rounded border-2 border-slate-900 font-mono text-xs font-bold">
                          TS09 EA 1234
                        </div>
                        <div className="text-xs font-medium text-slate-600">Confidence: 98.4%</div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3 shadow-sm">
                      <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-600">
                        <ShieldAlert size={12} />
                        Violation Alert
                      </div>
                      <div className="text-xs font-medium text-slate-900">Illegal Parking Detected</div>
                      <div className="mt-1 text-[10px] text-slate-500">Duration: 15m 42s</div>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-3 text-white shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Action</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-medium">Generate Penalty</span>
                        <div className="rounded-full bg-white/10 p-1">
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-full bg-slate-100 blur-2xl" />
            <div className="absolute -top-6 -right-6 -z-10 h-48 w-48 rounded-full bg-slate-50 blur-3xl" />
          </motion.div>
        </div>
      </main>
      
      {/* Footer-like section */}
      <section className="mt-24 border-t border-slate-100 bg-slate-50/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Car className="text-slate-900" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Community Licensing</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Empower your neighborhood with automated parking monitoring and fair enforcement.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ShieldAlert className="text-slate-900" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Real-time Alerts</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Get instant notifications when unauthorized vehicles park in restricted zones.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <FileText className="text-slate-900" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Digital Challans</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Automatically generate and send digital penalties with clear photographic evidence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
