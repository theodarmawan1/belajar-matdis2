// ========================================
// Matematika Diskrit — Theme Toggle
// ========================================

(function() {
  const STORAGE_KEY = 'matdis-theme';
  
  // Get saved theme or default to dark
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }
  
  // Apply theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Update toggle button icon
    const knob = document.querySelector('.theme-toggle__knob');
    if (knob) {
      knob.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }
  
  // Initialize on load
  applyTheme(getSavedTheme());
  
  // Setup toggle after DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        const current = getSavedTheme();
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
    
    // Set initial knob text
    const knob = document.querySelector('.theme-toggle__knob');
    if (knob) {
      knob.textContent = getSavedTheme() === 'dark' ? '🌙' : '☀️';
    }
  });
})();
