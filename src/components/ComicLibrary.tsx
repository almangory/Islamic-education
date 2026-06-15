import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  ArrowLeft, 
  Trophy, 
  BookOpenCheck,
  Search,
  Heart,
  Users,
  Award,
  Clock,
  ThumbsUp,
  Download,
  Info
} from 'lucide-react';
import SoundEngine from '../lib/audio';

export interface ComicStory {
  id: string;
  title: string;
  url: string;
  type: 'morals' | 'family' | 'citizenship' | 'nature' | 'knowledge';
  typeNameAr: string;
  shortDesc: string;
  moralLessons: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const comicStoriesList: ComicStory[] = [
  {
    id: "comic-1",
    title: "القصة الأولى: روعة التسامح والصفح 🌸",
    url: "https://drive.google.com/file/d/1elrqkZ5xThOIm7t-OZY_6DVetP-31Y1h/view?usp=sharing",
    type: "morals",
    typeNameAr: "أخلاق وقيم الإسلام",
    shortDesc: "رحلة تفاعلية مصورة تُعلّم الطفل خلق المروءة الحبيب في العفو عن المخطئ واحتساب الأجر عند الله تبارك وتعالى.",
    moralLessons: [
      "العفو والصفح خلق إسلامي عظيم يرفع منزلة صاحبه في الدنيا والآخرة.",
      "مقابلة الإساءة بالإحسان تذيب خلافات القلوب وتولّد المحبة والوئام.",
      "التزام الهدوء والتحكم بالنفس عند الغضب علامة القوة العقلية والروحية."
    ],
    quiz: {
      question: "ما هو الأثر الأعظم لنشر خلق التسامح والصفح المتبادل بين الأصدقاء؟",
      options: [
        "نشر المودة، وإنهاء الخلافات، وتطهير القلوب من العتب والغل.",
        "الشعور بالضعف أمام الآخرين والتعرض للظلم المستمر.",
        "تجنب تبادل النصح والابتعاد عن التكلم مع الزملاء كلياً."
      ],
      correctIndex: 0,
      explanation: "التسامح يطهر الأرواح وينشر المودة كما أمرنا الله ورسوله، وهو مبعث عزة المسلم وقوة أواصر مجتمعه."
    }
  },
  {
    id: "comic-2",
    title: "القصة الثانية: بر الوالدين ونور الحياة 💖",
    url: "https://drive.google.com/file/d/1OVYXGFDgpY_gPadyPa6bpSKjAkwvQSlH/view?usp=sharing",
    type: "family",
    typeNameAr: "الأسرة والبر",
    shortDesc: "قصة تفاعلية مبهجة تسلط الضوء على فضل طاعة الوالدين، وخفض جناح الرحمة لهما لنيل رضا المولى وتوفيق الحياة.",
    moralLessons: [
      "بر الوالدين من أفضل وأجلّ الطاعات والعبادات المقربة لله عز وجل بعد التوحيد.",
      "مخاطبتهما برفق تام وصوت منخفض، وتجنب استخدام كلمة «أفٍّ» معهما.",
      "رعايتهما بالمال والبدن والدعاء الصالح المستمر لهما في حياتهما وبعد رحيلهما."
    ],
    quiz: {
      question: "أي الممارسات التالية تعد المعنى الأسمى للبر الحقيقي بالوالدين؟",
      options: [
        "مساعدتهما بابتسامة مشرقة وتلبية رغباتهما فوراً وبطيب نفس.",
        "تلبية أوامرهما مع إظهار التأفف والضجر والغضب بالعين.",
        "تقديم العون المادي لهما مع تذكيرهما الدائم بحجم فضلك وتعبك."
      ],
      correctIndex: 0,
      explanation: "البر الحقيقي يتمثل في طاعة الوالدين بأدب مخلص وابتسامة صادقة تعبيراً عن التقدير والعرفان بجميلهما."
    }
  },
  {
    id: "comic-3",
    title: "القصة الثالثة: آداب الحوار وبث السلام 🤝",
    url: "https://drive.google.com/file/d/1Jj9_kgBEegSObI6y84Wc4nswCmrwzTQH/view?usp=sharing",
    type: "morals",
    typeNameAr: "أخلاق وقيم الإسلام",
    shortDesc: "مشاهد كرتونية تعلم الأطفال المبادئ السامية في أدب النقاش، وكيفية إبداء الرأي بتهذيب واحترام الاختلاف.",
    moralLessons: [
      "الاستماع الفطين والمستمر للمتحدث بغير مقاطعة تسرّع الفهم.",
      "تقبل وجهات نظر الآخرين برحابة صدر وعفة اللسان دون تشنج.",
      "تجنب السخرية من آراء زملائنا والرد بلطف ومنطق مقتبس من سيرة المصطفى."
    ],
    quiz: {
      question: "إذا وجدت زميلك متمسكاً برأي مخالف لرأيك تماماً في الفصل، فكيف تتصرف معه؟",
      options: [
        "أستمع لطرحه كاملًا باحترام، ثم أعبر عن رأيي بوضوح مدعمًا بالدليل المهذب.",
        "أنفعل عليه وأتهمه بالجهل والتعنت أمام المعلم والتلاميذ كعقاب له.",
        "أقاطعه في كل جملة وأرفض التحدث معه مجدداً لإثبات صحة رأيي."
      ],
      correctIndex: 0,
      explanation: "يعلمنا الإسلام آداب الكلام بالحكمة والموعظة الحسنة واحترام الآخرين حتى مع اختلاف منطلقات الرأي."
    }
  },
  {
    id: "comic-4",
    title: "القصة الرابعة: الأمانة وحصاد الأمان 💎",
    url: "https://drive.google.com/file/d/1BMIctKQ4QVh8gp1SQ8bcbrucmLxHsMws/view?usp=sharing",
    type: "citizenship",
    typeNameAr: "المسؤولية والمواطنة",
    shortDesc: "ترسخ هذه الرسوم قيمة الأمانة كشرط إيماني واجتماعي ينشر الرخاء والسلامة في مجتمعاتنا الإسلامية.",
    moralLessons: [
      "الأمانة تشمل الحفاظ على ودائع الآخرين وأسرارهم وصيانة سمعتهم.",
      "الصدق العلمي وحفظ غياب الزملاء والدقة في أداء الواجب الدراسي أمانة تربوية.",
      "رد الممتلكات لأصحابها ونبذ الغش في الاختبارات بوعي تام بمراقبة الله السامعي."
    ],
    quiz: {
      question: "ما هو أفضل وصف لخلق الأمانة في حياة الملم المتقي بالمدرسة؟",
      options: [
        "حفظ ممتلكات وأدوات الآخرين، وتجنب الغش، والاجتهاد الصادق في طلب العلم.",
        "إرجاع المستعارات تالفة مع تلفيق الأعذار المبررة للهروب من الغرامة.",
        "استعارة الكتب المدرسية والاحتفاظ بها دون إرجاعها للمكتبة للانتفاع الشخصي."
      ],
      correctIndex: 0,
      explanation: "الأمانة هي الصدق السلوكي، وتضم أمانة العلم وأمانة الودائع والحرص على حقوق الغير في الغيب والحضور."
    }
  },
  {
    id: "comic-5",
    title: "القصة الخامسة: رعاية البيئة وإعمار الأرض 🌱",
    url: "https://drive.google.com/file/d/1wv4Aam5XkPkwkLknmoBoVprkQ9wVtIZo/view?usp=sharing",
    type: "nature",
    typeNameAr: "البيئة والنعم",
    shortDesc: "جولة فكرية ممتازة حول حماية الطبيعة، والنهي عن الإسراف في المياه، وغرس المزروعات كصدقة جارية ممتدة.",
    moralLessons: [
      "عمارة الأرض وحمايتها فريضة شرعية تبرهن شكر الإنسان لنعم الخالق العظيمة.",
      "ترشيد استخدام المياه في الغذاء والطهو والوضوء، والمحافظة التامة على موارد الطاقة.",
      "كف الأذى عن الطرقات وزرع الشتلات لكونها مصدر تغذية للبشر والحيوان والطير."
    ],
    quiz: {
      question: "تنص التعاليم النبوية الكريمة على ضرورة الحفاظ على البيئة من خلال:",
      options: [
        "زراعة الأشجار كصدقة وعمارة، والنظافة، والاقتصاد الشديد في مصادر المياه والكلأ.",
        "الانتفاع الجائر بموارد المياه وعدم المبالاة باتساخ الأماكن العامة والبراری.",
        "صيد الحيوانات البرية بلا رادع للتباهي بالمهارة الجسدية."
      ],
      correctIndex: 0,
      explanation: "يربط الإسلام بين الحفاظ على موارد الكوكب المائية والزراعية وبين نيل ثواب الآخرة كصدقة متواصلة النفع."
    }
  },
  {
    id: "comic-6",
    title: "القصة السادسة: بركة الوقت والجد ⏳",
    url: "https://drive.google.com/file/d/1hRZhpXbMEfxsKMDljOh3nyVEBlOl6AhS/view?usp=sharing",
    type: "knowledge",
    typeNameAr: "طلب العلم والمعرفة",
    shortDesc: "تبين أهمية الوقت وعمره الذهبي، وكيف ينجح التلميذ المسلم في تنظيم ساعاته بين العبادات والمذاكرة التثقيفية.",
    moralLessons: [
      "الوقت وعاء الأعمال، والمسؤولية عنه عظيمة في السؤال بين يدي المولى يوم القيامة.",
      "استثمار الفراغ بالمطالعة المفيدة وبناء المواهب وحفظ الذكر والقرآن المبارك.",
      "وضع الخطط والموازنة العادلة والمرحة بين نيل قسط ترفيهي وأداء فروض العلم والعمل."
    ],
    quiz: {
      question: "ما هي النتيجة الطبيعية للمسلم الذي يلتزم بجدية كبرى في تثمين وقته؟",
      options: [
        "نيل مرضاة الله، وتحقيق الطموحات السامية، والشعور بالراحة والرسوخ المعرفي.",
        "العزلة الكاملة والابتعاد عن مواكبة عجلة الحياة ونشاط المجتمع.",
        "زيادة كسل العقل وتراكم الدروس بلا استيعاب في الذهن لتكدس المهام."
      ],
      correctIndex: 0,
      explanation: "تثمين الفراغ واستغلاله بالخير يثمر ثقة النفس، وينهض بالدرجات العلمية والروحية بامتياز وطمأنينة سديدة."
    }
  },
  {
    id: "comic-7",
    title: "القصة السابعة: قوة التعاون وعقيدة البنيان 🏬",
    url: "https://drive.google.com/file/d/1mtx-jJtzHW-CeNl-FnBEBPcQJQbCRsAR/view?usp=sharing",
    type: "citizenship",
    typeNameAr: "المسؤولية والمواطنة",
    shortDesc: "بأسلوب كرتوني باهر، تعرض هذه القصة كيف يشد المؤمنون بعضهم بعضاً في السراء والضراء لبناء وطن كريم متماسك.",
    moralLessons: [
      "تطبيق مبدأ الجسد الواحد المساند لبعضه والذي يبعث الطمأنينة للفئات الضعيفة.",
      "المساهمة بنشاطات المجموعات التطوعية، وتربية صفات العون داخل المدارس والمصالح.",
      "تقاسم النجاحات مع الآخرين وزرع قيم الفرحة والسرور بلا شحناء أو حسد دفين."
    ],
    quiz: {
      question: "ما هو التوجيه الحصيف لحديث النبي «المؤمن للمؤمن كالبنيان يشد بعضه بعضاً»؟",
      options: [
        "التعاضد والتعاون على البر والخير وبناء روابط متماسكة تنشر الأمن والاستقرار.",
        "ترك كل فرد يجابه الصعاب بحال سبيله للاعتماد الذاتي على عضلاته.",
        "تقسيم فئات المجتمع ونبذ التعاون لمصلحة الفرد الواحد الأقوى مالاً."
      ],
      correctIndex: 0,
      explanation: "البنيان المرصوص يعكس الوحدة البنيانية، فالتعاون البهيج يخفف النوائب ويضمن صعود وبقاء المجتمع شامخاً وقوياً."
    }
  },
  {
    id: "comic-8",
    title: "القصة الثامنة: شكر المنعم ومساندة الضعيف ✨",
    url: "https://drive.google.com/file/d/1QjTDrpEZhICLiy52uG9umitd7zqVivlO/view?usp=sharing",
    type: "morals",
    typeNameAr: "أخلاق وقيم الإسلام",
    shortDesc: "رواية بصرية تسلط الضوء على مفهوم الحمد، وكيف تزيد نعم الله بدعم الآخرين والتواضع ومشاركة الأرزاق.",
    moralLessons: [
      "الاعتراف بقلب عامر بمحبة الوهاب بنعمه الظاهرة والباطنة في كل نفس نعيشه.",
      "استعمال الهبات والصحة والعافية فيما يرضي الله تبارك وتعالى وفي إعانة المعوزين.",
      "إفشاء مبدأ الحمد باللسان والجوارح، فبشكر الصنيع والخير يربو العطاء والرزق الوافر."
    ],
    quiz: {
      question: "ما هي الطريقة الفضلى لممارسة شكر نعم الله الفياضة بصورة عملية يراها المجتمع؟",
      options: [
        "استعمال النعم في مرضاة الله، ومساعدة الفقير بما رزقنا، والإقرار بفضله سبحانه.",
        "التباهي بالمظاهر الباذخة أمام الآخرين لجعلهم مستائين من ظروف عيشهم.",
        "كتم وجود الخير والتشكي المستمر لكل سائل ومحتاج لدرء طلبهم المساعدة."
      ],
      correctIndex: 0,
      explanation: "الشكر العملي يقوم على توظيف النعَم في طاعة رب العرش الكريم، وإشراك المحتاجين في خيراتها بالرفق والامتنان."
    }
  }
];

interface ComicLibraryProps {
  onEarnStars: (stars: number) => void;
  completedStoryIds: string[];
  onMarkAsRead: (storyId: string) => void;
}

export default function ComicLibrary({ onEarnStars, completedStoryIds, onMarkAsRead }: ComicLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReaderStory, setActiveReaderStory] = useState<ComicStory | null>(null);
  
