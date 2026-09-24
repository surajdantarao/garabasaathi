import React from 'react';
import { useUser } from '../context/UserContext';
import { Sparkles, Users, LogIn, Calendar, ShieldCheck, ArrowRight, Heart, MapPin, CheckCircle, Zap, LayoutDashboard } from 'lucide-react';
import { PUNE_AREAS } from '../utils/constants';

export const HomePage = ({ setActiveTab }) => {
  const { currentUser } = useUser();

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 px-3 sm:pt-14 sm:pb-20 sm:px-6 lg:px-8 text-center bg-hero-gradient rounded-b-[32px] sm:rounded-b-[40px] border-b border-purple-900/40">
        
        {/* Floating Festive Elements */}
        <div className="hidden sm:block absolute top-10 left-10 text-4xl animate-float opacity-30 select-none pointer-events-none">✨</div>
        <div className="hidden sm:block absolute top-20 right-12 text-4xl animate-float opacity-30 select-none pointer-events-none delay-1000">💃</div>
        <div className="hidden sm:block absolute bottom-10 left-1/4 text-3xl animate-float opacity-30 select-none pointer-events-none delay-500">🕺</div>
        <div className="hidden sm:block absolute top-1/3 right-1/4 text-3xl animate-float opacity-30 select-none pointer-events-none">🥁</div>
        
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-amber-500/20 border border-pink-500/40 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-pink-200 uppercase tracking-wider sm:tracking-widest shadow-lg shadow-pink-500/10">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-spin" /> Pune Navratri 2026 Community
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            GarbaSaathi
            <span className="block mt-1 sm:mt-2 text-xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
              9 Days. 9 Friends. Endless Garba. 💃🕺
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-lg text-purple-200/90 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Meet Garba lovers across Pune, find your Garba circle, and celebrate Navratri together.
          </p>

          {/* Clean CTA Buttons (No Find Saathi directly on Home page) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto w-full">
            {currentUser ? (
              <button
                onClick={() => { setActiveTab(currentUser.role === 'admin' ? 'admin' : 'dashboard'); window.scrollTo(0,0); }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white rounded-2xl font-extrabold text-sm sm:text-base transition shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2.5 active:scale-95 group"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Go to My Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setActiveTab('register'); window.scrollTo(0,0); }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white rounded-2xl font-extrabold text-sm sm:text-base transition shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2.5 active:scale-95 group"
                >
                  <Users className="w-5 h-5" />
                  <span>Join GarbaSaathi</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => { setActiveTab('login'); window.scrollTo(0,0); }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-purple-950/80 hover:bg-purple-900/90 text-purple-100 border border-purple-700/60 rounded-2xl font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-pink-400" />
                  <span>Login to Account</span>
                </button>
              </>
            )}
          </div>

          {/* Pune Areas Pills */}
          <div className="pt-4 sm:pt-6 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 max-w-3xl mx-auto text-[11px] sm:text-xs text-purple-300/70">
            <span className="font-semibold text-pink-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Pune Areas:
            </span>
            {PUNE_AREAS.slice(0, 8).map((area) => (
              <span
                key={area}
                className="bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-purple-200"
              >
                {area}
              </span>
            ))}
            <span className="text-purple-400 font-bold">+ 10 more</span>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">Simple Process</h2>
          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">How It Works</h3>
          <p className="mt-2 text-purple-200/70 text-sm max-w-xl mx-auto">
            Connect with Garba lovers in Pune in just 3 quick steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 relative">
          
          {/* Step 1 */}
          <div className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-purple-800/40 relative text-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-pink-600/30 group-hover:scale-110 transition">
              1
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">1. Create Your Account</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Register your account in 1 minute with your Pune area, experience level, and preferred Navratri dates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-purple-800/40 relative text-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition">
              2
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">2. Send Connection Request</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Find members in your area and send a connection request for any of the 9 Navratri days.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-purple-800/40 relative text-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
              3
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">3. Accept & Celebrate</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              When requests are accepted, Instagram contacts are unlocked so you can coordinate and meet at Garba grounds!
            </p>
          </div>

        </div>
      </section>

      {/* Why GarbaSaathi? Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="bg-gradient-to-br from-purple-950/80 via-[#1c0c36] to-pink-950/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-purple-800/50 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold mb-3 sm:mb-4 border border-pink-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Community Benefits
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 sm:mb-6">
              Why GarbaSaathi?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl sm:rounded-2xl bg-purple-900/30 border border-purple-800/40">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Pune-Focused Garba Community</h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/70 mt-0.5 sm:mt-1">Exclusively designed for people residing or celebrating Navratri in Pune.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl sm:rounded-2xl bg-purple-900/30 border border-purple-800/40">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Meet New Garba Friends</h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/70 mt-0.5 sm:mt-1">Wholesome social community vibe — connect without awkward romantic pressure.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl sm:rounded-2xl bg-purple-900/30 border border-purple-800/40">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Mutual Request Acceptance</h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/70 mt-0.5 sm:mt-1">Personal contact information is safe and only revealed after mutual acceptance.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl sm:rounded-2xl bg-purple-900/30 border border-purple-800/40">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Celebrate All 9 Days</h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/70 mt-0.5 sm:mt-1">Unique "9 Days. 9 Friends" concept so every Navratri night has a dancing circle!</p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-800/50 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              {currentUser ? (
                <button
                  onClick={() => { setActiveTab('dashboard'); window.scrollTo(0,0); }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-pink-600/20 active:scale-95 text-center"
                >
                  Open My Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setActiveTab('register'); window.scrollTo(0,0); }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-pink-600/20 active:scale-95 text-center"
                  >
                    Join Community Now
                  </button>
                  <button
                    onClick={() => { setActiveTab('login'); window.scrollTo(0,0); }}
                    className="w-full sm:w-auto px-6 py-3 bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 font-bold rounded-xl text-xs transition active:scale-95 text-center"
                  >
                    Login to Account
                  </button>
                </>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Safety Message Section at Bottom */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h4 className="text-base sm:text-lg font-bold text-white">Safe & Respectful Community Platform</h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              GarbaSaathi is a safe social platform. We never expose phone numbers publicly. Social handles are only unlocked after mutual request acceptance. Always meet at public Garba event venues in Pune.
            </p>
          </div>
          <button
            onClick={() => { setActiveTab('safety'); window.scrollTo(0,0); }}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold transition shrink-0 text-center active:scale-95"
          >
            Read Safety Tips
          </button>
        </div>
      </section>

    </div>
  );
};
