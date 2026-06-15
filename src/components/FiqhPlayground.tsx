import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  HelpCircle, 
  HeartHandshake, 
  Check, 
  Flame, 
  Sparkles, 
  Coins, 
  Info, 
  X,
  Volume2,
  Bookmark
} from 'lucide-react';
import SoundEngine from '../lib/audio';

// Scrambled prayer steps logic
interface PrayerStep {
  id: number;
  label: string;
  isRequired: 'faridha' | 'sunnah';
  desc: string;
}

const correctPrayerSteps: PrayerStep[] = [
  { id: 1, label: "النية الطاهرة", isRequired: "faridha", desc: "القصد بالقلب ابتغاء وجه الله تعالى مقرونة ببدء العمل." },
  { id: 2, label: "تكبيرة الإحرام", isRequired: "faridha", desc: "قول «الله أكبر» بلسان مبين معلناً الدخول في الصلاة." },
  { id: 3, label: "القيام للفريضة", isRequired: "faridha", desc: "الوقوف باستقامة تامة مع القدرة تعظيماً لجاه الله." },
  { id: 4, label: "قراءة الفاتحة", isRequired: "faridha", desc: "ركن أساسي في كل ركعة، فصلاة لمن لو يلم يقرأ بفاتحة الكتاب." },
  { id: 5, label: "الركوع والاعتدال", isRequired: "faridha", desc: "الانحناء السليم وقول «سبحان ربي العظيم»، والوقوف المستقيم بعدها." },
  { id: 6, label: "السجود على 7 أعضاء", isRequired: "faridha", desc: "الجبهة والأنف والكفين والركبتين وأطراف القدمين خضوعاً كاملاً." },
  { id: 7, label: "الجلوس والطمأنينة", isRequired: "faridha", desc: "الطمأنينة بالسكون لثنائية ركوعك ونزولك، والجلوس بين السجدتين." },
  { id: 8, label: "التشهد والجلوس له", isRequired: "faridha", desc: "قراءة التحيات المباركة بعد نهاية آخر ركعة صلاة." },
  { id: 9, label: "التسليم والختام", isRequired: "faridha", desc: "قول «السلام عليكم ورحمة الله» جهة اليمين ثم اليسار." }
];

// Radar items
interface DisruptorItem {
  id: number;
  label: string;
  type: 'invalidates' | 'disliked';
  explanation: string;
}

const radarItems: DisruptorItem[] = [
  { id: 1, label: "الضحك بصوت عالٍ والقهقهة", type: "invalidates", explanation: "الأصوات المسموعة المضحكة تبطل خشوع الصلاة كلياً وتوجب الإعادة." },
  { id: 2, label: "الالتفات يميناً ويساراً بدون حاجة", type: "disliked", explanation: "يكره الالتفات بالوجه في الصلاة، وينقص ثوابها لكن لا يبطلها." },
  { id: 3, label: "الكلام خارج الصلاة عمداً", type: "invalidates", explanation: "الحديث العاطل بكلام الناس يبطل الصلاة فوراً." },
  { id: 4, label: "الأكل والشرب أثناء الركعات", type: "invalidates", explanation: "أكل الطعام أو مضغه عمداً حتى لو كان صغيراً يبطل الصلاة." },
  { id: 5, label: "تشبيك الأصابع وفرقعتها", type: "disliked", explanation: "يشغل المصلي عن الخشوع وهي من مكروهات الصلاة المنهي عنها." },
  { id: 6, label: "رفع البصر المستمر للسماء", type: "disliked", explanation: "يكره للمصلي رفع بصره لأعلى، والسنة النظر لموضع السجود." },
  { id: 7, label: "انكشاف العورة بغير قصد بغير ستر", type: "invalidates", explanation: "طهارة البدن وستر العورة شروط جوهرية لصحة الصلاة." },
  { id: 8, label: "التبسم البسيط الخفيف بلا صوت", type: "disliked", explanation: "التبسم البسيط الصامت مكروه لغموضه ولا يبطل الصلاة ما لم يصدر صوتاً." }
];

