import { useState } from 'react';
import Icon from '../../components/ui/Icon';
import StoreProfileTab from '../../components/settings/StoreProfileTab';
import StaffAccessTab from '../../components/settings/StaffAccessTab';
import PreferencesTab from '../../components/settings/PreferencesTab';
import ReceiptBasicsTab from '../../components/settings/ReceiptBasicsTab';
import ActivityLogTab from '../../components/settings/ActivityLogTab';
import { SETTINGS_TABS } from '../../components/settings/settingsData';
import { useSettingsData } from '../../components/settings/useSettingsData';
import '../../styles/settings.css';
import '../../styles/settings-tabs.css';
import '../../styles/settings-staff.css';
import '../../styles/settings-receipt.css';
import '../../styles/settings-activity.css';

export default function Settings({ user, onSessionExpired }) {
  const [activeTab, setActiveTab] = useState('profile');

  const {
    profile,
    staff,
    preferences,
    receiptConfig,
    activityLog,
    toastMsg,
    handleProfileChange,
    handlePreferencesChange,
    handleReceiptChange,
    handleSaveStaffMember,
    handleToggleStaffStatus,
    handleDeleteStaffMember,
    handleApplyThresholdToAll,
  } = useSettingsData(user, onSessionExpired);

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <h2>Settings</h2>
          <p>Set up CWG Provisions Store, manage your team and fine-tune how stock alerts and receipts behave.</p>
        </div>
        <div className="settings-saved-pill">
          <Icon name="check" size={14} />
          <span>All changes saved</span>
        </div>
      </header>

      {toastMsg && (
        <div className="settings-toast-banner" role="status">
          <Icon name="check" size={15} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="settings-body-layout">
        <aside className="settings-nav-sidebar">
          {SETTINGS_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`settings-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="settings-nav-icon">
                  <Icon name={tab.icon} size={18} />
                </span>
                <div className="settings-nav-text">
                  <div className="settings-nav-title">{tab.title}</div>
                  <div className="settings-nav-sub">{tab.subtitle}</div>
                </div>
              </button>
            );
          })}
        </aside>

        <main className="settings-main-area">
          {activeTab === 'profile' && (
            <StoreProfileTab profile={profile} onChange={handleProfileChange} />
          )}

          {activeTab === 'staff' && (
            <StaffAccessTab
              staff={staff}
              currentUser={user}
              onSaveMember={handleSaveStaffMember}
              onToggleStatus={handleToggleStaffStatus}
              onDeleteMember={handleDeleteStaffMember}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesTab
              preferences={preferences}
              productCount={14}
              lowStockCount={4}
              onChange={handlePreferencesChange}
              onApplyThresholdToAll={handleApplyThresholdToAll}
            />
          )}

          {activeTab === 'receipt' && (
            <ReceiptBasicsTab
              receiptConfig={receiptConfig}
              profile={profile}
              onChange={handleReceiptChange}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityLogTab activityLog={activityLog} staff={staff} />
          )}
        </main>
      </div>
    </div>
  );
}
