import { useEffect, useState } from "react";
import { fetchExecutions } from "../services/jobService";

function useExecutions(jobId) {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) {
      setExecutions([]);
      return;
    }

    let cancelled = false;

    async function loadExecutions() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchExecutions(jobId);

        if (!cancelled) {
          setExecutions(data.content);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExecutions();

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  return { executions, loading, error };
}

export default useExecutions;