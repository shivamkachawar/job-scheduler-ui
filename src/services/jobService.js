const API_BASE_URL = "http://localhost:8080";
const USER_ID = "957d9fd3-cf6d-4f77-9373-0c93dcc17e58";

export async function fetchJobs() {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs?userId=${USER_ID}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}

export async function fetchJobById(jobId) {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs/${jobId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job details");
  }

  return response.json();
}

export async function fetchExecutions(jobId, page = 0, size = 10) {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs/${jobId}/executions?page=${page}&size=${size}`
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch execution history");
    }
  
    return response.json();
}

export async function fetchExecutionById(executionId) {
    const response = await fetch(
      `${API_BASE_URL}/api/executions/${executionId}`
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch execution details");
    }
  
    return response.json();
}

export async function createJob(jobData) {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs?userId=${USER_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      }
    );
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to create job");
    }
  
    return response.json();
  }
  export async function pauseJob(jobId) {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs/${jobId}/pause`,
      {
        method: "PATCH",
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to pause job");
    }
  }
  
  export async function resumeJob(jobId) {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs/${jobId}/resume`,
      {
        method: "PATCH",
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to resume job");
    }
  }
  
  export async function deleteJob(jobId) {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs/${jobId}`,
      {
        method: "DELETE",
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to delete job");
    }
  }