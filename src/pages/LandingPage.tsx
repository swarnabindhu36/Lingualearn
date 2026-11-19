import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Languages,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  BarChart3,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SUPPORTED_SUBJECTS } from '../types';

export const LandingPage: React.FC = () => {
  const { user, quickLoginAs } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('Telugu');

  const comparisonDemos: Record<string, { direct: string; contextAware: string }> = {
    Telugu: {
      direct:
        'డెడ్‌లాక్ అనేది "చచ్చిన తాళం" లాంటిది. ప్రాసెస్ తాళం వేయబడిన గదిలో దారాలతో (Threads) విద్యుత్ ప్లగ్గుల (Sockets) కోసం వేచి ఉంటుంది. [Semantic Loss: "Dead lock" translated literally into "చచ్చిన తాళం", "Thread" as "దారం", "Socket" as "కరెంట్ ప్లగ్"]',
      contextAware:
        'ఆపరేటింగ్ సిస్టమ్స్ (OS) లో Deadlock అనేది ఒక క్లిష్టమైన పరిస్థితి. రెండు లేదా అంతకంటే ఎక్కువ Processes తాము కోరుకున్న Shared Resources (ఉదా: Memory, Printer) కోసం నిరీక్షిస్తూ నిరవధికంగా ఆగిపోతాయి. ఇక్కడ Thread, Mutex, Semaphore వంటి సాంకేతిక పదాలను మార్చకుండా, వాటి పనితీరును సులభమైన తెలుగులో వివరిస్తాము.',
    },
    Hindi: {
      direct:
        'डेड-लॉक एक "मृत ताला" है। कंप्यूटर में धागा (Thread) बिजली के सॉकेट (Socket) के लिए रुक जाता है और प्रक्रिया पूरी तरह से जाम हो जाती है। [Semantic Loss: Thread translated literally as "धागा", Deadlock as "मृत ताला"]',
      contextAware:
        'ऑपरेटिंग सिस्टम में Deadlock वह स्थिति है जहाँ दो या दो से अधिक Processes उन Shared Resources की प्रतीक्षा करते हुए अनिश्चित काल के लिए रुक जाती हैं जो अन्य प्रक्रियाओं द्वारा अधिग्रहीत हैं। LinguaLearn में Thread, Mutual Exclusion, और Semaphore जैसे तकनीकी शब्दों को मूल रूप में सुरक्षित रखते हुए पूरी अवधारणा को हिंदी में स्पष्ट किया जाता है।',
    },
    Tamil: {
      direct:
        'டெட்லாக் என்பது "இறந்த பூட்டு" ஆகும். கணினியில் நூல் (Thread) சாக்கெட்டுக்காக காத்திருக்கிறது. [Semantic Loss: Thread translated as "நூல்", Socket as "சாக்கெட்"]',
      contextAware:
        'இயக்க முறைமைகளில் (Operating Systems), Deadlock என்பது இரண்டு அல்லது அதற்கு மேற்பட்ட Processes தங்களுக்கு தேவையான Shared Resources கிடைக்கும் வரை காலவரையின்றி காத்திருக்கும் நிலையாகும். இதில் Thread, Lock, மற்றும் Semaphore போன்ற தொழில்நுட்ப சொற்கள் பாதுகாக்கப்படுகின்றன.',
    },
  };

  const activeDemo = comparisonDemos[selectedLanguage] || comparisonDemos['Telugu'];

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="pt-6 pb-8 sm:pt-10 sm:pb-12 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/80 text-orange-700 dark:text-orange-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multilingual CS AI Learning Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight text-balance">
          Master Computer Science in{' '}
          <span className="text-orange-600 dark:text-orange-400">Your Native Language</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An adaptive AI tutor for Engineering students that explains complex concepts clearly in Indian languages
          while <strong className="font-semibold text-slate-900 dark:text-white">strictly preserving technical terms</strong>.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to={user ? '/tutor' : '/register'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-orange-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Tutor</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <Link
            to="/terminology"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Languages className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Browse Terminology</span>
          </Link>

          <Link
            to="/evaluation"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold text-sm sm:text-base hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Research Study</span>
          </Link>
        </div>

        {/* Fast Account Toggles */}
        {!user && (
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Instant Demo:</span>
            <button
              onClick={() => quickLoginAs('student')}
              className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
            >
              Log in as Student
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => quickLoginAs('admin')}
              className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
            >
              Log in as Researcher
            </button>
          </div>
        )}

        {/* Visual Hero Showcase Banner */}
        <div className="mt-10 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
          <img
            src="/src/assets/images/hero_multilingual_learning_1790351321553.jpg"
            alt="Students collaborating with multilingual computer science AI interface"
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[460px] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-left text-white max-w-xl">
              <span className="text-xs uppercase tracking-wider text-orange-400 font-bold block mb-1">
                Context-Aware Translation Architecture
              </span>
              <p className="text-sm sm:text-base text-slate-200 font-medium">
                Bridge language barriers in B.Tech engineering classrooms without sacrificing foundational terminology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Central Research Comparison Interactive Showcase */}
      <section id="research" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-2xs">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Research Evaluation Focus
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Context-Aware Prompting vs Direct Translation
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Direct translation corrupts technical terms (translating Thread into "धागा" or Socket into "बिजली का प्लग").
            LinguaLearn preserves technical vocabulary while explaining in fluent Indian languages.
          </p>

          {/* Language Selector for Demo */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {['Telugu', 'Hindi', 'Tamil'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedLanguage === lang
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Method A */}
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-rose-600 dark:text-rose-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  Method A: Direct Translation
                </span>
                <span className="text-rose-500">Flawed Output</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 italic">
                Prompt: "What is a Deadlock in Operating Systems?"
              </p>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {activeDemo.direct}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300">
              <span className="font-semibold">Observation:</span> Terminology corruption, student confusion, exam penalty.
            </div>
          </div>

          {/* Method B */}
          <div className="rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-orange-50/40 dark:bg-orange-950/20 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-orange-600 dark:text-orange-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Method B: Context-Aware Prompting
                </span>
                <span className="text-orange-600">Preserved Meaning</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 italic">
                Prompt: "What is a Deadlock in Operating Systems?"
              </p>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-orange-200/60 dark:border-orange-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {activeDemo.contextAware}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-orange-200/60 dark:border-orange-900/40 text-xs text-orange-700 dark:text-orange-300">
              <span className="font-semibold">Observation:</span> High technical fidelity, preserved CS keywords, natural syntax.
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/evaluation"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
          >
            <span>Review all 30+ formal evaluation cases with 5-point Likert ratings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Technical Academic Rigor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            A complete educational system combining Transformer NLP, canonical terminology catalogs, and interactive assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Context-Aware AI Tutor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Provides bilingual explanations, concrete code examples in Java/C++, and everyday real-world analogies.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Preserved CS Terminology
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Maintains standardized Computer Science keywords with regional pronunciation guides and strict non-translation constraints.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Automated Quiz Assessments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dynamically evaluates understanding through multiple choice and conceptual questions presented in regional scripts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
