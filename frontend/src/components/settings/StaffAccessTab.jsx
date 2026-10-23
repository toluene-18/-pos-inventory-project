import { useState } from 'react';
import Icon from '../ui/Icon';
import StaffModal from './StaffModal';

export default function StaffAccessTab({
  staff,
  currentUser,
  onSaveMember,
  onToggleStatus,
  onDeleteMember,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const totalMembers = staff.length;
  const ownerCount = staff.filter(s => s.role === 'owner').length;
  const cashierCount = staff.filter(s => s.role === 'cashier').length;
  const inactiveCount = staff.filter(s => s.status === 'inactive').length;

  function handleOpenCreate() {
    setEditingMember(null);
    setModalOpen(true);
  }

  function handleOpenEdit(member) {
    setEditingMember(member);
    setModalOpen(true);
  }

  return (
    <div className="settings-panel">
      <div className="settings-panel-head">
        <div className="panel-title-with-icon">
          <span className="settings-panel-icon">
            <Icon name="users" size={18} />
          </span>
          <div>
            <h3>Staff & access</h3>
            <p>Owners run the store; cashiers ring up sales and see only their own receipts.</p>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Icon name="plus" size={15} /> Add staff
        </button>
      </div>

      <div className="settings-stat-cards">
        <div className="set-stat-card">
          <span className="set-stat-icon">
            <Icon name="users" size={18} />
          </span>
          <div className="set-stat-info">
            <strong>{totalMembers}</strong>
            <small>Team members</small>
          </div>
        </div>

        <div className="set-stat-card">
          <span className="set-stat-icon set-stat-icon--owner">
            <Icon name="shield" size={18} />
          </span>
          <div className="set-stat-info">
            <strong>{ownerCount}</strong>
            <small>Owners</small>
          </div>
        </div>

        <div className="set-stat-card">
          <span className="set-stat-icon set-stat-icon--cashier">
            <Icon name="user" size={18} />
          </span>
          <div className="set-stat-info">
            <strong>{cashierCount}</strong>
            <small>Cashiers</small>
          </div>
        </div>

        <div className="set-stat-card">
          <span className="set-stat-icon set-stat-icon--inactive">
            <Icon name="alert" size={18} />
          </span>
          <div className="set-stat-info">
            <strong>{inactiveCount}</strong>
            <small>Inactive</small>
          </div>
        </div>
      </div>

      <div className="staff-table-card">
        <table className="staff-table">
          <thead>
            <tr>
              <th>STAFF MEMBER</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => {
              const isYou = member.email === currentUser?.email || member.id === currentUser?.id;
              const initials = (member.name || 'ST')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map(w => w[0])
                .join('')
                .toUpperCase();

              const isActive = member.status === 'active';

              return (
                <tr key={member.id || member.email}>
                  <td>
                    <div className="staff-member-cell">
                      <span className="staff-avatar">{initials}</span>
                      <div className="staff-meta">
                        <strong>
                          {member.name} {isYou && <span className="you-pill">You</span>}
                        </strong>
                        <small>{member.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`staff-role-badge staff-role-badge--${member.role}`}>
                      <Icon name={member.role === 'owner' ? 'shield' : 'user'} size={13} />
                      {member.role === 'owner' ? 'Owner / Admin' : member.role === 'manager' ? 'Manager' : 'Cashier'}
                    </span>
                  </td>
                  <td>
                    <span className={`staff-status-dot ${isActive ? 'staff-status-dot--active' : 'staff-status-dot--inactive'}`}>
                      <i aria-hidden="true" />
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="staff-actions-wrap">
                      <button
                        type="button"
                        className="btn-action"
                        onClick={() => handleOpenEdit(member)}
                        title="Edit staff member"
                      >
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      {!isYou && (
                        <>
                          <button
                            type="button"
                            className="btn-action"
                            onClick={() => onToggleStatus(member.id)}
                            title={isActive ? 'Deactivate staff account' : 'Reactivate staff account'}
                          >
                            <Icon name="refresh" size={12} /> {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className="btn-action btn-action--danger"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete "${member.name}" from the staff roster?`)) {
                                onDeleteMember?.(member.id);
                              }
                            }}
                            title="Delete staff account"
                          >
                            <Icon name="trash" size={12} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="staff-table-footer-note">
          Adding a staff member registers them in this roster. Login accounts stay linked to the seed logins until the Laravel API is wired in.
        </div>
      </div>

      <StaffModal
        isOpen={modalOpen}
        member={editingMember}
        onClose={() => setModalOpen(false)}
        onSave={onSaveMember}
      />
    </div>
  );
}
