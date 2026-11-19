import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../common/Logo';
import { QuickAccessModal } from '../common/QuickAccessModal';
import {
  Search,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Languages,
  Sparkles,
  Command,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, quickLoginAs, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageChange = async (langName: string) => {
    setLangMenuOpen(false);
    if (user) {
      try {
        await updateProfile({ preferredLanguage: langName });
      } catch (err) {
        console.error('Failed to update language', err);
      }
    }
  };

  const currentLang = user?.preferredLanguage || 'Telugu';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark (Strictly 1 element, no subtitle or pill clusters) */}
          <div className="flex items-center gap-3 shrink-0">
            {user && (
              <button
                id="btn-toggle-sidebar"
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link
              to={user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/'}
              className="group flex items-center gap-2"
            >
              <Logo size="md" />
            </Link>
          </div>

          {/* Zone 2: Navigation & Quick Search Bar */}
          <div className="flex-1 max-w-xl mx-auto hidden sm:flex items-center gap-3">
            {/* Quick Access Search Trigger Bar */}
            <button
              onClick={() => setQuickAccessOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs sm:text-sm transition-all shadow-2xs group"
              aria-label="Search CS topics and actions"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                <span className="truncate">Search CS topics, terms, or ask AI...</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setQuickAccessOpen(true)}
              className="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                title="Select Regional Language"
              >
                <Languages className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span className="hidden md:inline max-w-[80px] truncate">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setLangMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Teaching Language
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.name)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                          currentLang === lang.name
                            ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{lang.name}</span>
                        <span className="text-[10px] text-slate-400">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Theme: ${theme}. Click to switch.`}
              aria-label="Toggle Color Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* User Profile or Login/Register Links */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                        {user.role} · {user.preferredLanguage}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="block px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/tutor"
                        className="block px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        AI Tutor
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Settings
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-demo-login-student"
                  onClick={() => quickLoginAs('student')}
                  className="hidden md:inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Student Demo
                </button>
                <button
                  id="btn-demo-login-admin"
                  onClick={() => quickLoginAs('admin')}
                  className="hidden lg:inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-orange-200 dark:border-orange-800/80 bg-orange-50/60 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-100 transition-colors"
                >
                  Researcher Demo
                </button>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:text-orange-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Quick Access Command Palette */}
      <QuickAccessModal isOpen={quickAccessOpen} onClose={() => setQuickAccessOpen(false)} />
    </>
  );
};
