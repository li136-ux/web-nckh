import React, { useState, useEffect, useCallback } from "react";
import { Flashcard, Subject, BloomLevel, BLOOM_LEVELS } from "../types";
import { ReviewRating, processFlashcardReview, isCardDue } from "../services/spacedRepetition";
import { sounds } from "../services/audio";
import confetti from "canvas-confetti";
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Filter, 
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  subjects: Subject[];
  onUpdateCard: (updatedCard: Flashcard) => void;
  onRecordStudy: (cardsCount: number) => void;
  onEnterFocusMode?: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  flashcards,
  subjects,
  onUpdateCard,
  onRecordStudy,
  onEnterFocusMode,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [selectedBloomLevel, setSelectedBloomLevel] = useState<BloomLevel | 0>(0);
  const [onlyDueToday, setOnlyDueToday] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [reviewedInSession, setReviewedInSession] = useState<number>(0);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);

  // Filter cards
  const filteredCards = flashcards.filter((card) => {
    if (selectedSubjectId !== "all" && card.subjectId !== selectedSubjectId) return false;
    if (selectedBloomLevel !== 0 && card.bloomLevel !== selectedBloomLevel) return false;
    if (onlyDueToday && !isCardDue(card)) return false;
    return true;
  });

  const currentCard: Flashcard | undefined = filteredCards[currentIndex];
  const currentSubject = subjects.find((s) => s.id === currentCard?.subjectId);
  const bloom = currentCard ? BLOOM_LEVELS[currentCard.bloomLevel] : null;

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setSessionFinished(false);
  }, [selectedSubjectId, selectedBloomLevel, onlyDueToday]);

  const handleFlip = useCallback(() => {
    if (!currentCard) return;
    sounds.playFlip();
    setIsFlipped((prev) => !prev);
  }, [currentCard]);

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      if (!currentCard) return;

      if (rating === "again") {
        sounds.playFailure();
      } else {
        sounds.playSuccess();
      }

      const updated = processFlashcardReview(currentCard, rating);
      onUpdateCard(updated);
      onRecordStudy(1);
      setReviewedInSession((prev) => prev + 1);

      // Advance to next card
      if (currentIndex < filteredCards.length - 1) {
        setIsFlipped(false);
        setShowHint(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionFinished(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    },
    [currentCard, currentIndex, filteredCards.length, onUpdateCard, onRecordStudy]
  );

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev + 1);
      sounds.playClick();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev - 1);
      sounds.playClick();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setSessionFinished(false);
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (isFlipped) {
        if (e.key === "1") {
          e.preventDefault();
          handleRate("again");
        } else if (e.key === "2") {
          e.preventDefault();
          handleRate("good");
        } else if (e.key === "3") {
          e.preventDefault();
          handleRate("easy");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, handleRate, isFlipped]);

  // Leitner box text helper
  const getBoxName = (box: number) => {
    switch (box) {
      case 1:
        return "Hộp 1 (Mới học · Ôn hàng ngày)";
      case 2:
        return "Hộp 2 (Ôn 3 ngày/lần)";
      case 3:
        return "Hộp 3 (Ôn 1 tuần/lần)";
      case 4:
        return "Hộp 4 (Ôn 2 tuần/lần)";
      case 5:
        return "Hộp 5 (Thành thạo · Ôn 1 tháng/lần)";
      default:
        return `Hộp ${box}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Controls: Subject & Bloom Level Selection */}
      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subject Filter (Segmented buttons) */}
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
              Tất cả môn ({flashcards.length})
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

          {/* Quick toggle: Due today only */}
          <button
            onClick={() => setOnlyDueToday((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              onlyDueToday
                ? "border-amber-400 bg-amber-50 text-amber-900 font-semibold"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chỉ thẻ đến hạn ôn hôm nay</span>
          </button>
        </div>

        {/* Bloom Level Filter (Interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-zinc-100">
          <span className="text-xs font-semibold text-zinc-500 mr-1 shrink-0">Thang Bloom:</span>
          <button
            onClick={() => setSelectedBloomLevel(0)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedBloomLevel === 0
                ? "bg-zinc-800 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Tất cả 6 mức
          </button>
          {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
            const info = BLOOM_LEVELS[lvl];
            const isSelected = selectedBloomLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedBloomLevel(lvl)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                Mức {lvl}: {info.viName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {filteredCards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
          <Layers className="mx-auto w-10 h-10 text-zinc-400 stroke-1" />
          <h3 className="mt-3 text-sm font-semibold text-zinc-800">Không có thẻ flashcard phù hợp</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Hãy đổi bộ lọc hoặc thêm thẻ flashcard mới cho môn học này.
          </p>
          <button
            onClick={() => {
              setSelectedSubjectId("all");
              setSelectedBloomLevel(0);
              setOnlyDueToday(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : sessionFinished ? (
        /* Finished Review Session Screen */
        <div className="rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-900">
            Hoàn thành phiên ôn tập!
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Bạn đã ôn tập <span className="font-mono font-semibold text-zinc-800">{filteredCards.length}</span> thẻ flashcard theo phương pháp lặp lại ngắt quãng (Spaced Repetition).
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors"
            >
              Ôn lại từ đầu
            </button>
          </div>
        </div>
      ) : (
        /* Active Flashcard Study Area */
        <div className="space-y-4">
          {/* Card Status & Progress Bar */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-800">
                Thẻ <span className="font-mono font-semibold">{currentIndex + 1}</span> / <span className="font-mono">{filteredCards.length}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentSubject?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Spaced repetition box indicator */}
              <span className="font-mono text-zinc-600 hidden sm:inline">
                {getBoxName(currentCard?.box || 1)}
              </span>
              {onEnterFocusMode && (
                <button
                  onClick={onEnterFocusMode}
                  className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 cursor-pointer"
                  title="Chế độ tập trung toàn màn hình"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tập trung</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress bar line */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-zinc-900 transition-all duration-200"
              style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
            />
          </div>

          {/* The 3D Flashcard Container */}
          <div
            onClick={handleFlip}
            className="group relative min-h-[320px] w-full cursor-pointer perspective-1000 select-none"
          >
            <div
              className={`relative h-full min-h-[320px] w-full rounded-xl border border-zinc-200/90 bg-white p-7 shadow-xs transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* --- FRONT SIDE --- */}
              <div className="absolute inset-0 flex flex-col justify-between p-7 backface-hidden">
                {/* Card Header: Zero-pill metadata */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: bloom?.color }}
                    />
                    <span className="font-medium text-zinc-800">
                      Thang Bloom · Mức {bloom?.level}: {bloom?.viName} ({bloom?.enName})
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-zinc-400">Mặt trước (Câu hỏi)</span>
                  </div>

                  <span className="text-xs text-zinc-400 font-mono">
                    Hộp {currentCard?.box}
                  </span>
                </div>

                {/* Question / Prompt Body */}
                <div className="my-auto py-4">
                  <p className="text-lg font-medium text-zinc-900 leading-relaxed sm:text-xl">
                    {currentCard?.front}
                  </p>

                  {/* Hint Toggle */}
                  {currentCard?.hint && (
                    <div className="mt-4">
                      {showHint ? (
                        <div className="rounded-md bg-amber-50/70 p-3 text-xs text-amber-900 border border-amber-200/50">
                          <strong className="font-semibold">Gợi ý tư duy:</strong> {currentCard.hint}
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Xem gợi ý</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer prompt */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs text-zinc-400">
                  <span>Nhấn thẻ hoặc phím <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-mono">Space</kbd> để lật đáp án</span>
                  <RotateCw className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </div>
              </div>

              {/* --- BACK SIDE --- */}
              <div className="absolute inset-0 flex flex-col justify-between p-7 rotate-y-180 backface-hidden bg-zinc-50/50 rounded-xl">
                {/* Back Header */}
                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: bloom?.color }}
                    />
                    <span className="font-semibold text-zinc-900">
                      Đáp án & Phân tích chuyên sâu
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-zinc-500">Cấp độ {bloom?.viName}</span>
                  </div>

                  <span className="text-xs text-zinc-500 font-mono">
                    Đã ôn {currentCard?.repetitions} lần
                  </span>
                </div>

                {/* Answer Content */}
                <div className="my-auto py-4">
                  <div className="text-base text-zinc-800 leading-relaxed font-normal whitespace-pre-line sm:text-lg">
                    {currentCard?.back}
                  </div>

                  {/* Bloom cognitive context */}
                  <div className="mt-4 pt-3 border-t border-zinc-200/60 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-700">Mục tiêu nhận thức: </span>
                    <span>{bloom?.description}</span>
                  </div>
                </div>

                {/* Back Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-200/60 text-xs text-zinc-400">
                  <span>Chọn mức độ ghi nhớ bên dưới</span>
                  <span>Phím tắt <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 font-mono">1 · 2 · 3</kbd></span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Step navigation buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-md border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>
              <button
                onClick={handleFlip}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-md border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isFlipped ? "Xem câu hỏi" : "Lật đáp án"}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === filteredCards.length - 1}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-md border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Spaced Repetition Rating Buttons (Visible when flipped) */}
            {isFlipped ? (
              <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in duration-200">
                <button
                  onClick={() => handleRate("again")}
                  className="flex-1 sm:flex-none rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <span className="font-mono mr-1">[1]</span> Cần ôn lại (Hộp 1)
                </button>
                <button
                  onClick={() => handleRate("good")}
                  className="flex-1 sm:flex-none rounded-md border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-medium text-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  <span className="font-mono mr-1">[2]</span> Đã nhớ (+1 Hộp)
                </button>
                <button
                  onClick={() => handleRate("easy")}
                  className="flex-1 sm:flex-none rounded-md border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <span className="font-mono mr-1">[3]</span> Thành thạo (+2 Hộp)
                </button>
              </div>
            ) : (
              <div className="text-xs text-zinc-400 italic">
                Lật mặt sau để chấm điểm trí nhớ Spaced Repetition
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
