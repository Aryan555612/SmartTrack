import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, UserCheck, LogOut, Activity, Briefcase, Tag } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isOwner = user?.role === 'owner';
  const isPricingPage = location.pathname === '/pricing';

  return (
    <header className="sticky top-0 z-50 glass-nav px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xl">
      {/* Brand Logo */}
      <div 
        onClick={() => navigate(user ? (isOwner ? '/owner-dashboard' : '/employee-dashboard') : '/login')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white font-display">SmartTrack</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CRM v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Employee Task & Performance Hub</p>
        </div>
      </div>

      {/* Center Nav Link to Pricing & Business Model */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/pricing')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isPricingPage
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-purple-400'
              : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-purple-400" />
          <span>Product Pricing & Business Model</span>
        </button>
      </div>

      {/* User Profile & Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-3 glass-panel px-3 py-1.5 rounded-xl border border-slate-700/50">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
              />
              <div className="hidden sm:block text-left">
                <h4 className="text-xs font-semibold text-slate-100 leading-tight">{user.name}</h4>
                <p className="text-[10px] font-medium text-slate-400 capitalize">
                  {isOwner ? (
                    <span className="text-purple-400 font-semibold">Owner / Admin</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">{user.title || 'Employee'}</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-rose-500/20 border border-slate-700/80 hover:border-rose-500/40 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
