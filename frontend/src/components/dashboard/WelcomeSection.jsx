import Icon from '../ui/Icon';

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** WelcomeSection — greeting, status banners, and quick actions. */
function WelcomeSection({ user, isOwner, error, truncated, onNavigate }) {
  const greeting = greetingForHour(new Date().getHours());
  const firstName = user?.name?.split(' ')[0] || user?.email || 'there';

  return (
    <section className="dash-welcome">
      <div className="dash-welcome-copy">
        <p className="dash-eyebrow">
          {greeting.toUpperCase()}, {firstName.toUpperCase()}
        </p>
        <h2>Here is how the store is doing today</h2>
        <p>
          {isOwner
            ? "Track today's takings, watch for low stock, and jump into checkout when a customer is waiting."
            : 'These figures show your own sales. Stock alerts use the current product list.'}
        </p>
        {error && (
          <p className="dash-banner dash-banner--error" role="alert">
            {error}
          </p>
        )}
        {truncated && (
          <p className="dash-banner">
            Chart and ranking use the most recent recorded sales in this
            period. Owner totals still come from the sales report.
          </p>
        )}
      </div>

      <div className="dash-welcome-actions">
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('Point of Sale')}>
          <Icon name="basket" size={16} />
          New sale
        </button>
        {isOwner && (
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('Products')}>
            <Icon name="plus" size={16} />
            Add product
          </button>
        )}
      </div>
    </section>
  );
}

export default WelcomeSection;
