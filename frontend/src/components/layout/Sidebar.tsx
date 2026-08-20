import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Tag, 
  BarChart3, 
  Bot, 
  User as UserIcon, 
  LogOut, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/categories', label: 'Categories', icon: Tag },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/ai-hub', label: 'AI Assistant', icon: Bot },
    { to: '/profile', label: 'Profile Settings', icon: UserIcon },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 flex flex-col justify-between min-h-screen">
      <div className="space-y-8">
        {/* App Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent block">
              Chart It
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Finance OS</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Security Badge & Logout */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-[11px] text-slate-400 leading-tight">
            Encrypted End-to-End
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all rounded-xl hover:bg-rose-500/10"
        >
          <LogOut className="w-4 h-4" />
          Logout Account
        </button>
      </div>
    </aside>
  );
};