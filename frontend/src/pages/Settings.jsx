import { useState, useEffect, useCallback } from 'react';
import Icon from '../components/ui/Icon';
import StaffManagementTab from '../components/settings/StaffManagementTab';
import StoreProfileTab from '../components/settings/StoreProfileTab';
import { getStaff, updateStaffStatus } from '../services/api';
import '../styles/settings.css';

export default function Settings({ user, onSessionExpired }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const isManagement = ['owner', 'manager'].includes(user?.role);
  const isOwner = user?.role === 'owner';

  const fetchStaffMembers = useCallback(async () => {
    if (!isManagement) return;
    try {
      setLoading(true);
      const data = await getStaff();
      setStaff(data);
      setError('');
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else setError(err.message || 'Failed to load staff roster.');
    } finally {
      setLoading(false);
    }
  }, [isManagement, onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  async function handleUpdateStaff(userId, payload) {
    try {
      setError('');
      const res = await updateStaffStatus(userId, payload);
      setStatusMsg(res.message || 'Staff member updated.');
      await fetchStaffMembers();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update staff member.');
    }
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <h2>System & Store Settings</h2>
          <p>Manage team members, store profile branding, and system preferences.</p>
        </div>
      </header>

      {statusMsg && (
        <div className="settings-alert settings-alert--success" role="status">
          <Icon name="check" size={16} /> {statusMsg}
        </div>
      )}

      {error && (
        <div className="settings-alert settings-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <div className="settings-tabs-bar">
        {isManagement && (
          <button
            type="button"
            className={`settings-nav-tab ${activeTab === 'staff' ? 'settings-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            <Icon name="staff" size={16} />
            <span>Staff Management</span>
            {staff.some(s => s.status === 'pending') && (
              <span className="tab-pending-dot" />
            )}
          </button>
        )}

        <button
          type="button"
          className={`settings-nav-tab ${activeTab === 'store' ? 'settings-nav-tab--active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <Icon name="pos" size={16} />
          <span>Store & Receipts</span>
        </button>

        <button
          type="button"
          className={`settings-nav-tab ${activeTab === 'account' ? 'settings-nav-tab--active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <Icon name="user" size={16} />
          <span>My Profile</span>
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'staff' && isManagement && (
          <StaffManagementTab
            staff={staff}
            loading={loading}
            currentUser={user}
            onUpdateStaff={handleUpdateStaff}
          />
        )}

        {activeTab === 'store' && (
          <StoreProfileTab isOwner={isOwner} />
        )}

        {activeTab === 'account' && (
          <div className="settings-section">
            <div className="settings-section-head">
              <div>
                <h3>My Account</h3>
                <p>Your current active credentials and system permissions.</p>
              </div>
            </div>

            <div className="account-details-grid">
              <div className="account-card">
                <div className="account-avatar-large">
                  {user?.name?.slice(0, 2).toUpperCase() || 'CW'}
                </div>
                <div className="account-meta">
                  <h3>{user?.name}</h3>
                  <p>{user?.email}</p>
                  <span className={`staff-role-pill staff-role-pill--${user?.role}`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="account-info-box">
                <div className="info-row">
                  <span className="info-label">Account Status</span>
                  <span className="text-green font-semibold">Active & Approved</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Store Domain</span>
                  <span>CWG Retail Suite — Lagos</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role Access Level</span>
                  <span>
                    {user?.role === 'owner'
                      ? 'Full Owner Privileges (All modules, staff approvals, financial metrics)'
                      : user?.role === 'manager'
                      ? 'Management Privileges (Products, inventory adjustments, reports)'
                      : 'Cashier Privileges (POS checkout, personal sales history)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
