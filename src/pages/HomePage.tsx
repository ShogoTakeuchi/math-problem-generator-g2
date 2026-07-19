import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router";
import { Background } from "../components/Background";
import { Brand } from "../components/Brand";
import { problemTypeInfo, problemTypes } from "../lib/problems";
import {
  emptyProgress,
  getTotalStars,
  loadProgress,
  resetProgress,
} from "../lib/progress";

export function HomePage() {
  const [progress, setProgress] = useState(loadProgress);
  const totalStars = getTotalStars(progress);

  const handleReset = () => {
    if (!window.confirm("これまでの きろくを ぜんぶ けしますか？")) return;
    resetProgress();
    setProgress(emptyProgress());
  };

  return (
    <div className="app-shell home-shell">
      <Background />
      <header className="site-header content-width">
        <Brand />
        <div className="star-counter" aria-label={`あつめた星 ${totalStars}こ`}>
          <Star aria-hidden="true" fill="currentColor" size={19} />
          <span>あつめた ほし</span>
          <strong>{totalStars}</strong>
        </div>
      </header>

      <main className="home-main content-width">
        <section className="hero" aria-labelledby="home-title">
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            まいにち 10もん チャレンジ
          </div>
          <h1 id="home-title">
            きょうは どの島へ
            <br />
            <span>ぼうけんに いく？</span>
          </h1>
          <p>すきな けいさんを えらんで、ほしを あつめよう！</p>
        </section>

        <section className="course-grid" aria-label="れんしゅうコース">
          {problemTypes.map((type, index) => {
            const info = problemTypeInfo[type];
            const best = progress[type].best;

            return (
              <Link
                to={`/practice/${type}`}
                key={type}
                className={`course-card course-${info.color}`}
                aria-label={`${info.label}をはじめる。最高 ${best}問正解`}
              >
                <span className="course-number">0{index + 1}</span>
                <div className="course-icon" aria-hidden="true">
                  {info.icon}
                </div>
                <div className="course-copy">
                  <span>{info.description}</span>
                  <h2>{info.label}</h2>
                  <div className="course-example">{info.example} = ?</div>
                </div>
                <div className="course-bottom">
                  <span className="best-score">
                    <Star size={16} fill="currentColor" aria-hidden="true" />
                    さいこう {best}/10
                  </span>
                  <span className="course-arrow" aria-hidden="true">
                    <ArrowRight size={21} />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="journey-card" aria-label="ぼうけんのきろく">
          <div className="journey-icon" aria-hidden="true">
            <BookOpen size={26} />
          </div>
          <div className="journey-copy">
            <span>ぼうけんの きろく</span>
            <strong>{totalStars < 40 ? `あと ${40 - totalStars}こで コンプリート！` : "ぜんぶの島を コンプリート！"}</strong>
          </div>
          <div
            className="journey-progress"
            role="progressbar"
            aria-label="全コースの達成度"
            aria-valuemin={0}
            aria-valuemax={40}
            aria-valuenow={totalStars}
          >
            <span style={{ width: `${(totalStars / 40) * 100}%` }} />
          </div>
          <b>{totalStars} / 40</b>
        </section>
      </main>

      <footer className="site-footer content-width">
        <span>ちょっとずつで だいじょうぶ。きょうも たのしく やってみよう！</span>
        <small className="copyright">© 2026 Shogo Takeuchi</small>
        <button type="button" onClick={handleReset} className="reset-button">
          <RotateCcw size={15} aria-hidden="true" />
          きろくを リセット
        </button>
      </footer>
    </div>
  );
}
