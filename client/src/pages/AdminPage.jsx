import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { ShieldCheck, Trash2, Users, MapPin, RefreshCw, Activity, Database, Lock, Clock, Search, ArrowRight, HeartHandshake, Eye, AlertTriangle, CheckCircle2, XCircle, MessageSquare, ArrowRightLeft } from 'lucide-react';
import { NAVRATRI_DAYS } from '../utils/constants';
import { apiUrl } from '../utils/api';
import { AdminChatModal } from '../components/AdminChatModal';

export const AdminPage = ({ setActiveTab }) => {
  const { currentUser } = useUser();
  const [activeTab, setActiveAdminTab] = useState('users'); // 'users' | 'connections' | 'chats' | 'demographics'
  
  // Data states
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [connectionsList, setConnectionsList] = useState([]);
  const [chatsList, setChatsList] = useState([]);
  const [inspectingChat, setInspectingChat] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  
  // UI states
  const [message, setMessage] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, connsRes, chatsRes] = await Promise.all([
        fetch(apiUrl('/api/admin/stats')),
        fetch(apiUrl('/api/users')),
        fetch(apiUrl('/api/admin/connections')),
        fetch(apiUrl('/api/admin/chats'))
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const connsData = await connsRes.json();
      const chatsData = await chatsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (usersData.success) setUsersList(usersData.users);
      if (connsData.success) setConnectionsList(connsData.connections || []);
      if (chatsData.success) setChatsList(chatsData.chats || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAdminData();
    }
  }, [currentUser]);

  const confirmPermanentDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(apiUrl(`/api/users/${userToDelete.id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage(`Account for "${userToDelete.name}" (@${userToDelete.username || 'user'}) has been permanently deleted.`);
        setTimeout(() => setMessage(null), 5000);
        setUserToDelete(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user account.');
    } finally {
      setDeleting(false);
    }
  };

  const handleReseedData = async () => {
    if (!window.confirm('Reset and re-seed database with default authentication schema & profiles?')) return;
    try {
      const res = await fetch(apiUrl('/api/seed'), { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage('Database re-seeded successfully!');
        setTimeout(() => setMessage(null), 4000);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Unauthorized Gate
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-3xl">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Admin Access Restricted</h2>
        <p className="text-xs text-purple-200/70">
          This portal is restricted to Platform Administrators. Please login with your administrator credentials.
        </p>
        <button
          onClick={() => { setActiveTab('login'); window.scrollTo(0,0); }}
          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-pink-600/30"
        >
          Go to Login Page
        </button>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = areaFilter === 'All' || u.area === areaFilter;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-purple-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider sm:tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <ShieldCheck className="w-4 h-4" /> Platform Administration & Control Panel
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Admin Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/70 mt-1">
            Logged in as SuperAdmin: <strong className="text-amber-300">{currentUser?.username || 'Administrator'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 rounded-xl border border-purple-800/60 transition active:scale-95"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReseedData}
            className="px-3.5 sm:px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow active:scale-95"
          >
            <Database className="w-4 h-4" /> Reset / Seed DB
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center animate-in fade-in">
          ✅ {message}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4">
        
        <div className="bg-[#180930] border border-purple-800/50 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 shadow-lg">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-purple-300/70 uppercase truncate">Users</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="bg-[#180930] border border-purple-800/50 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 shadow-lg">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-purple-300/70 uppercase truncate">Matches</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{stats?.acceptedConnections || 0}</p>
          </div>
        </div>

        <div className="bg-[#180930] border border-purple-800/50 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 shadow-lg">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-pink-600/20 text-pink-300 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-purple-300/70 uppercase truncate">Messages</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{stats?.totalMessages || 0}</p>
          </div>
        </div>

        <div className="bg-[#180930] border border-purple-800/50 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 shadow-lg">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-purple-300/70 uppercase truncate">Pending</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{stats?.pendingRequests || 0}</p>
          </div>
        </div>

        <div className="bg-[#180930] border border-purple-800/50 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 shadow-lg">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-purple-300/70 uppercase truncate">Pune Hubs</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{stats?.areaStats?.length || 0}</p>
          </div>
        </div>

      </div>

      {/* Admin Panel Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-900/50 pb-2 overflow-x-auto no-scrollbar flex-nowrap -mx-3 px-3 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition border whitespace-nowrap shrink-0 ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({filteredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('connections')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition border whitespace-nowrap shrink-0 ${
            activeTab === 'connections'
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Requests & Matches ({connectionsList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('chats')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition border whitespace-nowrap shrink-0 ${
            activeTab === 'chats'
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>User Chats & Messages ({chatsList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('demographics')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition border whitespace-nowrap shrink-0 ${
            activeTab === 'demographics'
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Pune Demographics</span>
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT & PERMANENT ACCOUNT DELETION */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-[#180930] border border-purple-800/50 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search user by name, username, email, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full sm:w-48 bg-purple-950/80 border border-purple-700/60 text-white text-xs rounded-xl p-2 focus:outline-none focus:border-pink-500"
              >
                <option value="All">All Pune Areas</option>
                {stats?.areaStats?.map(a => <option key={a.area} value={a.area}>{a.area} ({a.count})</option>)}
              </select>
            </div>
          </div>

          {/* User Accounts Table */}
          <div className="bg-[#180930] border border-purple-800/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-purple-200">
                <thead className="bg-purple-950/90 uppercase text-[10px] text-purple-300/80 border-b border-purple-800/60 font-extrabold tracking-wider">
                  <tr>
                    <th className="p-3.5">User Profile</th>
                    <th className="p-3.5">Account & Contact</th>
                    <th className="p-3.5">Location & Exp</th>
                    <th className="p-3.5">Available Days</th>
                    <th className="p-3.5 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs text-purple-400">
                        No user accounts match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-purple-950/40 transition">
                        {/* User Identity */}
                        <td className="p-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-lg shrink-0">
                            {u.gender === 'Female' ? '💃' : u.gender === 'Male' ? '🕺' : '✨'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{u.name}, {u.age}</p>
                            <p className="text-[10px] text-pink-300 font-semibold">{u.gender} • {u.lookingFor}</p>
                            <p className="text-[10px] text-purple-400/80 line-clamp-1 italic max-w-xs mt-0.5">"{u.bio}"</p>
                          </div>
                        </td>

                        {/* Account & Handle */}
                        <td className="p-3.5">
                          <p className="font-mono text-[11px] font-bold text-amber-300">@{u.username || 'user'}</p>
                          <p className="text-[10px] text-purple-300 font-mono">{u.email || 'no-email'}</p>
                          <p className="text-[11px] font-bold text-emerald-300 mt-1 font-mono">{u.socialContact}</p>
                        </td>

                        {/* Location & Exp */}
                        <td className="p-3.5">
                          <span className="font-bold text-white flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-400" /> {u.area}
                          </span>
                          <span className="block text-[11px] text-purple-300 mt-0.5">⭐ {u.experience}</span>
                          <span className="block text-[10px] text-pink-300 font-semibold">💃 {u.activity}</span>
                        </td>

                        {/* Available Days */}
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {Array.isArray(u.availableDays) && u.availableDays.map(d => (
                              <span key={d} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                                D{d}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Permanent Delete Action */}
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                            title="Delete this user permanently from database"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Delete Account</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CONNECTIONS & HOW USERS CONNECT MONITOR */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          <div className="bg-[#180930] border border-purple-800/50 p-5 rounded-3xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-pink-400" /> All Platform Connections & Requests ({connectionsList.length})
            </h3>
            <p className="text-xs text-purple-300/70 mt-1">
              Live audit of who connected with whom, requested Navratri day, contact details, and request status.
            </p>
          </div>

          <div className="bg-[#180930] border border-purple-800/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-purple-200">
                <thead className="bg-purple-950/90 uppercase text-[10px] text-purple-300/80 border-b border-purple-800/60 font-extrabold tracking-wider">
                  <tr>
                    <th className="p-3.5">Sender (Requester)</th>
                    <th className="p-3.5 text-center">Day</th>
                    <th className="p-3.5">Receiver (Partner)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-center">Live Chat</th>
                    <th className="p-3.5 text-right">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40">
                  {connectionsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs text-purple-400">
                        No connections or requests made yet on the platform.
                      </td>
                    </tr>
                  ) : (
                    connectionsList.map((c) => (
                      <tr key={c.connectionId} className="hover:bg-purple-950/40 transition">
                        {/* Sender */}
                        <td className="p-3.5">
                          <p className="font-bold text-white text-sm">{c.senderName}</p>
                          <p className="text-[10px] text-purple-400 font-mono">@{c.senderUsername} • {c.senderArea}</p>
                          <p className="text-[11px] font-mono text-emerald-300 mt-0.5">{c.senderContact}</p>
                        </td>

                        {/* Day indicator */}
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-black">
                            Day {c.navratriDay}
                          </span>
                        </td>

                        {/* Receiver */}
                        <td className="p-3.5">
                          <p className="font-bold text-white text-sm">{c.receiverName}</p>
                          <p className="text-[10px] text-purple-400 font-mono">@{c.receiverUsername} • {c.receiverArea}</p>
                          <p className="text-[11px] font-mono text-emerald-300 mt-0.5">{c.receiverContact}</p>
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          {c.status === 'accepted' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Accepted
                            </span>
                          ) : c.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-lg text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" /> Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-bold">
                              <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending
                            </span>
                          )}
                        </td>

                        {/* Chat Inspection Action */}
                        <td className="p-3.5 text-center">
                          {c.status === 'accepted' ? (
                            <button
                              onClick={() => setInspectingChat(c)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600/30 to-rose-600/30 hover:from-pink-600/50 hover:to-rose-600/50 text-pink-200 border border-pink-500/40 text-xs font-bold transition shadow active:scale-95"
                              title="View chat messages between these users"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                              <span>View Chat ({c.messageCount || 0})</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-purple-400/60 italic">Locked</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="p-3.5 text-right font-mono text-[11px] text-purple-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER CHATS & CONVERSATION LOGS */}
      {activeTab === 'chats' && (
        <div className="space-y-4">
          <div className="bg-[#180930] border border-purple-800/50 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-400" /> Connected User Chats ({chatsList.length})
              </h3>
              <p className="text-xs text-purple-300/70 mt-1">
                Admin inspection portal for connected Garba partners. Monitor conversations, verify safety, and view full chat logs.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by user or messages..."
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-purple-400/60 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Chats Grid */}
          {chatsList.length === 0 ? (
            <div className="bg-[#180930] border border-purple-800/50 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/40 text-purple-400 flex items-center justify-center mx-auto border border-purple-700/40">
                <MessageSquare className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="text-sm font-bold text-white">No Connected Chats Yet</h4>
              <p className="text-xs text-purple-300/70 max-w-sm mx-auto">
                When users send connection requests and both parties accept, their live conversation thread will appear here for Admin monitoring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chatsList
                .filter(chat => {
                  if (!chatSearchQuery.trim()) return true;
                  const q = chatSearchQuery.toLowerCase();
                  return (
                    chat.senderName?.toLowerCase().includes(q) ||
                    chat.senderUsername?.toLowerCase().includes(q) ||
                    chat.receiverName?.toLowerCase().includes(q) ||
                    chat.receiverUsername?.toLowerCase().includes(q) ||
                    chat.lastMessage?.toLowerCase().includes(q) ||
                    chat.senderArea?.toLowerCase().includes(q) ||
                    chat.receiverArea?.toLowerCase().includes(q)
                  );
                })
                .map((chat) => (
                  <div
                    key={chat.connectionId}
                    className="bg-[#180930] border border-purple-800/50 hover:border-pink-500/40 rounded-3xl p-4 sm:p-5 transition shadow-xl space-y-3.5 flex flex-col justify-between"
                  >
                    {/* Header: User 1 <-> User 2 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-purple-900/50 pb-2.5">
                        <span className="text-[11px] font-black bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2.5 py-0.5 rounded-full">
                          Day {chat.navratriDay} Match
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-300 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-800/60">
                          <MessageSquare className="w-3 h-3 text-pink-400" />
                          <span>{chat.messageCount || 0} messages</span>
                        </span>
                      </div>

                      {/* Participants Row */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Sender */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-sm shrink-0">
                            {chat.senderGender === 'Female' ? '💃' : chat.senderGender === 'Male' ? '🕺' : '✨'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-white truncate">{chat.senderName}</p>
                            <p className="text-[10px] text-purple-400 font-mono truncate">@{chat.senderUsername}</p>
                            <p className="text-[10px] text-pink-300 font-medium truncate">{chat.senderArea}</p>
                          </div>
                        </div>

                        <div className="shrink-0 px-1 text-purple-500">
                          <ArrowRightLeft className="w-4 h-4 text-pink-400" />
                        </div>

                        {/* Receiver */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-end text-right">
                          <div className="min-w-0">
                            <p className="text-xs font-black text-white truncate">{chat.receiverName}</p>
                            <p className="text-[10px] text-purple-400 font-mono truncate">@{chat.receiverUsername}</p>
                            <p className="text-[10px] text-purple-300 font-medium truncate">{chat.receiverArea}</p>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-sm shrink-0">
                            {chat.receiverGender === 'Female' ? '💃' : chat.receiverGender === 'Male' ? '🕺' : '✨'}
                          </div>
                        </div>
                      </div>

                      {/* Last Message Snippet */}
                      <div className="bg-purple-950/60 border border-purple-800/40 rounded-2xl p-3 text-xs">
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Latest Message</span>
                          {chat.lastMessageTime && (
                            <span className="font-mono text-purple-400/80">
                              {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </p>
                        <p className="text-white/90 italic line-clamp-2 text-xs">
                          {chat.lastMessage ? `"${chat.lastMessage}"` : 'No messages sent yet in this match.'}
                        </p>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => setInspectingChat(chat)}
                      className="w-full py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white rounded-xl text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Live Chat Log ({chat.messageCount || 0})</span>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PUNE DEMOGRAPHICS */}
      {activeTab === 'demographics' && (
        <div className="bg-[#180930] border border-purple-800/50 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-400" /> Pune Area Demographics Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats?.areaStats?.map((item) => (
              <div key={item.area} className="p-4 rounded-2xl bg-purple-950/70 border border-purple-800/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{item.area}</p>
                  <p className="text-[11px] text-purple-300/70">Pune Hub</p>
                </div>
                <span className="text-lg font-black text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                  {item.count} users
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERMANENT DELETION CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#180930] border border-rose-500/50 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Permanently Delete Account?</h3>
                <p className="text-xs text-rose-300/80">Irreversible Action</p>
              </div>
            </div>

            <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-200/90 leading-relaxed space-y-2">
              <p>
                You are about to permanently delete the account for:
              </p>
              <p className="text-sm font-bold text-white">
                {userToDelete.name} (@{userToDelete.username || 'user'})
              </p>
              <p className="text-[11px] text-rose-300/80">
                ⚠️ Once deleted, this account and all its connection requests will be <strong>wiped completely from the database</strong>. The user will <strong>never be able to log in again</strong> with this account.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="flex-1 py-3 bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPermanentDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN CHAT INSPECTOR MODAL */}
      {inspectingChat && (
        <AdminChatModal
          connectionId={inspectingChat.connectionId}
          initialConnection={inspectingChat}
          onClose={() => {
            setInspectingChat(null);
            fetchAdminData();
          }}
        />
      )}

    </div>
  );
};
