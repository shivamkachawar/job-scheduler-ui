import { useEffect, useState } from "react";
import { fetchExecutionById } from "../services/jobService";

function useExecutionDetails(executionId) {
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!executionId) {
      setExecution(null);
      return;
    }

    let cancelled = false;

    async function loadExecution() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchExecutionById(executionId);

        if (!cancelled) {
          setExecution(data);
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

    loadExecution();

    return () => {
      cancelled = true;
    };
  }, [executionId]);

  return { execution, loading, error };
}

export default useExecutionDetails;