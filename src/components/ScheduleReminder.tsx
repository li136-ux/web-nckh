import React, { useState } from "react";
import { AppState, StudyReminder, Subject } from "../types";
import { isCardDue } from "../services/spacedRepetition";
import { sounds } from "../services/audio";
import { 
  Bell, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  Timer, 
  Sparkles,
  ExternalLink
} from "lucide-react";

interface ScheduleReminderProps {
  state: AppState;
  onUpdateReminders: (reminders: StudyReminder[]) => void;
  onNavigateToStudy: (subjectId: string) => void;
}

export const ScheduleReminder: React.FC<ScheduleReminderProps> = ({
  state,
  onUpdateReminders,
  onNavigateToStudy,
}) => {
  const { reminders, subjects, flashcards } = state;

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isAdding, setIsAdding] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  // Smart due cards count
  const dueCards = flashcards.filter(isCardDue);
  const dueCardsBySubject = subjects.map((sub) => {
    const count = flashcards.filter((f) => f.subjectId === sub.id && isCardDue(f)).length;
    return { subject: sub, count };
  });

  // Target exam countdowns
  const exams = subjects
    .filter((s) => s.targetExamDate)
    .map((s) => {
      const examDate = new Date(s.targetExamDate!);
      const today = new Date();
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        subject: s,
        daysLeft: diffDays,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ Web Notifications.");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === "granted") {
        sendTestNotification();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendTestNotification = () => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
      new Notification("CogniLearn · Nhắc nhở học tập", {
        body: `Hôm nay bạn có ${dueCards.length} thẻ flashcard cần ôn tập theo lộ trình Spaced Repetition!`,
        icon: "/icon-192.svg",
      });
      sounds.playSuccess();
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateReminders(updated);
    sounds.playClick();
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    onUpdateReminders(updated);
    sounds.playClick();
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReminder: StudyReminder = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      daysOfWeek: newDays.length > 0 ? newDays : [1, 2, 3, 4, 5],
      time: newTime,
      enabled: true,
    };

    onUpdateReminders([...reminders, newReminder]);
    setNewTitle("");
    setIsAdding(false);
    sounds.playSuccess();
  };

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const toggleDay = (dayIndex: number) => {
    setNewDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  return (
    <div className="space-y-6">
      {/* Smart Analysis & Contextual Learning Suggestions */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Trợ lý Lịch trình Thông minh
            </span>
            <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
              Tình trạng Ôn tập & Hạn mục tiêu hôm nay
            </h2>
          </div>

          {/* Web Notification Permission Action */}
          <div className="flex items-center gap-2">
            {notificationPermission === "granted" ? (
              <button
                onClick={sendTestNotification}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {testNotificationSent ? "Đã gửi thông báo!" : "Thử thông báo"}
                </span>
              </button>
            ) : (
              <button
                onClick={requestNotificationPermission}
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Bật thông báo hệ điều hành</span>
              </button>
            )}
          </div>
        </div>

        {/* Due Cards Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-lg border border-zinc-200/90 bg-zinc-50/60">
            <span className="text-xs text-zinc-500">Thẻ đến hạn ôn hôm nay</span>
            <div className="mt-1 font-mono text-2xl font-bold text-zinc-900">
              {dueCards.length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Thuật toán lặp lại ngắt quãng Spaced Repetition
            </p>
          </div>

          {dueCardsBySubject.map(({ subject, count }) => (
            <div
              key={subject.id}
              className="p-4 rounded-lg border border-zinc-200/90 bg-zinc-50/60 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-zinc-500 line-clamp-1">{subject.name}</span>
                <div className="mt-1 font-mono text-2xl font-bold text-zinc-900">
                  {count} <span className="text-xs font-normal text-zinc-400">thẻ</span>
                </div>
              </div>
              {count > 0 && (
                <button
                  onClick={() => onNavigateToStudy(subject.id)}
                  className="mt-2 text-xs font-medium text-zinc-800 hover:text-black underline text-left cursor-pointer"
                >
                  Ôn ngay môn này →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Exam Countdown & Personal Daily Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Exam Countdown */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-semibold text-zinc-900">
              Đếm ngược Kỳ thi & Đồ án
            </h3>
            <Calendar className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-3">
            {exams.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">
                Chưa có ngày thi nào được thiết lập.
              </p>
            ) : (
              exams.map(({ subject, daysLeft }) => {
                const isUrgent = daysLeft <= 14;
                return (
                  <div
                    key={subject.id}
                    className={`p-3.5 rounded-lg border flex items-center justify-between ${
                      isUrgent
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-zinc-200/80 bg-zinc-50/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-zinc-900">{subject.name}</span>
                        <span className="text-zinc-400 font-mono">({subject.code})</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Ngày thi: {subject.targetExamDate}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-mono text-lg font-bold ${
                          daysLeft <= 7
                            ? "text-rose-600"
                            : isUrgent
                            ? "text-amber-700"
                            : "text-zinc-800"
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft} ngày` : "Hôm nay"}
                      </div>
                      <span className="text-[10px] text-zinc-400">còn lại</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60 text-xs text-zinc-600 space-y-1">
            <strong className="text-zinc-800 block">Lời khuyên chu kỳ ôn tập:</strong>
            <span>
              Trước ngày thi 2 tuần, hãy tập trung ôn luyện câu hỏi mức <strong>Phân tích (4)</strong> và <strong>Đánh giá (5)</strong> để củng cố khả năng làm bài tự luận & tình huống thực tế.
            </span>
          </div>
        </div>

        {/* Right Column: Personal Study Schedule & Reminders */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">
                Lịch trình Học tập Cá nhân
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Thiết lập khung giờ lý tưởng để duy trì thói quen học tập kỷ luật
              </p>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? "Đóng" : "Thêm lịch"}</span>
            </button>
          </div>

          {/* Add Reminder Form */}
          {isAdding && (
            <form
              onSubmit={handleAddReminder}
              className="p-4 rounded-lg border border-zinc-200 bg-zinc-50/70 space-y-3 text-xs animate-in fade-in"
            >
              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Tiêu đề buổi học:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Ôn 15 thẻ DSA & Làm trắc nghiệm Bloom"
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    Khung giờ:
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    Các ngày trong tuần:
                  </label>
                  <div className="flex items-center gap-1">
                    {dayNames.map((name, idx) => {
                      const isSelected = newDays.includes(idx);
                      return (
                        <button
                          type="button"
                          key={name}
                          onClick={() => toggleDay(idx)}
                          className={`w-7 h-7 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-zinc-900 text-white"
                              : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Lưu lịch trình
                </button>
              </div>
            </form>
          )}

          {/* List of Reminders */}
          <div className="space-y-2.5">
            {reminders.map((rem) => {
              const daysStr = rem.daysOfWeek
                .map((d) => dayNames[d])
                .join(" · ");

              return (
                <div
                  key={rem.id}
                  className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    rem.enabled
                      ? "border-zinc-200 bg-white"
                      : "border-zinc-200/60 bg-zinc-50/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                        rem.enabled
                          ? "bg-zinc-900 border-zinc-900 text-white"
                          : "border-zinc-300 bg-white"
                      }`}
                      title={rem.enabled ? "Tắt lịch này" : "Bật lịch này"}
                    >
                      {rem.enabled && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900 leading-snug">
                        {rem.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                        <span className="font-mono font-medium text-zinc-800">
                          {rem.time}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{daysStr}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-50 transition-colors cursor-pointer"
                    title="Xóa lịch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
