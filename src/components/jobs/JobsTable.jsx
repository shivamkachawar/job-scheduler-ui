import "./JobsTable.css";

function JobsTable({
  jobs,
  onJobClick,
  onPause,
  onResume,
  onDelete,
}) {
  return (
    <div className="table-container">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Job Name</th>
            <th>Status</th>
            <th>Schedule</th>
            <th>HTTP Method</th>
            <th>Next Run</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              onClick={() => onJobClick(job.id)}
              className="clickable-row"
            >
              <td className="job-name">{job.name}</td>

              <td>
                <span
                  className={`status-badge ${job.status.toLowerCase()}`}
                >
                  {job.status}
                </span>
              </td>

              <td>
                <div>{job.scheduleType}</div>
                <span className="schedule-value">
                  {job.scheduleValue}
                </span>
              </td>

              <td>{job.httpMethod}</td>

              <td>
                {job.nextRunAt
                  ? new Date(job.nextRunAt).toLocaleString()
                  : "—"}
              </td>

              <td>
                <div className="job-actions">
                  {job.status === "ACTIVE" && (
                    <button
                      className="action-button pause-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onPause(job.id);
                      }}
                    >
                      Pause
                    </button>
                  )}

                  {job.status === "PAUSED" && (
                    <button
                      className="action-button resume-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onResume(job.id);
                      }}
                    >
                      Resume
                    </button>
                  )}

                  {job.status !== "DELETED" && (
                    <button
                      className="action-button delete-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(job.id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobsTable;