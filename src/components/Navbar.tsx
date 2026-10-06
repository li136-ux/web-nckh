import React from "react";
import { PWAInstallButton } from "./PWAInstallButton";
import { RefreshCw, Timer, BookOpen, Layers, CheckSquare, BarChart3, Calendar } from "lucide-react";

export type ActiveTab = "flashcards" | "quizzes" | "roadmap" | "schedule" | "subjects";

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSync: () => void;
  onTogglePomodoro: () => void;
  isPomodoroActive: boolean;
  pomodoroSecondsLeft: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSync,
  onTogglePomodoro,
  isPomodoroActive,
  pomodoroSecondsLeft,
}) => {
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const navLinks = [
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "quizzes", label: "Trắc nghiệm Bloom", icon: CheckSquare },
    { id: "roadmap", label: "Sơ đồ & Tiến độ", icon: BarChart3 },
    { id: "schedule", label: "Lịch & Nhắc nhở", icon: Calendar },
    { id: "subjects", label: "Môn học", icon: BookOpen },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element Brand Zone */}
        <button
          onClick={() => onTabChange("flashcards")}
          className="text-left cursor-pointer focus:outline-none"
        >
          <span className="text-base font-bold tracking-tight text-zinc-900 font-sans">
            CogniLearn
          </span>
        </button>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "text-zinc-900 border-b-2 border-zinc-900 font-semibold"
                    : "hover:text-zinc-900 border-b-2 border-transparent"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Pomodoro Timer Quick Action */}
          <button
            onClick={onTogglePomodoro}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors border ${
              isPomodoroActive
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
            title="Đồng hồ Pomodoro hỗ trợ tập trung"
          >
            <Timer className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono tabular-nums">
              {isPomodoroActive ? formatTimer(pomodoroSecondsLeft) : "25:00"}
            </span>
          </button>

          {/* Sync Button */}
          <button
            onClick={onOpenSync}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-colors"
            title="Đồng bộ đa thiết bị"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Đồng bộ</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="flex md:hidden border-t border-zinc-100 bg-zinc-50/50 px-2 py-1.5 overflow-x-auto gap-2 text-xs">
        {navLinks.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-zinc-900 text-white font-medium"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
