import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Sparkles, 
  Save, 
  BadgeCheck,
  Calendar,
  Loader2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/auth.context';

export const ProfilePage: React.FC = () => {
  const { user, changePassword, changeUsername } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const email = user?.email || '';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      let hasUpdated = false;

      // 1. Update Username if modified
      if (username !== user?.username) {
        if (username.trim().length < 3) {
          throw new Error('Username must be at least 3 characters.');
        }
        await changeUsername(username);
        hasUpdated = true;
      }

      // 2. Change Password if filled
      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          throw new Error('Please fill in both current and new password fields.');
        }
        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters.');
        }
        await changePassword({ currentPassword, newPassword });
        setCurrentPassword('');
        setNewPassword('');
        hasUpdated = true;
      }

      if (hasUpdated) {
        setSuccessMsg('Account details updated successfully!');
      } else {
        setSuccessMsg('No changes detected.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'U';
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Account Settings
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Manage your personal details, credentials, and account security.
        </p>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-indigo-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20 shrink-0">
            {getInitials(user?.username || '')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user?.username}</h2>
              <BadgeCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Account Active
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Verified Member</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto bg-slate-950/60 border border-slate-800 px-4 py-3 rounded-xl flex items-center gap-3 shrink-0">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">Chart-It Pro</div>
            <div className="text-[10px] text-slate-400">Full Access to Analytics</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Overview</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
                <span className="text-slate-400">Security Status</span>
                <span className="font-semibold text-emerald-400">Protected</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
                <span className="text-slate-400">Account Type</span>
                <span className="font-semibold text-indigo-400">Personal</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" /> Encrypted & Secure
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your profile updates are encrypted and bound directly to your unique ID.
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleProfileUpdate} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                      placeholder="Enter new username"
                      required
                    />
                  </div>
                </div>

                {/* Email Address Input (Disabled & Read-Only) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-400">Email Address</label>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Read-only
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      readOnly
                      className="w-full bg-slate-950/40 border border-slate-800/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-500 cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-800/80"></div>

            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" /> Change Password
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

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};