import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import './index.css';
import './styles/sweetalert-theme.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';

// Intercept legacy window.alert with modern SweetAlert2
window.alert = function (message) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  Swal.fire({
    title: 'Notification',
    text: String(message),
    icon: 'info',
    confirmButtonText: 'OK',
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
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
