import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { PUNE_AREAS, NAVRATRI_DAYS, EXPERIENCE_LEVELS, ACTIVITIES, LOOKING_FOR_OPTIONS, GENDERS } from '../utils/constants';
import { Sparkles, User, MapPin, Calendar, Heart, ShieldCheck, AtSign, ArrowRight, Lock } from 'lucide-react';

export const RegisterPage = ({ setActiveTab }) => {
  const { registerUser } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Clean form without pre-selected options
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    area: '',
    experience: '',
    activity: '',
    availableDays: [],
    lookingFor: '',
    socialContact: '',
    bio: ''
  });

  const handleDayToggle = (dayNum) => {
    setFormData(prev => {
      const current = prev.availableDays;
      if (current.includes(dayNum)) {
        return { ...prev, availableDays: current.filter(d => d !== dayNum) };
      } else {
        return { ...prev, availableDays: [...current, dayNum].sort((a, b) => a - b) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) return setErrorMsg('Please enter your full name.');
    if (!formData.email.trim() || !formData.email.includes('@')) return setErrorMsg('Please enter a valid email address.');
    if (!formData.password.trim() || formData.password.length < 4) return setErrorMsg('Password must be at least 4 characters.');
    if (!formData.age || parseInt(formData.age, 10) < 16) return setErrorMsg('Please enter your age (16+).');
    if (!formData.gender) return setErrorMsg('Please select your gender.');
    if (!formData.area) return setErrorMsg('Please select your area in Pune.');
    if (!formData.experience) return setErrorMsg('Please select your Garba experience level.');
    if (!formData.activity) return setErrorMsg('Please select your preferred activity.');
    if (!formData.availableDays || formData.availableDays.length === 0) return setErrorMsg('Please select at least one Navratri day you will attend.');
    if (!formData.lookingFor) return setErrorMsg('Please select what you are looking for.');
    if (!formData.socialContact.trim()) return setErrorMsg('Please enter your Instagram handle.');
    if (!formData.bio.trim()) return setErrorMsg('Please tell us a little about yourself in the bio.');

    setSubmitting(true);
    const res = await registerUser(formData);
    setSubmitting(false);

    if (res.success) {
      setActiveTab('dashboard');
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.error || 'Failed to create profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3.5 py-1 rounded-full border border-pink-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Join Pune Community
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Join GarbaSaathi 💃🕺
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/70 max-w-lg mx-auto">
          Create your account in 1 minute and connect with Garba lovers across Pune.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#180930]/90 border border-purple-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 sm:space-y-8 shadow-2xl">
        
        {/* Section 1: Account Credentials */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <Lock className="w-4 h-4 text-pink-400" /> 1. Account Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. yourname@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="At least 4 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal Profile */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <User className="w-4 h-4 text-pink-400" /> 2. Basic Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Age *</label>
              <input
                type="number"
                min="16"
                max="99"
                required
                placeholder="e.g. 21"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1.5">Gender *</label>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    formData.gender === g
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md ring-2 ring-pink-400/40'
                      : 'bg-purple-950/60 text-purple-300 border-purple-800/60 hover:bg-purple-900/40'
                  }`}
                >
                  {g === 'Female' ? '💃 Female' : g === 'Male' ? '🕺 Male' : '✨ Other'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Pune Area */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <MapPin className="w-4 h-4 text-rose-400" /> 3. Pune Location
          </h3>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">Area in Pune *</label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className={`w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-pink-500 ${
                formData.area ? 'text-white' : 'text-purple-400/70'
              }`}
            >
              <option value="" disabled>-- Select your area in Pune --</option>
              {PUNE_AREAS.map(a => <option key={a} value={a} className="text-white bg-[#180930]">{a}</option>)}
            </select>
          </div>
        </div>

        {/* Section 4: Garba Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <Calendar className="w-4 h-4 text-amber-400" /> 4. Garba Experience & Days
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Garba Experience *</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className={`w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-pink-500 ${
                  formData.experience ? 'text-white' : 'text-purple-400/70'
                }`}
              >
                <option value="" disabled>-- Select experience level --</option>
                {EXPERIENCE_LEVELS.map(exp => <option key={exp} value={exp} className="text-white bg-[#180930]">{exp}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Preferred Activity *</label>
              <select
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                className={`w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-pink-500 ${
                  formData.activity ? 'text-white' : 'text-purple-400/70'
                }`}
              >
                <option value="" disabled>-- Select preferred activity --</option>
                {ACTIVITIES.map(act => <option key={act} value={act} className="text-white bg-[#180930]">{act}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <label className="block text-xs font-bold text-purple-200">
                Available Garba Days (Click days you are attending) *
              </label>
              <button
                type="button"
                onClick={() => {
                  if (formData.availableDays.length === 9) {
                    setFormData({ ...formData, availableDays: [] });
                  } else {
                    setFormData({ ...formData, availableDays: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
                  }
                }}
                className="text-[11px] font-bold text-pink-400 hover:text-pink-300 underline"
              >
                {formData.availableDays.length === 9 ? 'Clear All' : 'Select All 9 Days'}
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
              {NAVRATRI_DAYS.map((d) => {
                const isSelected = formData.availableDays.includes(d.day);
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => handleDayToggle(d.day)}
                    className={`py-2 text-center rounded-xl text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-gradient-to-tr from-pink-600 to-rose-600 text-white border-pink-400 shadow-md ring-1 ring-pink-400/50'
                        : 'bg-purple-950/60 text-purple-400 border-purple-800/40 hover:text-white hover:border-purple-600'
                    }`}
                  >
                    Day {d.day}
                  </button>
                );
              })}
            </div>
            {formData.availableDays.length === 0 && (
              <p className="text-[11px] text-purple-300/70 mt-1.5">No days selected yet. Click each day you'll be playing Garba.</p>
            )}
          </div>
        </div>

        {/* Section 5: Looking For */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <Heart className="w-4 h-4 text-pink-400" /> 5. Looking For *
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LOOKING_FOR_OPTIONS.map((lf) => (
              <button
                key={lf}
                type="button"
                onClick={() => setFormData({ ...formData, lookingFor: lf })}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  formData.lookingFor === lf
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md ring-2 ring-pink-400/40'
                    : 'bg-purple-950/60 text-purple-300 border-purple-800/60 hover:bg-purple-900/40'
                }`}
              >
                {lf}
              </button>
            ))}
          </div>
        </div>

        {/* Section 6: Social Handle */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <AtSign className="w-4 h-4 text-pink-400" /> 6. Preferred Public Contact *
          </h3>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Instagram Username or Social Contact *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Instagram: @your_instagram_handle"
              value={formData.socialContact}
              onChange={(e) => setFormData({ ...formData, socialContact: e.target.value })}
              className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
            />
            <p className="text-[11px] text-purple-300/70 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Mobile numbers are kept private. Your social handle is ONLY revealed when a connection request is accepted!</span>
            </p>
          </div>
        </div>

        {/* Section 7: About You */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            ✨ 7. About You *
          </h3>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">Tell us a little about yourself *</label>
            <textarea
              rows={3}
              required
              placeholder="Tell us a little about yourself, your dance style, or what events you plan to attend..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white rounded-2xl font-extrabold text-base transition shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{submitting ? 'Registering...' : 'Complete Registration & Open Dashboard'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>

    </div>
  );
};
