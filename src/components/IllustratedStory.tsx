import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  Trophy, 
  HelpCircle,
  HelpCircle as HelpIcon,
  Volume2,
  BookOpenCheck,
  Compass,
  Pencil,
  Trash2,
  Copy,
  Check,
  Play,
  Pause
} from 'lucide-react';
import { Lesson, StorySlide, VocabularyWord } from '../types';
import SoundEngine from '../lib/audio';
import imageOverridesStatic from '../data/image_overrides.json';
import { quranSurahsData, QuranSurah, QuranVerse } from '../data/quranData';
import { fullTextbookData } from '../data/fullTextbook';

// Helper function to extract Google Drive file ID and convert to direct image link
const getGoogleDriveDirectImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  // Custom check for Google Drive shares
  if (url.includes('drive.google.com')) {
    const matches = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/) || url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (matches && matches[1]) {
      // Use lh3.googleusercontent.com which bypasses the Google Drive 403 authorization and third-party cookies restrictions.
      return `https://lh3.googleusercontent.com/d/${matches[1]}`;
    }
  }
  return url;
};

interface ImageWithFallbackProps { 
  src: string; 
  alt: string; 
  fallbackType: string | undefined;
  renderFallback: (type: string | undefined) => React.ReactNode;
}

const ImageWithFallback = ({ src, alt, fallbackType, renderFallback }: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error) {
    return <>{renderFallback(fallbackType)}</>;
  }

  return (
    <div className="relative w-full h-full min-h-[220px] bg-[#FAF9F6] flex items-center justify-center rounded-2xl overflow-hidden border border-[#DCD3C1]">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover max-h-[300px]"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    </div>
  );
};

