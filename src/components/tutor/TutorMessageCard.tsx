import React, { useState } from 'react';
import { Message } from '../../types';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  Award,
  Lightbulb,
  Code2,
  ListOrdered,
  AlertTriangle,
  BookOpen,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  User,
  Bot,
} from 'lucide-react';

interface TutorMessageCardProps {
  message: Message;
  speakingMsgId: string | null;
  copiedMsgId: string | null;
  onSpeech: (text: string, msgId: string) => void;
  onCopy: (text: string, msgId: string) => void;
  onAskFollowUp: (
    topic: string,
    actionType: 'SIMPLIFY' | 'EXPLAIN_DEEPER' | 'ANALOGY'
  ) => void;
  onTakeQuiz: (topic: string) => void;
  loading: boolean;
}

export const TutorMessageCard: React.FC<TutorMessageCardProps> = ({
  message,
  speakingMsgId,
  copiedMsgId,
  onSpeech,
  onCopy,
  onAskFollowUp,
  onTakeQuiz,
  loading,
}) => {
  const isUser = message.sender === 'user';
  const resp = message.structuredResponse;
  const isSpeaking = speakingMsgId === message.id;
  const isCopied = copiedMsgId === message.id;

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
        <div className="max-w-2xl rounded-2xl rounded-tr-xs bg-orange-600 text-white p-4 sm:p-5 shadow-sm">
          <p className="text-sm sm:text-base font-normal leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-orange-200">
            <Clock className="w-3 h-3" />
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-orange-700/80 text-white flex items-center justify-center shrink-0 text-xs font-bold mb-1 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant Response
  const hasAnalogy = !!resp?.analogy;
  const hasExample = !!resp?.example;
  const hasSteps = resp?.stepByStep && resp.stepByStep.length > 0;
  const hasTerms = resp?.technicalTerms && resp.technicalTerms.length > 0;
  const hasMisconceptions = resp?.misconceptions && resp.misconceptions.length > 0;

  const conceptTitle = resp?.definition || 'Concept Breakdown';
  const fullTextToRead = resp?.explanation || message.content;

  return (
    <div className="flex items-start gap-3 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Bot Icon */}
      <div className="w-9 h-9 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
        <Bot className="w-5 h-5" />
      </div>

      <div className="flex-1 rounded-3xl rounded-tl-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/40">
          <div>
            {/* Zero-Pill Typography Metadata Line */}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-semibold text-orange-700 dark:text-orange-400">{message.subject}</span>
              <span aria-hidden="true">·</span>
              <span>Explained in {message.targetLanguage}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{message.difficulty.toLowerCase()} Level</span>
            </div>

            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {conceptTitle}
            </h3>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => onSpeech(fullTextToRead, message.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSpeaking
                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs animate-pulse'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isSpeaking ? 'Stop audio narration' : `Listen to explanation in ${message.targetLanguage}`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Speaking...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="hidden sm:inline">Listen</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onCopy(fullTextToRead, message.id)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy explanation"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-orange-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onTakeQuiz(conceptTitle)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Test your mastery of this concept with a customized quiz"
            >
              <Award className="w-4 h-4" />
              <span>Practice Quiz</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* 1. Quick Answer / Executive Takeaway */}
          {resp?.quickAnswer && (
            <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border-l-4 border-orange-500 dark:border-orange-400 text-slate-900 dark:text-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 block mb-1">
                Core Takeaway
              </span>
              <p className="text-xs sm:text-sm leading-relaxed">
                {resp.quickAnswer}
              </p>
            </div>
          )}

          {/* 2. Detailed Explanation */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Conceptual Explanation
            </span>
            <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
              {resp?.explanation || message.content}
            </div>
          </div>

          {/* 3. Real-World Analogy */}
          {hasAnalogy && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Real-World Intuition & Analogy</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100/90 leading-relaxed">
                {resp?.analogy}
              </p>
            </div>
          )}

          {/* 4. Execution Flow / Step-by-Step */}
          {hasSteps && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <ListOrdered className="w-4 h-4 text-orange-600" />
                <span>Step-by-Step Process</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {resp?.stepByStep.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Code & Mechanism */}
          {hasExample && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-orange-600" />
                  <span>Technical Implementation / Mechanism</span>
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(resp?.example || '', message.id + '_code')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedMsgId === message.id + '_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-orange-600" />
                      <span>Copied snippet</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 p-4 font-mono text-xs sm:text-[13px] overflow-x-auto shadow-inner">
                <pre className="whitespace-pre-wrap leading-relaxed">{resp?.example}</pre>
              </div>
            </div>
          )}

          {/* 6. Preserved Technical Terms (Bilingual Glossary Cards) */}
          {hasTerms && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Interview Vocabulary (Preserved in English)</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Retained for technical placements
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resp?.technicalTerms.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm text-orange-700 dark:text-orange-400">
                        {t.term}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {message.targetLanguage}: <strong className="text-slate-700 dark:text-slate-200">{t.translation}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Common Pitfalls & Exam Traps */}
          {hasMisconceptions && (
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Common Student Misconceptions & Exam Pitfalls</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-100/90 pl-1">
                {resp?.misconceptions.map((misc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{misc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Adaptive Follow-up Prompt Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-400 mr-1">
              Ask follow-up:
            </span>
            <button
              type="button"
              onClick={() => onAskFollowUp(conceptTitle, 'SIMPLIFY')}
              disabled={loading}
              className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-orange-400 dark:hover:border-orange-600 transition-colors cursor-pointer"
            >
              🌱 Simplify Concept
            </button>
            <button
              type="button"
              onClick={() => onAskFollowUp(conceptTitle, 'EXPLAIN_DEEPER')}
              disabled={loading}
              className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-orange-400 dark:hover:border-orange-600 transition-colors cursor-pointer"
            >
              🔬 Deep Mechanism
            </button>
            <button
              type="button"
              onClick={() => onAskFollowUp(conceptTitle, 'ANALOGY')}
              disabled={loading}
              className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-orange-400 dark:hover:border-orange-600 transition-colors cursor-pointer"
            >
              💡 Another Analogy
            </button>
          </div>

          <button
            type="button"
            onClick={() => onTakeQuiz(conceptTitle)}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
          >
            <span>Take quiz on this</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
