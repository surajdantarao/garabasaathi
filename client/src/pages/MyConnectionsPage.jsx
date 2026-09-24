import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Heart, Calendar, MapPin, AtSign, Trash2, Users, Sparkles, UserPlus } from 'lucide-react';
import { NAVRATRI_DAYS } from '../utils/constants';
import { apiUrl } from '../utils/api';

export const MyConnectionsPage = ({ setActiveTab }) => {
  const { currentUser } = useUser();
  const [connectionsGrouped, setConnectionsGrouped] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(apiUrl(`/api/connections?userId=${currentUser.id}`));
      const data = await res.json();
      if (data.success) {
        setConnectionsGrouped(data.grouped || {});
        setTotalCount(data.totalConnections || 0);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [currentUser]);

  const handleRemoveConnection = async (connectionId) => {
    if (!window.confirm('Are you sure you want to remove this GarbaSaathi connection?')) return;
    try {
      const res = await fetch(apiUrl(`/api/connections/${connectionId}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchConnections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto text-3xl">
          💃
        </div>
        <h2 className="text-2xl font-bold text-white">No Active Profile Selected</h2>
        <p className="text-xs text-purple-200/70">
          Please select an active profile from the top-right menu or create a new profile to see your connected GarbaSaathis.
        </p>
        <button
          onClick={() => { setActiveTab('register'); window.scrollTo(0,0); }}
          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-pink-600/30"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 mb-2">
            <Heart className="w-3.5 h-3.5 text-pink-400" /> My Navratri Circle
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            My GarbaSaathis 💃🕺
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/70 mt-1">
            Connected Garba friends for {currentUser.name} grouped by Navratri Day (9 Days. 9 Friends).
          </p>
        </div>

        <div className="bg-purple-950/70 border border-purple-800/60 px-4 py-2 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <div className="text-xs">
            <p className="text-[10px] text-pink-300 font-semibold uppercase">Total Connected Saathis</p>
            <p className="text-lg font-black text-white">{totalCount} Friends</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-purple-300">Loading your GarbaSaathis...</p>
        </div>
      ) : totalCount === 0 ? (
        /* Empty State */
        <div className="bg-[#180930]/60 border border-purple-800/40 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto text-3xl">
            🤝
          </div>
          <h3 className="text-xl font-bold text-white">No GarbaSaathis connected yet</h3>
          <p className="text-xs text-purple-200/70">
            Browse Pune Garba members and click "Connect for Day X" to add friends to your 9-day Navratri circle!
          </p>
          <button
            onClick={() => { setActiveTab('browse'); window.scrollTo(0,0); }}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-pink-600/30 inline-flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Find GarbaSaathis Now
          </button>
        </div>
      ) : (
        /* Grouped Day-by-Day View */
        <div className="space-y-8">
          {NAVRATRI_DAYS.map((dayObj) => {
            const dayKey = `Day ${dayObj.day}`;
            const dayConnections = connectionsGrouped[dayKey] || [];

            if (dayConnections.length === 0) return null;

            return (
              <div key={dayObj.day} className="bg-[#180930]/70 border border-purple-800/50 rounded-3xl p-6 space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Day {dayObj.day} — {dayObj.name}
                      </h3>
                      <p className="text-xs text-purple-300/70">
                        {dayConnections.length} GarbaSaathi{dayConnections.length > 1 ? 's' : ''} connected
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${dayObj.color}`}>
                    Day {dayObj.day}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayConnections.map((item) => (
                    <div 
                      key={item.connectionId}
                      className="glass-card rounded-2xl p-4 border border-purple-700/40 flex items-start gap-3 relative group"
                    >
                      <img 
                        src={item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'} 
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-pink-400 shrink-0" 
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-white truncate">{item.name}, {item.age}</h4>
                        <p className="text-[11px] text-pink-300 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-rose-400" /> {item.area}, Pune
                        </p>
                        
                        <div className="pt-1.5 flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 w-fit">
                          <AtSign className="w-3 h-3 text-pink-400" /> {item.socialContact}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveConnection(item.connectionId)}
                        className="text-purple-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition"
                        title="Remove Connection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