function TextbookView({ lessonId, lesson }: { lessonId: string; lesson: Lesson }) {
  const data = fullTextbookData[lessonId] || {
    unitTitle: `الوحدة الدراسية - المنهج الرسمي`,
    lessonTitle: lesson.title,
    intro: lesson.shortDesc,
    coreText: lesson.slides.map(s => s.highlightVerse).filter(Boolean).join(" \n\n ") || "يرجى مراجعة صفحات الدرس بالشرائح التفاعلية للاطلاع على معاني المتن.",
    detailedExplanation: lesson.slides.map(s => ({
      title: s.title,
      content: s.narrative
    })),
    benefitsAndMorals: [
      "المحافظة على المذاكرة والتحصيل الأكاديمي باستمرار.",
      "تطبيق التوجيهات والقيم الإسلامية الفاضلة الواردة بالدرس في تعاملاتنا اليومية.",
      "احترام المعلم والزملاء والمساهمة في بناء بيئة صفية إيجابية ومسؤولة."
    ],
    textbookQuestions: lesson.quiz.map(q => ({
      question: q.question,
      answer: q.explanation || q.options[q.correctAnswer]
    }))
  };

  // State to toggle seeing solutions
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  return (
    <div className="w-full flex flex-col md:flex-row gap-0 text-right relative" id="full-textbook-view">
      {/* Book spine middle fold decorator (visible only on desktop) */}
      <div className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 page-fold pointer-events-none hidden md:block z-20"></div>

      {/* LEFT PAGE of textbook spread (45% width): Morals, vocabulary and class questions */}
      <div className="w-full md:w-[45%] flex flex-col justify-between p-2 md:pl-8 pb-6 md:pb-0 text-right md:border-l md:border-[#DCD3C1]/50 md:max-h-[600px] md:overflow-y-auto scrollbar-thin">
        <div className="space-y-6">
          {/* Morals & Lessons Learned */}
          <div className="bg-[#5A6B47]/5 border-r-4 border-[#5A6B47] p-4.5 rounded-l-xl">
            <h4 className="text-xs font-black text-[#5A6B47] mb-2.5 flex items-center gap-1.5 justify-start">
              <Lightbulb className="w-4.5 h-4.5 text-[#5A6B47]" />
              <span>الدروس والعِبر المستفادة من الدرس الكافي:</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-[#4A453E] leading-relaxed font-semibold">
              {data.benefitsAndMorals.map((benefit, i) => (
                <li key={i} className="flex items-start gap-1 justify-start">
                  <span className="text-[#5A6B47] mt-0.5 ml-1 shrink-0">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Evaluation & Exercise questions */}
          <div>
            <h4 className="text-xs font-black text-[#D48166] mb-3 flex items-center gap-1.5 justify-start">
              <Trophy className="w-4.5 h-4.5 text-[#D48166]" />
              <span>التقويم وحل تدريبات الكتاب المدرسي:</span>
            </h4>
            <div className="space-y-3">
              {data.textbookQuestions.length > 0 ? (
                data.textbookQuestions.map((eq, i) => (
                  <div key={i} className="bg-white border border-[#DCD3C1]/80 p-3.5 rounded-xl text-right">
                    <p className="text-[11px] font-black text-[#3A452E] mb-1.5 leading-relaxed">
                      س{i + 1}: {eq.question}
                    </p>
                    {revealedSolutions[i] ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[10px] text-[#5A6B47] bg-[#5A6B47]/5 border border-dashed border-[#5A6B47]/20 px-3 py-2 rounded-lg font-bold leading-relaxed mt-2"
                      >
                        <span className="text-xs ml-1">🎯</span>
                        <span>الجواب المعتمد برسم المنهج: </span>
                        <p className="mt-1 text-[#4A453E]">{eq.answer}</p>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setRevealedSolutions(prev => ({ ...prev, [i]: true }))}
                        className="bg-[#D48166]/10 text-[#D48166] border border-[#D48166]/30 hover:bg-[#D48166]/20 transition-all font-bold text-[9px] py-1 px-3 rounded-lg mt-1 cursor-pointer"
                      >
                        عرض نموذج الإجابة 👁️
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-[#8E8268] italic">لا توجد تمارين تقويمية محددة لهذا الدرس؛ يرجى خوض الاختبار التفاعلي العام.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PAGE of textbook spread (55% width): Core contents list, main text scroll */}
      <div className="w-full md:w-[55%] flex flex-col justify-between p-2 md:pr-10 pt-6 md:pt-0 text-right border-t md:border-t-0 border-[#DCD3C1]/50 md:max-h-[600px] md:overflow-y-auto scrollbar-thin">
        <div className="space-y-5" dir="rtl">
          {/* Book header */}
          <div className="border-b border-[#DCD3C1]/60 pb-3 flex justify-between items-center">
            <div className="text-right">
              <span className="text-[9px] font-black bg-[#4A648C]/15 text-[#4A648C] px-2 py-0.5 rounded-full border border-[#4A648C]/20">
                {data.unitTitle}
              </span>
              <h3 className="text-sm font-black text-[#3A452E] mt-1">كتاب الطالب: {data.lessonTitle}</h3>
            </div>
            <span className="text-[10px] font-bold text-[#8E8268]">تصفح الكتاب 📖</span>
          </div>

          {/* Intro quote */}
          <p className="text-xs text-[#8E8268] bg-[#FAF9F6] border border-[#DCD3C1]/60 p-3.5 rounded-xl leading-relaxed font-semibold italic text-justify">
            {data.intro}
          </p>

          {/* Core textbook text (Hadith / verses / text panel) */}
          <div className="bg-[#FAF9F6] border border-amber-900/10 p-5 rounded-2xl shadow-inner text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-[#D48166]"></div>
            <p className="text-sm md:text-base font-black font-serif text-[#3A452E] leading-loose whitespace-pre-line">
              {data.coreText}
            </p>
          </div>

          {/* Detailed explanation sections */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#5A6B47] pr-2 border-r-3 border-[#5A6B47] mb-2.5">الشرح والتوضيح الرسمي المفصل:</h4>
            {data.detailedExplanation.map((sec, idx) => (
              <div key={idx} className="bg-[#F7F3E9] border border-[#E9E1CD] p-4.5 rounded-2xl text-right">
                <h5 className="text-[11px] font-extrabold text-[#3A452E] mb-2 flex items-center gap-1.5 justify-start">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#5A6B47]"></span>
                  <span>{sec.title}</span>
                </h5>
                <p className="text-xs text-[#4A453E] leading-relaxed text-justify font-medium whitespace-pre-line">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface IllustratedStoryProps {
  lesson: Lesson;
  onBack: () => void;
  onStartQuiz: () => void;
  onLessonCompleted: (lessonId: string, earnedStars: number) => void;
  isCompletedBefore: boolean;
}

export default function IllustratedStory({
  lesson,
  onBack,
  onStartQuiz,
  onLessonCompleted,
  isCompletedBefore
}: IllustratedStoryProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showVocab, setShowVocab] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [pointsReward, setPointsReward] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('gdrive_image_overrides');
      const localMap = stored ? JSON.parse(stored) : {};
      return { ...(imageOverridesStatic || {}), ...localMap };
    } catch (e) {
      return (imageOverridesStatic || {}) as Record<string, string>;
    }
  });
  const [showEditImageModal, setShowEditImageModal] = useState<boolean>(false);
  const [isPasscodeVerified, setIsPasscodeVerified] = useState<boolean>(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Full-stack dynamic override states
  const [passcode, setPasscode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Quran Integration States
  const [activeTab, setActiveTab] = useState<'lesson' | 'textbook' | 'quran'>('lesson');
  const [selectedQuranAyah, setSelectedQuranAyah] = useState<number | null>(1);
  const [isSurahPlaying, setIsSurahPlaying] = useState<boolean>(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  // Single verse audio recitation states
  const [playingVerseNumber, setPlayingVerseNumber] = useState<number | null>(null);
  const [verseAudioInstance, setVerseAudioInstance] = useState<HTMLAudioElement | null>(null);
  const [isVerseLoading, setIsVerseLoading] = useState<boolean>(false);

  const matchedSurah = quranSurahsData[lesson.id];

  // Dynamic Full Quran Surah State
  const [fullVerses, setFullVerses] = useState<{ number: number; text: string; tafsir: string }[]>([]);
  const [isLoadingFullSurah, setIsLoadingFullSurah] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Sync / Reset when lesson.id changes
  useEffect(() => {
    setFullVerses([]);
    setIsLoadingFullSurah(false);
    setLoadError(null);
    setSelectedQuranAyah(1);
    setIsSurahPlaying(false);
    if (audioInstance) {
      audioInstance.pause();
      setAudioInstance(null);
    }
    if (verseAudioInstance) {
      verseAudioInstance.pause();
      setVerseAudioInstance(null);
    }
    setPlayingVerseNumber(null);
  }, [lesson.id]);

  // Load complete Surah from Quran.cloud API when showing Quran tab
  useEffect(() => {
    if (activeTab === 'quran' && matchedSurah && fullVerses.length === 0) {
      const fetchFullSurah = async () => {
        setIsLoadingFullSurah(true);
        setLoadError(null);
        try {
          const surahNum = parseInt(matchedSurah.surahNumber);
          const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,ar.muyassar`);
          if (!res.ok) throw new Error("Network response was not ok");
          const json = await res.json();
          if (json.code === 200 && json.data && json.data.length === 2) {
            const uthmaniEdition = json.data[0];
            const muyassarEdition = json.data[1];
            
            const parsed = uthmaniEdition.ayahs.map((ayah: any, index: number) => {
              let text = ayah.text;
              const bismillah = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
              // Normalize First Verse Bismillah if needed
              if (ayah.numberInSurah === 1 && surahNum !== 1) {
                if (text.startsWith(bismillah)) {
                  text = text.replace(bismillah, "").trim();
                }
              }
              return {
                number: ayah.numberInSurah,
                text: text,
                tafsir: muyassarEdition.ayahs[index]?.text || "التفسير غير متوفر حالياً."
              };
            });
            setFullVerses(parsed);
          } else {
            throw new Error("Invalid json format from Quran API");
          }
        } catch (e) {
          console.error("Error fetching full Quran surah:", e);
          setLoadError("لم نتمكن من تنزيل كامل آيات السورة حالياً من الخادم لعدم توفر اتصال بالإنترنت. تم تفعيل آيات الدرس المحفوظة محلياً لاستمرار الحفظ والتلاوة.");
        } finally {
          setIsLoadingFullSurah(false);
        }
      };

      fetchFullSurah();
    }
  }, [activeTab, lesson.id, matchedSurah, fullVerses.length]);

  const playVerseAudio = (verseNumber: number) => {
    // If we click the currently playing verse, pause it
    if (playingVerseNumber === verseNumber) {
      if (verseAudioInstance) {
        verseAudioInstance.pause();
        verseAudioInstance.src = '';
      }
      setPlayingVerseNumber(null);
      setVerseAudioInstance(null);
      return;
    }

    // Stop current verse audio if playing
    if (verseAudioInstance) {
      verseAudioInstance.pause();
      verseAudioInstance.src = '';
      setVerseAudioInstance(null);
    }

    // Stop whole Surah audio if playing
    if (isSurahPlaying) {
      setIsSurahPlaying(false);
    }

    setIsVerseLoading(true);
    setPlayingVerseNumber(verseNumber);

    const padSurah = matchedSurah?.surahNumber || "053";
    const padVerse = String(verseNumber).padStart(3, '0');
    const url = `https://everyayah.com/data/Alafasy_128kbps/${padSurah}${padVerse}.mp3`;

    const audio = new Audio(url);
    audio.play()
      .then(() => {
        setIsVerseLoading(false);
      })
      .catch(e => {
        console.error("Error playing verse recitation: ", e);
        setIsVerseLoading(false);
        setPlayingVerseNumber(null);
      });

    audio.onended = () => {
      setPlayingVerseNumber(null);
      setVerseAudioInstance(null);
    };

    setVerseAudioInstance(audio);
  };

  // Safely manage Quran audio playing
  useEffect(() => {
    if (isSurahPlaying && matchedSurah?.audioUrl) {
      // Pause any single verse audio
      if (verseAudioInstance) {
        verseAudioInstance.pause();
        verseAudioInstance.src = '';
        setVerseAudioInstance(null);
        setPlayingVerseNumber(null);
      }

      const audio = new Audio(matchedSurah.audioUrl);
      audio.play().catch(e => {
        console.error("Error playing recitation stream: ", e);
        setIsSurahPlaying(false);
      });
      audio.onended = () => setIsSurahPlaying(false);
      setAudioInstance(audio);
      return () => {
        audio.pause();
        audio.src = '';
      };
    } else {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.src = '';
        setAudioInstance(null);
      }
    }
  }, [isSurahPlaying]);

  // Clean up audio on unmount or tab change
  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.src = '';
      }
      if (verseAudioInstance) {
        verseAudioInstance.pause();
        verseAudioInstance.src = '';
      }
    };
  }, [audioInstance, verseAudioInstance, activeTab, lesson.id]);

  const currentSlide = lesson.slides[currentPage];
  const slideOverrideKey = `${lesson.id}_slide_${currentSlide?.id}`;
  const displayImageUrl = customImages[slideOverrideKey] !== undefined ? customImages[slideOverrideKey] : currentSlide?.imageUrl;
  const isLastPage = currentPage === lesson.slides.length - 1;

  // Sync with fullstack server overrides on mount
  useEffect(() => {
    fetch('/api/image-overrides')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setCustomImages(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        console.log('Running in static preview mode, using local files.');
      });
  }, []);

  useEffect(() => {
    // Play transition sound on page turn
    SoundEngine.playSparkle();
  }, [currentPage]);

  const handleLocalVerify = () => {
    if (passcode.trim() === '20302060') {
      setIsPasscodeVerified(true);
      setErrorMsg('');
    } else {
      setErrorMsg('رمز المرور الذي أدخلته غير صحيح! يرجى المحاولة مرة أخرى.');
    }
  };

  const handleSaveOverrideAndSync = () => {
    if (!passcode.trim()) {
      setErrorMsg('فضلاً، يرجى كتابة رمز مرور الصلاحية لإتمام عملية الحفظ البرمجية.');
      return;
    }

    setErrorMsg('');
    setIsSaving(true);

    fetch('/api/update-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: slideOverrideKey,
        imageUrl: tempImageUrl.trim(),
        passcode: passcode.trim()
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل الاتصال بالخادم لحفظ الملف البرمجي.');
      }
      return data;
    })
    .then(() => {
      // Success! Update customImages map with the changes
      const updated = { ...customImages };
      if (tempImageUrl.trim()) {
        updated[slideOverrideKey] = tempImageUrl.trim();
      } else {
        delete updated[slideOverrideKey];
      }
      setCustomImages(updated);
      localStorage.setItem('gdrive_image_overrides', JSON.stringify(updated));
      setShowEditImageModal(false);
      setPasscode('');
      setErrorMsg('');
    })
    .catch((err) => {
      setErrorMsg(err.message);
    })
    .finally(() => {
      setIsSaving(false);
    });
  };

  const handleResetOverrideAndSync = () => {
    if (!passcode.trim()) {
      setErrorMsg('فضلاً، يرجى كتابة رمز مرور الصلاحية لإتمام عملية إعادة التعيين البرمجية.');
      return;
    }

    setErrorMsg('');
    setIsSaving(true);

    fetch('/api/update-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: slideOverrideKey,
        passcode: passcode.trim(),
        action: 'delete'
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل الاتصال بالخادم لإعادة التعيين.');
      }
      return data;
    })
    .then(() => {
      const updated = { ...customImages };
      delete updated[slideOverrideKey];
      setCustomImages(updated);
      localStorage.setItem('gdrive_image_overrides', JSON.stringify(updated));
      setShowEditImageModal(false);
      setPasscode('');
      setErrorMsg('');
    })
    .catch((err) => {
      setErrorMsg(err.message);
    })
    .finally(() => {
      setIsSaving(false);
    });
  };

  const handleNext = () => {
    if (currentPage < lesson.slides.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      // Trigger Completion
      if (!isCompletedBefore) {
        setPointsReward(5);
        onLessonCompleted(lesson.id, 5);
      } else {
        setPointsReward(1); // Small recurrent reward
        onLessonCompleted(lesson.id, 1);
      }
      SoundEngine.playTrophy();
      setShowSuccessModal(true);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const renderIllustration = (imageUrl: string | undefined, type: string | undefined) => {
    const isUrl = imageUrl && (
      imageUrl.startsWith('http://') || 
      imageUrl.startsWith('https://') || 
      imageUrl.startsWith('/') ||
      imageUrl.includes('.') ||
      imageUrl.includes('drive.google.com')
    );

    if (isUrl) {
      const directUrl = getGoogleDriveDirectImageUrl(imageUrl);
      return (
        <ImageWithFallback 
          src={directUrl || ''} 
          alt="لوحة تعبيرية للدرس" 
          fallbackType={type}
          renderFallback={(t) => renderFallbackIllustration(t)}
        />
      );
    }

    return renderFallbackIllustration(type);
  };

  const renderFallbackIllustration = (type: string | undefined) => {
    switch (type) {
      case 'space':
        return (
          <div className="relative w-full h-full min-h-[220px] bg-slate-950 overflow-hidden flex items-center justify-center rounded-2xl shadow-inner border border-indigo-950">
            {/* Stars background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
            {/* Sparkling stars */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
            {/* Glowing Orion/Sirius Star */}
            <motion.div 
              className="absolute w-12 h-12 rounded-full bg-cyan-400/20 blur-xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="relative w-8 h-8 flex items-center justify-center text-cyan-300"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </motion.div>
            {/* Rotating constellation lines */}
            <div className="absolute w-44 h-44 rounded-full border border-cyan-500/10 animate-spin" style={{ animationDuration: '40s' }}></div>
            <div className="absolute w-28 h-24 rounded-full border border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: '20s' }}></div>
          </div>
        );

      case 'ark':
        return (
          <div className="relative w-full h-full min-h-[220px] bg-slate-900 overflow-hidden flex flex-col justify-end rounded-2xl shadow-inner border border-blue-900">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950"></div>
            {/* Dark Storm Clouds */}
            <div className="absolute top-2 left-4 w-24 h-8 bg-slate-800/40 blur-md rounded-full"></div>
            <div className="absolute top-4 right-8 w-32 h-10 bg-slate-800/40 blur-md rounded-full"></div>
            
            {/* Lightning flash */}
            <motion.div
              className="absolute inset-0 bg-blue-100 opacity-0 z-0"
              animate={{ opacity: [0, 0, 0.4, 0, 0, 0.8, 0, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Glowing nails star effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full blur-[1px] z-10"
                style={{
                  top: `${40 + Math.random() * 20}%`,
                  left: `${30 + Math.random() * 40}%`,
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
              />
            ))}

            {/* Floating Wooden Ark */}
            <motion.div 
              className="relative w-36 h-20 mx-auto z-10 bottom-6 bg-amber-950 rounded-b-full border-t-4 border-amber-900 flex items-center justify-center overflow-hidden"
              animate={{ 
                y: [0, -6, 0],
                rotate: [-2, 2, -2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Noah's cabin */}
              <div className="w-16 h-8 bg-amber-900 rounded-t-md relative -top-6 border-b border-amber-950 flex justify-around p-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-sm"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-sm"></div>
              </div>
            </motion.div>

            {/* Giant teal waves */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-cyan-900/60 backdrop-blur-[1px] z-20"></div>
            <motion.div 
              className="absolute bottom-0 inset-x-0 h-8 bg-blue-800/80 z-20"
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 inset-x-0 h-6 bg-cyan-700/80 z-30"
              animate={{ x: [10, -10, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        );

      case 'stars':
        return (
          <div className="relative w-full h-full min-h-[220px] bg-slate-950 overflow-hidden flex items-center justify-center rounded-2xl shadow-inner border border-amber-950">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/20 to-slate-950"></div>
            {/* Glowing Golden Core */}
            <motion.div
              className="absolute w-24 h-24 rounded-full bg-yellow-500/10 blur-xl"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            {/* Floating starlight rays */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-yellow-300/40 rounded-full"
                style={{
                  height: `${10 + Math.random() * 40}px`,
                  top: `${Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
            <motion.div
              className="relative p-4 rounded-full bg-slate-900/80 border border-yellow-500/20 text-yellow-400"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '60s' }} />
            </motion.div>
          </div>
        );

      case 'rose':
        return (
          <div className="relative w-full h-full min-h-[220px] bg-slate-950 overflow-hidden flex items-center justify-center rounded-2xl shadow-inner border border-rose-950">
            {/* Deep dark backdrop */}
            <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 to-slate-950"></div>
            {/* Concentric red/pink clouds representing the celestial melting sky */}
            <motion.div
              className="absolute w-44 h-44 rounded-full bg-rose-600/10 blur-2xl"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            {/* Sparkles around a vortex */}
            {[...Array(25)].map((_, i) => {
              const angle = (i / 25) * Math.PI * 2;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-rose-400 rounded-full"
                  animate={{
                    x: [Math.cos(angle) * 30, Math.cos(angle + 1) * 80, Math.cos(angle) * 30],
                    y: [Math.sin(angle) * 30, Math.sin(angle + 1) * 80, Math.sin(angle) * 30],
                    opacity: [0.2, 1, 0.2]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (i % 5) * 0.2
                  }}
                />
              );
            })}
            <motion.div
              className="relative w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          </div>
        );

      case 'balance':
        return (
          <div className="relative w-full h-full min-h-[220px] bg-slate-950 overflow-hidden flex items-center justify-center rounded-2xl shadow-inner border border-amber-950">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
            {/* Light aura */}
            <div className="absolute w-36 h-36 rounded-full bg-yellow-500/5 blur-3xl"></div>
            <motion.div 
              className="relative w-48 h-32 flex flex-col justify-end items-center"
              animate={{ rotate: [1, -1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Stand */}
              <div className="w-1.5 h-20 bg-amber-500 rounded"></div>
              {/* Arm */}
              <div className="absolute top-8 w-36 h-1 bg-amber-500 rounded flex justify-between px-1">
                {/* Left Pan */}
                <motion.div 
                  className="w-10 h-10 border-t-2 border-amber-400 rounded-b-full bg-amber-900/20 relative top-1 flex items-center justify-center text-[10px] text-yellow-300"
                  animate={{ y: [-1, 2, -1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  حق
                </motion.div>
                {/* Right Pan */}
                <motion.div 
                  className="w-10 h-10 border-t-2 border-amber-400 rounded-b-full bg-amber-900/20 relative top-1 flex items-center justify-center text-[10px] text-yellow-300"
                  animate={{ y: [1, -2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  عدل
                </motion.div>
              </div>
              <div className="w-12 h-2 bg-amber-600 rounded"></div>
            </motion.div>
          </div>
        );

      case 'water':
        return (
          <div className="relative w-full h-full min-h-[220px] bg-sky-950 overflow-hidden flex items-center justify-center rounded-2xl shadow-inner border border-sky-900">
            {/* Deep Water Ripple with CSS rings */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-950 to-slate-950"></div>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-sky-400"
                style={{ width: '40px', height: '40px' }}
                animate={{
                  width: ['40px', '220px'],
                  height: ['40px', '220px'],
                  opacity: [0.8, 0],
                  borderWidth: ['2px', '0.5px']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeOut"
                }}
              />
            ))}
            <motion.div
              className="relative w-12 h-12 rounded-full bg-sky-500/20 border border-sky-300 flex items-center justify-center text-sky-300"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
            </motion.div>
          </div>
        );

      default:
        // Cool generic desert slide
        return (
          <div className="relative w-full h-full min-h-[220px] bg-orange-950 overflow-hidden flex items-center justify-center rounded-2xl shadow-inner border border-orange-900">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-orange-950/40 to-slate-950"></div>
            {/* Radiant glowing moon */}
            <motion.div
              className="absolute top-4 w-14 h-14 rounded-full bg-yellow-100 shadow-[0_0_20px_10px_rgba(253,253,230,0.3)]"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Pyramid or dome silhouette */}
            <div className="absolute bottom-0 w-24 h-16 bg-slate-950/80 rounded-t-full border-t border-yellow-600/20"></div>
            {/* Star sparkles */}
            <motion.div
              className="absolute w-full h-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300 absolute top-12 left-16 animate-bounce" />
              <Sparkles className="w-4 h-4 text-cyan-300 absolute top-8 right-20 animate-pulse" />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2 px-1 text-right relative z-10" id="storybook-container">
      {/* Back to library & Sound feedback bar */}
      <div className="flex items-center justify-between mb-5 border-b border-[#DCD3C1] pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4A453E] hover:text-[#5A6B47] font-bold py-1.5 px-3 rounded-xl hover:bg-[#E9E1CD]/50 transition cursor-pointer"
          id="btn-back-to-library"
        >
          <ChevronRight className="w-5 h-5 ml-1 text-[#5A6B47]" />
          <span>العودة لكتيبة القصص</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-[#E9E1CD] text-[#4A453E] border border-[#DCD3C1] px-3 py-1 rounded-full font-medium max-w-[150px] sm:max-w-xs truncate">
            {lesson.shortDesc}
          </span>
          <span className="text-xs font-bold text-[#D48166] bg-[#D48166]/15 border border-[#D48166]/20 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            أنهِ الكتاب لتحصد ٥ نجوم ⭐
          </span>
        </div>
      </div>

      {/* Universal Tab Switcher: Slides, Full Textbook, Quran recitation */}
      <div className="flex flex-wrap gap-2.5 mb-5 justify-start" id="quran-tab-switcher">
        <button
          onClick={() => {
            setActiveTab('lesson');
            SoundEngine.playSparkle();
          }}
          className={`py-3 px-5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm ${
            activeTab === 'lesson'
              ? 'bg-[#5A6B47] text-white border-b-4 border-[#3D4B2D]'
              : 'bg-white border-2 border-[#DCD3C1] text-[#8E8268] hover:border-[#8E8268]'
          }`}
        >
          <BookOpenCheck className="w-4 h-4" />
          <span>الدرس التفاعلي بالشرائح 🖼️</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('textbook');
            SoundEngine.playTrophy();
          }}
          className={`py-3 px-5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm ${
            activeTab === 'textbook'
              ? 'bg-[#4A648C] text-white border-b-4 border-[#2F4468]'
              : 'bg-white border-2 border-[#DCD3C1] text-[#8E8268] hover:border-[#8E8268]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>كتاب الطالب المدرسي الكامل 📖</span>
        </button>
        
        {matchedSurah && (
          <button
            onClick={() => {
              setActiveTab('quran');
              SoundEngine.playTrophy();
            }}
            className={`py-3 px-5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm ${
              activeTab === 'quran'
                ? 'bg-[#B08933] text-white border-b-4 border-[#866520] shadow-md animate-pulse'
                : 'bg-white border-2 border-[#DCD3C1] text-[#8E8268] hover:border-[#8E8268]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>تلاوة السورة ومصحف التجويد 🕌</span>
          </button>
        )}
      </div>

      {/* Physical Open-Book Spread container (Natural Tones Paper style) */}
      <div className="bg-[#FAF9F6] border border-[#DCD3C1] rounded-[2rem] p-5 md:p-8 flex flex-col md:flex-row gap-0 book-shadow relative overflow-hidden min-h-[480px]">
        {activeTab === 'quran' && matchedSurah ? (
          <>
            {/* LEFT PAGE of Quran Spread (40% width): Tafsir, Audio controls, info */}
            <div className="w-full md:w-[40%] flex flex-col justify-between p-2 md:pl-8 pb-6 md:pb-0 text-right md:border-l md:border-[#DCD3C1]/40" id="quran-left-info-page">
              <div className="space-y-4">
                {/* Surah Mini Info Badge */}
                <div className="bg-[#FAF9F6] border border-[#B08933]/30 p-4 rounded-2xl relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#B08933] to-emerald-500"></div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-[#5A6B47] bg-[#5A6B47]/10 px-2.5 py-1 rounded-lg">
                      {matchedSurah.type}
                    </span>
                    <h3 className="text-base font-black text-[#3A452E]">{matchedSurah.name}</h3>
                  </div>
                  <p className="text-[11px] text-[#5A6B47] font-semibold leading-relaxed">
                    {matchedSurah.intro}
                  </p>
                </div>

                {/* Audio Recitation Player */}
                <div className="bg-amber-50/50 border border-[#DCD3C1] p-4 rounded-2xl flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 w-full justify-between">
                    <div className="text-right">
                      <p className="text-[10px] text-[#8E8268] font-bold">الاستماع للقرآن الكريم</p>
                      <p className="text-xs font-black text-[#4A453E]">تلاوة مباركة بصوت ندي عذب 🎙️</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsSurahPlaying(!isSurahPlaying);
                        SoundEngine.playTrophy();
                      }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        isSurahPlaying 
                          ? 'bg-[#B08933] text-white shadow-md shadow-[#B08933]/20' 
                          : 'bg-[#5A6B47] hover:bg-[#465337] text-white'
                      } cursor-pointer`}
                    >
                      {isSurahPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 mr-0.5" />
                      )}
                    </button>
                  </div>
                  
                  {isSurahPlaying && (
                    <div className="flex items-center gap-1 mt-1 justify-center w-full">
                      <span className="h-4 w-1 bg-[#B08933] rounded animate-bounce"></span>
                      <span className="h-6 w-1 bg-[#5A6B47] rounded animate-bounce [animation-delay:0.1s]"></span>
                      <span className="h-5 w-1 bg-[#B08933] rounded animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-7 w-1 bg-[#5A6B47] rounded animate-bounce [animation-delay:0.3s]"></span>
                      <span className="h-4 w-1 bg-[#B08933] rounded animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                </div>

                {/* Selected Ayah Explanation Box */}
                {selectedQuranAyah !== null && (
                  <motion.div
                    key={selectedQuranAyah}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-amber-50/20 border-2 border-dashed border-[#B08933]/50 rounded-2xl relative"
                  >
                    <span className="absolute -top-3 right-4 bg-[#B08933] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      التفسير الميسَّر للآية {selectedQuranAyah}
                    </span>
                    
                    <div className="flex justify-between items-start gap-3 mt-1 mb-2">
                      <p className="text-xs font-bold text-[#B08933] leading-relaxed flex-1">
                        " {(() => {
                          const activeVersesList = fullVerses.length > 0 ? fullVerses : (matchedSurah?.highlightedVerses || []);
                          return activeVersesList.find(v => v.number === selectedQuranAyah)?.text || "";
                        })()} "
                      </p>
                      
                      <button
                        onClick={() => playVerseAudio(selectedQuranAyah)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          playingVerseNumber === selectedQuranAyah
                            ? 'bg-[#B08933] text-white shadow-md'
                            : 'bg-white border border-[#DCD3C1] text-[#B08933] hover:bg-amber-100/50'
                        } cursor-pointer flex-shrink-0`}
                        title="تلاوة الآية الكريمة منفردة"
                      >
                        {isVerseLoading && playingVerseNumber === selectedQuranAyah ? (
                          <div className="w-4.5 h-4.5 border-2 border-[#B08933] border-t-transparent rounded-full animate-spin"></div>
                        ) : playingVerseNumber === selectedQuranAyah ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-[#B08933]" />
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-[#4A453E] leading-relaxed font-semibold">
                      {(() => {
                        const activeVersesList = fullVerses.length > 0 ? fullVerses : (matchedSurah?.highlightedVerses || []);
                        return activeVersesList.find(v => v.number === selectedQuranAyah)?.tafsir || "انقر على آية لعرض تفسيرها.";
                      })()}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Back advice / guidance */}
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-3 rounded-xl mt-4">
                <p className="text-[10px] text-[#8E8268] font-bold text-center leading-relaxed">
                  💡 انقر على أي آية مباركة لتلاوتها بصورة فورية عذبة مع تبيان تفسيرها الميسر وموضعها!
                </p>
              </div>
            </div>

            {/* RIGHT PAGE of Quran Spread (60% width): Beautifully structured scrolls of Verses */}
            <div className="w-full md:w-[60%] flex flex-col justify-between p-2 md:pr-10 pt-6 md:pt-0 text-right border-t md:border-t-0 border-[#DCD3C1]/50" id="quran-right-scroll-page">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-black text-[#B08933] flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B08933]"></span>
                    <span>المصحف الشريف المبارك</span>
                  </h3>
                  <div className="text-[10px] font-extrabold text-[#8E8268]" dir="rtl">
                    {isLoadingFullSurah ? (
                      <span className="text-emerald-600 flex items-center gap-1.5 animate-pulse">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        جاري تحميل السورة كاملةً...
                      </span>
                    ) : fullVerses.length > 0 ? (
                      <span className="text-[#B08933] bg-[#B08933]/10 px-2 py-0.5 rounded-lg">السورة كاملة من المصحف 📖</span>
                    ) : (
                      <span className="text-amber-800 bg-amber-100/50 px-2 py-0.5 rounded-lg">مختارات الدرس الشريفة 📖</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#F7F3E9] border border-[#E9E1CD] rounded-2xl p-6 md:p-8 relative min-h-[300px] overflow-y-auto max-h-[400px]">
                  {/* Watermark/Symbol of Quran */}
                  <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                    <span className="text-9xl">📖</span>
                  </div>

                  {loadError && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] p-2.5 rounded-xl mb-4 font-bold text-center leading-relaxed">
                      {loadError}
                    </div>
                  )}

                  <div className="space-y-4" dir="rtl">
                    {/* Bismillah block */}
                    <div className="text-center mb-6">
                      <span className="text-md md:text-lg font-black font-serif text-[#3A452E] border-b border-[#D48166]/35 pb-2 inline-block">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </span>
                    </div>

                    {/* Flowing text representation */}
                    <p className="text-right leading-[2.5rem] md:leading-[3rem] text-[#333333] select-none text-md md:text-xl font-medium">
                      {(fullVerses.length > 0 ? fullVerses : (matchedSurah?.highlightedVerses || [])).map((verse) => (
                        <span
                          key={verse.number}
                          onClick={() => {
                            setSelectedQuranAyah(verse.number);
                            playVerseAudio(verse.number);
                          }}
                          className={`cursor-pointer inline-block mx-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-300 relative ${
                            selectedQuranAyah === verse.number
                              ? 'bg-amber-100 border-2 border-[#B08933] font-black text-[#B08933] scale-105 shadow-sm'
                              : 'hover:bg-[#E9E1CD]/50 hover:text-emerald-800 border-2 border-transparent'
                          } ${
                            playingVerseNumber === verse.number
                              ? 'ring-2 ring-emerald-500 bg-emerald-50/70 text-emerald-800 border-emerald-500 font-bold'
                              : ''
                          }`}
                        >
                          {verse.text} 
                          <span className={`inline-flex items-center justify-center w-6 h-6 mr-1.5 text-[9px] border rounded-full font-bold transition-all ${
                            playingVerseNumber === verse.number
                              ? 'bg-emerald-500 text-white border-emerald-500 animate-pulse'
                              : selectedQuranAyah === verse.number
                                ? 'bg-[#B08933] text-white border-[#B08933]'
                                : 'bg-[#FAF9F6] text-[#B08933] border-[#B08933]/50'
                          }`}>
                            {playingVerseNumber === verse.number ? "🔊" : verse.number}
                          </span>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress and status decoration */}
              <div className="mt-6 border-t border-[#DCD3C1] pt-4 flex justify-between items-center text-[10px] font-bold text-[#8E8268]">
                <span>عدد الآيات المعروضة: {(fullVerses.length > 0 ? fullVerses : (matchedSurah?.highlightedVerses || [])).length} آيات كريمة</span>
                <span className="text-[#B08933]">« اقرأ وارتقِ ورتّل كما كنت ترتل في الدنيا »</span>
              </div>
            </div>
          </>
        ) : activeTab === 'textbook' ? (
          <TextbookView lessonId={lesson.id} lesson={lesson} />
        ) : (
          <>
            {/* Book spine middle fold decorator (visible only on desktop) */}
            <div className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 page-fold pointer-events-none hidden md:block z-20"></div>

            {/* LEFT PAGE: Illustrated Board (45% width) */}
            <div className="w-full md:w-[45%] flex flex-col justify-between p-2 md:pl-8 pb-6 md:pb-0 text-right md:border-l md:border-[#DCD3C1]/40" id="story-illustrated-board">

          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] font-extrabold text-[#8E8268] uppercase tracking-wider">اللوحة المصورة</h4>
              <button
                onClick={() => {
                  setTempImageUrl(displayImageUrl || '');
                  setCopied(false);
                  setPasscode('');
                  setErrorMsg('');
                  setIsPasscodeVerified(false);
                  setShowEditImageModal(true);
                }}
                className="text-[10px] font-bold text-[#5A6B47] hover:text-[#465337] flex items-center gap-1 bg-[#E9E1CD]/45 hover:bg-[#E9E1CD]/85 px-2.5 py-1.5 rounded-lg transition border border-[#DCD3C1] shadow-sm cursor-pointer"
                title="تعديل رابط الصورة وتضمينها في السورس"
              >
                <Pencil className="w-3 h-3 text-[#5A6B47]" />
                <span>تعديل اللوحة المصورة 📝</span>
              </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-[#DCD3C1] bg-[#F7F3E9]">
              {renderIllustration(displayImageUrl, currentSlide.illustrationType)}
            </div>
          </div>

          <div className="mt-5 p-4 bg-[#F1EBDC]/70 rounded-2xl border border-[#DCD3C1]/80 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-[#D48166] justify-start">
              <Lightbulb className="w-4 h-4 text-[#D48166]" />
              <span className="font-extrabold text-xs text-[#D48166] pr-1">صندوق المفردات المضيء للأطفال</span>
            </div>
            <p className="text-[11px] text-[#8E8268] leading-relaxed font-medium">
              انقر على الكلمة لفهم معناها التفسيري مباشرة:
            </p>
            <div className="flex flex-wrap gap-1.5 justify-start mt-1">
              {lesson.vocabulary.map((vocab, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedWord(vocab);
                    setShowVocab(true);
                    SoundEngine.playSparkle();
                  }}
                  className="text-[11px] font-bold bg-[#FAF9F6] hover:bg-[#E9E1CD] text-[#3A452E] py-1 px-3 rounded-xl transition border border-[#DCD3C1] hover:border-[#5A6B47] shadow-sm cursor-pointer"
                >
                  {vocab.word}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PAGE: Reading Narrative (55% width) */}
        <div className="w-full md:w-[55%] flex flex-col justify-between p-2 md:pr-10 pt-6 md:pt-0 text-right border-t md:border-t-0 border-[#DCD3C1]/50" id="story-narrative-board">
          <div>
            {/* Header: Book title and progress bar */}
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-black text-[#5A6B47] bg-[#5A6B47]/10 border border-[#5A6B47]/20 px-3 py-1 rounded-lg inline-block">
                الصفحة {currentPage + 1} من {lesson.slides.length}
              </span>
              <div className="w-1/3 bg-[#E9E1CD] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#5A6B47] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / lesson.slides.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Slide title */}
            <h2 className="text-lg md:text-xl font-bold font-sans text-[#3A452E] mb-4 tracking-tight border-r-4 border-[#5A6B47] pr-2.5">
              {currentSlide.title}
            </h2>

            {/* Narrative text with Amiri/Cairo serif font hybrid */}
            <p className="text-sm md:text-base text-[#4A453E] leading-relaxed mb-6 whitespace-pre-line text-justify font-serif pr-1">
              {currentSlide.narrative}
            </p>

            {/* Highlighted Verse block */}
            {currentSlide.highlightVerse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#5A6B47]/5 border-r-4 border-[#5A6B47] rounded-l-xl my-4 text-right"
              >
                <span className="block text-xs font-bold text-[#5A6B47] mb-1">تأمل الآية أو الحديث:</span>
                <p className="font-serif text-base text-[#3A452E] leading-relaxed font-bold">
                  « {currentSlide.highlightVerse} »
                </p>
              </motion.div>
            )}
          </div>

          {/* Navigation Controls (Page turn check) */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#DCD3C1]">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`flex items-center gap-1 py-2 px-4 rounded-xl font-bold transition cursor-pointer ${
                currentPage === 0
                  ? 'text-[#C4BDB0] cursor-not-allowed'
                  : 'text-[#4A453E] hover:bg-[#E9E1CD]/50'
              }`}
              id="btn-prev-page"
            >
              <ChevronRight className="w-5 h-5 text-[#5A6B47]" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-[#5A6B47] hover:bg-[#465337] text-white font-bold py-2.5 px-6 rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 text-xs sm:text-sm"
              id="btn-next-page"
            >
              <span>{isLastPage ? 'جمع شارات القراءة ✨' : 'الصفحة التالية'}</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
          </>
        )}
      </div>


      {/* Vocabulary Detail Modal/Drawer (Sand backdrop) */}
      <AnimatePresence>
        {showVocab && selectedWord && (
          <div className="fixed inset-0 bg-[#3A452E]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FAF9F6] border border-[#5A6B47] rounded-[2rem] p-6 max-w-md w-full shadow-2xl text-right relative overflow-hidden"
              id="vocab-modal"
            >
              {/* Star glowing decor */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E9E1CD]/50 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-3 text-[#3A452E] mb-4 border-b border-[#DCD3C1] pb-2.5">
                <BookOpen className="w-6 h-6 text-[#5A6B47]" />
                <h3 className="font-bold text-base font-sans font-black">بوابة بيان المفردات للأبطال</h3>
              </div>

              <div className="my-4">
                <span className="inline-block text-sm font-black bg-[#E9E1CD] text-[#3A452E] py-1.5 px-4 rounded-full border border-[#DCD3C1] mb-3">
                  {selectedWord.word}
                </span>
                <p className="text-[#4A453E] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium">
                  {selectedWord.meaning}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowVocab(false);
                    setSelectedWord(null);
                  }}
                  className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer"
                  id="vocab-close-btn"
                >
                  فهمت الكلمة العظيمة، سأتابع! 🌾
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Completion Celebration Modal (Natural Terracotta Glow) */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-[#3A452E]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-[#FAF9F6] border-2 border-[#D48166] rounded-[2.5rem] p-8 max-w-lg w-full text-center relative overflow-hidden shadow-2xl"
              id="book-complete-modal"
            >
              {/* Confetti-like floating stars */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-500 text-2xl pointer-events-none"
                  style={{
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 90}%`
                  }}
                  animate={{
                    y: [-10, -50],
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 2.5 + Math.random() * 1.5, repeat: Infinity }}
                >
                  ⭐
                </motion.div>
              ))}

              <div className="w-16 h-16 bg-[#FAF9F6] border border-[#D48166]/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Trophy className="w-8 h-8 text-[#D48166] animate-bounce" />
              </div>

              <h2 className="text-xl md:text-2xl font-black text-[#3A452E] mb-2 font-sans">أحسنت يا فرعون الحق والمتقي الصغير! 🎓</h2>
              <p className="text-[#8E8268] text-xs sm:text-sm leading-relaxed mb-6 max-w-sm mx-auto font-medium">
                لقد طويت آخر صفحة من كتاب القصص المصور <span className="font-extrabold text-[#5A6B47]">" {lesson.title} "</span> وعثرت على كل جواهر التفسير والأخلاق المضيئة بنجاح!
              </p>

              {/* Reward Stars */}
              <div className="bg-[#D48166]/10 inline-flex items-center gap-2 py-2 px-6 rounded-2xl border border-[#D48166]/30 mb-8">
                <span className="text-lg">⭐</span>
                <span className="font-black text-[#D48166] text-sm">حصدت {pointsReward} نجوم جديدة مضيئة!</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onStartQuiz}
                  className="flex items-center justify-center gap-2 bg-[#D48166] hover:bg-[#C26F54] text-white font-bold py-3 px-6 rounded-2xl shadow-md transition active:scale-95 cursor-pointer text-xs sm:text-sm"
                  id="btn-start-test-now"
                >
                  <BookOpenCheck className="w-5 h-5" />
                  <span>انتقل للاختبار الممتع للدرس</span>
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                  className="bg-[#FAF9F6] hover:bg-[#E9E1CD] text-[#4A453E] border border-[#DCD3C1] font-bold py-3 px-6 rounded-2xl transition cursor-pointer text-xs sm:text-sm"
                  id="btn-return-hub"
                >
                  العودة للمكتبة الشاملة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Image Modal */}
      <AnimatePresence>
        {showEditImageModal && (
          <div className="fixed inset-0 bg-[#3A452E]/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FAF9F6] border-2 border-[#5A6B47] rounded-[2rem] p-6 max-w-lg w-full shadow-2xl text-right relative overflow-hidden"
            >
              {/* Star glowing decor */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E9E1CD]/50 rounded-full blur-xl pointer-events-none"></div>

              {!isPasscodeVerified ? (
                /* SCREEN 1: Passcode Verification Required */
                <>
                  <div className="flex items-center gap-2.5 text-[#3A452E] mb-4 border-b border-[#DCD3C1] pb-3">
                    <Pencil className="w-5 h-5 text-[#5A6B47]" />
                    <h3 className="font-bold text-base font-sans font-black">رمز التحقق الأمني 🔒</h3>
                  </div>

                  <p className="text-xs text-[#8E8268] mb-4 leading-relaxed font-semibold">
                    التحكم وتعديل الألواح المصورة يتطلب صلاحيات الإشراف والمعلمين. فضلاً، أدخل رمز المرور للمتابعة:
                  </p>

                  {/* Error block */}
                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold text-right">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  {/* Input for passcode */}
                  <div className="mb-5">
                    <label className="block text-xs font-extrabold text-[#3A452E] mb-1.5 text-right">رمز مرور الصلاحية:</label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLocalVerify();
                        }
                      }}
                      placeholder="أدخل رمز المرور الأمني للمتابعة"
                      className="w-full bg-[#F7F3E9] border border-[#DCD3C1] rounded-xl px-3 py-2 text-xs text-[#4A453E] focus:outline-none focus:border-[#5A6B47] text-center font-mono tracking-wider"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleLocalVerify}
                      className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer shadow-sm"
                    >
                      تحقق ودخول 🔑
                    </button>
                    <button
                      onClick={() => setShowEditImageModal(false)}
                      className="bg-[#FAF9F6] border border-[#DCD3C1] hover:bg-[#E9E1CD] text-[#4A453E] font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              ) : (
                /* SCREEN 2: Editing Board with Drive Image Url input */
                <>
                  <div className="flex items-center gap-2.5 text-[#3A452E] mb-4 border-b border-[#DCD3C1] pb-3">
                    <Pencil className="w-5 h-5 text-[#5A6B47]" />
                    <h3 className="font-bold text-base font-sans font-black">تعديل رابط الصورة وتضمينها برمجياً 🖼️</h3>
                  </div>

                  <p className="text-xs text-[#8E8268] mb-4 leading-relaxed font-semibold">
                    بإمكانك استبدال اللوحة الحالية برابط صورة مباشر من قوقل درايف أو الويب. سيتم حفظ هذا التعديل مباشرةً على خادم الموقع وتضمينه في الأكواد البرمجية ليبقى دائماً!
                  </p>

                  {/* Error block */}
                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold text-right" id="override-error-banner">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  {/* Input for image URL */}
                  <div className="mb-4">
                    <label className="block text-xs font-extrabold text-[#3A452E] mb-1.5 text-right">رابط الصورة (رابط Google Drive أو أي رابط ويب مباشر):</label>
                    <input
                      type="text"
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full bg-[#F7F3E9] border border-[#DCD3C1] rounded-xl px-3 py-2 text-xs text-[#4A453E] focus:outline-none focus:border-[#5A6B47] text-left"
                      dir="ltr"
                      disabled={isSaving}
                    />
                  </div>

                  {/* Google Drive Guide */}
                  <div className="mb-4 p-3 bg-[#E9E1CD]/30 border border-[#DCD3C1] rounded-xl text-xs text-[#4A453E] leading-relaxed text-right">
                    <span className="font-bold text-[#3A452E] block mb-1">💡 إرشادات روابط قوقل درايف (Google Drive):</span>
                    <ul className="list-inside space-y-1 text-[11px] font-medium pr-1">
                      <li>• تأكد من جعل صلاحية مشاركة الملف في Drive <span className="font-bold text-[#5A6B47]">" Anyone with the link can view "</span> (عام للجميع).</li>
                      <li>• انسخ الرابط كاملاً مثل: <span className="font-mono bg-[#FAF9F6] border border-[#DCD3C1]/50 px-1 py-0.5 rounded text-[10px]" dir="ltr">https://drive.google.com/file/d/ID/view...</span></li>
                      <li>• يقوم التطبيق تلقائياً بتحويل رابط المشاركة ليعرض ويعمل بالشاشات والمنصات مباشرة!</li>
                    </ul>
                  </div>

                  {/* Export code block */}
                  <div className="mb-5 text-right">
                    <span className="block text-xs font-bold text-[#3A452E] mb-2">📋 كود التضمين للمطور (وضعه في سورس الموقع):</span>
                    <div className="p-3.5 bg-[#F1EBDC]/60 hover:bg-[#F1EBDC]/95 rounded-xl border border-[#DCD3C1] text-left font-mono text-[11px] overflow-x-auto relative transition duration-200">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`imageUrl: "${tempImageUrl || 'رابط_درايف'}",`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-[#FAF9F6] hover:bg-[#E9E1CD] text-[#5A6B47] transition border border-[#DCD3C1] rounded-md cursor-pointer flex items-center justify-center gap-1 select-none"
                        title="نسخ السطر لملف الكريكلوم"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] text-emerald-600 font-sans font-bold">تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px] text-gray-500 font-sans font-bold">نسخ دائم 📌</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-[#8E8268] block mb-2 font-sans text-right">
                        // لتضمينها بشكل دائم، افتح الملف <code className="text-[#3A452E] bg-[#E9E1CD] px-1 py-0.5 rounded text-[9px]">src/data/curriculum.ts</code> وابحث عن الدرس ذو الرمز <code className="text-[#3A452E] bg-[#E9E1CD] px-1 py-0.5 rounded text-[9px] font-mono">"{lesson.id}"</code>، وضمن السلايد رقم <code className="text-[#3A452E] bg-[#E9E1CD] px-1 py-0.5 rounded text-[9px] font-mono">{currentSlide?.id}</code> استبدل السطر التالي:
                      </span>
                      <code className="text-[#3a442e] font-bold block" dir="ltr">
                        imageUrl: "{tempImageUrl || 'https://drive.google.com/...'}",
                      </code>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-2.5">
                    <button
                      onClick={handleResetOverrideAndSync}
                      disabled={isSaving}
                      className="bg-[#FAF9F6] border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 sm:order-last disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isSaving ? "جاري التعديل..." : "إعادة تعيين للأصلي ↩️"}</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveOverrideAndSync}
                        disabled={isSaving}
                        className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        <span>{isSaving ? "جاري الحفظ البرمجي..." : "حفظ وتضمين دائم 💾"}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (!isSaving) setShowEditImageModal(false);
                        }}
                        disabled={isSaving}
                        className="bg-[#FAF9F6] border border-[#DCD3C1] hover:bg-[#E9E1CD] text-[#4A453E] font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
