import "./JobDetails.css";
import useExecutions from "../../hooks/useExecutions";
import { useNavigate } from "react-router-dom";

function JobDetails({ job, onClose }) {
    const navigate = useNavigate();
    const {
        executions,
        loading: executionsLoading,
        error: executionsError,
      } = useExecutions(job.id);
  return (
    <div className="job-details">
      <div className="details-header">
        <h2>{job.name}</h2>

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>

      <p>{job.description || "No description"}</p>
      <p><strong>Job ID:</strong> {job.id}</p>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>URL:</strong> {job.url}</p>
      <p><strong>Timezone:</strong> {job.timezone}</p>
      <p>
        <strong>Schedule:</strong> {job.scheduleType} — {job.scheduleValue}
      </p>
      <p><strong>Max retries:</strong> {job.maxRetries}</p>

      <div className="execution-history">
  <h3>Execution History</h3>

  {executionsLoading && <p>Loading execution history...</p>}

  {executionsError && (
    <p className="error-message">{executionsError}</p>
  )}

  {!executionsLoading &&
    !executionsError &&
    executions.length === 0 && (
      <p>No executions found for this job.</p>
    )}

  {executions.length > 0 && (
    <div className="execution-list">
      {executions.map((execution) => (
        <div
        className="execution-row"
        key={execution.id}
        onClick={() => navigate(`/executions/${execution.id}`)}
        role="link"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            navigate(`/executions/${execution.id}`);
          }
        }}
      >
          <p>
            <strong>Scheduled:</strong>{" "}
            {execution.scheduledAt
              ? new Date(execution.scheduledAt).toLocaleString()
              : "—"}
          </p>

          <p>
            <strong>Status:</strong> {execution.status}
          </p>

          <p>
            <strong>Duration:</strong>{" "}
            {execution.durationMs != null
              ? `${execution.durationMs} ms`
              : "—"}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
}

export default JobDetails;