import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  BadgeCheck,
  Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const userName = (user as any)?.name || user?.username || 'Anes Touati';
  const userEmail = user?.email || 'anes@example.com';

  // Local State for Profile Form
  const [fullName, setFullName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Profile Update
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'U';
    return nameStr.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Account Settings
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Manage your personal details, credentials, and account security.
        </p>
      </div>

      {/* Top Banner Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-indigo-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20 shrink-0">
            {getInitials(fullName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{fullName}</h2>
              <BadgeCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{email}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Joined August 2026
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Active Member</span>
            </div>
          </div>
        </div>

        {/* Plan Status */}
        <div className="w-full md:w-auto bg-slate-950/60 border border-slate-800 px-4 py-3 rounded-xl flex items-center gap-3 shrink-0">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">Pro Plan Member</div>
            <div className="text-[10px] text-slate-400">Unlimited entries & analytics</div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Navigation / Quick Info */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Overview</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
                <span className="text-slate-400">Security Score</span>
                <span className="font-semibold text-emerald-400">High</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
                <span className="text-slate-400">2FA Status</span>
                <span className="font-semibold text-indigo-400">Disabled</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your profile changes are protected and synced with standard auth protocols.
            </p>
          </div>
        </div>

        {/* Right Column: Update Profile & Password */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleProfileUpdate} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
            {/* Success Alert */}
            {isSaved && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-semibold animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Profile details updated successfully!
              </div>
            )}

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" /> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                      placeholder="e.g. Anes Touati"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                      placeholder="e.g. anes@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-800/80"></div>

            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" /> Security & Password
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};