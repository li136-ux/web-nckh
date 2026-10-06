/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { AppState, BloomLevel, Flashcard, QuizAttempt, QuizQuestion, Subject, StudyReminder } from "./types";
import { loadAppState, saveAppState, recordStudyActivity } from "./services/storage";
import { sounds } from "./services/audio";
import { Navbar, ActiveTab } from "./components/Navbar";
import { FlashcardViewer } from "./components/FlashcardViewer";
import { BloomQuiz } from "./components/BloomQuiz";
import { ProgressRoadmap } from "./components/ProgressRoadmap";
import { ScheduleReminder } from "./components/ScheduleReminder";
import { SubjectManager } from "./components/SubjectManager";
import { DeviceSyncModal } from "./components/DeviceSyncModal";
import { FocusStudyModal } from "./components/FocusStudyModal";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckSquare, 
  BarChart3, 
  BookOpen,
  Calendar,
  Flame,
  Clock,
  Compass
} from "lucide-react";

// Image asset paths generated via generate_image
import ambientStudyImg from "./assets/images/study_focus_ambient_1791299753242.jpg";
import bloomConceptImg from "./assets/images/bloom_taxonomy_concept_1791299767661.jpg";

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>("flashcards");
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

  // Global Pomodoro timer state
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);

  // Sync state to local storage when modified
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Pomodoro timer ticker
  useEffect(() => {
    let interval: any;
    if (isPomodoroActive && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            sounds.playSuccess();
            setIsPomodoroActive(false);
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              new Notification("CogniLearn · Hoàn thành Pomodoro!", {
                body: "25 phút tập trung đã hoàn tất! Hãy nghỉ ngơi 5 phút trước phiên tiếp theo.",
                icon: "/icon-192.svg",
              });
            }
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPomodoroActive, pomodoroSeconds]);

  const handleTogglePomodoro = () => {
    sounds.playClick();
    setIsPomodoroActive((prev) => !prev);
  };

  // Card update handler
  const handleUpdateCard = useCallback((updatedCard: Flashcard) => {
    setState((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
      lastSyncTimestamp: Date.now(),
    }));
  }, []);

  // Study activity tracker
  const handleRecordCardsStudy = useCallback((cardsCount: number) => {
    const updated = recordStudyActivity(cardsCount, 0, Math.ceil(cardsCount * 0.8));
    setState(updated);
  }, []);

  const handleRecordQuizStudy = useCallback((quizCount: number) => {
    const updated = recordStudyActivity(0, quizCount, Math.ceil(quizCount * 1.5));
    setState(updated);
  }, []);

  const handleRecordAttempt = useCallback((attempt: QuizAttempt) => {
    setState((prev) => ({
      ...prev,
      quizAttempts: [attempt, ...prev.quizAttempts],
      lastSyncTimestamp: Date.now(),
    }));
  }, []);

  const handleUpdateReminders = useCallback((reminders: StudyReminder[]) => {
    setState((prev) => ({
      ...prev,
      reminders,
      lastSyncTimestamp: Date.now(),
    }));
  }, []);

  const handleUpdateSubjects = useCallback((subjects: Subject[]) => {
    setState((prev) => ({
      ...prev,
      subjects,
      lastSyncTimestamp: Date.now(),
    }));
  }, []);

  const handleAddFlashcard = useCallback((card: Flashcard) => {
    setState((prev) => ({
      ...prev,
      flashcards: [...prev.flashcards, card],
      lastSyncTimestamp: Date.now(),
    }));
  }, []);

  const handleAddQuiz = useCallback((quiz: QuizQuestion) => {
    setState((prev) => ({
      ...prev,
      quizzes: [...prev.quizzes, quiz],
      lastSyncTimestamp: Date.now(),
    }));
  }, []);

  const handleNavigateToStudy = (subjectId: string, bloomLevel?: BloomLevel) => {
    setActiveTab("flashcards");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToTab = (tab: "flashcards" | "quizzes", subjectId: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculation for top metrics
  const totalMasteredCards = state.flashcards.filter((f) => f.box >= 4).length;
  const todayDate = new Date().toISOString().split("T")[0];
  const todayLog = state.studyLogs.find((l) => l.date === todayDate);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* 3-Zone Minimalist Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onTogglePomodoro={handleTogglePomodoro}
        isPomodoroActive={isPomodoroActive}
        pomodoroSecondsLeft={pomodoroSeconds}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Minimalist Hero Section with Ambient Learning Asset */}
        <section className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-3">
              {/* Unboxed editorial kicker */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                <span>Nền tảng Tự học Sinh viên</span>
                <span aria-hidden="true">·</span>
                <span>Thang Nhận thức Bloom (Revised 6 Tiers)</span>
                <span aria-hidden="true">·</span>
                <span>Lặp lại ngắt quãng Spaced Repetition</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-sans" style={{ textWrap: "balance" }}>
                Học tập có phương pháp: Từ Nhớ dữ kiện đến Sáng tạo giải pháp
              </h1>

              <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">
                Quản lý lộ trình học đại học tối giản, làm chủ 6 bậc nhận thức Bloom qua flashcards thông minh, kiểm tra trắc nghiệm khách quan có giải thích chuyên sâu, và tự động đồng bộ hóa trên mọi thiết bị.
              </p>

              {/* Minimalist Metric Row (Zero-pill text) */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-600 border-t border-zinc-100">
                <div>
                  <span className="font-semibold text-zinc-900 font-mono tabular-nums text-sm">
                    {state.flashcards.length}
                  </span>{" "}
                  thẻ học liệu
                </div>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <div>
                  <span className="font-semibold text-zinc-900 font-mono tabular-nums text-sm">
                    {state.quizzes.length}
                  </span>{" "}
                  câu trắc nghiệm Bloom
                </div>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <div>
                  <span className="font-semibold text-zinc-900 font-mono tabular-nums text-sm">
                    {totalMasteredCards}
                  </span>{" "}
                  thẻ đã thành thạo (Hộp 4–5)
                </div>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <div>
                  Hôm nay:{" "}
                  <strong className="font-mono text-zinc-900">
                    {todayLog?.cardsReviewed || 0} thẻ
                  </strong>{" "}
                  · <strong className="font-mono text-zinc-900">{todayLog?.minutes || 0} phút</strong>
                </div>
              </div>
            </div>

            {/* Right Ambient Visual Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="relative overflow-hidden rounded-xl border border-zinc-200/90 aspect-16/10 bg-zinc-100 group">
                <img
                  src={ambientStudyImg}
                  alt="Không gian học tập tối giản"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG mesh if image fails
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs">
                    <span className="font-semibold block">Tối giản để tối ưu nhận thức</span>
                    <span className="text-[11px] text-zinc-300">Không xao nhãng · Tự học bền bỉ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        {activeTab === "flashcards" && (
          <FlashcardViewer
            flashcards={state.flashcards}
            subjects={state.subjects}
            onUpdateCard={handleUpdateCard}
            onRecordStudy={handleRecordCardsStudy}
            onEnterFocusMode={() => setIsFocusModalOpen(true)}
          />
        )}

        {activeTab === "quizzes" && (
          <BloomQuiz
            quizzes={state.quizzes}
            subjects={state.subjects}
            onRecordAttempt={handleRecordAttempt}
            onRecordStudy={handleRecordQuizStudy}
          />
        )}

        {activeTab === "roadmap" && (
          <ProgressRoadmap
            state={state}
            onNavigateToStudy={handleNavigateToStudy}
          />
        )}

        {activeTab === "schedule" && (
          <ScheduleReminder
            state={state}
            onUpdateReminders={handleUpdateReminders}
            onNavigateToStudy={(subId) => handleNavigateToTab("flashcards", subId)}
          />
        )}

        {activeTab === "subjects" && (
          <SubjectManager
            state={state}
            onUpdateSubjects={handleUpdateSubjects}
            onAddFlashcard={handleAddFlashcard}
            onAddQuiz={handleAddQuiz}
            onNavigateToTab={handleNavigateToTab}
          />
        )}
      </main>

      {/* Subtle Minimalist Footer */}
      <footer className="mt-auto border-t border-zinc-200 bg-white py-6 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800">CogniLearn</span>
            <span aria-hidden="true">·</span>
            <span>Hệ thống Tự học Chuẩn Thang Nhận thức Bloom & Spaced Repetition</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Chế độ ngoại tuyến PWA</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Đồng bộ dữ liệu
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsFocusModalOpen(true)}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Chế độ Tập trung
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Offline Notification */}
      <OfflineIndicator />

      {/* Device Sync & Offline Modal */}
      <DeviceSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        state={state}
        onStateRestored={setState}
      />

      {/* Fullscreen Zen Focus Study Modal */}
      <FocusStudyModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        flashcards={state.flashcards}
        subjects={state.subjects}
        onUpdateCard={handleUpdateCard}
        onRecordStudy={handleRecordCardsStudy}
      />
    </div>
  );
}
