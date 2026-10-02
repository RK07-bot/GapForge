import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "./landing.scss";

const Landing = () => {
  const { user, loading, handleGoogleSignIn } = useAuth();
  const navigate = useNavigate();

  const onSignIn = async () => {
    const signedInUser = await handleGoogleSignIn();

    if (signedInUser) {
      navigate("/analyze");
    }
  };

  const onAnalyze = () => {
    navigate("/analyze");
  };

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__content">
          <h1>
            Crack your <span>interview</span>,
            <br />
            gap by gap.
          </h1>

          <p>
            GapForge reads your resume next to the job description and creates a
            personalized interview plan with the questions you are likely to
            face and the skills you need to improve.
          </p>

          {user ? (
            <button className="landing-hero__cta" onClick={onAnalyze}>
              Analyze your resume
            </button>
          ) : (
            <button
              className="landing-hero__cta"
              onClick={onSignIn}
              disabled={loading}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.5 0 10.4-1.9 14.2-5.2l-6.5-5.5c-2.1 1.5-4.7 2.3-7.7 2.3-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.4 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>

        <div className="landing-hero__visual">
          <div className="landing-hero__glow"></div>

          <div className="landing-hero__mini-card">
            <span>AI INTERVIEW PREP</span>
            <strong>Resume → Job Description → Interview Plan</strong>

            <div className="landing-hero__mini-line"></div>

            <div className="landing-hero__mini-items">
              <span>✓ Match analysis</span>
              <span>✓ Technical questions</span>
              <span>✓ Behavioral questions</span>
              <span>✓ Skill gaps</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
