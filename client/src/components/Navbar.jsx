import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Users, Heart, Sparkles, Menu, X, LogIn, LogOut, PlusCircle, Shield, LayoutDashboard, ShieldCheck } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logoutUser } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutUser();
    setActiveTab('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#130722]/95 backdrop-blur-md border-b border-purple-900/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#1b0c33] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
              <span className="text-lg sm:text-xl animate-sparkle">💃</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
                GarbaSaathi
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-pink-500/20 text-pink-300 px-1.5 sm:px-2 py-0.5 rounded-full border border-pink-500/30">
                Pune
              </span>
            </div>
            <p className="text-[11px] text-purple-300/70 font-medium hidden sm:block">
              9 Days. 9 Friends. Endless Garba. 💃🕺
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1a0b2e]/90 p-1.5 rounded-2xl border border-purple-800/40 shadow-inner">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white shadow-md'
                : 'text-purple-200/80 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" /> Home
          </button>

          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white shadow-md'
                : 'text-purple-200/80 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-pink-400" /> My Dashboard
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                  : 'text-purple-200/80 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" /> Admin Dashboard
            </button>
          )}

          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => handleNavClick('browse')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-purple-200/80 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Users className="w-4 h-4 text-pink-400" /> Find Saathi
            </button>
          )}

          <button
            onClick={() => handleNavClick('safety')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'safety'
                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white shadow-md'
                : 'text-purple-200/80 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Shield className="w-4 h-4 text-pink-400" /> Safety
          </button>
        </nav>

        {/* User Auth Action Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div 
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
                className="flex items-center gap-1.5 sm:gap-2 bg-purple-950/80 border border-purple-700/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-medium text-purple-200 cursor-pointer hover:bg-purple-900/80 transition"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                  {currentUser.role === 'admin' ? '🛡️' : (currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤')}
                </div>
                <span className="font-bold text-white max-w-[70px] sm:max-w-[100px] truncate">
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.name.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex p-2 rounded-xl bg-purple-900/50 hover:bg-rose-500/20 text-purple-300 hover:text-rose-300 border border-purple-700/50 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-purple-950/80 hover:bg-purple-900/80 text-purple-200 border border-purple-700/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-pink-400" /> Login
              </button>

              <button
                onClick={() => handleNavClick('register')}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-pink-600/30 flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Join
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-purple-900/50 border border-purple-700/50 text-purple-200 hover:text-white shrink-0 active:scale-95 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#180930]/98 backdrop-blur-xl border-b border-purple-800/60 px-4 py-4 space-y-1.5 animate-in slide-in-from-top duration-200 shadow-2xl">
          
          {/* User Profile Card in Drawer */}
          {currentUser && (
            <div className="p-3 rounded-2xl bg-purple-950/90 border border-purple-800/60 flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center font-bold text-white text-base shrink-0 shadow">
                {currentUser.role === 'admin' ? '🛡️' : (currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-pink-300 font-medium">{currentUser.role === 'admin' ? 'SuperAdmin' : `${currentUser.area} • Pune`}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'home' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md' : 'text-purple-200 hover:bg-purple-900/40 active:bg-purple-900/60'
            }`}
          >
            <Sparkles className="w-5 h-5 text-pink-400" /> Home
          </button>

          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'dashboard' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md' : 'text-purple-200 hover:bg-purple-900/40 active:bg-purple-900/60'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 text-pink-400" /> My Dashboard
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'admin' ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md' : 'text-purple-200 hover:bg-purple-900/40 active:bg-purple-900/60'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" /> Admin Dashboard
            </button>
          )}

          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => handleNavClick('browse')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'browse' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md' : 'text-purple-200 hover:bg-purple-900/40 active:bg-purple-900/60'
              }`}
            >
              <Users className="w-5 h-5 text-pink-400" /> Find Saathi
            </button>
          )}

          <button
            onClick={() => handleNavClick('safety')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'safety' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md' : 'text-purple-200 hover:bg-purple-900/40 active:bg-purple-900/60'
            }`}
          >
            <Shield className="w-5 h-5 text-pink-400" /> Safety
          </button>

          {currentUser ? (
            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 active:scale-95 transition"
              >
                <LogOut className="w-4 h-4" /> Logout ({currentUser.name})
              </button>
            </div>
          ) : (
            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-3 bg-purple-900/70 hover:bg-purple-800 text-purple-100 text-xs font-bold rounded-xl text-center border border-purple-700/50 active:scale-95 transition"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-extrabold rounded-xl text-center shadow-lg shadow-pink-600/30 active:scale-95 transition"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
