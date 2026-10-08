"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchLesson, completeLesson, fetchUser, refillHearts } from "@/lib/api";
import { LessonDetail, User, Exercise } from "@/lib/types";
import { sounds } from "@/lib/sounds";

import LessonHeader from "@/components/lesson/LessonHeader";
import FeedbackBar from "@/components/lesson/FeedbackBar";
import LessonComplete from "@/components/lesson/LessonComplete";
import OutOfHeartsModal from "@/components/lesson/OutOfHeartsModal";

import MultipleChoice from "@/components/lesson/exercises/MultipleChoice";
import WordBank from "@/components/lesson/exercises/WordBank";
import MatchPairs from "@/components/lesson/exercises/MatchPairs";
import FillBlank from "@/components/lesson/exercises/FillBlank";
import TypeAnswer from "@/components/lesson/exercises/TypeAnswer";

const PRAISE_LIST = ["Awesome!", "Nice job!", "Excellent!", "Nicely done!", "Great!"];

function LessonContent() {
  const params = useParams();
  const router = useRouter();
  const lessonId = Number(params?.id) || 1;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Queue of exercises (including remediation for mistakes)
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [missedExercises, setMissedExercises] = useState<Exercise[]>([]);
  const [isReviewPhase, setIsReviewPhase] = useState(false);

  // Gamification & State
  const [hearts, setHearts] = useState(5);
  const [consecutiveStreak, setConsecutiveStreak] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [praiseText, setPraiseText] = useState("Nice job!");
  
  // Interstitial States
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [showReviewIntro, setShowReviewIntro] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);

  // Exercise Inputs
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [pairsMatched, setPairsMatched] = useState(false);
  const [selectedBlank, setSelectedBlank] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");

  useEffect(() => {
    async function loadData() {
      const [lData, uData] = await Promise.all([fetchLesson(lessonId), fetchUser()]);
      setLesson(lData);
      setUser(uData);
      setHearts(uData.hearts);
      setExerciseQueue(lData.exercises);
      if (lData.exercises.length > 0) {
        initExercise(lData.exercises[0]);
      }
    }
    loadData();
  }, [lessonId]);

  const initExercise = (ex: any) => {
    setStatus("idle");
    setSelectedOptionId(null);
    setSelectedBlank(null);
    setTypedAnswer("");
    setPairsMatched(false);

    if (ex.type === "WORD_BANK") {
      setSelectedWords([]);
      setAvailableWords([...(ex.content.word_pool || [])]);
    }
  };

  if (!lesson || !user || exerciseQueue.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <span className="text-6xl animate-bounce">🦉</span>
          <p className="font-black text-gray-500 mt-3 text-sm">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const currentExercise = exerciseQueue[currentIndex];
  // Calculate live progress that advances dynamically the moment answer is verified correct
  const progressPercentage = Math.min(
    100,
    ((currentIndex + (status === "correct" ? 1 : 0)) / exerciseQueue.length) * 100
  );

  // Input selection detection
  let hasSelection = false;
  if (currentExercise.type === "MULTIPLE_CHOICE") hasSelection = selectedOptionId !== null;
  else if (currentExercise.type === "WORD_BANK") hasSelection = selectedWords.length > 0;
  else if (currentExercise.type === "MATCH_PAIRS") hasSelection = pairsMatched;
  else if (currentExercise.type === "FILL_BLANK") hasSelection = selectedBlank !== null;
  else if (currentExercise.type === "TYPE_ANSWER") hasSelection = typedAnswer.trim().length > 0;

  // Check Answer Handler
  const handleCheck = () => {
    let isCorrect = false;

    if (currentExercise.type === "MULTIPLE_CHOICE") {
      const opt = currentExercise.content.options.find((o: any) => o.id === selectedOptionId);
      isCorrect = opt?.text?.toLowerCase() === currentExercise.correct_answer.toLowerCase();
    } else if (currentExercise.type === "WORD_BANK") {
      const assembled = selectedWords.join(" ");
      isCorrect = assembled.toLowerCase() === currentExercise.correct_answer.toLowerCase();
    } else if (currentExercise.type === "MATCH_PAIRS") {
      isCorrect = pairsMatched;
    } else if (currentExercise.type === "FILL_BLANK") {
      isCorrect = selectedBlank?.toLowerCase() === currentExercise.correct_answer.toLowerCase();
    } else if (currentExercise.type === "TYPE_ANSWER") {
      isCorrect = typedAnswer.trim().toLowerCase() === currentExercise.correct_answer.toLowerCase();
    }

    if (isCorrect) {
      sounds.playCorrect();
      setStatus("correct");
      setPraiseText(PRAISE_LIST[Math.floor(Math.random() * PRAISE_LIST.length)]);
      setConsecutiveStreak((s) => s + 1);

      // Trigger Duo encouraging peek at 4 in a row
      if (consecutiveStreak === 3 && !showEncouragement) {
        setTimeout(() => setShowEncouragement(true), 300);
      }
    } else {
      sounds.playIncorrect();
      setStatus("incorrect");
      setConsecutiveStreak(0);
      setMistakesCount((m) => m + 1);

      // Queue exercise for Mistake Review
      if (!missedExercises.some((e) => e.id === currentExercise.id)) {
        setMissedExercises((prev) => [...prev, currentExercise]);
      }

      if (!user.is_super) {
        const nextHearts = Math.max(0, hearts - 1);
        setHearts(nextHearts);
        if (nextHearts === 0) {
          setIsOutOfHearts(true);
        }
      }
    }
  };

  // Continue Handler
  const handleContinue = async () => {
    // If encouragement popup active, dismiss it
    if (showEncouragement) {
      setShowEncouragement(false);
      return;
    }

    // If review intro active, dismiss and start review
    if (showReviewIntro) {
      setShowReviewIntro(false);
      setIsReviewPhase(true);
      setExerciseQueue(missedExercises);
      setMissedExercises([]);
      setCurrentIndex(0);
      initExercise(missedExercises[0]);
      return;
    }

    // Advance to next exercise
    if (currentIndex + 1 < exerciseQueue.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      initExercise(exerciseQueue[nextIndex]);
    } else {
      // Reached end of current queue!
      if (missedExercises.length > 0 && !isReviewPhase) {
        // Trigger Mistake Review sequence
        setShowReviewIntro(true);
      } else {
        // Fully complete lesson!
        await completeLesson(lessonId, hearts, mistakesCount);
        setIsFinished(true);
      }
    }
  };

  const handleRefillHearts = async () => {
    await refillHearts();
    setHearts(5);
    setIsOutOfHearts(false);
  };

  if (isFinished) {
    const accuracy = Math.round(
      ((lesson.exercises.length) / (lesson.exercises.length + mistakesCount)) * 100
    );
    return (
      <LessonComplete
        xpEarned={lesson.xp_reward + 4}
        streak={user.streak}
        accuracy={Math.max(65, accuracy)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Header with X IN A ROW streak pill */}
      <div className="relative">
        {consecutiveStreak >= 2 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-emerald-100 text-[#58cc02] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs animate-bounce">
            <span>🔥</span>
            <span>{consecutiveStreak} in a row</span>
          </div>
        )}

        <LessonHeader
          progressPercentage={progressPercentage}
          hearts={hearts}
          isSuper={user.is_super}
          onQuitLesson={() => router.push("/learn")}
        />
      </div>

      {/* Main Exercise Area */}
      <main className="flex-1 flex flex-col justify-center px-4 py-6 max-w-2xl mx-auto w-full pb-32">
        {/* Yellow PREVIOUS MISTAKE Badge from Video */}
        {isReviewPhase && (
          <div className="flex items-center gap-1.5 text-amber-600 font-black text-xs uppercase tracking-wider mb-2">
            <span>🔁</span>
            <span>Previous Mistake</span>
          </div>
        )}

        {currentExercise.type === "MULTIPLE_CHOICE" && (
          <MultipleChoice
            prompt={currentExercise.prompt}
            categoryTag={currentExercise.category_tag}
            audioText={currentExercise.audio_text}
            options={currentExercise.content.options}
            selectedId={selectedOptionId}
            onSelect={(id) => setSelectedOptionId(id)}
          />
        )}

        {currentExercise.type === "WORD_BANK" && (
          <WordBank
            prompt={currentExercise.prompt}
            categoryTag={currentExercise.category_tag}
            sentenceToTranslate={currentExercise.content.sentence_to_translate}
            audioText={currentExercise.audio_text}
            selectedWords={selectedWords}
            availableWords={availableWords}
            onAddWord={(word, idx) => {
              setSelectedWords([...selectedWords, word]);
              setAvailableWords(availableWords.filter((_, i) => i !== idx));
            }}
            onRemoveWord={(word, idx) => {
              setAvailableWords([...availableWords, word]);
              setSelectedWords(selectedWords.filter((_, i) => i !== idx));
            }}
          />
        )}

        {currentExercise.type === "MATCH_PAIRS" && (
          <MatchPairs
            prompt={currentExercise.prompt}
            categoryTag={currentExercise.category_tag}
            pairs={currentExercise.content.pairs}
            onAllMatched={() => setPairsMatched(true)}
          />
        )}

        {currentExercise.type === "FILL_BLANK" && (
          <FillBlank
            prompt={currentExercise.prompt}
            categoryTag={currentExercise.category_tag}
            audioText={currentExercise.audio_text}
            prefix={currentExercise.content.prefix}
            suffix={currentExercise.content.suffix}
            options={currentExercise.content.options}
            selectedWord={selectedBlank}
            onSelect={(w) => setSelectedBlank(w)}
          />
        )}

        {currentExercise.type === "TYPE_ANSWER" && (
          <TypeAnswer
            prompt={currentExercise.prompt}
            categoryTag={currentExercise.category_tag}
            sentenceToTranslate={currentExercise.content.sentence_to_translate}
            audioText={currentExercise.audio_text}
            hint={currentExercise.content.hint}
            typedValue={typedAnswer}
            onChange={(val) => setTypedAnswer(val)}
            onSubmit={handleCheck}
          />
        )}
      </main>

      {/* Duo Peeking Encouragement Interstitial from Video */}
      {showEncouragement && (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col justify-end">
          <div className="bg-white p-6 rounded-t-3xl border-t-2 border-gray-200 flex flex-col items-center text-center animate-slide-up">
            <span className="text-7xl -mb-2">🦉</span>
            <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 font-black text-gray-800 text-sm my-3">
              Your hard work is paying off!
            </div>
            <button
              onClick={() => setShowEncouragement(false)}
              className="w-full max-w-sm py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-green"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Mistake Review Intro Interstitial from Video */}
      {showReviewIntro && (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col justify-end">
          <div className="bg-white p-6 rounded-t-3xl border-t-2 border-gray-200 flex flex-col items-center text-center animate-slide-up">
            <span className="text-7xl -mb-2">🦉</span>
            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 font-black text-amber-900 text-sm my-3">
              Let&apos;s review the exercises you missed!
            </div>
            <button
              onClick={handleContinue}
              className="w-full max-w-sm py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-green"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Signature Feedback Drawer */}
      <FeedbackBar
        status={status}
        hasSelection={hasSelection}
        correctAnswerText={currentExercise.correct_answer}
        meaningText={currentExercise.prompt}
        praiseTitle={praiseText}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />

      <OutOfHeartsModal isOpen={isOutOfHearts} onRefill={handleRefillHearts} />
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <span className="text-6xl animate-bounce">🦉</span>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
