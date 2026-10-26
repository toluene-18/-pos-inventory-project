import { useState, useEffect, useCallback } from 'react';
import {
  getStaff,
  updateStaffStatus,
  deleteStaffMember,
  getStoreSettings,
  updateStoreSettings,
} from '../../services/api';
import {
  DEFAULT_PROFILE,
  DEFAULT_STAFF,
  DEFAULT_PREFERENCES,
  DEFAULT_RECEIPT_CONFIG,
  INITIAL_ACTIVITY_LOG,
} from './settingsData';

export function useSettingsData(user, onSessionExpired) {
  const [toastMsg, setToastMsg] = useState('');

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cwg_store_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem('cwg_staff_roster');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('cwg_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [receiptConfig, setReceiptConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('cwg_receipt_config');
      return saved ? JSON.parse(saved) : DEFAULT_RECEIPT_CONFIG;
    } catch {
      return DEFAULT_RECEIPT_CONFIG;
    }
  });

  const [activityLog, setActivityLog] = useState(() => {
    try {
      const saved = localStorage.getItem('cwg_activity_log');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOG;
    } catch {
      return INITIAL_ACTIVITY_LOG;
    }
  });

  const fetchBackendStaff = useCallback(async () => {
    try {
      const data = await getStaff();
      if (Array.isArray(data)) {
        const shaped = data.map(d => ({
          ...d,
          lastActive: d.last_active || d.lastActive || 'Active recently',
        }));
        setStaff(shaped);
        localStorage.setItem('cwg_staff_roster', JSON.stringify(shaped));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchBackendStaff();
    getStoreSettings().then(data => {
      if (data && data.name) {
        setProfile(prev => {
          const merged = { ...prev, ...data };
          localStorage.setItem('cwg_store_profile', JSON.stringify(merged));
          return merged;
        });
      }
    }).catch(() => {});
  }, [fetchBackendStaff]);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  }

  function appendActivity(category, badge, title, detail) {
    const actorName = user?.name || 'Ayanbisi AbdulRahman';
    const initials = actorName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();

    const newEvent = {
      id: `evt-${Date.now()}`,
      category,
      badge,
      title,
      detail,
      actor: actorName,
      actorInitials: initials,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      createdAt: Date.now(),
    };

    setActivityLog(prev => {
      const updated = [newEvent, ...prev];
      localStorage.setItem('cwg_activity_log', JSON.stringify(updated));
      return updated;
    });
  }

  async function handleProfileChange(newProfile) {
    setProfile(newProfile);
    localStorage.setItem('cwg_store_profile', JSON.stringify(newProfile));
    try {
      await updateStoreSettings(newProfile);
    } catch (err) {
      console.error('Failed to update store settings on backend', err);
    }
    const loc = [newProfile.city, newProfile.state].filter(Boolean).join(', ');
    appendActivity(
      'profile',
      'Profile updated',
      'Updated store profile details',
      `${newProfile.name}${loc ? ` • ${loc}` : ''}`
    );
    showToast('Store profile saved successfully.');
  }

  function handlePreferencesChange(newPrefs) {
    const oldThreshold = preferences.defaultThreshold;
    setPreferences(newPrefs);
    localStorage.setItem('cwg_preferences', JSON.stringify(newPrefs));
    if (newPrefs.defaultThreshold !== oldThreshold) {
      appendActivity(
        'threshold',
        'Threshold changed',
        `Default reorder threshold changed from ${oldThreshold} to ${newPrefs.defaultThreshold}`,
        `New products will alert at ${newPrefs.defaultThreshold} units`
      );
    }
    showToast('Preferences saved successfully.');
  }

  function handleReceiptChange(newReceipt) {
    setReceiptConfig(newReceipt);
    localStorage.setItem('cwg_receipt_config', JSON.stringify(newReceipt));
    appendActivity(
      'receipt',
      'Receipt updated',
      'Updated receipt basics & format settings',
      `Currency: ${newReceipt.currency || '₦ NGN'} • Header/Footer updated`
    );
    showToast('Receipt configuration saved successfully.');
  }

  async function handleSaveStaffMember(member) {
    if (member.id) {
      try {
        await updateStaffStatus(member.id, { role: member.role, status: member.status || 'active' });
      } catch (err) {
        console.error('Failed to sync staff role to backend', err);
      }
    }

    setStaff(prev => {
      const exists = prev.some(s => s.id === member.id);
      const updated = exists
        ? prev.map(s => (s.id === member.id ? { ...s, ...member } : s))
        : [...prev, { ...member, id: Date.now(), lastActive: 'Added just now' }];
      localStorage.setItem('cwg_staff_roster', JSON.stringify(updated));
      return updated;
    });

    const isExisting = staff.some(s => s.id === member.id);
    appendActivity(
      'staff',
      isExisting ? 'Staff updated' : 'Staff added',
      isExisting ? `Updated ${member.name}'s account` : `Added ${member.name} as ${member.role}`,
      `${member.email} — ${member.role.toUpperCase()} access`
    );
    showToast(`Staff member ${member.name} saved.`);
  }

  async function handleToggleStaffStatus(id) {
    const target = staff.find(s => s.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'inactive' : 'active';
    try {
      await updateStaffStatus(id, { status: nextStatus });
    } catch (err) {
      console.error('Failed to update status on backend', err);
    }
    setStaff(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, status: nextStatus } : s));
      localStorage.setItem('cwg_staff_roster', JSON.stringify(updated));
      return updated;
    });
    appendActivity(
      'staff',
      'Access changed',
      nextStatus === 'inactive' ? `Deactivated ${target.name}` : `Reactivated ${target.name}`,
      `Account is now ${nextStatus}`
    );
    showToast(`Status for ${target.name} changed to ${nextStatus}.`);
  }

  async function handleDeleteStaffMember(id) {
    const target = staff.find(s => s.id === id);
    if (!target) return;
    try {
      await deleteStaffMember(id);
      setStaff(prev => {
        const updated = prev.filter(s => s.id !== id);
        localStorage.setItem('cwg_staff_roster', JSON.stringify(updated));
        return updated;
      });
      appendActivity(
        'staff',
        'Staff removed',
        `Deleted ${target.name}'s account`,
        `Removed ${target.name} (${target.email}) from roster`
      );
      showToast(`Staff member "${target.name}" removed from roster.`);
    } catch (err) {
      if (err.status === 404) {
        setStaff(prev => {
          const updated = prev.filter(s => s.id !== id);
          localStorage.setItem('cwg_staff_roster', JSON.stringify(updated));
          return updated;
        });
        showToast(`Staff member "${target.name}" removed from roster.`);
      } else {
        showToast(err.message || 'Failed to remove staff member.');
      }
    }
  }

  function handleApplyThresholdToAll() {
    appendActivity(
      'threshold',
      'Threshold applied',
      `Applied reorder threshold ${preferences.defaultThreshold} to 14 products`,
      'Bulk update across the whole catalogue from Preferences'
    );
    showToast(`Applied threshold ${preferences.defaultThreshold} across 14 inventory products.`);
  }

  return {
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
  };
}
