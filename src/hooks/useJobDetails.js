import { useState } from "react";
import { fetchJobById } from "../services/jobService";

function useJobDetails() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadJobDetails(jobId) {
    setLoading(true);
    setError("");
    setSelectedJob(null);

    try {
      const data = await fetchJobById(jobId);
      setSelectedJob(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function clearJobDetails() {
    setSelectedJob(null);
    setError("");
  }

  return {
    selectedJob,
    loading,
    error,
    loadJobDetails,
    clearJobDetails,
  };
}

export default useJobDetails;