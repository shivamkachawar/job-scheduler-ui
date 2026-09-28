import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ExecutionDetailsPage from "./pages/ExecutionDetailsPage";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <Routes>
        <Route path="/" element={<JobsPage />} />

        <Route
          path="/jobs/:jobId"
          element={<JobDetailsPage />}
        />
        <Route
          path="/executions/:executionId"
          element={<ExecutionDetailsPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;