  // Quiz specific states in reader
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean>(false);
  const [quizClaimedStories, setQuizClaimedStories] = useState<string[]>(() => {
    const saved = localStorage.getItem('claimed_story_quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const getDriveEmbedUrl = (url: string) => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  const getDriveDownloadUrl = (url: string) => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  // Filter logic
  const filteredStories = comicStoriesList.filter(story => {
    const matchesCategory = selectedCategory === 'all' || story.type === selectedCategory;
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenReader = (story: ComicStory) => {
    setActiveReaderStory(story);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setIsQuizCorrect(false);
    
    // Automatically trigger read achievement if not read yet
    if (!completedStoryIds.includes(story.id)) {
      onMarkAsRead(story.id);
      onEarnStars(5); // 5 stars for discovering/opening the comic book!
      SoundEngine.playSuccess();
    } else {
      SoundEngine.playSparkle();
    }
  };

  const handleBackToLibrary = () => {
    setActiveReaderStory(null);
    SoundEngine.playSparkle();
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizOption === null || !activeReaderStory) return;
    
    const correct = selectedQuizOption === activeReaderStory.quiz.correctIndex;
    setIsQuizCorrect(correct);
    setIsQuizSubmitted(true);
    
    if (correct) {
      SoundEngine.playSuccess();
      if (!quizClaimedStories.includes(activeReaderStory.id)) {
        const nextClaimed = [...quizClaimedStories, activeReaderStory.id];
        setQuizClaimedStories(nextClaimed);
        localStorage.setItem('claimed_story_quizzes', JSON.stringify(nextClaimed));
        onEarnStars(5); // Additional +5 stars for correct comprehension!
        SoundEngine.playTrophy();
      }
    } else {
      SoundEngine.playFailure();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2 text-right relative z-10" dir="rtl" id="comic-library-root-section">
      
      <AnimatePresence mode="wait">
        {!activeReaderStory ? (
          // STORY LISTINGS MAIN VIEW
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {/* Header Jumbotron */}
            <div className="bg-gradient-to-r from-[#D48166] to-[#A05C46] p-6 rounded-[2rem] text-white mb-8 shadow-md">
              <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight mb-2 flex items-center gap-2">
                    <span>🎨 مكتبة القصص المصوّرة والشرائح الممتعة</span>
                    <span className="text-xs bg-white/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold animate-pulse">جديد ✨</span>
                  </h1>
                  <p className="text-[#F1EBDC] text-xs leading-relaxed max-w-xl font-medium">
                    انقُر لتصفُّح وقراءة أجمل السرديات والقصص الكرتونية الملهمة مباشرة داخل حاسوبك! تعلّم أصول التعامل مع محيطك والبيئة والأصدقاء، وأجب عن الأسئلة البسيطة لتحرز +١٠ نجوم كاملة لكل قصة!
                  </p>
                </div>
                <div className="bg-white/10 shrink-0 text-white font-bold px-4 py-2.5 rounded-2xl border border-white/20 text-xs flex items-center gap-1.5 shadow-inner">
                  <Trophy className="w-4.5 h-4.5 text-yellow-300" />
                  <span>مكافآت قراءاتك: +٨٠ نجمة ⭐</span>
                </div>
              </div>
            </div>

            {/* Filter controls & Search */}
            <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-5 rounded-3xl mb-8 flex flex-col gap-5 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Custom input bar */}
                <div className="relative w-full md:w-1/3">
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8E8268]">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو الوصف عن القصة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F7F3E9] text-[#4A453E] text-xs py-2.5 pr-10 pl-4 rounded-xl border border-[#DCD3C1] outline-none focus:border-[#D48166] focus:bg-white transition"
                    id="search-comics-input"
                  />
                </div>

                {/* Filter tags pill row */}
                <div className="flex flex-wrap gap-1.5 justify-end w-full md:w-auto">
                  <button
                    onClick={() => { setSelectedCategory('all'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-4 rounded-xl border transition cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#D48166] text-white border-[#D48166]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD] text-[#4A453E]'
                    }`}
                  >
                    تفحص الكل 🌈
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('morals'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'morals'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#5A6B47]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>أخلاق وقيم</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('family'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'family'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#8E8268]'
                    }`}
                  >
                    <BookOpenCheck className="w-3.5 h-3.5" />
                    <span>الأسرة والبر</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('citizenship'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'citizenship'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#8E8268]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>المجتمع والمواطنة</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('nature'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'nature'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#5A6B47]'
                    }`}
                  >
                    <span>🌱 البيئة والنعم</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stories Grid cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="comics-visual-grid">
              {filteredStories.map((story) => {
                const isRead = completedStoryIds.includes(story.id);
                const isQuizCompleted = quizClaimedStories.includes(story.id);

                return (
                  <motion.div
                    key={story.id}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="bg-[#FAF9F6] border border-[#DCD3C1] hover:border-[#D48166] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[250px]"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[9px] font-black py-0.5 px-2 rounded-full border ${
                          isRead 
                            ? 'bg-[#5A6B47]/10 text-[#5A6B47] border-[#5A6B47]/20'
                            : 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'
                        }`}>
                          {isRead ? "تمت قراءتها 📖 +٥ نجوم" : "قصة جديدة ✨"}
                        </span>
                        
                        <span className="text-[9px] bg-[#E9E1CD] text-[#8E8268] border border-[#DCD3C1] py-0.5 px-2 rounded">
                          {story.typeNameAr}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-[#3A452E] text-xs sm:text-sm line-clamp-2 leading-snug mb-2 font-sans">
                        {story.title}
                      </h3>
                      <p className="text-[#8E8268] text-xs leading-relaxed line-clamp-3">
                        {story.shortDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#DCD3C1] flex items-center justify-between">
                      <span className="text-[10px] text-[#A05C46] font-bold flex items-center gap-0.5">
                        {isQuizCompleted ? "✅ اختبرت بنجاح" : "✍️ سؤال بانتظارك"}
                      </span>
                      
                      <button
                        onClick={() => handleOpenReader(story)}
                        className="bg-[#D48166] hover:bg-[#C26F54] text-white font-extrabold text-[10px] sm:text-xs py-2 px-3 rounded-xl transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>اقرأ القصة المصورة 🎨</span>
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {filteredStories.length === 0 && (
                <div className="col-span-full bg-[#FAF9F6] border border-[#DCD3C1] p-12 text-center rounded-3xl">
                  <span className="text-4xl mb-2 inline-block">📔</span>
                  <h4 className="font-bold text-sm text-[#3A452E]">لم نعثر على قصص تطابق كلمات البحث</h4>
                  <p className="text-xs text-[#8E8268] max-w-sm mx-auto leading-relaxed mt-1">
                    أعد تصفية الاختيارات أو تصفية البحث لتشاهد الشرائح الرائعة المتاحة لغرس قيم الإيمان.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          
          // DETAILED CARD COMPACT READER MODE
          <motion.div
            key="reader-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column / Main visual reader */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Toolbar */}
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-4 rounded-2xl flex items-center justify-between gap-4">
                <button
                  onClick={handleBackToLibrary}
                  className="text-xs text-[#8E8268] hover:text-[#3A452E] font-black flex items-center gap-1 px-3 py-1.5 bg-[#F1EBDC] hover:bg-[#E9E1CD] rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#8E8268]" />
                  <span>العودة لكتالوج القصص</span>
                </button>
                
                <h2 className="font-extrabold text-[11px] sm:text-xs text-[#3A452E] truncate max-w-xs sm:max-w-md">
                  {activeReaderStory.title}
                </h2>

                <div className="flex items-center gap-2">
                  <a 
                    href={activeReaderStory.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-white font-bold bg-[#D48166] hover:bg-[#C26F54] px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>عرض بكامل الشاشة 🌐</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Reader embedded Frame */}
              <div className="bg-[#FAF9F6] border-2 border-[#DCD3C1] rounded-[2rem] overflow-hidden shadow-md relative h-[500px] sm:h-[650px] flex flex-col bg-stone-100">
                <iframe
                  src={getDriveEmbedUrl(activeReaderStory.url)}
                  className="w-full h-full border-none"
                  allow="autoplay"
                  referrerPolicy="no-referrer"
                  title={activeReaderStory.title}
                />
              </div>

              {/* Safety notification tip underneath */}
              <div className="bg-[#FAF9F6]/80 border border-[#DCD3C1] p-4 rounded-2xl text-xs text-[#8E8268] flex items-start gap-2.5">
                <Info className="w-5 h-5 text-[#D48166] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  إذا لم يتم تحميل الكتاب المصوّر تلقائياً بسبب سياسة حماية المتصفحات، لا تقلق أبداً! يمكنك النقر مباشرة على زر 
                  <strong className="text-[#3A452E]"> "عرض بكامل الشاشة 🌐" </strong> 
                  في الأعلى ليفتح الملف فوراً في نافذة تابعة لقوقل درايف، ثم عد مجدداً لهنا لتجتاز الاختبار وتفوز بالنجوم!
                </p>
              </div>
            </div>

            {/* Right Column / Moral Lessons checklist & Comprehension Game */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Moral points */}
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-5 rounded-3xl">
                <h3 className="font-black text-sm text-[#3A452E] mb-3 pr-2.5 border-r-4 border-[#5A6B47] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#5A6B47]" />
                  <span>الدروس والعبر التربوية 💡</span>
                </h3>
                <p className="text-[10px] text-[#8E8268] mb-4">تدبر هذه الأخلاق لتنال النجاة والسعادة وتكسب محبة القريب والغريب:</p>
                
                <div className="space-y-3">
                  {activeReaderStory.moralLessons.map((lesson, idx) => (
                    <div key={idx} className="p-3 bg-[#F1EBDC]/40 border border-[#DCD3C1]/50 rounded-2xl text-xs flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#5A6B47] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="font-medium text-[#4A453E] leading-relaxed">
                        {lesson}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Interactive quiz for +5 Stars */}
              <div className="bg-[#FAF9F6] border border-[#D48166] p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-16 bg-[#D48166]/10 rounded-full blur-xl pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-extrabold text-xs sm:text-sm text-[#3A452E] flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#D48166]" />
                    <span>تحدي المعلم الصغير الذكي 🧠</span>
                  </h3>
                  
                  {quizClaimedStories.includes(activeReaderStory.id) && (
                    <span className="text-[9px] font-black text-[#5A6B47] bg-[#5A6B47]/10 py-0.5 px-2 rounded-full border border-[#5A6B47]/20">
                      مكتمل +٥ نجوم ⭐
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#8E8268] mb-4">
                  أثبت استيعابك لأخلاق هذه القصة لتفوز بـ ٥ نجوم مباركة تنظم لعداد رصيدك!
                </p>

                {/* Question box */}
                <div className="bg-white/80 border border-[#DCD3C1] p-3.5 rounded-2xl text-xs font-bold leading-relaxed mb-4 text-[#3A452E]">
                  {activeReaderStory.quiz.question}
                </div>

                {/* Option radios */}
                <div className="space-y-2">
                  {activeReaderStory.quiz.options.map((option, oIdx) => {
                    const isSelected = selectedQuizOption === oIdx;
                    let optionStyle = "border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#4A453E] bg-white";
                    
                    if (isSelected) {
                      optionStyle = "border-[#D48166] bg-[#D48166]/5 text-[#A05C46] font-black";
                    }

                    if (isQuizSubmitted) {
                      const isCorrectAnswer = oIdx === activeReaderStory.quiz.correctIndex;
                      if (isCorrectAnswer) {
                        optionStyle = "border-[#5A6B47] bg-[#5A6B47]/10 text-[#3A452E] font-black";
                      } else if (isSelected) {
                        optionStyle = "border-red-300 bg-red-50 text-red-700";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isQuizSubmitted}
                        onClick={() => setSelectedQuizOption(oIdx)}
                        className={`w-full p-3 rounded-xl border text-right text-xs transition flex gap-2 items-center ${optionStyle} ${
                          !isQuizSubmitted ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#D48166] text-[#D48166]' : 'border-[#DCD3C1]'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-[#D48166] rounded-full"></div>}
                        </div>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Status overlay */}
                <div className="mt-4">
                  {!isQuizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={selectedQuizOption === null}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-white transition ${
                        selectedQuizOption !== null
                          ? 'bg-[#D48166] hover:bg-[#C26F54] shadow-sm cursor-pointer'
                          : 'bg-[#DCD3C1] cursor-not-allowed'
                      }`}
                    >
                      تحقق من صحة الجواب وبث نجومي ⭐
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl border text-xs text-right space-y-1.5 ${
                        isQuizCorrect
                          ? 'bg-[#5A6B47]/5 border-[#5A6B47] text-[#3A452E]'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="font-extrabold flex items-center gap-1 text-[11px] sm:text-xs">
                        <span>{isQuizCorrect ? "🎉 إجابة موفقة وعظيمة!" : "⚠️ إجابة بحاجة لمراجعة."}</span>
                        {isQuizCorrect && !quizClaimedStories.includes(activeReaderStory.id) && (
                          <span className="text-yellow-600 font-bold">حصدت +٥ نجوم!</span>
                        )}
                      </div>
                      <p className="leading-relaxed text-[10px] sm:text-xs text-[#8E8268]">
                        <strong>التوضيح:</strong> {activeReaderStory.quiz.explanation}
                      </p>
                      
                      {!isQuizCorrect && (
                        <button
                          onClick={() => {
                            setSelectedQuizOption(null);
                            setIsQuizSubmitted(false);
                            SoundEngine.playSparkle();
                          }}
                          className="text-[10px] font-black text-red-700 hover:underline mt-1.5"
                        >
                          حاول مجدداً 🔁
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
