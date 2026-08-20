import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  // الحصول على الحروف الأولى بشكل آمن مع تقبل name أو username
  const userName = (user as any)?.name || user?.username || 'User';
  
  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'U';
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between transition-all">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search transactions, categories..." 
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* User & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-medium text-indigo-400">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Pro Account</span>
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-xl transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-indigo-500 rounded-full absolute top-2 right-2 ring-2 ring-slate-900"></span>
        </button>

        <div className="h-5 w-[1px] bg-slate-800"></div>

        <div className="flex items-center gap-3 pl-1 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-indigo-500/20">
            {getInitials(userName)}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200">{userName}</div>
            <div className="text-[10px] text-slate-400">{user?.email || 'user@example.com'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};