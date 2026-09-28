import "./PageHeader.css";

function PageHeader({ onCreateJob }) {
  return (
    <header className="page-header">
      <div>
        <h1>Jobs</h1>
        <p>Manage and monitor your scheduled jobs.</p>
      </div>

      <button
        className="create-button"
        onClick={onCreateJob}
      >
        + Create Job
      </button>
    </header>
  );
}

export default PageHeader;