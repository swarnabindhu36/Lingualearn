import { db } from '../db/database';
import { Terminology } from '../db/schema';
import { getGeminiClient, generateContentWithRetry, safeParseJson } from '../ai/gemini';

export interface TermLookupResult {
  term: Terminology;
  isNewlyCreated: boolean;
  source: 'database' | 'gemini' | 'canonical_knowledge_base';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Detects the Indian regional language from Unicode script blocks.
 */
export function detectLanguageFromScript(text: string): string | null {
  if (!text) return null;
  if (/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'Kannada';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'Malayalam';
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'Gujarati';
  if (/[\u0A00-\u0A7F]/.test(text)) return 'Punjabi';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi'; // Devanagari default to Hindi
  return null;
}

interface CanonicalTermDef {
  englishTerm: string;
  subject: string;
  aliases: string[];
  technicalMeaningByLanguage: Record<string, string>;
  explanationByLanguage: Record<string, string>;
  transliterations: Record<string, string>;
  technicalMeaningEn: string;
  explanationEn: string;
  technicalExample: string;
}

/**
 * Built-in canonical CS terminology repository covering fundamental Computer Science domains.
 * Provides authentic, high-quality technical definitions in Telugu, Hindi, Tamil, Kannada, Bengali,
 * Marathi, Gujarati, Punjabi, Malayalam, and English, along with practical engineering examples.
 */
const CANONICAL_CS_TERMS: Record<string, CanonicalTermDef> = {
  semaphore: {
    englishTerm: 'Semaphore',
    subject: 'Operating Systems',
    aliases: ['semaphore', 'సెమాఫోర్', 'సేమాఫోర్', 'సమన్వయ వేరియబుల్', 'सेमाफोर', 'செமஃபோர்', 'ಸೆಮಾಫೋರ್', 'সেমাফোর'],
    technicalMeaningEn:
      'A Semaphore is a protected synchronization variable or abstract data type used to manage concurrent access to a finite number of shared system resources. It maintains an integer counter controlled exclusively by atomic operations: wait() (or P(), decrementing the count and blocking if negative) and signal() (or V(), incrementing count and waking waiting processes).',
    explanationEn:
      'Preserve "Semaphore" in English or transliteration. Never translate as railway signal flag (రైల్వే జెండా / संकेत झंडा); in operating systems, it strictly denotes concurrent process synchronization primitives.',
    technicalMeaningByLanguage: {
      Telugu:
        'సెమాఫోర్ (Semaphore) అనేది కాంకరెంట్ కంప్యూటింగ్‌లో పరిమిత సిస్టమ్ వనరులను (Shared Resources) బహుళ ప్రాసెస్‌లు ఒకేసారి ఉపయోగించుకోకుండా సమన్వయం చేసే ఒక రక్షిత వేరియబుల్ (Synchronization Primitive). ఇది రెండు పరమాణు చర్యల (Atomic Operations) ద్వారా నియంత్రించబడే పూర్ణాంక కౌంటర్‌ను కలిగి ఉంటుంది: wait() లేదా P() (కౌంటర్‌ను తగ్గిస్తుంది, 0 కంటే తక్కువైతే ప్రాసెస్‌ను నిరోధిస్తుంది) మరియు signal() లేదా V() (కౌంటర్‌ను పెంచి వేచి ఉన్న ప్రాసెస్‌లను మేల్కొల్పుతుంది).',
      Hindi:
        'सेमाफोर (Semaphore) समवर्ती संगणना (Concurrent Computing) में एक संरक्षित सिंक्रोनाइज़ेशन प्रिमिटिव है जिसका उपयोग सीमित साझा सिस्टम संसाधनों तक पहुँच को नियंत्रित करने के लिए किया जाता है। यह विशेष रूप से दो एटॉमिक ऑपरेशनों द्वारा नियंत्रित एक पूर्णांक काउंटर बनाए रखता है: wait() या P() (काउंटर को घटाता है और शून्य से कम होने पर प्रोसेस को ब्लॉक करता है) और signal() या V() (काउंटर को बढ़ाता है और प्रतीक्षा कर रहे प्रोसेस को सक्रिय करता है)।',
      Tamil:
        'செமஃபோர் (Semaphore) என்பது ஒரே நேரத்தில் இயங்கும் பல செயல்முறைகளுக்கு (Concurrent Processes) இடையே பகிரப்பட்ட கணினி வளங்களை சீராக நிர்வகிக்க பயன்படும் ஒரு ஒத்திசைவு மாறி (Synchronization Variable) ஆகும். இது wait() மற்றும் signal() ஆகிய இரண்டு அணுநிலை செயல்பாடுகளால் (Atomic Operations) மட்டுமே கட்டுப்படுத்தப்படுகிறது.',
      Kannada:
        'ಸೆಮಾಫೋರ್ (Semaphore) ಎಂಬುದು ಸಮಕಾಲೀನ ಕಂಪ್ಯೂಟಿಂಗ್‌ನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸಿಸ್ಟಮ್ ಸಂಪನ್ಮೂಲಗಳಿಗೆ ಸಮವರ್ತಿ ಪ್ರವೇಶವನ್ನು ನಿಯಂತ್ರಿಸಲು ಬಳಸಲಾಗುವ ಸಿಂಕ್ರೊನೈಸೇಶನ್ ಪ್ರಿಮಿಟಿವ್ ಆಗಿದೆ. ಇದು ಕೇವಲ wait() ಮತ್ತು signal() ಕಾರ್ಯಾಚರಣೆಗಳ ಮೂಲಕ ನಿಯಂತ್ರಿಸಲ್ಪಡುವ ಪೂರ್ಣಾಂಕ ಕೌಂಟರ್ ಅನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ.',
      Bengali:
        'সেমাফোর (Semaphore) হলো সমবর্তী কম্পিউটিংয়ে একটি সুরক্ষিত সিনক্রোনাইজেশন ভেরিয়েবল যা শেয়ার্ড সিস্টেম রিসোর্সগুলিতে একাধিক প্রসেসের একযোগে অ্যাক্সেস নিয়ন্ত্রণ করে। এটি wait() এবং signal() পারমাণবিক অপারেশনের মাধ্যমে পরিচালিত একটি পূর্ণসংখ্যার কাউন্টার বজায় রাখে।',
      Marathi:
        'सेमाफोर (Semaphore) ही कॉन्करंट कॉम्प्युटिंगमधील एक सिंक्रोनायझेशन प्रिमिटिव्ह आहे जी सिस्टिम रिसोर्सेसचा एकाच वेळी अनेक प्रोसेसेसकडून होणारा वापर नियंत्रित करते. हे wait() आणि signal() या अ‍ॅटॉमिक ऑपरेशन्सद्वारे नियंत्रित होणारा पूर्णांक काउंटर राखते.',
      Gujarati:
        'સેમાફોર (Semaphore) એ કોન્કરન્ટ કમ્પ્યુટિંગમાં એક સુરક્ષિત સિંક્રોનાઇઝેશન પ્રિમિટિવ છે જે શેર કરેલ સિસ્ટમ સંસાધનો સુધી બહુવિધ પ્રક્રિયાઓના પ્રવેશને નિયંત્રિત કરે છે. તે wait() અને signal() એટોમિક ઓપરેશન્સ દ્વારા નિયંત્રિત ઇન્ટિજર કાઉન્ટર જાળવી રાખે છે.',
      Punjabi:
        'ਸੇਮਾਫੋਰ (Semaphore) ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਵਿੱਚ ਇੱਕ ਸਮਕਾਲੀਕਰਨ (Synchronization) ਵੇਰੀਏਬਲ ਹੈ ਜੋ ਸਾਂਝੇ ਸਿਸਟਮ ਸਰੋਤਾਂ ਤੱਕ ਪ੍ਰਕਿਰਿਆਵਾਂ ਦੀ ਪਹੁੰਚ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ। ਇਹ wait() ਅਤੇ signal() ਓਪਰੇਸ਼ਨਾਂ ਰਾਹੀਂ ਇੱਕ ਪੂਰਨ ਅੰਕ ਕਾਊਂਟਰ ਚਲਾਉਂਦਾ ਹੈ।',
      Malayalam:
        'സെമാഫോർ (Semaphore) എന്നത് ഒരേസമയം പ്രവർത്തിക്കുന്ന പ്രക്രിയകൾക്കിടയിൽ സിസ്റ്റം വിഭവങ്ങൾ സുരക്ഷിതമായി പങ്കിടുന്നതിനായി ഉപയോഗിക്കുന്ന ഒരു സിൻക്രണൈസേഷൻ വേരിയബിളാണ്. ഇത് wait(), signal() എന്നീ രണ്ട് പ്രവർത്തനങ്ങളാൽ നിയന്ത്രിക്കപ്പെടുന്നു.',
    },
    explanationByLanguage: {
      Telugu:
        'Semaphore పదాన్ని సాంకేతిక ఇంగ్లీష్ లేదా సెమాఫోర్ లిప్యంతరీకరణలోనే వాడాలి. దీన్ని రైల్వే జెండా లేదా సంకేత జెండా అని అనువదించకూడదు; ఆపరేటింగ్ సిస్టమ్‌లో ఇది కాంకరెంట్ ప్రాసెస్ సింక్రొనైజేషన్ సాధనం.',
      Hindi:
        'Semaphore को हमेशा तकनीकी अंग्रेज़ी या सेमाफोर के रूप में ही सुरक्षित रखें। इसका अनुवाद कभी भी "संकेत झंडा" न करें; ऑपरेटिंग सिस्टम में यह केवल समवर्ती प्रक्रियाओं के सिंक्रोनाइज़ेशन को दर्शाता है।',
      Tamil:
        'Semaphore என்ற சொல்லை ஆங்கிலத்திலேயே அல்லது செமஃபோர் என்று பயன்படுத்த வேண்டும். தொடர்வண்டி சமிக்ஞை கொடி என்று மொழிபெயர்த்தால் கணினி அறிவியலில் தவறான பொருளைத் தரும்.',
      Kannada:
        'Semaphore ಪದವನ್ನು ತಾಂತ್ರಿಕ ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಸೆಮಾಫೋರ್ ಎಂದು ಬಳಸಬೇಕು. ರೈಲ್ವೆ ಧ್ವಜ ಎಂದು ಭಾಷಾಂತರಿಸುವುದು ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನದಲ್ಲಿ ತಪ್ಪು ಕಲ್ಪನೆ ಮೂಡಿಸುತ್ತದೆ.',
      Bengali:
        'Semaphore শব্দটিকে প্রযুক্তিগত ইংরেজিতে বা সেমাফোর হিসেবে রাখা উচিত। রেলওয়ে সংকেত পতাকা হিসেবে অনুবাদ করা যাবে না।',
      Marathi:
        'Semaphore हा शब्द तांत्रिक इंग्रजीत किंवा सेमाफोर असाच वापरावा. रेल्वे सिग्नल झेंडा असा अनुवाद करू नये.',
      Gujarati:
        'Semaphore શબ્દને તકનીકી અંગ્રેજી અથવા સેમાફોર તરીકે જ જાળવી રાખવો. રેલવે સિગ્નલ ઝંડો એવો અનુવાદ ન કરવો.',
      Punjabi:
        'Semaphore ਸ਼ਬਦ ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਸੇਮਾਫੋਰ ਹੀ ਲਿਖਣਾ ਚਾਹੀਦਾ ਹੈ। ਇਸਨੂੰ ਰੇਲਵੇ ਝੰਡਾ ਨਹੀਂ ਅਨੁਵਾਦਿਆ ਜਾਣਾ ਚਾਹੀਦਾ।',
      Malayalam:
        'Semaphore എന്ന വാക്ക് സാങ്കേതിക ഇംഗ്ലീഷിലോ സെമാഫോർ എന്നോ തന്നെ ഉപയോഗിക്കണം. റെയിൽവേ പതാക എന്ന് പരിഭാഷപ്പെടുത്തരുത്.',
    },
    transliterations: {
      Telugu: 'Semaphore (సెమాఫోర్ - సమన్వయ వేరియబుల్)',
      Hindi: 'Semaphore (सेमाफोर - सिंक्रोनाइज़ेशन वेरिएबल)',
      Tamil: 'Semaphore (செமஃபோர்)',
      Kannada: 'Semaphore (ಸೆಮಾಫೋರ್)',
      Bengali: 'Semaphore (সেমাফোর)',
      Marathi: 'Semaphore (सेमाफोर)',
      Gujarati: 'Semaphore (સેમાફોર)',
      Punjabi: 'Semaphore (ਸੇਮਾਫੋਰ)',
      Malayalam: 'Semaphore (സെമാഫോർ)',
    },
    technicalExample: `// POSIX Counting Semaphore in C
#include <semaphore.h>
#include <pthread.h>
#include <stdio.h>

sem_t resource_pool;

void* worker(void* arg) {
    sem_wait(&resource_pool); // Decrements counter; blocks if 0 (కౌంటర్‌ను తగ్గిస్తుంది)
    // === Critical Section: Accessing limited shared DB connection pool ===
    printf("Thread acquired slot in shared pool\\n");
    sem_post(&resource_pool); // Increments counter; signals waiting thread
    return NULL;
}

int main() {
    sem_init(&resource_pool, 0, 3); // 3 concurrent slots available
    // Spawn threads...
    sem_destroy(&resource_pool);
}`,
  },

  mutex: {
    englishTerm: 'Mutex (Mutual Exclusion Lock)',
    subject: 'Operating Systems',
    aliases: ['mutex', 'మ్యూటెక్స్', 'म्यूटेक्स', 'மியூடெக்ஸ்', 'ಮ್ಯೂಟೆಕ್ಸ್', 'মিউটেক্স'],
    technicalMeaningEn:
      'A Mutex (Mutual Exclusion object) is a locking synchronization mechanism that ensures only one thread of execution can enter a critical section at any given time. Unlike counting semaphores, a mutex has ownership semantics: only the specific thread that locked the mutex is permitted to unlock it.',
    explanationEn:
      'Preserve "Mutex" as a technical compound term (Mutual Exclusion). Translating it as "పరస్పర మినహాయింపు తాళం" obscures its multi-threading library implementation (pthread_mutex / std::mutex).',
    technicalMeaningByLanguage: {
      Telugu:
        'మ్యూటెక్స్ (Mutex - Mutual Exclusion Lock) అనేది లాకింగ్ సింక్రొనైజేషన్ మెకానిజం, ఇది ఒకే సమయంలో కేవలం ఒకే ఒక థ్రెడ్ మాత్రమే క్రిటికల్ సెక్షన్‌లోకి (Critical Section) ప్రవేశించేలా హామీ ఇస్తుంది. సెమాఫోర్ లాగా కాకుండా, మ్యూటెక్స్‌కు ఓనర్‌షిప్ (Ownership) లక్షణం ఉంటుంది: అంటే ఏ నిర్దిష్ట థ్రెడ్ అయితే లాక్ చేసిందో, అదే థ్రెడ్ మాత్రమే దానిని అన్‌లాక్ చేయగలదు.',
      Hindi:
        'म्यूटेक्स (Mutex - Mutual Exclusion) एक लॉकिंग सिंक्रोनाइज़ेशन तंत्र है जो यह सुनिश्चित करता है कि एक निश्चित समय पर केवल एक ही थ्रेड क्रिटिकल सेक्शन में प्रवेश कर सके। काउंटिंग सेमाफोर के विपरीत, म्यूटेक्स में स्वामित्व (Ownership) होता है: यानी जिस थ्रेड ने म्यूटेक्स को लॉक किया है, केवल वही इसे अनलॉक कर सकता है।',
      Tamil:
        'மியூடெக்ஸ் (Mutex) என்பது ஒரே நேரத்தில் ஒரு த்ரெட் மட்டுமே கிரிட்டிக்கல் செக்ஷனில் செயல்பட அனுமதிக்கும் பூட்டுதல் ஒத்திசைவு பொறிமுறையாகும். எந்த த்ரெட் பூட்டியதோ அதுவே திறக்க முடியும்.',
      Kannada:
        'ಮ್ಯೂಟೆಕ್ಸ್ (Mutex) ಎಂಬುದು ಲಾಕಿಂಗ್ ಸಿಂಕ್ರೊನೈಸೇಶನ್ ಕಾರ್ಯವಿಧಾನವಾಗಿದ್ದು, ನಿರ್ದಿಷ್ಟ ಸಮಯದಲ್ಲಿ ಕೇವಲ ಒಂದು ಥ್ರೆಡ್ ಮಾತ್ರ ಕ್ರಿಟಿಕಲ್ ಸೆಕ್ಷನ್‌ಗೆ ಪ್ರವೇಶಿಸಲು ಅನುಮತಿಸುತ್ತದೆ.',
      Bengali:
        'মিউটেক্স (Mutex - Mutual Exclusion) হলো একটি লকিং মেকানিজম যা নিশ্চিত করে যে নির্দিষ্ট সময়ে শুধুমাত্র একটি থ্রেড ক্রিটিকাল সেকশনে প্রবেশ করতে পারে।',
      Marathi:
        'म्युटेक्स (Mutex) ही अशी लॉकिंग सिस्टीम आहे जी एका वेळी फक्त एकाच थ्रेडला क्रिटिकल सेक्शनमध्ये प्रवेश करण्याची हमी देते.',
      Gujarati:
        'મ્યુટેક્સ (Mutex) એ લોકીંગ મિકેનિઝમ છે જે ખાતરી કરે છે કે એક સમયે માત્ર એક જ થ્રેડ ક્રિટિકલ સેક્શનમાં പ്രવેશી શકે.',
      Punjabi:
        'ਮਿਊਟੈਕਸ (Mutex) ਇੱਕ ਤਾਲਾਬੰਦੀ ਵਿਧੀ ਹੈ ਜੋ ਇਹ ਯਕੀਨੀ ਬਣਾਉਂਦੀ ਹੈ ਕਿ ਕਿਸੇ ਵੀ ਸਮੇਂ ਸਿਰਫ਼ ਇੱਕ ਥ੍ਰੈੱਡ ਹੀ ਕ੍ਰਿਟੀਕਲ ਸੈਕਸ਼ਨ ਵਿੱਚ ਕੰਮ ਕਰ ਸਕੇ।',
      Malayalam:
        'മ്യൂട്ടെക്സ് (Mutex) എന്നത് ഒരു സമയം ഒരു ത്രെഡിന് മാത്രം നിർണായക വിഭാഗത്തിലേക്ക് (Critical Section) പ്രവേശനം നൽകുന്ന ലോക്കിംഗ് സംവിധാനമാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Mutex ని సాంకేతిక పదంగానే భద్రపరచాలి. "పరస్పర మినహాయింపు తాళం" అని అనువదిస్తే మల్టీ-థ్రెడింగ్ ప్రోగ్రామింగ్ లైబ్రరీలలో (pthread_mutex / std::mutex) గందరగోళం ఏర్పడుతుంది.',
      Hindi:
        'Mutex को हमेशा तकनीकी नाम से ही संबोधित करें। "आपसी अपवर्जन ताला" जैसे अनुवाद प्रोग्रामिंग कोड के संदर्भ को अस्पष्ट कर देते हैं।',
      Tamil:
        'Mutex என்ற சொல்லை நேரடியாகப் பயன்படுத்துங்கள். தமிழ் இலக்கிய மொழிபெயர்ப்பு நிரலாக்கத்தில் குழப்பத்தை உருவாக்கும்.',
      Kannada:
        'Mutex ಪದವನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ, ಅಕ್ಷರಶಃ ಭಾಷಾಂತರವು ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಗ್ರಂಥಾಲಯಗಳ ಬಳಕೆಯಲ್ಲಿ ಗೊಂದಲ ಉಂಟುಮಾಡುತ್ತದೆ.',
      Bengali:
        'Mutex শব্দটি প্রোগ্রামিংয়ে অপরিবর্তিত রাখা প্রয়োজন। আক্ষরিক অনুবাদ কোডিংয়ে বিভ্রান্তি বাড়ায়।',
      Marathi:
        'Mutex शब्द मूळ स्वरूपातच वापरावा, शब्दशः अनुवादाने मल्टी-थ्रेडिंग कोडिंग समजणे कठीण होते.',
      Gujarati:
        'Mutex શબ્દ કોડિંગ લાઇબ્રેરીઓમાં માનક હોવાથી તેને એમ જ રાખવો.',
      Punjabi:
        'Mutex ਨੂੰ ਕੋਡਿੰਗ ਵਿੱਚ ਅਸਲ ਰੂਪ ਵਿੱਚ ਹੀ ਵਰਤਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।',
      Malayalam:
        'Mutex എന്ന പദം മാറ്റമില്ലാതെ ഉപയോഗിക്കണം. അക്ഷരാർത്ഥത്തിലുള്ള വിവർത്തനം തെറ്റിദ്ധാരണ ഉണ്ടാക്കും.',
    },
    transliterations: {
      Telugu: 'Mutex (మ్యూటెక్స్ - పరస్పర మినహాయింపు తాళం)',
      Hindi: 'Mutex (म्यूटेक्स - म्यूचुअल एक्सक्लूज़न लॉक)',
      Tamil: 'Mutex (மியூடெக்ஸ்)',
      Kannada: 'Mutex (ಮ್ಯೂಟೆಕ್ಸ್)',
      Bengali: 'Mutex (মিউটেক্স)',
      Marathi: 'Mutex (म्युटेक्स)',
      Gujarati: 'Mutex (મ્યુટેક્સ)',
      Punjabi: 'Mutex (ਮਿਊਟੈਕਸ)',
      Malayalam: 'Mutex (മ്യൂട്ടെക്സ്)',
    },
    technicalExample: `// C++11 std::mutex Critical Section Protection
#include <iostream>
#include <thread>
#include <mutex>

std::mutex bank_account_mutex;
double account_balance = 1000.0;

void withdraw(double amount) {
    // std::lock_guard automatically locks on entry and unlocks on scope exit (RAII)
    std::lock_guard<std::mutex> lock(bank_account_mutex);
    if (account_balance >= amount) {
        account_balance -= amount;
        std::cout << "Withdrew: " << amount << ", Balance: " << account_balance << "\\n";
    }
}`,
  },

  deadlock: {
    englishTerm: 'Deadlock',
    subject: 'Operating Systems',
    aliases: ['deadlock', 'డెడ్‌లాక్', 'డెడ్ లాక్', 'డేడ్‌లాక్', 'डेडलॉक', 'டெட்லாக்', 'ಡೆಡ್‌ಲಾಕ್', 'ডেডলক'],
    technicalMeaningEn:
      'A Deadlock is an unrecoverable system state in concurrent computing where a set of processes are blocked indefinitely because each process holds a resource and waits for another resource held by another process in the set, simultaneously fulfilling the four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
    explanationEn:
      'Preserve "Deadlock". Literal translations like "మరణించిన తాళం" (dead lock) or "मृत ताला" are completely nonsensical. It describes circular process blocking.',
    technicalMeaningByLanguage: {
      Telugu:
        'డెడ్‌లాక్ (Deadlock) అనేది కాంకరెంట్ కంప్యూటింగ్‌లో ఏర్పడే ఒక సంక్లిష్టమైన స్తంభన పరిస్థితి (Unrecoverable System State). ఇక్కడ రెండు లేదా అంతకంటే ఎక్కువ ప్రాసెస్‌లు ఒకదాని దగ్గర ఉన్న వనరు కోసం మరొకటి ఎదురుచూస్తూ శాశ్వతంగా ఆగిపోతాయి. ఇది కాఫ్‌మన్ షరతులను (Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, మరియు Circular Wait) ఒకేసారి సంతృప్తి పరచడం వల్ల సంభవిస్తుంది.',
      Hindi:
        'डेडलॉक (Deadlock) समवर्ती कंप्यूटिंग में एक ऐसी अपरिवर्तनीय अवरोध स्थिति है जिसमें दो या दो से अधिक प्रक्रियाएं हमेशा के लिए अवरुद्ध हो जाती हैं क्योंकि प्रत्येक प्रक्रिया किसी अन्य प्रक्रिया द्वारा धारण किए गए संसाधन की प्रतीक्षा कर रही होती है। यह कॉफमैन की चारों शर्तों (म्यूचुअल एक्सक्लूजन, होल्ड एंड वेट, नो प्रीमेम्प्शन और सर्कुलर वेट) के एक साथ पूरा होने पर उत्पन्न होता है।',
      Tamil:
        'டெட்லாக் (Deadlock) என்பது ஒரே நேரத்தில் இயங்கும் இரண்டு அல்லது அதற்கு மேற்பட்ட செயல்முறைகள் ஒன்றுக்கொன்று வைத்துள்ள வளங்களுக்காக காத்திருந்து நிரந்தரமாக முடங்கும் நிலையாகும்.',
      Kannada:
        'ಡೆಡ್‌ಲಾಕ್ (Deadlock) ಎಂಬುದು ಕಂಪ್ಯೂಟಿಂಗ್‌ನಲ್ಲಿನ ಒಂದು ಸ್ಥಗಿತ ಸ್ಥಿತಿಯಾಗಿದ್ದು, ಪ್ರಕ್ರಿಯೆಗಳು ಪರಸ್ಪರ ಹಿಡಿದಿರುವ ಸಂಪನ್ಮೂಲಗಳಿಗಾಗಿ ಕಾಯುತ್ತಾ ಶಾಶ್ವತವಾಗಿ ನಿರ್ಬಂಧಿಸಲ್ಪಡುತ್ತವೆ.',
      Bengali:
        'ডেডলক (Deadlock) হলো এমন একটি অচলাবস্থা যেখানে দুই বা ততোধিক প্রসেস একে অপরের কাছে থাকা রিসোর্সের জন্য অনন্তকাল অপেক্ষা করে আটকে থাকে।',
      Marathi:
        'डेडलॉक (Deadlock) ही अशी सिस्टीम स्थिती आहे जिथे दोन किंवा अधिक प्रोसेसेस एकमेकांनी अडवून ठेवलेल्या रिसोर्सेससाठी सतत वाट पाहत थांबून राहतात.',
      Gujarati:
        'ડેડલૉક (Deadlock) એ કમ્પ્યુટિંગમાં એક એવી સ્થિતિ છે જેમાં બે કે તેથી વધુ પ્રક્રિયાઓ એકબીજાના સંસાધનોની રાહ જોવામાં કાયમ માટે અટકી જાય છે.',
      Punjabi:
        'ਡੈਡਲਾਕ (Deadlock) ਇੱਕ ਅਜਿਹੀ ਸਥਿਤੀ ਹੈ ਜਿੱਥੇ ਦੋ ਜਾਂ ਦੋ ਤੋਂ ਵੱਧ ਪ੍ਰਕਿਰਿਆਵਾਂ ਇੱਕ ਦੂਜੇ ਦੇ ਸਰੋਤਾਂ ਦੀ ਉਡੀਕ ਵਿੱਚ ਹਮੇਸ਼ਾ ਲਈ ਰੁਕ ਜਾਂਦੀਆਂ ਹਨ।',
      Malayalam:
        'ഡെഡ്‌ലോക്ക് (Deadlock) എന്നാൽ പ്രക്രിയകൾ പരസ്പരം കൈവശം വെച്ചിരിക്കുന്ന റിസോഴ്സുകൾക്കായി കാത്തിരുന്ന് പ്രവർത്തനം നിലച്ചുപോകുന്ന അവസ്ഥയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        '"Deadlock" పదాన్ని ఎల్లప్పుడూ సాంకేతిక ఇంగ్లీష్ లేదా డెడ్‌లాక్ రూపంలోనే భద్రపరచాలి. "మరణించిన తాళం" అని అనువదిస్తే అర్ధం వికటిస్తుంది. ఇది సర్క్యులర్ వెయిట్ వల్ల ప్రాసెస్‌లు స్తంభించిపోవడాన్ని సూచిస్తుంది.',
      Hindi:
        'Deadlock को हमेशा तकनीकी अंग्रेज़ी में ही रखें। "मृत ताला" जैसा शाब्दिक अनुवाद अर्थहीन है; यह सिस्टम में चक्रीय प्रतीक्षा (Circular Wait) का परिचायक है।',
      Tamil:
        'Deadlock என்ற சொல்லை அப்படியே பயன்படுத்தவும். இறந்த பூட்டு என்று மொழிபெயர்த்தால் தவறான புரிதல் ஏற்படும்.',
      Kannada:
        'Deadlock ಪದವನ್ನು ತಾಂತ್ರಿಕವಾಗಿಯೇ ಇರಿಸಿ, ಸತ್ತ ಬೀಗ ಎಂಬ ಅನುವಾದವು ಹಾಸ್ಯಾಸ್ಪದವಾಗಿರುತ್ತದೆ.',
      Bengali:
        'Deadlock অপরিবর্তিত রাখা বাঞ্ছনীয়। মৃত তালা ধরনের আক্ষরিক অর্থ সম্পূর্ণ অর্থহীন।',
      Marathi:
        'Deadlock तांत्रिक संज्ञेचा शब्दशः अनुवाद करू नये.',
      Gujarati:
        'Deadlock શબ્દને એમને એમ જ રાખવો.',
      Punjabi:
        'Deadlock ਨੂੰ ਤਕਨੀਕੀ ਸ਼ਬਦਾਵਲੀ ਵਜੋਂ ਹੀ ਸੰਭਾਲਣਾ ਜ਼ਰੂਰੀ ਹੈ।',
      Malayalam:
        'Deadlock എന്ന വാക്ക് സാങ്കേതിക പദമായി തന്നെ ഉപയോഗിക്കുക.',
    },
    transliterations: {
      Telugu: 'Deadlock (డెడ్‌లాక్ - నిలిచిపోయిన పరిస్థితి)',
      Hindi: 'Deadlock (डेडलॉक - गतिरोध स्थिति)',
      Tamil: 'Deadlock (டெட்லாக்)',
      Kannada: 'Deadlock (ಡೆಡ್‌ಲಾಕ್)',
      Bengali: 'Deadlock (ডেডলক)',
      Marathi: 'Deadlock (डेडलॉक)',
      Gujarati: 'Deadlock (ડેડલૉક)',
      Punjabi: 'Deadlock (ਡੈਡਲਾਕ)',
      Malayalam: 'Deadlock (ഡെഡ്‌ലോക്ക്)',
    },
    technicalExample: `// Deadlock generation scenario in concurrent C code:
// Thread 1:
pthread_mutex_lock(&lockA);
// Context switch occurs right here...
pthread_mutex_lock(&lockB); // Blocked if Thread 2 acquired lockB!

// Thread 2 (runs concurrently):
pthread_mutex_lock(&lockB);
pthread_mutex_lock(&lockA); // Blocked waiting for Thread 1 to release lockA!
// Circular Wait: Neither thread can ever advance -> Deadlock!`,
  },

  thread: {
    englishTerm: 'Thread',
    subject: 'Operating Systems',
    aliases: ['thread', 'థ్రెడ్', 'थ्रेड', 'த்ரெட்', 'ಥ್ರೆಡ್', 'থ্রেড'],
    technicalMeaningEn:
      'A Thread is the smallest programmable and schedulable unit of processor execution managed by the operating system kernel. Threads that belong to the same parent process share its virtual address space (heap, text, data segments) and file descriptors, but each thread retains its own private Program Counter (PC), CPU registers, and execution call stack.',
    explanationEn:
      'Never translate "Thread" as sewing thread ("ధారము" in Telugu, "धागा" in Hindi). It is an OS computational execution context inside a process.',
    technicalMeaningByLanguage: {
      Telugu:
        'థ్రెడ్ (Thread) అనేది ఆపరేటింగ్ సిస్టమ్ కెర్నల్ ద్వారా షెడ్యూల్ చేయబడే మరియు ప్రాసెసర్ ద్వారా అమలు చేయబడే అతిచిన్న ఎగ్జిక్యూషన్ యూనిట్. ఒకే ప్రాసెస్‌కు చెందిన బహుళ థ్రెడ్‌లు ఆ ప్రాసెస్ యొక్క అడ్రస్ స్పేస్ (హీప్, కోడ్, గ్లోబల్ డేటా) ను పంచుకుంటాయి, కానీ ప్రతి థ్రెడ్‌కు దాని సొంత ప్రోగ్రామ్ కౌంటర్ (PC), CPU రిజిస్టర్‌లు మరియు కాల్ స్టాక్ ఉంటాయి.',
      Hindi:
        'थ्रेड (Thread) ऑपरेटिंग सिस्टम कर्नेल द्वारा शेड्यूल और निष्पादित की जाने वाली सबसे छोटी कम्प्यूटेशनल इकाई है। एक ही पैरेंट प्रोसेस के कई थ्रेड प्रोसेस के वर्चुअल एड्रेस स्पेस (हीप, कोड, ग्लोबल डेटा) को साझा करते हैं, लेकिन प्रत्येक थ्रेड का अपना निजी प्रोग्राम काउंटर (PC), रजिस्टर और कॉल स्टैक होता है।',
      Tamil:
        'த்ரெட் (Thread) என்பது இயக்க முறைமையால் திட்டமிடப்பட்டு இயக்கப்படும் மிகச்சிறிய செயலாக்க அலகு ஆகும். ஒரே செயல்முறையின் பல த்ரெட்கள் அதன் நினைவகத்தைப் பகிர்ந்து கொள்கின்றன.',
      Kannada:
        'ಥ್ರೆಡ್ (Thread) ಎಂಬುದು ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್‌ನಿಂದ ನಿಗದಿಪಡಿಸಲಾದ ಪ್ರೊಸೆಸರ್‌ನ ಅತ್ಯಂತ ಚಿಕ್ಕ ಕಾರ್ಯಗತಗೊಳಿಸುವ ಘಟಕವಾಗಿದೆ.',
      Bengali:
        'থ্রেড (Thread) হলো অপারেটিং সিস্টেম দ্বারা পরিচালিত প্রসেসরের ক্ষুদ্রতম কার্যকর ইউনিট। একই প্রসেসের থ্রেডগুলি মেমরি শেয়ার করে।',
      Marathi:
        'थ्रेड (Thread) हे ऑपरेटिंग सिस्टीमद्वारे शेड्यूल केले जाणारे एक्झिक्युशनचे सर्वात लहान युनिट आहे.',
      Gujarati:
        'થ્રેડ (Thread) એ ઓપરેટિંગ સિસ્ટમ દ્વારા સંચાલિત પ્રોસેસરનું સૌથી નાનું એક્ઝિક્યુશન યુનિટ છે.',
      Punjabi:
        'ਥ੍ਰੈੱਡ (Thread) ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦੁਆਰਾ ਚਲਾਇਆ ਜਾਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ਐਗਜ਼ੀਕਿਊਸ਼ਨ ਯੂਨਿਟ ਹੈ।',
      Malayalam:
        'ത്രെഡ് (Thread) എന്നത് ഓപ്പറേറ്റിംഗ് സിസ്റ്റം ഷെഡ്യൂൾ ചെയ്യുന്ന ഏറ്റവും ചെറിയ എക്സിക്യൂഷൻ യൂണിറ്റാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        '"Thread" పదాన్ని ఎప్పుడూ కుట్టు దారము అని అనువదించకూడదు. కంప్యూటర్ సైన్స్‌లో థ్రెడ్ అనేది ప్రాసెస్ లోపల నడిచే స్వతంత్ర కంప్యూటేషనల్ ఎగ్జిక్యూషన్ పాత్.',
      Hindi:
        'Thread का अनुवाद कभी भी सिलाई का "धागा" न करें। यह ऑपरेटिंग सिस्टम में प्रोसेस के अंदर चलने वाली स्वतंत्र निष्पादन इकाई है।',
      Tamil:
        'Thread-ஐ தையல் நூல் என்று மொழிபெயர்க்கக் கூடாது. இது மென்பொருள் இயக்கப் பிரிவாகும்.',
      Kannada:
        'Thread ಪದವನ್ನು ಹೊಲಿಗೆ ದಾರ ಎಂದು ಕರೆಯಬಾರದು. ಇದು ಪ್ರೋಗ್ರಾಮಿಂಗ್‌ನ ಚಿಕ್ಕ ಕಾರ್ಯ ಘಟಕ.',
      Bengali:
        'Thread-কে কখনো সেলাইয়ের সুতো ভাবা যাবে না। এটি কম্পিউটিংয়ের একটি এক্সিকিউশন ইউনিট।',
      Marathi:
        'Thread चा अर्थ शिवणाचा दोरा असा करू नये, ही संगणकीय प्रक्रिया आहे.',
      Gujarati:
        'Thread નો અર્થ સિલાઈનો દોરો ન કરવો.',
      Punjabi:
        'Thread ਨੂੰ ਸਿਲਾਈ ਵਾਲਾ ਧਾਗਾ ਨਾ ਸਮਝੋ, ਇਹ ਕੰਪਿਊਟਰ ਪ੍ਰਕਿਰਿਆ ਦੀ ਇਕਾਈ ਹੈ।',
      Malayalam:
        'Thread-നെ തയ്യൽ നൂൽ എന്ന് അർത്ഥമാക്കരുത്. ഇത് കമ്പ്യൂട്ടേഷണൽ യൂണിറ്റാണ്.',
    },
    transliterations: {
      Telugu: 'Thread (థ్రెడ్ - అతిచిన్న ఎగ్జిక్యూషన్ యూనిట్)',
      Hindi: 'Thread (थ्रेड - निष्पादन की सबसे छोटी इकाई)',
      Tamil: 'Thread (த்ரெட்)',
      Kannada: 'Thread (ಥ್ರೆಡ್)',
      Bengali: 'Thread (থ্রেড)',
      Marathi: 'Thread (थ्रेड)',
      Gujarati: 'Thread (થ્રેડ)',
      Punjabi: 'Thread (ਥਰਿੱਡ)',
      Malayalam: 'Thread (ത്രെഡ്)',
    },
    technicalExample: `// Python Multi-Threading Example
import threading
import time

def compute_chunk(worker_id):
    print(f"Thread-{worker_id} executing task...")
    time.sleep(1)

# Spawning 3 concurrent lightweight execution threads
threads = [threading.Thread(target=compute_chunk, args=(i,)) for i in range(3)]
for t in threads: t.start()
for t in threads: t.join() # Wait for all threads to complete`,
  },

  'virtual memory': {
    englishTerm: 'Virtual Memory',
    subject: 'Operating Systems',
    aliases: ['virtual memory', 'వర్చువల్ మెమరీ', 'वर्चुअल मेमोरी', 'വിർച്വൽ മെമ്മറി', 'ವರ್ಚುವಲ್ ಮೆಮೊರಿ'],
    technicalMeaningEn:
      'Virtual Memory is an operating system storage allocation scheme that abstracts physical RAM by providing each process with a large, uniform, contiguous private address space. The CPU Memory Management Unit (MMU) translates virtual addresses to physical RAM page frames via multi-level Page Tables, transparently swapping inactive pages to secondary disk storage when memory pressure occurs.',
    explanationEn:
      'Keep Virtual Memory as technical term. Translating as "కాల్పనిక జ్ఞాపకశక్తి" confuses cognitive psychology with operating system hardware-assisted address translation.',
    technicalMeaningByLanguage: {
      Telugu:
        'వర్చువల్ మెమరీ (Virtual Memory) అనేది ఆపరేటింగ్ సిస్టమ్‌లోని అద్భుతమైన మెమరీ మేనేజ్‌మెంట్ విధానం. ఇది ప్రతి ప్రాసెస్‌కు ఒక ప్రత్యేకమైన, ఏకరీతి ప్రైవేట్ అడ్రస్ స్పేస్‌ను అందిస్తుంది. CPU లోని MMU (Memory Management Unit) పేజ్ టేబుల్స్ ద్వారా వర్చువల్ అడ్రస్‌లను భౌతిక ర్యామ్ (Physical RAM) మరియు డిస్క్ స్వాప్ స్పేస్‌కు బదిలీ చేస్తుంది.',
      Hindi:
        'वर्चुअल मेमोरी (Virtual Memory) ऑपरेटिंग सिस्टम की एक ऐसी मेमोरी प्रबंधन तकनीक है जो प्रत्येक प्रोसेस को एक बड़ी और सुरक्षित निजी एड्रेस स्पेस प्रदान करती है। सीपीयू का MMU हार्डवेयर पेज टेबल के माध्यम से वर्चुअल एड्रेस को फिजिकल रैम में मैप करता है।',
      Tamil:
        'விர்ச்சுவல் மெமரி (Virtual Memory) என்பது இயக்க முறைமை ஒவ்வொரு செயல்முறைக்கும் பெரிய தனிப்பட்ட நினைவக முகவரியை வழங்கும் நினைவக மேலாண்மை நுட்பமாகும்.',
      Kannada:
        'ವರ್ಚುವಲ್ ಮೆಮೊರಿ (Virtual Memory) ಪ್ರತಿಯೊಂದು ಪ್ರಕ್ರಿಯೆಗೆ ದೊಡ್ಡ ಖಾಸಗಿ ವಿಳಾಸ ಸ್ಥಳವನ್ನು ಒದಗಿಸುವ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್ ಮೆಮೊರಿ ನಿರ್ವಹಣಾ ತಂತ್ರವಾಗಿದೆ.',
      Bengali:
        'ভার্চুয়াল মেমরি (Virtual Memory) হলো একটি মেমরি ম্যানেজমেন্ট কৌশল যা প্রতিটি প্রসেসকে একটি বড় ও নিরাপদ প্রাইভেট অ্যাড্রেস স্পেস প্রদান করে।',
      Marathi:
        'व्हर्च्युअल मेमरी (Virtual Memory) ही मेमरी मॅनेजमेंट पद्धत प्रत्येक प्रोसेसला सुरक्षित प्रायव्हेट अ‍ॅड्रेस स्पेस प्रदान करते.',
      Gujarati:
        'વર્ચ્યુઅલ મેમરી (Virtual Memory) દરેક પ્રોસેસને સુરક્ષિત પ્રાઇવેટ એડ્રેસ સ્પેસ આપતી સિસ્ટમ છે.',
      Punjabi:
        'ਵਰਚੁਅਲ ਮੈਮਰੀ (Virtual Memory) ਹਰੇਕ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਇੱਕ ਵੱਡੀ ਨਿੱਜੀ ਐਡਰੈੱਸ ਸਪੇਸ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ।',
      Malayalam:
        'വിർച്വൽ മെമ്മറി (Virtual Memory) ഓരോ പ്രക്രിയയ്ക്കും വലിയ സ്വകാര്യ വിലാസ ഇടം നൽകുന്ന സാങ്കേതികവിദ്യയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'వర్చువల్ మెమరీని సాంకేతిక ఇంగ్లీష్‌లోనే ఉపయోగించాలి. "కల్పిత జ్ఞాపకశక్తి" అని అనువదిస్తే మెడికల్/సైకాలజీ జ్ఞాపకశక్తితో గందరగోళం ఏర్పడుతుంది.',
      Hindi:
        'Virtual Memory को तकनीकी अंग्रेज़ी में ही रखें। "आभासी याददाश्त" कहना कंप्यूटर साइंस के संदर्भ में गलत है।',
      Tamil:
        'Virtual Memory என்ற தொழில்நுட்ப சொல்லை மாற்றாமல் பயன்படுத்தவும்.',
      Kannada:
        'Virtual Memory ತಾಂತ್ರಿಕ ಪದವನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'Virtual Memory পরিভাষাটি অপরিবর্তিত রাখা প্রয়োজন।',
      Marathi:
        'Virtual Memory तांत्रिक इंग्रजीतच वापरावी.',
      Gujarati:
        'Virtual Memory શબ્દ એમ જ રાખવો.',
      Punjabi:
        'Virtual Memory ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Virtual Memory സാങ്കേതിക ഇംഗ്ലീഷിൽ തന്നെ ഉപയോഗിക്കുക.',
    },
    transliterations: {
      Telugu: 'Virtual Memory (వర్చువల్ మెమరీ / అభ్యాసిత మెమరీ)',
      Hindi: 'Virtual Memory (वर्चुअल मेमोरी - आभासी स्मृति)',
      Tamil: 'Virtual Memory (விர்ச்சுவல் மெமரி)',
      Kannada: 'Virtual Memory (ವರ್ಚುವಲ್ ಮೆಮೊರಿ)',
      Bengali: 'Virtual Memory (ভার্চুয়াল মেমরি)',
      Marathi: 'Virtual Memory (व्हर्च्युअल मेमरी)',
      Gujarati: 'Virtual Memory (વર્ચ્યુઅલ મેમરી)',
      Punjabi: 'Virtual Memory (ਵਰਚੁਅਲ ਮੈਮਰੀ)',
      Malayalam: 'Virtual Memory (വിർച്വൽ മെമ്മറി)',
    },
    technicalExample: `// Virtual Address structure on a 64-bit x86-64 architecture:
// [ 16 bits Sign Extension | 9 bits PML4 | 9 bits PDPT | 9 bits PD | 9 bits PT | 12 bits Page Offset ]
// When accessing virtual address 0x00007FFF5FBFF8C0:
// 1. MMU queries Translation Lookaside Buffer (TLB cache).
// 2. If TLB miss, walks hardware Page Table hierarchy.
// 3. If Valid bit == 0, hardware raises Page Fault Exception (Interrupt 14) to load page from disk.`,
  },

  'hash table': {
    englishTerm: 'Hash Table (Hash Map)',
    subject: 'Data Structures',
    aliases: ['hash table', 'hash map', 'హ్యాష్ టేబుల్', 'हैश टेबल', 'ஹேஷ் டேபிள்', 'ಹ್ಯಾಶ್ ಟೇಬಲ್'],
    technicalMeaningEn:
      'A Hash Table is an associative data structure that implements a dictionary interface, mapping key identifiers to values. It utilizes a deterministic Hash Function to compute an array index from a key, achieving average-case O(1) time complexity for insertion, lookup, and deletion operations, using collision resolution strategies such as Chaining or Open Addressing.',
    explanationEn:
      'Preserve Hash Table / Hashing. Do not translate as "తరిగిన పట్టిక" (minced meat table) or "कीमा सूची". Hashing refers to mathematical mapping of arbitrary keys into fixed indexes.',
    technicalMeaningByLanguage: {
      Telugu:
        'హ్యాష్ టేబుల్ (Hash Table) అనేది కీ-వాల్యూ (Key-Value) జతలను నిల్వ చేసే అత్యంత సమర్థవంతమైన డేటా స్ట్రక్చర్. ఇది హ్యాష్ ఫంక్షన్ (Hash Function) ద్వారా కీని ఒక సంఖ్యా ఇండెక్స్‌గా మార్చి, ఇన్సర్షన్, సెర్చ్ మరియు డిలీట్ ఆపరేషన్‌లను సగటున O(1) టైమ్ కాంప్లెక్సిటీలో నిర్వహిస్తుంది.',
      Hindi:
        'हैश टेबल (Hash Table) एक एसोसिएटिव डेटा संरचना है जो की-वैल्यू पेयर को स्टोर करती है। यह हैश फ़ंक्शन का उपयोग करके की (Key) से इंडेक्स की गणना करती है और O(1) औसत समय जटिलता प्रदान करती है।',
      Tamil:
        'ஹேஷ் டேபிள் (Hash Table) என்பது சாவி-மதிப்பு (Key-Value) இணைகளை சேமிக்கும் தரவு கட்டமைப்பாகும். இது O(1) நேரத்தில் தேடலைச் செய்கிறது.',
      Kannada:
        'ಹ್ಯಾಶ್ ಟೇಬಲ್ (Hash Table) ಎಂಬುದು ಕೀ-ಮೌಲ್ಯ ಜೋಡಿಗಳನ್ನು ಸಂಗ್ರಹಿಸುವ ದಕ್ಷ ಡೇಟಾ ರಚನೆಯಾಗಿದೆ.',
      Bengali:
        'হ্যাশ টেবিল (Hash Table) হলো একটি ডেটা স্ট্রাকচার যা কি-ভ্যালু জোড়া সংরক্ষণ করে এবং O(1) সময়ে কাজ সম্পাদন করে।',
      Marathi:
        'हॅश टेबल (Hash Table) ही की-व्हॅल्यू जोड्या साठवणारी डेटा रचना आहे जी सरासरी O(1) वेळेत शोध घेते.',
      Gujarati:
        'હેશ ટેબલ (Hash Table) એ કી-વેલ્યુ જોડીઓ સંગ્રહિત કરતું ડેટા સ્ટ્રક્ચર છે.',
      Punjabi:
        'ਹੈਸ਼ ਟੇਬਲ (Hash Table) ਇੱਕ ਡਾਟਾ ਸਟ੍ਰਕਚਰ ਹੈ ਜੋ ਕੀ-ਵੈਲਿਊ ਜੋੜਿਆਂ ਨੂੰ ਸਟੋਰ ਕਰਦਾ ਹੈ।',
      Malayalam:
        'ഹാഷ് ടേബിൾ (Hash Table) എന്നത് കീ-മൂല്യ ജോഡികൾ സംഭരിക്കുന്ന ഡാറ്റാ ഘടനയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Hash Table ని సాంకేతిక పదంగానే ఉంచాలి. "తరిగిన పట్టిక" (minced meat table) అని అనువదించకూడదు. ఇక్కడ హ్యాషింగ్ అనేది గణిత ఫంక్షన్.',
      Hindi:
        'Hash Table को "कीमा सूची" न कहें। यह गणितीय मैपिंग की डेटा संरचना है।',
      Tamil:
        'Hash Table என்ற சொல்லை அப்படியே பயன்படுத்தவும்.',
      Kannada:
        'Hash Table ಪದವನ್ನು ಗಣಿತೀಯ ಮ್ಯಾಪಿಂಗ್ ಆಗಿ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'Hash Table পরিভাষাটি অপরিবর্তিত রাখা উচিত।',
      Marathi:
        'Hash Table तांत्रिक इंग्रजीतच वापरावे.',
      Gujarati:
        'Hash Table શબ્દ એમને એમ જ રાખવો.',
      Punjabi:
        'Hash Table ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Hash Table സാങ്കേതിക പദമായി തന്നെ ഉപയോഗിക്കുക.',
    },
    transliterations: {
      Telugu: 'Hash Table (హ్యాష్ టేబుల్ - కీ-వాల్యూ డేటా స్ట్రక్చర్)',
      Hindi: 'Hash Table (हैश टेबल - की-वैल्यू डेटा संरचना)',
      Tamil: 'Hash Table (ஹேஷ் டேபிள்)',
      Kannada: 'Hash Table (ಹ್ಯಾಶ್ ಟೇಬಲ್)',
      Bengali: 'Hash Table (হ্যাশ টেবিল)',
      Marathi: 'Hash Table (हॅश टेबल)',
      Gujarati: 'Hash Table (હેશ ટેબલ)',
      Punjabi: 'Hash Table (ਹੈਸ਼ ਟੇਬਲ)',
      Malayalam: 'Hash Table (ഹാഷ് ടേബിൾ)',
    },
    technicalExample: `// Hash Table with Chaining Collision Handling in JavaScript
class SimpleHashTable {
    constructor(size = 128) {
        this.buckets = new Array(size).fill(null).map(() => []);
    }
    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = (hash << 5) - hash + key.charCodeAt(i);
        return Math.abs(hash) % this.buckets.length;
    }
    set(key, value) {
        const bucket = this.buckets[this._hash(key)];
        const existing = bucket.find(([k]) => k === key);
        if (existing) existing[1] = value;
        else bucket.push([key, value]);
    }
    get(key) {
        const bucket = this.buckets[this._hash(key)];
        const item = bucket.find(([k]) => k === key);
        return item ? item[1] : undefined;
    }
}`,
  },

  'acid properties': {
    englishTerm: 'ACID Properties (Atomicity, Consistency, Isolation, Durability)',
    subject: 'DBMS',
    aliases: ['acid', 'acid properties', 'యాసిడ్', 'యాసిడ్ ప్రాపర్టీస్', 'एसिड प्रॉपर्टीज', 'ஆசிட் பண்புகள்'],
    technicalMeaningEn:
      'ACID is an acronym representing the four critical properties that guarantee database transactions are processed reliably in relational database management systems (RDBMS): Atomicity (all operations commit or all rollback), Consistency (preserves integrity constraints), Isolation (concurrent transactions execute independently without interference), and Durability (committed data persists permanently despite crashes).',
    explanationEn:
      'Preserve ACID. Do not translate as chemical acid (ఆమ్లము / तेज़ाब). In DBMS, ACID is an essential architectural standard for transaction reliability.',
    technicalMeaningByLanguage: {
      Telugu:
        'యాసిడ్ నియమాలు (ACID Properties - Atomicity, Consistency, Isolation, Durability) అనేవి డేటాబేస్ మేనేజ్‌మెంట్ సిస్టమ్స్‌లో లావాదేవీలు (Transactions) నెట్‌వర్క్ వైఫల్యాలు లేదా సిస్టమ్ క్రాష్ అయినప్పటికీ నమ్మదగినవిగా నిర్వహించబడేలా హామీ ఇచ్చే నాలుగు ప్రాథమిక సూత్రాలు. Atomicity (అన్నీ జరగాలి లేదా ఏదీ జరగకూడదు), Consistency (డేటా రూల్స్ పాటించడం), Isolation (స్వతంత్రంగా నడవడం), Durability (శాశ్వతంగా భద్రపరచడం).',
      Hindi:
        'ACID गुणधर्म (Atomicity, Consistency, Isolation, Durability) डेटाबेस प्रबंधन प्रणाली (RDBMS) में ट्रांजेक्शन की विश्वसनीयता सुनिश्चित करने वाले चार मानक हैं: एटॉमिकिटी (सब कुछ या कुछ नहीं), संगति (डेटा अखंडता), पृथक्करण (स्वतंत्र निष्पादन) और स्थायित्व (स्थायी भंडारण)।',
      Tamil:
        'ACID பண்புகள் என்பது தரவுத்தள பரிவர்த்தனைகள் நம்பகத்தன்மையுடன் நடைபெறுவதை உறுதி செய்யும் நான்கு முக்கிய விதிகளாகும்.',
      Kannada:
        'ACID ಗುಣಲಕ್ಷಣಗಳು ಡೇಟಾಬೇಸ್ ವಹಿವಾಟುಗಳು ವಿಶ್ವಾಸಾರ್ಹವಾಗಿ ನಡೆಯುವುದನ್ನು ಖಚಿತಪಡಿಸುವ ನಾಲ್ಕು ನಿಯಮಗಳಾಗಿವೆ.',
      Bengali:
        'ACID বৈশিষ্ট্য হলো ডেটাবেস লেনদেনের নির্ভরযোগ্যতা নিশ্চিত করার চারটি মূল নীতি।',
      Marathi:
        'ACID गुणधर्म हे डेटाबेस ट्रान्झॅक्शनची अचूकता आणि विश्वासार्हता सुनिश्चित करणारे चार नियम आहेत.',
      Gujarati:
        'ACID ગુણધર્મો એ ડેટાબેઝ ટ્રાન્ઝેક્શનની વિશ્વસનીયતા સુનિશ્ચિત કરતા ચાર નિયમો છે.',
      Punjabi:
        'ACID ਗੁਣ ਡਾਟਾਬੇਸ ਲੈਣ-ਦੇਣ ਦੀ ਭਰੋਸੇਯੋਗਤਾ ਨੂੰ ਯਕੀਨੀ ਬਣਾਉਣ ਵਾਲੇ ਚਾਰ ਮੁੱਖ ਨਿਯਮ ਹਨ।',
      Malayalam:
        'ACID സവിശേഷതകൾ ഡാറ്റാബേസ് ഇടപാടുകൾ വിശ്വസനീയമാണെന്ന് ഉറപ്പാക്കുന്ന നാല് തത്വങ്ങളാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'ACID ని రసాయన ఆమ్లం అని అనువదించకూడదు. DBMS లో ఇది డేటాబేస్ ట్రాన్సాక్షన్ల ప్రామాణిక నాణ్యతా ప్రమాణం.',
      Hindi:
        'ACID को रासायनिक "तेज़ाब" न समझें। यह डेटाबेस लेनदेन की विश्वसनीयता का संक्षिप्त नाम है।',
      Tamil:
        'ACID என்ற சுருக்கப்பெயரை வேதியியல் அமிலமாக கருதக்கூடாது.',
      Kannada:
        'ACID ಅನ್ನು ರಾಸಾಯನಿಕ ಆಮ್ಲ ಎಂದು ತಪ್ಪಾಗಿ ಗ್ರಹಿಸಬಾರದು.',
      Bengali:
        'ACID-কে রাসায়নিক অ্যাসিডের সাথে গুলিয়ে ফেলা যাবে না।',
      Marathi:
        'ACID हा डेटाबेस ट्रान्झॅक्शनचा तांत्रिक संक्षिप्त शब्द आहे.',
      Gujarati:
        'ACID એ ડેટાબેઝ ટ્રાન્ઝેક્શનનો નિયમ છે.',
      Punjabi:
        'ACID ਨੂੰ ਕੈਮੀਕਲ ਤੇਜ਼ਾਬ ਨਾ ਸਮਝੋ।',
      Malayalam:
        'ACID എന്നത് രാസ ആസിഡ് അല്ല, ഡാറ്റാബേസ് നിയമമാണ്.',
    },
    transliterations: {
      Telugu: 'ACID Properties (యాసిడ్ ప్రాపర్టీస్ - డేటాబేస్ లావాదేవీల నియమాలు)',
      Hindi: 'ACID Properties (एसिड गुणधर्म - डेटाबेस ट्रांजेक्शन मानक)',
      Tamil: 'ACID Properties (ஆசிட் பண்புகள்)',
      Kannada: 'ACID Properties (ಆಸಿಡ್ ಪ್ರಾಪರ್ಟೀಸ್)',
      Bengali: 'ACID Properties (অ্যাসিড প্রোপার্টিজ)',
      Marathi: 'ACID Properties (अॅसिड गुणधर्म)',
      Gujarati: 'ACID Properties (એસિડ ગુણધર્મો)',
      Punjabi: 'ACID Properties (ਐਸਿਡ ਗੁਣ)',
      Malayalam: 'ACID Properties (ആസിഡ് സവിശേഷതകൾ)',
    },
    technicalExample: `-- ACID Transaction in PostgreSQL/MySQL
BEGIN TRANSACTION;
-- 1. Debit Source Account (Atomicity & Consistency)
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'ACC_101' AND balance >= 500;
-- 2. Credit Destination Account
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'ACC_202';
-- If any error occurs or constraint fails, system issues ROLLBACK;
-- Otherwise:
COMMIT; -- Durability guarantees this update is written to Write-Ahead Log (WAL) on disk`,
  },

  polymorphism: {
    englishTerm: 'Polymorphism',
    subject: 'Software Engineering',
    aliases: ['polymorphism', 'పాలిమార్ఫిజం', 'బహురూపత', 'पॉलीमॉर्फिज्म', 'बहुरूपता', 'பாலிமார்பிசம்'],
    technicalMeaningEn:
      'Polymorphism is an object-oriented programming principle that allows entities (such as methods, operators, or objects) to behave differently based on context or runtime concrete type. It encompasses Compile-Time Polymorphism (method overloading and operator overloading resolved by method signatures) and Run-Time Polymorphism (dynamic dispatch and method overriding via virtual method tables / vtables).',
    explanationEn:
      'Use Polymorphism alongside regional explanation (బహురూపత / बहुरूपता). Ensure students understand that in code, it refers to interface contracts and dynamic dispatch tables.',
    technicalMeaningByLanguage: {
      Telugu:
        'పాలిమార్ఫిజం (Polymorphism - బహురూపత) అనేది ఆబ్జెక్ట్ ఓరియెంటెడ్ ప్రోగ్రామింగ్ (OOP) యొక్క కీలక సూత్రం. ఇది ఒకే ఇంటర్‌ఫేస్ లేదా మెథడ్ పేరు వివిధ రకాల ఆబ్జెక్ట్‌లపై సందర్భోచితంగా భిన్నమైన పద్ధతుల్లో ప్రవర్తించేందుకు వీలు కల్పిస్తుంది. ఇది కంపైల్-టైమ్ పాలిమార్ఫిజం (మెథడ్ ఓవర్‌లోడింగ్) మరియు రన్‌టైమ్ పాలిమార్ఫిజం (మెథడ్ ఓవర్‌రైడింగ్ మరియు డైనమిక్ డిస్పాచ్) అనే రెండు రూపాల్లో ఉంటుంది.',
      Hindi:
        'पॉलीमॉर्फिज्म (Polymorphism - बहुरूपता) ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग का एक मूलभूत सिद्धांत है जो किसी फ़ंक्शन, ऑपरेटर या ऑब्जेक्ट को विभिन्न संदर्भों में भिन्न तरीके से व्यवहार करने की अनुमति देता है। यह कंपाइल-टाइम (मेथड ओवरलोडिंग) और रन-टाइम (मेथड ओवरराइडिंग) दो प्रकार का होता है।',
      Tamil:
        'பாலிமார்பிசம் (Polymorphism) என்பது ஒரு பொருள் சார்ந்த நிரலாக்கக் கோட்பாடாகும், இது ஒரே இடைமுகத்தை பல்வேறு சூழல்களில் வெவ்வேறு விதமாக செயல்பட அனுமதிக்கிறது.',
      Kannada:
        'ಪಾಲಿಮಾರ್ಫಿಸಂ (Polymorphism) ಎಂಬುದು ಆಬ್ಜೆಕ್ಟ್ ಓರಿಯೆಂಟೆಡ್ ಪ್ರೋಗ್ರಾಮಿಂಗ್‌ನ ತತ್ವವಾಗಿದ್ದು, ಒಂದೇ ವಿಧಾನವು ಸಂದರ್ಭಕ್ಕೆ ತಕ್ಕಂತೆ ವಿಭಿನ್ನವಾಗಿ ವರ್ತಿಸಲು ಅನುಮತಿಸುತ್ತದೆ.',
      Bengali:
        'পলিমরফিজম (Polymorphism - বহুরূপতা) হলো অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিংয়ের এমন একটি নীতি যা একই ফাংশনকে বিভিন্ন প্রসঙ্গে ভিন্নভাবে আচরণ করতে দেয়।',
      Marathi:
        'पॉलिमॉर्फिझम (Polymorphism) हे ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंगचे तत्त्व आहे जे एकाच इंटरफेसला वेगवेगळ्या संदर्भात वेगळे वर्तन करण्याची अनुमती देते.',
      Gujarati:
        'પોલીમોર્ફિઝમ (Polymorphism) એ ઓબ્જેક્ટ ઓરિએન્ટેડ પ્રોગ્રામિંગનો સિદ્ધાંત છે.',
      Punjabi:
        'ਪੋਲੀਮੋਰਫਿਜ਼ਮ (Polymorphism) ਇੱਕੋ ਇੰਟਰਫੇਸ ਨੂੰ ਵੱਖ-ਵੱਖ ਤਰੀਕਿਆਂ ਨਾਲ ਕੰਮ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ।',
      Malayalam:
        'പോളിമോർഫിസം (Polymorphism) ഒബ്ജക്റ്റ് ഓറിയന്റഡ് പ്രോഗ്രാമിംഗിൽ ഒരേ ഇന്റർഫേസിന് വ്യത്യസ്ത രീതികളിൽ പ്രവർത്തിക്കാൻ അനുമതി നൽകുന്നു.',
    },
    explanationByLanguage: {
      Telugu:
        'Polymorphism పదాన్ని బహురూపత వివరణతో పాటు వాడాలి. సాఫ్ట్‌వేర్ కోడింగ్‌లో ఇది వర్చువల్ మెథడ్ టేబుల్స్ (vtable) మరియు డైనమిక్ డిస్పాచ్‌తో ముడిపడి ఉంది.',
      Hindi:
        'Polymorphism को बहुरूपता के साथ तकनीकी संदर्भ में समझें। कोड में यह इंटरफ़ेस और वर्चुअल फ़ंक्शन्स से संबंधित है।',
      Tamil:
        'Polymorphism என்ற தொழில்நுட்ப சொல்லை நிரலாக்க சூழലில் புரிந்து கொள்ள வேண்டும்.',
      Kannada:
        'Polymorphism ತಾಂತ್ರಿಕ ಪದವನ್ನು ಕೋಡಿಂಗ್ ಸಂದರ್ಭದಲ್ಲಿ ಬಳಸಿ.',
      Bengali:
        'Polymorphism শব্দটি প্রযুক্তিগত কোডিংয়ে ব্যবহৃত হয়।',
      Marathi:
        'Polymorphism तांत्रिक संदर्भातच स्पष्ट करावे.',
      Gujarati:
        'Polymorphism શબ્દ કોડિંગ માટે પ્રમાણભૂત છે.',
      Punjabi:
        'Polymorphism ਨੂੰ ਕੋਡਿੰਗ ਸੰਦਰਭ ਵਿੱਚ ਹੀ ਸਮਝੋ।',
      Malayalam:
        'Polymorphism സാങ്കേതികമായി തന്നെ മനസ്സിലാക്കുക.',
    },
    transliterations: {
      Telugu: 'Polymorphism (పాలిమార్ఫిజం / బహురూపత)',
      Hindi: 'Polymorphism (पॉलीमॉर्फिज्म / बहुरूपता)',
      Tamil: 'Polymorphism (பாலிமார்பிசம்)',
      Kannada: 'Polymorphism (ಪಾಲಿಮಾರ್ಫಿಸಂ)',
      Bengali: 'Polymorphism (পলিমরফিজম)',
      Marathi: 'Polymorphism (पॉलिमॉर्फिझम)',
      Gujarati: 'Polymorphism (પોલીમોર્ફિઝમ)',
      Punjabi: 'Polymorphism (ਪੋਲੀਮੋਰਫਿਜ਼ਮ)',
      Malayalam: 'Polymorphism (പോളിമോർഫിസം)',
    },
    technicalExample: `// Dynamic Run-time Polymorphism in Java / TypeScript
abstract class DatabaseConnector {
    abstract query(sql: string): Promise<any[]>;
}

class PostgresConnector extends DatabaseConnector {
    async query(sql: string) { return ["Postgres result executing via TCP socket"]; }
}

class MongoConnector extends DatabaseConnector {
    async query(sql: string) { return ["MongoDB BSON document collection"]; }
}

// Client code operates polymorphically on base abstraction:
async function executeHealthCheck(connector: DatabaseConnector) {
    return await connector.query("SELECT 1"); // Dispatches to correct subclass at runtime!
}`,
  },

  api: {
    englishTerm: 'API (Application Programming Interface)',
    subject: 'Software Engineering',
    aliases: ['api', 'application programming interface', 'ఏపీఐ', 'एपीआई', 'ஏபிஐ', 'ಎಪಿಐ', 'এপিআই'],
    technicalMeaningEn:
      'An API (Application Programming Interface) is a defined formal contract, specification, and set of communication protocols and subroutines that allows distinct software components, microservices, or client-server applications to interact deterministically without knowing internal implementations.',
    explanationEn:
      'Preserve "API" in English or transliteration. Never translate literally into everyday conversational words, which confuses developers and students.',
    technicalMeaningByLanguage: {
      Telugu:
        'API (అప్లికేషన్ ప్రోగ్రామింగ్ ఇంటర్‌ఫేస్) అనేది వేర్వేరు సాఫ్ట్‌వేర్ అప్లికేషన్‌లు ఒకదానితో ఒకటి డేటాను మరియు సేవలను సురక్షితంగా మార్పిడి చేసుకోవడానికి అనుమతించే అధికారిక ఒప్పందం (Formal Contract) మరియు ప్రోటోకాల్‌ల సమితి. ఇది అంతర్గత కోడ్ అమలును దాచిపెట్టి, నియంత్రిత ఎండ్‌పాయింట్ల ద్వారా సేవలను అందిస్తుంది.',
      Hindi:
        'API (एप्लिकेशन प्रोग्रामिंग इंटरफ़ेस) एक औपचारिक अनुबंध (Contract) और नियमों का समूह है जो विभिन्न सॉफ़्टवेयर घटकों को एक-दूसरे के आंतरिक कोड को जाने बिना नेटवर्क या सिस्टम पर सुरक्षित रूप से संवाद करने की अनुमति देता है।',
      Tamil:
        'API (Application Programming Interface) என்பது வெவ்வேறு மென்பொருள் பயன்பாடுகள் தங்களுக்குள் தகவல்களைப் பாதுகாப்பாகப் பரிமாறிக்கொள்ள உதவும் ஒரு தொழில்நுட்ப இடைமுக நெறிமுறையாகும்.',
      Kannada:
        'API (Application Programming Interface) ಎಂಬುದು ವಿಭಿನ್ನ ಸಾಫ್ಟ್‌ವೇರ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು ಪರಸ್ಪರ ಸಂವಹನ ನಡೆಸಲು ಮತ್ತು ಡೇಟಾವನ್ನು ವಿನಿಮಯ ಮಾಡಿಕೊಳ್ಳಲು ಅನುಮತಿಸುವ ಅಧಿಕೃತ ಇಂಟರ್ಫೇಸ್ ಆಗಿದೆ.',
      Bengali:
        'API (অ্যাप्लिकेशन প্রোগ্রামিং ইন্টারফেস) হলো একটি আনুষ্ঠানিক চুক্তি এবং প্রোটোকল যা বিভিন্ন সফটওয়্যার উপাদানকে একে অপরের সাথে নিরাপদে ডেটা আদান-প্রদান করতে সক্ষম করে।',
      Marathi:
        'API (अ‍ॅप्लिकेशन प्रोग्रामिंग इंटरफेस) हा वेगवेगळ्या सॉफ्टवेअर अ‍ॅप्लिकेशन्सना एकमेकांशी सुरक्षित संवाद साधण्याची अनुमती देणारा औपचारिक प्रोटोकॉल आहे.',
      Gujarati:
        'API (એપ્લિકેશન પ્રોગ્રામિંગ ઇન્ટરફેસ) એ વિવિધ સોફ્ટવેર ઘટકો વચ્ચે સુરક્ષિત સંચાર માટેનો સત્તાવાર કરાર છે.',
      Punjabi:
        'API (ਐਪਲੀਕੇਸ਼ਨ ਪ੍ਰੋਗਰਾਮਿੰਗ ਇੰਟਰਫੇਸ) ਵੱਖ-ਵੱਖ ਸਾਫਟਵੇਅਰਾਂ ਵਿਚਕਾਰ ਡਾਟਾ ਸੰਚਾਰ ਲਈ ਇੱਕ ਤਕਨੀਕੀ ਸਮਝੌਤਾ ਹੈ।',
      Malayalam:
        'API (ആപ്ലിക്കേഷൻ പ്രോഗ്രാമിംഗ് ഇന്റർഫേസ്) എന്നത് വ്യത്യസ്ത സോഫ്റ്റ്‌വെയറുകൾ തമ്മിൽ സുരക്ഷിതമായി ആശയവിനിമയം നടത്താൻ സഹായിക്കുന്ന ഒരു പ്രോട്ടോക്കോളാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'API ని ఎల్లప్పుడూ సాంకేతిక ఇంగ్లీష్ లేదా ఏపీఐ రూపంలోనే భద్రపరచాలి. "అనువర్తన क्रमाదేశన అంతరాఫలకము" అని అనువదిస్తే డెవలపర్లు గందరగోళానికి గురవుతారు.',
      Hindi:
        'API को हमेशा तकनीकी अंग्रेज़ी या एपीआई के रूप में ही सुरक्षित रखें। इसका अनुवाद "अनुप्रयोग क्रमादेशन अंतराफलक" कभी न करें।',
      Tamil:
        'API என்ற சொல்லை தொழில்நுட்ப ஆங்கிலத்திலேயே பயன்படுத்துங்கள்.',
      Kannada:
        'API ಪದವನ್ನು ತಾಂತ್ರಿಕ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿಯೇ ಬಳಸಿ.',
      Bengali:
        'API পরিভাষাটি প্রোগ্রামিংয়ে অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'API हा शब्द मूळ स्वरूपातच वापरावा.',
      Gujarati:
        'API શબ્દ તકનીકી અંગ્રેજીમાં જ રાખવો.',
      Punjabi:
        'API ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਵਰਤੋ।',
      Malayalam:
        'API സാങ്കേതികമായി തന്നെ നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'API (ఏపీఐ - అప్లికేషన్ ప్రోగ్రామింగ్ ఇంటర్‌ఫేస్)',
      Hindi: 'API (एपीआई - एप्लिकेशन प्रोग्रामिंग इंटरफ़ेस)',
      Tamil: 'API (ஏபிஐ)',
      Kannada: 'API (ಎಪಿಐ)',
      Bengali: 'API (এপিআই)',
      Marathi: 'API (एपीआय)',
      Gujarati: 'API (એપીઆઈ)',
      Punjabi: 'API (ਏਪੀਆਈ)',
      Malayalam: 'API (എപിഐ)',
    },
    technicalExample: `// REST API Endpoint Handler in Express & Node.js
import express from 'express';
const app = express();
app.get('/api/v1/students/:id', async (req, res) => {
    const student = await db.findStudent(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true, data: student });
});`,
  },

  recursion: {
    englishTerm: 'Recursion',
    subject: 'Data Structures',
    aliases: ['recursion', 'రీకర్షన్', 'రికార్షన్', 'रिकर्शन', 'ரிகர்ஷன்', 'ರಿಕರ್ಶನ್', 'রিকার্শন'],
    technicalMeaningEn:
      'Recursion is a computational problem-solving and programming paradigm wherein a function solves a task by decomposing it into smaller instances of the same problem and invoking itself, relying on runtime stack frames until satisfying a mandatory non-recursive Base Case.',
    explanationEn:
      'Preserve "Recursion" in technical English or transliteration. Translating as "పునరావృతం" or "पुनरावर्तन" confuses recursion with iteration/loops.',
    technicalMeaningByLanguage: {
      Telugu:
        'రికార్షన్ (Recursion) అనేది ఒక ప్రోగ్రామింగ్ విధానం, ఇందులో ఒక ఫంక్షన్ సంక్లిష్ట సమస్యను చిన్న చిన్న ఉప-సమస్యలుగా విభజించి, ఒక నిర్దిష్ట బేస్ కండిషన్ (Base Case) సంతృప్తి చెందే వరకు తనను తాను నిరంతరం కాల్ చేసుకుంటుంది. ఇది రన్‌టైమ్ కాల్ స్టాక్ (Call Stack) మెమరీని ఉపయోగిస్తుంది.',
      Hindi:
        'रिकर्शन (Recursion) एक प्रोग्रामिंग प्रतिमान है जिसमें एक फ़ंक्शन किसी बड़ी समस्या को छोटे उप-भागों में विभाजित करके स्वयं को तब तक कॉल करता है जब तक कि वह एक निर्दिष्ट बेस कंडीशन (Base Case) को प्राप्त न कर ले। यह निष्पादन के दौरान कॉल स्टैक फ़्रेम का उपयोग करता है।',
      Tamil:
        'ரிகர்ஷன் (Recursion) என்பது ஒரு செயல்பாடு (Function) ஒரு குறிப்பிட்ட அடிப்படை நிபந்தனையை (Base Condition) அடையும் வரை தன்னைத்தானே மீண்டும் மீண்டும் அழைத்துக் கொள்ளும் ஒரு நிரலாக்க முறையாகும்.',
      Kannada:
        'ರಿಕರ್ಶನ್ (Recursion) ಎಂಬುದು ಒಂದು ಫಂಕ್ಷನ್ ಮೂಲ ಷರತ್ತು (Base Case) ಪೂರೈಸುವವರೆಗೆ ತನ್ನನ್ನೇ ತಾನು ಪುನರಾವರ್ತಿತವಾಗಿ ಕರೆದುಕೊಳ್ಳುವ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ತಂತ್ರವಾಗಿದೆ.',
      Bengali:
        'রিকার্শন (Recursion) হলো একটি প্রোগ্রামিং কৌশল যেখানে একটি ফাংশন কোনো সমস্যার সমাধানের জন্য একটি নির্দিষ্ট বেস কন্ডিশন না পৌঁছানো পর্যন্ত নিজেকে বারবার কল করে।',
      Marathi:
        'रिकर्शन (Recursion) ही अशी प्रोग्रामिंग पद्धत आहे ज्यामध्ये फंक्शन मूळ बेस केस मिळेपर्यंत स्वतःलाच पुन्हा पुन्हा कॉल करते.',
      Gujarati:
        'રિકર્શન (Recursion) એ પ્રોગ્રામિંગ ટેકનિક છે જેમાં ફંક્શન બેઝ કન્ડિશન ન મળે ત્યાં સુધી પોતાની જાતને જ કૉલ કરે છે.',
      Punjabi:
        'ਰੀਕਰਸ਼ਨ (Recursion) ਇੱਕ ਪ੍ਰੋਗਰਾਮਿੰਗ ਵਿਧੀ ਹੈ ਜਿਸ ਵਿੱਚ ਇੱਕ ਫੰਕਸ਼ਨ ਆਪਣੇ ਆਪ ਨੂੰ ਉਦੋਂ ਤੱਕ ਕਾਲ ਕਰਦਾ ਹੈ ਜਦੋਂ ਤੱਕ ਬੇਸ ਕੇਸ ਪੂਰਾ ਨਹੀਂ ਹੁੰਦਾ।',
      Malayalam:
        'റിക്കർഷൻ (Recursion) എന്നത് ഒരു ഫംഗ്ഷൻ ബേസ് കണ്ടീഷൻ എത്തുന്നതുവരെ സ്വയം വിളിക്കുന്ന പ്രോഗ്രാമിംഗ് രീതിയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Recursion ని సాంకేతిక ఇంగ్లీష్ లేదా రికార్షన్ రూపంలోనే ఉంచాలి. "పునరావృతం" అని అనువదిస్తే సాధారణ లూప్ (Loop/Iteration) తో గందరగోళం ఏర్పడుతుంది.',
      Hindi:
        'Recursion को "पुनरावर्तन" न कहें; यह साधारण लूप (Iteration) नहीं है, बल्कि कॉल स्टैक आधारित स्व-आह्वान है।',
      Tamil:
        'Recursion என்ற சொல்லை சுழற்சி (Loop) உடன் குழப்பிக் கொள்ளாமல் தொழில்நுட்பச் சொல்லாகவே பயன்படுத்த வேண்டும்.',
      Kannada:
        'Recursion ಪದವನ್ನು ಲೂಪ್‌ಗೆ ಬದಲಾಗಿ ಪ್ರತ್ಯೇಕ ತಾಂತ್ರಿಕ ಪದವಾಗಿ ಬಳಸಿ.',
      Bengali:
        'রিকার্শনের আক্ষরিক অনুবাদ লুপ বা পুনরাবৃত্তির সাথে বিভ্রান্তি তৈরি করে।',
      Marathi:
        'Recursion लूपपेक्षा वेगळे असल्याने मूळ तांत्रिक संज्ञेतच वापरावे.',
      Gujarati:
        'Recursion ને લૂપ સાથે ભેળવવું નહીં.',
      Punjabi:
        'Recursion ਨੂੰ ਲੂਪ ਤੋਂ ਵੱਖਰਾ ਸਮਝਣ ਲਈ ਤਕਨੀਕੀ ਨਾਮ ਹੀ ਵਰਤੋ।',
      Malayalam:
        'Recursion ലൂപ്പുമായി തെറ്റിദ്ധരിക്കപ്പെടരുത്.',
    },
    transliterations: {
      Telugu: 'Recursion (రికార్షన్ / స్వయం ఆహ్వాన పద్ధతి)',
      Hindi: 'Recursion (रिकर्शन - स्व-आह्वान फ़ंक्शन)',
      Tamil: 'Recursion (ரிகர்ஷன்)',
      Kannada: 'Recursion (ರಿಕರ್ಶನ್)',
      Bengali: 'Recursion (রিকার্শন)',
      Marathi: 'Recursion (रिकर्शन)',
      Gujarati: 'Recursion (રિકર્શન)',
      Punjabi: 'Recursion (ਰੀਕਰਸ਼ਨ)',
      Malayalam: 'Recursion (റിക്കർഷൻ)',
    },
    technicalExample: `// Binary Search using Recursive Call Stack
int binarySearch(int arr[], int low, int high, int key) {
    if (low > high) return -1; // Base case: Target not present
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid; // Target found
    if (arr[mid] > key) return binarySearch(arr, low, mid - 1, key); // Left branch
    return binarySearch(arr, mid + 1, high, key); // Right branch
}`,
  },

  overfitting: {
    englishTerm: 'Overfitting',
    subject: 'Machine Learning',
    aliases: ['overfitting', 'ఓవర్‌ఫిట్టింగ్', 'ओवरफिटिंग', 'ஓவர்ஃபிட்டிங்', 'ಓವರ್‌ಫಿಟ್ಟಿಂಗ್', 'ওভারফিটিং'],
    technicalMeaningEn:
      'Overfitting is an empirical machine learning failure mode where a model learns idiosyncratic noise and training dataset artifacts instead of true generalized population distributions, resulting in near-zero training error but unacceptably high validation error.',
    explanationEn:
      'Preserve Overfitting. Translating literally as garment fitting (బట్టల కొలత / कपड़े की फिटिंग) destroys machine learning pedagogical context.',
    technicalMeaningByLanguage: {
      Telugu:
        'ఓవర్‌ఫిట్టింగ్ (Overfitting) అనేది మెషిన్ లెర్నింగ్‌లో సంభవించే తీవ్రమైన లోపం. ఇందులో మోడల్ ట్రైనింగ్ డేటాలోని శబ్దం (Noise) మరియు ప్రత్యేక వివరాలను కూడా బట్టీ పట్టి నేర్చుకుంటుంది. దీనివల్ల ట్రైనింగ్ డేటాపై అత్యుత్తమ ఖచ్చితత్వం చూపినప్పటికీ, కొత్త టెస్ట్ డేటాపై ఖచ్చితత్వం ఘోరంగా పడిపోతుంది.',
      Hindi:
        'ओवरफिटिंग (Overfitting) मशीन लर्निंग में एक ऐसी विफलता है जिसमें मॉडल प्रशिक्षण डेटा (Training Data) के शोर (Noise) और यादृच्छिक उतार-चढ़ाव को भी सीख लेता है। परिणामस्वरूप, मॉडल का ट्रेनिंग लॉस बहुत कम होता है लेकिन नए टेस्ट डेटा पर त्रुटि (Generalization Error) बहुत अधिक होती है।',
      Tamil:
        'ஓவர்ஃபிட்டிங் (Overfitting) என்பது மெஷின் லேர்னிங்கில் மாதிரி ஒன்று பயிற்சித் தரவின் இரைச்சலை அதிகமாகக் கற்றுக்கொண்டு, புதிய தரவில் சரியாகச் செயல்படத் தவறும் நிலையாகும்.',
      Kannada:
        'ಓವರ್‌ಫಿಟ್ಟಿಂಗ್ (Overfitting) ಎಂಬುದು ಮೆಷಿನ್ ಲರ್ನಿಂಗ್‌ನಲ್ಲಿ ಮಾದರಿಯು ತರಬೇತಿ ಡೇಟಾವನ್ನು ಅತಿಯಾಗಿ ಕಂಠಪಾಠ ಮಾಡಿ, ಹೊಸ ಡೇಟಾದಲ್ಲಿ ವಿಫಲವಾಗುವ ಸ್ಥಿತಿಯಾಗಿದೆ.',
      Bengali:
        'ওভারফিটিং (Overfitting) হলো মেশিন লার্নিংয়ের এমন একটি ত্রুটি যেখানে মডেলটি ট্রেনিং ডেটার নয়েজও শিখে ফেলে এবং নতুন ডেটাতে খারাপ পারফর্ম করে।',
      Marathi:
        'ओव्हरफिटिंग (Overfitting) मध्ये मशीन लर्निंग मॉडेल ट्रेनिंग डेटावर अचूक चालते पण नवीन टेस्ट डेटावर अपयशी ठरते.',
      Gujarati:
        'ઓવરફિટિંગ (Overfitting) મશીન લર્નિંગ મોડેલનું ટ્રેઇનિંગ ડેટા પર વધુ પડતું નિર્ભર થઈ જવું છે.',
      Punjabi:
        'ਓਵਰਫਿਟਿੰਗ (Overfitting) ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਵਿੱਚ ਮਾਡਲ ਦੁਆਰਾ ਸਿਰਫ ਟ੍ਰੇਨਿੰਗ ਡਾਟਾ ਨੂੰ ਹੀ ਸਿੱਖਣ ਦੀ ਖ਼ਾਮੀ ਹੈ।',
      Malayalam:
        'ഓവർഫിറ്റിംഗ് (Overfitting) മെഷീൻ ലേണിംഗ് മോഡൽ പുതിയ ഡാറ്റയിൽ പരാജയപ്പെടുന്ന അവസ്ഥയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Overfitting పదాన్ని యథాతథంగా వాడాలి. బట్టల సైజు ఫిట్టింగ్ లాగా అనువదిస్తే మెషిన్ లెర్నింగ్ గణాంక సూత్రం గందరగోళం అవుతుంది.',
      Hindi:
        'Overfitting को कपड़ों की फिटिंग जैसा अनुवाद न करें। यह एमएल में सामान्यीकरण (Generalization) की विफलता है।',
      Tamil:
        'Overfitting என்ற சொல்லை மாற்றாமல் அப்படியே பயன்படுத்த வேண்டும்.',
      Kannada:
        'Overfitting ಪದವನ್ನು ಮೆಷಿನ್ ಲರ್ನಿಂಗ್ ತಾಂತ್ರಿಕ ಪದವಾಗಿ ಬಳಸಿ.',
      Bengali:
        'Overfitting শব্দের আক্ষরিক অর্থ পোশাক ফিটিংয়ের সাথে বিভ্রান্তিকর।',
      Marathi:
        'Overfitting तांत्रिक संदर्भातच ठेवावे.',
      Gujarati:
        'Overfitting શબ્દ એમ જ રાખવો.',
      Punjabi:
        'Overfitting ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਵਰਤੋ।',
      Malayalam:
        'Overfitting സാങ്കേതിക പദമായി നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Overfitting (ఓవర్‌ఫిట్టింగ్ - అధిక మోడల్ అనుసరణ)',
      Hindi: 'Overfitting (ओवरफिटिंग - अति-अनुकूलन विफलता)',
      Tamil: 'Overfitting (ஓவர்ஃபிட்டிங்)',
      Kannada: 'Overfitting (ಓವರ್‌ಫಿಟ್ಟಿಂಗ್)',
      Bengali: 'Overfitting (ওভারফিটিং)',
      Marathi: 'Overfitting (ओव्हरफिटिंग)',
      Gujarati: 'Overfitting (ઓવરફિટિંગ)',
      Punjabi: 'Overfitting (ਓਵਰਫਿਟਿੰਗ)',
      Malayalam: 'Overfitting (ഓവർഫിറ്റിംഗ്)',
    },
    technicalExample: `// Combating Overfitting with L2 Regularization & Dropout in PyTorch
import torch.nn as nn
model = nn.Sequential(
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Dropout(0.3), // Randomly drops 30% activations to prevent co-adaptation
    nn.Linear(64, 10)
)`,
  },

  normalization: {
    englishTerm: 'Database Normalization',
    subject: 'DBMS',
    aliases: ['normalization', 'database normalization', 'నార్మలైజేషన్', 'నార్మలైజేషన్ ప్రక్రియ', 'नॉर्मलाइज़ेशन', 'டேட்டாபேஸ் நார்மலைசேஷன்', 'ನಾರ್ಮಲೈಸೇಶನ್'],
    technicalMeaningEn:
      'Database Normalization is the formal mathematical process of structuring relational schema tables into progressive Normal Forms (1NF, 2NF, 3NF, BCNF) to reduce functional redundancy and eliminate insertion, update, and deletion anomalies while enforcing lossless join decomposition.',
    explanationEn:
      'Preserve Normalization in database context. Do not translate as societal psychological normalization.',
    technicalMeaningByLanguage: {
      Telugu:
        'డేటాబేస్ నార్మలైజేషన్ (Database Normalization) అనేది రిలేషనల్ డేటాబేస్‌లలో డేటా పునరావృతాన్ని (Data Redundancy) తగ్గించి, ఇన్సర్షన్, అప్‌డేట్ మరియు డిలీషన్ లోపాలను (Anomalies) పూర్తిగా తొలగించడానికి టేబుల్స్‌ను శాస్త్రీయ పద్ధతిలో విభజించే ఒక ప్రామాణిక గణిత ప్రక్రియ (1NF, 2NF, 3NF, BCNF).',
      Hindi:
        'डेटाबेस सामान्यीकरण (Database Normalization) रिलेशनल डेटाबेस स्कीमा को व्यवस्थित करने की एक औपचारिक गणितीय तकनीक है जिसका उद्देश्य डेटा अतिरेक (Data Redundancy) को कम करना और इन्सर्ट, अपडेट और डिलीट विसंगतियों को समाप्त करना है (1NF, 2NF, 3NF, BCNF)।',
      Tamil:
        'டேட்டாபேஸ் நார்மலைசேஷன் (Database Normalization) என்பது தரவுத்தளத்தில் தேவையற்ற நகல்களைக் குறைத்து, தரவு ஒருமைப்பாட்டைப் பாதுகாக்கும் ஒரு படிநிலை வடிவமைப்பு முறையாகும்.',
      Kannada:
        'ಡೇಟಾಬೇಸ್ ನಾರ್ಮಲೈಸೇಶನ್ (Database Normalization) ಎನ್ನುವುದು ಕೋಷ್ಟಕಗಳಲ್ಲಿ ಅನಗತ್ಯ ಡೇಟಾ ನಕಲನ್ನು ತಪ್ಪಿಸಲು ಮತ್ತು ಅಸಂಗತತೆಗಳನ್ನು ತೊಡೆದುಹಾಕಲು ಬಳಸುವ ಕ್ರಮಬದ್ಧ ಪ್ರಕ್ರಿಯೆಯಾಗಿದೆ.',
      Bengali:
        'ডাটাবেস নরমালাইজেশন হলো এমন একটি পদ্ধতি যা ডেটাবেসে পুনরাবৃত্তি কমায় এবং ডেটা অখণ্ডতা বজায় রাখতে টেবিলগুলোকে নিয়মতান্ত্রিকভাবে সাজায়।',
      Marathi:
        'डेटाबेस नॉर्मलायझेशन (Database Normalization) ही टेबलमधील रिडंडन्सी कमी करण्यासाठी आणि डेटा अखंडता राखण्यासाठीची पद्धत आहे.',
      Gujarati:
        'ડેટાબેઝ નોર્મલાઇઝેશન એ ડેટાબેઝમાં ડેટાની નકલો ઘટાડવાની અને સંગતતા જાળવવાની પ્રક્રિયા છે.',
      Punjabi:
        'ਡਾਟਾਬੇਸ ਨਾਰਮਲਾਈਜ਼ੇਸ਼ਨ ਡਾਟਾਬੇਸ ਵਿੱਚ ਬੇਲੋੜੇ ਡਾਟਾ ਨੂੰ ਘਟਾਉਣ ਅਤੇ ਅਖੰਡਤਾ ਬਣਾਈ ਰੱਖਣ ਦੀ ਵਿਧੀ ਹੈ।',
      Malayalam:
        'ഡാറ്റാബേസ് നോർമലൈസേഷൻ എന്നത് ഡാറ്റാബേസിലെ അനാവശ്യ ആവർത്തനങ്ങൾ കുറയ്ക്കാനുള്ള ഘടനാപരമായ പ്രക്രിയയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Database Normalization పదాన్ని సాంకేతిక నార్మలైజేషన్ గానే వాడాలి. సామాజిక సాధారణీకరణతో దీనిని పోల్చరాదు.',
      Hindi:
        'Database Normalization को तकनीकी संदर्भ में ही समझें; यह टेबल विभाजन और अखंडता नियमों से संबंधित है।',
      Tamil:
        'Normalization என்ற சொல்லை மாற்றாமல் தரவுத்தள சூழலில் பயன்படுத்தவும்.',
      Kannada:
        'Normalization ತಾಂತ್ರಿಕ ಪದವನ್ನು ಕೋಷ್ಟಕ ವಿನ್ಯಾಸದ ಸನ್ನಿವೇಶದಲ್ಲಿ ಬಳಸಿ.',
      Bengali:
        'Normalization পরিভাষাটি অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Normalization तांत्रिक इंग्रजीतच वापरावी.',
      Gujarati:
        'Normalization શબ્દ ડેટાબેઝ માટે પ્રમાણભૂત છે.',
      Punjabi:
        'Normalization ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Normalization സാങ്കേതികമായി തന്നെ നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Database Normalization (డేటాబేస్ నార్మలైజేషన్)',
      Hindi: 'Database Normalization (डेटाबेस नॉर्मलाइज़ेशन / सामान्यीकरण)',
      Tamil: 'Database Normalization (டேட்டாபேஸ் நார்மலைசேஷன்)',
      Kannada: 'Database Normalization (ಡೇಟಾಬೇಸ್ ನಾರ್ಮಲೈಸೇಶನ್)',
      Bengali: 'Database Normalization (ডাটাবেস নরমালাইজেশন)',
      Marathi: 'Database Normalization (डेटाबेस नॉर्मलायझेशन)',
      Gujarati: 'Database Normalization (ડેટાબેઝ નોર્મલાઇઝેશન)',
      Punjabi: 'Database Normalization (ਡਾਟਾਬੇਸ ਨਾਰਮਲਾਈਜ਼ੇਸ਼ਨ)',
      Malayalam: 'Database Normalization (ഡാറ്റാബേസ് നോർമലൈസേഷൻ)',
    },
    technicalExample: `-- 3NF Table Normalization Example:
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL
);
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);`,
  },

  'tcp/ip': {
    englishTerm: 'TCP/IP (Transmission Control Protocol / Internet Protocol)',
    subject: 'Computer Networks',
    aliases: ['tcp', 'tcp/ip', 'ip', 'టిసిపి', 'टीसीपी', 'டிசிபி', 'ಟಿಸಿಪಿ'],
    technicalMeaningEn:
      'TCP/IP is the foundational four-layer communication protocol suite (Application, Transport, Internet, Network Interface) governing packet-switched inter-network communications, guaranteeing ordered, error-checked, flow-controlled packet delivery via TCP three-way handshake.',
    explanationEn:
      'Preserve TCP/IP. Literal translation obscures standard networking protocol implementations.',
    technicalMeaningByLanguage: {
      Telugu:
        'TCP/IP (ట్రాన్స్‌మిషన్ కంట్రోల్ ప్రోటోకాల్ / ఇంటర్నెట్ ప్రోటోకాల్) అనేది ఆధునిక ఇంటర్నెట్ మరియు కంప్యూటర్ నెట్‌వర్క్‌ల సమాచార ప్రసారానికి వెన్నెముక వంటి నాలుగు పొరల (Four-Layer) కమ్యూనికేషన్ ప్రోటోకాల్ సూట్. ఇందులో TCP విశ్వసనీయమైన, క్రమబద్ధమైన మరియు ఎర్రర్-చెక్ చేయబడిన డేటా ప్యాకెట్ డెలివరీకి హామీ ఇస్తుంది.',
      Hindi:
        'TCP/IP (ट्रांसमिशन कंट्रोल प्रोटोकॉल / इंटरनेट प्रोटोकॉल) इंटरनेट का आधारभूत चार-परत वाला संचार प्रोटोकॉल समूह है जो पैकेट-स्विच्ड नेटवर्क पर डेटा के विश्वसनीय, क्रमित और त्रुटि-रहित वितरण की गारंटी देता है।',
      Tamil:
        'TCP/IP என்பது இணையத்தில் தகவல்களை நம்பகத்தன்மையுடனும் ஒழுங்காகவும் பரிமாற உதவும் நான்கு அடுக்கு நெறிமுறை கட்டமைப்பாகும்.',
      Kannada:
        'TCP/IP ಎಂಬುದು ಇಂಟರ್ನೆಟ್ ಮತ್ತು ನೆಟ್‌ವರ್ಕ್ ಸಂವಹನವನ್ನು ನಿಯಂತ್ರಿಸುವ ನಾಲ್ಕು-ಪದರಗಳ ಪ್ರೋಟೋಕಾಲ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಆಗಿದೆ.',
      Bengali:
        'TCP/IP হলো ইন্টারনেটের চার স্তরের প্রোটোকল যা নির্ভরযোগ্যভাবে প্যাকেট আদান-প্রদান নিশ্চিত করে।',
      Marathi:
        'TCP/IP हा इंटरनेटचा पायाभूत चार-स्तरांचा नेटवर्क प्रोटोकॉल संच आहे.',
      Gujarati:
        'TCP/IP એ ઇન્ટરનેટ સંચાર માટેનો ચાર સ્તરીય પ્રોટોકોલ સમૂહ છે.',
      Punjabi:
        'TCP/IP ਇੰਟਰਨੈੱਟ ਸੰਚਾਰ ਲਈ ਚਾਰ-ਪੱਧਰੀ ਪ੍ਰੋਟੋਕੋਲ ਸੂਟ ਹੈ।',
      Malayalam:
        'TCP/IP എന്നത് ഇന്റർനെറ്റ് ആശയവിനിമയത്തിന്റെ അടിസ്ഥാന പ്രോട്ടോക്കോൾ ഘടനയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'TCP/IP నెట్‌వర్కింగ్ సూట్‌ను అక్షరాలా అనువదించకూడదు. ఇది అంతర్జాతీయ ఇంటర్నెట్ ప్రమాణం.',
      Hindi:
        'TCP/IP को मूल रूप में ही समझें; यह वैश्विक नेटवर्किंग का मानक प्रोटोकॉल है।',
      Tamil:
        'TCP/IP என்ற சொல்லை தொழில்நுட்பப் பெயராகவே பயன்படுத்த வேண்டும்.',
      Kannada:
        'TCP/IP ತಾಂತ್ರಿಕ ಹೆಸರನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'TCP/IP অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'TCP/IP तांत्रिक इंग्रजीतच वापरावे.',
      Gujarati:
        'TCP/IP શબ્દ માનક છે.',
      Punjabi:
        'TCP/IP ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'TCP/IP സാങ്കേതിക പദമായി നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'TCP/IP (టి.సి.పి/ఐ.పి నెట్‌వర్క్ ప్రోటోకాల్)',
      Hindi: 'TCP/IP (टीसीपी/आईपी प्रोटोकॉल)',
      Tamil: 'TCP/IP (டிசிபி/ஐபி)',
      Kannada: 'TCP/IP (ಟಿಸಿಪಿ/ಐಪಿ)',
      Bengali: 'TCP/IP (টিসিপি/আইপি)',
      Marathi: 'TCP/IP (टीसीपी/आयपी)',
      Gujarati: 'TCP/IP (ટીસીપી/આઈપી)',
      Punjabi: 'TCP/IP (ਟੀਸੀਪੀ/ਆਈਪੀ)',
      Malayalam: 'TCP/IP (ടിസിപി/ഐപി)',
    },
    technicalExample: `// TCP 3-Way Handshake Connection Sequence:
// Host A (Client) -----> [SYN, Seq=100] ------------> Host B (Server)
// Host A <---------- [SYN-ACK, Seq=300, Ack=101] ---- Host B
// Host A --------------> [ACK, Ack=301] --------------> Host B
// [Established]: Reliable full-duplex socket stream active`,
  },

  compiler: {
    englishTerm: 'Compiler',
    subject: 'Programming',
    aliases: ['compiler', 'కంపైలర్', 'कंपाइलर', 'கம்பைலர்', 'ಕಂಪೈಲರ್', 'কম্পাইলার'],
    technicalMeaningEn:
      'A Compiler is a specialized system software translation tool that parses high-level programming language statements and translates them into native low-level machine code, assembly, or bytecode through lexical analysis, syntax parsing, semantic analysis, intermediate representation (IR) optimization, and code generation.',
    explanationEn:
      'Preserve Compiler. Do not translate literally as dictionary compiler or book editor.',
    technicalMeaningByLanguage: {
      Telugu:
        'కంపైలర్ (Compiler) అనేది ఒక అధునాతన సిస్టమ్ సాఫ్ట్‌వేర్. ఇది మానవులు సులభంగా రాసే హై-లెవల్ ప్రోగ్రామింగ్ కోడ్‌ను (C, C++, Java) కంప్యూటర్ ప్రాసెసర్ నేరుగా అర్థం చేసుకుని అమలు చేయగల లో-లెవల్ మెషిన్ కోడ్ (బైనరీ కోడ్) లోకి లెక్సికల్, సింటాక్స్ మరియు సెమాంటిక్ దశల ద్వారా సంపూర్ణంగా అనువదిస్తుంది.',
      Hindi:
        'कंपाइलर (Compiler) एक विशेष सिस्टम सॉफ़्टवेयर है जो उच्च-स्तरीय प्रोग्रामिंग भाषा (C, C++, Java) के संपूर्ण स्रोत कोड को निष्पादन से पहले मशीन कोड या बाइटकोड में अनुवादित करता है।',
      Tamil:
        'கம்பைலர் (Compiler) என்பது உயர்நிலை நிரலாக்க மொழியின் குறியீட்டை கணினி இயக்கும் இயந்திர மொழியாக மாற்றும் ஒரு கணினி மென்பொருளாகும்.',
      Kannada:
        'ಕಂಪೈಲರ್ (Compiler) ಎನ್ನುವುದು ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆಯ ಕೋಡ್ ಅನ್ನು ಪ್ರೊಸೆಸರ್ ಕಾರ್ಯಗತಗೊಳಿಸಬಹುದಾದ ಮೆಷಿನ್ ಕೋಡ್ ಆಗಿ ಪರಿವರ್ತಿಸುವ ಸಾಫ್ಟ್‌ವೇರ್ ಆಗಿದೆ.',
      Bengali:
        'কম্পাইলার হলো একটি সিস্টেম সফটওয়্যার যা হাই-লেভেল সোর্স কোডকে সরাসরি লো-লেভেল মেশিন কোডে রূপান্তর করে।',
      Marathi:
        'कंपाइलर (Compiler) हे हाय-लेव्हल प्रोग्रामिंग कोडचे मशीन कोडमध्ये रूपांतर करणारे सिस्टीम सॉफ्टवेअर आहे.',
      Gujarati:
        'કમ્પાઇલર એ હાઇ લેવલ પ્રોગ્રામિંગ કોડને મશીન કોડમાં રૂપાંતરિત કરતું સોફ્ટવેર છે.',
      Punjabi:
        'ਕੰਪਾਈਲਰ ਹਾਈ ਲੈਵਲ ਕੋਡ ਨੂੰ ਮਸ਼ੀਨ ਕੋਡ ਵਿੱਚ ਬਦਲਣ ਵਾਲਾ ਸਾਫਟਵੇਅਰ ਹੈ।',
      Malayalam:
        'കംപൈലർ എന്നത് പ്രോഗ്രാമിംഗ് കോഡിനെ മെഷീൻ കോഡാക്കി മാറ്റുന്ന സിസ്റ്റം സോഫ്റ്റ്‌വെയറാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Compiler పదాన్ని ఎల్లప్పుడూ సాంకేతిక ఇంగ్లీష్ లేదా కంపైలర్ అని పిలవాలి. పుస్తక సంకలనకర్త అని అనువదించకూడదు.',
      Hindi:
        'Compiler को पुस्तक संकलनकर्ता न समझें; यह कोड अनुवादक सिस्टम सॉफ़्टवेयर है।',
      Tamil:
        'Compiler என்ற சொல்லை கணினி அறிவியல் சூழലில் அப்படியே பயன்படுத்தவும்.',
      Kannada:
        'Compiler ಪದವನ್ನು ತಾಂತ್ರಿಕವಾಗಿಯೇ ಬಳಸಿ.',
      Bengali:
        'Compiler শব্দটি অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Compiler तांत्रिक इंग्रजीतच वापरावा.',
      Gujarati:
        'Compiler શબ્દ કોડિંગ માટે માનક છે.',
      Punjabi:
        'Compiler ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Compiler സാങ്കേതിക പദമായി നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Compiler (కంపైలర్ - కోడ్ అనువాద సాఫ్ట్‌వేర్)',
      Hindi: 'Compiler (कंपाइलर - मशीन कोड अनुवादक)',
      Tamil: 'Compiler (கம்பைலர்)',
      Kannada: 'Compiler (ಕಂಪೈಲರ್)',
      Bengali: 'Compiler (কম্পাইলার)',
      Marathi: 'Compiler (कंपाइलर)',
      Gujarati: 'Compiler (કમ્પાઇલર)',
      Punjabi: 'Compiler (ਕੰਪਾਈਲਰ)',
      Malayalam: 'Compiler (കംപൈലർ)',
    },
    technicalExample: `// LLVM Clang Compiler Pipeline:
$ clang -O3 -Wall main.c -o application_binary
// 1. Preprocessor -> main.i
// 2. Lexical & AST Parser -> Abstract Syntax Tree
// 3. LLVM IR Optimizer -> Optimized Intermediate Representation
// 4. Machine Code Generator -> ELF/Mach-O Binary Executable`,
  },

  socket: {
    englishTerm: 'Socket',
    subject: 'Computer Networks',
    aliases: ['socket', 'network socket', 'సాకెట్', 'सॉकेट', 'சாக்கெட்', 'ಸಾಕೆಟ್', 'সকেট'],
    technicalMeaningEn:
      'A Network Socket is an operating system abstraction representing a bidirectional communication endpoint in an IP network, defined by the 5-tuple: (Source IP, Source Port, Destination IP, Destination Port, Protocol).',
    explanationEn:
      'Preserve Socket. Do not translate as electrical wall socket/plughole.',
    technicalMeaningByLanguage: {
      Telugu:
        'నెట్‌వర్క్ సాకెట్ (Socket) అనేది ఆపరేటింగ్ సిస్టమ్‌లోని ఒక ఎండ్-పాయింట్ అబ్‌స్ట్రాక్షన్. ఇది కంప్యూటర్ నెట్‌వర్క్‌లో రెండు ప్రాసెస్‌ల మధ్య ద్వంద్వ దిశా సంభాషణను (Bidirectional Communication) సాధ్యం చేస్తుంది. ప్రతి సాకెట్ IP అడ్రస్ మరియు పోర్ట్ నంబర్ కలయికతో గుర్తించబడుతుంది.',
      Hindi:
        'नेटवर्क सॉकेट (Socket) ऑपरेटिंग सिस्टम का एक अमूर्त रूप है जो आईपी नेटवर्क पर चलने वाली दो प्रक्रियाओं के बीच द्विदिशीय संचार लिंक (Bi-directional Communication Link) का अंतिम बिंदु होता है। इसे IP Address और Port Number के संयोजन से पहचाना जाता है।',
      Tamil:
        'சாக்கெட் (Socket) என்பது நெட்வொர்க்கில் இயங்கும் இரண்டு செயல்முறைகளுக்கு இடையே தகவல்களைப் பரிமாற உதவும் ஒரு முனையமாகும் (Endpoint).',
      Kannada:
        'ನೆಟ್‌ವರ್ಕ್ ಸಾಕೆಟ್ (Socket) ಎನ್ನುವುದು ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಎರಡು ಪ್ರಕ್ರಿಯೆಗಳ ನಡುವೆ ದ್ವಿಮುಖ ಸಂವಹನ ನಡೆಸಲು ಬಳಸುವ ಎಂಡ್‌ಪಾಯಿಂಟ್ ಆಗಿದೆ.',
      Bengali:
        'নেটওয়ার্ক সকেট হলো আইপি নেটওয়ার্কে দুটি প্রসেসের মধ্যে যোগাযোগের একটি এন্ডপয়েন্ট।',
      Marathi:
        'नेटवर्क सॉकेट (Socket) हे नेटवर्कवरील दोन प्रोसेसमधील संवादाचे शेवटचे टोक (Endpoint) असते.',
      Gujarati:
        'નેટવર્ક સોકેટ એ નેટવર્કમાં બે પ્રક્રિયાઓ વચ્ચે સંચાર માટેનો એન્ડપોઇન્ટ છે.',
      Punjabi:
        'ਨੈੱਟਵਰਕ ਸਾਕਟ ਨੈੱਟਵਰਕ ਉੱਤੇ ਦੋ ਪ੍ਰਕਿਰਿਆਵਾਂ ਵਿਚਕਾਰ ਸੰਚਾਰ ਦਾ ਅੰਤਮ ਬਿੰਦੂ ਹੈ।',
      Malayalam:
        'നെറ്റ്‌വർക്ക് സോക്കറ്റ് എന്നത് രണ്ട് പ്രക്രിയകൾ തമ്മിലുള്ള ആശയവിനിമയത്തിന്റെ അവസാന ബിന്ദുവാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Socket ని కరెంటు ప్లగ్ లేదా గోడ సాకెట్ అని అనువదించకూడదు. కంప్యూటర్ నెట్‌వర్క్‌లో ఇది IP + Port కమ్యూనికేషన్ ఎండ్‌పాయింట్.',
      Hindi:
        'Socket को बिजली का प्लग न समझें; यह IP और Port का नेटवर्क संचार एंडपॉइंट है।',
      Tamil:
        'Socket என்ற சொல்லை மின்சார சாக்கெட் உடன் குழப்பக் கூடாது.',
      Kannada:
        'Socket ಪದವನ್ನು ವಿದ್ಯುತ್ ಸಾಕೆಟ್ ಎಂದು ತಪ್ಪಾಗಿ ಗ್ರಹಿಸಬಾರದು.',
      Bengali:
        'সকেটকে বৈদ্যুতিক প্লাগের সাথে গুলিয়ে ফেলা যাবে না।',
      Marathi:
        'Socket चा अर्थ विजेचा सॉकेट असा करू नये.',
      Gujarati:
        'Socket ને વીજળીના સોકેટ સાથે ભેળવવું નહીં.',
      Punjabi:
        'Socket ਨੂੰ ਬਿਜਲੀ ਦਾ ਪਲੱਗ ਨਾ ਸਮਝੋ।',
      Malayalam:
        'Socket എന്നത് ഇലക്ട്രിക്കൽ സോക്കറ്റ് അല്ല.',
    },
    transliterations: {
      Telugu: 'Socket (సాకెట్ - నెట్‌వర్క్ ఎండ్‌పాయింట్)',
      Hindi: 'Socket (सॉकेट - नेटवर्क संचार एंडपॉइंट)',
      Tamil: 'Socket (சாக்கெட்)',
      Kannada: 'Socket (ಸಾಕೆಟ್)',
      Bengali: 'Socket (সকেট)',
      Marathi: 'Socket (सॉकेट)',
      Gujarati: 'Socket (સોકેટ)',
      Punjabi: 'Socket (ਸਾਕਟ)',
      Malayalam: 'Socket (സോക്കറ്റ്)',
    },
    technicalExample: `// Python TCP Socket Server
import socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 8080))
server.listen(5)
print("Listening on 0.0.0.0:8080...")
client_socket, address = server.accept()
client_socket.sendall(b"HTTP/1.1 200 OK\\r\\n\\r\\nHello Connected Client")`,
  },

  stack: {
    englishTerm: 'Stack',
    subject: 'Data Structures',
    aliases: ['stack', 'స్టాక్', 'स्टैक', 'ஸ்டாக்', 'ಸ್ಟ್ಯಾಕ್', 'স্ট্যাক'],
    technicalMeaningEn:
      'A Stack is a linear abstract data structure governed by the LIFO (Last-In, First-Out) principle, restricting element insertion (push) and deletion (pop) strictly to a single extremity called the top of the stack.',
    explanationEn:
      'Preserve Stack. Translating as hay stack or brick pile obscures computer call stack and memory layout concepts.',
    technicalMeaningByLanguage: {
      Telugu:
        'స్టాక్ (Stack) అనేది LIFO (Last-In, First-Out) సూత్రంపై పనిచేసే సరళ డేటా స్ట్రక్చర్ (Linear Data Structure). ఇందులో అంశాలను జోడించడం (Push) మరియు తొలగించడం (Pop) రెండూ కేవలం స్టాక్ పైభాగం (Top) నుండి మాత్రమే జరుగుతాయి. కంప్యూటర్ ఆర్కిటెక్చర్‌లో ఫంక్షన్ కాల్స్ మరియు లోకల్ వేరియబుల్స్ నిర్వహణకు ఇది ప్రాథమిక సాధనం.',
      Hindi:
        'स्टैक (Stack) LIFO (लास्ट-इन, फर्स्ट-आउट) सिद्धांत पर आधारित एक रैखिक डेटा संरचना है, जिसमें केवल शीर्ष (Top) से ही तत्वों को जोड़ना (Push) और हटाना (Pop) संभव होता है। यह फ़ंक्शन कॉल और मेमोरी प्रबंधन का आधार है।',
      Tamil:
        'ஸ்டாக் (Stack) என்பது LIFO (Last-In, First-Out) கோட்பாட்டின் அடிப்படையில் இயங்கும் ஒரு நேரியல் தரவு கட்டமைப்பாகும்.',
      Kannada:
        'ಸ್ಟ್ಯಾಕ್ (Stack) ಎನ್ನುವುದು LIFO (Last-In, First-Out) ತತ್ವದ ಮೇಲೆ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ರೇಖೀಯ ಡೇಟಾ ರಚನೆಯಾಗಿದೆ.',
      Bengali:
        'স্ট্যাক হলো LIFO (Last-In, First-Out) নীতির ওপর ভিত্তি করে তৈরি একটি লিনিয়ার ডেটা স্ট্রাকচার।',
      Marathi:
        'स्टॅक (Stack) ही LIFO तत्त्वावर काम करणारी लीनियर डेटा रचना आहे.',
      Gujarati:
        'સ્ટેક (Stack) એ LIFO સિદ્ધાંત પર કાર્ય કરતું લીનિયર ડેટા સ્ટ્રક્ચર છે.',
      Punjabi:
        'ਸਟੈਕ (Stack) LIFO ਸਿਧਾਂਤ ਉੱਤੇ ਕੰਮ ਕਰਨ ਵਾਲਾ ਲੀਨੀਅਰ ਡਾਟਾ ਸਟ੍ਰਕਚਰ ਹੈ।',
      Malayalam:
        'സ്റ്റാക്ക് (Stack) എന്നത് LIFO തത്വത്തിൽ പ്രവർത്തിക്കുന്ന ഡാറ്റാ ഘടനയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Stack పదాన్ని ఎల్లప్పుడూ సాంకేతిక ఇంగ్లీష్ లేదా స్టాక్ అని పిలవాలి. గడ్డి వామి లేదా ఇటుకల కుప్ప అని అనువదించకూడదు.',
      Hindi:
        'Stack को ईंटों का ढेर या तिनकों का गट्ठर न कहें; यह मेमोरी और डेटा संरचना का LIFO सिद्धांत है।',
      Tamil:
        'Stack என்ற சொல்லை தொழில்நுட்பமாகவே பயன்படுத்தவும்.',
      Kannada:
        'Stack ಪದವನ್ನು ತಾಂತ್ರಿಕವಾಗಿಯೇ ಬಳಸಿ.',
      Bengali:
        'Stack অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Stack तांत्रिक संज्ञेतच वापरावे.',
      Gujarati:
        'Stack શબ્દ કોડિંગ માટે પ્રમાણભૂત છે.',
      Punjabi:
        'Stack ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Stack സാങ്കേതിക പദമായി നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Stack (స్టాక్ - LIFO డేటా స్ట్రక్చర్)',
      Hindi: 'Stack (स्टैक - LIFO डेटा संरचना)',
      Tamil: 'Stack (ஸ்டாக்)',
      Kannada: 'Stack (ಸ್ಟ್ಯಾಕ್)',
      Bengali: 'Stack (স্ট্যাক)',
      Marathi: 'Stack (स्टॅक)',
      Gujarati: 'Stack (સ્ટેક)',
      Punjabi: 'Stack (ਸਟੈਕ)',
      Malayalam: 'Stack (സ്റ്റാക്ക്)',
    },
    technicalExample: `// Stack Implementation with Array in TypeScript
class Stack<T> {
    private items: T[] = [];
    push(element: T): void { this.items.push(element); }
    pop(): T | undefined { return this.items.pop(); }
    peek(): T | undefined { return this.items[this.items.length - 1]; }
    isEmpty(): boolean { return this.items.length === 0; }
}`,
  },

  queue: {
    englishTerm: 'Queue',
    subject: 'Data Structures',
    aliases: ['queue', 'క్యూ', 'क्यू', 'கியூ', 'ಕ್ಯೂ', 'কিউ'],
    technicalMeaningEn:
      'A Queue is a linear abstract data structure that operates under the FIFO (First-In, First-Out) principle, inserting new elements at the rear (enqueue) and removing existing elements from the front (dequeue).',
    explanationEn:
      'Preserve Queue. Do not translate as standing in a cinema or bus line; in computing, it is an essential scheduling buffer.',
    technicalMeaningByLanguage: {
      Telugu:
        'క్యూ (Queue) అనేది FIFO (First-In, First-Out) సూత్రంపై ఆధారపడిన సరళ డేటా స్ట్రక్చర్. ఇందులో అంశాలు వెనుక భాగం (Rear/Enqueue) నుండి ప్రవేశిస్తాయి మరియు ముందు భాగం (Front/Dequeue) నుండి బయటకు వస్తాయి. ఆపరేటింగ్ సిస్టమ్‌లో ప్రాసెస్ షెడ్యూలింగ్ మరియు నెట్‌వర్క్ బఫరింగ్‌కు ఇది వెన్నెముక.',
      Hindi:
        'कतार या कतार संरचना (Queue) FIFO (फर्स्ट-इन, फर्स्ट-आउट) सिद्धांत पर आधारित एक रैखिक डेटा संरचना है, जिसमें तत्व पीछे (Rear/Enqueue) से जोड़े जाते हैं और आगे (Front/Dequeue) से हटाए जाते हैं।',
      Tamil:
        'கியூ (Queue) என்பது FIFO (First-In, First-Out) கோட்பாட்டில் செயல்படும் வரிசைப்படுத்தப்பட்ட தரவு கட்டமைப்பாகும்.',
      Kannada:
        'ಕ್ಯೂ (Queue) ಎಂಬುದು FIFO (First-In, First-Out) ತತ್ವದ ಮೇಲೆ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ರೇಖೀಯ ಡೇಟಾ ರಚನೆಯಾಗಿದೆ.',
      Bengali:
        'কিউ হলো FIFO (First-In, First-Out) নীতিতে পরিচালিত একটি রৈখিক ডেটা স্ট্রাকচার।',
      Marathi:
        'क्यु (Queue) ही FIFO तत्त्वावर चालणारी लीनियर डेटा रचना आहे.',
      Gujarati:
        'કતાર (Queue) એ FIFO સિદ્ધાંત પર કાર્ય કરતું ડેટા સ્ટ્રક્ચર છે.',
      Punjabi:
        'ਕਤਾਰ (Queue) FIFO ਸਿਧਾਂਤ ਉੱਤੇ ਕੰਮ ਕਰਨ ਵਾਲਾ ਲੀਨੀਅਰ ਡਾਟਾ ਸਟ੍ਰਕਚਰ ਹੈ।',
      Malayalam:
        'ക്യൂ (Queue) എന്നത് FIFO തത്വത്തിൽ പ്രവർത്തിക്കുന്ന രേഖീയ ഡാറ്റാ ഘടനയാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Queue ని కంప్యూటింగ్ పదంగానే వాడాలి. బస్సు లేదా సినిమా లైన్ తో పోల్చరాదు.',
      Hindi:
        'Queue को डेटा संरचना के रूप में समझें; यह जॉब शेड्यूलिंग और मैसेज बफर का आधार है।',
      Tamil:
        'Queue என்ற சொல்லை தொழில்நுட்பமாகவே பயன்படுத்தவும்.',
      Kannada:
        'Queue ಪದವನ್ನು ತಾಂತ್ರಿಕವಾಗಿಯೇ ಬಳಸಿ.',
      Bengali:
        'Queue অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Queue तांत्रिक संज्ञेतच वापरावे.',
      Gujarati:
        'Queue શબ્દ પ્રમાણભૂત છે.',
      Punjabi:
        'Queue ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Queue സാങ്കേതിക പദമായി നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Queue (క్యూ - FIFO డేటా స్ట్రక్చర్)',
      Hindi: 'Queue (क्यू - FIFO डेटा संरचना)',
      Tamil: 'Queue (கியூ)',
      Kannada: 'Queue (ಕ್ಯೂ)',
      Bengali: 'Queue (কিউ)',
      Marathi: 'Queue (क्यु)',
      Gujarati: 'Queue (કતાર / ક્યૂ)',
      Punjabi: 'Queue (ਕਿਊ)',
      Malayalam: 'Queue (ക്യൂ)',
    },
    technicalExample: `// Queue Implementation with Enqueue/Dequeue in TypeScript
class Queue<T> {
    private items: T[] = [];
    enqueue(item: T): void { this.items.push(item); }
    dequeue(): T | undefined { return this.items.shift(); }
    front(): T | undefined { return this.items[0]; }
    size(): number { return this.items.length; }
}`,
  },

  knapsack: {
    englishTerm: 'Knapsack Problem',
    subject: 'Algorithms',
    aliases: ['knapsack', 'knapsack problem', 'న్యాప్‌సాక్', 'नैपसैक', 'நாப்சாக்', 'ನ್ಯಾಪ್‌ಸ್ಯಾಕ್'],
    technicalMeaningEn:
      'The Knapsack Problem is a classic combinatorial optimization NP-complete problem where, given a set of items each with a weight and a value, the objective is to determine the optimal subset of items to include in a collection so that the total weight does not exceed a designated capacity and the total value is maximized.',
    explanationEn:
      'Preserve Knapsack Problem. Do not translate as cloth schoolbag or haversack.',
    technicalMeaningByLanguage: {
      Telugu:
        'న్యాప్‌సాక్ సమస్య (Knapsack Problem) అనేది అల్గారిథమ్స్ మరియు కాంబినేటోరియల్ ఆప్టిమైజేషన్‌లో ప్రసిద్ధ సమస్య. నిర్దిష్ట బరువు సామర్థ్యం (Capacity) కలిగిన ఒక బ్యాగ్‌లో, గరిష్ట విలువ (Value) వచ్చేలా వస్తువులను ఎలా ఎంచుకోవాలో ఇది డైనమిక్ ప్రోగ్రామింగ్ (Dynamic Programming - O(nW)) ద్వారా గణిస్తుంది.',
      Hindi:
        'नैपसैक समस्या (Knapsack Problem) कॉम्बिनेटोरियल ऑप्टिमाइज़ेशन की एक शास्त्रीय समस्या है जिसमें सीमित वजन क्षमता वाले बैग में अधिकतम कुल मूल्य प्राप्त करने के लिए वस्तुओं के सर्वोत्तम उपसमूह का चयन किया जाता है।',
      Tamil:
        'நாப்சாக் பிரச்சனை (Knapsack Problem) என்பது கொடுக்கப்பட்ட எடை அளவுக்குள் அதிகபட்ச மதிப்பைப் பெறும் வகையில் பொருட்களைத் தேர்ந்தெடுக்கும் உகப்பாக்கப் பிரச்சனையாகும்.',
      Kannada:
        'ನ್ಯಾಪ್‌ಸ್ಯಾಕ್ ಸಮಸ್ಯೆ (Knapsack Problem) ಎನ್ನುವುದು ನಿರ್ದಿಷ್ಟ ತೂಕದ ಮಿತಿಯಲ್ಲಿ ಗರಿಷ್ಠ ಮೌಲ್ಯವನ್ನು ಪಡೆಯಲು ವಸ್ತುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡುವ ಅಲ್ಗಾರಿದಮ್ ಸಮಸ್ಯೆಯಾಗಿದೆ.',
      Bengali:
        'ন্যাপস্যাক সমস্যা হলো অপ্টিমাইজেশনের একটি ক্লাসিক সমস্যা যেখানে সীমিত ওজনের মধ্যে সর্বোচ্চ মান অর্জনের জন্য আইটেম নির্বাচন করা হয়।',
      Marathi:
        'नॅपसॅक समस्या (Knapsack Problem) ही दिलेल्या वजन क्षमतेत जास्तीत जास्त मूल्य मिळवण्यासाठी वस्तूंची निवड करण्याची अल्गोरिदम समस्या आहे.',
      Gujarati:
        'નેપસેક સમસ્યા એ મહત્તમ મૂલ્ય મેળવવા માટે વસ્તુઓની પસંદગી કરવાની ઓપ્ટિમાઇઝેશન સમસ્યા છે.',
      Punjabi:
        'ਨੈਪਸੈਕ ਸਮੱਸਿਆ ਸੀਮਤ ਭਾਰ ਵਿੱਚ ਵੱਧ ਤੋਂ ਵੱਧ ਮੁੱਲ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਵਸਤਾਂ ਦੀ ਚੋਣ ਕਰਨ ਦਾ ਐਲਗੋਰਿਦਮ ਹੈ।',
      Malayalam:
        'നാപ്സാക്ക് പ്രശ്നം (Knapsack Problem) എന്നത് പരിമിതമായ ഭാരത്തിൽ പരമാവധി മൂല്യം നേടുന്നതിനുള്ള അൽഗോരിതം പ്രശ്നമാണ്.',
    },
    explanationByLanguage: {
      Telugu:
        'Knapsack Problem ని సాంకేతిక ఇంగ్లీష్ లేదా న్యాప్‌సాక్ అని పిలవాలి. స్కూలు బ్యాగు లేదా సంచి సమస్య అని అనువదించకూడదు.',
      Hindi:
        'Knapsack को स्कूली बस्ता न समझें; यह डायनेमिक प्रोग्रामिंग का महत्वपूर्ण एल्गोरिदम मॉडल है।',
      Tamil:
        'Knapsack Problem என்ற பெயரை அப்படியே பயன்படுத்த வேண்டும்.',
      Kannada:
        'Knapsack Problem ತಾಂತ್ರಿಕ ಹೆಸರನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'Knapsack Problem অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Knapsack Problem तांत्रिक संदर्भातच ठेवावे.',
      Gujarati:
        'Knapsack Problem શબ્દ માનક છે.',
      Punjabi:
        'Knapsack Problem ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Knapsack Problem സാങ്കേതികമായി തന്നെ നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Knapsack Problem (న్యాప్‌సాక్ సమస్య - ఆప్టిమైజేషన్ అల్గారిథమ్)',
      Hindi: 'Knapsack Problem (नैपसैक समस्या - कॉम्बिनेटोरियल ऑप्टिमाइज़ेशन)',
      Tamil: 'Knapsack Problem (நாப்சாக் பிரச்சனை)',
      Kannada: 'Knapsack Problem (ನ್ಯಾಪ್‌ಸ್ಯಾಕ್ ಸಮಸ್ಯೆ)',
      Bengali: 'Knapsack Problem (ন্যাপস্যাক সমস্যা)',
      Marathi: 'Knapsack Problem (नॅपसॅक समस्या)',
      Gujarati: 'Knapsack Problem (નેપસેક સમસ્યા)',
      Punjabi: 'Knapsack Problem (ਨੈਪਸੈਕ ਸਮੱਸਿਆ)',
      Malayalam: 'Knapsack Problem (നാപ്സാക്ക് പ്രശ്നം)',
    },
    technicalExample: `// 0/1 Knapsack Problem with Dynamic Programming in JavaScript
function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}`,
  },

  b_tree: {
    englishTerm: 'B-Tree Indexing',
    subject: 'Database Systems',
    aliases: ['b-tree', 'b-tree indexing', 'btree', 'b tree', 'బి-ట్రీ', 'बी-ट्री', 'பி-ட்ரீ', 'ಬಿ-ಟ್ರೀ', 'বি-ট্রি'],
    technicalMeaningEn:
      'A B-Tree is a self-balancing M-way search tree data structure optimized for storage systems that read and write large blocks of data. It maintains sorted data with logarithmic time complexity O(log N) for search, sequential access, insertions, and deletions by ensuring all leaf nodes remain at the identical depth.',
    explanationEn:
      'Preserve "B-Tree" in technical computer science. Never translate literally as botanical tree or wood branch; in database engineering, it is the primary indexing paradigm powering relational engines like MySQL InnoDB and PostgreSQL.',
    technicalMeaningByLanguage: {
      Telugu:
        'బి-ట్రీ (B-Tree) అనేది సెల్ఫ్-బ్యాలెన్సింగ్ (స్వయంచాలక సంతులన) బహుళ-మార్గ శోధన ట్రీ (M-way Search Tree). డిస్క్ మరియు డేటాబేస్ స్టోరేజ్‌లో పెద్ద బ్లాకుల సమాచారాన్ని సమర్థవంతంగా నిల్వ చేయడానికి మరియు సెర్చ్ చేయడానికి ఇది రూపొందించబడింది. ఇది అన్ని ఆకు నోడ్‌లను (Leaf Nodes) ఒకే లోతులో (Depth) ఉంచడం ద్వారా O(log N) సమయంలో డేటా శోధన మరియు శ్రేణి విచారణలకు (Range Queries) హామీ ఇస్తుంది.',
      Hindi:
        'बी-ट्री (B-Tree) एक स्व-संतुलित बहु-मार्गी खोज वृक्ष (Self-Balancing M-way Search Tree) है जिसे डेटाबेस और फ़ाइल सिस्टम में डिस्क I/O संचालन को न्यूनतम करने के लिए डिज़ाइन किया गया है। यह सभी लीफ नोड्स को समान गहराई पर रखकर O(log N) समय में खोज, प्रविष्टि और विलोपन सुनिश्चित करता है।',
      Tamil:
        'பி-ட்ரீ (B-Tree) என்பது தரவுத்தளங்களில் (Databases) தேடல் நேரத்தை O(log N) ஆகக் குறைக்கப் பயன்படும் சுய-சமநிலை தேடல் மர அமைப்பாகும். இது வட்டு நினைவகத்தில் (Disk Storage) தரவை விரைவாக மீட்டெடுக்க உதவுகிறது.',
      Kannada:
        'ಬಿ-ಟ್ರೀ (B-Tree) ಎಂಬುದು ಡೇಟಾಬೇಸ್ ಮತ್ತು ಫೈಲ್ ಸಿಸ್ಟಮ್‌ಗಳಲ್ಲಿ ಡಿಸ್ಕ್ ಪ್ರವೇಶವನ್ನು ಅತ್ಯುತ್ತಮವಾಗಿಸಲು ಬಳಸಲಾಗುವ ಸ್ವಯಂ-ಸಮತೋಲಿತ ಬಹು-ಮಾರ್ಗ ಹುಡುಕಾಟ ಮರದ (M-way Search Tree) ಡೇಟಾ ರಚನೆಯಾಗಿದೆ.',
      Bengali:
        'বি-ট্রি (B-Tree) হলো একটি স্ব-ভারসাম্যপূর্ণ বহু-মুখী সার্চ ট্রি যা ডেটাবেসে দ্রুত ডেটা ইনডেক্সিং এবং ও(লগ এন) জটিলতায় অনুসন্ধানের জন্য ডিজাইন করা হয়েছে।',
      Marathi:
        'बी-ट्री (B-Tree) ही डेटाबेस आणि फाइल सिस्टममध्ये जलद डेटा शोधण्यासाठी वापरली जाणारी सेल्फ-बॅलन्सिंग सर्च ट्री डेटा रचना आहे.',
      Gujarati:
        'બી-ટ્રી (B-Tree) એ ડેટાબેઝ ઇન્ડેક્સિંગ માટે વપરાતું સેલ્ફ-બેલેન્સિંગ સર્ચ ટ્રી છે જે O(log N) સમયમાં શોધ પરિણામો આપે છે.',
      Punjabi:
        'ਬੀ-ਟ੍ਰੀ (B-Tree) ਡਾਟਾਬੇਸ ਵਿੱਚ ਡਾਟਾ ਇੰਡੈਕਸਿੰਗ ਲਈ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਸਵੈ-ਸੰਤੁਲਿਤ ਸਰਚ ਟ੍ਰੀ ਡਾਟਾ ਸਟ੍ਰਕਚਰ ਹੈ।',
      Malayalam:
        'ഡാറ്റാബേസുകളിൽ ഡിസ്ക് ആക്സസ് വേഗത്തിലാക്കാൻ ഉപയോഗിക്കുന്ന സ്വയം-സന്തുലിത സെർച്ച് ട്രീയാണ് ബി-ട്രീ (B-Tree).',
    },
    explanationByLanguage: {
      Telugu:
        'B-Tree పదాన్ని ఎల్లప్పుడూ సాంకేతిక ఇంగ్లీష్ లేదా బి-ట్రీ అని పిలవాలి. చెట్టు లేదా కొమ్మ అని అనువదించకూడదు; డేటాబేస్‌లలో ఇది ఇండెక్సింగ్ వెన్నెముక.',
      Hindi:
        'B-Tree को वानस्पतिक पेड़ न समझें; डेटाबेस इंजीनियरिंग में यह डेटा इंडेक्सिंग का मुख्य स्तंभ है।',
      Tamil:
        'B-Tree என்ற சொல்லை கணினி அறிவியல் துறைசார் பெயராகவே பயன்படுத்த வேண்டும்.',
      Kannada:
        'B-Tree ತಾಂತ್ರಿಕ ಹೆಸರನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'B-Tree অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'B-Tree तांत्रिक संदर्भातच ठेवावे.',
      Gujarati:
        'B-Tree શબ્દ માનક છે.',
      Punjabi:
        'B-Tree ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'B-Tree സാങ്കേതികമായി തന്നെ നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'B-Tree Indexing (బి-ట్రీ ఇండెక్సింగ్)',
      Hindi: 'B-Tree Indexing (बी-ट्री इंडेक्सिंग)',
      Tamil: 'B-Tree Indexing (பி-ட்ரீ குறியீட்டு முறை)',
      Kannada: 'B-Tree Indexing (ಬಿ-ಟ್ರೀ ಇಂಡೆಕ್ಸಿಂಗ್)',
      Bengali: 'B-Tree Indexing (বি-ট্রি ইনডেক্সিং)',
      Marathi: 'B-Tree Indexing (बी-ट्री इंडेक्सिंग)',
      Gujarati: 'B-Tree Indexing (બી-ટ્રી ઇન્ડેક્સિંગ)',
      Punjabi: 'B-Tree Indexing (ਬੀ-ਟ੍ਰੀ ਇੰਡੈਕਸਿੰਗ)',
      Malayalam: 'B-Tree Indexing (ബി-ട്രീ ഇൻഡെക്സിംഗ്)',
    },
    technicalExample: `-- SQL B-Tree Composite Index Creation:
CREATE INDEX idx_student_enrollment 
ON Enrollments (course_id, student_id) 
USING BTREE;
-- B-Tree accelerates range scanning in O(log N) depth`,
  },

  virtual_memory: {
    englishTerm: 'Virtual Memory',
    subject: 'Operating Systems',
    aliases: ['virtual memory', 'paging', 'వర్చువల్ మెమరీ', 'वर्चुअल मेमोरी', 'மெய்நிகர் நினைவகம்', 'ವರ್ಚುವಲ್ ಮೆಮೊರಿ'],
    technicalMeaningEn:
      'Virtual Memory is a core operating system storage allocation scheme that maps process virtual address spaces to physical RAM pages and secondary swap storage via the Memory Management Unit (MMU) and page tables, providing process isolation and illusion of contiguous memory.',
    explanationEn:
      'Preserve Virtual Memory in computing. Translating as fake or imaginary memory creates false understanding of real paging hardware and MMU translations.',
    technicalMeaningByLanguage: {
      Telugu:
        'వర్చువల్ మెమరీ (Virtual Memory) అనేది ఆపరేటింగ్ సిస్టమ్‌లో భౌతిక RAM మరియు సెకండరీ డిస్క్ (Swap Space) కలయిక ద్వారా ప్రాసెస్‌లకు విస్తారమైన, నిరంతర చిరునామా స్థలాన్ని (Address Space) అందించే సాంకేతికత. MMU (మెమరీ మేనేజ్‌మెంట్ యూనిట్) మరియు పేజింగ్ (Paging) ద్వారా ఇది ప్రతి ప్రాసెస్‌కు ప్రత్యేక రక్షిత మెమరీని నిర్ధారిస్తుంది.',
      Hindi:
        'वर्चुअल मेमोरी (Virtual Memory) ऑपरेटिंग सिस्टम की एक मेमोरी प्रबंधन तकनीक है जो भौतिक रैम और डिस्क स्वैप स्पेस को मिलाकर प्रोसेस को निरंतर और पृथक वर्चुअल एड्रेस स्पेस प्रदान करती है। MMU हार्डवेयर पेज टेबल के माध्यम से वर्चुअल से फिजिकल एड्रेस का अनुवाद करता है।',
      Tamil:
        'மெய்நிகர் நினைவகம் (Virtual Memory) என்பது இயக்க முறைமை (OS) கணினியின் முதன்மை நினைவகத்தை விட பெரிய அளவிலான நிரல்களை இயக்க அனுமதிக்கும் நினைவக மேலாண்மை நுட்பமாகும்.',
      Kannada:
        'ವರ್ಚುವಲ್ ಮೆಮೊರಿ (Virtual Memory) ಎಂಬುದು ಪ್ರೊಸೆಸ್‌ಗಳಿಗೆ ಭೌತಿಕ RAM ಗಿಂತ ದೊಡ್ಡದಾದ ಪ್ರತ್ಯೇಕ ವಿಳಾಸ ಸ್ಥಳವನ್ನು ಒದಗಿಸುವ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್ ತಂತ್ರಜ್ಞಾನವಾಗಿದೆ.',
      Bengali:
        'ভার্চুয়াল মেমরি হলো অপারেটিং সিস্টেমের একটি কৌশল যা ফিজিক্যাল র‍্যামের সীমাবদ্ধতা কাটিয়ে ডিস্ক স্পেস ব্যবহার করে প্রক্রিয়াগুলিকে বড় মেমরি সরবরাহ করে।',
      Marathi:
        'व्हर्च्युअल मेमरी (Virtual Memory) हे ऑपरेटिंग सिस्टमचे मेमरी व्यवस्थापन तंत्र आहे जे प्रोसेसला स्वतंत्र अ‍ॅड्रेस स्पेस प्रदान करते.',
      Gujarati:
        'વર્ચ્યુઅલ મેમરી એ ઓપરેટિંગ સિસ્ટમની તકનીક છે જે પ્રોગ્રામને મોટી મેમરી સ્પેસ પૂરી પાડે છે.',
      Punjabi:
        'ਵਰਚੁਅਲ ਮੈਮੋਰੀ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦੀ ਤਕਨੀਕ ਹੈ ਜੋ ਭੌਤਿਕ ਰੈਮ ਨਾਲੋਂ ਵੱਡੀ ਮੈਮੋਰੀ ਸਪੇਸ ਦਿੰਦੀ ਹੈ।',
      Malayalam:
        'ഫിസിക്കൽ റാമിൽ ഒതുങ്ങാത്ത വലിയ പ്രോഗ്രാമുകൾ പ്രവർത്തിപ്പിക്കാൻ ഓപ്പറേറ്റിംഗ് സിസ്റ്റം ഉപയോഗിക്കുന്ന സാങ്കേതികവിദ്യയാണ് വെർച്വൽ മെമ്മറി.',
    },
    explanationByLanguage: {
      Telugu:
        'Virtual Memory ని ఊహాత్మక లేదా నకిలీ మెమరీ అని అనువదించకూడదు. ఇది MMU హార్డ్‌వేర్ ఆధారిత పేజింగ్ వ్యవస్థ.',
      Hindi:
        'Virtual Memory को काल्पनिक मेमोरी न कहें; यह OS और MMU हार्डवेयर द्वारा संचालित वास्तविक सुरक्षा तंत्र है।',
      Tamil:
        'Virtual Memory என்ற சொல்லை தொழில்நுட்பமாகவே பயன்படுத்தவும்.',
      Kannada:
        'Virtual Memory ತಾಂತ್ರಿಕ ಹೆಸರನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'Virtual Memory অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Virtual Memory तांत्रिक संदर्भातच ठेवावे.',
      Gujarati:
        'Virtual Memory શબ્દ માનક છે.',
      Punjabi:
        'Virtual Memory ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Virtual Memory സാങ്കേതികമായി തന്നെ നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Virtual Memory (వర్చువల్ మెమరీ - పేజింగ్ వ్యవస్థ)',
      Hindi: 'Virtual Memory (वर्चुअल मेमोरी - पेजिंग प्रबंधन)',
      Tamil: 'Virtual Memory (மெய்நிகர் நினைவகம்)',
      Kannada: 'Virtual Memory (ವರ್ಚುವಲ್ ಮೆಮೊರಿ)',
      Bengali: 'Virtual Memory (ভার্চুয়াল মেমরি)',
      Marathi: 'Virtual Memory (व्हर्च्युअल मेमरी)',
      Gujarati: 'Virtual Memory (વર્ચ્યુઅલ મેમરી)',
      Punjabi: 'Virtual Memory (ਵਰਚੁਅਲ ਮੈਮੋਰੀ)',
      Malayalam: 'Virtual Memory (വെർച്വൽ മെമ്മറി)',
    },
    technicalExample: `// Linux mmap syscall allocating virtual pages
#include <sys/mman.h>
void* page = mmap(NULL, 4096, PROT_READ | PROT_WRITE, 
                  MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
// Page fault triggers physical page frame mapping by OS kernel`,
  },

  acid: {
    englishTerm: 'ACID Properties',
    subject: 'Database Systems',
    aliases: ['acid', 'acid properties', 'ఆసిడ్ లక్షణాలు', 'एसिड गुण', 'அசிட் பண்புகள்', 'ಆಸಿಡ್ ಪ್ರಾಪರ್ಟೀಸ್'],
    technicalMeaningEn:
      'ACID is an acronym representing the four foundational transaction guarantees in relational database management systems: Atomicity (all operations commit or all rollback), Consistency (valid state transitions respecting constraints), Isolation (concurrent execution serializability), and Durability (committed changes persist across crashes).',
    explanationEn:
      'Preserve ACID. Translating as chemical acid (రసాయన ఆమ్లం / रासायनिक अम्ल) creates severe misconception in database theory.',
    technicalMeaningByLanguage: {
      Telugu:
        'ACID అనేది రిలేషనల్ డేటాబేస్ మేనేజ్‌మెంట్ సిస్టమ్స్ (RDBMS) లో లావాదేవీల (Transactions) విశ్వసనీయతను నిర్ధారించే నాలుగు ప్రాథమిక సూత్రాల సంక్షిప్త రూపం: Atomicity (అన్నీ జరగాలి లేదా ఏదీ జరగకూడదు), Consistency (నిబంధనలను ఉల్లంఘించని స్థిరత్వం), Isolation (సమాంతర లావాదేవీల వేర్పాటు), Durability (క్రాష్ అయినప్పటికీ కమిట్ అయిన డేటా శాశ్వతంగా భద్రపరచబడటం).',
      Hindi:
        'ACID रिलेशनल डेटाबेस मैनेजमेंट सिस्टम में ट्रांजैक्शन की विश्वसनीयता की गारंटी देने वाले चार स्तंभों का संक्षिप्त रूप है: Atomicity (पूर्णता या शून्यता), Consistency (डेटा अखंडता), Isolation (समवर्ती प्रक्रियाओं का पृथक्करण), और Durability (स्थायित्व)।',
      Tamil:
        'ACID என்பது தரவுத்தள பரிவர்த்தனைகளின் நம்பகத்தன்மையை உறுதி செய்யும் நான்கு முக்கிய பண்புகளாகும்: Atomicity, Consistency, Isolation, மற்றும் Durability.',
      Kannada:
        'ACID ಎಂಬುದು ಡೇಟಾಬೇಸ್ ವಹಿವಾಟುಗಳ ವಿಶ್ವಾಸಾರ್ಹತೆಯನ್ನು ಖಾತರಿಪಡಿಸುವ ನಾಲ್ಕು ಮೂಲಭೂತ ಗುಣಲಕ್ಷಣಗಳಾಗಿವೆ: Atomicity, Consistency, Isolation, ಮತ್ತು Durability.',
      Bengali:
        'ACID হলো ডেটাবেস লেনদেনের নির্ভরযোগ্যতা নিশ্চিত করার চারটি মূল বৈশিষ্ট্য: অ্যাটোমিসিটি, কনসিস্টেন্সি, আইসোলেশন এবং ডিউরেবিলিটি।',
      Marathi:
        'ACID हे डेटाबेस व्यवहारांची अचूकता आणि सुरक्षा राखणाऱ्या चार नियमांचे संक्षिप्त रूप आहे.',
      Gujarati:
        'ACID એ ડેટાબેઝ ટ્રાન્ઝેક્શનની વિશ્વસનીયતા માટેના ચાર મૂળભૂત નિયમો છે.',
      Punjabi:
        'ACID ਡਾਟਾਬੇਸ ਟ੍ਰਾਂਜੈਕਸ਼ਨਾਂ ਦੀ ਭਰੋਸੇਯੋਗਤਾ ਨੂੰ ਯਕੀਨੀ ਬਣਾਉਣ ਵਾਲੇ ਚਾਰ ਸਿਧਾਂਤ ਹਨ।',
      Malayalam:
        'ഡാറ്റാബേസ് ഇടപാടുകളുടെ സുരക്ഷിതത്വം ഉറപ്പാക്കുന്ന നാല് ഘടകങ്ങളാണ് ACID പ്രോപ്പർട്ടികൾ.',
    },
    explanationByLanguage: {
      Telugu:
        'ACID పదాన్ని ఎప్పుడూ ఆమ్లం లేదా రసాయనం అని అనువదించకూడదు. ఇది డేటాబేస్ లావాదేవీల విశ్వసనీయత కొలమానం.',
      Hindi:
        'ACID को रासायनिक अम्ल समझने की भूल न करें; यह RDBMS डेटा सुरक्षा का मानक संक्षेप है।',
      Tamil:
        'ACID என்ற சொல்லை வேதியியல் அமிலமாக மொழிபெயர்க்கக் கூடாது.',
      Kannada:
        'ACID ಪದವನ್ನು ರಾಸಾಯನಿಕ ಆಮ್ಲ ಎಂದು ತಪ್ಪಾಗಿ ಗ್ರಹಿಸಬಾರದು.',
      Bengali:
        'ACID কে রাসায়নিক অম্ল হিসেবে অনুবাদ করা যাবে না।',
      Marathi:
        'ACID चा अर्थ रासायनिक आम्ल असा करू नये.',
      Gujarati:
        'ACID ને રસાયણ શાસ્ત્રના એસિડ સાથે ન ભેળવવું.',
      Punjabi:
        'ACID ਨੂੰ ਕੈਮੀਕਲ ਤੇਜ਼ਾਬ ਨਾ ਸਮਝੋ।',
      Malayalam:
        'ACID എന്നത് രാസവസ്തുവായ ആസിഡ് അല്ല.',
    },
    transliterations: {
      Telugu: 'ACID Properties (ఆసిడ్ ప్రాపర్టీస్ - డేటాబేస్ లావాదేవీల సూత్రాలు)',
      Hindi: 'ACID Properties (एसिड गुण - डेटाबेस ट्रांजैक्शन सुरक्षा)',
      Tamil: 'ACID Properties (அசிட் பண்புகள்)',
      Kannada: 'ACID Properties (ಆಸಿಡ್ ಪ್ರಾಪರ್ಟೀಸ್)',
      Bengali: 'ACID Properties (এসিড প্রপার্টিজ)',
      Marathi: 'ACID Properties (अ‍ॅसिड गुणधर्म)',
      Gujarati: 'ACID Properties (એસિડ પ્રોપર્ટીઝ)',
      Punjabi: 'ACID Properties (ਐਸਿਡ ਗੁਣ)',
      Malayalam: 'ACID Properties (ആസിഡ് പ്രോപ്പർട്ടികൾ)',
    },
    technicalExample: `-- SQL Transaction adhering to ACID semantics:
BEGIN TRANSACTION;
UPDATE Accounts SET balance = balance - 500 WHERE id = 101;
UPDATE Accounts SET balance = balance + 500 WHERE id = 202;
COMMIT; -- Durably written to WAL disk log`,
  },

  garbage_collection: {
    englishTerm: 'Garbage Collection',
    subject: 'Programming Languages',
    aliases: ['garbage collection', 'gc', 'గార్బేజ్ కలెక్షన్', 'गार्बेज कलेक्शन', 'குப்பை சேகரிப்பு', 'ಗಾರ್ಬೇಜ್ ಕಲೆಕ್ಷನ್'],
    technicalMeaningEn:
      'Garbage Collection (GC) is an automated memory management runtime subsystem that identifies and reclaims dynamically allocated heap memory occupied by objects that are no longer reachable by any active reference chain in the running program.',
    explanationEn:
      'Preserve Garbage Collection. Translating as municipal street garbage sweeper obscures runtime heap tracking (Mark-and-Sweep, Generational GC).',
    technicalMeaningByLanguage: {
      Telugu:
        'గార్బేజ్ కలెక్షన్ (Garbage Collection - GC) అనేది జావా, జావాస్క్రిప్ట్ వంటి రన్‌టైమ్ ఎన్విరాన్‌మెంట్లలో ఆటోమేటిక్ మెమరీ మేనేజ్‌మెంట్ వ్యవస్థ. ప్రోగ్రామ్‌లో ఏ వేరియబుల్ లేదా రిఫరెన్స్ ద్వారా ఉపయోగించబడని (Unreachable Objects) హీప్ మెమరీని గుర్తించి, స్వయంచాలకంగా విడుదల చేసి తిరిగి వినియోగానికి సిద్ధం చేస్తుంది.',
      Hindi:
        'गार्बेज कलेक्शन (Garbage Collection) आधुनिक प्रोग्रामिंग रनटाइम (Java, Node.js, Go) में एक स्वचालित मेमोरी प्रबंधन प्रक्रिया है जो हीप मेमोरी में निष्क्रिय और अनुपयोगी वस्तुओं को खोजकर मेमोरी को पुनः मुक्त करती है।',
      Tamil:
        'குப்பை சேகரிப்பு (Garbage Collection) என்பது கணினி நிரல்களில் தேவையில்லாத நினைவகத்தை தானாகவே விடுவிக்கும் நினைவக மேலாண்மை அமைப்பாகும்.',
      Kannada:
        'ಗಾರ್ಬೇಜ್ ಕಲೆಕ್ಷನ್ (Garbage Collection) ಎನ್ನುವುದು ಪ್ರೋಗ್ರಾಂನಲ್ಲಿ ಬಳಕೆಯಾಗದ ಹೀಪ್ ಮೆಮೊರಿಯನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮರುಪಡೆಯುವ ಮೆಮೊರಿ ನಿರ್ವಹಣಾ ತಂತ್ರವಾಗಿದೆ.',
      Bengali:
        'গারবেজ কালেকশন হলো একটি স্বয়ংক্রিয় মেমরি ম্যানেজমেন্ট প্রক্রিয়া যা প্রোগ্রামের অব্যবহৃত হিপ মেমরি পুনরুদ্ধার করে।',
      Marathi:
        'गार्बेज कलेक्शन (Garbage Collection) ही प्रोग्राममधील न वापरलेली हीप मेमरी आपोआप मोकळी करणारी सिस्टीम आहे.',
      Gujarati:
        'ગાર્બેજ કલેક્શન એ પ્રોગ્રામમાં બિનઉપયોગી મેમરીને આપમેળે ખાલી કરવાની પદ્ધતિ છે.',
      Punjabi:
        'ਗਾਰਬੇਜ ਕੁਲੈਕਸ਼ਨ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਅਣਵਰਤੀ ਹੀਪ ਮੈਮੋਰੀ ਨੂੰ ਖਾਲੀ ਕਰਨ ਦੀ ਆਟੋਮੈਟਿਕ ਪ੍ਰਣਾਲੀ ਹੈ।',
      Malayalam:
        'പ്രോഗ്രാമിൽ ആവശ്യമില്ലാത്ത മെമ്മറി യാന്ത്രികമായി വീണ്ടെടുക്കുന്ന പ്രക്രിയയാണ് ഗാർബേജ് കളക്ഷൻ.',
    },
    explanationByLanguage: {
      Telugu:
        'Garbage Collection ని మునిసిపాలిటీ చెత్త సేకరణ అని అనువదించకూడదు. ఇది రన్‌టైమ్ హీప్ మెమరీని ఆటోమేటిక్‌గా రీక్లెయిమ్ చేసే సాధనం.',
      Hindi:
        'Garbage Collection को कचरा बीनना न समझें; यह मेमोरी लीक रोकने वाला रनटाइम कंपोनेंट है।',
      Tamil:
        'Garbage Collection என்ற சொல்லை மென்பொருள் பொறியியலில் அப்படியே பயன்படுத்தவும்.',
      Kannada:
        'Garbage Collection ತಾಂತ್ರಿಕ ಹೆಸರನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'Garbage Collection অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Garbage Collection तांत्रिक संदर्भातच ठेवावे.',
      Gujarati:
        'Garbage Collection શબ્દ માનક છે.',
      Punjabi:
        'Garbage Collection ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Garbage Collection സാങ്കേതികമായി തന്നെ നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Garbage Collection (గార్బేజ్ కలెక్షన్ - ఆటోమేటిక్ మెమరీ రీక్లెయిమ్)',
      Hindi: 'Garbage Collection (गार्बेज कलेक्शन - स्वचालित मेमोरी शोधन)',
      Tamil: 'Garbage Collection (கார்பேஜ் கலெக்ஷன்)',
      Kannada: 'Garbage Collection (ಗಾರ್ಬೇಜ್ ಕಲೆಕ್ಷನ್)',
      Bengali: 'Garbage Collection (গারবেজ কালেকশন)',
      Marathi: 'Garbage Collection (गार्बेज कलेक्शन)',
      Gujarati: 'Garbage Collection (ગાર્બેજ કલેક્શન)',
      Punjabi: 'Garbage Collection (ਗਾਰਬੇਜ ਕੁਲੈਕਸ਼ਨ)',
      Malayalam: 'Garbage Collection (ഗാർബേജ് കളക്ഷൻ)',
    },
    technicalExample: `// V8 JavaScript Engine Generational Garbage Collection:
let sessionData = { token: "secret", payload: [1, 2, 3] };
sessionData = null; 
// Object becomes unreachable; collected during Scavenge/Mark-Sweep cycle`,
  },

  buffer_overflow: {
    englishTerm: 'Buffer Overflow',
    subject: 'Computer Security',
    aliases: ['buffer overflow', 'బఫర్ ఓవర్‌ఫ్లో', 'बफ़र ओवरफ्लो', 'தாங்கல் நிரம்பி வழிதல்', 'ಬಫರ್ ಓವರ್‌ಫ್ಲೋ'],
    technicalMeaningEn:
      'A Buffer Overflow is an anomaly and critical security vulnerability where a program writes data beyond the allocated boundary of a fixed-size contiguous memory buffer, corrupting adjacent stack or heap memory addresses and potentially overwriting the instruction pointer (EIP/RIP) to execute arbitrary code.',
    explanationEn:
      'Preserve Buffer Overflow. Translating as water tank overflowing misses the memory corruption security attack vector.',
    technicalMeaningByLanguage: {
      Telugu:
        'బఫర్ ఓవర్‌ఫ్లో (Buffer Overflow) అనేది సాఫ్ట్‌వేర్ సెక్యూరిటీలో అత్యంత ప్రమాదకరమైన లోపం (Vulnerability). నిర్దేశిత పరిమాణం కలిగిన మెమరీ బఫర్‌లోకి పరిమితికి మించిన డేటాను రాయడం వల్ల, అది పక్కనే ఉన్న స్టాక్ లేదా హీప్ మెమరీని నాశనం చేస్తుంది. హ్యాకర్లు దీని ద్వారా ఫంక్షన్ రిటర్న్ అడ్రస్‌ను మార్చి తమ హానికరమైన కోడ్‌ను ఎగ్జిక్యూట్ చేయగలరు.',
      Hindi:
        'बफ़र ओवरफ्लो (Buffer Overflow) एक गंभीर सुरक्षा भेद्यता है जिसमें कोई प्रोग्राम एक निश्चित आकार के मेमोरी बफ़र में उसकी क्षमता से अधिक डेटा लिख देता है, जिससे निकटवर्ती मेमोरी ओवरराइट हो जाती है और हमलावर मनमाना कोड निष्पादित कर सकते हैं।',
      Tamil:
        'தாங்கல் நிரம்பி வழிதல் (Buffer Overflow) என்பது ஒரு நினைவகப் பகுதியில் அதன் கொள்ளளவை விட அதிகமான தரவை எழுதும் போது ஏற்படும் பாதுகாப்பு குறைபாடாகும்.',
      Kannada:
        'ಬಫರ್ ಓವರ್‌ಫ್ಲೋ (Buffer Overflow) ಎನ್ನುವುದು ನಿಗದಿತ ಗಾತ್ರದ ಮೆಮೊರಿ ಬಫರ್ ಮಿತಿಯನ್ನು ಮೀರಿ ಡೇಟಾವನ್ನು ಬರೆಯುವುದರಿಂದ ಉಂಟಾಗುವ ಗಂಭೀರ ಭದ್ರತಾ ದೋಷವಾಗಿದೆ.',
      Bengali:
        'বাফার ওভারফ্লো হলো একটি গুরুতর সুরক্ষা ত্রুটি যেখানে নির্ধারিত মেমরির সীমার বাইরে ডেটা লেখার ফলে সংলগ্ন মেমরি ক্ষতিগ্রস্ত হয়।',
      Marathi:
        'बफर ओव्हरफ्लो (Buffer Overflow) ही एक गंभीर सुरक्षा त्रुटी आहे ज्यामध्ये निश्चित मेमरी मर्यादेपेक्षा जास्त डेटा लिहिला जातो.',
      Gujarati:
        'બફર ઓવરફ્લો એ ગંભીર સુરક્ષા ખામી છે જેમાં નિર્ધારિત મેમરી કરતાં વધુ ડેટા લખાતાં સિસ્ટમ હેક થઈ શકે છે.',
      Punjabi:
        'ਬਫਰ ਓਵਰਫਲੋਅ ਇੱਕ ਗੰਭੀਰ ਸੁਰੱਖਿਆ ਖ਼ਾਮੀ ਹੈ ਜਿਸ ਵਿੱਚ ਨਿਰਧਾਰਤ ਮੈਮੋਰੀ ਸੀਮਾ ਤੋਂ ਵੱਧ ਡਾਟਾ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।',
      Malayalam:
        'മെമ്മറി ബഫറിന്റെ പരിധിക്കപ്പുറം ഡാറ്റ എഴുതപ്പെടുമ്പോൾ ഉണ്ടാകുന്ന ഗുരുതരമായ സുരക്ഷാ വീഴ്ചയാണ് ബഫർ ഓവർഫ്ലോ.',
    },
    explanationByLanguage: {
      Telugu:
        'Buffer Overflow ని నీళ్ల తొట్టి పొంగిపొర్లడం అని అనువదించకూడదు. ఇది స్టాక్ మెమరీని కరప్ట్ చేసే భద్రతా లోపం.',
      Hindi:
        'Buffer Overflow को पानी का टैंक छलकना न समझें; यह सिस्टम हाइजैक करने वाला मेमोरी अटैक है।',
      Tamil:
        'Buffer Overflow என்ற சொல்லை சைபர் பாதுகாப்பில் அப்படியே பயன்படுத்தவும்.',
      Kannada:
        'Buffer Overflow ತಾಂತ್ರಿಕ ಹೆಸರನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಿಕೊಳ್ಳಿ.',
      Bengali:
        'Buffer Overflow অপরিবর্তিত রাখা বাঞ্ছনীয়।',
      Marathi:
        'Buffer Overflow तांत्रिक संदर्भातच ठेवावे.',
      Gujarati:
        'Buffer Overflow શબ્દ માનક છે.',
      Punjabi:
        'Buffer Overflow ਨੂੰ ਤਕਨੀਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੀ ਰੱਖੋ।',
      Malayalam:
        'Buffer Overflow സാങ്കേതികമായി തന്നെ നിലനിർത്തുക.',
    },
    transliterations: {
      Telugu: 'Buffer Overflow (బఫర్ ఓవర్‌ఫ్లో - మెమరీ అవినీతి లోపం)',
      Hindi: 'Buffer Overflow (बफ़र ओवरफ्लो - मेमोरी सुरक्षा भेद्यता)',
      Tamil: 'Buffer Overflow (பஃபர் ஓவர்ஃப்ளோ)',
      Kannada: 'Buffer Overflow (ಬಫರ್ ಓವರ್‌ಫ್ಲೋ)',
      Bengali: 'Buffer Overflow (বাফার ওভারফ্লো)',
      Marathi: 'Buffer Overflow (बफर ओव्हरफ्लो)',
      Gujarati: 'Buffer Overflow (બફર ઓવરફ્લો)',
      Punjabi: 'Buffer Overflow (ਬਫਰ ਓਵਰਫਲੋਅ)',
      Malayalam: 'Buffer Overflow (ബഫർ ഓവർഫ്ലോ)',
    },
    technicalExample: `// Vulnerable C code without boundary checks:
void vulnerableFunction(char *userInput) {
    char smallBuffer[16];
    // Dangerous: strcpy copies without bound checks!
    // Overwrites stack frame return address (RIP)
    strcpy(smallBuffer, userInput); 
}`,
  },
};

export class TerminologyService {
  /**
   * Searches the built-in canonical CS knowledge base for an exact or fuzzy match
   * in the specified regional language.
   */
  public static lookupCanonical(termName: string, language: string): Terminology | null {
    if (!termName) return null;
    const lower = termName.toLowerCase().trim();
    const effectiveLang = language || 'Telugu';

    const canonicalKey = Object.keys(CANONICAL_CS_TERMS).find((k) => {
      const canon = CANONICAL_CS_TERMS[k];
      if (lower === k || lower.includes(k) || k.includes(lower)) return true;
      if (canon.englishTerm.toLowerCase().includes(lower) || lower.includes(canon.englishTerm.toLowerCase())) {
        return true;
      }
      if (
        canon.aliases &&
        canon.aliases.some(
          (alias) => lower.includes(alias.toLowerCase()) || alias.toLowerCase().includes(lower)
        )
      ) {
        return true;
      }
      const transValues = Object.values(canon.transliterations);
      if (transValues.some((v) => lower.includes(v.toLowerCase()) || v.toLowerCase().includes(lower))) {
        return true;
      }
      return false;
    });

    if (!canonicalKey) return null;
    const canon = CANONICAL_CS_TERMS[canonicalKey];

    const preferred =
      canon.transliterations[effectiveLang] ||
      canon.transliterations['Telugu'] ||
      `${canon.englishTerm} (${canon.englishTerm})`;

    const techMeaning =
      canon.technicalMeaningByLanguage[effectiveLang] ||
      canon.technicalMeaningByLanguage['Telugu'] ||
      canon.technicalMeaningEn;

    const explanationRegional =
      canon.explanationByLanguage[effectiveLang] ||
      canon.explanationByLanguage['Telugu'] ||
      canon.explanationEn;

    return {
      id: 'term_canon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      englishTerm: canon.englishTerm,
      language: effectiveLang,
      preferredTranslation: preferred,
      alternativeTranslations: [canon.englishTerm, canon.englishTerm.toLowerCase(), ...canon.aliases],
      doNotTranslate: true,
      subject: canon.subject,
      explanation: explanationRegional,
      explanationEn: canon.explanationEn,
      technicalMeaning: techMeaning,
      technicalMeaningEn: canon.technicalMeaningEn,
      technicalExample: canon.technicalExample,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  /**
   * Searches existing database or generates an authentic CS technical meaning and example
   * for ANY word requested by the user, strictly adhering to the student's preferred language.
   */
  public static async requestOrLookupTerm(
    queryTerm: string,
    targetLanguage = 'Telugu',
    subject = 'Operating Systems'
  ): Promise<TermLookupResult> {
    const cleanTerm = queryTerm.trim();
    if (!cleanTerm) {
      throw new Error('Please provide a valid technical term or word to explain.');
    }

    // Detect language from script if written in Indian regional scripts
    const detectedFromScript = detectLanguageFromScript(cleanTerm);
    const effectiveLanguage = detectedFromScript || targetLanguage || 'Telugu';

    const lower = cleanTerm.toLowerCase();

    // 1. Search existing stored terminology in database matching the effective language
    const allTerms = db.getTerminologyList();
    const existingForLang = allTerms.find(
      (t) =>
        t.language.toLowerCase() === effectiveLanguage.toLowerCase() &&
        (t.englishTerm.toLowerCase() === lower ||
          t.englishTerm.toLowerCase().includes(lower) ||
          lower.includes(t.englishTerm.toLowerCase()) ||
          t.preferredTranslation.toLowerCase().includes(lower) ||
          (t.alternativeTranslations &&
            t.alternativeTranslations.some(
              (alt) => alt.toLowerCase().includes(lower) || lower.includes(alt.toLowerCase())
            )))
    );

    // If an existing term is found for this language and has a valid technical meaning in that language:
    if (existingForLang && existingForLang.technicalMeaning && existingForLang.technicalExample) {
      const isEnglishOnly =
        effectiveLanguage !== 'English' && !/[\u0900-\u0D7F]/.test(existingForLang.technicalMeaning);
      if (!isEnglishOnly) {
        return {
          term: existingForLang,
          isNewlyCreated: false,
          source: 'database',
        };
      }
    }

    // 2. Check built-in canonical Computer Science terms
    const canonicalKey = Object.keys(CANONICAL_CS_TERMS).find((k) => {
      const canon = CANONICAL_CS_TERMS[k];
      if (lower === k || lower.includes(k) || k.includes(lower)) return true;
      if (canon.englishTerm.toLowerCase().includes(lower) || lower.includes(canon.englishTerm.toLowerCase())) {
        return true;
      }
      if (
        canon.aliases &&
        canon.aliases.some(
          (alias) => lower.includes(alias.toLowerCase()) || alias.toLowerCase().includes(lower)
        )
      ) {
        return true;
      }
      const transValues = Object.values(canon.transliterations);
      if (transValues.some((v) => lower.includes(v.toLowerCase()) || v.toLowerCase().includes(lower))) {
        return true;
      }
      return false;
    });

    if (canonicalKey) {
      const canon = CANONICAL_CS_TERMS[canonicalKey];
      const preferred =
        canon.transliterations[effectiveLanguage] || `${canon.englishTerm} (${canon.englishTerm})`;

      const techMeaning =
        canon.technicalMeaningByLanguage[effectiveLanguage] ||
        canon.technicalMeaningByLanguage['Telugu'] ||
        canon.technicalMeaningEn;

      const explanationRegional =
        canon.explanationByLanguage[effectiveLanguage] ||
        canon.explanationByLanguage['Telugu'] ||
        canon.explanationEn;

      const entryData: Terminology = {
        id:
          existingForLang?.id ||
          'term_auto_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        englishTerm: canon.englishTerm,
        language: effectiveLanguage,
        preferredTranslation: preferred,
        alternativeTranslations: [canon.englishTerm, canon.englishTerm.toLowerCase(), ...canon.aliases],
        doNotTranslate: true,
        subject: canon.subject,
        explanation: explanationRegional,
        explanationEn: canon.explanationEn,
        technicalMeaning: techMeaning,
        technicalMeaningEn: canon.technicalMeaningEn,
        technicalExample: canon.technicalExample,
        createdAt: existingForLang?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingForLang) {
        db.updateTerminology(existingForLang.id, entryData);
      } else {
        db.createTerminology(entryData);
      }

      return {
        term: entryData,
        isNewlyCreated: !existingForLang,
        source: 'canonical_knowledge_base',
      };
    }

    // 3. Dynamic Generation via Gemini LLM with strict instruction for the Preferred Language
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are LinguaLearn's Technical Computer Science Lexicon Engine.
A student studying Computer Science in their preferred language (${effectiveLanguage}) requested the technical meaning and practical engineering example for the term: "${cleanTerm}".
Context Subject: ${subject || 'Computer Science Engineering'}
Target Preferred Student Language: ${effectiveLanguage}

CRITICAL RULES:
1. "technicalMeaning": MUST BE WRITTEN IN ${effectiveLanguage}. Explain with high technical rigor what this concept is, how it operates under the hood, and its internal mechanisms in ${effectiveLanguage}. Keep programming keywords, function/method names, and system calls in English for technical accuracy. Do NOT write purely in English!
2. "technicalMeaningEn": The formal English technical definition for bilingual comparison.
3. "explanation": MUST BE WRITTEN IN ${effectiveLanguage}. Explain why this term must be preserved in technical English/transliteration in software engineering and what misconception occurs if translated literally into conversational ${effectiveLanguage}.
4. "explanationEn": Pedagogical preservation guidance in English.
5. "preferredTranslation": Accurate transliteration and naming in ${effectiveLanguage} script accompanied by English term (e.g. Term (లిపి / लिपि)).
6. "technicalExample": A concrete, functional code snippet (in Python, C, Java, JavaScript, or SQL) or system trace demonstrating practical engineering usage, with code comments in ${effectiveLanguage} or bilingual.

Respond ONLY with a valid JSON object matching this schema:
{
  "englishTerm": "Formal English Term",
  "subject": "${subject || 'Computer Science'}",
  "language": "${effectiveLanguage}",
  "preferredTranslation": "...",
  "alternativeTranslations": ["...", "..."],
  "technicalMeaning": "...(rigorous explanation in ${effectiveLanguage})...",
  "technicalMeaningEn": "...(formal definition in English)...",
  "explanation": "...(pedagogical rule in ${effectiveLanguage})...",
  "explanationEn": "...(pedagogical rule in English)...",
  "technicalExample": "...(code with comments in ${effectiveLanguage})..."
}`;

        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Gemini API lookup timed out')), 30000);
        });

        const geminiPromise = generateContentWithRetry({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        let generationResult: Awaited<typeof geminiPromise>;
        try {
          generationResult = await Promise.race([geminiPromise, timeoutPromise]);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }

        const { response } = generationResult;
        const text = response.text?.trim() || '{}';
        const parsed = safeParseJson<unknown>(text, null);
        const parsedRecord = isRecord(parsed) ? parsed : null;
        const technicalMeaning =
          typeof parsedRecord?.technicalMeaning === 'string' ? parsedRecord.technicalMeaning.trim() : '';
        const technicalExample =
          typeof parsedRecord?.technicalExample === 'string' ? parsedRecord.technicalExample.trim() : '';

        if (parsedRecord && technicalMeaning && technicalExample) {
          const generatedTerm: Terminology = {
            id:
              existingForLang?.id ||
              'term_ai_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            englishTerm:
              typeof parsedRecord.englishTerm === 'string' && parsedRecord.englishTerm.trim()
                ? parsedRecord.englishTerm.trim()
                : cleanTerm,
            language: effectiveLanguage,
            preferredTranslation:
              typeof parsedRecord.preferredTranslation === 'string' && parsedRecord.preferredTranslation.trim()
                ? parsedRecord.preferredTranslation.trim()
                : `${cleanTerm} (${cleanTerm})`,
            alternativeTranslations: Array.isArray(parsedRecord.alternativeTranslations)
              ? parsedRecord.alternativeTranslations.filter((value): value is string => typeof value === 'string')
              : [cleanTerm],
            doNotTranslate: true,
            subject:
              typeof parsedRecord.subject === 'string' && parsedRecord.subject.trim()
                ? parsedRecord.subject.trim()
                : subject,
            explanation:
              (typeof parsedRecord.explanation === 'string' && parsedRecord.explanation.trim()) ||
              `Preserve "${cleanTerm}". Literal translation into regional languages leads to semantic distortion in Computer Science instruction.`,
            explanationEn:
              typeof parsedRecord.explanationEn === 'string' ? parsedRecord.explanationEn : undefined,
            technicalMeaning,
            technicalMeaningEn:
              typeof parsedRecord.technicalMeaningEn === 'string'
                ? parsedRecord.technicalMeaningEn
                : undefined,
            technicalExample,
            createdAt: existingForLang?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          if (existingForLang) {
            db.updateTerminology(existingForLang.id, generatedTerm);
          } else {
            db.createTerminology(generatedTerm);
          }

          return {
            term: generatedTerm,
            isNewlyCreated: !existingForLang,
            source: 'gemini',
          };
        }
        throw new Error('Gemini returned an incomplete explanation. Please try again.');
      } catch (err: any) {
        console.error('Gemini terminology generation error:', err.message || err);
        throw new Error(`Could not generate an explanation for "${cleanTerm}": ${err.message || 'Gemini request failed.'}`);
      }
    }

    throw new Error('Gemini is not configured. Add a valid GEMINI_API_KEY to generate explanations for new terms.');

  }
}
