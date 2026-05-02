// Site-style toggle. Switches between the classic (minima) presentation and a
// QEX-magazine presentation ported from
// https://github.com/Treit/scratch/blob/main/qexify/qexify.py
//
// Persists the user's choice via localStorage.
(function () {
  var STYLE_KEY = 'site-style';
  var THEME_KEY = 'qex-theme';
  var DEFAULT_STYLE = 'qex';

  function currentStyle() {
    return document.documentElement.getAttribute('data-style') || DEFAULT_STYLE;
  }
  function currentTheme() {
    return document.documentElement.getAttribute('data-qex-theme') === 'dark'
      ? 'dark'
      : 'light';
  }

  function applyStyle(style) {
    if (style === 'classic') {
      document.documentElement.setAttribute('data-style', 'classic');
    } else {
      document.documentElement.setAttribute('data-style', 'qex');
    }
    try { localStorage.setItem(STYLE_KEY, style); } catch (e) {}
    syncButtons();
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-qex-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-qex-theme');
    }
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    syncButtons();
  }

  function syncButtons() {
    var style = currentStyle();
    var theme = currentTheme();
    var sBtn = document.getElementById('siteStyleToggle');
    var tBtn = document.getElementById('qexThemeToggle');
    if (sBtn) {
      sBtn.textContent = style === 'qex' ? 'Classic' : 'QEX';
      sBtn.setAttribute('aria-pressed', style === 'qex' ? 'true' : 'false');
    }
    if (tBtn) {
      tBtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
      tBtn.style.display = style === 'qex' ? '' : 'none';
      tBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function wireUp() {
    var sBtn = document.getElementById('siteStyleToggle');
    var tBtn = document.getElementById('qexThemeToggle');
    if (sBtn) {
      sBtn.addEventListener('click', function () {
        applyStyle(currentStyle() === 'qex' ? 'classic' : 'qex');
      });
    }
    if (tBtn) {
      tBtn.addEventListener('click', function () {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });
    }
    syncButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireUp);
  } else {
    wireUp();
  }
})();
