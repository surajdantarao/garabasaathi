import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { ShieldCheck, Trash2, Users, MapPin, RefreshCw, Activity, Database, Lock, Clock, Search, ArrowRight, HeartHandshake, Eye, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { NAVRATRI_DAYS } from '../utils/constants';
import { apiUrl } from '../utils/api';

export const AdminPage = ({ setActiveTab }) => {
  const { currentUser } = useUser();
  const [activeTab, setActiveAdminTab] = useState('users'); // 'users' | 'connections' | 'demographics'
  
  // Data states
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [connectionsList, setConnectionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');
  
  // UI states
  const [message, setMessage] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, connsRes] = await Promise.all([
        fetch(apiUrl('/api/admin/stats')),
        fetch(apiUrl('/api/users')),
        fetch(apiUrl('/api/admin/connections'))
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const connsData = await connsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (usersData.success) setUsersList(usersData.users);
      if (connsData.success) setConnectionsList(connsData.connections || []);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20 mb-2">
            <ShieldCheck className="w-4 h-4" /> Platform Administration & Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Admin Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/70 mt-1">
            Logged in as SuperAdmin: <strong className="text-amber-300">___suraj_sd__</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 rounded-xl border border-purple-800/60 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReseedData}
            className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
          >
            <Database className="w-4 h-4" /> Reset / Seed DB
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center animate-in fade-in">
          ✅ {message}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-[#180930] border border-purple-800/50 p-5 rounded-3xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-300/70 uppercase">Registered Users</p>
            <p className="text-3xl font-black text-white mt-0.5">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="bg-[#180930] border border-purple-800/50 p-5 rounded-3xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-300/70 uppercase">Accepted Connections</p>
            <p className="text-3xl font-black text-white mt-0.5">{stats?.acceptedConnections || 0}</p>
          </div>
        </div>

        <div className="bg-[#180930] border border-purple-800/50 p-5 rounded-3xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-300/70 uppercase">Pending Requests</p>
            <p className="text-3xl font-black text-white mt-0.5">{stats?.pendingRequests || 0}</p>
          </div>
        </div>

        <div className="bg-[#180930] border border-purple-800/50 p-5 rounded-3xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-300/70 uppercase">Pune Hubs Active</p>
            <p className="text-3xl font-black text-white mt-0.5">{stats?.areaStats?.length || 0}</p>
          </div>
        </div>

      </div>

      {/* Admin Panel Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-900/50 pb-2">
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage User Accounts ({filteredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('connections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
            activeTab === 'connections'
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white border-pink-400 shadow-md'
              : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Connection Requests & Matches ({connectionsList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('demographics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
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
                    <th className="p-3.5 text-right">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40">
                  {connectionsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs text-purple-400">
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

    </div>
  );
};
