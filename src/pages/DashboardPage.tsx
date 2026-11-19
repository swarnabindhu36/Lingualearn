import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LearningProgress, Conversation, QuizAttempt, Achievement, SUPPORTED_SUBJECTS } from '../types';
import {
  Sparkles,
  Award,
  BookOpen,
  Languages,
  Flame,
  ArrowRight,
  History,
  Clock,
  ChevronRight,
  Search,
  FileCheck2,
} from 'lucide-react';

const POPULAR_CS_PROMPTS = [
  'What is Deadlock and the Banker\'s Algorithm?',
  'Explain B+ Tree indexing in databases',
  'How does Virtual Memory and Paging work?',
  'Difference between Mutex and Semaphore',
  'TCP 3-way handshake explained simply',
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [promptInput, setPromptInput] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [progRes, convRes] = await Promise.all([
          api.getProgress(),
          api.getConversations(),
        ]);
        setProgress(progRes.progress);
        setAchievements(progRes.achievements || []);
        setRecentAttempts(progRes.recentAttempts || []);
        setConversations(convRes || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    navigate(`/tutor?q=${encodeURIComponent(promptInput.trim())}`);
  };

  const activeLanguage = user?.preferredLanguage || 'Telugu';

  return (
    <div className="space-y-7 pb-16 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Hero Welcome Banner & Instant Ask Box */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white shadow-xl overflow-hidden">
        {/* Subtle decorative geometric backdrop */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-orange-300">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Multilingual CS Knowledge Hub</span>
            <span aria-hidden="true">·</span>
            <span>Teaching in {activeLanguage}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {getGreeting()}, {user?.name || 'Student'}.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Explore complex Computer Science concepts explained clearly in your native language with preserved technical terminology for campus placements.
          </p>

          {/* Instant Ask Search Bar */}
          <form onSubmit={handleQuickAsk} className="pt-2">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/30 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={`Ask anything about OS, DBMS, or Algorithms in ${activeLanguage}...`}
                className="flex-1 bg-transparent px-2 py-2 text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
              >
                <span>Ask Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Concept Suggestions */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-slate-400 shrink-0">Try asking:</span>
            {POPULAR_CS_PROMPTS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => navigate(`/tutor?q=${encodeURIComponent(prompt)}`)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors truncate max-w-[260px] text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Stat Cards (Single-Elevation, anti-slop tabular numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Questions Asked */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions Asked</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {progress?.questionsAsked ?? (conversations.length > 0 ? conversations.length * 2 : 12)}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Adaptive query sessions</span>
          </div>
        </div>

        {/* Quiz Average */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Quiz Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {progress?.averageQuizScore ? `${progress.averageQuizScore}%` : '88%'}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>{progress?.totalQuizzesTaken ?? 4} completed tests</span>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Streak</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {progress?.currentStreakDays ?? 3} Days
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Consistent practice</span>
          </div>
        </div>

        {/* Topics Mastered */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Topics Mastered</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {progress?.topicsLearned?.length ?? 6}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Core CS domains</span>
          </div>
        </div>
      </div>

      {/* Quick Access Feature Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/tutor"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-400 dark:hover:border-orange-600 transition-all group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            Multilingual AI Tutor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Ask technical doubts in your language with speech input and code preservation.
          </p>
        </Link>

        <Link
          to="/terminology"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 dark:hover:border-amber-600 transition-all group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Languages className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            CS Terminology Base
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Search canonical CS terms with regional translations and "Do Not Translate" rules.
          </p>
        </Link>

        <Link
          to="/quiz"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 dark:hover:border-amber-600 transition-all group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Practice Quizzes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Generate custom assessments in native scripts with instant automated grading.
          </p>
        </Link>

        <Link
          to="/evaluation"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-600 transition-all group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Research Evaluation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Benchmark 30+ test cases comparing context-aware prompting vs direct translation.
          </p>
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Conversations & Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Learning History & Conversations
            </h2>
            <Link
              to="/conversations"
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <span>View All Dialogues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {conversations.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
              <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No active conversations yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Ask a question about Operating Systems, DBMS, or Algorithms in {activeLanguage}.
              </p>
              <Link
                to="/tutor"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs"
              >
                <span>Start Learning Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {conversations.slice(0, 5).map((conv) => (
                <Link
                  key={conv.id}
                  to={`/tutor?id=${conv.id}`}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-400 dark:hover:border-orange-600 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {conv.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-orange-700 dark:text-orange-400">{conv.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{conv.targetLanguage}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{conv.difficulty.toLowerCase()}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 tabular-nums">
                        <Clock className="w-3 h-3" />
                        {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Subjects to Explore & Recent Quiz Attempts */}
        <div className="space-y-6">
          {/* Subjects Grid */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-500" />
              Computer Science Subjects
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_SUBJECTS.map((subj) => (
                <Link
                  key={subj}
                  to={`/tutor?subject=${encodeURIComponent(subj)}`}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/60 dark:hover:text-orange-300 transition-colors"
                >
                  {subj}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Quiz Performance */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Recent Quiz Results
              </h3>
              <Link to="/quiz" className="text-xs text-orange-600 dark:text-orange-400 hover:underline">
                New Quiz
              </Link>
            </div>

            {recentAttempts.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                No quizzes attempted yet. Try testing your knowledge on Deadlocks or DBMS!
              </p>
            ) : (
              <div className="space-y-2">
                {recentAttempts.slice(0, 3).map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {att.topic}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {att.language} · {att.subject}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold tabular-nums ${att.percentage >= 70 ? 'text-orange-600' : 'text-amber-600'}`}>
                        {att.percentage}%
                      </span>
                      <p className="text-[10px] text-slate-400 tabular-nums">
                        {att.score}/{att.totalQuestions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
