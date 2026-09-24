import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Heart, Calendar, MapPin, AtSign, CheckCircle2, XCircle, Clock, Users, Sparkles, UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';
import { NAVRATRI_DAYS } from '../utils/constants';
import { apiUrl } from '../utils/api';

export const DashboardPage = ({ setActiveTab }) => {
  const { currentUser } = useUser();
  const [activeSubTab, setActiveSubTab] = useState('received'); // 'received' | 'sent' | 'connected'
  const [dashData, setDashData] = useState({
    receivedPending: [],
    sentPending: [],
    accepted: [],
    acceptedGrouped: {},
    stats: { receivedPendingCount: 0, sentPendingCount: 0, acceptedCount: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  const fetchDashboardData = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const res = await fetch(apiUrl(`/api/connections/my?userId=${currentUser.id}`));
      const data = await res.json();
      if (data.success) {
        setDashData({
          receivedPending: data.receivedPending || [],
          sentPending: data.sentPending || [],
          accepted: data.accepted || [],
          acceptedGrouped: data.acceptedGrouped || {},
          stats: data.stats || { receivedPendingCount: 0, sentPendingCount: 0, acceptedCount: 0 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const handleRespondRequest = async (connectionId, status) => {
    try {
      const res = await fetch(apiUrl(`/api/connections/${connectionId}/respond`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, currentUserId: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(data.message);
        setTimeout(() => setToastMsg(null), 5000);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to update request');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating connection request');
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-white">Please Login to Access Dashboard</h2>
        <p className="text-xs text-purple-200/70">
          Sign in to view your received connection requests, sent requests, and connected GarbaSaathis.
        </p>
        <button
          onClick={() => { setActiveTab('login'); window.scrollTo(0,0); }}
          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-pink-600/30"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="text-2xl">🎉</span>
          <div className="text-xs font-bold">{toastMsg}</div>
        </div>
      )}

      {/* User Profile Header Card */}
      <div className="bg-[#180930] border border-purple-800/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center text-3xl shadow-xl border-2 border-pink-400 shrink-0">
              {currentUser.gender === 'Female' ? '💃' : currentUser.gender === 'Male' ? '🕺' : '✨'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{currentUser.name}</h1>
                <span className="text-xs font-bold bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                  {currentUser.area}
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-1 flex items-center gap-2">
                <span>⭐ {currentUser.experience}</span>
                <span>•</span>
                <span>💃 {currentUser.activity}</span>
                <span>•</span>
                <span>Age: {currentUser.age}</span>
              </p>
              <div className="mt-2 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 w-fit flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-pink-400" /> {currentUser.socialContact}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-purple-800/40 pt-4 sm:pt-0">
            <button
              onClick={() => { setActiveTab('browse'); window.scrollTo(0,0); }}
              className="px-5 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-pink-600/30 flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Find GarbaSaathis
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-900/50 pb-2">
        <button
          onClick={() => setActiveSubTab('received')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
            activeSubTab === 'received'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Received Requests</span>
          {dashData.stats.receivedPendingCount > 0 && (
            <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
              {dashData.stats.receivedPendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
            activeSubTab === 'sent'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>Sent Requests</span>
          {dashData.stats.sentPendingCount > 0 && (
            <span className="bg-purple-800 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {dashData.stats.sentPendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('connected')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
            activeSubTab === 'connected'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-400" />
          <span>Connected Saathis</span>
          <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {dashData.stats.acceptedCount}
          </span>
        </button>
      </div>

      {/* Tab 1: Received Pending Requests */}
      {activeSubTab === 'received' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Received Connection Requests
            </h3>
            <span className="text-xs text-purple-300/70">
              Accept requests to reveal public social contact details
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-purple-300">Loading requests...</div>
          ) : dashData.receivedPending.length === 0 ? (
            <div className="bg-[#180930]/50 border border-purple-800/40 rounded-3xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 text-purple-300 flex items-center justify-center mx-auto text-2xl">
                💌
              </div>
              <h4 className="text-sm font-bold text-white">No pending connection requests</h4>
              <p className="text-xs text-purple-200/70 max-w-sm mx-auto">
                When fellow Pune Garba lovers send you a connection request for Navratri, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashData.receivedPending.map((item) => (
                <div key={item.connectionId} className="glass-card rounded-2xl p-5 border border-purple-700/50 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600/30 to-purple-600/40 border border-pink-500/40 flex items-center justify-center text-2xl shrink-0">
                      💃
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white truncate">{item.name}, {item.age}</h4>
                        <span className="text-xs font-bold bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                          Day {item.navratriDay}
                        </span>
                      </div>
                      <p className="text-xs text-purple-200/80 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> {item.area}, Pune
                      </p>
                      <p className="text-xs text-purple-300/80 mt-1 line-clamp-1 italic">
                        "{item.bio}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-purple-800/40">
                    <button
                      onClick={() => handleRespondRequest(connectionId = item.connectionId, 'accepted')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Request
                    </button>
                    <button
                      onClick={() => handleRespondRequest(connectionId = item.connectionId, 'rejected')}
                      className="py-2.5 px-4 bg-purple-900/60 hover:bg-rose-500/20 text-purple-300 hover:text-rose-300 font-bold text-xs rounded-xl transition border border-purple-700/50"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sent Pending Requests */}
      {activeSubTab === 'sent' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Sent Connection Requests
          </h3>

          {dashData.sentPending.length === 0 ? (
            <div className="bg-[#180930]/50 border border-purple-800/40 rounded-3xl p-10 text-center space-y-3">
              <p className="text-xs text-purple-200/70">You haven't sent any pending connection requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashData.sentPending.map((item) => (
                <div key={item.connectionId} className="glass-card rounded-2xl p-4 border border-purple-700/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-600/40 flex items-center justify-center text-xl shrink-0">
                    💃
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white">{item.name}, {item.age}</h4>
                    <p className="text-xs text-purple-300/80">{item.area} • Day {item.navratriDay}</p>
                  </div>
                  <span className="text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Awaiting Response
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Connected Saathis (Accepted) */}
      {activeSubTab === 'connected' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" /> My Connected GarbaSaathis
          </h3>

          {dashData.accepted.length === 0 ? (
            <div className="bg-[#180930]/50 border border-purple-800/40 rounded-3xl p-10 text-center space-y-3">
              <p className="text-xs text-purple-200/70">No accepted GarbaSaathis yet. Accept received requests or browse members to connect!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {NAVRATRI_DAYS.map((dayObj) => {
                const dayKey = `Day ${dayObj.day}`;
                const dayConns = dashData.acceptedGrouped[dayKey] || [];
                if (dayConns.length === 0) return null;

                return (
                  <div key={dayObj.day} className="bg-[#180930]/70 border border-purple-800/50 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-800/40">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>🎉 Day {dayObj.day} — {dayObj.name}</span>
                      </h4>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${dayObj.color}`}>
                        {dayConns.length} Connected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dayConns.map((item) => (
                        <div key={item.connectionId} className="glass-card rounded-2xl p-4 border border-purple-700/40 flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600/30 to-amber-500/20 border border-pink-400/40 flex items-center justify-center text-xl shrink-0">
                            💃
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{item.name}, {item.age}</h5>
                            <p className="text-[10px] text-purple-300">{item.area}</p>
                            <div className="mt-1 font-bold text-amber-300 text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 w-fit flex items-center gap-1">
                              <AtSign className="w-3 h-3 text-pink-400" /> {item.socialContact}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
