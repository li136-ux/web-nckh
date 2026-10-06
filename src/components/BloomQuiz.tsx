import React, { useState, useEffect } from "react";
import { QuizQuestion, Subject, BloomLevel, BLOOM_LEVELS, QuizAttempt } from "../types";
import { sounds } from "../services/audio";
import confetti from "canvas-confetti";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCw, 
  Timer, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  BarChart2,
  Check
} from "lucide-react";

interface BloomQuizProps {
  quizzes: QuizQuestion[];
  subjects: Subject[];
  onRecordAttempt: (attempt: QuizAttempt) => void;
  onRecordStudy: (quizzesCount: number) => void;
}

export const BloomQuiz: React.FC<BloomQuizProps> = ({
  quizzes,
  subjects,
  onRecordAttempt,
  onRecordStudy,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [selectedBloomLevel, setSelectedBloomLevel] = useState<BloomLevel | 0>(0);
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Selected answers: { [questionId]: optionId }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  // For practice mode: tracks which questions have their explanation revealed
  const [revealedInPractice, setRevealedInPractice] = useState<Record<string, boolean>>({});

  // Exam state
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Filter questions
  const filteredQuestions = quizzes.filter((q) => {
    if (selectedSubjectId !== "all" && q.subjectId !== selectedSubjectId) return false;
    if (selectedBloomLevel !== 0 && q.bloomLevel !== selectedBloomLevel) return false;
    return true;
  });

  const currentQ: QuizQuestion | undefined = filteredQuestions[currentIndex];
  const currentSubject = subjects.find((s) => s.id === currentQ?.subjectId);
  const bloom = currentQ ? BLOOM_LEVELS[currentQ.bloomLevel] : null;

  // Reset quiz state when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setRevealedInPractice({});
    setExamSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(mode === "exam");
  }, [selectedSubjectId, selectedBloomLevel, mode]);

  // Exam timer tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !examSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, examSubmitted]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (examSubmitted) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    if (mode === "practice") {
      setRevealedInPractice((prev) => ({
        ...prev,
        [questionId]: true,
      }));

      // Audio feedback
      const q = quizzes.find((item) => item.id === questionId);
      const opt = q?.options.find((o) => o.id === optionId);
      if (opt?.isCorrect) {
        sounds.playSuccess();
      } else {
        sounds.playFailure();
      }
    } else {
      sounds.playClick();
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      sounds.playClick();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      sounds.playClick();
    }
  };

  const handleSubmitExam = () => {
    setIsTimerRunning(false);
    setExamSubmitted(true);

    // Calculate score & bloom breakdown
    let correctCount = 0;
    const breakdown: Record<BloomLevel, { total: number; correct: number }> = {
      1: { total: 0, correct: 0 },
      2: { total: 0, correct: 0 },
      3: { total: 0, correct: 0 },
      4: { total: 0, correct: 0 },
      5: { total: 0, correct: 0 },
      6: { total: 0, correct: 0 },
    };

    filteredQuestions.forEach((q) => {
      breakdown[q.bloomLevel].total += 1;
      const selectedOptId = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selectedOptId === correctOpt?.id) {
        correctCount += 1;
        breakdown[q.bloomLevel].correct += 1;
      }
    });

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      subjectId: selectedSubjectId === "all" ? "general" : selectedSubjectId,
      date: new Date().toISOString(),
      totalQuestions: filteredQuestions.length,
      correctAnswers: correctCount,
      bloomBreakdown: breakdown,
      timeSpentSeconds: timerSeconds,
    };

    onRecordAttempt(attempt);
    onRecordStudy(filteredQuestions.length);

    if (correctCount / filteredQuestions.length >= 0.7) {
      sounds.playSuccess();
      confetti({ particleCount: 70, spread: 70 });
    }
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setRevealedInPractice({});
    setExamSubmitted(false);
    setCurrentIndex(0);
    setTimerSeconds(0);
    setIsTimerRunning(mode === "exam");
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Exam Score calculations
  const totalCorrect = filteredQuestions.filter((q) => {
    const userOpt = userAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return userOpt === correctOpt?.id;
  }).length;
  const scorePercent = filteredQuestions.length > 0 ? Math.round((totalCorrect / filteredQuestions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quiz Filter & Mode Selector */}
      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-zinc-500 mr-1 shrink-0">Môn học:</span>
            <button
              onClick={() => setSelectedSubjectId("all")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedSubjectId === "all"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Tất cả môn ({quizzes.length})
            </button>
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectId(s.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSubjectId === s.id
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {s.code} · {s.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Mode Switcher: Practice vs Exam */}
          <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-md">
            <button
              onClick={() => setMode("practice")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                mode === "practice" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Luyện tập (Xem giải thích)
            </button>
            <button
              onClick={() => setMode("exam")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                mode === "exam" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Kiểm tra tính giờ
            </button>
          </div>
        </div>

        {/* Bloom Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-zinc-100">
          <span className="text-xs font-semibold text-zinc-500 mr-1 shrink-0">Lọc theo Thang Bloom:</span>
          <button
            onClick={() => setSelectedBloomLevel(0)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedBloomLevel === 0 ? "bg-zinc-800 text-white" : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Đề tổng hợp (6 mức)
          </button>
          {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
            const info = BLOOM_LEVELS[lvl];
            const isSelected = selectedBloomLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedBloomLevel(lvl)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected ? "bg-zinc-800 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                Mức {lvl}: {info.viName}
              </button>
            );
          })}
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
          <HelpCircle className="mx-auto w-10 h-10 text-zinc-400 stroke-1" />
          <h3 className="mt-3 text-sm font-semibold text-zinc-800">Không có câu hỏi phù hợp với bộ lọc</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Hãy đổi môn học hoặc chọn cấp độ Bloom khác.
          </p>
          <button
            onClick={() => {
              setSelectedSubjectId("all");
              setSelectedBloomLevel(0);
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 cursor-pointer"
          >
            Xem tất cả câu hỏi
          </button>
        </div>
      ) : mode === "exam" && examSubmitted ? (
        /* Exam Results Summary & Cognitive Breakdown */
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-100 pb-5">
            <div>
              <span className="text-xs text-zinc-500">Kết quả kiểm tra</span>
              <h2 className="text-xl font-bold text-zinc-900">
                {scorePercent >= 80 ? "Xuất sắc!" : scorePercent >= 60 ? "Khá tốt!" : "Cần rèn luyện thêm"}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                <span>Thời gian: <strong className="font-mono text-zinc-800">{formatTimer(timerSeconds)}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Chính xác: <strong className="font-mono text-zinc-800">{totalCorrect}/{filteredQuestions.length}</strong></span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-3xl font-extrabold text-zinc-900 font-mono tabular-nums">
                {scorePercent}%
              </span>
              <div className="text-xs text-zinc-500">Độ hoàn thành</div>
            </div>
          </div>

          {/* Bloom Taxonomy Breakdown Chart */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-3">
              Phân bố năng lực theo 6 mức thang Bloom
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
                const info = BLOOM_LEVELS[lvl];
                const qInLevel = filteredQuestions.filter((q) => q.bloomLevel === lvl);
                if (qInLevel.length === 0) return null;
                const correctInLevel = qInLevel.filter((q) => {
                  const userOpt = userAnswers[q.id];
                  const correctOpt = q.options.find((o) => o.isCorrect);
                  return userOpt === correctOpt?.id;
                }).length;
                const pct = Math.round((correctInLevel / qInLevel.length) * 100);

                return (
                  <div key={lvl} className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-medium text-zinc-800">
                        Mức {lvl}: {info.viName}
                      </span>
                      <span className="font-mono text-zinc-600">
                        {correctInLevel}/{qInLevel.length} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: info.color,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-zinc-500 line-clamp-1">
                      {info.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h3 className="text-sm font-semibold text-zinc-900">Chi tiết đáp án & Phân tích lỗi sai</h3>
            {filteredQuestions.map((q, idx) => {
              const userOptId = userAnswers[q.id];
              const correctOpt = q.options.find((o) => o.isCorrect);
              const isCorrect = userOptId === correctOpt?.id;
              const qBloom = BLOOM_LEVELS[q.bloomLevel];

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? "border-emerald-200 bg-white" : "border-rose-200 bg-rose-50/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-zinc-800">Câu {idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium" style={{ color: qBloom.color }}>
                        Mức {qBloom.level}: {qBloom.viName}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 font-medium">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Chưa chính xác
                        </span>
                      )}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-zinc-900 mb-3">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => {
                      const isSelected = userOptId === opt.id;
                      const isOptCorrect = opt.isCorrect;

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-md border ${
                            isOptCorrect
                              ? "border-emerald-300 bg-emerald-50 text-emerald-950 font-medium"
                              : isSelected
                              ? "border-rose-300 bg-rose-50 text-rose-950"
                              : "border-zinc-200 bg-zinc-50/50 text-zinc-600"
                          }`}
                        >
                          <div className="flex items-start gap-1.5">
                            <span className="font-mono mt-0.5">
                              {isOptCorrect ? "✓" : isSelected ? "✗" : "·"}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {opt.explanation && (
                            <p className="mt-1 text-[11px] text-zinc-500 pl-3">
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                    <span className="font-semibold text-zinc-700">Lý do mức Bloom: </span>
                    <span>{q.bloomRationale}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 cursor-pointer"
            >
              Làm lại bài thi
            </button>
          </div>
        </div>
      ) : (
        /* Active Single Question Interface */
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-900">
                Câu <span className="font-mono font-semibold">{currentIndex + 1}</span> / <span className="font-mono">{filteredQuestions.length}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentSubject?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              {mode === "exam" && (
                <div className="flex items-center gap-1 font-mono text-zinc-700 font-semibold bg-zinc-100 px-2 py-0.5 rounded">
                  <Timer className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatTimer(timerSeconds)}</span>
                </div>
              )}
              {/* Question map dots */}
              <div className="hidden sm:flex items-center gap-1">
                {filteredQuestions.map((q, i) => {
                  const hasAnswered = !!userAnswers[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        currentIndex === i
                          ? "ring-2 ring-zinc-900 bg-zinc-900"
                          : hasAnswered
                          ? "bg-zinc-400"
                          : "bg-zinc-200"
                      }`}
                      title={`Câu ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress bar line */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-zinc-900 transition-all duration-200"
              style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
            {/* Header: Zero-pill metadata with Bloom level */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: bloom?.color }}
                />
                <span className="font-medium text-zinc-900">
                  Thang Bloom · Mức {bloom?.level}: {bloom?.viName} ({bloom?.enName})
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-500">{bloom?.description}</span>
              </div>
            </div>

            {/* Question Text */}
            <p className="text-base sm:text-lg font-medium text-zinc-900 leading-relaxed">
              {currentQ?.question}
            </p>

            {/* 4 Multiple Choice Options */}
            <div className="space-y-2.5">
              {currentQ?.options.map((opt, optIndex) => {
                const optLetter = ["A", "B", "C", "D"][optIndex] || `${optIndex + 1}`;
                const isSelected = userAnswers[currentQ.id] === opt.id;
                const isRevealed = mode === "practice" && revealedInPractice[currentQ.id];

                let optionStyle = "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50/50";
                if (isRevealed) {
                  if (opt.isCorrect) {
                    optionStyle = "border-emerald-300 bg-emerald-50 text-emerald-950 font-medium";
                  } else if (isSelected) {
                    optionStyle = "border-rose-300 bg-rose-50 text-rose-950";
                  }
                } else if (isSelected) {
                  optionStyle = "border-zinc-900 bg-zinc-900 text-white";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${optionStyle}`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-mono shrink-0 ${
                        isSelected && !isRevealed
                          ? "bg-white text-zinc-900 font-bold"
                          : isRevealed && opt.isCorrect
                          ? "bg-emerald-600 text-white font-bold"
                          : isRevealed && isSelected
                          ? "bg-rose-600 text-white font-bold"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {optLetter}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm leading-relaxed">{opt.text}</span>

                      {/* Immediate explanation in practice mode */}
                      {isRevealed && opt.explanation && (
                        <p className="mt-1.5 text-xs text-zinc-600 pl-1 border-l-2 border-zinc-200">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Practice Mode General Explanation & Bloom Rationale */}
            {mode === "practice" && revealedInPractice[currentQ?.id] && (
              <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-4 space-y-2 text-xs animate-in fade-in duration-200">
                <div>
                  <span className="font-semibold text-zinc-800">Giải thích tổng thể: </span>
                  <span className="text-zinc-600">{currentQ?.generalExplanation}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200/60">
                  <span className="font-semibold text-zinc-800">Phân loại nhận thức Bloom: </span>
                  <span className="text-zinc-600">{currentQ?.bloomRationale}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <div className="flex items-center gap-2">
              {mode === "exam" && (
                <button
                  onClick={handleSubmitExam}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Nộp bài kiểm tra ({Object.keys(userAnswers).length}/{filteredQuestions.length})
                </button>
              )}

              {currentIndex < filteredQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 cursor-pointer"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : mode === "practice" ? (
                <button
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Ôn lại từ đầu</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
