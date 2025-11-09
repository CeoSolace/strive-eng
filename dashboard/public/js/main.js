// dashboard/public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Guild selector
  const guildSelect = document.getElementById('guild-select');
  if (guildSelect) {
    guildSelect.addEventListener('change', (e) => {
      const guildId = e.target.value;
      if (guildId) {
        window.location.href = `/?guild=${guildId}`;
      }
    });
  }

  // Module toggles
  const toggleSwitches = document.querySelectorAll('.toggle-switch input');
  toggleSwitches.forEach(switchEl => {
    switchEl.addEventListener('change', async (e) => {
      const module = switchEl.dataset.module;
      const enabled = e.target.checked;
      const guildId = document.body.dataset.guildId;

      try {
        const res = await fetch('/api/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guildId, module, enabled })
        });

        if (!res.ok) throw new Error('Failed to update module');
        showNotification(`Module ${module} ${enabled ? 'enabled' : 'disabled'}`, 'success');
      } catch (err) {
        console.error(err);
        showNotification('Failed to update module', 'error');
        switchEl.checked = !enabled; // revert
      }
    });
  });

  // Form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      const url = form.action || window.location.pathname;
      const method = form.method || 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          showNotification('Settings saved successfully', 'success');
          if (data.redirect) window.location.href = data.redirect;
        } else {
          const err = await res.json();
          showNotification(err.message || 'Failed to save', 'error');
        }
      } catch (err) {
        console.error(err);
        showNotification('Network error', 'error');
      }
    });
  });
});

function showNotification(message, type = 'info') {
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toasts styling dynamically
const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    opacity: 1;
    transition: opacity 0.3s;
  }
  .toast-success { background: #43b581; }
  .toast-error { background: #f04747; }
  .toast-info { background: #5865f2; }
`;
document.head.appendChild(style);
