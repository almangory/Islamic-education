import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  HelpCircle,
  Award,
  BookOpen
} from 'lucide-react';
import { QuizQuestion, Lesson } from '../types';
import SoundEngine from '../lib/audio';

// Predefined grand final examination of 10 real questions across the 6th grade curriculum
export const grandFinalExam: QuizQuestion[] = [
  {
    id: 101,
    question: "ما هو التحدي القديم الذي نهى عنه الرسول بشدة قائلاً: (ليس منا من دعا إلى...)؟",
    options: ["العصبية والقبلية والعنصرية", "طلب العلم والسفر", "شراء بئر ماء للفقراء", "التصديق السريع بالصدق"],
    correctAnswer: 0,
    explanation: "العصبية والقبلية الجاهلية تفرق الأوطان والمدرستنا، وجاء الإسلام ليعلن المساواة التامة بين جميع الألوان والأعراق."
  },
  {
    id: 102,
    question: "رأى النبي محمد صلى الله عليه وسلم جبريل عليه السلام بصورته الملائكية العظيمة الحقيقية...",
    options: ["كل يوم في غار حراء", "مرتين فقط في حياته لحكم إلهية", "مرة واحدة يوم الإسراء والمعراج فقط", "عشر مرات بالتفصيل"],
    correctAnswer: 1,
    explanation: "في السيرة النبوية، رأى النبي جبريل عليه السلام في صورته الأصلية مرتين فقط؛ لعظمة خلقه الذي يسد الأفق الشاسع."
  },
  {
    id: 103,
    question: "ما حكم صلاة العيدين وكيف تؤدى بالمسجد؟",
    options: ["سنة مؤكدة، وتؤدى ركعتين بلا أذان ولا إقامة مع تكبيرات زائدة قبل القراءة", "فرض عين بأربع ركعات متبوعة بأذانين جهريين", "صلاة سرية بلا تكبيرات تخص الأغنياء فقط", "فرض كفاية يُصلى صمتاً بالمنازل"],
    correctAnswer: 0,
    explanation: "صلاة العيد سنة مؤكدة ركعتان بغير أذان ولا إقامة، يكبر في الأولى سبعاً وفي الثانية خمساً يتبعها خطبة نافعة."
  },
  {
    id: 104,
    question: "ما معنى 'دُسُر' التي ورد ذكرها في سفينة سيدنا نوح عليه السلام؟",
    options: ["أشرعة السفينة البيضاء الطائرة", "المسامير والروابط القوية التي تجمع الألواح ببعضها لحمايتها من الغرق", "قبطان السفينة والمساندين له", "المجاديف والمقود الخشبي الثقيل"],
    correctAnswer: 1,
    explanation: "الدسر هي المسامير التي تتداخل في الألواح وتجمع هيكل الفلك ببعضه لتتحمل أمواج الطوفان بقوة العزم."
  },
  {
    id: 105,
    question: "خُلق الجان كما بينت سورة الرحمن من مادة متمثلة في...",
    options: ["التراب المبلل بالماء العذب", "مارج من نار (وهو اللهب الصافي الخالص بغير دخان)", "الذهب والنور الشديد الساطع", "الصلصال اليابس المطبوخ كالفخار"],
    correctAnswer: 1,
    explanation: "مارج من نار هو اللهب النقي الخالص الخالي من الدخان، وهي الخامة الأصلية لبداية تكوين الجان."
  },
  {
    id: 106,
    question: "من هو الصحابي الشجاع الملقب بالفدائي الأول في الإسلام؟",
    options: ["أبو بكر الصديق رضي الله عنه", "عمر بن الخطاب الفاروق", "عثمان بن عفان ذو النورين", "علي بن أبي طالب رضي الله عنه"],
    correctAnswer: 3,
    explanation: "علي بن أبي طالب نام في فراش النبي ليلة الهجرة بجرأة وعزم، مفدياً الرسول بحياته ليموه على المشركين الحصار."
  },
  {
    id: 107,
    question: "ما معنى 'سدرة المنتهى' التي صعد إليها النبي بصحبة جبريل؟",
    options: ["جبل عالي القمة في مكة المكرمة", "شجرة نبق عظيمة في أقصى السماء السابعة لا يتجاوزها أحد من الملائكة لمكانتها البهية", "غار مظلم في جبال المدينة المنورة", "بئر مائي عذب يقع في وسط الجنة"],
    correctAnswer: 1,
    explanation: "سدرة المنتهى شجرة بهية تقع بعد السماء السابعة، يغشاها نور الله وجماله، وتجاوزها النبي في الإسراء والمعراج ترفيعاً لقدره."
  },
  {
    id: 108,
    question: "أي من التصرفات التالية تبطل صلاة الطالب فوراً إذا وقعت منه عمداً؟",
    options: ["التبسم الخفيف والاطمئنان", "قراءة قصار السور بعد الفاتحة", "الضحك والقهقهة بصوت مسموع، أو الأكل والشرب وحركة اللعب الكثيرة", "تأمل الكعبة بالقلب والخشوع للرحمن"],
    correctAnswer: 2,
    explanation: "الكلام العمد أو الأكل والشرب والضحك بصوت طفولي مسموع تخرج المسلم من خشوع صلاته وتبطلها تماماً."
  },
  {
    id: 109,
    question: "بماذا لقب الخليفة الراشد عمر بن الخطاب رضي الله عنه ولماذا؟",
    options: ["الملقب ذو النورين لفرط صدقه وعطائه الوافر", "الملقب بالفاروق لأنه فرّق بشجاعته وقوته بين الحق والباطل", "الفدائي الأول للشجاعة الباسلة ليلة الغار", "أمين سر الأمة وقاريء الوحي"],
    correctAnswer: 1,
    explanation: "عمر بن الخطاب لُقب بالفاروق، لأنه أعلن الإسلام جهراً في مكة، ففرّق الله به شوكة الإيمان عن الشرك العنيد."
  },
  {
    id: 110,
    question: "ما هي شروط نيل الشفاعة والرحمة العظمى لملائكة السماء والأنبياء يوم القيامة؟",
    options: ["شفاعة المشركين للأصنام", "طلب شفاعة التفاخر بالأحساب والعائلة والألقاب", "إذن الله تعالى بالشفاعة أولاً ورضاه عن الشخص المشفوع له بصدق قلبه", "الاستسقاء بحركات النجوم والكواكب المعمارية"],
    correctAnswer: 2,
    explanation: "لا تقع الشفاعة يوم البعث إلا للذين ارتضاهم الله وأذن بالشافع لهم، ليعلم الخلق بأن الأمر يعود لملك الملوك تباركت أسماؤه."
  }
];

