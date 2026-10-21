function Topbar({ activePage }) {
  return (
    <header className="dashboard-topbar">
      <div>
        <p className="dashboard-breadcrumb">CWG Retail / Workspace</p>
        <h1>{activePage}</h1>
      </div>

      <div className="dashboard-status">
        <span className="dashboard-status-dot" />
        Signed in
      </div>
    </header>
  );
}

export default Topbar;
