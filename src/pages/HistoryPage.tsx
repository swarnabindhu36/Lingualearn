import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Conversation, SUPPORTED_LANGUAGES, SUPPORTED_SUBJECTS } from '../types';
import {
  History,
  Search,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  MessageSquare,
  BookOpen,
  Languages,
  Award,
  Plus,
  X,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface ConversationActivityStats {
  totalConversations: number;
  subjectsExplored: number;
  subjectsList: string[];
  languagesUsed: number;
  languagesList: string[];
  totalDialogueTurns: number;
  userQuestions: number;
  aiResponses: number;
}

function getRelativeTimeString(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export const HistoryPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [activityStats, setActivityStats] = useState<ConversationActivityStats | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tutor' | 'os' | 'dbms'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'messages'>('newest');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadConversations = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [data, statsData] = await Promise.all([
        api.getConversations({
          search: search.trim() || undefined,
          subject: selectedSubject || undefined,
          language: selectedLanguage || undefined,
          difficulty: selectedDifficulty || undefined,
        }),
        api.getConversationStats().catch((err) => {
          console.warn('Failed to load conversation stats:', err);
          return null;
        }),
      ]);

      const convList = data || [];
      setConversations(convList);
      if (statsData) {
        setActivityStats(statsData);
      }
      if (!search.trim() && !selectedSubject && !selectedLanguage && !selectedDifficulty) {
        setAllConversations(convList);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [selectedSubject, selectedLanguage, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadConversations();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await api.deleteConversation(id);
      setConfirmDeleteId(null);
      await loadConversations();
    } catch (err) {
      console.error('Delete conversation failed:', err);
    }
  };

  // Compute summary stats based on overall user activity
  const stats = useMemo(() => {
    if (activityStats) {
      return {
        totalConvs: activityStats.totalConversations,
        totalSubjects: activityStats.subjectsExplored,
        subjectsList: activityStats.subjectsList || [],
        totalLanguages: activityStats.languagesUsed,
        languagesList: activityStats.languagesList || [],
        totalDialogueTurns: activityStats.totalDialogueTurns,
        userQuestions: activityStats.userQuestions,
        aiResponses: activityStats.aiResponses,
      };
    }

    const baseList = allConversations.length > 0 ? allConversations : conversations;
    const totalConvs = baseList.length;
    const subjects = new Set(baseList.map((c) => c.subject).filter(Boolean));
    const languages = new Set(baseList.map((c) => c.targetLanguage).filter(Boolean));
    const totalDialogueTurns = baseList.reduce((acc, c) => acc + (c.messages?.length || 0), 0);
    return {
      totalConvs,
      totalSubjects: subjects.size,
      subjectsList: Array.from(subjects),
      totalLanguages: languages.size,
      languagesList: Array.from(languages),
      totalDialogueTurns,
      userQuestions: Math.floor(totalDialogueTurns / 2),
      aiResponses: Math.ceil(totalDialogueTurns / 2),
    };
  }, [activityStats, allConversations, conversations]);

  // Client-side filtering & sorting
  const sortedConversations = useMemo(() => {
    let list = [...conversations];

    // Tab-based filtering
    if (activeTab === 'tutor') {
      list = list.filter((c) => c.messages && c.messages.length > 0);
    } else if (activeTab === 'os') {
      list = list.filter((c) => c.subject?.toLowerCase().includes('operating system'));
    } else if (activeTab === 'dbms') {
      list = list.filter((c) => c.subject?.toLowerCase().includes('dbms') || c.subject?.toLowerCase().includes('database'));
    }

    if (sortBy === 'newest') {
      return list.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );
    } else if (sortBy === 'oldest') {
      return list.sort(
        (a, b) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
      );
    } else if (sortBy === 'messages') {
      return list.sort((a, b) => (b.messages?.length || 0) - (a.messages?.length || 0));
    }
    return list;
  }, [conversations, activeTab, sortBy]);

  const hasActiveFilters = Boolean(search || selectedSubject || selectedLanguage || selectedDifficulty || activeTab !== 'all');

  const resetFilters = () => {
    setSearch('');
    setSelectedSubject('');
    setSelectedLanguage('');
    setSelectedDifficulty('');
    setActiveTab('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Learning History & Conversations</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Study Dialogues & Past Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review past questions asked in the AI Tutor. Jump back in to continue any discussion or take customized quizzes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => loadConversations(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Refresh conversations"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${refreshing ? 'animate-spin text-orange-600' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            to="/tutor"
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Zero-Pill, Tabular Numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>Conversations</span>
            <MessageSquare className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {stats.totalConvs}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Active study threads
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>Subjects</span>
            <BookOpen className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {stats.totalSubjects}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            {stats.subjectsList.slice(0, 2).join(', ') || 'Computer Science'}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>Languages</span>
            <Languages className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {stats.totalLanguages}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            {stats.languagesList.slice(0, 2).join(', ') || 'Regional Mediums'}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>Dialogue Turns</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {stats.totalDialogueTurns}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Questions & Answers
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search learning history by topic, question, or keyword..."
            className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                loadConversations();
              }}
              className="absolute right-12 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-orange-600" />
              Filter:
            </span>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="">All Subjects</option>
              {SUPPORTED_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="">All Languages</option>
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.name}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="messages">Most Messages</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <Sparkles className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            Loading your learning history...
          </p>
        </div>
      ) : sortedConversations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
          <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {hasActiveFilters ? 'No matching conversations' : 'No study conversations recorded yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your subject or language filters.'
              : 'Ask a question in the AI Tutor to begin your multilingual computer science journey.'}
          </p>
          <div className="pt-2">
            <Link
              to="/tutor"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ask First Question</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedConversations.map((conv) => {
            const messages = conv.messages || [];
            const userMessages = messages.filter((m) => m.sender === 'user');
            const lastUserMsg = userMessages[userMessages.length - 1];
            const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'assistant');

            const previewText =
              lastAiMsg?.structuredResponse?.quickAnswer ||
              lastAiMsg?.structuredResponse?.definition ||
              lastAiMsg?.content ||
              'Click to resume this session in the AI tutor.';

            const preservedTerms =
              lastAiMsg?.structuredResponse?.preservedTerms?.slice(0, 3) || [];

            const relativeTime = getRelativeTimeString(conv.updatedAt || conv.createdAt);

            return (
              <div
                key={conv.id}
                onClick={() => navigate(`/tutor?id=${conv.id}`)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-400 dark:hover:border-orange-600 transition-all cursor-pointer group shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Clean Typographic Header (Zero-Pill) */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-orange-700 dark:text-orange-400">
                      {conv.subject}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{conv.targetLanguage}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{conv.difficulty.toLowerCase()} Level</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {relativeTime}
                    </span>
                  </div>

                  {/* Title & Question */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                    {conv.title || lastUserMsg?.content || 'Technical Inquiry'}
                  </h3>

                  {/* Tutor Explanation Snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    <strong className="text-orange-700 dark:text-orange-400 font-semibold">Tutor: </strong>
                    {previewText}
                  </p>

                  {/* Preserved Engineering Terms */}
                  {preservedTerms.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[11px] text-slate-400">
                      <span>Preserved:</span>
                      {preservedTerms.map((t: any, tidx: number) => {
                        const termText = typeof t === 'string' ? t : t?.englishTerm || String(t);
                        return (
                          <span
                            key={tidx}
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {termText}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Side Action Buttons */}
                <div
                  className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Quiz Launch Button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigate(
                        `/quiz?topic=${encodeURIComponent(conv.title)}&subject=${encodeURIComponent(
                          conv.subject
                        )}&language=${encodeURIComponent(conv.targetLanguage)}&difficulty=${
                          conv.difficulty === 'ADVANCED' ? 'HARD' : conv.difficulty === 'BEGINNER' ? 'EASY' : 'MEDIUM'
                        }`
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-amber-700 dark:text-amber-400 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Take a practice quiz on this topic"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Quiz</span>
                  </button>

                  {/* Continue in Tutor Button */}
                  <button
                    type="button"
                    onClick={() => navigate(`/tutor?id=${conv.id}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Inline Delete Confirmation (No window.confirm) */}
                  {confirmDeleteId === conv.id ? (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(conv.id, e)}
                        className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-1.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(conv.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
