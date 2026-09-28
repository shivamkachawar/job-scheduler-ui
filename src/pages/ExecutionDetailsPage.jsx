import { Link, useParams } from "react-router-dom";

import useExecutionDetails from "../hooks/useExecutionDetails";

function ExecutionDetailsPage() {
  const { executionId } = useParams();

  const {
    execution,
    loading,
    error,
  } = useExecutionDetails(executionId);

  return (
    <main className="main-content">
      <Link to="/">← Back to Jobs</Link>

      <h1>Execution Details</h1>

      {loading && <p>Loading execution details...</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {execution && (
        <section>
          <h2>Execution Summary</h2>

          <p>
            <strong>Execution ID:</strong> {execution.id}
          </p>

          <p>
            <strong>Status:</strong> {execution.status}
          </p>

          <p>
            <strong>Scheduled At:</strong>{" "}
            {execution.scheduledAt
              ? new Date(execution.scheduledAt).toLocaleString()
              : "—"}
          </p>

          <h2>Attempts</h2>

          {execution.attempts?.length > 0 ? (
            execution.attempts.map((attempt) => (
              <div key={attempt.id}>
                <h3>Attempt {attempt.attemptNumber}</h3>

                <p>
                  <strong>Status:</strong> {attempt.status}
                </p>

                <p>
                  <strong>HTTP Status:</strong>{" "}
                  {attempt.httpStatusCode ?? "—"}
                </p>

                <p>
                  <strong>Error:</strong>{" "}
                  {attempt.errorMessage || "None"}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {attempt.durationMs != null
                    ? `${attempt.durationMs} ms`
                    : "—"}
                </p>
              </div>
            ))
          ) : (
            <p>No attempts recorded for this execution.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default ExecutionDetailsPage;