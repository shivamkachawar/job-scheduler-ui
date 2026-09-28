import { useCallback, useEffect, useState } from "react";
import { fetchJobs } from "../services/jobService";

function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshJobs = useCallback(async () => {
    try {
      setError("");

      const data = await fetchJobs();
      setJobs(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  return { jobs, loading, error, refreshJobs };
}

export default useJobs;