import React, { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrowseMembersPage } from './pages/BrowseMembersPage';
import { SafetySection } from './components/SafetySection';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('home');

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'register':
        return <RegisterPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'browse':
        return <BrowseMembersPage setActiveTab={setActiveTab} />;
      case 'safety':
        return <SafetySection />;
      case 'admin':
        return <AdminPage setActiveTab={setActiveTab} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130722] text-slate-100 font-sans selection:bg-pink-500 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderCurrentTab()}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
