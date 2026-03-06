import React, { useState, useRef } from 'react';
import { 
  Heart, 
  Dog, 
  Leaf, 
  Camera, 
  Mic, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  Send,
  Sparkles,
  Info,
  Stethoscope,
  Activity,
  User,
  Sprout,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type HealthType = 'human' | 'animal' | 'crop' | null;

interface AnalysisResult {
  disease: string;
  probability: string;
  riskLevel: 'Safe' | 'Monitor' | 'Urgent';
  advice: string;
  warning: string;
}

interface CommunityPost {
  id: number;
  type: string;
  disease: string;
  advice: string;
  language: string;
  imageUrl: string;
  votes: {
    seenBefore: number;
    sameDisease: number;
    differentIssue: number;
  };
  timestamp: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

const languages = [
  'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Odia', 'Bhojpuri', 'Assamese'
];

const translations = {
  English: {
    title: "RuraHealth AI",
    tagline: "Smart healthcare for rural India",
    crop: "Crop\nDisease",
    animal: "Animal\nHealth",
    scan: "Scan\nDisease",
    speak: "Speak\nProblem",
    library: "Offline Library",
    libraryDesc: "Access knowledge without internet",
    community: "Community Diagnosis",
    communityDesc: "See what other farmers are reporting"
  },
  Hindi: {
    title: "रूरलहेल्थ एआई",
    tagline: "ग्रामीण भारत के लिए स्मार्ट स्वास्थ्य सेवा",
    crop: "फसल\nरोग",
    animal: "पशु\nस्वास्थ्य",
    scan: "रोग\nस्कैन करें",
    speak: "समस्या\nबोलें",
    library: "ऑफ़लाइन लाइब्रेरी",
    libraryDesc: "बिना इंटरनेट के ज्ञान प्राप्त करें",
    community: "सामुदायिक निदान",
    communityDesc: "देखें कि अन्य किसान क्या रिपोर्ट कर रहे हैं"
  },
  Bengali: {
    title: "রুরাহেলথ এআই",
    tagline: "গ্রামীণ ভারতের জন্য স্মার্ট স্বাস্থ্যসেবা",
    crop: "ফসলের\nরোগ",
    animal: "পশুর\nস্বাস্থ্য",
    scan: "রোগ\nস্ক্যান করুন",
    speak: "সমস্যা\nবলুন",
    library: "অফলাইন লাইব্রেরি",
    libraryDesc: "ইন্টারনেট ছাড়াই জ্ঞান অ্যাক্সেস করুন",
    community: "সম্প্রদায় রোগ নির্ণয়",
    communityDesc: "অন্যান্য কৃষকরা কী রিপোর্ট করছে তা দেখুন"
  },
  Marathi: {
    title: "रुराहेल्थ एआय",
    tagline: "ग्रामीण भारतासाठी स्मार्ट आरोग्यसेवा",
    crop: "पीक\nरोग",
    animal: "प्राणी\nआरोग्य",
    scan: "रोग\nस्कॅन करा",
    speak: "समस्या\nसांगा",
    library: "ऑफलाइन लायब्ररी",
    libraryDesc: "इंटरनेटशिवाय ज्ञान मिळवा",
    community: "समुदाय निदान",
    communityDesc: "इतर शेतकरी काय नोंदवत आहेत ते पहा"
  },
  Telugu: {
    title: "రూరాహెల్త్ AI",
    tagline: "గ్రామీణ భారతదేశం కోసం స్మార్ట్ హెల్త్‌కేర్",
    crop: "పంట\nవ్యాధి",
    animal: "జంతు\nఆరోగ్యం",
    scan: "వ్యాధిని\nస్కాన్ చేయండి",
    speak: "సమస్యను\nచెప్పండి",
    library: "ఆఫ్‌లైన్ లైబ్రరీ",
    libraryDesc: "ఇంటర్నెట్ లేకుండా జ్ఞానాన్ని పొందండి",
    community: "కమ్యూనిటీ రోగ నిర్ధారణ",
    communityDesc: "ఇతర రైతులు ఏమి నివేదిస్తున్నారో చూడండి"
  },
  Tamil: {
    title: "ரூராஹெல்த் AI",
    tagline: "கிராமப்புற இந்தியாவுக்கான ஸ்மார்ட் சுகாதாரம்",
    crop: "பயிர்\nநோய்",
    animal: "விலங்கு\nசுகாதாரம்",
    scan: "நோயை\nஸ்கேன் செய்",
    speak: "பிரச்சனையை\nபேசு",
    library: "ஆஃப்லைன் நூலகம்",
    libraryDesc: "இணையம் இல்லாமல் அறிவைப் பெறுங்கள்",
    community: "சமூக நோய் கண்டறிதல்",
    communityDesc: "மற்ற விவசாயிகள் என்ன தெரிவிக்கிறார்கள் என்பதைப் பார்க்கவும்"
  },
  Odia: {
    title: "ରୁରାହେଲଥ୍ AI",
    tagline: "ଗ୍ରାମୀଣ ଭାରତ ପାଇଁ ସ୍ମାର୍ଟ ସ୍ୱାସ୍ଥ୍ୟସେବା",
    crop: "ଫସଲ\nରୋଗ",
    animal: "ପଶୁ\nସ୍ୱାସ୍ଥ୍ୟ",
    scan: "ରୋଗ\nସ୍କାନ୍ କରନ୍ତୁ",
    speak: "ସମସ୍ୟା\nକୁହନ୍ତୁ",
    library: "ଅଫଲାଇନ୍ ଲାଇବ୍ରେରୀ",
    libraryDesc: "ଇଣ୍ଟରନେଟ୍ ବିନା ଜ୍ଞାନ ଆକ୍ସେସ୍ କରନ୍ତୁ",
    community: "ସମ୍ପ୍ରଦାୟ ନିଦାନ",
    communityDesc: "ଅନ୍ୟ କୃଷକମାନେ କ'ଣ ରିପୋର୍ଟ କରୁଛନ୍ତି ଦେଖନ୍ତୁ"
  },
  Bhojpuri: {
    title: "रूराहेल्थ एआई",
    tagline: "ग्रामीण भारत खातिर स्मार्ट स्वास्थ्य सेवा",
    crop: "फसल\nरोग",
    animal: "जानवर\nस्वास्थ्य",
    scan: "रोग\nस्कैन करीं",
    speak: "समस्या\nबोलीं",
    library: "ऑफ़लाइन लाइब्रेरी",
    libraryDesc: "बिना इंटरनेट के ज्ञान प्राप्त करीं",
    community: "सामुदायिक निदान",
    communityDesc: "देखीं कि अउरी किसान का रिपोर्ट कर रहल बाड़ें"
  },
  Assamese: {
    title: "ৰুৰাহেলথ এআই",
    tagline: "গ্ৰাম্য ভাৰতৰ বাবে স্মাৰ্ট স্বাস্থ্যসেৱা",
    crop: "শস্যৰ\nৰোগ",
    animal: "পশু\nস্বাস্থ্য",
    scan: "ৰোগ\nস্কেন কৰক",
    speak: "সমস্যা\nকওক",
    library: "অফলাইন লাইব্ৰেৰী",
    libraryDesc: "ইণ্টাৰনেট নোহোৱাকৈ জ্ঞান লাভ কৰক",
    community: "সম্প্ৰদায় ৰোগ নিৰ্ণয়",
    communityDesc: "অন্যান্য কৃষকসকলে কি ৰিপৰ্ট কৰিছে চাওক"
  }
};

export default function App() {
  const [view, setView] = useState<'home' | 'symptoms' | 'result' | 'library' | 'community'>('home');
  const [healthType, setHealthType] = useState<HealthType>(null);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [lastAnalyzedFile, setLastAnalyzedFile] = useState<File | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0A0F0D';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f4f4f5'; // zinc-50
    }
  }, [isDarkMode]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleHealthSelect = (type: HealthType) => {
    setHealthType(type);
    setView('symptoms');
  };

  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);

    if (isOfflineMode) {
      // SIMULATED OFFLINE ARCHITECTURE
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          disease: "Common Cold (Offline Detection)",
          probability: "High",
          riskLevel: "Monitor",
          advice: "Rest, drink plenty of fluids, and keep warm. This was detected using the local model.",
          warning: "If fever persists for more than 3 days, seek medical attention."
        };
        setResult(mockResult);
        setView('result');
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, type: healthType, language: selectedLanguage }),
      });
      const data = await response.json();
      setResult(data);
      setView('result');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLastAnalyzedFile(file);
    setLoading(true);

    if (isOfflineMode) {
      // SIMULATED OFFLINE ARCHITECTURE: Camera -> TFLite -> Local DB
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          disease: "Late Blight (Offline Scan)",
          probability: "92%",
          riskLevel: "Monitor",
          advice: "Remove infected leaves immediately. Apply copper-based fungicide. Data retrieved from local database.",
          warning: "Connect to internet for a more detailed AI report."
        };
        setResult(mockResult);
        setView('result');
        setLoading(false);
      }, 2000);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', healthType || 'general');
    formData.append('language', selectedLanguage);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      setView('result');
    } catch (error) {
      console.error('Error:', error);
      alert('Image analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setSymptoms("I have a high fever and body ache since yesterday.");
    }, 2000);
  };

  const reset = () => {
    setView('home');
    setHealthType(null);
    setSymptoms('');
    setResult(null);
  };

  const fetchCommunityPosts = async () => {
    try {
      const response = await fetch('/api/community/posts');
      const data = await response.json();
      setCommunityPosts(data);
    } catch (error) {
      console.error("Error fetching community posts:", error);
    }
  };

  const shareWithCommunity = async () => {
    if (!result || !lastAnalyzedFile) return;
    
    const formData = new FormData();
    formData.append('image', lastAnalyzedFile);
    formData.append('type', healthType || 'general');
    formData.append('disease', result.disease);
    formData.append('advice', result.advice);
    formData.append('language', selectedLanguage);

    try {
      setLoading(true);
      await fetch('/api/community/posts', {
        method: 'POST',
        body: formData,
      });
      setView('community');
      fetchCommunityPosts();
    } catch (error) {
      console.error("Error sharing with community:", error);
    } finally {
      setLoading(false);
    }
  };

  const voteOnPost = async (postId: number, voteType: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });
      const updatedPost = await response.json();
      setCommunityPosts(posts => posts.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  React.useEffect(() => {
    if (view === 'community') {
      fetchCommunityPosts();
    }
  }, [view]);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.English;

  const renderHome = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 p-4 min-h-full content-start max-w-2xl mx-auto pb-12"
    >
      {/* Header Box */}
      <motion.div variants={itemVariants} className="col-span-2 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-6 rounded-[2rem] mb-2 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-2xl object-cover shadow-sm" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
            <div className="hidden w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
                <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-black text-zinc-900 dark:text-white tracking-tight leading-none">{t.title}</h1>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium mt-1 text-xs">{t.tagline}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors shadow-sm shrink-0"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <select 
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-white/80 dark:bg-black/20 text-zinc-900 dark:text-white text-sm font-bold p-3 rounded-xl border border-white/50 dark:border-white/10 outline-none backdrop-blur-md relative z-10"
        >
          {languages.map(lang => (
            <option key={lang} value={lang} className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white">{lang}</option>
          ))}
        </select>
      </motion.div>

      {/* Crop Box */}
      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleHealthSelect('crop')}
        className="col-span-1 aspect-square relative overflow-hidden p-5 rounded-[2rem] text-left shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-lime-100 to-emerald-100 dark:from-lime-900/40 dark:to-emerald-900/40 group"
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <span className="text-2xl font-display font-black text-emerald-950 dark:text-emerald-50 leading-tight block">{t.crop}</span>
            <span className="text-xs font-bold text-emerald-700/80 dark:text-emerald-300/80 mt-1 block uppercase tracking-wider">Analyze</span>
          </div>
          <div className="self-end bg-white dark:bg-emerald-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm transform group-hover:-translate-y-1 transition-transform">
            <Sprout size={24} className="text-emerald-600 dark:text-emerald-300" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-20 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
           <Sprout size={90} />
        </div>
      </motion.button>

      {/* Animal Box */}
      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleHealthSelect('animal')}
        className="col-span-1 aspect-square relative overflow-hidden p-5 rounded-[2rem] text-left shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 group"
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <span className="text-2xl font-display font-black text-amber-950 dark:text-amber-50 leading-tight block">{t.animal}</span>
            <span className="text-xs font-bold text-amber-700/80 dark:text-amber-300/80 mt-1 block uppercase tracking-wider">Check</span>
          </div>
          <div className="self-end bg-white dark:bg-amber-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm transform group-hover:-translate-y-1 transition-transform">
            <Dog size={24} className="text-amber-600 dark:text-amber-300" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-20 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
           <Dog size={90} />
        </div>
      </motion.button>

      {/* Scan Box */}
      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => { setHealthType('human'); setView('symptoms'); setTimeout(() => fileInputRef.current?.click(), 100); }}
        className="col-span-1 aspect-square relative overflow-hidden p-5 rounded-[2rem] text-left shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/40 group"
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <span className="text-2xl font-display font-black text-sky-950 dark:text-sky-50 leading-tight block">{t.scan}</span>
            <span className="text-xs font-bold text-sky-700/80 dark:text-sky-300/80 mt-1 block uppercase tracking-wider">Photo</span>
          </div>
          <div className="self-end bg-white dark:bg-sky-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm transform group-hover:-translate-y-1 transition-transform">
            <Camera size={24} className="text-sky-600 dark:text-sky-300" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-20 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
           <Camera size={90} />
        </div>
      </motion.button>

      {/* Speak Box */}
      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => { setHealthType('human'); setView('symptoms'); setTimeout(() => startVoiceInput(), 100); }}
        className="col-span-1 aspect-square relative overflow-hidden p-5 rounded-[2rem] text-left shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 group"
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <span className="text-2xl font-display font-black text-indigo-950 dark:text-indigo-50 leading-tight block">{t.speak}</span>
            <span className="text-xs font-bold text-indigo-700/80 dark:text-indigo-300/80 mt-1 block uppercase tracking-wider">Voice</span>
          </div>
          <div className="self-end bg-white dark:bg-indigo-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm transform group-hover:-translate-y-1 transition-transform">
            <Mic size={24} className="text-indigo-600 dark:text-indigo-300" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-20 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
           <Mic size={90} />
        </div>
      </motion.button>

      {/* Library Box */}
      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setView('library')}
        className="col-span-1 aspect-square relative overflow-hidden p-5 rounded-[2rem] text-left shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40 group"
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <span className="text-xl font-display font-black text-teal-950 dark:text-teal-50 leading-tight block whitespace-pre-line">{t.library.replace(' ', '\n')}</span>
            <span className="text-xs font-bold text-teal-700/80 dark:text-teal-300/80 mt-1 block uppercase tracking-wider">Read</span>
          </div>
          <div className="self-end bg-white dark:bg-teal-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm transform group-hover:-translate-y-1 transition-transform">
            <Info size={24} className="text-teal-600 dark:text-teal-300" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-20 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
           <Info size={90} />
        </div>
      </motion.button>

      {/* Community Box */}
      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setView('community')}
        className="col-span-1 aspect-square relative overflow-hidden p-5 rounded-[2rem] text-left shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-fuchsia-100 to-pink-100 dark:from-fuchsia-900/40 dark:to-pink-900/40 group"
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <span className="text-xl font-display font-black text-fuchsia-950 dark:text-fuchsia-50 leading-tight block whitespace-pre-line">{t.community.replace(' ', '\n')}</span>
            <span className="text-xs font-bold text-fuchsia-700/80 dark:text-fuchsia-300/80 mt-1 block uppercase tracking-wider">Share</span>
          </div>
          <div className="self-end bg-white dark:bg-fuchsia-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm transform group-hover:-translate-y-1 transition-transform">
            <Activity size={24} className="text-fuchsia-600 dark:text-fuchsia-300" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-20 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
           <Activity size={90} />
        </div>
      </motion.button>
    </motion.div>
  );

  const renderLibrary = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full bg-zinc-50 dark:bg-[#0A0F0D]"
    >
      <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex items-center gap-4 bg-white/60 dark:bg-emerald-950/20 backdrop-blur-xl">
        <button onClick={() => setView('home')} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-zinc-500 dark:text-zinc-400">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-display font-black text-zinc-900 dark:text-white tracking-tight">Offline Library</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/20 rounded-3xl p-6">
          <h3 className="text-emerald-700 dark:text-emerald-400 font-bold mb-2">Crop Diseases</h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li className="bg-white/50 dark:bg-black/20 p-3 rounded-xl">Wheat Rust - Apply fungicide, ensure good drainage.</li>
            <li className="bg-white/50 dark:bg-black/20 p-3 rounded-xl">Rice Blight - Use resistant varieties, avoid excess nitrogen.</li>
          </ul>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/20 rounded-3xl p-6">
          <h3 className="text-amber-700 dark:text-amber-400 font-bold mb-2">Animal Health</h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li className="bg-white/50 dark:bg-black/20 p-3 rounded-xl">FMD - Isolate animal, contact vet immediately.</li>
            <li className="bg-white/50 dark:bg-black/20 p-3 rounded-xl">Mastitis - Improve hygiene, milk affected quarters last.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  const renderCommunity = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full bg-zinc-50 dark:bg-black overflow-hidden"
    >
      <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex items-center gap-4 bg-white/60 dark:bg-zinc-950/50 backdrop-blur-xl">
        <button onClick={() => setView('home')} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-zinc-500 dark:text-zinc-400">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-display font-black text-zinc-900 dark:text-white tracking-tight">Community Feed</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {communityPosts.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
            <Activity size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No community reports yet</p>
          </div>
        ) : (
          communityPosts.map(post => (
            <motion.div 
              key={post.id} 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl"
            >
              <div className="relative aspect-video">
                <img src={post.imageUrl} alt="Community report" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    post.type === 'crop' ? 'bg-lime-500 text-lime-950' :
                    post.type === 'animal' ? 'bg-amber-500 text-amber-950' :
                    'bg-emerald-500 text-emerald-950'
                  }`}>
                    {post.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-zinc-900 dark:text-white font-black text-2xl mb-1">{post.disease}</h3>
                    <p className="text-zinc-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      {new Date(post.timestamp).toLocaleDateString()} • {post.language}
                    </p>
                  </div>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-6 bg-zinc-50 dark:bg-white/5 p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
                  {post.advice}
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => voteOnPost(post.id, 'seenBefore')}
                    className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all group"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-xl">{post.votes.seenBefore}</span>
                    <span className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 font-black uppercase tracking-tighter">Seen Before</span>
                  </button>
                  <button 
                    onClick={() => voteOnPost(post.id, 'sameDisease')}
                    className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
                  >
                    <span className="text-amber-600 dark:text-amber-400 font-black text-xl">{post.votes.sameDisease}</span>
                    <span className="text-[10px] text-amber-600/70 dark:text-amber-500/70 font-black uppercase tracking-tighter">Same Issue</span>
                  </button>
                  <button 
                    onClick={() => voteOnPost(post.id, 'differentIssue')}
                    className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                  >
                    <span className="text-red-600 dark:text-red-400 font-black text-xl">{post.votes.differentIssue}</span>
                    <span className="text-[10px] text-red-600/70 dark:text-red-500/70 font-black uppercase tracking-tighter">Different</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderSymptoms = () => (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="p-4 flex flex-col h-full gap-4"
    >
      <button onClick={reset} className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold mb-2">
        <ArrowLeft className="mr-2" /> Back to Home
      </button>
      
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-6 rounded-[2.5rem] flex-1 flex flex-col gap-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <h2 className="text-2xl font-display font-black text-zinc-900 dark:text-white">
          Describe {healthType === 'human' ? 'Symptoms' : healthType === 'animal' ? 'Animal Condition' : 'Crop Issue'}
        </h2>

        <textarea 
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Type symptoms here..."
          className="w-full flex-1 bg-zinc-50 dark:bg-zinc-800/50 p-6 text-xl text-zinc-900 dark:text-white border-2 border-zinc-200 dark:border-white/5 rounded-3xl focus:border-emerald-500 outline-none resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />

        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white p-6 rounded-3xl shadow-md"
          >
            <Camera size={32} className="mb-2 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold uppercase tracking-widest">Photo</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={startVoiceInput}
            className={`flex flex-col items-center justify-center p-6 rounded-3xl shadow-md transition-colors border ${isRecording ? 'bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500 text-red-600 dark:text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white'}`}
          >
            <Mic size={32} className={`mb-2 ${isRecording ? 'animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span className="text-sm font-bold uppercase tracking-widest">{isRecording ? 'Listening' : 'Speak'}</span>
          </motion.button>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyzeSymptoms}
          disabled={!symptoms.trim() || loading}
          className="w-full bg-emerald-500 text-emerald-950 p-6 rounded-3xl text-xl font-black shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
          ANALYZE NOW
        </motion.button>
      </div>
    </motion.div>
  );

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'Safe': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'Monitor': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'Urgent': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    }
  };

  const getRiskEmoji = (level?: string) => {
    switch (level) {
      case 'Safe': return '🟢';
      case 'Monitor': return '🟡';
      case 'Urgent': return '🔴';
      default: return '⚪';
    }
  };

  const renderResult = () => (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-4 flex flex-col h-full gap-4 overflow-y-auto"
    >
      <button onClick={reset} className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold mb-2">
        <ArrowLeft className="mr-2" /> Start New Scan
      </button>

      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-2xl">
            <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em]">Analysis Complete</h3>
            <p className="text-3xl font-display font-black text-zinc-900 dark:text-white leading-tight">{result?.disease}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className={`p-6 rounded-3xl border flex items-center justify-between ${getRiskColor(result?.riskLevel)}`}>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Risk Level</span>
              <span className="text-xl font-black">{getRiskEmoji(result?.riskLevel)} {result?.riskLevel || 'Unknown'}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1 block">Confidence</span>
              <span className="text-xl font-black">{result?.probability}</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2 text-zinc-500 dark:text-zinc-400">
              <Info size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Advice</span>
            </div>
            <div className="text-lg text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
              {result?.advice}
            </div>
          </div>

          {result?.warning && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl flex items-start gap-4"
            >
              <AlertTriangle className="text-red-500 shrink-0" size={24} />
              <p className="text-sm font-bold text-red-600 dark:text-red-400 leading-relaxed">{result.warning}</p>
            </motion.div>
          )}

          {/* Disclaimer Box */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 rounded-2xl flex items-start gap-3 mt-2"
          >
            <Stethoscope className="text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">AI suggestion only</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">Consult professional doctor or veterinarian</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={reset}
          className="w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white p-6 rounded-3xl text-xl font-bold border border-zinc-300 dark:border-white/5"
        >
          DONE
        </motion.button>
        {lastAnalyzedFile && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareWithCommunity}
            className="w-full bg-indigo-600 text-white p-6 rounded-3xl text-xl font-black shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3"
          >
            <Activity size={24} />
            SHARE WITH COMMUNITY
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0F0D] font-sans text-zinc-800 dark:text-zinc-200 max-w-md mx-auto shadow-2xl relative overflow-hidden selection:bg-emerald-500/30">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/10 rounded-full -ml-48 -mb-48 blur-[100px] pointer-events-none" />

        <main className="relative z-10 h-screen flex flex-col">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-zinc-900 dark:text-white p-10 text-center"
              >
                <div className="relative">
                  <Loader2 size={80} className="animate-spin text-emerald-600 dark:text-emerald-400 mb-6" />
                  <div className="absolute inset-0 blur-2xl bg-emerald-500/20 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tight">AI ANALYZING...</h2>
                <p className="text-lg text-emerald-700 dark:text-emerald-400/60 font-medium">Scanning symptoms and cross-referencing health data.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto">
            {view === 'home' && renderHome()}
            {view === 'symptoms' && renderSymptoms()}
            {view === 'result' && renderResult()}
            {view === 'library' && renderLibrary()}
            {view === 'community' && renderCommunity()}
          </div>
        </main>
      </div>
    </div>
  );
}
