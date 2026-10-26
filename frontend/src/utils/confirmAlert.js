import Swal from 'sweetalert2';
import '../styles/sweetalert-theme.css';

/**
 * Modern, theme-aware confirmation modal powered by SweetAlert2.
 * Replaces native window.confirm and window.alert with beautiful styled popups.
 */
export async function confirmAction({
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  isDanger = false,
  icon = 'warning',
}) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    background: isLight ? '#ffffff' : '#14191f',
    color: isLight ? '#171b1f' : '#f8fafc',
    iconColor: isDanger ? 'var(--rose)' : 'var(--amber)',
    customClass: {
      popup: 'cwg-swal-popup',
      title: 'cwg-swal-title',
      htmlContainer: 'cwg-swal-html',
      confirmButton: isDanger ? 'cwg-swal-confirm-danger' : 'cwg-swal-confirm',
      cancelButton: 'cwg-swal-cancel',
      actions: 'cwg-swal-actions',
    },
    buttonsStyling: false,
  });
}

export async function alertSuccess({ title = 'Success', text = '' }) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'Done',
    background: isLight ? '#ffffff' : '#14191f',
    color: isLight ? '#171b1f' : '#f8fafc',
    iconColor: 'var(--green)',
    customClass: {
      popup: 'cwg-swal-popup',
      title: 'cwg-swal-title',
      htmlContainer: 'cwg-swal-html',
      confirmButton: 'cwg-swal-confirm',
      actions: 'cwg-swal-actions',
    },
    buttonsStyling: false,
  });
}

export async function alertError({ title = 'Error', text = '' }) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Close',
    background: isLight ? '#ffffff' : '#14191f',
    color: isLight ? '#171b1f' : '#f8fafc',
    iconColor: 'var(--rose)',
    customClass: {
      popup: 'cwg-swal-popup',
      title: 'cwg-swal-title',
      htmlContainer: 'cwg-swal-html',
      confirmButton: 'cwg-swal-confirm-danger',
      actions: 'cwg-swal-actions',
    },
    buttonsStyling: false,
  });
}
