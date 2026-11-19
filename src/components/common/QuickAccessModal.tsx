import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Sparkles,
  BookOpen,
  Award,
  Languages,
  Activity,
  History,
  X,
  ArrowRight,
  Command,
  FileCheck2,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SUPPORTED_SUBJECTS } from '../../types';

interface QuickAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_CS_TOPICS = [
  { name: 'Deadlock & Synchronization', subject: 'Operating Systems', keyword: 'deadlock' },
  { name: 'Semaphores & Mutexes', subject: 'Operating Systems', keyword: 'semaphore' },
  { name: 'Virtual Memory & Paging', subject: 'Operating Systems', keyword: 'virtual_memory' },
  { name: 'B-Tree & Indexing', subject: 'Database Management', keyword: 'b_tree' },
  { name: 'ACID Transactions', subject: 'Database Management', keyword: 'acid' },
  { name: 'TCP/IP 3-Way Handshake', subject: 'Computer Networks', keyword: 'tcp/ip' },
  { name: 'DNS & Socket Architecture', subject: 'Computer Networks', keyword: 'socket' },
  { name: 'Polymorphism & OOP', subject: 'Data Structures & Algorithms', keyword: 'polymorphism' },
  { name: 'Garbage Collection & Heap', subject: 'Computer Organization', keyword: 'garbage_collection' },
  { name: 'Buffer Overflow & Security', subject: 'Computer Networks', keyword: 'buffer_overflow' },
  { name: 'Overfitting & Regularization', subject: 'Machine Learning Basics', keyword: 'overfitting' },
];

export const QuickAccessModal: React.FC<QuickAccessModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTopics = COMMON_CS_TOPICS.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.subject.toLowerCase().includes(query.toLowerCase()) ||
      t.keyword.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectTopic = (topic: typeof COMMON_CS_TOPICS[0], action: 'tutor' | 'glossary' | 'quiz') => {
    onClose();
    if (action === 'tutor') {
      navigate(`/tutor?subject=${encodeURIComponent(topic.subject)}`);
    } else if (action === 'glossary') {
      navigate(`/terminology?search=${encodeURIComponent(topic.keyword)}`);
    } else {
      navigate(`/quiz?topic=${encodeURIComponent(topic.name)}&subject=${encodeURIComponent(topic.subject)}`);
    }
  };

  const handleLanguageSwitch = async (langName: string) => {
    try {
      await updateProfile({ preferredLanguage: langName });
      onClose();
    } catch (err) {
      console.error('Failed to change language:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CS concepts, algorithms, glossary terms, or quick actions..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Scrollable Results */}
        <div className="overflow-y-auto p-3 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Quick Navigations */}
          {!query && (
            <div className="pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2">
                <button
                  onClick={() => {
                    navigate('/tutor');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>AI Tutor</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/terminology');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Languages className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>CS Glossary</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/quiz');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Quizzes</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/progress');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Activity className="w-4 h-4 text-sky-500" />
                  <span>Progress</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/history');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <History className="w-4 h-4 text-purple-500" />
                  <span>Conversations</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/evaluation');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <FileCheck2 className="w-4 h-4 text-indigo-500" />
                  <span>Research Study</span>
                </button>
              </div>
            </div>
          )}

          {/* Computer Science Concepts */}
          <div className="pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
              {query ? 'Matched Topics' : 'Featured Topics & Preserved Terms'}
            </span>
            <div className="mt-1.5 space-y-1">
              {filteredTopics.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No exact topic matched "{query}". Press enter to ask the AI Tutor directly.
                  <button
                    onClick={() => {
                      navigate(`/tutor?q=${encodeURIComponent(query)}`);
                      onClose();
                    }}
                    className="mt-2 block mx-auto px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
                  >
                    Ask AI Tutor: "{query}"
                  </button>
                </div>
              ) : (
                filteredTopics.slice(0, 6).map((topic) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {topic.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {topic.subject}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleSelectTopic(topic, 'tutor')}
                        className="px-2 py-1 rounded-md text-[11px] font-medium bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                        title="Open topic in AI Tutor"
                      >
                        Ask Tutor
                      </button>
                      <button
                        onClick={() => handleSelectTopic(topic, 'glossary')}
                        className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="View term in Glossary"
                      >
                        Glossary
                      </button>
                      <button
                        onClick={() => handleSelectTopic(topic, 'quiz')}
                        className="px-2 py-1 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                        title="Take practice quiz"
                      >
                        Quiz
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Learning Language Switcher */}
          <div className="pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
              Switch Native Language
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2 px-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isCurrent = user?.preferredLanguage === lang.name;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSwitch(lang.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isCurrent
                        ? 'bg-orange-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lang.name} ({lang.nativeName})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↵</kbd> to select</span>
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC</kbd> to close</span>
          </div>
          <span>LinguaLearn Instant Navigation</span>
        </div>
      </div>
    </div>
  );
};
