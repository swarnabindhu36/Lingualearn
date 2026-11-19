import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Terminology, SUPPORTED_LANGUAGES, SUPPORTED_SUBJECTS } from '../types';
import {
  Languages,
  Search,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  AlertCircle,
  Code2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Terminal,
  FileCode,
  Layers,
  Lightbulb,
  Globe,
} from 'lucide-react';

const SUGGESTED_TERMS = [
  'Semaphore',
  'Deadlock',
  'Mutex',
  'Virtual Memory',
  'B-Tree Indexing',
  'ACID Properties',
  'Garbage Collection',
  'TCP/IP',
  'Buffer Overflow',
  'Polymorphism',
  'Overfitting',
  'Socket',
];

/**
 * Automatically detects the Indian regional language script from user text input.
 */
const detectLanguageFromInput = (val: string): string | null => {
  if (!val) return null;
  if (/[\u0C00-\u0C7F]/.test(val)) return 'Telugu';
  if (/[\u0900-\u097F]/.test(val)) return 'Hindi';
  if (/[\u0B80-\u0BFF]/.test(val)) return 'Tamil';
  if (/[\u0C80-\u0CFF]/.test(val)) return 'Kannada';
  if (/[\u0980-\u09FF]/.test(val)) return 'Bengali';
  if (/[\u0A80-\u0AFF]/.test(val)) return 'Gujarati';
  if (/[\u0A00-\u0A7F]/.test(val)) return 'Punjabi';
  if (/[\u0D00-\u0D7F]/.test(val)) return 'Malayalam';
  return null;
};

