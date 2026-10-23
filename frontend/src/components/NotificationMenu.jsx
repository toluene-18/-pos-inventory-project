import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon';
import useNotifications from '../hooks/useNotifications';
import { canAccess, pageByName } from '../routes/navigation';
import '../styles/notifications.css';

const TYPE_ICON = { sale: 'money', low: 'alert', out: 'alert' };

export default function NotificationMenu({ user, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const { items, unreadCount, pendingStaff, approveStaff, markAllRead } = useNotifications(user);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = event => {
      if (event.type === 'keydown' ? event.key === 'Escape' : !ref.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  function openItem(item) {
    setOpen(false);
    if (canAccess(user, pageByName(item.target))) onNavigate?.(item.target);
  }

  async function handleAccept(staffId) {
    try {
      setAcceptingId(staffId);
      await approveStaff(staffId);
    } catch {
      // Ignore
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <div className="notif" ref={ref}>
      <button
        type="button"
        className="topbar-icon-btn"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <Icon name="bell" size={18} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel" role="dialog" aria-label="Notifications">
          <div className="notif-head">
            <strong>Notifications &amp; Requests</strong>
            {unreadCount > 0 && (
              <button type="button" className="notif-mark" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {pendingStaff.length > 0 && (
            <div className="notif-requests-block">
              <div className="notif-requests-head">
                <span>New User Requests</span>
                <span className="notif-requests-count">{pendingStaff.length} pending</span>
              </div>
              <ul className="notif-requests-list">
                {pendingStaff.map(staff => (
                  <li key={staff.id} className="notif-request-item">
                    <div className="notif-request-info">
                      <strong>{staff.name}</strong>
                      <small>{staff.email} · {staff.role || 'cashier'}</small>
                    </div>
                    <button
                      type="button"
                      className="notif-btn-accept"
                      onClick={() => handleAccept(staff.id)}
                      disabled={acceptingId === staff.id}
                    >
                      {acceptingId === staff.id ? 'Accepting...' : 'Accept'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {items.length === 0 && pendingStaff.length === 0 ? (
            <p className="notif-empty">You're all caught up.</p>
          ) : (
            <ul className="notif-list">
              {items.map(item => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`notif-item notif-item--${item.type}${item.unread ? ' is-unread' : ''}`}
                    onClick={() => openItem(item)}
                  >
                    <span className="notif-icon"><Icon name={TYPE_ICON[item.type]} size={15} /></span>
                    <span className="notif-copy">
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <time>{item.time}</time>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
