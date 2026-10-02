import React, { useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const { loading, generateReport } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");

  const resumeInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setResumeFile(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!resumeFile) {
      setError("Please upload your resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        resumeFile,
      });

      if (!data?._id) {
        throw new Error("The generated report ID was not returned.");
      }

      navigate(`/interview/${data._id}`);
    } catch (err) {
      console.error("Generate report error:", err);

      const validationErrors = err?.response?.data?.errors;

      const message = validationErrors?.length
        ? validationErrors.map((error) => error.message).join(", ")
        : err?.response?.data?.message ||
          err?.message ||
          "Failed to generate the interview report.";

      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    );
  }

  return (
    <main className="home">
      <div className="heading">
        <h1>Create your custom</h1>
        <h1>interview plan</h1>
      </div>

      <p>
        Generate a personalized interview report based on your job
        description
      </p>

      <form
        className="interview-input-group"
        onSubmit={handleSubmit}
      >
        <div className="left">
          <label htmlFor="jobDescription">
            Job Description
          </label>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            name="jobDescription"
            id="jobDescription"
            placeholder="Enter job description..."
          />
        </div>

        <div className="right">
          <div className="input-group resume-group">
            <label htmlFor="resume">
              Upload Resume
            </label>

            <div className="resume-upload">
              {!resumeFile ? (
                <label
                  htmlFor="resume"
                  className="resume-upload__empty"
                >
                  <span className="resume-upload__choose">
                    Choose File
                  </span>

                  <span className="resume-upload__hint">
                    PDF only
                  </span>
                </label>
              ) : (
                <div className="resume-upload__selected">
                  <div className="resume-upload__file">
                    <span className="resume-upload__icon">
                      PDF
                    </span>

                    <div className="resume-upload__info">
                      <span className="resume-upload__name">
                        {resumeFile.name}
                      </span>

                      <span className="resume-upload__size">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  <label
                    htmlFor="resume"
                    className="resume-upload__change"
                  >
                    Change
                  </label>
                </div>
              )}

              <input
                ref={resumeInputRef}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="generate-btn"
            disabled={loading}
          >
            Generate Interview Report
          </button>
        </div>
      </form>
    </main>
  );
};

export default Home;