
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";
import "../style/history.scss";

function scoreClass(score) {
  if (score >= 75) return "score--good";
  if (score >= 50) return "score--mid";
  return "score--low";
}

function formatDate(dateString) {
  if (!dateString) return "Unknown date";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function reportTitle(report) {
  if (report.jobTitle) return report.jobTitle;

  if (!report.jobDescription) {
    return "Untitled report";
  }

  return report.jobDescription.length > 60
    ? report.jobDescription.slice(0, 60) + "..."
    : report.jobDescription;
}

const History = () => {
  const { reports, loading, getReports, deleteReport } = useInterview();

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadReports = async () => {
      setError("");

      try {
        await getReports();
      } catch (err) {
        console.error("Failed to load report history:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load your report history.";

        setError(message);
      }
    };

    loadReports();
  }, []);

  const handleDelete = async (event, reportId) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this interview report?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(reportId);
    setError("");

    try {
      await deleteReport(reportId);
    } catch (err) {
      console.error("Delete report error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete this report.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReports = reports.filter((report) => {
    const haystack = `
      ${report.jobTitle || ""}
      ${report.companyName || ""}
      ${report.jobDescription || ""}
    `.toLowerCase();

    return haystack.includes(search.toLowerCase().trim());
  });

  if (loading && reports.length === 0) {
    return (
      <main className="history-state">
        <div className="history-state__spinner"></div>

        <h1>Loading report history...</h1>

        <p>Fetching your previous interview reports.</p>
      </main>
    );
  }

  if (error && reports.length === 0) {
    return (
      <main className="history-state">
        <div className="history-state__icon history-state__icon--error">
          !
        </div>

        <h1>Unable to load your history</h1>

        <p>{error}</p>

        <button
          className="history-state__button"
          onClick={async () => {
            setError("");

            try {
              await getReports();
            } catch (err) {
              console.error(err);

              setError(
                err?.response?.data?.message ||
                  "Unable to load your report history.",
              );
            }
          }}
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="history-page">
      <div className="history-header">
        <div>
          <h1>Report history</h1>

          <p>
            {reports.length} report
            {reports.length === 1 ? "" : "s"} generated from your resume.
          </p>
        </div>

        <input
          className="history-search"
          type="text"
          placeholder="Search role or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search report history"
        />
      </div>

      {reports.length === 0 ? (
        <div className="history-empty">
          <p>You haven't generated any reports yet.</p>

          <button
            className="button primary-button"
            onClick={() => navigate("/analyze")}
          >
            Analyze your resume
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="history-empty">
          <p>
            No reports match <strong>&quot;{search}&quot;</strong>.
          </p>

          <button
            className="button primary-button"
            onClick={() => setSearch("")}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="history-list">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="history-card"
              onClick={() => navigate(`/interview/${report._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate(`/interview/${report._id}`);
                }
              }}
            >
              <div
                className={`history-card__score ${scoreClass(
                  report.matchScore,
                )}`}
              >
                <span>{Math.round(report.matchScore || 0)}</span>
                <small>%</small>
              </div>

              <div className="history-card__body">
                <p className="history-card__title">
                  {reportTitle(report)}
                  {report.companyName ? ` · ${report.companyName}` : ""}
                </p>

                <p className="history-card__date">
                  {formatDate(report.createdAt)}
                </p>

                <div className="history-card__tags">
                  {(report.skillGaps || []).slice(0, 3).map((gap) => (
                    <span key={gap.skill} className="skill-tag">
                      {gap.skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="history-card__actions">
                <button
                  type="button"
                  className="history-card__delete"
                  onClick={(event) =>
                    handleDelete(event, report._id)
                  }
                  disabled={deletingId === report._id}
                  aria-label={`Delete ${reportTitle(report)}`}
                  title="Delete report"
                >
                  {deletingId === report._id ? (
                    <span className="history-card__delete-spinner"></span>
                  ) : (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  )}
                </button>

                <span className="history-card__arrow">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default History;

