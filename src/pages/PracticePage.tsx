import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Delete,
  Home,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router";
import { Background } from "../components/Background";
import { Brand } from "../components/Brand";
import { Confetti } from "../components/Confetti";
import {
  createProblemSet,
  isProblemType,
  problemTypeInfo,
  type Problem,
  type ProblemType,
} from "../lib/problems";
import { saveSession } from "../lib/progress";

type AnswerState = "idle" | "correct" | "incorrect";

export function PracticePage() {
  const { type: typeParam } = useParams();

  if (!isProblemType(typeParam)) {
    return <Navigate to="/" replace />;
  }

  return <PracticeSession key={typeParam} type={typeParam} />;
}

function PracticeSession({ type }: { type: ProblemType }) {
  const [problems, setProblems] = useState(() => createProblemSet(type));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const info = problemTypeInfo[type];
  const problem = problems[currentIndex];

  useEffect(() => {
    if (answerState === "idle") inputRef.current?.focus();
    else nextButtonRef.current?.focus();
  }, [answerState, currentIndex]);

  const appendNumber = (number: number) => {
    if (answerState !== "idle" || answer.length >= 3) return;
    setAnswer((current) => (current === "0" ? String(number) : `${current}${number}`));
  };

  const checkAnswer = () => {
    if (!answer || answerState !== "idle") return;
    const correct = Number(answer) === problem.answer;
    setAnswerState(correct ? "correct" : "incorrect");
    if (correct) setScore((current) => current + 1);
  };

  const goNext = () => {
    if (currentIndex === problems.length - 1) {
      const finalScore = score;
      saveSession(type, finalScore, problems.length);
      setFinished(true);
      return;
    }

    setCurrentIndex((current) => current + 1);
    setAnswer("");
    setAnswerState("idle");
  };

  const restart = () => {
    setProblems(createProblemSet(type));
    setCurrentIndex(0);
    setAnswer("");
    setAnswerState("idle");
    setScore(0);
    setFinished(false);
  };

  const handleInput = (value: string) => {
    if (answerState !== "idle") return;
    setAnswer(value.replace(/\D/g, "").slice(0, 3));
  };

  if (finished) {
    return <ResultPage type={type} score={score} onRestart={restart} />;
  }

  return (
    <div className={`app-shell practice-shell practice-${info.color}`}>
      <Background />
      <header className="practice-header content-width">
        <Brand compact />
        <Link to="/" className="back-link">
          <ArrowLeft size={18} aria-hidden="true" />
          コースを えらぶ
        </Link>
        <div className="score-chip" aria-label={`${score}問正解`}>
          <Star size={17} fill="currentColor" aria-hidden="true" />
          <strong>{score}</strong>
        </div>
      </header>

      <main className="practice-main content-width">
        <div className="practice-title-row">
          <div>
            <span>10もん チャレンジ</span>
            <h1>{info.label}</h1>
          </div>
          <strong>{currentIndex + 1}<small> / 10</small></strong>
        </div>

        <ol className="stepper" aria-label={`10問中 ${currentIndex + 1}問目`}>
          {problems.map((item, index) => (
            <li
              key={item.id}
              className={
                index < currentIndex
                  ? "is-done"
                  : index === currentIndex
                    ? "is-current"
                    : ""
              }
            >
              <span>{index < currentIndex ? <Check size={13} /> : index + 1}</span>
            </li>
          ))}
        </ol>

        <section className={`problem-card ${answerState !== "idle" ? `state-${answerState}` : ""}`}>
          {answerState === "correct" && <Confetti />}
          <div className="problem-label">
            <span aria-hidden="true">{info.icon}</span>
            こたえを 入れてね
          </div>

          <div className="equation" aria-label={`${problem.left} ${problem.symbol} ${problem.right} は`}>
            <span>{problem.left}</span>
            <b>{problem.symbol}</b>
            <span>{problem.right}</span>
            <i>=</i>
          </div>

          {answerState === "idle" ? (
            <AnswerForm
              answer={answer}
              inputRef={inputRef}
              onInput={handleInput}
              onAppend={appendNumber}
              onDelete={() => setAnswer((current) => current.slice(0, -1))}
              onSubmit={checkAnswer}
            />
          ) : (
            <Feedback
              state={answerState}
              answer={answer}
              problem={problem}
              isLast={currentIndex === problems.length - 1}
              onNext={goNext}
              buttonRef={nextButtonRef}
            />
          )}
        </section>

        <p className="keyboard-hint">キーボードの 数字と Enterキーでも こたえられるよ</p>
      </main>
    </div>
  );
}

