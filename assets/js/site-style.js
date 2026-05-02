// Site-style toggle. Switches between the classic (minima) presentation and a
// QEX-magazine presentation ported from
// https://github.com/Treit/scratch/blob/main/qexify/qexify.py
//
// Persists the user's choice via localStorage.
(function () {
  var STYLE_KEY = 'site-style';
  var THEME_KEY = 'qex-theme';
  var DEFAULT_STYLE = 'qex';
  var THEME_ORDER = ['auto', 'light', 'dark'];

  function currentStyle() {
    return document.documentElement.getAttribute('data-style') || DEFAULT_STYLE;
  }

  function storedTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      return (t === 'light' || t === 'dark') ? t : 'auto';
    } catch (e) { return 'auto'; }
  }

  function prefersDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
    var resolvedDark = (theme === 'dark') || (theme === 'auto' && prefersDark());
    if (resolvedDark) {
      document.documentElement.setAttribute('data-qex-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-qex-theme');
    }
    try {
      if (theme === 'auto') localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    syncButtons();
  }

  function nextTheme(t) {
    var i = THEME_ORDER.indexOf(t);
    return THEME_ORDER[(i + 1) % THEME_ORDER.length];
  }

  function themeLabel(t) {
    if (t === 'dark') return 'Dark';
    if (t === 'light') return 'Light';
    return 'Auto';
  }

  function syncButtons() {
    var style = currentStyle();
    var theme = storedTheme();
    var sBtn = document.getElementById('siteStyleToggle');
    var tSel = document.getElementById('qexThemeSelect');
    if (sBtn) {
      sBtn.textContent = style === 'qex' ? 'Classic' : 'QEX';
      sBtn.title = 'Click to switch to ' + (style === 'qex' ? 'Classic' : 'QEX');
      sBtn.setAttribute('aria-pressed', style === 'qex' ? 'true' : 'false');
    }
    if (tSel) {
      tSel.value = theme;
      tSel.style.display = style === 'qex' ? '' : 'none';
    }
  }

  function wireUp() {
    var sBtn = document.getElementById('siteStyleToggle');
    var tSel = document.getElementById('qexThemeSelect');
    if (sBtn) {
      sBtn.addEventListener('click', function () {
        applyStyle(currentStyle() === 'qex' ? 'classic' : 'qex');
      });
    }
    if (tSel) {
      tSel.addEventListener('change', function () {
        applyTheme(tSel.value);
      });
    }
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var listener = function () {
        if (storedTheme() === 'auto') applyTheme('auto');
      };
      if (mq.addEventListener) mq.addEventListener('change', listener);
      else if (mq.addListener) mq.addListener(listener);
    }
    syncButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireUp);
  } else {
    wireUp();
  }
})();
