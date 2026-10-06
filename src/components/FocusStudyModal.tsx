import React, { useState, useEffect } from "react";
import { Flashcard, Subject, BLOOM_LEVELS } from "../types";
import { ReviewRating, processFlashcardReview } from "../services/spacedRepetition";
import { sounds } from "../services/audio";
import { Minimize2, RotateCw, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface FocusStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  subjects: Subject[];
  onUpdateCard: (card: Flashcard) => void;
  onRecordStudy: (count: number) => void;
}

export const FocusStudyModal: React.FC<FocusStudyModalProps> = ({
  isOpen,
  onClose,
  flashcards,
  subjects,
  onUpdateCard,
  onRecordStudy,
}) => {
  if (!isOpen) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSecondsSpent((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCard = flashcards[currentIndex];
  const subject = subjects.find((s) => s.id === currentCard?.subjectId);
  const bloom = currentCard ? BLOOM_LEVELS[currentCard.bloomLevel] : null;

  const handleFlip = () => {
    sounds.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: ReviewRating) => {
    if (!currentCard) return;
    if (rating === "again") sounds.playFailure();
    else sounds.playSuccess();

    const updated = processFlashcardReview(currentCard, rating);
    onUpdateCard(updated);
    onRecordStudy(1);

    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white p-6 sm:p-10 select-none">
      {/* Top Bar of Focus Mode */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">Chế độ Tập trung Cao độ (Zen Mode)</span>
          <span aria-hidden="true">·</span>
          <span>{subject?.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono tabular-nums text-zinc-300">
            {formatTimer(secondsSpent)}
          </span>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:text-white cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* Center Stage */}
      <div className="my-auto mx-auto w-full max-w-2xl flex flex-col items-center">
        {/* Progress indicator */}
        <div className="w-full flex items-center justify-between text-xs text-zinc-500 mb-3 font-mono">
          <span>{currentIndex + 1} / {flashcards.length}</span>
          <span>Thang Bloom · Mức {bloom?.level}: {bloom?.viName}</span>
        </div>

        {/* Big Minimalist Focus Card */}
        <div
          onClick={handleFlip}
          className="w-full min-h-[360px] rounded-2xl bg-zinc-900 border border-zinc-800 p-8 sm:p-10 cursor-pointer flex flex-col justify-between shadow-2xl transition-all"
        >
          <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-800 pb-3">
            <span>{isFlipped ? "Đáp án & Diễn giải" : "Câu hỏi tư duy"}</span>
            <span className="font-mono">Hộp {currentCard?.box}</span>
          </div>

          <div className="py-6">
            <p className="text-xl sm:text-2xl font-medium text-zinc-100 leading-relaxed">
              {isFlipped ? currentCard?.back : currentCard?.front}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800 pt-3">
            <span>Chạm hoặc phím Space để lật</span>
            <RotateCw className="w-4 h-4 text-zinc-600" />
          </div>
        </div>

        {/* Rating Buttons in Focus Mode */}
        {isFlipped ? (
          <div className="mt-6 flex items-center gap-3 w-full max-w-md justify-center">
            <button
              onClick={() => handleRate("again")}
              className="flex-1 rounded-lg border border-rose-900/60 bg-rose-950/40 px-4 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-900/50 cursor-pointer"
            >
              Cần ôn lại [1]
            </button>
            <button
              onClick={() => handleRate("good")}
              className="flex-1 rounded-lg border border-sky-900/60 bg-sky-950/40 px-4 py-2.5 text-xs font-medium text-sky-300 hover:bg-sky-900/50 cursor-pointer"
            >
              Đang nhớ [2]
            </button>
            <button
              onClick={() => handleRate("easy")}
              className="flex-1 rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-4 py-2.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/50 cursor-pointer"
            >
              Thành thạo [3]
            </button>
          </div>
        ) : (
          <div className="mt-6 text-xs text-zinc-500">
            Lật thẻ để tự đánh giá mức độ ghi nhớ
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="text-center text-[11px] text-zinc-600">
        CogniLearn Zen Mode · Tối giản hóa giao diện học tập
      </div>
    </div>
  );
};
