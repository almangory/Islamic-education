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
  type: 'quran' | 'hadith' | 'creed' | 'fiqh' | 'seerah';
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
    title: "الكتاب التفاعلي الأول: سورة القمر (الوحدة الأولى) 📖",
    url: "https://drive.google.com/file/d/1elrqkZ5xThOIm7t-OZY_6DVetP-31Y1h/view?usp=sharing",
    type: "quran",
    typeNameAr: "القرآن والتجويد",
    shortDesc: "تصفّح سورة القمر المباركة من الوحدة الأولى بالمنهج الرسمي، وتعرّف على تفسير الآيات وحقيقة البعث والاعتبار بمصائر الأقوام السابقة.",
    moralLessons: [
      "البعث والنشور حقيقة يقينية، وعاقبة التكذيب بآيات الله ونذره وخيمة ومذكورة عبر التاريخ للعظة والاعتبار.",
      "تيسير القرآن الكريم للحفظ والذكر والتدبر والعمل به لكل مسلم يطلب الهداية (ولقد يسرنا القرآن للذكر فهل من مدكر).",
      "الاعتبار التام بقصص الأنبياء السابقين كقوم نوح، عاد، ثمود، وقوم لوط، لبيان أن نصر الله حليف الفئة المؤمنة دائماً."
    ],
    quiz: {
      question: "ما هي الآية الكريمة التي تكررت في سورة القمر وتحث وجدان وعقل المسلم على التفكير والذكر والتلاوة؟",
      options: [
        "﴿وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ﴾",
        "﴿اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ﴾",
        "﴿إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ﴾"
      ],
      correctIndex: 0,
      explanation: "تكررت هذه الآية الكريمة أربع مرات في سورة القمر تأكيداً على تيسير الله تعالى للقرآن ليكون سهلاً للحفظ والذكر والعمل الصالح."
    }
  },
  {
    id: "comic-2",
    title: "الكتاب التفاعلي الثاني: سورة الرحمن (الوحدة الأولى) ✨",
    url: "https://drive.google.com/file/d/1OVYXGFDgpY_gPadyPa6bpSKjAkwvQSlH/view?usp=sharing",
    type: "quran",
    typeNameAr: "القرآن والتجويد",
    shortDesc: "تصفّح سورة الرحمن من الوحدة الأولى بالمنهج الرسمي، واستشعر عظيم نعم الخالق سبحانه وتعالى في الكون والأرض وإرسال الرسل بالهدى.",
    moralLessons: [
      "الخالق عز وجل هو الرحمن الذي علم القرآن وخلق الإنسان ووهب له النعم الظاهرة والباطنة الشاهدة على كمال قدرته.",
      "إقامة القسط والعدل والالتزام بالموازين المستقيمة في تصرفاتنا اليومية وفي المعاملات واجب شرعي في حراسة صلاح مجتمعاتنا.",
      "كل من على وجه الأرض من المخلوقات فانٍ ولا يبقى إلا وجه ربك ذو الجلال والإكرام؛ مما يدفعنا للاستعداد الدائم للآخرة."
    ],
    quiz: {
      question: "ما هي القيمة والواجب الأول لكل مسلم عند تدبر واستعراض نعم الله الغزيرة الواردة في الآيات الكريمات بسورة الرحمن؟",
      options: [
        "شكر المنعم سبحانه باللسان وعمل الصالحات وإقامة العدل وحفظ الأمانات",
        "تجاهل النعم والتركيز على المظاهر الدنيوية الزائلة فقط",
        "التفاخر والتباهي بالنعم الخاصة أمام المحتاجين والضعفاء"
      ],
      correctIndex: 0,
      explanation: "شكر الله تعالى بالانقياد لطاعته واستثمار جميع نعمه في أوجه الخير والعدل هو غاية خلق العباد وسبيل دوام هذه النعم."
    }
  },
  {
    id: "comic-3",
    title: "الكتاب التفاعلي الثالث: سورة النجم (الوحدة الأولى) 🌌",
    url: "https://drive.google.com/file/d/1Jj9_kgBEegSObI6y84Wc4nswCmrwzTQH/view?usp=sharing",
    type: "quran",
    typeNameAr: "القرآن والتجويد",
    shortDesc: "تصفّح سورة النجم المباركة من الوحدة الأولى بالمنهج الرسمي، وتعرّف على صدق نبي الرحمة وتأكيد الوحي والوصول لسدرة المنتهى.",
    moralLessons: [
      "القرآن الكريم وحي سماوي معصوم موحى به من الله تعالى إلى رسوله محمد ﷺ بواسطة ملك الوحي القوي جبريل عليه السلام.",
      "عظمة وصدق رؤية النبي ﷺ في رحلة المعراج وسدرة المنتهى ليكون شاهداً ومبشراً للأمة بملكوت السماوات العلا.",
      "الجزاء العادل يثبت أن ليس للإنسان إلا ما سعى وعمل؛ فسعى المسلم وجهده لا يضيع وسيجزى عليه الجزاء الأوفى بالجنة."
    ],
    quiz: {
      question: "ما هي المنتهى والمقام الأرفع في السموات العلا الذي بلغه النبي ﷺ في رحلته كما بينت سورة النجم؟",
      options: [
        "سدرة المنتهى التي عندها جنة المأوى",
        "حصون البادية وصخور الجزيرة العربية",
        "مشارف جبال الشام وحلب"
      ],
      correctIndex: 0,
      explanation: "تبين سورة النجم أن النبي ﷺ رأى جبريل عليه السلام على صورته الملائكية عند سدرة المنتهى في أقصى مراتب السماوات."
    }
  },
  {
    id: "comic-4",
    title: "الكتاب التفاعلي الرابع: الوحدة الثالثة (الحديث الشريف وبناء الضمير) 🤝",
    url: "https://drive.google.com/file/d/1BMIctKQ4QVh8gp1SQ8bcbrucmLxHsMws/view?usp=sharing",
    type: "hadith",
    typeNameAr: "الحديث الشريف",
    shortDesc: "محتوى الوحدة الثالثة من المنهج الرسمي: هدم النعرات والعنصرية والأحساب، والوصايا النبوية السبع لأبي ذر الغفاري لبناء مجتمع متعاضد.",
    moralLessons: [
      "الإسراف في التعصب للقبيلة واللون يتنافى مع مبادئ الإسلام العظيمة؛ فالتقوى هي أساس التكريم.",
      "الوصايا السبع لأبي ذر الغفاري تضع دستوراً للحق ومخالطة المساكين وتقوية الروابط الاجتماعية.",
      "المسلم لا يكون إمعة يجاري الآخرين على الأخطاء، بل يتحرى الحق ويقف مع الفضيلة والعدل بكل شجاعة."
    ],
    quiz: {
      question: "ما هو التوجيه النبوي السامي ونداء الصلاح لحديث المصطفى ﷺ لمعالجة عقل المسلم: 'لا تكونوا إمَّعة'؟",
      options: [
        "توطين النفس على تحري الصواب والعدل والوقوف مع الحق حتى وإن خالفك عموم الناس، وتجنب مساندة الباطل لمجرد المجاراة",
        "الانسياق الأعمى مع عادات الزملاء الخاطئة خشية التجنب أو الغربة المدرسية",
        "السكوت والابتعاد التام عن تبادل النصائح والأمر بالمعروف في الفصل"
      ],
      correctIndex: 0,
      explanation: "الإمعة هو من لا يثبت على موقف بل يقلد الناس في الخير والشر، والرسول ﷺ يدعونا لتوطين قلوبنا دائماً على الصواب والعدل بمفردنا وبثقة."
    }
  },
  {
    id: "comic-5",
    title: "الكتاب التفاعلي الخامس: قصة انشقاق القمر (الوحدة الثانية) 🌓",
    url: "https://drive.google.com/file/d/1wv4Aam5XkPkwkLknmoBoVprkQ9wVtIZo/view?usp=sharing",
    type: "quran",
    typeNameAr: "علوم القرآن",
    shortDesc: "تصفّح معجزة انشقاق القمر العظيمة الواردة في الوحدة الثانية؛ البرهان الفلكي المادي الساطع والتأييد الإلهي لصدق دعوة وحق الرسالة المحمدية.",
    moralLessons: [
      "معجزة انشقاق القمر آية مادية ظاهرة وحجة مرئية قطعت شكوك أعراب البادية لتأكيد نبوة خاتم النبيين ﷺ.",
      "الكبر والحسد يمنع العقل عن إدراك الحق، مثل إعراض أبي جهل وكفار قريش ووصفهم تلك المعجزة المرئية بأنها 'سحر مستمر'.",
      "المؤمن الواعي الفطن يزداد رسوخاً وإيماناً بآيات ربه العلوية ويستذكر منجزات نبيه المصطفى بعزة وفرح وإجلال."
    ],
    quiz: {
      question: "كيف رد كفار مكة المكرمة وعلى رأسهم أبو جهل بعد أن عاينوا ورأوا بأعينهم انفلاق القمر نصفين برهاناً للنبوة؟",
      options: [
        "أعرضوا وكذبوا بوقاحة وعناد وقالوا: ﴿سِحْرٌ مُّسْتَمِرٌّ﴾ محاولين صد الناس عن الحق",
        "دخلوا في دين الله مباشرة وآمنوا طوعاً ورغبة دون إكراه",
        "طالبوا بأن تشق لهم جدران الجبال المحيطة بمكة عوضاً عنها"
      ],
      correctIndex: 0,
      explanation: "برغم جلاء الآية الكونية العظيمة وسؤالهم للمسافرين القادمين من أطراف البادية وتأكيدهم للخبر، قادهم العناد لوصفها بالسحر المستمر."
    }
  },
  {
    id: "comic-6",
    title: "الكتاب التفاعلي السادس: قصة قوم لوط والعبرة التاريخية (الوحدة الثانية) 🌋",
    url: "https://drive.google.com/file/d/1hRZhpXbMEfxsKMDljOh3nyVEBlOl6AhS/view?usp=sharing",
    type: "quran",
    typeNameAr: "علوم القرآن",
    shortDesc: "دروس وعبر قصة سيدنا لوط عليه السلام وعاقبة قومه الواردة بالوحدة الثانية لترسيخ عفة وسلامة وتطهير النفوس ومحيط الحياة.",
    moralLessons: [
      "العفة والتطهر والتقوى والاستقامة الأخلاقية هي حصون الصيانة والوقاية الأساسية لسلامة وأمن وصعود الأمة.",
      "الاستسلام للأهواء الشاذة ومخالفة هدي الفطرة النقية التي فطر الله الناس عليها ذنب جسيم يورث الخسران وعقوبات التدمير العاجل.",
      "الثبات والتمسك بالطهارة ومجابهة الفساد هو هدي لوط والفئة الصالحة الصغيرة التي نجاها الله تعالى برحمته وعدله المطبق."
    ],
    quiz: {
      question: "ما هي القيمة التربوية الأسمى والعبرة الجوهرية التي نحتفظ بها من دروس قصة نبي الله لوط عليه السلام لحماية بيئاتنا؟",
      options: [
        "الحفاظ على التطهر الأخلاقي، نبذ السلوكات الشاذة المنافية للفطرة السليمة، والوقوف مع الخير والفضيلة بعزة ووعي",
        "تجاهل النصيحة وترك المعاصي تفشو دون وازع من إيمان أو رغبة إيجابية",
        "السعي خلف المكاسب المادية السريعة ولو بالتخلي عن القيم والمبادئ الأساسية"
      ],
      correctIndex: 0,
      explanation: "الإسلام يعتني بنقاء الفرد وصيانة المجتمع، وتحثنا هذه الدروس على غرس معاني العفة والتربية القويمة ورفض دعاوى الفساد الفطرية."
    }
  },
  {
    id: "comic-7",
    title: "الكتاب التفاعلي السابع: العبادات ونداء الجمعة وعيد المؤمنين (الوحدة الخامسة) 🕌",
    url: "https://drive.google.com/file/d/1mtx-jJtzHW-CeNl-FnBEBPcQJQbCRsAR/view?usp=sharing",
    type: "fiqh",
    typeNameAr: "الفقه والعبادات",
    shortDesc: "تصفّح أحكام وفقه العبادات من صلاة الجمعة وشروط آدابها، صلاة العيدين وتكبيراتهما ومظاهر الفرح والتواصل الاجتماعي بالمنهج الرسمي.",
    moralLessons: [
      "يوم الجمعة عيد الأسبوع للمسلمين، ويتوجب تعظيمه بالاغتسال والتطيب ولبس أحسن الثياب والتبكير التام للمسجد.",
      "صلاة العيدين سنة مؤكدة يحمد فيها المؤمن ربه على توفيق العبادة، وتكبيراتها سبع بالركعة الأولى وخمس بالثانية بعد القيام.",
      "إفشاء المحبة والصفح ونشر الابتهاج وزيارة الأقارب ومعاونة المعوزين والفقراء في الأعياد تزيد روابط التكافل الاجتماعي قوة."
    ],
    quiz: {
      question: "ما هو الأدب الواجب والشرعي الصارم على المصلين عند ارتقاء الإمام للمنبر لإلقاء خطبة الجمعة؟",
      options: [
        "الإنصات التام والسكوت المطبق وتجنب أي لغو أو عبث باليدين والجسد، وترك الهمس ولو لطلب السكوت من زميله",
        "إلقاء التحية ومناقشة دروس الدراسة بصوت منخفض لا يضر الآخرين",
        "الاستماع المشوش وتصفح الجوال لقراءة المسائل الفقهية وقت الخطبة"
      ],
      correctIndex: 0,
      explanation: "النظام والسكينة من تمام العبادة، وينهى الشارع عن أي حديث أو لغو أثناء خطبة الجمعة، فمن قال لصاحبه 'أنصت' فقد لغا وضيع أجره."
    }
  },
  {
    id: "comic-8",
    title: "الكتاب التفاعلي الثامن: رواد الهداية وعطر السير العبقة (الوحدة السادسة) 👥",
    url: "https://drive.google.com/file/d/1QjTDrpEZhICLiy52uG9umitd7zqVivlO/view?usp=sharing",
    type: "seerah",
    typeNameAr: "السيرة والصحابة",
    shortDesc: "تصفّح روائع السيرة العطرة وصحابة النور من الوحدة السادسة بالمنهج: رحلة المعراج، بذور بيعتي العقبة المضيئة، وفداء الصديق وغرس الوفاء بجوار النبوة.",
    moralLessons: [
      "الإسراء والمعراج رحلة إعجازية وتسلية ربانية لقلب المصطفى ﷺ أكدت عظم منزلة المسجد الأقصى والقدس الرفيعة وفيها فرضت الصلوات.",
      "تأسست معالم المؤاخاة وبناء ركائز حماية الدعوة عبر بيعتي العقبة الشجاعتين بمنى إعلاناً لوحدة الصف والضمير وبناء الدولة.",
      "سير الصحابة شموس هداية للبشرية: أبو بكر الصديق صاحب الهجرة، زيد بن حارثة حِبُّ رسول الله، وأبو ذر الغفاري أصدق الناس لهجة."
    ],
    quiz: {
      question: "بماذا لقَّب صحابة النور رضوان الله عليهم بطل الوفاء والشهادة زيد بن حارثة لوفائه الاستثنائي وحبه للنبي ﷺ؟",
      options: [
        "حِبُّ رسول الله ﷺ (الحِب بن الحِب) لوفائه واختياره البقاء بجوار النبي طوعاً على العودة لأهله وحريته",
        "الفاروق العادل لشدته بالحق وهيبته",
        "ذو النورين لزهده السلوكي الفريد"
      ],
      correctIndex: 0,
      explanation: "آثر زيد بن حارثة رضي الله عنه العيش مع النبي ﷺ ممتناً بمحبته الوفية ومفضلاً جواره المكرم على الذهاب مع والده وعمه حر طليق."
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
                    <span>📚 المكتبة التفاعلية لكتب المنهج والقصص المصورة</span>
                    <span className="text-xs bg-white/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold animate-pulse">منهج السودان 🇸🇩</span>
                  </h1>
                  <p className="text-[#F1EBDC] text-xs leading-relaxed max-w-xl font-medium">
                    تصفّح واقرأ كتب وحدات التربية الإسلامية للصف السادس الابتدائي كمؤلفات تفاعلية مصوّرة عبر أدوات Google Drive المباشرة! تعلّم أصول الدين والعقيدة والفقه والحديث والقرآن الشريف بمتعة، ثم أجب عن الأسئلة البسيطة لتحرز +١٠ نجوم كاملة لكل كتاب!
                  </p>
                </div>
                <div className="bg-white/10 shrink-0 text-white font-bold px-4 py-2.5 rounded-2xl border border-white/20 text-xs flex items-center gap-1.5 shadow-inner">
                  <Trophy className="w-4.5 h-4.5 text-yellow-300" />
                  <span>مكافآت قراءات المنهج: +٨٠ نجمة ⭐</span>
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
                    placeholder="ابحث بالاسم أو موضوع الدرس عن الكتاب والمحور..."
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
                    تفحص كل الكتب 🌈
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('quran'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'quran'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#5A6B47]'
                    }`}
                  >
                    <BookOpenCheck className="w-3.5 h-3.5" />
                    <span>القرآن والتجويد</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('hadith'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'hadith'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#8E8268]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>الحديث الشريف</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('creed'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'creed'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#8E8268]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>العقيدة الإسلامية</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('fiqh'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'fiqh'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#5A6B47]'
                    }`}
                  >
                    <span>🕌 الفقه والعبادات</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('seerah'); SoundEngine.playSparkle(); }}
                    className={`text-[10px] font-black py-2 px-3.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === 'seerah'
                        ? 'bg-[#5A6B47] text-white border-[#5A6B47]'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#5A6B47]'
                    }`}
                  >
                    <span>👥 السيرة والصحابة</span>
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
