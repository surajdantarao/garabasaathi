import React from 'react';
import { useUser } from '../context/UserContext';
import { Heart, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  const { currentUser } = useUser();

  return (
    <footer className="bg-[#0c0417] border-t border-purple-900/50 text-purple-200/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-purple-900/40">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💃</span>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
                GarbaSaathi
              </span>
            </div>
            <p className="text-sm font-semibold text-pink-300/90">
              9 Days. 9 Friends. Endless Garba. 💃🕺
            </p>
            <p className="text-xs text-purple-300/70 leading-relaxed">
              Pune’s dedicated Navratri Garba & Dandiya community platform. Connect safely with fellow Garba enthusiasts across Pune.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400/90 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit">
              <MapPin className="w-3.5 h-3.5" /> Pune • Navratri 2026
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-pink-400">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => { setActiveTab('home'); window.scrollTo(0,0); }} className="hover:text-pink-400 transition">Home</button>
              </li>
              {currentUser ? (
                <>
                  <li>
                    <button onClick={() => { setActiveTab('dashboard'); window.scrollTo(0,0); }} className="hover:text-pink-400 transition">My Dashboard</button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('browse'); window.scrollTo(0,0); }} className="hover:text-pink-400 transition">Find Saathi</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button onClick={() => { setActiveTab('login'); window.scrollTo(0,0); }} className="hover:text-pink-400 transition">Login</button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('register'); window.scrollTo(0,0); }} className="hover:text-pink-400 transition">Join Community</button>
                  </li>
                </>
              )}
              <li>
                <button onClick={() => { setActiveTab('safety'); window.scrollTo(0,0); }} className="hover:text-pink-400 transition">Safety Center</button>
              </li>
            </ul>
          </div>

          {/* Pune Garba Hotspots */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-pink-400">
              Pune Garba Hubs
            </h4>
            <ul className="space-y-1.5 text-xs text-purple-300/70">
              <li>• Baner & Balewadi High Street</li>
              <li>• Wakad & Hinjewadi Tech Parks</li>
              <li>• Kothrud & Karve Nagar Lawns</li>
              <li>• Viman Nagar & Phoenix Marketcity</li>
              <li>• Aundh, Kharadi & PCMC Grounds</li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-pink-400">
              Community & Safety
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => { setActiveTab('safety'); window.scrollTo(0,0); }} className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition">
                  <ShieldCheck className="w-3.5 h-3.5" /> Safety First Guidelines
                </button>
              </li>
              <li className="text-purple-300/70 leading-relaxed text-[11px] pt-1">
                GarbaSaathi is a safe social community platform, NOT a dating app. Always meet in public event venues.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400/60 gap-4">
          <p>© 2026 GarbaSaathi. Made with <Heart className="w-3.5 h-3.5 inline text-pink-500 mx-0.5" /> for Pune Garba Lovers.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={() => { setActiveTab('safety'); window.scrollTo(0,0); }} className="hover:text-purple-200">Safety</button>
            <span>•</span>
            <button onClick={() => { setActiveTab('safety'); window.scrollTo(0,0); }} className="hover:text-purple-200">Privacy Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
