import { AppState, Subject, Flashcard, QuizQuestion, StudyReminder } from "../types";

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "cnxhkh",
    name: "Chủ nghĩa Xã hội Khoa học",
    code: "MLN103",
    category: "Lý luận Chính trị & Triết học",
    description: "Nghiên cứu những quy luật, tính quy luật chính trị - xã hội của quá trình chuyển biến từ chủ nghĩa tư bản lên chủ nghĩa xã hội và chủ nghĩa cộng sản.",
    targetExamDate: "2026-11-20",
    flashcardsCount: 12,
    quizzesCount: 8,
    colorScheme: "#dc2626",
  },
  {
    id: "dsa",
    name: "Cấu trúc Dữ liệu & Giải thuật",
    code: "CS201",
    category: "Khoa học Máy tính",
    description: "Nắm vững mảng, danh sách liên kết, cây nhị phân, đồ thị và kỹ thuật tối ưu hóa độ phức tạp thời gian O(n).",
    targetExamDate: "2026-11-20",
    flashcardsCount: 12,
    quizzesCount: 8,
    colorScheme: "#0284c7",
  },
  {
    id: "ai_ml",
    name: "Trí tuệ Nhân tạo & Học máy",
    code: "AI302",
    category: "Công nghệ Thông tin",
    description: "Nguyên lý Gradient Descent, mạng nơ-ron sâu, mô hình Transformer Attention và kỹ thuật chống Overfitting.",
    targetExamDate: "2026-12-05",
    flashcardsCount: 10,
    quizzesCount: 7,
    colorScheme: "#7c3aed",
  },
  {
    id: "micro_econ",
    name: "Kinh tế Vi mô & Lý thuyết Trò chơi",
    code: "ECO101",
    category: "Kinh tế & Quản trị",
    description: "Độ co giãn của cầu, cân bằng thị trường, cạnh tranh hoàn hảo, độc quyền và cân bằng Nash trong kinh doanh.",
    targetExamDate: "2026-11-15",
    flashcardsCount: 10,
    quizzesCount: 6,
    colorScheme: "#d97706",
  },
  {
    id: "applied_stats",
    name: "Xác suất & Thống kê Ứng dụng",
    code: "MATH204",
    category: "Toán học & Khoa học Dữ liệu",
    description: "Phân phối chuẩn Gauss, định lý giới hạn trung tâm, kiểm định giả thuyết thống kê p-value và hồi quy tuyến tính.",
    targetExamDate: "2026-11-30",
    flashcardsCount: 8,
    quizzesCount: 6,
    colorScheme: "#0d9488",
  },
];

