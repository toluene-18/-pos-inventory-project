import { useState } from 'react';
import Icon from '../ui/Icon';
import { confirmAction } from '../../utils/confirmAlert';
import '../../styles/settings-staff.css';

export default function StaffManagementTab({
  staff,
  loading,
  currentUser,
  onUpdateStaff,
}) {
  const [actingId, setActingId] = useState(null);
  const isOwner = currentUser?.role === 'owner';

  const pendingList = staff.filter(s => s.status === 'pending');
  const activeList = staff.filter(s => s.status !== 'pending');

  async function handleAction(userId, { role, status }) {
    setActingId(userId);
    try {
      await onUpdateStaff(userId, { role, status });
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="settings-section">
      <div className="settings-section-head">
        <div>
          <h3>Staff & Team Management</h3>
          <p>
            {isOwner
              ? 'Approve new staff signups, manage roles, and activate or deactivate team member access.'
              : 'View team members and role assignments.'}
          </p>
        </div>
      </div>

      {pendingList.length > 0 && isOwner && (
        <div className="pending-approvals-box">
          <div className="pending-approvals-head">
            <span className="pending-approvals-badge">{pendingList.length}</span>
            <h4>Pending Staff Approvals</h4>
          </div>
          <div className="pending-cards-grid">
            {pendingList.map(member => (
              <div key={member.id} className="pending-card">
                <div className="member-avatar">
                  {member.name?.slice(0, 2).toUpperCase() || 'ST'}
                </div>
                <div className="member-details">
                  <strong>{member.name}</strong>
                  <small>{member.email}</small>
                  <span className="role-requested">
                    Requested: <em>{member.role}</em>
                  </span>
                </div>
                <div className="pending-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={actingId === member.id}
                    onClick={() =>
                      handleAction(member.id, {
                        role: member.role || 'cashier',
                        status: 'active',
                      })
                    }
                  >
                    <Icon name="check" size={14} /> Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={actingId === member.id}
                    onClick={() =>
                      handleAction(member.id, {
                        role: member.role || 'cashier',
                        status: 'inactive',
                      })
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="settings-table-card">
        <h4>All Staff Members ({staff.length})</h4>
        {loading ? (
          <div className="settings-loading">Loading staff directory...</div>
        ) : staff.length === 0 ? (
          <div className="settings-empty">No registered staff found.</div>
        ) : (
          <table className="settings-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                {isOwner && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {activeList.map(member => {
                const isCurrent = member.id === currentUser?.id;
                const joined = new Date(member.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <tr key={member.id}>
                    <td>
                      <div className="member-cell">
                        <span className="member-avatar member-avatar--sm">
                          {member.name?.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <strong>
                            {member.name} {isCurrent && <em className="tag-you">(You)</em>}
                          </strong>
                          <small>{member.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {isOwner && !isCurrent ? (
                        <select
                          className="role-select"
                          value={member.role}
                          disabled={actingId === member.id}
                          onChange={e =>
                            handleAction(member.id, {
                              role: e.target.value,
                              status: member.status,
                            })
                          }
                        >
                          <option value="cashier">Cashier</option>
                          <option value="manager">Manager</option>
                          <option value="owner">Owner</option>
                        </select>
                      ) : (
                        <span className={`staff-role-pill staff-role-pill--${member.role}`}>
                          {member.role.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`staff-status-pill staff-status-pill--${member.status}`}
                      >
                        {member.status === 'active'
                          ? 'Active'
                          : member.status === 'pending'
                          ? 'Pending'
                          : 'Inactive'}
                      </span>
                    </td>
                    <td>{joined}</td>
                    {isOwner && (
                      <td className="text-right">
                        {!isCurrent && (
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              member.status === 'active'
                                ? 'btn-secondary'
                                : 'btn-primary'
                            }`}
                            disabled={actingId === member.id}
                            onClick={async () => {
                              const isDeactivating = member.status === 'active';
                              if (isDeactivating) {
                                const res = await confirmAction({
                                  title: 'Deactivate Staff Member',
                                  text: `Are you sure you want to deactivate ${member.name}'s account?`,
                                  confirmButtonText: 'Yes, Deactivate',
                                  isDanger: true,
                                });
                                if (!res.isConfirmed) return;
                              }
                              handleAction(member.id, {
                                role: member.role,
                                status: isDeactivating ? 'inactive' : 'active',
                              });
                            }}
                          >
                            {member.status === 'active' ? 'Deactivate' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
