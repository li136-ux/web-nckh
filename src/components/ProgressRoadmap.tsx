import React, { useState } from "react";
import { AppState, BLOOM_LEVELS, BloomLevel, Subject } from "../types";
import { 
  GitCommit, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar,
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface ProgressRoadmapProps {
  state: AppState;
  onNavigateToStudy: (subjectId: string, bloomLevel?: BloomLevel) => void;
}

export const ProgressRoadmap: React.FC<ProgressRoadmapProps> = ({
  state,
  onNavigateToStudy,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");

  const { subjects, flashcards, quizzes, quizAttempts, studyLogs } = state;

  // Filter items by subject if needed
  const activeFlashcards = selectedSubjectId === "all"
    ? flashcards
    : flashcards.filter((f) => f.subjectId === selectedSubjectId);

  const activeQuizzes = selectedSubjectId === "all"
    ? quizzes
    : quizzes.filter((q) => q.subjectId === selectedSubjectId);

  // Calculate mastery percentages per Bloom level (1..6)
  // Mastery = 50% flashcard in box >= 3 + 50% quiz accuracy
  const bloomStats = ([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
    const cards = activeFlashcards.filter((f) => f.bloomLevel === lvl);
    const masteredCards = cards.filter((f) => f.box >= 3).length;
    const cardPct = cards.length > 0 ? (masteredCards / cards.length) * 100 : 0;

    let quizCorrect = 0;
    let quizTotal = 0;
    quizAttempts.forEach((att) => {
      if (selectedSubjectId === "all" || att.subjectId === selectedSubjectId) {
        const b = att.bloomBreakdown?.[lvl];
        if (b) {
          quizCorrect += b.correct;
          quizTotal += b.total;
        }
      }
    });

    const quizPct = quizTotal > 0 ? (quizCorrect / quizTotal) * 100 : cardPct; // fallback
    const compositeScore = Math.round((cardPct * 0.6) + (quizPct * 0.4));

    return {
      level: lvl,
      info: BLOOM_LEVELS[lvl],
      totalCards: cards.length,
      masteredCards,
      cardPct: Math.round(cardPct),
      quizTotal,
      quizCorrect,
      masteryScore: Math.min(100, compositeScore),
    };
  });

  // Calculate Radar Polygon Points for SVG
  const radarCenter = { x: 160, y: 160 };
  const radarRadius = 110;
  const numAxes = 6;

  // Generate web background rings
  const ringLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Coordinates for the 6 axes
  const getAxisPoint = (index: number, factor: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    return {
      x: radarCenter.x + radarRadius * factor * Math.cos(angle),
      y: radarCenter.y + radarRadius * factor * Math.sin(angle),
    };
  };

  const radarPolygonPoints = bloomStats
    .map((stat, i) => {
      const factor = Math.max(0.1, stat.masteryScore / 100);
      const pt = getAxisPoint(i, factor);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  // Leitner Boxes Distribution
  const leitnerDist = [1, 2, 3, 4, 5].map((box) => {
    const count = activeFlashcards.filter((f) => f.box === box).length;
    const pct = activeFlashcards.length > 0 ? Math.round((count / activeFlashcards.length) * 100) : 0;
    return { box, count, pct };
  });

  // Daily Streak
  const today = new Date().toISOString().split("T")[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const log = studyLogs.find((l) => l.date === dateStr);
    return {
      date: dateStr,
      dayName: d.toLocaleDateString("vi-VN", { weekday: "short" }),
      cards: log?.cardsReviewed || 0,
      quizzes: log?.quizzesCompleted || 0,
      minutes: log?.minutes || 0,
    };
  });

  const totalMasteredOverall = flashcards.filter((f) => f.box >= 4).length;
  const totalCardsOverall = flashcards.length;
  const overallMasteryPct = totalCardsOverall > 0 ? Math.round((totalMasteredOverall / totalCardsOverall) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Subject Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-zinc-500 shrink-0">Lộ trình theo môn:</span>
          <button
            onClick={() => setSelectedSubjectId("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedSubjectId === "all" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Tất cả môn học
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedSubjectId === s.id ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Global summary count */}
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>Thành thạo chuyên sâu: <strong className="font-mono text-zinc-800">{overallMasteryPct}%</strong></span>
          <span aria-hidden="true">·</span>
          <span>Tổng số thẻ: <strong className="font-mono text-zinc-800">{activeFlashcards.length}</strong></span>
        </div>
      </div>

      {/* Two Column Visual Overview: Bloom Radar Chart & Leitner Memory Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bloom Radar / Spider Chart */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Biểu đồ Radar Năng lực Thang Bloom
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Đánh giá đa chiều mức độ thông hiểu từ Nhớ đến Sáng tạo
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                6 Cấp độ
              </span>
            </div>

            {/* Radar SVG Visualizer */}
            <div className="relative flex items-center justify-center py-4">
              <svg width="320" height="320" className="overflow-visible select-none">
                {/* Background Concentric Polygon Rings */}
                {ringLevels.map((lvl) => {
                  const pts = Array.from({ length: numAxes }, (_, i) => {
                    const p = getAxisPoint(i, lvl);
                    return `${p.x},${p.y}`;
                  }).join(" ");
                  return (
                    <polygon
                      key={lvl}
                      points={pts}
                      fill="none"
                      stroke="#e4e4e7"
                      strokeWidth="1"
                      strokeDasharray={lvl === 1 ? undefined : "3 3"}
                    />
                  );
                })}

                {/* 6 Radial Axes Lines */}
                {Array.from({ length: numAxes }, (_, i) => {
                  const p = getAxisPoint(i, 1.0);
                  return (
                    <line
                      key={i}
                      x1={radarCenter.x}
                      y1={radarCenter.y}
                      x2={p.x}
                      y2={p.y}
                      stroke="#e4e4e7"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* User Mastery Area Polygon */}
                <polygon
                  points={radarPolygonPoints}
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />

                {/* Data Points and Axis Labels */}
                {bloomStats.map((stat, i) => {
                  const factor = Math.max(0.1, stat.masteryScore / 100);
                  const p = getAxisPoint(i, factor);
                  const labelPoint = getAxisPoint(i, 1.22);

                  return (
                    <g key={stat.level}>
                      {/* Vertex Circle */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill={stat.info.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Text Label on Axis Tip */}
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] font-medium fill-zinc-700"
                      >
                        {stat.info.viName} ({stat.masteryScore}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Quick Bloom Legend / Insights */}
          <div className="pt-3 border-t border-zinc-100 text-xs text-zinc-500 flex items-center justify-between">
            <span>
              Mức yếu nhất cần củng cố:{" "}
              <strong className="text-zinc-800">
                {bloomStats.reduce((prev, curr) => prev.masteryScore < curr.masteryScore ? prev : curr).info.viName}
              </strong>
            </span>
            <span className="font-mono text-zinc-600">
              Chuẩn đầu ra Bloom
            </span>
          </div>
        </div>

        {/* Right Column: Leitner Box Distribution & Activity Streak */}
        <div className="lg:col-span-6 space-y-6">
          {/* Leitner Box Progression */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Phân bố Trí nhớ Lặp lại ngắt quãng (Leitner Boxes)
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Thẻ được chuyển dần từ Hộp 1 (mới học) sang Hộp 5 (trí nhớ vĩnh viễn)
                </p>
              </div>
              <Layers className="w-4 h-4 text-zinc-400" />
            </div>

            <div className="mt-4 space-y-3">
              {leitnerDist.map(({ box, count, pct }) => {
                const boxLabels = [
                  "Hộp 1 · Mới học (Hàng ngày)",
                  "Hộp 2 · Đang ghi nhớ (3 ngày)",
                  "Hộp 3 · Nhớ tốt (1 tuần)",
                  "Hộp 4 · Vững vàng (2 tuần)",
                  "Hộp 5 · Trí nhớ dài hạn (1 tháng)",
                ];
                return (
                  <div key={box} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-700">{boxLabels[box - 1]}</span>
                      <span className="font-mono text-zinc-500">
                        {count} thẻ ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-zinc-800 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Activity Heatmap */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-900">Hoạt động học tập 7 ngày qua</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {studyLogs.reduce((acc, l) => acc + l.minutes, 0)} phút tích lũy
              </span>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-center">
              {last7Days.map((day) => {
                const hasActivity = day.cards > 0 || day.quizzes > 0;
                return (
                  <div
                    key={day.date}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
                      hasActivity
                        ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                        : "border-zinc-200/60 bg-zinc-50/50 text-zinc-500"
                    }`}
                  >
                    <span className="font-medium">{day.dayName}</span>
                    <div className="my-1.5 font-mono text-base font-bold">
                      {day.cards + day.quizzes}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {day.minutes > 0 ? `${day.minutes}p` : "0p"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sơ đồ Lộ trình Học tập (Roadmap Flowchart / Milestone Tree) */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">
              Sơ đồ Lộ trình Năng lực Học tập (Bloom Milestones Roadmap)
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Hành trình chuyển hóa kiến thức từ cấp độ ghi nhớ nền tảng đến sáng tạo giải pháp
            </p>
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            Trạm 1/6 → Trạm 6/6
          </span>
        </div>

        {/* The Interactive Milestone Nodes Flow */}
        <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-200 space-y-8">
          {bloomStats.map((station, idx) => {
            const isCompleted = station.masteryScore >= 80;
            const isInProgress = station.masteryScore > 0 && station.masteryScore < 80;
            const isNotStarted = station.masteryScore === 0;

            return (
              <div key={station.level} className="relative group">
                {/* Milestone Node Badge */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : isInProgress
                      ? "border-zinc-900 bg-white text-zinc-900 ring-4 ring-zinc-100"
                      : "border-zinc-300 bg-white text-zinc-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="font-mono text-xs font-bold">{station.level}</span>
                  )}
                </div>

                {/* Milestone Content Card */}
                <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/40 p-4 sm:p-5 hover:border-zinc-300 hover:bg-white transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className="font-semibold text-zinc-900 text-sm"
                          style={{ color: station.info.color }}
                        >
                          Trạm {station.level}: Cấp độ {station.info.viName} ({station.info.enName})
                        </span>
                        <span aria-hidden="true" className="text-zinc-300">·</span>
                        <span className="text-zinc-500 font-mono">
                          {station.totalCards} thẻ · {station.quizTotal} lượt trắc nghiệm
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                        {station.info.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-zinc-900">
                          {station.masteryScore}%
                        </div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                          Độ thuần thục
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateToStudy(selectedSubjectId, station.level)}
                        className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <span>Luyện tập</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Verbs and Focus Tags (Zero-pill text) */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 pt-2 border-t border-zinc-200/50">
                    <span className="font-medium text-zinc-700">Động từ hành động:</span>
                    {station.info.actionVerbs.map((verb, vIdx) => (
                      <React.Fragment key={verb}>
                        <span>{verb}</span>
                        {vIdx < station.info.actionVerbs.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${station.masteryScore}%`,
                        backgroundColor: station.info.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