interface AnswerFormProps {
  answer: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInput: (value: string) => void;
  onAppend: (number: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

function AnswerForm({
  answer,
  inputRef,
  onInput,
  onAppend,
  onDelete,
  onSubmit,
}: AnswerFormProps) {
  return (
    <form
      className="answer-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="answer">こたえ</label>
      <input
        ref={inputRef}
        id="answer"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={answer}
        onChange={(event) => onInput(event.target.value)}
        placeholder="?"
        aria-describedby="answer-help"
      />
      <span id="answer-help" className="sr-only">数字を入力してください</span>

      <div className="number-pad" aria-label="数字ボタン">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button key={number} type="button" onClick={() => onAppend(number)}>
            {number}
          </button>
        ))}
        <button type="button" className="delete-key" onClick={onDelete} aria-label="1文字けす">
          <Delete size={23} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onAppend(0)}>0</button>
        <button type="submit" className="submit-key" disabled={!answer} aria-label="こたえあわせ">
          <Check size={25} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

interface FeedbackProps {
  state: Exclude<AnswerState, "idle">;
  answer: string;
  problem: Problem;
  isLast: boolean;
  onNext: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

function Feedback({ state, answer, problem, isLast, onNext, buttonRef }: FeedbackProps) {
  const correct = state === "correct";

  return (
    <div className="feedback" aria-live="polite">
      <div className="feedback-answer">
        <span>{answer}</span>
        <i className={correct ? "correct-mark" : "incorrect-mark"}>
          {correct ? <Check size={26} /> : <X size={26} />}
        </i>
      </div>
      <div className="feedback-message">
        {correct ? (
          <>
            <strong>せいかい！</strong>
            <span>やったね、そのちょうし！</span>
          </>
        ) : (
          <>
            <strong>おしい！</strong>
            <span>こたえは <b>{problem.answer}</b> だよ</span>
          </>
        )}
      </div>
      <button ref={buttonRef} type="button" className="next-button" onClick={onNext}>
        {isLast ? "けっかを みる" : "つぎの もんだい"}
        <ArrowRight size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

function ResultPage({
  type,
  score,
  onRestart,
}: {
  type: ProblemType;
  score: number;
  onRestart: () => void;
}) {
  const info = problemTypeInfo[type];
  const message = score === 10
    ? "パーフェクト！ すごい！"
    : score >= 8
      ? "とっても よくできました！"
      : score >= 5
        ? "いいちょうし！ もういちど やってみよう"
        : "れんしゅうすれば もっとできるよ！";

  return (
    <div className={`app-shell result-shell practice-${info.color}`}>
      <Background />
      <header className="practice-header content-width">
        <Brand compact />
      </header>
      <main className="result-main content-width">
        <section className="result-card">
          <Confetti />
          <div className="result-trophy" aria-hidden="true"><Trophy size={52} /></div>
          <div className="eyebrow"><Sparkles size={16} /> 10もん チャレンジ</div>
          <h1>ゴール！</h1>
          <p>{message}</p>
          <div className="result-score" aria-label={`10問中 ${score}問正解`}>
            <span><Star fill="currentColor" size={31} /></span>
            <strong>{score}</strong>
            <small>/ 10もん</small>
          </div>
          <div className="result-stars" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => (
              <Star key={index} fill={index < score ? "currentColor" : "none"} />
            ))}
          </div>
          <div className="result-actions">
            <button type="button" onClick={onRestart} className="again-button">
              <RotateCcw size={19} />
              もういちど
            </button>
            <Link to="/" className="home-button">
              <Home size={19} />
              島を えらぶ
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
