import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Compass, 
  Heart, 
  ShieldAlert, 
  Award, 
  Users, 
  MoonStar, 
  Sparkles, 
  Trophy, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Plus, 
  Search, 
  User, 
  CheckCircle2, 
  ListChecks, 
  BadgeAlert, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle as HelpIcon,
  BookOpenCheck
} from 'lucide-react';

import { Lesson, StudentProgress, Badge } from './types';
import { lessonsData, unitsData, badgesList } from './data/curriculum';
import SoundEngine from './lib/audio';
import IllustratedStory from './components/IllustratedStory';
import QuizSystem, { grandFinalExam } from './components/QuizSystem';
import FiqhPlayground from './components/FiqhPlayground';
import ComicLibrary from './components/ComicLibrary';

const DEFAULT_PROGRESS: StudentProgress = {
  stars: 0,
  completedLessons: [],
  completedQuizzes: [],
  badgeIds: [],
  quizHighScores: {},
  completedStoryIds: []
};

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(DEFAULT_PROGRESS);
  const [activeTab, setActiveTab] = useState<'books' | 'stories' | 'fiqh' | 'quizzes'>('books');
  const [selectedUnitId, setSelectedUnitId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string | 'all'>('all');
  const [studentName, setStudentName] = useState<string>('مكتشف النور الصغير');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active sessions
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Lesson | null>(null);
  const [activeGrandFinal, setActiveGrandFinal] = useState<boolean>(false);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('islamic_progress_v1');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Stale save-data, resorting to default", e);
      }
    }
    const savedName = localStorage.getItem('islamic_student_name');
    if (savedName) {
      setStudentName(savedName);
    }
  }, []);

  // Sync mute-state with SoundEngine default sound configurations
  const handleToggleMute = () => {
    const nextMute = SoundEngine.toggleMute();
    setIsMuted(nextMute);
  };

  const saveProgress = (newProgress: StudentProgress) => {
    setProgress(newProgress);
    localStorage.setItem('islamic_progress_v1', JSON.stringify(newProgress));
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    localStorage.setItem('islamic_student_name', studentName);
    SoundEngine.playSparkle();
  };

  // Triggered when student successfully finishes reading slides of a book
  const handleLessonCompleted = (lessonId: string, earnedStars: number) => {
    let completed = [...progress.completedLessons];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
    }
    const nextStars = progress.stars + earnedStars;
    
    // Check Badge unlocking
    let bIds = [...progress.badgeIds];
    const newBadgeId = checkBadgesUnlock(completed, progress.completedQuizzes, nextStars, bIds);
    if (newBadgeId) {
      bIds.push(newBadgeId);
      const matchedBadge = badgesList.find(b => b.id === newBadgeId);
      if (matchedBadge) {
        setUnlockedBadge(matchedBadge);
      }
    }

    const nextProgress = {
      ...progress,
      stars: nextStars,
      completedLessons: completed,
      badgeIds: bIds
    };
    saveProgress(nextProgress);
  };

  // Triggered on quiz completion (per-lesson quiz, unit-wide, or final)
  const handleQuizCompleted = (percentage: number, earnedStars: number, quizId: string) => {
    let completedQuizzes = [...progress.completedQuizzes];
    if (!completedQuizzes.includes(quizId)) {
      completedQuizzes.push(quizId);
    }
    const quizHighScores = {
      ...progress.quizHighScores,
      [quizId]: Math.max(progress.quizHighScores[quizId] || 0, percentage)
    };
    const nextStars = progress.stars + earnedStars;

    // Check Badge unlocking
    let bIds = [...progress.badgeIds];
    const newBadgeId = checkBadgesUnlock(progress.completedLessons, completedQuizzes, nextStars, bIds);
    if (newBadgeId) {
      bIds.push(newBadgeId);
      const matchedBadge = badgesList.find(b => b.id === newBadgeId);
      if (matchedBadge) {
        setUnlockedBadge(matchedBadge);
      }
    }

    const nextProgress = {
      ...progress,
      stars: nextStars,
      completedQuizzes,
      quizHighScores,
      badgeIds: bIds
    };
    saveProgress(nextProgress);
  };

  const handleEarnStarsDirectly = (starsToEarn: number) => {
    const nextStars = progress.stars + starsToEarn;
    
    // Check Badge unlocking
    let bIds = [...progress.badgeIds];
    const newBadgeId = checkBadgesUnlock(progress.completedLessons, progress.completedQuizzes, nextStars, bIds);
    if (newBadgeId) {
      bIds.push(newBadgeId);
      const matchedBadge = badgesList.find(b => b.id === newBadgeId);
      if (matchedBadge) {
        setUnlockedBadge(matchedBadge);
      }
    }

    const nextProgress = {
      ...progress,
      stars: nextStars,
      badgeIds: bIds
    };
    saveProgress(nextProgress);
  };

  const handleMarkStoryAsRead = (storyId: string) => {
    let completedStories = progress.completedStoryIds ? [...progress.completedStoryIds] : [];
    if (!completedStories.includes(storyId)) {
      completedStories.push(storyId);
    }
    const nextProgress = {
      ...progress,
      completedStoryIds: completedStories
    };
    saveProgress(nextProgress);
  };

  // Core Badger checker
  const checkBadgesUnlock = (lessons: string[], quizzes: string[], starsCount: number, existingBadgeIds: string[]): string | null => {
    // 1. Explorer badge
    if (lessons.length >= 1 && !existingBadgeIds.includes('explorer')) {
      return 'explorer';
    }
    // 2. Scholar badge (at least 3 quizzes done)
    if (quizzes.length >= 3 && !existingBadgeIds.includes('scholar')) {
      return 'scholar';
    }
    // 3. Hero badge (> 30 stars)
    if (starsCount >= 30 && !existingBadgeIds.includes('hero')) {
      return 'hero';
    }
    // 4. Quiz Master badge
    if (Object.values(progress.quizHighScores).includes(100) && !existingBadgeIds.includes('quizmaster')) {
      return 'quizmaster';
    }
    return null;
  };

  // Filtration logic for lesson cards
  const filteredLessons = lessonsData.filter(less => {
    const matchesUnit = selectedUnitId === 'all' || less.unitId === selectedUnitId;
    const matchesSearch = less.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          less.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || less.type === selectedType;
    return matchesUnit && matchesSearch && matchesType;
  });

  const getLessonStatusText = (lessId: string) => {
    const read = progress.completedLessons.includes(lessId);
    const quizHigh = progress.quizHighScores[lessId];
    if (read && quizHigh && quizHigh >= 100) return "تم الإنجاز والامتياز ⭐";
    if (read && quizHigh) return "تم القراءة والاختبار 📖";
    if (read) return "مقروء ومستعد للاختبار 📜";
    return "كتاب تفاعلي مغلق 🔒";
  };

  // Render proper icon based on lesson category
  const renderTypeIcon = (type: string, className: string = "w-5 h-5") => {
    switch (type) {
      case 'quran':
        return <BookOpen className={`${className} text-emerald-500`} />;
      case 'hadith':
        return <Heart className={`${className} text-rose-500`} />;
      case 'seerah':
        return <Users className={`${className} text-indigo-500`} />;
      case 'fiqh':
        return <Award className={`${className} text-blue-500`} />;
      case 'aqeedah':
        return <ShieldAlert className={`${className} text-purple-500`} />;
      default:
        return <Sparkles className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#4A453E] font-sans text-right antialiased selection:bg-[#5A6B47] selection:text-white pb-12 relative overflow-hidden" dir="rtl">
      
      {/* Repeating Ornament Background Overlay */}
      <div className="absolute inset-0 ornament pointer-events-none z-0"></div>

      {/* Top Main Navigation header (Parchment Sand look) */}
      <header className="bg-[#F1EBDC] border-b border-[#DCD3C1] relative z-10" id="app-gold-header">
        <div className="max-w-6xl mx-auto px-4 py-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & title info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#5A6B47] rounded-xl flex items-center justify-center shadow-md shrink-0">
              <MoonStar className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#3A452E] tracking-tight leading-tight">دروب النور التفاعلية</h1>
              <p className="block text-[#8E8268] text-xs mt-1 text-right font-medium">
                منهج التربية الإسلامية الشامل والممتع للصف السادس الابتدائي 🕌
              </p>
            </div>
          </div>

          {/* Student Profile Card (Name Input inside) */}
          <div className="bg-[#FAF9F6]/90 border border-[#DCD3C1] backdrop-blur-md rounded-3xl p-4 flex items-center gap-4 shadow-md max-w-sm w-full">
            <div className="w-10 h-10 bg-[#5A6B47]/10 text-[#5A6B47] rounded-full flex items-center justify-center text-lg font-bold shrink-0 border border-[#5A6B47]/20">
              <User className="w-5 h-5 text-[#5A6B47]" />
            </div>
            
            <div className="flex-1 min-w-0 text-right">
              {isEditingName ? (
                <div className="flex items-center gap-1.5" id="name-edit-field">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    maxLength={24}
                    className="bg-white text-[#4A453E] text-xs font-bold py-1 px-2.5 rounded-lg border border-[#DCD3C1] w-full outline-none focus:border-[#5A6B47]"
                  />
                  <button 
                    onClick={handleSaveName}
                    className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold text-xs py-1 px-2 rounded-lg transition"
                  >
                    حفظ
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h4 
                    onClick={() => { setIsEditingName(true); SoundEngine.playSparkle(); }}
                    className="font-black text-sm text-[#3A452E] truncate cursor-pointer hover:underline decoration-dashed decoration-[#5A6B47]"
                    title="انقر لتغيير اسمك الصغير"
                  >
                    {studentName}
                  </h4>
                  <span className="text-[10px] text-[#8E8268] font-medium font-mono">(تعديل)</span>
                </div>
              )}
              
              {/* Badges preview inline */}
              <div className="flex gap-1.5 mt-1.5 overflow-x-auto">
                {progress.badgeIds.map(bId => {
                  const badge = badgesList.find(b => b.id === bId);
                  return (
                    <span 
                      key={bId} 
                      className="text-xs bg-[#E9E1CD] border border-[#DCD3C1] px-2 py-0.5 rounded-full flex items-center gap-0.5 whitespace-nowrap"
                      title={badge?.desc}
                    >
                      <span>{badge?.icon}</span>
                      <span className="text-[10px] font-bold text-[#4A453E]">{badge?.title}</span>
                    </span>
                  );
                })}
                {progress.badgeIds.length === 0 && (
                  <span className="text-[10px] text-[#8E8268] font-semibold italic">ابدأ القراءة لتحصد شارات الاستكشاف! 🏅</span>
                )}
              </div>
            </div>

            {/* Stars score container */}
            <div className="text-center bg-[#FAF9F6]/80 p-2.5 rounded-2xl border border-[#DCD3C1] shrink-0">
              <span className="block text-base font-extrabold text-[#D48166] font-sans tracking-tight">
                ⭐ {progress.stars}
              </span>
              <span className="block text-[8px] text-[#8E8268] font-bold uppercase tracking-wide">النجوم المكتسبة</span>
            </div>
          </div>

          {/* Sound, Mute, Volume toggle in header */}
          <button
            onClick={handleToggleMute}
            className="flex items-center justify-center p-3 rounded-2xl bg-[#FAF9F6]/80 border border-[#DCD3C1] text-[#8E8268] hover:text-[#3A452E] transition active:scale-95 cursor-pointer"
            title={isMuted ? "تشغيل الأصوات التفاعلية" : "كتم الأصوات"}
            id="sound-control-btn"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-[#D48166]" /> : <Volume2 className="w-5 h-5 text-[#5A6B47]" />}
          </button>
        </div>
      </header>

      {/* Main Hub workspace tabs */}
      <main className="max-w-6xl mx-auto px-4 mt-8 relative z-10">
        
        {/* Render child illustrated story reader if active */}
        {activeLesson && (
          <IllustratedStory
            lesson={activeLesson}
            onBack={() => {
              setActiveLesson(null);
              SoundEngine.playSparkle();
            }}
            onStartQuiz={() => {
              const matchedLesson = lessonsData.find(l => l.id === activeLesson.id);
              setActiveQuiz(matchedLesson || null);
              setActiveLesson(null);
              SoundEngine.playSparkle();
            }}
            onLessonCompleted={handleLessonCompleted}
            isCompletedBefore={progress.completedLessons.includes(activeLesson.id)}
          />
        )}

        {/* Render quiz session if active */}
        {activeQuiz && (
          <QuizSystem
            quizTitle={`اختبار كتاب: ${activeQuiz.title}`}
            questions={activeQuiz.quiz}
            onBack={() => {
              setActiveQuiz(null);
              SoundEngine.playSparkle();
            }}
            onQuizCompleted={(pct, stars) => handleQuizCompleted(pct, stars, activeQuiz.id)}
          />
        )}

        {/* Render Grand final exam of all units */}
        {activeGrandFinal && (
          <QuizSystem
            quizTitle="الامتحان النهائي الكبير: حارس نجوم المعرفة 🌌"
            questions={grandFinalExam}
            onBack={() => {
              setActiveGrandFinal(false);
              SoundEngine.playSparkle();
            }}
            onQuizCompleted={(pct, stars) => handleQuizCompleted(pct, stars, "grand-final-exam")}
          />
        )}

        {/* Home tabs menu (only show when no core sub-session is open) */}
        {!activeLesson && !activeQuiz && !activeGrandFinal && (
          <>
            {/* Nav Main tabs switcher */}
            <div className="flex border-b border-[#DCD3C1] mb-8 overflow-x-auto gap-4 scrollbar-none" id="main-navigation-tabs">
              <button
                onClick={() => { setActiveTab('books'); SoundEngine.playSparkle(); }}
                className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none cursor-pointer ${
                  activeTab === 'books'
                    ? 'border-[#5A6B47] text-[#5A6B47] font-black'
                    : 'border-transparent text-[#8E8268] hover:text-[#3A452E]'
                }`}
                id="tab-btn-books"
              >
                <BookOpen className="w-5 h-5 shrink-0" />
                <span>المنهج الرسمي 📖</span>
              </button>

              <button
                onClick={() => { setActiveTab('stories'); SoundEngine.playSparkle(); }}
                className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none cursor-pointer ${
                  activeTab === 'stories'
                    ? 'border-[#D48166] text-[#D48166] font-black'
                    : 'border-transparent text-[#8E8268] hover:text-[#3A452E]'
                }`}
                id="tab-btn-stories"
              >
                <Sparkles className="w-5 h-5 shrink-0 text-[#D48166]" />
                <span>المكتبة المصورة لكتب المنهج 📚</span>
              </button>

              <button
                onClick={() => { setActiveTab('fiqh'); SoundEngine.playSparkle(); }}
                className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none cursor-pointer ${
                  activeTab === 'fiqh'
                    ? 'border-[#5A6B47] text-[#5A6B47] font-black'
                    : 'border-transparent text-[#8E8268] hover:text-[#3A452E]'
                }`}
                id="tab-btn-fiqh"
              >
                <Award className="w-5 h-5 shrink-0" />
                <span>ملعب الفقه والعبادات 🕌</span>
              </button>

              <button
                onClick={() => { setActiveTab('quizzes'); SoundEngine.playSparkle(); }}
                className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none cursor-pointer ${
                  activeTab === 'quizzes'
                    ? 'border-[#5A6B47] text-[#5A6B47] font-black'
                    : 'border-transparent text-[#8E8268] hover:text-[#3A452E]'
                }`}
                id="tab-btn-quizzes"
              >
                <ListChecks className="w-5 h-5 shrink-0" />
                <span>ممر الاختبارات الشاملة والنهائية</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'books' && (
              <div>
                {/* Search, Units filtres & Pills inside */}
                <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-5 rounded-3xl mb-8 flex flex-col gap-5 shadow-sm">
                  
                  {/* Search and type-pills */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-1/2">
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8E8268]">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="ابحث عن سور القرآن، أو الأحاديث، أو قصص الصحابة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#F7F3E9] text-[#4A453E] text-xs py-2.5 pr-10 pl-4 rounded-xl border border-[#DCD3C1] outline-none focus:border-[#5A6B47] focus:bg-white"
                        id="search-lessons-input"
                      />
                    </div>

                    {/* Lesson Type labels pills */}
                    <div className="flex flex-wrap gap-1.5 justify-end w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedType('all')}
                        className={`text-[#4A453E] text-[10px] font-bold py-1.5 px-3 rounded-lg border transition cursor-pointer ${
                          selectedType === 'all'
                            ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                            : 'border-[#DCD3C1] hover:bg-[#E9E1CD]'
                        }`}
                      >
                        الكل 🌟
                      </button>
                      <button
                        onClick={() => setSelectedType('quran')}
                        className={`text-[10px] font-bold py-1.5 px-3 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                          selectedType === 'quran'
                            ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                            : 'border-[#DCD3C1] hover:bg-[#E2D9C2]/40 text-[#5A6B47]'
                        }`}
                      >
                        القرآن الكريم 📖
                      </button>
                      <button
                        onClick={() => setSelectedType('hadith')}
                        className={`text-[10px] font-bold py-1.5 px-3 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                          selectedType === 'hadith'
                            ? 'bg-[#D48166] text-white border-[#D48166]'
                            : 'border-[#DCD3C1] hover:bg-[#E2D9C2]/40 text-[#D48166]'
                        }`}
                      >
                        الأحاديث الشريفة 💖
                      </button>
                      <button
                        onClick={() => setSelectedType('seerah')}
                        className={`text-[10px] font-bold py-1.5 px-3 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                          selectedType === 'seerah'
                            ? 'bg-[#8E8268] text-white border-[#8E8268]'
                            : 'border-[#DCD3C1] hover:bg-[#E2D9C2]/40 text-[#8E8268]'
                        }`}
                      >
                        السيرة والصحابة 👥
                      </button>
                    </div>
                  </div>

                  {/* Units Horizontal exploration bar & description details */}
                  <div className="border-t border-[#DCD3C1] pt-4">
                    <p className="block text-xs font-bold text-[#8E8268] mb-3 text-right">اختر الوحدة الدراسية لتصفح كتبها:</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" id="units-pills-list">
                      <button
                        onClick={() => setSelectedUnitId('all')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer shrink-0 border ${
                          selectedUnitId === 'all'
                            ? 'bg-[#5A6B47] text-white border-[#5A6B47] shadow-sm'
                            : 'border-[#DCD3C1] text-[#4A453E] hover:bg-[#E9E1CD]'
                        }`}
                      >
                        جميع الوحدات 🗺️
                      </button>
                      {unitsData.map(unit => (
                        <button
                          key={unit.id}
                          onClick={() => setSelectedUnitId(unit.id)}
                          className={`py-2 px-3.5 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer shrink-0 border flex items-center gap-1 ${
                            selectedUnitId === unit.id
                              ? 'bg-[#5A6B47] text-white border-[#5A6B47] shadow-sm'
                              : 'border-[#DCD3C1] text-[#4A453E] hover:bg-[#E9E1CD]'
                          }`}
                        >
                          <span>{unit.id}.</span>
                          <span>{unit.shortTitle}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Lessons storybooks grid directory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="storybook-cards-grid">
                  {filteredLessons.map(less => {
                    const isRead = progress.completedLessons.includes(less.id);
                    const highPct = progress.quizHighScores[less.id];
                    let indicatorBg = 'bg-[#E9E1CD] text-[#8E8268] border border-[#DCD3C1]';
                    let indicatorText = 'غير مقروء 💬';

                    if (isRead && highPct && highPct >= 100) {
                      indicatorBg = 'bg-[#5A6B47]/10 text-[#5A6B47] border border-[#5A6B47]/30';
                      indicatorText = 'أتقنت الاختبار ⭐';
                    } else if (isRead && highPct) {
                      indicatorBg = 'bg-[#FAF9F6] text-[#D48166] border border-[#DCD3C1]';
                      indicatorText = `أعلى درجة: ${highPct}% 🎯`;
                    } else if (isRead) {
                      indicatorBg = 'bg-[#E9E1CD] text-[#3A452E] border border-[#DCD3C1]';
                      indicatorText = 'مقروء، بانتظار الاختبار! 📝';
                    }

                    return (
                      <motion.div
                        whileHover={{ y: -3 }}
                        key={less.id}
                        className="bg-[#FAF9F6] border border-[#DCD3C1] rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#5A6B47]/50 transition-all h-[240px]"
                      >
                        <div>
                          {/* Card top badge */}
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${indicatorBg}`}>
                              {indicatorText}
                            </span>
                            {renderTypeIcon(less.type)}
                          </div>

                          <h3 className="font-extrabold text-sm text-[#3A452E] mb-2 leading-snug line-clamp-1">
                            {less.title}
                          </h3>
                          <p className="text-xs text-[#8E8268] line-clamp-3 leading-relaxed">
                            {less.shortDesc}
                          </p>
                        </div>

                        {/* Open story trigger */}
                        <div className="mt-4 pt-3 border-t border-[#DCD3C1] flex items-center justify-between">
                          <span className="text-[10px] text-[#8E8268] font-bold font-mono">الدروس {less.slides.length} صفحات</span>
                          <button
                            onClick={() => {
                              setActiveLesson(less);
                              SoundEngine.playSparkle();
                            }}
                            className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 transition shadow-sm cursor-pointer"
                          >
                            <span>افتح القصة التفاعلية 📖</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {filteredLessons.length === 0 && (
                    <div className="col-span-full bg-[#FAF9F6] border border-[#DCD3C1] p-12 text-center rounded-3xl">
                      <span className="text-3xl mb-2 inline-block">🔍</span>
                      <h4 className="font-bold text-sm text-[#3A452E]">لم نعثر على كتب مطابقة لبحثك</h4>
                      <p className="text-xs text-[#8E8268] max-w-sm mx-auto leading-relaxed mt-1">
                        تأكد من تعديل أو تصفير تصفية البحث لتفحص خزانة الكتب الإسلامية بوضوح تام.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: External Comic stories */}
            {activeTab === 'stories' && (
              <ComicLibrary 
                onEarnStars={handleEarnStarsDirectly}
                completedStoryIds={progress.completedStoryIds || []}
                onMarkAsRead={handleMarkStoryAsRead}
              />
            )}

            {/* TAB 2: Interactive Fiqh playground */}
            {activeTab === 'fiqh' && (
              <FiqhPlayground onEarnStars={handleEarnStarsDirectly} />
            )}

            {/* TAB 3: Quizzes list & Grand finals */}
            {activeTab === 'quizzes' && (
              <div className="max-w-4xl mx-auto">
                
                {/* Custom glowing space background for Final Comprehensive Exam Game */}
                <div className="bg-[#FAF9F6] border-2 border-[#D48166] p-6 rounded-3xl text-right text-[#4A453E] relative overflow-hidden mb-8 shadow-md">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="inline-block text-[10px] bg-[#D48166] text-white font-black px-2.5 py-1 rounded-md mb-1 animate-bounce">
                        تحدي فرسان النور الكبار 🌌
                      </span>
                      <h2 className="text-lg font-black font-sans leading-tight text-[#3A452E]">الامتحان النهائي للأبطال: حارس نجوم المعرفة</h2>
                      <p className="text-xs text-[#8E8268] leading-relaxed max-w-xl font-medium">
                        امتحان شامل وموجه مؤلف من ١٠ أسئلة جوهرية تغطي كل وحدات الكتاب المدرسي للصف السادس الابتدائي. أحرز شرف الإتقان المطلق واحصل على شارات العلم العظيمة والكثير من النجوم!
                      </p>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <button
                        onClick={() => {
                          setActiveGrandFinal(true);
                          SoundEngine.playSparkle();
                        }}
                        className="bg-[#D48166] hover:bg-[#C26F54] text-white font-black text-xs py-3 px-6 rounded-2xl flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-[#D48166]/20 cursor-pointer"
                      >
                        <Trophy className="w-5 h-5 shrink-0" />
                        <span>انطلق في الامتحان النهائي الكبير الممتع</span>
                      </button>
                      <span className="text-[10px] text-[#8E8268] font-bold mt-2">
                        أعلى درجة أحرزتها: {progress.quizHighScores['grand-final-exam'] !== undefined ? `${progress.quizHighScores['grand-final-exam']}% 🎯` : 'لم تُختبر بعد'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lesson-wise quizzes board */}
                <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-sm">
                  <h3 className="font-extrabold text-sm text-[#3A452E] mb-2 pr-2 border-r-4 border-[#5A6B47]">اختبر معلوماتك لدرس بمفرده:</h3>
                  <p className="text-xs text-[#8E8268] leading-relaxed mb-6">
                    كل درس يحتوي على ٤ أسئلة ذكاء لقياس الفهم، احصل على ١٠ نجوم عن كل درجة ١٠٠٪ تجتازها!
                  </p>

                  <div className="space-y-4" id="individual-quizzes-list">
                    {lessonsData.map(less => {
                      const high = progress.quizHighScores[less.id];
                      return (
                        <div 
                          key={less.id}
                          className="p-4 bg-[#F1EBDC]/40 hover:bg-[#E9E1CD]/45 border border-[#DCD3C1]/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
                        >
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-[#5A6B47]/10 text-[#5A6B47] flex items-center justify-center shrink-0">
                              {renderTypeIcon(less.type, "w-4.5 h-4.5")}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-[#3A452E]">
                                اختبار كتاب: {less.title}
                              </h4>
                              <p className="text-[10px] text-[#8E8268] mt-0.5 line-clamp-1 max-w-md font-medium">
                                {less.shortDesc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
                            <span className="text-[10px] text-[#8E8268] font-bold">
                              {high !== undefined ? `النتيجة: ${high}% 🎯` : 'لم تُختبر بعد'}
                            </span>
                            <button
                              onClick={() => {
                                setActiveQuiz(less);
                                SoundEngine.playSparkle();
                              }}
                              className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition inline-block text-center cursor-pointer"
                            >
                              خوض الاختبار 📝
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </main>

      {/* Badges unlocked modal overlay celebrating achievements */}
      <AnimatePresence>
        {unlockedBadge && (
          <div className="fixed inset-0 bg-[#3A452E]/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#FAF9F6] border-2 border-[#5A6B47] text-[#4A453E] text-center rounded-3xl p-8 max-w-sm w-full relative overflow-hidden shadow-2xl"
              id="badge-celebrate-box"
            >
              {/* Star sparkles decor animation background */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E9E1CD]/50 rounded-full blur-2xl"></div>

              <div className="text-5xl mb-4 animate-bounce inline-block bg-[#F1EBDC] p-4 rounded-full border border-[#DCD3C1]">
                {unlockedBadge.icon}
              </div>

              <h3 className="text-[#3A452E] font-black text-xl mb-1">أُفْرِجَ عَنْ شَارِة جَدِيدَة! 🏅</h3>
              <span className="inline-block text-[#D48166] bg-[#D48166]/10 font-black text-xs py-1 px-3 rounded-full border border-[#D48166]/20 mb-4">
                شارات {unlockedBadge.title}
              </span>

              <p className="text-[#8E8268] text-xs leading-relaxed mb-6 font-medium">
                « {unlockedBadge.desc} »
              </p>

              <button
                onClick={() => {
                  setUnlockedBadge(null);
                  SoundEngine.playSparkle();
                }}
                className="w-full bg-[#5A6B47] hover:bg-[#465337] text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition active:scale-95 text-xs text-center cursor-pointer"
                id="btn-confirm-badge"
              >
                عظيم، سأواصل الإنجاز! 🌟
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
