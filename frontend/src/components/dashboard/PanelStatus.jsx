function PanelStatus({ loading, error, empty, emptyMessage, children }) {
  if (loading) {
    return (
      <p className="panel-status" aria-live="polite">
        Loading…
      </p>
    );
  }

  if (error) {
    return (
      <p className="panel-status panel-status--error" role="alert">
        {error}
      </p>
    );
  }

  if (empty) {
    return <p className="panel-status">{emptyMessage}</p>;
  }

  return children;
}

export default PanelStatus;
