import { useState } from "react";
import "./JobsPage.css";

import PageHeader from "../components/layout/PageHeader";
import JobsTable from "../components/jobs/JobsTable";
import useJobs from "../hooks/useJobs";
import { createJob, pauseJob, resumeJob, deleteJob } from "../services/jobService";
import { useNavigate } from "react-router-dom";

function convertIndiaLocalToIso(value) {
    if (!value) return null;
  
    const [date, time] = value.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
  
    // Asia/Kolkata is UTC+05:30
    const utcMillis =
      Date.UTC(year, month - 1, day, hours, minutes) -
      330 * 60 * 1000;
  
    return new Date(utcMillis).toISOString();
}

function JobsPage() {
  const { jobs, loading, error, refreshJobs} = useJobs();
  const navigate = useNavigate();

  const [headers, setHeaders] = useState([
    { key: "", value: "" },
  ]);

  const [queryParams, setQueryParams] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [scheduleType, setScheduleType] = useState("ONE_TIME");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",

    httpMethod: "GET",
    url: "",
    timeoutMs: "",

    scheduleValue: "",
    startAt: "",
    timezone: "Asia/Kolkata",

    contentType: "application/json",
    body: "",

    maxRetries: "0",
    initialRetryDelayMs: "2000",
    maxRetryDelayMs: "30000",
  });

  const convertRowsToObject = (rows) => {
    return Object.fromEntries(
      rows
        .filter((row) => row.key.trim() !== "")
        .map((row) => [
          row.key.trim(),
          row.value,
        ])
    );
  };

  const parseRequestBody = (body) => {
    if (!body.trim()) {
      return null;
    }
  
    return JSON.parse(body);
  };

  const handleCreateJob = async (event) => {
    event.preventDefault();
  
    setIsSubmitting(true);
    setSubmitError("");
  
    try {
      const jobData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
  
        scheduleType,
        scheduleValue: formData.scheduleValue,
        timezone: formData.timezone,
  
        startAt:
          scheduleType === "INTERVAL" && formData.startAt
            ? convertIndiaLocalToIso(formData.startAt)
            : null,
  
        httpMethod: formData.httpMethod,
        url: formData.url.trim(),
        headers: convertRowsToObject(headers),
        queryParams: convertRowsToObject(queryParams),
  
        body: parseRequestBody(formData.body),
        contentType: formData.contentType.trim() || null,
  
        timeoutMs: formData.timeoutMs
          ? Number(formData.timeoutMs)
          : null,
  
        maxRetries: Number(formData.maxRetries),
        initialRetryDelayMs: Number(
          formData.initialRetryDelayMs
        ),
        maxRetryDelayMs: Number(formData.maxRetryDelayMs),
      };
  
      await createJob(jobData);
  
      setShowCreateForm(false);
      window.location.reload();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePause = async (jobId) => {
    try {
      await pauseJob(jobId);
      await refreshJobs();
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleResume = async (jobId) => {
    try {
      await resumeJob(jobId);
      await refreshJobs();
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }
  
    try {
      await deleteJob(jobId);
      await refreshJobs();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="main-content">
      <PageHeader
        onCreateJob={() => setShowCreateForm(true)}
      />

      <section className="jobs-section">
        {showCreateForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowCreateForm(false)}
          >
            <div
              className="create-job-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Create Job</h2>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowCreateForm(false)}
                >
                  &times;
                </button>
              </div>

              <form className="create-job-form"
              onSubmit={handleCreateJob}>
                {/* Basic Details */}
                <div className="form-section">
                  <h3>Basic Details</h3>

                  <div className="form-field">
                    <label htmlFor="job-name">
                      Job Name *
                    </label>

                    <input
                      id="job-name"
                      type="text"
                      placeholder="e.g. Daily Report"
                      maxLength={150}
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="job-description">
                      Description
                    </label>

                    <textarea
                      id="job-description"
                      placeholder="What does this job do?"
                      rows={3}
                      value={formData.description}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* HTTP Configuration */}
                <div className="form-section">
                  <h3>HTTP Configuration</h3>

                  <div className="form-field">
                    <label htmlFor="http-method">
                      HTTP Method *
                    </label>

                    <select
                      id="http-method"
                      value={formData.httpMethod}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          httpMethod: event.target.value,
                        }))
                      }
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="job-url">
                      Target URL *
                    </label>

                    <input
                      id="job-url"
                      type="url"
                      value={formData.url}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          url: event.target.value,
                        }))
                      }
                      placeholder="https://example.com/api"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="timeout-ms">
                      Timeout (milliseconds)
                    </label>

                    <input
                      id="timeout-ms"
                      type="number"
                      min="1"
                      value={formData.timeoutMs}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          timeoutMs: event.target.value,
                        }))
                      }
                      placeholder="Optional timeout in milliseconds"
                    />
                  </div>
                </div>

                {/* HTTP Headers */}
                <div className="form-section">
                  <h3>HTTP Headers</h3>

                  {headers.map((header, index) => (
                    <div
                      className="key-value-row"
                      key={index}
                    >
                      <input
                        placeholder="Header name"
                        value={header.key}
                        onChange={(event) => {
                          setHeaders((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    key: event.target.value,
                                  }
                                : item
                            )
                          );
                        }}
                      />

                      <input
                        placeholder="Header value"
                        value={header.value}
                        onChange={(event) => {
                          setHeaders((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    value: event.target.value,
                                  }
                                : item
                            )
                          );
                        }}
                      />

                      <button
                        type="button"
                        className="remove-row-button"
                        onClick={() =>
                          setHeaders((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-row-button"
                    onClick={() =>
                      setHeaders((prev) => [
                        ...prev,
                        { key: "", value: "" },
                      ])
                    }
                  >
                    + Add Header
                  </button>
                </div>

                {/* Query Parameters */}
                <form className="form-section">
                  <h3>Query Parameters</h3>

                  {queryParams.map((param, index) => (
                    <div
                      className="key-value-row"
                      key={index}
                    >
                      <input
                        placeholder="Parameter name"
                        value={param.key}
                        onChange={(event) => {
                          setQueryParams((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    key: event.target.value,
                                  }
                                : item
                            )
                          );
                        }}
                      />

                      <input
                        placeholder="Parameter value"
                        value={param.value}
                        onChange={(event) => {
                          setQueryParams((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    value: event.target.value,
                                  }
                                : item
                            )
                          );
                        }}
                      />

                      <button
                        type="button"
                        className="remove-row-button"
                        onClick={() =>
                          setQueryParams((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-row-button"
                    onClick={() =>
                      setQueryParams((prev) => [
                        ...prev,
                        { key: "", value: "" },
                      ])
                    }
                  >
                    + Add Parameter
                  </button>
                </form>

                {/* Request Body */}
                <div className="form-section">
                  <h3>Request Body</h3>

                  <div className="form-field">
                    <label htmlFor="content-type">
                      Content Type
                    </label>

                    <input
                      id="content-type"
                      type="text"
                      placeholder="application/json"
                      maxLength={100}
                      value={formData.contentType}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          contentType: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="request-body">
                      Body (JSON)
                    </label>

                    <textarea
                      id="request-body"
                      rows={6}
                      placeholder={`{
  "name": "Shivam",
  "active": true
}`}
                      value={formData.body}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          body: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Retry Configuration */}
                <div className="form-section">
                  <h3>Retry Configuration</h3>

                  <div className="form-field">
                    <label htmlFor="max-retries">
                      Maximum Retries *
                    </label>

                    <input
                        id="max-retries"
                        type="number"
                        min="0"
                        value={formData.maxRetries}
                        onChange={(event) =>
                            setFormData((prev) => ({
                                ...prev,
                                maxRetries: event.target.value,
                            }))
                        }
                    />

                    <small>
                      Number of retries after the initial attempt.
                    </small>
                  </div>

                  <div className="form-field">
                    <label htmlFor="initial-retry-delay">
                      Initial Retry Delay (milliseconds) *
                    </label>

                    <input
                        id="initial-retry-delay"
                        type="number"
                        min="1"
                        value={formData.initialRetryDelayMs}
                        onChange={(event) =>
                            setFormData((prev) => ({
                                ...prev,
                                initialRetryDelayMs: event.target.value,
                            }))
                        }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="max-retry-delay">
                      Maximum Retry Delay (milliseconds) *
                    </label>

                    <input
                        id="max-retry-delay"
                        type="number"
                        min="1"
                        value={formData.maxRetryDelayMs}
                        onChange={(event) =>
                            setFormData((prev) => ({
                                ...prev,
                                maxRetryDelayMs: event.target.value,
                            }))
                        }
                    />
                  </div>
                </div>

                {/* Schedule Configuration */}
                <div className="form-section">
                  <h3>Schedule Configuration</h3>

                  <div className="form-field">
                    <label htmlFor="schedule-type">
                      Schedule Type *
                    </label>

                    <select
                      id="schedule-type"
                      value={scheduleType}
                      onChange={(event) =>
                        setScheduleType(event.target.value)
                      }
                    >
                      <option value="ONE_TIME">
                        One-time
                      </option>
                      <option value="INTERVAL">
                        Interval
                      </option>
                      <option value="CRON">
                        Cron
                      </option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="timezone">
                      Timezone *
                    </label>

                    <input
                      id="timezone"
                      value={formData.timezone}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          timezone: event.target.value,
                        }))
                      }
                      placeholder="Asia/Kolkata"
                    />
                  </div>

                  {scheduleType === "ONE_TIME" && (
                    <div className="form-field">
                      <label htmlFor="run-at">
                        Run At *
                      </label>

                      <input
                        id="run-at"
                        type="datetime-local"
                        value={formData.scheduleValue}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            scheduleValue: event.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  {scheduleType === "INTERVAL" && (
                    <>
                      <div className="form-field">
                        <label htmlFor="interval">
                          Interval *
                        </label>

                        <input
                          id="interval"
                          placeholder="PT5M"
                          value={formData.scheduleValue}
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              scheduleValue: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="start-at">
                          Start At *
                        </label>

                        <input
                          id="start-at"
                          type="datetime-local"
                          value={formData.startAt}
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              startAt: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </>
                  )}

                  {scheduleType === "CRON" && (
                    <div className="form-field">
                      <label htmlFor="cron-expression">
                        Cron Expression *
                      </label>

                      <input
                        id="cron-expression"
                        placeholder="0 0 10 * * *"
                        value={formData.scheduleValue}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            scheduleValue: event.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
                {submitError && (
                    <p className="error-message">{submitError}</p>
                )}

                <div className="form-actions">
                    <button
                        className="cancel-button"
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        className="create-job-button"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Job"}
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && <p>Loading jobs...</p>}

        {error && (
          <p className="error-message">{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p>No jobs found. Create your first job!</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <JobsTable
            jobs={jobs}
            onJobClick={(jobId) => {
              navigate(`/jobs/${jobId}`);
            }}
            onPause={handlePause}
            onResume={handleResume}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
}

export default JobsPage;