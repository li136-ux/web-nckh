import { AppState, Flashcard, QuizAttempt, QuizQuestion, Subject, StudyReminder } from "../types";
import { INITIAL_STATE } from "../data/initialSubjects";

const STORAGE_KEY = "cognilearn_data_v2";

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("cognilearn_data_v1");
    if (!raw) {
      saveAppState(INITIAL_STATE);
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(raw) as AppState;
    // ensure required fields exist and fc-cnxhkh-1 is first
    const hasCnxhkh = parsed.flashcards?.some((f) => f.id === "fc-cnxhkh-1");
    let flashcards = parsed.flashcards || INITIAL_STATE.flashcards;
    if (!hasCnxhkh) {
      flashcards = [INITIAL_STATE.flashcards[0], ...flashcards];
    }
    const hasSub = parsed.subjects?.some((s) => s.id === "cnxhkh");
    let subjects = parsed.subjects || INITIAL_STATE.subjects;
    if (!hasSub) {
      subjects = [INITIAL_STATE.subjects[0], ...subjects];
    }
    const hasQuiz = parsed.quizzes?.some((q) => q.id === "q-cnxhkh-1");
    let quizzes = parsed.quizzes || INITIAL_STATE.quizzes;
    if (!hasQuiz) {
      quizzes = [INITIAL_STATE.quizzes[0], ...quizzes];
    }

    const state: AppState = {
      ...INITIAL_STATE,
      ...parsed,
      subjects,
      flashcards,
      quizzes,
      quizAttempts: parsed.quizAttempts || [],
      reminders: parsed.reminders || INITIAL_STATE.reminders,
      studyLogs: parsed.studyLogs || INITIAL_STATE.studyLogs,
      lastSyncTimestamp: parsed.lastSyncTimestamp || Date.now(),
    };
    saveAppState(state);
    return state;
  } catch (error) {
    console.error("Failed to load app state from localStorage:", error);
    return INITIAL_STATE;
  }
}

function INITIAL_FLASHCARDS_FALLBACK(parsed: any) {
  return parsed.flashcards || INITIAL_STATE.flashcards;
}

export function saveAppState(state: AppState): void {
  try {
    const updated = {
      ...state,
      lastSyncTimestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
}

/**
 * Log study activity for today
 */
export function recordStudyActivity(
  cardsReviewedCount: number = 0,
  quizzesCompletedCount: number = 0,
  minutesToAdd: number = 0
): AppState {
  const current = loadAppState();
  const today = new Date().toISOString().split("T")[0];
  
  const existingLogIndex = current.studyLogs.findIndex((log) => log.date === today);
  let updatedLogs = [...current.studyLogs];
  
  if (existingLogIndex >= 0) {
    const log = updatedLogs[existingLogIndex];
    updatedLogs[existingLogIndex] = {
      ...log,
      cardsReviewed: log.cardsReviewed + cardsReviewedCount,
      quizzesCompleted: log.quizzesCompleted + quizzesCompletedCount,
      minutes: log.minutes + minutesToAdd,
    };
  } else {
    updatedLogs.push({
      date: today,
      cardsReviewed: cardsReviewedCount,
      quizzesCompleted: quizzesCompletedCount,
      minutes: minutesToAdd,
    });
  }

  const newState = {
    ...current,
    studyLogs: updatedLogs,
    lastSyncTimestamp: Date.now(),
  };

  saveAppState(newState);
  return newState;
}

/**
 * Generates an encrypted/Base64 cross-device sync token
 */
export function exportSyncToken(state: AppState): string {
  try {
    const payload = JSON.stringify(state);
    const base64 = btoa(encodeURIComponent(payload));
    return `CGN-${base64}`;
  } catch (err) {
    console.error("Export sync token failed:", err);
    return "";
  }
}

/**
 * Imports and restores state from a cross-device sync token
 */
export function importSyncToken(token: string): AppState | null {
  try {
    const clean = token.trim();
    if (!clean.startsWith("CGN-")) {
      throw new Error("Mã đồng bộ không hợp lệ (cần bắt đầu bằng CGN-)");
    }
    const base64 = clean.replace("CGN-", "");
    const decoded = decodeURIComponent(atob(base64));
    const parsed = JSON.parse(decoded) as AppState;
    if (parsed.subjects && parsed.flashcards) {
      saveAppState(parsed);
      return parsed;
    }
    return null;
  } catch (err) {
    console.error("Import sync token failed:", err);
    return null;
  }
}

/**
 * Export JSON file download
 */
export function downloadJsonBackup(state: AppState) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `cognilearn_backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
