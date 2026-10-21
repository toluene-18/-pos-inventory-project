import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon';
import useNotifications from '../hooks/useNotifications';
import '../styles/notifications.css';

const TYPE_ICON = { sale: 'money', low: 'alert', out: 'alert' };

/** NotificationMenu — bell button with unread badge and dropdown list. */
function NotificationMenu({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const { items, unreadCount, markAllRead } = useNotifications();
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
    onNavigate?.(item.target);
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
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button type="button" className="notif-mark" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
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

export default NotificationMenu;
