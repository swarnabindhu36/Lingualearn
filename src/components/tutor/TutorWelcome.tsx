import React from 'react';
import {
  Mic,
  ArrowRight,
  BookOpen,
  Cpu,
  Database,
  Network,
  Binary,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';

interface TutorWelcomeProps {
  userName?: string;
  targetLanguage: string;
  activeSubject: string;
  onSelectSubject: (subj: string) => void;
  onAskQuestion: (q: string) => void;
  onStartVoice: () => void;
  isListening: boolean;
  isTranscribing: boolean;
}

interface SubjectItem {
  name: string;
  icon: React.ReactNode;
}

const SUBJECT_LIST: SubjectItem[] = [
  { name: 'Operating Systems', icon: <Cpu className="w-3.5 h-3.5" /> },
  { name: 'DBMS', icon: <Database className="w-3.5 h-3.5" /> },
  { name: 'Computer Networks', icon: <Network className="w-3.5 h-3.5" /> },
  { name: 'Data Structures', icon: <Binary className="w-3.5 h-3.5" /> },
  { name: 'Machine Learning', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
];

const SUBJECT_SUGGESTIONS: Record<
  string,
  Array<{ title: string; hint: string }>
> = {
  'Operating Systems': [
    { title: 'What is Deadlock and the 4 Coffman conditions?', hint: 'Core concurrency & resource allocation' },
    { title: 'Explain the difference between a Process and a Thread', hint: 'Memory space, context switching & PCB' },
    { title: 'How does Virtual Memory and Paging prevent memory faults?', hint: 'Page tables, TLB & address translation' },
    { title: 'What is the Producer-Consumer problem using Semaphores?', hint: 'Mutex, wait(), and signal() primitives' },
  ],
  DBMS: [
    { title: 'Explain how B+ Trees work in database index lookups', hint: 'Disk I/O, node branching & search efficiency' },
    { title: 'What are ACID properties in transaction management?', hint: 'Atomicity, Consistency, Isolation, Durability' },
    { title: 'Explain 1NF, 2NF, and 3NF Normalization with examples', hint: 'Functional dependencies & redundancy reduction' },
    { title: 'What is the difference between Optimistic & Pessimistic Locking?', hint: 'Concurrency control & timestamp ordering' },
  ],
  'Computer Networks': [
    { title: 'How does the TCP 3-Way Handshake establish a reliable connection?', hint: 'SYN, SYN-ACK, ACK sequence exchange' },
    { title: 'Explain the Step-by-Step DNS resolution hierarchy', hint: 'Root nameservers, TLD, and authoritative records' },
    { title: 'What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?', hint: 'Head-of-line blocking, multiplexing & QUIC' },
    { title: 'How do Subnet Masks and CIDR notation route IP packets?', hint: 'Network prefix, host IDs & routing tables' },
  ],
  'Data Structures': [
    { title: 'Explain Hash Table collision resolution: Chaining vs Open Addressing', hint: 'Time complexity, load factors & clustering' },
    { title: 'How does Dijkstra’s algorithm find the Shortest Path in a weighted graph?', hint: 'Greedy approach & min-priority queue' },
    { title: 'What are self-balancing AVL Trees and rotations?', hint: 'Balance factors, LL, RR, LR, RL rotations' },
    { title: 'Explain Dynamic Programming with the 0/1 Knapsack problem', hint: 'Optimal substructure & memoization matrix' },
  ],
  'Machine Learning': [
    { title: 'What is the Bias-Variance Tradeoff and how to balance it?', hint: 'Underfitting vs overfitting & cross-validation' },
    { title: 'Explain Gradient Descent and the Learning Rate concept', hint: 'Loss surface, cost function & parameter updates' },
    { title: 'How does Backpropagation calculate gradients in Neural Networks?', hint: 'Chain rule of calculus & weight updates' },
    { title: 'What is the difference between L1 (Lasso) and L2 (Ridge) Regularization?', hint: 'Feature sparsity vs weight penalization' },
  ],
};

export const TutorWelcome: React.FC<TutorWelcomeProps> = ({
  userName,
  targetLanguage,
  activeSubject,
  onSelectSubject,
  onAskQuestion,
  onStartVoice,
  isListening,
  isTranscribing,
}) => {
  const currentQuestions =
    SUBJECT_SUGGESTIONS[activeSubject] || SUBJECT_SUGGESTIONS['Operating Systems'];

  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto py-8 px-4 space-y-7 animate-in fade-in duration-200">
      {/* Title & Introduction */}
      <div className="text-center space-y-2.5">
        <div className="text-xs uppercase tracking-widest font-semibold text-orange-600 dark:text-orange-400">
          Multilingual Engineering AI Tutor
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome{userName ? `, ${userName}` : ''}! What would you like to master?
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Ask questions in English or your preferred regional language. Concepts and intuitive analogies are explained in <strong className="text-orange-700 dark:text-orange-300 font-semibold">{targetLanguage}</strong>, while technical vocabulary remains in standard English for placement and interview readiness.
        </p>
      </div>

      {/* Voice Prompt Action Banner */}
      <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Speak Your Question Verbally
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] border border-slate-200 dark:border-slate-700">
                Alt+M
              </kbd>{' '}
              or click the microphone to speak naturally in {targetLanguage} or English.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartVoice}
          disabled={isTranscribing}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-2xs'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{isListening ? 'Listening... Click to Stop' : 'Start Speaking'}</span>
        </button>
      </div>

      {/* Subject Picker Tab Bar */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-orange-600" />
            <span>Select subject focus:</span>
          </span>
          <span className="text-[11px]">
            Selected: <strong className="text-slate-800 dark:text-slate-200">{activeSubject}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUBJECT_LIST.map((subj) => {
            const isSelected = subj.name === activeSubject;
            return (
              <button
                key={subj.name}
                type="button"
                onClick={() => onSelectSubject(subj.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700'
                }`}
              >
                {subj.icon}
                <span>{subj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Starter Questions */}
      <div className="w-full space-y-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
          Popular Questions in {activeSubject}:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onAskQuestion(item.title)}
              className="p-4 text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-relaxed">
                  {item.title}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-normal">
                {item.hint}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