export default function FiqhPlayground({ onEarnStars }: { onEarnStars: (stars: number) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'sequence' | 'radar' | 'eid'>('sequence');

  // Game 1 State: Sequence
  const [scrambled, setScrambled] = useState<PrayerStep[]>(() => {
    return [...correctPrayerSteps].sort(() => Math.random() - 0.5);
  });
  const [arranged, setArranged] = useState<PrayerStep[]>([]);
  const [sequenceStarClaimed, setSequenceStarClaimed] = useState<boolean>(false);

  // Game 2 State: Radar
  const [radarIndex, setRadarIdx] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [radarAnswers, setRadarAnswers] = useState<{ item: DisruptorItem; correct: boolean }[]>([]);
  const [radarComplete, setRadarComplete] = useState<boolean>(false);

  // Game 3 State: Eid & Friday check
  const [checkedIdeas, setCheckedIdeas] = useState<string[]>([]);
  const checkOptions = [
    { id: '1', title: "الاغتسال والتطيب بالسواك والطيب", type: "both", desc: "سنة عظيمة لغسل البدن ونظافة الرائحة المبهجة بالمسجد للجمعة والعيد." },
    { id: '2', title: "التبكير الشديد لحضور الخطبتين والدعاء", type: "friday", desc: "الملائكة تقف عند أبواب المسجد تسجل الأسماء الأبكر لحضور صلاة الجمعة." },
    { id: '3', title: "لبس الجديد والأبهى من الثياب فرحاً", type: "eid", desc: "سنة مؤكدة لإظهار بهجة العيد والاتزان بين أفراد العائلة والأوطان." },
    { id: '4', title: "الذهاب من طريق والرجوع من طريق آخر", type: "eid", desc: "من عادات النبي في العيد ليسلم على أكبر عدد من الجيران وينشر التهاني." },
    { id: '5', title: "التكبير بصوت مسمع وبث التكبيرات بالساحات", type: "eid", desc: "التكبير شعار العيدين الجليل لتعظيم الله وإظهار وحدة المله السمحاء." },
    { id: '6', title: "الانصات التام لخطبة الإمام بغير كلام", type: "friday", desc: "من لغى وتكلم وصاحبه يخطب فقد لغت جمعته ويحرم الحديث أثناء خطبة الجمعة." }
  ];

  // Logic 1: Sequence placement
  const selectScrambledStep = (step: PrayerStep) => {
    const expectedStep = correctPrayerSteps[arranged.length];
    if (step.id === expectedStep.id) {
      // Correct placement
      setArranged(prev => [...prev, step]);
      setScrambled(prev => prev.filter(s => s.id !== step.id));
      SoundEngine.playSuccess();

      // Check if all steps are completed
      if (arranged.length + 1 === correctPrayerSteps.length) {
        SoundEngine.playTrophy();
        if (!sequenceStarClaimed) {
          onEarnStars(5);
          setSequenceStarClaimed(true);
        }
      }
    } else {
      // Wrong placement
      SoundEngine.playFailure();
    }
  };

  const resetSequenceGame = () => {
    setScrambled([...correctPrayerSteps].sort(() => Math.random() - 0.5));
    setArranged([]);
    SoundEngine.playSparkle();
  };

  // Logic 2: Radar sorting
  const handleRadarChoice = (choice: 'invalidates' | 'disliked') => {
    const item = radarItems[radarIndex];
    const isCorrect = item.type === choice;

    let computedPoints = points;
    if (isCorrect) {
      computedPoints = points + 10;
      setPoints(computedPoints);
      SoundEngine.playSuccess();
    } else {
      SoundEngine.playFailure();
    }

    setRadarAnswers(prev => [...prev, { item, correct: isCorrect }]);

    if (radarIndex < radarItems.length - 1) {
      setRadarIdx(prev => prev + 1);
    } else {
      setRadarComplete(true);
      SoundEngine.playTrophy();
      const obtainedStars = computedPoints >= 60 ? 5 : 2;
      onEarnStars(obtainedStars);
    }
  };

  const resetRadarGame = () => {
    setRadarIdx(0);
    setPoints(0);
    setRadarAnswers([]);
    setRadarComplete(false);
    SoundEngine.playSparkle();
  };

  // Logic 3: Checklist sunnah habits
  const toggleIdea = (id: string) => {
    SoundEngine.playSparkle();
    if (checkedIdeas.includes(id)) {
      setCheckedIdeas(prev => prev.filter(item => item !== id));
    } else {
      setCheckedIdeas(prev => [...prev, id]);
      if (checkedIdeas.length + 1 === checkOptions.length) {
        onEarnStars(3);
        SoundEngine.playTrophy();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2 pr-1 pl-1 text-right relative z-10" dir="rtl" id="fiqh-playground-main">
      {/* Title & Introduction and Stars trigger button */}
      <div className="bg-gradient-to-r from-[#5A6B47] to-[#3A452E] p-6 rounded-[2rem] text-[#FAF9F6] mb-6 shadow-md">
        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight mb-2">⭐ مَلعب الفقه والعبادات التفاعلي ⭐</h1>
            <p className="text-[#E9E1CD] text-xs leading-relaxed max-w-xl font-medium">
              مرحباً بك في ساحة التدريب المرئي! طبق أحكام الصلاة، وافرز مبطلات ومكروهات الصلاة الصحيحة، وتعلم سنن صلوات الجمعة والعيدين المبارك لتحصد النجوم الذهبية وتتوج بطلاً للفقه الإسلامي.
            </p>
          </div>
          <div className="bg-white/10 shrink-0 text-[#FAF9F6] font-bold px-4 py-2 rounded-2xl border border-white/20 text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>نجوم بانتظارك! +١٣ نجمة ⭐</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Picker */}
      <div className="grid grid-cols-3 gap-2 mb-6 bg-[#FAF9F6] border border-[#DCD3C1] p-1.5 rounded-2xl">
        <button
          onClick={() => { setActiveSubTab('sequence'); SoundEngine.playSparkle(); }}
          className={`py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer outline-none ${
            activeSubTab === 'sequence'
              ? 'bg-[#E9E1CD] text-[#3A452E] shadow-sm border border-[#DCD3C1]'
              : 'text-[#8E8268] hover:text-[#3A452E]'
          }`}
          id="btn-subtab-sequence"
        >
          <Bookmark className="w-4 h-4 shrink-0 text-[#5A6B47]" />
          <span>تنظيم الصلاة 🕌</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('radar'); SoundEngine.playSparkle(); }}
          className={`py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer outline-none ${
            activeSubTab === 'radar'
              ? 'bg-[#E9E1CD] text-[#3A452E] shadow-sm border border-[#DCD3C1]'
              : 'text-[#8E8268] hover:text-[#3A452E]'
          }`}
          id="btn-subtab-radar"
        >
          <Flame className="w-4 h-4 shrink-0 text-[#D48166]" />
          <span>كاشف المبطلات ⚠️</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('eid'); SoundEngine.playSparkle(); }}
          className={`py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer outline-none ${
            activeSubTab === 'eid'
              ? 'bg-[#E9E1CD] text-[#3A452E] shadow-sm border border-[#DCD3C1]'
              : 'text-[#8E8268] hover:text-[#3A452E]'
          }`}
          id="btn-subtab-eid"
        >
          <HeartHandshake className="w-4 h-4 shrink-0 text-[#8E8268]" />
          <span>حقيبة الجمعة والعيد 🎉</span>
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        
        {/* GAME 1: Organized sequence */}
        {activeSubTab === 'sequence' && (
          <motion.div
            key="sequence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
          >
            {/* Left Side: Goal / arranged steps */}
            <div className="md:col-span-7 bg-[#FAF9F6] border border-[#DCD3C1] p-5 rounded-3xl shadow-sm min-h-[380px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-[#3A452E] flex items-center gap-1">
                  <span>الصلاة المرتبة الصحيحة</span>
                  <span className="text-xs bg-[#E9E1CD] border border-[#DCD3C1]/50 text-[#5A6B47] py-0.5 px-2 rounded-full font-black">
                    {arranged.length} من {correctPrayerSteps.length}
                  </span>
                </h3>
                {arranged.length === correctPrayerSteps.length && (
                  <span className="text-xs font-black text-[#D48166] bg-[#D48166]/10 border border-[#D48166]/20 py-1 px-3 rounded-full animate-bounce">
                    نجاح باهر! +٥ نجوم ⭐
                  </span>
                )}
              </div>

              {arranged.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px] border-2 border-dashed border-[#DCD3C1] rounded-2xl p-4 text-center">
                  <span className="text-3xl mb-2">🕌</span>
                  <p className="text-xs text-[#8E8268] max-w-xs leading-relaxed font-semibold">
                    امضِ في النقر على بطاقات الصلاة بالترتيب الشرعي الصحيح من اليسار لتجمع الخطوات المباركة من النية وحتى السلام!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1" id="arranged-cards-list">
                  {arranged.map((step, idx) => (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={step.id}
                      className="p-3 bg-white border border-[#5A6B47]/30 rounded-xl flex items-center justify-between gap-3 text-right hover:border-[#5A6B47]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#5A6B47] text-white font-serif text-xs rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[#3A452E]">
                          {step.label}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#8E8268] leading-normal max-w-sm hidden sm:block font-medium">
                        {step.desc}
                      </p>
                      <span className="text-[9px] bg-[#FAF9F6] border border-[#DCD3C1] text-[#4A453E] font-bold px-1.5 py-0.5 rounded">
                        فرض
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Options collection */}
            <div className="md:col-span-5 bg-[#F1EBDC] border border-[#DCD3C1] p-5 rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-xs text-[#8E8268] text-right">انقر على الركن القادم:</span>
                <button
                  onClick={resetSequenceGame}
                  className="text-[10px] font-black text-[#D48166] hover:underline cursor-pointer"
                >
                  إعادة ترتيب البطاقات 🔄
                </button>
              </div>

              {scrambled.length > 0 ? (
                <div className="grid grid-cols-2 gap-3" id="scrambled-option-grid">
                  {scrambled.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => selectScrambledStep(step)}
                      className="p-3 bg-[#FAF9F6] hover:bg-[#E9E1CD] border border-[#DCD3C1] hover:border-[#5A6B47] rounded-2xl text-xs font-bold text-[#4A453E] transition duration-200 text-center shadow-sm cursor-pointer outline-none"
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#5A6B47] text-white rounded-2xl text-center py-8">
                  <span className="text-3xl block mb-2">🎉</span>
                  <h4 className="font-black text-sm mb-1">أتممت الترتيب بنجاح!</h4>
                  <p className="text-[10px] text-[#E9E1CD] leading-relaxed max-w-[200px] mx-auto font-medium">
                    بدمج هذه الفرائض قمت بنسج الصلاة طاهرة مقبولة كما علمنا نبي البها برحمته.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* GAME 2: Radar sorting */}
        {activeSubTab === 'radar' && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            {!radarComplete ? (
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-sm text-center">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs bg-[#E9E1CD] text-[#3A452E] px-3 py-1.5 rounded-full font-black border border-[#DCD3C1]/50">
                    حالة الكاشف {radarIndex + 1} من {radarItems.length}
                  </span>
                  <span className="text-xs text-[#D48166] font-bold bg-[#FAF9F6] border border-[#DCD3C1] px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    النقاط: {points}
                  </span>
                </div>

                {/* Focus text item */}
                <h3 className="text-base sm:text-lg font-bold text-[#3A452E] mb-2 leading-relaxed">
                  « {radarItems[radarIndex].label} »
                </h3>
                <p className="text-xs text-[#8E8268] max-w-sm mx-auto mb-8 font-medium">
                  هل هذا الفعل الطاريء يبطل الصلاة ويوجب إعادتها فوراً، أم يكره فعله فقط وينقص الأجر دون نقض؟
                </p>

                {/* Big Binary Sorting triggers */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => handleRadarChoice('invalidates')}
                    className="p-5 bg-white hover:bg-[#D48166]/10 border-2 border-dashed border-[#D48166]/40 hover:border-[#D48166] text-[#D48166] font-black rounded-2xl text-xs sm:text-sm transition text-center cursor-pointer outline-none"
                  >
                    <span className="block text-2xl mb-1">❌</span>
                    <span>مبطلات الصلاة</span>
                    <span className="block text-[9px] font-medium text-[#8E8268] mt-1">تلغي الصلاة وتوجب الإعادة</span>
                  </button>

                  <button
                    onClick={() => handleRadarChoice('disliked')}
                    className="p-5 bg-white hover:bg-[#8E8268]/10 border-2 border-dashed border-[#DCD3C1] hover:border-[#8E8268] text-[#8E8268] font-black rounded-2xl text-xs sm:text-sm transition text-center cursor-pointer outline-none"
                  >
                    <span className="block text-2xl mb-1">⚠️</span>
                    <span>مكروهات الصلاة</span>
                    <span className="block text-[9px] font-medium text-[#8E8268] mt-1">تقلل أجرها وتوجب الاجتناب</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Completion screen */
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-8 rounded-3xl shadow-sm text-center">
                <span className="text-4xl block mb-2">📡</span>
                <h3 className="font-sans text-xl font-bold mb-2 text-[#3A452E]">أكملت فحص الرادار بنجاح!</h3>
                <p className="text-xs text-[#8E8268] mb-6 font-medium">
                  لقد فرزت كل الممارسات الخبيثة داخل الصلاة.
                </p>

                <div className="inline-flex flex-col items-center bg-[#E9E1CD] border border-[#DCD3C1] p-4 rounded-3xl mb-6 min-w-[150px]">
                  <span className="text-3xl font-black font-sans text-[#3A452E] mb-1">{points} / {radarItems.length * 10}</span>
                  <span className="text-xs text-[#5A6B47] font-bold">حصدت {points >= 60 ? "٥ نجوم" : "نجمتين"} لدرب معرفتك ⭐</span>
                </div>

                <div className="space-y-2 mt-4 max-h-[160px] overflow-y-auto border-t border-[#DCD3C1] pt-4" id="radar-answers-log">
                  {radarAnswers.map((ans, i) => (
                    <div key={i} className="flex justify-between items-center text-xs text-right py-1 pr-1 border-b border-[#DCD3C1]/20">
                      <span className="font-sans font-medium text-[#4A453E]">{ans.item.label}</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${ans.correct ? 'bg-[#5A6B47]/10 text-[#5A6B47]' : 'bg-[#D48166]/10 text-[#D48166]'}`}>
                        {ans.correct ? 'صواب' : 'خطأ'}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetRadarGame}
                  className="bg-[#5A6B47] hover:bg-[#465337] text-white font-black py-2.5 px-6 rounded-xl mt-6 text-xs transition cursor-pointer"
                >
                  إعادة تدريب الرادار
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* GAME 3: Eid & Friday Packing */}
        {activeSubTab === 'eid' && (
          <motion.div
            key="eid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-sm text-[#3A452E]">حقيبة آداب صلاة الجمعة وسنن العيدين</h3>
                <p className="text-[#8E8268] text-[10px] leading-relaxed mt-1 font-medium">
                  حدد جميع العادات والآداب الصحيحة التي تنير سلوك المتقي واجمع +٣ نجوم إضافية ⭐
                </p>
              </div>
              <span className="text-xs bg-[#E9E1CD] text-[#3A452E] font-bold px-3 py-1.5 rounded-full font-mono border border-[#DCD3C1]">
                {checkedIdeas.length} من {checkOptions.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="eid-friday-checklist">
              {checkOptions.map((item) => {
                const isSelected = checkedIdeas.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleIdea(item.id)}
                    className={`p-4 rounded-2xl border-2 text-right transition cursor-pointer flex gap-3 items-start outline-none ${
                      isSelected
                        ? 'border-[#5A6B47] bg-[#5A6B47]/5'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/40 bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#5A6B47] border-[#5A6B47] text-white' : 'border-[#DCD3C1]'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-black text-[#3A452E]">
                          {item.title}
                        </h4>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded leading-none ${
                          item.type === 'eid'
                            ? 'bg-[#FAF9F6] border border-[#DCD3C1] text-[#D48166]'
                            : item.type === 'friday'
                            ? 'bg-[#FAF9F6] border border-[#5A6B47]/20 text-[#5A6B47]'
                            : 'bg-[#E9E1CD] text-[#4A453E] border border-[#DCD3C1]'
                        }`}>
                          {item.type === 'eid' ? 'سنن العيد 🎉' : item.type === 'friday' ? 'آداب الجمعة 🕌' : 'مشتركة 🌟'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8E8268] mt-1.5 lines-2 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {checkedIdeas.length === checkOptions.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-[#FAF9F6] border border-[#5A6B47] rounded-2xl text-center"
              >
                <span className="text-2xl mr-2">💫</span>
                <span className="text-xs font-black text-[#5A6B47]">
                  رائع يا فقيهنا الصغير! لقد جمعت كل الآداب والسنن العيدين والجمعة بنجاح! حصدت +٣ نجوم ⭐
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
