import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="brand">Job Scheduler</h2>

      <nav className="sidebar-nav">
        <a href="#" className="nav-link active">
          Jobs
        </a>

        <a href="#" className="nav-link">
          Executions
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;