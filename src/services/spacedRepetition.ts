import { Flashcard } from "../types";

export type ReviewRating = "again" | "good" | "easy";

export function processFlashcardReview(card: Flashcard, rating: ReviewRating): Flashcard {
  const now = new Date();
  let newBox = card.box;
  let newEase = card.easeFactor || 2.5;
  let daysToAdd = 1;

  if (rating === "again") {
    // Reset to box 1
    newBox = 1;
    newEase = Math.max(1.3, newEase - 0.2);
    daysToAdd = 1;
  } else if (rating === "good") {
    newBox = Math.min(5, newBox + 1);
    daysToAdd = getIntervalForBox(newBox);
  } else if (rating === "easy") {
    newBox = Math.min(5, newBox + 2);
    newEase = Math.min(3.0, newEase + 0.15);
    daysToAdd = getIntervalForBox(newBox) * 1.5;
  }

  const nextDate = new Date(now.getTime() + Math.round(daysToAdd) * 86400000);
  const nextDateStr = nextDate.toISOString().split("T")[0];

  return {
    ...card,
    box: newBox,
    repetitions: card.repetitions + 1,
    easeFactor: Number(newEase.toFixed(2)),
    nextReviewDate: nextDateStr,
    lastReviewedAt: now.toISOString(),
  };
}

export function getIntervalForBox(box: number): number {
  switch (box) {
    case 1:
      return 1; // 1 day
    case 2:
      return 3; // 3 days
    case 3:
      return 7; // 1 week
    case 4:
      return 14; // 2 weeks
    case 5:
      return 30; // 1 month
    default:
      return 1;
  }
}

export function isCardDue(card: Flashcard): boolean {
  if (!card.nextReviewDate) return true;
  const today = new Date().toISOString().split("T")[0];
  return card.nextReviewDate <= today;
}
