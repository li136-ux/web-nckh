import React, { useState } from "react";
import { AppState, Subject, Flashcard, QuizQuestion, BloomLevel, BLOOM_LEVELS } from "../types";
import { sounds } from "../services/audio";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Layers, 
  CheckSquare, 
  Sparkles, 
  Calendar,
  X,
  FileText
} from "lucide-react";

interface SubjectManagerProps {
  state: AppState;
  onUpdateSubjects: (subjects: Subject[]) => void;
  onAddFlashcard: (card: Flashcard) => void;
  onAddQuiz: (quiz: QuizQuestion) => void;
  onNavigateToTab: (tab: "flashcards" | "quizzes", subjectId: string) => void;
}

export const SubjectManager: React.FC<SubjectManagerProps> = ({
  state,
  onUpdateSubjects,
  onAddFlashcard,
  onAddQuiz,
  onNavigateToTab,
}) => {
  const { subjects, flashcards, quizzes } = state;

  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubCat, setNewSubCat] = useState("Khoa học & Kỹ thuật");
  const [newSubDesc, setNewSubDesc] = useState("");
  const [newSubExamDate, setNewSubExamDate] = useState("");

  // Card modal state
  const [cardModalSubjectId, setCardModalSubjectId] = useState<string | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [newCardHint, setNewCardHint] = useState("");
  const [newCardBloom, setNewCardBloom] = useState<BloomLevel>(1);

  // Quiz modal state
  const [quizModalSubjectId, setQuizModalSubjectId] = useState<string | null>(null);
  const [newQuizQuestion, setNewQuizQuestion] = useState("");
  const [newQuizBloom, setNewQuizBloom] = useState<BloomLevel>(2);
  const [newQuizOpt1, setNewQuizOpt1] = useState("");
  const [newQuizOpt2, setNewQuizOpt2] = useState("");
  const [newQuizOpt3, setNewQuizOpt3] = useState("");
  const [newQuizOpt4, setNewQuizOpt4] = useState("");
  const [correctOptIndex, setCorrectOptIndex] = useState<number>(0);
  const [newQuizExplanation, setNewQuizExplanation] = useState("");

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      code: newSubCode.trim().toUpperCase(),
      category: newSubCat,
      description: newSubDesc.trim() || "Chưa có mô tả môn học.",
      targetExamDate: newSubExamDate || undefined,
      flashcardsCount: 0,
      quizzesCount: 0,
      colorScheme: "#4f46e5",
    };

    onUpdateSubjects([...subjects, newSub]);
    setNewSubName("");
    setNewSubCode("");
    setNewSubDesc("");
    setNewSubExamDate("");
    setIsAddingSubject(false);
    sounds.playSuccess();
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardModalSubjectId || !newCardFront.trim() || !newCardBack.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      subjectId: cardModalSubjectId,
      bloomLevel: newCardBloom,
      front: newCardFront.trim(),
      back: newCardBack.trim(),
      hint: newCardHint.trim() || undefined,
      box: 1,
      nextReviewDate: today,
      repetitions: 0,
      easeFactor: 2.5,
    };

    onAddFlashcard(newCard);
    setNewCardFront("");
    setNewCardBack("");
    setNewCardHint("");
    setCardModalSubjectId(null);
    sounds.playSuccess();
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizModalSubjectId || !newQuizQuestion.trim()) return;

    const optionsTexts = [newQuizOpt1, newQuizOpt2, newQuizOpt3, newQuizOpt4].filter(t => t.trim());
    if (optionsTexts.length < 2) {
      alert("Cần nhập ít nhất 2 phương án trả lời.");
      return;
    }

    const options = optionsTexts.map((text, idx) => ({
      id: `opt-${Date.now()}-${idx}`,
      text: text.trim(),
      isCorrect: idx === correctOptIndex,
    }));

    const newQuiz: QuizQuestion = {
      id: `q-${Date.now()}`,
      subjectId: quizModalSubjectId,
      bloomLevel: newQuizBloom,
      question: newQuizQuestion.trim(),
      options,
      generalExplanation: newQuizExplanation.trim() || "Giải thích dựa trên tài liệu chuẩn của môn học.",
      bloomRationale: `Câu hỏi đánh giá năng lực mức ${BLOOM_LEVELS[newQuizBloom].viName} theo phân loại Bloom.`,
    };

    onAddQuiz(newQuiz);
    setNewQuizQuestion("");
    setNewQuizOpt1("");
    setNewQuizOpt2("");
    setNewQuizOpt3("");
    setNewQuizOpt4("");
    setNewQuizExplanation("");
    setQuizModalSubjectId(null);
    sounds.playSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">
            Học phần & Danh mục Môn học Đại học
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Quản lý các môn học, xây dựng ngân hàng flashcard và trắc nghiệm chuẩn Bloom
          </p>
        </div>

        <button
          onClick={() => setIsAddingSubject(!isAddingSubject)}
          className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm môn học mới</span>
        </button>
      </div>

      {/* Add Subject Inline Form */}
      {isAddingSubject && (
        <form
          onSubmit={handleCreateSubject}
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-semibold text-zinc-900">Tạo môn học mới</h3>
            <button
              type="button"
              onClick={() => setIsAddingSubject(false)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Mã môn học:</label>
              <input
                type="text"
                value={newSubCode}
                onChange={(e) => setNewSubCode(e.target.value)}
                placeholder="VD: CS301"
                className="w-full rounded-md border border-zinc-200 p-2 font-mono"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 mb-1">Tên môn học:</label>
              <input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="VD: An toàn Thông tin & Mật mã học"
                className="w-full rounded-md border border-zinc-200 p-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Khối ngành:</label>
              <input
                type="text"
                value={newSubCat}
                onChange={(e) => setNewSubCat(e.target.value)}
                className="w-full rounded-md border border-zinc-200 p-2"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Ngày thi / Đồ án mục tiêu:</label>
              <input
                type="date"
                value={newSubExamDate}
                onChange={(e) => setNewSubExamDate(e.target.value)}
                className="w-full rounded-md border border-zinc-200 p-2 font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-medium text-zinc-700 mb-1">Mô tả học phần:</label>
            <textarea
              value={newSubDesc}
              onChange={(e) => setNewSubDesc(e.target.value)}
              rows={2}
              placeholder="Nội dung trọng tâm và chuẩn đầu ra môn học..."
              className="w-full rounded-md border border-zinc-200 p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setIsAddingSubject(false)}
              className="px-3 py-1.5 rounded-md border border-zinc-200 text-xs text-zinc-600 hover:bg-zinc-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-zinc-900 text-xs font-medium text-white hover:bg-zinc-800"
            >
              Tạo môn học
            </button>
          </div>
        </form>
      )}

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const cardsForSub = flashcards.filter((f) => f.subjectId === sub.id);
          const quizzesForSub = quizzes.filter((q) => q.subjectId === sub.id);

          return (
            <div
              key={sub.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                  <span className="font-mono font-medium text-zinc-800">{sub.code}</span>
                  <span>{sub.category}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">{sub.name}</h3>
                <p className="mt-1 text-xs text-zinc-600 leading-relaxed line-clamp-2">
                  {sub.description}
                </p>

                {sub.targetExamDate && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Ngày thi mục tiêu: <strong className="font-mono text-zinc-800">{sub.targetExamDate}</strong></span>
                  </div>
                )}
              </div>

              {/* Counts & Action Row */}
              <div className="pt-3 border-t border-zinc-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-800 font-semibold">{cardsForSub.length}</span> thẻ flashcards
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-zinc-800 font-semibold">{quizzesForSub.length}</span> câu hỏi Bloom
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onNavigateToTab("flashcards", sub.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Ôn Flashcard</span>
                  </button>

                  <button
                    onClick={() => onNavigateToTab("quizzes", sub.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Thi trắc nghiệm</span>
                  </button>

                  <button
                    onClick={() => setCardModalSubjectId(sub.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer ml-auto"
                    title="Thêm thẻ cho môn này"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thẻ mới</span>
                  </button>

                  <button
                    onClick={() => setQuizModalSubjectId(sub.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                    title="Thêm câu hỏi trắc nghiệm"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Câu hỏi Bloom</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Flashcard with Bloom Level selection */}
      {cardModalSubjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Thêm Thẻ Flashcard Mới
              </h3>
              <button
                onClick={() => setCardModalSubjectId(null)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Cấp độ Thang Bloom:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
                    const info = BLOOM_LEVELS[lvl];
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setNewCardBloom(lvl)}
                        className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                          newCardBloom === lvl
                            ? "border-zinc-900 bg-zinc-900 text-white font-medium"
                            : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="text-[11px] font-mono">Mức {lvl}</div>
                        <div className="truncate font-semibold">{info.viName}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">
                  {BLOOM_LEVELS[newCardBloom].description}
                </p>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Mặt trước (Câu hỏi / Thuật ngữ):
                </label>
                <textarea
                  rows={2}
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  placeholder="Nhập câu hỏi hoặc khái niệm cần ghi nhớ..."
                  className="w-full rounded-md border border-zinc-200 p-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Mặt sau (Giải nghĩa chi tiết):
                </label>
                <textarea
                  rows={3}
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  placeholder="Nhập câu trả lời hoặc phân tích chuyên sâu..."
                  className="w-full rounded-md border border-zinc-200 p-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Gợi ý tư duy (Không bắt buộc):
                </label>
                <input
                  type="text"
                  value={newCardHint}
                  onChange={(e) => setNewCardHint(e.target.value)}
                  placeholder="Gợi ý phương pháp hoặc từ khóa liên quan..."
                  className="w-full rounded-md border border-zinc-200 p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setCardModalSubjectId(null)}
                  className="px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 cursor-pointer"
                >
                  Thêm thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Quiz Question with Bloom Level */}
      {quizModalSubjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-zinc-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Tạo Câu Hỏi Trắc Nghiệm Thang Bloom
              </h3>
              <button
                onClick={() => setQuizModalSubjectId(null)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Cấp độ nhận thức Bloom:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
                    const info = BLOOM_LEVELS[lvl];
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setNewQuizBloom(lvl)}
                        className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                          newQuizBloom === lvl
                            ? "border-zinc-900 bg-zinc-900 text-white font-medium"
                            : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="text-[11px] font-mono">Mức {lvl}</div>
                        <div className="truncate font-semibold">{info.viName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Câu hỏi:</label>
                <textarea
                  rows={2}
                  value={newQuizQuestion}
                  onChange={(e) => setNewQuizQuestion(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full rounded-md border border-zinc-200 p-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-zinc-700">
                  4 Phương án (Chọn nút tròn để chỉ định đáp án đúng):
                </label>
                {[
                  { val: newQuizOpt1, set: setNewQuizOpt1, idx: 0 },
                  { val: newQuizOpt2, set: setNewQuizOpt2, idx: 1 },
                  { val: newQuizOpt3, set: setNewQuizOpt3, idx: 2 },
                  { val: newQuizOpt4, set: setNewQuizOpt4, idx: 3 },
                ].map(({ val, set, idx }) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={correctOptIndex === idx}
                      onChange={() => setCorrectOptIndex(idx)}
                      className="cursor-pointer"
                    />
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      placeholder={`Phương án ${["A", "B", "C", "D"][idx]}`}
                      className="w-full rounded-md border border-zinc-200 p-1.5"
                      required={idx < 2}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Giải thích đáp án chuyên sâu:
                </label>
                <textarea
                  rows={2}
                  value={newQuizExplanation}
                  onChange={(e) => setNewQuizExplanation(e.target.value)}
                  placeholder="Giải thích vì sao đáp án đúng và lý do theo thang Bloom..."
                  className="w-full rounded-md border border-zinc-200 p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setQuizModalSubjectId(null)}
                  className="px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 cursor-pointer"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
