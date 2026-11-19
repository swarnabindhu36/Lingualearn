import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import {
  Sparkles,
  Award,
  Activity,
  Languages,
  History,
  Settings,
  Shield,
  FileCheck2,
  BarChart3,
  BookOpen,
  X,
  Flame,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = user.role === 'ADMIN' || user.role === 'RESEARCHER';

  const navSections = isAdmin
    ? [
        {
          title: 'Core Testing',
          items: [
            { name: 'Admin Overview', path: '/admin', icon: Shield },
            { name: 'AI Tutor Testing', path: '/tutor', icon: Sparkles },
            { name: 'Terminology Base', path: '/terminology', icon: Languages },
            { name: 'Conversations', path: '/conversations', icon: History },
          ],
        },
        {
          title: 'Research & Evaluation',
          items: [
            { name: 'Evaluation Cases', path: '/evaluation', icon: FileCheck2 },
            { name: 'Research Metrics', path: '/evaluation/metrics', icon: BarChart3 },
            { name: 'Error Analysis', path: '/evaluation/errors', icon: BookOpen },
          ],
        },
      ]
    : [
        {
          title: 'Learning Studio',
          items: [
            { name: 'Dashboard', path: '/dashboard', icon: GraduationCap },
            { name: 'AI Tutor', path: '/tutor', icon: Sparkles },
            { name: 'CS Glossary', path: '/terminology', icon: Languages },
            { name: 'Quiz Assessments', path: '/quiz', icon: Award },
          ],
        },
        {
          title: 'Tracking & Research',
          items: [
            { name: 'Conversations', path: '/conversations', icon: History },
            { name: 'Learning Progress', path: '/progress', icon: Activity },
            { name: 'Research Study', path: '/evaluation', icon: BookOpen },
          ],
        },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 sm:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:z-10 shrink-0`}
      >
        {/* Mobile Header with Close button */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 md:hidden">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Workspace Info & Language Header */}
        <div className="p-4 mx-3 mt-4 mb-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {user.preferredLanguage}
                </span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{user.role.toLowerCase()}</span>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Streak
              </span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">3 Days Active</span>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <h3 className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {sec.title}
              </h3>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-orange-600 text-white shadow-2xs shadow-orange-600/20'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 ${
                                isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Settings Link */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <NavLink
            to="/settings"
            onClick={() => onClose()}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Preferences</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