export const TerminologyPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'RESEARCHER';
  const userPreferred = user?.preferredLanguage || 'Telugu';

  const [terms, setTerms] = useState<Terminology[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(userPreferred);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Request Any Technical Term State
  const [requestInput, setRequestInput] = useState('');
  const [requestLanguage, setRequestLanguage] = useState(userPreferred);
  const [requestSubject, setRequestSubject] = useState('Operating Systems');
  const [requestingTerm, setRequestingTerm] = useState(false);
  const [requestedTermResult, setRequestedTermResult] = useState<Terminology | null>(null);
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null);
  const [requestFeedbackType, setRequestFeedbackType] = useState<'success' | 'error'>('success');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Language display toggles (Preferred Language vs English)
  const [spotlightLanguageMode, setSpotlightLanguageMode] = useState<'preferred' | 'english'>('preferred');
  const [cardLangMode, setCardLangMode] = useState<Record<string, 'preferred' | 'english'>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Terminology | null>(null);
  const [formError, setFormError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form fields
  const [englishTerm, setEnglishTerm] = useState('');
  const [language, setLanguage] = useState(userPreferred);
  const [preferredTranslation, setPreferredTranslation] = useState('');
  const [alternativeTranslations, setAlternativeTranslations] = useState('');
  const [doNotTranslate, setDoNotTranslate] = useState(true);
  const [subject, setSubject] = useState('Operating Systems');
  const [explanation, setExplanation] = useState('');
  const [explanationEn, setExplanationEn] = useState('');
  const [technicalMeaning, setTechnicalMeaning] = useState('');
  const [technicalMeaningEn, setTechnicalMeaningEn] = useState('');
  const [technicalExample, setTechnicalExample] = useState('');

  const loadTerms = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.getTerminology({
        search: search || undefined,
        subject: selectedSubject || undefined,
        language: selectedLanguage || undefined,
      });
      setTerms(data);
    } catch (err) {
      console.error('Failed to load terminology:', err);
      setLoadError(`Could not load glossary terms: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
  }, [selectedSubject, selectedLanguage]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) {
      loadTerms();
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      const scriptLang = detectLanguageFromInput(query);
      const targetLang =
        scriptLang ||
        (selectedLanguage && selectedLanguage !== 'ALL' ? selectedLanguage : null) ||
        requestLanguage ||
        (userPreferred && userPreferred !== 'English' ? userPreferred : 'Telugu');

      if (scriptLang && scriptLang !== selectedLanguage) {
        setSelectedLanguage(scriptLang);
        setRequestLanguage(scriptLang);
      }

      const data = await api.getTerminology({
        search: query,
        subject: selectedSubject || undefined,
        language: targetLang,
      });

      if (data && data.length > 0) {
        setTerms(data);
        setRequestedTermResult(data[0]);
        setSpotlightLanguageMode('preferred');
        setRequestFeedbackType('success');
        setRequestFeedback(
          `Found "${data[0].englishTerm}" in ${data[0].language} with technical definition and code example.`
        );
      } else {
        // If user searched for a specific term and no match was found in the selected language,
        // automatically generate or look up the definition in their preferred language!
        await handleRequestTerm(query);
      }
    } catch (err) {
      console.error('Failed to load terminology:', err);
      setLoadError(`Could not load glossary terms: ${err instanceof Error ? err.message : 'Please try again.'}`);
      setRequestFeedbackType('error');
      setRequestFeedback(`Glossary search failed: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTerm = async (termToRequest?: string) => {
    const term = (termToRequest || requestInput).trim();
    if (!term) return;

    // Detect if the term was typed in an Indian regional script
    const scriptLang = detectLanguageFromInput(term);
    const targetLang =
      scriptLang ||
      (selectedLanguage && selectedLanguage !== 'ALL' ? selectedLanguage : null) ||
      requestLanguage ||
      (userPreferred && userPreferred !== 'English' ? userPreferred : 'Telugu');

    setRequestingTerm(true);
    setRequestFeedback(null);
    try {
      const res = await api.requestTechnicalTerm({
        term,
        language: targetLang,
        subject: requestSubject,
      });

      if (res && res.term) {
        setLoadError(null);
        setRequestedTermResult(res.term);
        setSpotlightLanguageMode('preferred');
        setRequestFeedbackType('success');
        setRequestFeedback(
          res.message ||
            `Technical definition & practical example for "${res.term.englishTerm}" retrieved in ${res.term.language}!`
        );

        // Prepend or update term in state
        setTerms((prev) => {
          const exists = prev.some((t) => t.id === res.term.id);
          if (exists) {
            return prev.map((t) => (t.id === res.term.id ? res.term : t));
          }
          return [res.term, ...prev];
        });
      }
    } catch (err: any) {
      console.error('Failed to request term:', err);
      setRequestFeedbackType('error');
      setRequestFeedback(`Error generating technical definition: ${err.message || 'Server error'}`);
    } finally {
      setRequestingTerm(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleOpenAdd = () => {
    setEditingTerm(null);
    setEnglishTerm('');
    setLanguage(userPreferred);
    setPreferredTranslation('');
    setAlternativeTranslations('');
    setDoNotTranslate(true);
    setSubject('Operating Systems');
    setExplanation('');
    setExplanationEn('');
    setTechnicalMeaning('');
    setTechnicalMeaningEn('');
    setTechnicalExample('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Terminology) => {
    setEditingTerm(t);
    setEnglishTerm(t.englishTerm);
    setLanguage(t.language);
    setPreferredTranslation(t.preferredTranslation);
    setAlternativeTranslations(t.alternativeTranslations?.join(', ') || '');
    setDoNotTranslate(t.doNotTranslate);
    setSubject(t.subject);
    setExplanation(t.explanation);
    setExplanationEn(t.explanationEn || '');
    setTechnicalMeaning(t.technicalMeaning || '');
    setTechnicalMeaningEn(t.technicalMeaningEn || '');
    setTechnicalExample(t.technicalExample || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTerminology(id);
      setConfirmDeleteId(null);
      setTerms((prev) => prev.filter((t) => t.id !== id));
      if (requestedTermResult?.id === id) {
        setRequestedTermResult(null);
      }
    } catch (err) {
      console.error('Failed to delete term:', err);
    }
  };

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const altArray = alternativeTranslations
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingTerm) {
        const updated = await api.updateTerminology(editingTerm.id, {
          englishTerm,
          language,
          preferredTranslation,
          alternativeTranslations: altArray,
          doNotTranslate,
          subject,
          explanation,
          explanationEn,
          technicalMeaning,
          technicalMeaningEn,
          technicalExample,
        });
        setTerms((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        if (requestedTermResult?.id === updated.id) {
          setRequestedTermResult(updated);
        }
      } else {
        const created = await api.createTerminology({
          englishTerm,
          language,
          preferredTranslation,
          alternativeTranslations: altArray,
          doNotTranslate,
          subject,
          explanation,
          explanationEn,
          technicalMeaning,
          technicalMeaningEn,
          technicalExample,
        });
        setTerms((prev) => [created, ...prev]);
        setRequestedTermResult(created);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save terminology entry');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            Technical Terminology Glossary
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curated multilingual dictionary providing formal technical meanings in your preferred language, engineering code examples, and translation preservation rules
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Preserved Term</span>
          </button>
        )}
      </div>

      {/* Feature 1: Request or Ask Technical Meaning & Example */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white shadow-xl space-y-4 border border-slate-700/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multilingual Technical Meaning & Example Engine</span>
          </div>
          <span className="text-xs text-slate-300">
            Search or ask in any language to receive in-depth definitions in your preferred language
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Request or Look Up Technical Meaning of Any Word
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Every technical term searched or requested generates a rigorous computing definition in your chosen language, a practical code snippet, and translation preservation guidance.
          </p>
        </div>

        {/* Input Bar & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={requestInput}
              onChange={(e) => {
                const val = e.target.value;
                setRequestInput(val);
                const detected = detectLanguageFromInput(val);
                if (detected) {
                  setRequestLanguage(detected);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleRequestTerm();
                }
              }}
              placeholder="Type any word in English or regional script (e.g. సెమాఫోర్, Semaphore, Mutex, Deadlock, ACID, B-Tree)..."
              className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={requestLanguage}
              onChange={(e) => setRequestLanguage(e.target.value)}
              className="w-full h-full px-3 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.name}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={requestSubject}
              onChange={(e) => setRequestSubject(e.target.value)}
              className="w-full h-full px-3 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {SUPPORTED_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={() => handleRequestTerm()}
              disabled={requestingTerm || !requestInput.trim()}
              className="w-full h-full py-3 px-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {requestingTerm ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Term</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Quick Suggestions:</span>
          {SUGGESTED_TERMS.map((term) => (
            <button
              key={term}
              onClick={() => {
                setRequestInput(term);
                handleRequestTerm(term);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 text-[11px] transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {requestFeedback && (
          <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
            requestFeedbackType === 'error'
              ? 'bg-rose-500/15 border border-rose-500/40 text-rose-200'
              : 'bg-orange-500/20 border border-orange-500/40 text-orange-100'
          }`}>
            <div className="flex items-center gap-2">
              {requestFeedbackType === 'error'
                ? <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                : <CheckCircle2 className="w-4 h-4 text-orange-300 shrink-0" />}
              <span>{requestFeedback}</span>
            </div>
            <button
              onClick={() => setRequestFeedback(null)}
              className="text-current hover:text-white text-xs ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Spotlight Showcase of Recently Requested Term */}
        {requestedTermResult && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-800/90 border border-orange-500/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 px-2.5 py-0.5 rounded-full bg-orange-500/20">
                  Featured Definition
                </span>
                <h3 className="text-lg font-bold text-white">{requestedTermResult.englishTerm}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-200">
                  {requestedTermResult.subject}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-orange-900/60 text-orange-300 border border-orange-700 font-medium">
                  {requestedTermResult.preferredTranslation}
                </span>
              </div>
            </div>

            {/* Technical Meaning with Multilingual Toggle */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-300 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Technical Meaning</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    🌐 {requestedTermResult.language} Response
                  </span>
                </div>
                {(requestedTermResult.technicalMeaningEn || requestedTermResult.explanationEn) && (
                  <div className="flex items-center gap-1 text-[11px] bg-slate-900/80 p-0.5 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setSpotlightLanguageMode('preferred')}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                        spotlightLanguageMode === 'preferred'
                          ? 'bg-orange-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {requestedTermResult.language}
                    </button>
                    <button
                      onClick={() => setSpotlightLanguageMode('english')}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                        spotlightLanguageMode === 'english'
                          ? 'bg-orange-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/80 font-sans">
                {spotlightLanguageMode === 'preferred'
                  ? requestedTermResult.technicalMeaning || requestedTermResult.explanation
                  : requestedTermResult.technicalMeaningEn || requestedTermResult.technicalMeaning}
              </p>
            </div>

            {/* Technical Example */}
            {requestedTermResult.technicalExample && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Practical Example & Code Implementation</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(requestedTermResult.technicalExample!, `spotlight-${requestedTermResult.id}`)
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedKey === `spotlight-${requestedTermResult.id}` ? (
                      <>
                        <Check className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-orange-300 overflow-x-auto border border-slate-800 leading-relaxed">
                  <pre>{requestedTermResult.technicalExample}</pre>
                </div>
              </div>
            )}

            {/* Preservation Note */}
            <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-900/60 text-xs text-orange-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">
                  Why this term must be preserved ({requestedTermResult.language}):{' '}
                </span>
                {spotlightLanguageMode === 'preferred'
                  ? requestedTermResult.explanation
                  : requestedTermResult.explanationEn || requestedTermResult.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Callout */}
      <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/60 text-xs text-orange-900 dark:text-orange-200 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
        <span className="leading-snug">
          Technical definitions are provided in your preferred regional language with core keywords, syntax, and APIs preserved in standard Computer Science nomenclature for academic mastery.
        </span>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              const detected = detectLanguageFromInput(val);
              if (detected) {
                setSelectedLanguage(detected);
              }
            }}
            placeholder="Search glossary by English term, regional script (e.g. సెమాఫోర్, Deadlock, Mutex, Thread, TCP)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="">All Subjects ({SUPPORTED_SUBJECTS.length})</option>
            {SUPPORTED_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedLanguage(val);
              if (val) setRequestLanguage(val);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-orange-700 dark:text-orange-400"
          >
            <option value="">All Languages ({SUPPORTED_LANGUAGES.length})</option>
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.name}>
                {l.name} ({l.nativeName})
              </option>
            ))}
          </select>

          {(selectedSubject || selectedLanguage || search) && (
            <button
              onClick={() => {
                setSelectedSubject('');
                setSelectedLanguage('');
                setSearch('');
              }}
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline ml-auto font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Terminology Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading technical terminology glossary...</span>
        </div>
      ) : loadError ? (
        <div role="alert" className="p-6 text-center rounded-3xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm">
          {loadError}
        </div>
      ) : terms.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 space-y-4">
          <p className="text-xs sm:text-sm">
            No stored terminology entries found matching "{search || 'all'}" in{' '}
            {selectedLanguage || 'all languages'}.
          </p>
          {search && (
            <button
              onClick={() => handleRequestTerm(search)}
              disabled={requestingTerm}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {requestingTerm
                  ? 'Generating...'
                  : `Generate Technical Meaning for "${search}" in ${selectedLanguage || userPreferred}`}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {terms.map((t) => (
            <div
              key={t.id}
              className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {t.englishTerm}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                      <span className="font-semibold text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60">
                        {t.preferredTranslation}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{t.language}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{t.subject}</span>
                    </div>
                  </div>

                  {t.doNotTranslate && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0">
                      Preserve Term
                    </span>
                  )}
                </div>

                {/* 1. Technical Meaning Section with Language Toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Technical Meaning</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                        {t.language}
                      </span>
                    </div>
                    {t.technicalMeaningEn && (
                      <div className="flex items-center gap-1 text-[10px] bg-slate-200 dark:bg-slate-900 p-0.5 rounded-md">
                        <button
                          onClick={() => setCardLangMode((prev) => ({ ...prev, [t.id]: 'preferred' }))}
                          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                            (cardLangMode[t.id] || 'preferred') === 'preferred'
                              ? 'bg-orange-600 text-white font-bold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {t.language}
                        </button>
                        <button
                          onClick={() => setCardLangMode((prev) => ({ ...prev, [t.id]: 'english' }))}
                          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                            cardLangMode[t.id] === 'english'
                              ? 'bg-orange-600 text-white font-bold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          English
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {cardLangMode[t.id] === 'english'
                      ? t.technicalMeaningEn || t.explanationEn || t.technicalMeaning
                      : t.technicalMeaning || t.explanation}
                  </p>
                </div>

                {/* 2. Technical Example / Code Section */}
                {t.technicalExample && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        <Terminal className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                        <span>Engineering Example</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.technicalExample!, `card-code-${t.id}`)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] transition-colors cursor-pointer"
                        title="Copy code snippet"
                      >
                        {copiedKey === `card-code-${t.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-orange-600" />
                            <span className="text-orange-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-orange-400 dark:text-orange-300 overflow-x-auto border border-slate-800 leading-relaxed">
                      <pre>{t.technicalExample}</pre>
                    </div>
                  </div>
                )}

                {/* 3. Pedagogical Rule / Translation Note */}
                <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      Pedagogical Guideline ({t.language}):{' '}
                    </span>
                    {cardLangMode[t.id] === 'english'
                      ? t.explanationEn || t.explanation
                      : t.explanation}
                  </div>
                </div>

                {/* Alternative Translations */}
                {t.alternativeTranslations && t.alternativeTranslations.length > 0 && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5">
                    <span className="font-medium">Approved Synonyms:</span>
                    {t.alternativeTranslations.map((alt, index) => (
                      <span
                        key={`${t.id}-${index}`}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer (Admin controls & Actions) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => {
                      setRequestInput(t.englishTerm);
                      setRequestLanguage(t.language);
                      setRequestedTermResult(t);
                      setSpotlightLanguageMode('preferred');
                      setRequestFeedbackType('success');
                      setRequestFeedback(`Spotlighting "${t.englishTerm}" in ${t.language}.`);
                    }}
                    className="text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Spotlight</span>
                  </button>

                  <a
                    href={`/tutor?q=${encodeURIComponent(`Explain ${t.englishTerm} in ${t.language}`)}&subject=${encodeURIComponent(t.subject)}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-orange-600 font-semibold flex items-center gap-1 ml-2 transition-colors"
                  >
                    <span>Ask Tutor</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${t.englishTerm} (${t.language}) - ${t.technicalMeaning || t.explanation}\n\nExample:\n${t.technicalExample || 'N/A'}`,
                        `full-${t.id}`
                      )
                    }
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Copy full term definition"
                  >
                    {copiedKey === `full-${t.id}` ? (
                      <Check className="w-3.5 h-3.5 text-orange-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit term"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {confirmDeleteId === t.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id)}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete term"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Languages className="w-4 h-4 text-orange-600" />
                <span>{editingTerm ? 'Edit Preserved Term' : 'Add Preserved Term'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTerm} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    English Term *
                  </label>
                  <input
                    type="text"
                    required
                    value={englishTerm}
                    onChange={(e) => setEnglishTerm(e.target.value)}
                    placeholder="e.g. Semaphore"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Language *
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name}>
                        {l.name} ({l.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Translation & Transliteration *
                  </label>
                  <input
                    type="text"
                    required
                    value={preferredTranslation}
                    onChange={(e) => setPreferredTranslation(e.target.value)}
                    placeholder="e.g. Semaphore (సెమాఫోర్)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Domain *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {SUPPORTED_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Technical Meaning Field in Preferred Language */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Meaning (In {language} - with keywords preserved)
                </label>
                <textarea
                  rows={2}
                  value={technicalMeaning}
                  onChange={(e) => setTechnicalMeaning(e.target.value)}
                  placeholder={`Technical definition in ${language} explaining protocols, memory layout, or data structures...`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Technical Meaning Field in English */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Meaning in English (Optional Bilingual Reference)
                </label>
                <textarea
                  rows={2}
                  value={technicalMeaningEn}
                  onChange={(e) => setTechnicalMeaningEn(e.target.value)}
                  placeholder="Formal English computer science definition..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Technical Example Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Example (Code Snippet or Architectural Pattern)
                </label>
                <textarea
                  rows={3}
                  value={technicalExample}
                  onChange={(e) => setTechnicalExample(e.target.value)}
                  placeholder="// Realistic code snippet (C++, Java, Python, SQL) or architecture trace"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 font-mono text-orange-400 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alternative Translations (Comma separated)
                </label>
                <input
                  type="text"
                  value={alternativeTranslations}
                  onChange={(e) => setAlternativeTranslations(e.target.value)}
                  placeholder="e.g. సెమాఫోర్, సమన్వయ వేరియబుల్"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-do-not-translate"
                  checked={doNotTranslate}
                  onChange={(e) => setDoNotTranslate(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-orange-600 focus:ring-orange-500"
                />
                <label
                  htmlFor="chk-do-not-translate"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Strictly preserve term (Do not translate literally into everyday words)
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Educational Explanation / Preservation Reason (In {language}) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder={`Explain in ${language} why this term must be preserved and what error occurs if translated literally...`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Educational Explanation in English (Optional)
                </label>
                <textarea
                  rows={2}
                  value={explanationEn}
                  onChange={(e) => setExplanationEn(e.target.value)}
                  placeholder="English explanation for bilingual learners..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {editingTerm ? 'Save Changes' : 'Create Preserved Term'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