const today = new Date().toISOString().split("T")[0];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  // --- Môn Chủ nghĩa Xã hội Khoa học ---
  {
    id: "fc-cnxhkh-1",
    subjectId: "cnxhkh",
    bloomLevel: 1, // Nhớ
    front: "Chủ nghĩa xã hội khoa học được hiểu theo máy nghĩa ?",
    back: "Chủ nghĩa xã hội khoa học được hiểu theo 2 nghĩa:\n\n1. Theo nghĩa rộng: Là chủ nghĩa Mác - Lênin nói chung, luận giải từ các góc độ triết học, kinh tế và chính trị - xã hội về sự diệt vong tất yếu của chủ nghĩa tư bản và sự thắng lợi tất yếu của chủ nghĩa xã hội.\n\n2. Theo nghĩa hẹp: Là một trong ba bộ phận cấu thành chủ nghĩa Mác - Lênin (cùng với Triết học Mác - Lênin và Kinh tế chính trị Mác - Lênin), nghiên cứu trực tiếp về sứ mệnh lịch sử của giai cấp công nhân và quy luật của cách mạng xã hội chủ nghĩa.",
    hint: "Được tiếp cận theo 2 góc độ: nghĩa rộng (toàn bộ học thuyết Mác - Lênin) và nghĩa hẹp (một trong 3 bộ phận cấu thành).",
    tags: ["CNXHKH", "Khái niệm", "Lý luận chính trị"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.5,
  },
  // --- Môn DSA: 6 Bloom levels ---
  {
    id: "fc-dsa-1",
    subjectId: "dsa",
    bloomLevel: 1, // Nhớ
    front: "Định nghĩa ký hiệu Big O trong phân tích thuật toán là gì?",
    back: "Ký hiệu Big O (O) biểu diễn chặn trên (upper bound) của thời gian chạy hoặc không gian bộ nhớ của thuật toán trong trường hợp xấu nhất theo kích thước đầu vào n.",
    hint: "Biểu diễn trường hợp xấu nhất (worst-case scenario).",
    tags: ["Big O", "Complexity", "Lý thuyết"],
    box: 2,
    nextReviewDate: today,
    repetitions: 2,
    easeFactor: 2.5,
  },
  {
    id: "fc-dsa-2",
    subjectId: "dsa",
    bloomLevel: 2, // Hiểu
    front: "Giải thích sự khác biệt bản chất giữa Mảng (Array) và Danh sách liên kết (Linked List)?",
    back: "Mảng lưu trữ các phần tử ở các ô nhớ liền kề (truy cập ngẫu nhiên O(1), chèn/xóa O(n)). Danh sách liên kết lưu trữ các nút phân tán nối bằng con trỏ (truy cập tuần tự O(n), chèn/xóa ở đầu danh sách O(1)).",
    hint: "Liên quan đến cách cấp phát bộ nhớ vật lý và tốc độ truy cập ngẫu nhiên.",
    tags: ["Array", "Linked List", "Memory"],
    box: 1,
    nextReviewDate: today,
    repetitions: 1,
    easeFactor: 2.5,
  },
  {
    id: "fc-dsa-3",
    subjectId: "dsa",
    bloomLevel: 3, // Vận dụng
    front: "Áp dụng cấu trúc dữ liệu nào để kiểm tra tính hợp lệ của cặp dấu ngoặc `{[()]}`, và thuật toán hoạt động thế nào?",
    back: "Sử dụng Ngăn xếp (Stack). Duyệt qua chuỗi: gặp ngoặc mở thì push vào stack; gặp ngoặc đóng thì pop phần tử đỉnh ra và đối chiếu khớp cặp. Nếu stack rỗng khi gặp ngoặc đóng hoặc còn dư khi hết chuỗi thì không hợp lệ.",
    hint: "Nguyên lý vào sau ra trước (LIFO).",
    tags: ["Stack", "Algorithm", "Implementation"],
    box: 3,
    nextReviewDate: today,
    repetitions: 3,
    easeFactor: 2.6,
  },
  {
    id: "fc-dsa-4",
    subjectId: "dsa",
    bloomLevel: 4, // Phân tích
    front: "Phân tích vì sao QuickSort có độ phức tạp trung bình là O(n log n) nhưng lại bị suy thoái thành O(n²) trong trường hợp xấu nhất?",
    back: "Nếu pivot được chọn luôn là phần tử nhỏ nhất hoặc lớn nhất (ví dụ mảng đã sắp xếp và chọn phần tử cuối), cây phân hoạch mất cân bằng hoàn toàn thành chuỗi n tầng, mỗi tầng tốn O(n) so sánh => Tổng thời gian O(n²).",
    hint: "Xem xét việc chọn điểm chốt (pivot) và độ cân bằng của cây phân hoạch.",
    tags: ["Sorting", "QuickSort", "Analysis"],
    box: 2,
    nextReviewDate: today,
    repetitions: 2,
    easeFactor: 2.4,
  },
  {
    id: "fc-dsa-5",
    subjectId: "dsa",
    bloomLevel: 5, // Đánh giá
    front: "Khi thiết kế hệ thống tìm đường đi ngắn nhất với đồ thị có trọng số cạnh âm nhưng không có chu trình âm, đánh giá giữa Dijkstra và Bellman-Ford?",
    back: "Dijkstra hoạt động theo thuật toán tham lam (greedy) nên cho kết quả SAI khi có cạnh trọng số âm. Bellman-Ford cập nhật n-1 lần qua tất cả các cạnh, chấp nhận trọng số âm và phát hiện chu trình âm, dù độ phức tạp O(V*E) chậm hơn O((V+E) log V). Do đó Bellman-Ford bắt buộc phải dùng.",
    hint: "Dijkstra dựa trên giả định tham lam không xét lại đỉnh đã chốt.",
    tags: ["Graph", "Dijkstra", "Bellman-Ford", "Evaluation"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.3,
  },
  {
    id: "fc-dsa-6",
    subjectId: "dsa",
    bloomLevel: 6, // Sáng tạo
    front: "Thiết kế một cấu trúc dữ liệu LRU Cache (Least Recently Used) hỗ trợ thao tác get(key) và put(key, value) đều đạt O(1)?",
    back: "Kết hợp Hash Map (Bảng băm) và Doubly Linked List (Danh sách liên kết đôi). Hash Map lưu {key: NodePointer} để tra cứu O(1). Danh sách liên kết đôi quản lý thứ tự truy cập: phần tử vừa dùng được đưa lên đầu, khi đầy bộ nhớ xóa nút ở đuôi O(1).",
    hint: "Kết hợp 2 cấu trúc dữ liệu: một cho tra cứu nhanh, một cho thứ tự thời gian.",
    tags: ["System Design", "LRU Cache", "Creation"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.5,
  },

  // --- Môn AI & ML: 6 Bloom levels ---
  {
    id: "fc-ai-1",
    subjectId: "ai_ml",
    bloomLevel: 1, // Nhớ
    front: "Hàm mất mát (Loss Function) trong Học máy là gì?",
    back: "Là hàm toán học đo lường mức độ sai lệch giữa giá trị dự đoán của mô hình (y_pred) và giá trị nhãn thực tế (y_true) trên tập dữ liệu huấn luyện.",
    hint: "Thước đo sự sai lệch dự đoán.",
    tags: ["Loss Function", "ML Basics"],
    box: 3,
    nextReviewDate: today,
    repetitions: 3,
    easeFactor: 2.6,
  },
  {
    id: "fc-ai-2",
    subjectId: "ai_ml",
    bloomLevel: 2, // Hiểu
    front: "Giải thích hiện tượng Overfitting (Quá khớp) và biểu hiện của nó qua đồ thị Loss?",
    back: "Overfitting xảy ra khi mô hình học thuộc lòng cả nhiễu của dữ liệu huấn luyện thay vì khái quát hóa quy luật. Biểu hiện: Training loss liên tục giảm gần 0, nhưng Validation loss bắt đầu tăng ngược trở lại.",
    hint: "Tốt trên tập train nhưng kém trên tập test/validation.",
    tags: ["Overfitting", "Generalization"],
    box: 2,
    nextReviewDate: today,
    repetitions: 2,
    easeFactor: 2.5,
  },
  {
    id: "fc-ai-3",
    subjectId: "ai_ml",
    bloomLevel: 3, // Vận dụng
    front: "Áp dụng kỹ thuật Early Stopping để kiểm soát quá trình huấn luyện mạng nơ-ron như thế nào?",
    back: "Theo dõi giá trị validation loss sau mỗi epoch. Nếu validation loss không giảm (hoặc tăng) sau một số epoch định trước (patience, ví dụ 5 epoch), lập tức dừng huấn luyện và khôi phục lại trọng số ở epoch có validation loss tốt nhất.",
    hint: "Cơ chế theo dõi validation loss và tham số patience.",
    tags: ["Regularization", "Early Stopping"],
    box: 2,
    nextReviewDate: today,
    repetitions: 1,
    easeFactor: 2.5,
  },
  {
    id: "fc-ai-4",
    subjectId: "ai_ml",
    bloomLevel: 4, // Phân tích
    front: "Phân tích sự khác biệt cơ bản giữa cơ chế Self-Attention trong Transformer so với mạng RNN truyền thống khi xử lý chuỗi?",
    back: "RNN xử lý tuần tự từng token theo thời gian (O(n) bước, dễ biến mất đạo hàm khi chuỗi dài, không thể tính toán song song). Self-Attention tính toán ma trận tương quan giữa tất cả các cặp từ cùng một lúc (O(1) bước đường dẫn thông tin, tính toán song song GPU hoàn hảo).",
    hint: "Khả năng song song hóa và khoảng cách truyền gradient.",
    tags: ["Transformer", "Attention", "RNN"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.4,
  },
  {
    id: "fc-ai-5",
    subjectId: "ai_ml",
    bloomLevel: 5, // Đánh giá
    front: "Trong bài toán chẩn đoán ung thư hiếm gặp (tập dữ liệu mất cân bằng 99% âm tính, 1% dương tính), đánh giá vì sao Accuracy là chỉ số vô giá trị và nên chọn chỉ số nào?",
    back: "Mô hình ngây thơ luôn dự đoán 'Âm tính' sẽ đạt Accuracy 99% nhưng bỏ sót 100% bệnh nhân ung thư thực tế. Cần ưu tiên Recall (độ nhạy để hạn chế tối đa False Negative) và chỉ số F1-Score hoặc PR-AUC để đánh giá chính xác năng lực phát hiện ca bệnh.",
    hint: "Tập dữ liệu imbalanced; chi phí bỏ sót ca bệnh rất lớn.",
    tags: ["Metrics", "Evaluation", "Recall"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.5,
  },
  {
    id: "fc-ai-6",
    subjectId: "ai_ml",
    bloomLevel: 6, // Sáng tạo
    front: "Đề xuất chiến lược Retrieval-Augmented Generation (RAG) để khắc phục tình trạng ảo giác (hallucination) của LLM trong doanh nghiệp?",
    back: "Quy trình: 1. Vector hóa kho tài liệu nội bộ vào Vector Database (FAISS/Milvus). 2. Khi người dùng đặt câu hỏi, truy xuất Top-K đoạn trích liên quan bằng cosine similarity. 3. Nhúng đoạn trích vào Prompt kèm ràng buộc: 'Chỉ trả lời dựa trên ngữ cảnh được cung cấp, trích dẫn nguồn cụ thể'.",
    hint: "Kết hợp Vector Search, Embedding và Context Injection.",
    tags: ["RAG", "LLM", "Solution Architecture"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.5,
  },

  // --- Môn Kinh tế Vi mô ---
  {
    id: "fc-econ-1",
    subjectId: "micro_econ",
    bloomLevel: 1,
    front: "Quy luật Cung - Cầu phát biểu điều gì?",
    back: "Trong điều kiện các yếu tố khác không đổi, khi giá của một hàng hóa tăng thì lượng cầu giảm và lượng cung tăng; ngược lại khi giá giảm thì lượng cầu tăng và lượng cung giảm.",
    hint: "Mối quan hệ nghịch biến giữa giá và lượng cầu.",
    tags: ["Cung Cầu", "Kinh tế"],
    box: 3,
    nextReviewDate: today,
    repetitions: 2,
    easeFactor: 2.6,
  },
  {
    id: "fc-econ-2",
    subjectId: "micro_econ",
    bloomLevel: 2,
    front: "Giải thích ý nghĩa kinh tế khi Độ co giãn của cầu theo giá có trị tuyệt đối |Ed| > 1 (Cầu co giãn)?",
    back: "Nghĩa là tỷ lệ phần trăm thay đổi của lượng cầu lớn hơn tỷ lệ phần trăm thay đổi của giá. Khi giá tăng 1%, lượng cầu giảm hơn 1%. Trong trường hợp này, doanh nghiệp giảm giá sẽ làm TỔNG DOANH THU TĂNG.",
    hint: "Xem xét tác động đến Tổng doanh thu (TR = P * Q).",
    tags: ["Độ co giãn", "Doanh thu"],
    box: 2,
    nextReviewDate: today,
    repetitions: 1,
    easeFactor: 2.5,
  },
  {
    id: "fc-econ-3",
    subjectId: "micro_econ",
    bloomLevel: 3,
    front: "Vận dụng nguyên tắc Tối đa hóa lợi nhuận: Doanh nghiệp trong thị trường cạnh tranh hoàn hảo nên sản xuất tại sản lượng nào?",
    back: "Doanh nghiệp tối đa hóa lợi nhuận khi Doanh thu biên bằng Chi phí biên (MR = MC). Trong cạnh tranh hoàn hảo, vì P = MR nên điều kiện trở thành P = MC.",
    hint: "Điều kiện MR = MC.",
    tags: ["Cạnh tranh hoàn hảo", "MR = MC"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.5,
  },
  {
    id: "fc-econ-4",
    subjectId: "micro_econ",
    bloomLevel: 4,
    front: "Phân tích vì sao Độc quyền tự nhiên (Natural Monopoly) lại xuất hiện và chính phủ thường can thiệp bằng cách nào?",
    back: "Xuất hiện do tính kinh tế theo quy mô lớn (chi phí cố định khổng lồ, ví dụ lưới điện, cấp nước), khiến chi phí trung bình (ATC) liên tục giảm khi sản lượng tăng. Chính phủ can thiệp bằng cách định giá P = ATC (lợi nhuận kinh tế = 0) hoặc bù giá với P = MC.",
    hint: "Chi phí cố định ban đầu cực lớn và đường ATC dốc xuống.",
    tags: ["Độc quyền", "Chi phí trung bình", "Phân tích"],
    box: 1,
    nextReviewDate: today,
    repetitions: 0,
    easeFactor: 2.5,
  },
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  // --- Môn Chủ nghĩa Xã hội Khoa học ---
  {
    id: "q-cnxhkh-1",
    subjectId: "cnxhkh",
    bloomLevel: 1, // Nhớ
    question: "Chủ nghĩa xã hội khoa học được hiểu theo máy nghĩa ?",
    options: [
      { id: "opt-cn-1", text: "2 nghĩa (nghĩa rộng và nghĩa hẹp)", isCorrect: true, explanation: "Chính xác! Theo nghĩa rộng là toàn bộ chủ nghĩa Mác - Lênin; theo nghĩa hẹp là một trong ba bộ phận cấu thành chủ nghĩa Mác - Lênin." },
      { id: "opt-cn-2", text: "1 nghĩa duy nhất (chỉ là môn khoa học chính trị)", isCorrect: false, explanation: "Chưa đầy đủ. Chủ nghĩa xã hội khoa học còn được hiểu theo nghĩa rộng là toàn bộ chủ nghĩa Mác - Lênin." },
      { id: "opt-cn-3", text: "3 nghĩa (triết học, kinh tế và xã hội)", isCorrect: false, explanation: "Triết học, Kinh tế chính trị và CNXHKH là 3 bộ phận lý luận cấu thành, không phải 3 nghĩa của CNXHKH." },
      { id: "opt-cn-4", text: "4 nghĩa (lý luận, thực tiễn, phong trào và thể chế)", isCorrect: false, explanation: "Giáo trình chuẩn của Bộ Giáo dục & Đào tạo xác định CNXHKH được tiếp cận theo 2 nghĩa." },
    ],
    generalExplanation: "Theo giáo trình Chủ nghĩa xã hội khoa học (Bộ GD&ĐT), CNXHKH được hiểu theo 2 nghĩa: theo nghĩa rộng là toàn bộ chủ nghĩa Mác - Lênin; theo nghĩa hẹp là một trong ba bộ phận cấu thành của chủ nghĩa Mác - Lênin.",
    bloomRationale: "Mức 1 (Nhớ): Yêu cầu người học nhận biết và nhắc lại định nghĩa và các cách tiếp cận cơ bản của môn học.",
  },
  // --- Môn Cấu trúc Dữ liệu & Giải thuật ---
  {
    id: "q-dsa-1",
    subjectId: "dsa",
    bloomLevel: 1, // Nhớ
    question: "Độ phức tạp thời gian trong trường hợp trung bình để tìm kiếm một phần tử trong Bảng băm (Hash Table) sử dụng hàm băm lý tưởng là bao nhiêu?",
    options: [
      { id: "opt-1", text: "O(1)", isCorrect: true, explanation: "Chính xác! Với bảng băm phân phối đồng đều lý tưởng, phép tra cứu theo khóa diễn ra trực tiếp qua chỉ mục trong O(1)." },
      { id: "opt-2", text: "O(log n)", isCorrect: false, explanation: "O(log n) là độ phức tạp của tìm kiếm nhị phân trên mảng đã sắp xếp hoặc cây nhị phân cân bằng (AVL, Red-Black)." },
      { id: "opt-3", text: "O(n)", isCorrect: false, explanation: "O(n) là trường hợp xấu nhất của bảng băm khi xảy ra va chạm toàn bộ (hash collision)." },
      { id: "opt-4", text: "O(n log n)", isCorrect: false, explanation: "O(n log n) là độ phức tạp của các giải thuật sắp xếp tối ưu như MergeSort." },
    ],
    generalExplanation: "Bảng băm sử dụng mảng kết hợp hàm băm để tính toán chỉ số trực tiếp từ khóa, cho phép truy xuất trung bình trong hằng số O(1).",
    bloomRationale: "Mức 1 (Nhớ): Yêu cầu người học nhận biết và nhớ lại định nghĩa độ phức tạp chuẩn của cấu trúc dữ liệu nền tảng.",
  },
  {
    id: "q-dsa-2",
    subjectId: "dsa",
    bloomLevel: 2, // Hiểu
    question: "Đặc điểm cơ bản nào phân biệt thuật toán Tìm kiếm theo chiều rộng (BFS) và Tìm kiếm theo chiều sâu (DFS) trên đồ thị?",
    options: [
      { id: "opt-1", text: "BFS dùng Hàng đợi (Queue) duyệt theo tầng lân cận, còn DFS dùng Ngăn xếp (Stack/đệ quy) đi sâu hết nhánh trước.", isCorrect: true, explanation: "Chính xác! BFS khám phá từng lớp bán kính khoảng cách, DFS thăm sâu nhất có thể rồi mới quay lui (backtrack)." },
      { id: "opt-2", text: "BFS luôn có độ phức tạp O(V) còn DFS có độ phức tạp O(E).", isCorrect: false, explanation: "Cả hai đều có độ phức tạp thời gian là O(V + E) trên danh sách kề." },
      { id: "opt-3", text: "BFS chỉ áp dụng được cho đồ thị có hướng, DFS chỉ áp dụng cho đồ thị vô hướng.", isCorrect: false, explanation: "Cả hai giải thuật đều áp dụng được cho cả đồ thị có hướng và vô hướng." },
      { id: "opt-4", text: "BFS tìm đường đi dài nhất, DFS tìm đường đi ngắn nhất.", isCorrect: false, explanation: "Ngược lại, BFS trên đồ thị không trọng số tìm đường đi ngắn nhất ít cạnh nhất." },
    ],
    generalExplanation: "Cơ chế quản lý đỉnh biên: BFS duyệt theo chiều ngang bằng FIFO (Queue), DFS duyệt theo chiều sâu bằng LIFO (Stack).",
    bloomRationale: "Mức 2 (Hiểu): Người học cần hiểu bản chất cơ chế hoạt động và phân biệt được nguyên lý của 2 kỹ thuật duyệt đồ thị.",
  },
  {
    id: "q-dsa-3",
    subjectId: "dsa",
    bloomLevel: 3, // Vận dụng
    question: "Cho bài toán: Tìm chuỗi con đối xứng (Palindrome) dài nhất trong chuỗi S có độ dài n. Thuật toán Quy hoạch động (Dynamic Programming) sử dụng bảng dp[i][j] có độ phức tạp thời gian và không gian là bao nhiêu?",
    options: [
      { id: "opt-1", text: "Thời gian O(n²), Không gian O(n²)", isCorrect: true, explanation: "Chính xác! Ta điền bảng ma trận kích thước n x n với dp[i][j] thể hiện chuỗi con từ i đến j có phải palindrome không." },
      { id: "opt-2", text: "Thời gian O(n), Không gian O(1)", isCorrect: false, explanation: "O(n) chỉ đạt được nếu dùng thuật toán Manacher chuyên biệt nâng cao, không phải phương pháp QHĐ tiêu chuẩn." },
      { id: "opt-3", text: "Thời gian O(n log n), Không gian O(n)", isCorrect: false, explanation: "Quy hoạch động kiểm tra n² chuỗi con dựa trên cặp trạng thái dp[i+1][j-1]." },
      { id: "opt-4", text: "Thời gian O(2^n), Không gian O(n)", isCorrect: false, explanation: "O(2^n) là phương pháp vét cạn (brute-force) đệ quy không nhớ trạng thái." },
    ],
    generalExplanation: "Quy hoạch động lưu trữ kết quả bài toán con dp[i][j] = (S[i] == S[j] && dp[i+1][j-1]) để tránh tính toán trùng lặp, tốn bảng O(n²).",
    bloomRationale: "Mức 3 (Vận dụng): Yêu cầu áp dụng phương pháp giải thuật Quy hoạch động vào một bài toán cụ thể và suy ra chi phí tài nguyên.",
  },
  {
    id: "q-dsa-4",
    subjectId: "dsa",
    bloomLevel: 4, // Phân tích
    question: "Khi phân tích hiệu năng của Cây tìm kiếm nhị phân thông thường (BST) so với Cây Đỏ-Đen (Red-Black Tree), nguyên nhân cốt lõi nào khiến BST thông thường trở nên kém hiệu quả?",
    options: [
      { id: "opt-1", text: "BST không có cơ chế tự xoay cân bằng, nên khi chèn dãy khóa tăng dần sẽ suy thoái thành danh sách liên kết với độ cao O(n).", isCorrect: true, explanation: "Chính xác! Thao tác tìm kiếm, chèn trên BST phụ thuộc vào chiều cao h. Khi h = n, độ phức tạp suy thoái thành O(n)." },
      { id: "opt-2", text: "BST tiêu tốn gấp đôi bộ nhớ cho mỗi nút so với Cây Đỏ-Đen.", isCorrect: false, explanation: "Ngược lại, Cây Đỏ-Đen cần thêm 1 bit lưu màu (Đỏ/Đen) cho mỗi nút." },
      { id: "opt-3", text: "BST không hỗ trợ duyệt cây theo thứ tự tăng dần (In-order traversal).", isCorrect: false, explanation: "Cả BST và Cây Đỏ-Đen đều duyệt In-order ra dãy tăng dần." },
      { id: "opt-4", text: "BST chỉ cho phép lưu trữ số nguyên, không hỗ trợ kiểu chuỗi.", isCorrect: false, explanation: "Kiểu dữ liệu chỉ cần có quan hệ thứ tự (comparable) là lưu được trên BST." },
    ],
    generalExplanation: "Cây Đỏ-Đen áp dụng các quy tắc tô màu và phép xoay cây (Tree Rotation) để đảm bảo chiều cao luôn bị chặn ở mức 2 * log(n+1), ngăn ngừa suy thoái dạng đường thẳng.",
    bloomRationale: "Mức 4 (Phân tích): Mổ xẻ cấu trúc và nguyên nhân suy thoái thuật toán dựa trên hành vi phân nhánh.",
  },
  {
    id: "q-dsa-5",
    subjectId: "dsa",
    bloomLevel: 5, // Đánh giá
    question: "Một kỹ sư đề xuất thay thế toàn bộ giải thuật MergeSort trong thư viện chuẩn bằng QuickSort vì QuickSort chạy nhanh hơn trong thực tế. Đánh giá nào sau đây phản biện chuẩn xác nhất quyết định này?",
    options: [
      { id: "opt-1", text: "MergeSort có tính ổn định (Stable) và đảm bảo trần thời gian luôn là O(n log n), điều này rất quan trọng với các hệ thống thời gian thực hoặc khi cần bảo toàn thứ tự ban đầu của các bản ghi bằng nhau.", isCorrect: true, explanation: "Chính xác! Tính ổn định (Stability) và bảo đảm thời gian chạy xấu nhất O(n log n) là tiêu chí sống còn mà QuickSort gốc không có." },
      { id: "opt-2", text: "QuickSort luôn tốn thêm O(n) bộ nhớ phụ trợ trên heap so với MergeSort.", isCorrect: false, explanation: "Sai! MergeSort mới tốn O(n) bộ nhớ phụ, còn QuickSort là sắp xếp tại chỗ (in-place) chỉ tốn O(log n) stack frame." },
      { id: "opt-3", text: "MergeSort chạy nhanh hơn QuickSort trên mảng nhỏ dưới 16 phần tử.", isCorrect: false, explanation: "Trên mảng rất nhỏ, người ta thường dùng Insertion Sort, không phải MergeSort." },
      { id: "opt-4", text: "QuickSort không thể triển khai trên ngôn ngữ hướng đối tượng.", isCorrect: false, explanation: "Hoàn toàn vô căn cứ, thuật toán độc lập với mô hình lập trình." },
    ],
    generalExplanation: "Không có giải thuật nào tối ưu trên mọi khía cạnh. Sự đánh đổi giữa tính ổn định (Stability), giới hạn trường hợp xấu nhất và chi phí bộ nhớ quyết định giải thuật phù hợp.",
    bloomRationale: "Mức 5 (Đánh giá): Yêu cầu cân nhắc các tiêu chí kỹ thuật, đánh đổi ưu/nhược điểm để bảo vệ hoặc phản biện một quyết định kiến trúc.",
  },
  {
    id: "q-dsa-6",
    subjectId: "dsa",
    bloomLevel: 6, // Sáng tạo
    question: "Bạn cần thiết kế một hệ thống kiểm tra tồn tại của một URL trong 1 tỷ link đã thu thập với yêu cầu bộ nhớ giới hạn chỉ 1GB RAM và chấp nhận một tỷ lệ dương tính giả (false positive) cực nhỏ. Kiến trúc dữ liệu nào là tối ưu nhất?",
    options: [
      { id: "opt-1", text: "Bộ lọc Bloom (Bloom Filter) kết hợp k hàm băm độc lập trên một mảng bit phân tán.", isCorrect: true, explanation: "Tuyệt vời! Bloom Filter cho phép kiểm tra thành viên với bộ nhớ siêu nhỏ gọn (vài bit/phần tử), không lưu dữ liệu gốc, đảm bảo không có False Negative và False Positive kiểm soát được." },
      { id: "opt-2", text: "Cơ sở dữ liệu B-Tree lưu trữ toàn bộ chuỗi URL trên RAM.", isCorrect: false, explanation: "1 tỷ URL x trung bình 50 bytes = 50GB RAM, vượt xa giới hạn 1GB." },
      { id: "opt-3", text: "Bảng băm HashMap thông thường lưu khóa SHA-256.", isCorrect: false, explanation: "1 tỷ khóa x 32 bytes + overhead con trỏ sẽ tốn trên 40GB RAM." },
      { id: "opt-4", text: "Đồ thị Trie lưu ký tự URL.", isCorrect: false, explanation: "Trie có hệ số phân nhánh lớn và nhiều con trỏ, tốn bộ nhớ rất nhiều so với Bloom Filter." },
    ],
    generalExplanation: "Bloom Filter là cấu trúc dữ liệu xác suất (probabilistic data structure) lý tưởng cho bài toán kiểm tra tập hợp quy mô cực lớn trong không gian bộ nhớ hạn chế.",
    bloomRationale: "Mức 6 (Sáng tạo): Yêu cầu tổng hợp các ràng buộc thực tế để lựa chọn và đề xuất một giải pháp kiến trúc đột phá.",
  },

  // --- Môn AI & Machine Learning ---
  {
    id: "q-ai-1",
    subjectId: "ai_ml",
    bloomLevel: 1, // Nhớ
    question: "Tham số nào trong mạng nơ-ron được mô hình tự động cập nhật qua thuật toán Lan truyền ngược (Backpropagation)?",
    options: [
      { id: "opt-1", text: "Trọng số (Weights) và Hệ số lệch (Biases)", isCorrect: true, explanation: "Chính xác! Trọng số W và bias b là các learnable parameters được tối ưu hóa qua đạo hàm riêng." },
      { id: "opt-2", text: "Tốc độ học (Learning Rate)", isCorrect: false, explanation: "Learning rate là Hyperparameter (siêu tham số) do kỹ sư thiết lập trước." },
      { id: "opt-3", text: "Số lượng layer và số nơ-ron mỗi layer", isCorrect: false, explanation: "Đây là kiến trúc mạng (architecture hyperparameter)." },
      { id: "opt-4", text: "Kích thước batch (Batch size)", isCorrect: false, explanation: "Batch size là siêu tham số huấn luyện." },
    ],
    generalExplanation: "Các tham số học được (learnable parameters) bao gồm trọng số kết nối và ngưỡng kích hoạt bias.",
    bloomRationale: "Mức 1 (Nhớ): Nhận biết sự khác biệt giữa tham số mô hình (parameters) và siêu tham số (hyperparameters).",
  },
  {
    id: "q-ai-2",
    subjectId: "ai_ml",
    bloomLevel: 2, // Hiểu
    question: "Tại sao hàm kích hoạt phi tuyến tính (như ReLU, Sigmoid) là BẮT BUỘC trong mạng nơ-ron nhiều tầng (Deep Neural Network)?",
    options: [
      { id: "opt-1", text: "Nếu chỉ dùng các hàm tuyến tính, tích chập nhiều tầng sẽ chỉ tương đương với một phép biến đổi tuyến tính đơn lẻ, làm mất khả năng xấp xỉ hàm phức tạp.", isCorrect: true, explanation: "Chính xác! Tích của nhiều ma trận tuyến tính vẫn là một ma trận tuyến tính W = W2 * W1." },
      { id: "opt-2", text: "Hàm phi tuyến tính giúp giảm thời gian tính toán về O(1).", isCorrect: false, explanation: "Hàm phi tuyến không giảm thời gian tính toán mà mang lại năng lực biểu diễn toán học." },
      { id: "opt-3", text: "Hàm tuyến tính không thể tính được đạo hàm trong lan truyền ngược.", isCorrect: false, explanation: "Hàm tuyến tính f(x) = ax có đạo hàm đơn giản là a, hoàn toàn tính được." },
      { id: "opt-4", text: "Để đảm bảo các giá trị đầu ra luôn nằm trong khoảng [0, 1].", isCorrect: false, explanation: "ReLU cho ra giá trị [0, +vô cùng), không bị giới hạn trong [0, 1]." },
    ],
    generalExplanation: "Hàm kích hoạt phi tuyến cho phép mạng nơ-ron học được các đường ranh giới quyết định phức tạp (Universal Approximation Theorem).",
    bloomRationale: "Mức 2 (Hiểu): Hiểu được nguyên lý toán học sâu xa của tính phi tuyến trong học sâu.",
  },
  {
    id: "q-ai-3",
    subjectId: "ai_ml",
    bloomLevel: 4, // Phân tích
    question: "Phân tích sự khác biệt về cơ chế điều chuẩn giữa L1 Regularization (Lasso) và L2 Regularization (Ridge)?",
    options: [
      { id: "opt-1", text: "L1 phạt tổng trị tuyệt đối |w| và có xu hướng ép các trọng số không quan trọng về đúng bằng 0 (tạo ra mô hình thưa sparse); L2 phạt tổng bình phương w² ép trọng số nhỏ đều nhưng hiếm khi về 0.", isCorrect: true, explanation: "Chính xác! L1 đóng vai trò chọn lọc đặc trưng (feature selection), L2 giúp phân bổ đều trọng số tránh phụ thuộc vào một đặc trưng duy nhất." },
      { id: "opt-2", text: "L1 áp dụng cho phân loại, L2 áp dụng cho hồi quy.", isCorrect: false, explanation: "Cả L1 và L2 đều áp dụng được cho cả hai bài toán." },
      { id: "opt-3", text: "L2 triệt tiêu hoàn toàn gradient của các trọng số âm.", isCorrect: false, explanation: "L2 phạt theo w², gradient là 2w, mượt mà ở mọi khoảng giá trị." },
      { id: "opt-4", text: "L1 luôn luôn cho hiệu quả cao hơn L2 trên mọi bộ dữ liệu.", isCorrect: false, explanation: "Không có định lý nào khẳng định L1 luôn tốt hơn L2." },
    ],
    generalExplanation: "Hình học của hình phạt: Không gian ràng buộc của L1 là hình thoi (dễ tiếp xúc tại các đỉnh trục tọa độ khiến w_i = 0), còn L2 là hình tròn mượt mà.",
    bloomRationale: "Mức 4 (Phân tích): Mổ xẻ và đối chiếu tính chất toán học của hai kỹ thuật chống Overfitting kinh điển.",
  },

  // --- Môn Kinh tế Vi mô ---
  {
    id: "q-econ-1",
    subjectId: "micro_econ",
    bloomLevel: 1, // Nhớ
    question: "Chi phí cơ hội (Opportunity Cost) được định nghĩa chuẩn xác là gì?",
    options: [
      { id: "opt-1", text: "Giá trị của phương án tốt nhất bị bỏ qua khi đưa ra một quyết định lựa chọn.", isCorrect: true, explanation: "Chính xác! Chi phí cơ hội là giá trị cao nhất của lợi ích mất đi từ cơ hội thay thế tốt nhất." },
      { id: "opt-2", text: "Toàn bộ số tiền mặt đã thanh toán để mua hàng hóa.", isCorrect: false, explanation: "Đó là chi phí kế toán hoặc chi phí tài chính hiển hiện." },
      { id: "opt-3", text: "Khoản chi phí không thể thu hồi lại được trong quá khứ.", isCorrect: false, explanation: "Đó là chi phí chìm (Sunk cost)." },
      { id: "opt-4", text: "Chi phí để sản xuất thêm một đơn vị sản phẩm tiếp theo.", isCorrect: false, explanation: "Đó là chi phí biên (Marginal cost)." },
    ],
    generalExplanation: "Chi phí cơ hội đo lường sự đánh đổi trong điều kiện nguồn lực khan hiếm.",
    bloomRationale: "Mức 1 (Nhớ): Nhắc lại định nghĩa cốt lõi của kinh tế học.",
  },
  {
    id: "q-econ-2",
    subjectId: "micro_econ",
    bloomLevel: 3, // Vận dụng
    question: "Một công ty công nghệ nhận thấy độ co giãn của cầu theo giá đối với phần mềm của họ là Ed = -2.5. Nếu công ty quyết định giảm giá 10%, doanh thu sẽ thay đổi như thế nào?",
    options: [
      { id: "opt-1", text: "Lượng cầu tăng 25% và Tổng doanh thu sẽ tăng.", isCorrect: true, explanation: "Chính xác! %ΔQ = Ed * %ΔP = (-2.5) * (-10%) = +25%. Vì mức tăng lượng bán (+25%) lớn hơn mức giảm giá (-10%), tổng doanh thu TR = P x Q sẽ tăng đáng kể!" },
      { id: "opt-2", text: "Lượng cầu giảm 25% và Tổng doanh thu giảm.", isCorrect: false, explanation: "Khi giá giảm, lượng cầu tăng theo quy luật cầu." },
      { id: "opt-3", text: "Tổng doanh thu không đổi vì cung cầu triệt tiêu.", isCorrect: false, explanation: "Chỉ khi Ed = -1 (co giãn đơn vị) thì doanh thu mới đạt cực đại và không đổi." },
      { id: "opt-4", text: "Lượng cầu tăng 10% và Tổng doanh thu giảm.", isCorrect: false, explanation: "Tính toán sai hệ số độ co giãn." },
    ],
    generalExplanation: "Công thức: %ΔQ = Ed * %ΔP. Khi |Ed| > 1, giá và tổng doanh thu biến thiên ngược chiều.",
    bloomRationale: "Mức 3 (Vận dụng): Áp dụng công thức kinh tế vi mô vào kịch bản định giá kinh doanh thực tế.",
  },
];

export const INITIAL_REMINDERS: StudyReminder[] = [
  {
    id: "rem-1",
    title: "Ôn tập Flashcard buổi sáng (Spaced Repetition)",
    daysOfWeek: [1, 2, 3, 4, 5], // Thứ 2 đến Thứ 6
    time: "07:30",
    enabled: true,
  },
  {
    id: "rem-2",
    title: "Luyện trắc nghiệm Thang Bloom & Review lỗi sai",
    daysOfWeek: [1, 3, 5, 0], // Thứ 2, 4, 6, CN
    time: "20:00",
    enabled: true,
  },
  {
    id: "rem-3",
    title: "Tổng kết tuần & Củng cố bậc Phân tích / Đánh giá",
    daysOfWeek: [0], // Chủ nhật
    time: "15:00",
    enabled: true,
  },
];

export const INITIAL_STATE: AppState = {
  subjects: INITIAL_SUBJECTS,
  flashcards: INITIAL_FLASHCARDS,
  quizzes: INITIAL_QUIZZES,
  quizAttempts: [
    {
      id: "att-1",
      subjectId: "dsa",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      totalQuestions: 6,
      correctAnswers: 5,
      bloomBreakdown: {
        1: { total: 1, correct: 1 },
        2: { total: 1, correct: 1 },
        3: { total: 1, correct: 1 },
        4: { total: 1, correct: 1 },
        5: { total: 1, correct: 1 },
        6: { total: 1, correct: 0 },
      },
      timeSpentSeconds: 240,
    },
    {
      id: "att-2",
      subjectId: "ai_ml",
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      totalQuestions: 3,
      correctAnswers: 3,
      bloomBreakdown: {
        1: { total: 1, correct: 1 },
        2: { total: 1, correct: 1 },
        3: { total: 0, correct: 0 },
        4: { total: 1, correct: 1 },
        5: { total: 0, correct: 0 },
        6: { total: 0, correct: 0 },
      },
      timeSpentSeconds: 110,
    },
  ],
  reminders: INITIAL_REMINDERS,
  goal: {
    dailyFlashcardTarget: 15,
    dailyQuizTarget: 5,
    dailyMinutesTarget: 30,
  },
  studyLogs: [
    { date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0], cardsReviewed: 10, quizzesCompleted: 4, minutes: 25 },
    { date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0], cardsReviewed: 14, quizzesCompleted: 6, minutes: 35 },
    { date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], cardsReviewed: 18, quizzesCompleted: 8, minutes: 42 },
    { date: new Date(Date.now() - 86400000 * 1).toISOString().split("T")[0], cardsReviewed: 12, quizzesCompleted: 5, minutes: 28 },
    { date: today, cardsReviewed: 8, quizzesCompleted: 3, minutes: 18 },
  ],
  lastSyncTimestamp: Date.now(),
};