interface QuizSystemProps {
  quizTitle: string;
  questions: QuizQuestion[];
  onQuizCompleted: (scorePercentage: number, earnedStars: number) => void;
  onBack: () => void;
}

export default function QuizSystem({
  quizTitle,
  questions,
  onQuizCompleted,
  onBack
}: QuizSystemProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const currentQuestion = questions[currentIdx];

  const handleOptionClick = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (optIdx === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      SoundEngine.playSuccess();
    } else {
      SoundEngine.playFailure();
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate results
      const finalPercentage = Math.round((score / questions.length) * 100);
      
      // Star policy: 2 stars for completing, bonus 5 stars for score > 80%, bonus 10 stars for perfect score!
      let starsGained = 2;
      if (finalPercentage === 100) starsGained += 8; // Total 10 stars for master
      else if (finalPercentage >= 80) starsGained += 3; // Total 5 stars for excellent

      setCompleted(true);
      SoundEngine.playTrophy();
      onQuizCompleted(finalPercentage, starsGained);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
    SoundEngine.playSparkle();
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-1" dir="rtl" id="quiz-system-board">
      {/* Quiz Top bar */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#DCD3C1]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#8E8268] hover:text-[#5A6B47] font-bold py-1 px-3 rounded-lg hover:bg-[#E9E1CD]/50 transition cursor-pointer"
          id="btn-quiz-exit"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          <span>مغادرة الرهان التعليمي</span>
        </button>
        <span className="text-sm font-bold text-[#3A452E] font-sans">
          {quizTitle}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25 }}
            className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-md text-right"
            id={`quiz-card-${currentIdx}`}
          >
            {/* Question Counter Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold font-sans text-[#5A6B47] bg-[#5A6B47]/10 border border-[#5A6B47]/20 px-3 py-1.5 rounded-xl">
                السؤال {currentIdx + 1} من {questions.length}
              </span>
              <div className="flex gap-1.5ClassName bg-[#E9E1CD]">
                {[...Array(questions.length)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i < currentIdx
                        ? 'w-4 bg-[#5A6B47]'
                        : i === currentIdx
                        ? 'w-6 bg-[#D48166] animate-pulse'
                        : 'w-2 bg-[#E9E1CD]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold font-sans text-[#3A452E] leading-relaxed mb-6">
              {currentQuestion.question}
            </h3>

            {/* Answers options layout */}
            <div className="space-y-3.5" id="quiz-options-list">
              {currentQuestion.options.map((option, idx) => {
                let borderClass = 'border-[#DCD3C1] hover:bg-[#E9E1CD]/30 text-[#4A453E]';
                let bgClass = 'bg-[#FAF9F6]';
                let iconEl = null;

                if (isAnswered) {
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const isSelected = idx === selectedOpt;

                  if (isCorrect) {
                    borderClass = 'border-[#5A6B47] bg-[#5A6B47]/10 text-[#3A452E]';
                    iconEl = <Check className="w-5 h-5 text-[#5A6B47] stroke-[3]" />;
                  } else if (isSelected && !isCorrect) {
                    borderClass = 'border-[#D48166] bg-[#D48166]/10 text-[#D48166]';
                    iconEl = <X className="w-5 h-5 text-[#D48166] stroke-[3]" />;
                  } else {
                    borderClass = 'border-[#DCD3C1]/50 opacity-55 text-[#8E8268]';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswered}
                    className={`w-full text-right p-4 rounded-2xl border-2 font-sans font-black text-xs sm:text-sm transition-all flex items-center justify-between gap-4 cursor-pointer outline-none ${borderClass} ${bgClass}`}
                    id={`opt-btn-${idx}`}
                  >
                    <span className="leading-relaxed flex-1">
                      {option}
                    </span>
                    {iconEl}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next step panel */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-5 border-t border-[#DCD3C1]"
                >
                  <div className="bg-[#F1EBDC]/75 p-4 rounded-2xl border-r-4 border-[#5A6B47] mb-5 text-right flex gap-3">
                    <HelpCircle className="w-6 h-6 text-[#5A6B47] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-[#5A6B47] mb-1.5 text-right">بيان وتصحيح المعلم الصغير:</span>
                      <p className="text-xs text-[#4A453E] leading-relaxed font-sans font-bold">
                        {currentQuestion.explanation || "عمل رائع! تذكر دوماً هذا المبدأ الإسلامي الحكيم لتنير عقول الآخرين في حياتك اليومية."}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-1 shadow-sm transition active:scale-95 text-xs cursor-pointer"
                      id="btn-quiz-next"
                    >
                      <span>{currentIdx === questions.length - 1 ? "رؤية النتيجة النهائية 🏆" : "السؤال التالي"}</span>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Quiz Complete Board */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF9F6] border border-[#DCD3C1] p-8 rounded-3xl shadow-md text-center"
            id="quiz-result-board"
          >
            <div className="w-20 h-20 bg-[#F1EBDC] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#DCD3C1]">
              <Trophy className="w-10 h-10 text-[#D48166]" />
            </div>

            <h2 className="text-xl font-bold font-sans text-[#3A452E] mb-2">أنهيت التحدي بنجاح!</h2>
            <p className="text-xs sm:text-sm text-[#8E8268] max-w-md mx-auto mb-6 leading-relaxed font-medium">
              لقد واجهت أسئلة كتاب <span className="font-extrabold text-[#5A6B47]">" {quizTitle.replace('اختبار كتاب: ', '')} "</span> بجدارة تامة وأدليت ببيان علمي عظيم.
            </p>

            {/* Circle Percentage display */}
            <div className="inline-flex flex-col items-center p-6 bg-[#F1EBDC]/60 rounded-3xl border border-[#DCD3C1]/80 mb-6 min-w-[190px]">
              <span className="text-3xl font-black font-sans text-[#D48166] mb-1">
                {Math.round((score / questions.length) * 100)}%
              </span>
              <span className="text-[10px] text-[#4A453E] font-bold">
                أجبت صح على {score} من {questions.length} أسئلة
              </span>
            </div>

            {/* Stars generated */}
            <div className="block mb-8">
              <div className="inline-flex items-center gap-1.5 py-1.5 px-4 bg-[#D48166]/10 text-[#D48166] rounded-full font-bold border border-[#D48166]/20 text-[11px] text-center animate-bounce">
                <span>⭐ حصلت على {Math.round((score / questions.length) * 100) === 100 ? "١٠ نجوم كاملة!" : Math.round((score / questions.length) * 100) >= 80 ? "٥ نجوم مضيئة!" : "نجمتين لرحلة المحاولة!"}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onBack}
                className="bg-[#5A6B47] hover:bg-[#465337] text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition active:scale-95 text-xs cursor-pointer"
                id="btn-quiz-done-confirm"
              >
                العودة للرئيسية والخرائط
              </button>
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-1 bg-[#FAF9F6] hover:bg-[#E9E1CD] text-[#4A453E] font-bold py-3 px-6 rounded-2xl border border-[#DCD3C1] transition text-xs cursor-pointer"
                id="btn-quiz-retry"
              >
                <RotateCcw className="w-4 h-4 ml-1 text-[#5A6B47]" />
                <span>إعادة المحاولة لتحد أفضل</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple left chevron icon helper
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      viewBox="0 0 24 24"
      className={props.className}
      style={{ width: '1em', height: '1.5em' }}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
