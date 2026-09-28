import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import JobDetails from "../components/jobs/JobDetails";
import useJobDetails from "../hooks/useJobDetails";

function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    selectedJob,
    loading,
    error,
    loadJobDetails,
  } = useJobDetails();

  // Load the job identified by the URL
  useEffect(() => {
    loadJobDetails(jobId);
  }, [jobId]);

  return (
    <main className="main-content">
      <Link to="/">← Back to Jobs</Link>

      {loading && <p>Loading job details...</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => navigate("/")}
        />
      )}
    </main>
  );
}

export default JobDetailsPage;