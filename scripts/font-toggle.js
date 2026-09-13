(function() {
  var STORAGE_KEY = 'notes_font_pref'; // font id, or 'default'

  var FONT_OPTIONS = [
    { id: 'default', label: 'Normal (page default)', category: null },

    { id: 'atkinson', label: 'Atkinson Hyperlegible', category: 'Best for long-form reading',
      google: 'Atkinson+Hyperlegible:wght@400;700', family: "'Atkinson Hyperlegible', sans-serif" },
    { id: 'lora', label: 'Lora', category: 'Best for long-form reading',
      google: 'Lora:wght@400;600;700', family: "'Lora', serif" },
    { id: 'source-serif', label: 'Source Serif 4', category: 'Best for long-form reading',
      google: 'Source+Serif+4:wght@400;600;700', family: "'Source Serif 4', serif" },
    { id: 'merriweather', label: 'Merriweather', category: 'Best for long-form reading',
      google: 'Merriweather:wght@400;700', family: "'Merriweather', serif" },

    { id: 'comic-neue', label: 'Comic Neue', category: 'Fun & playful',
      google: 'Comic+Neue:wght@400;700', family: "'Comic Neue', 'Comic Sans MS', cursive" },
    { id: 'nunito', label: 'Nunito', category: 'Fun & playful',
      google: 'Nunito:wght@400;700;800', family: "'Nunito', sans-serif" },
    { id: 'quicksand', label: 'Quicksand', category: 'Fun & playful',
      google: 'Quicksand:wght@400;600;700', family: "'Quicksand', sans-serif" },
    { id: 'baloo2', label: 'Baloo 2', category: 'Fun & playful',
      google: 'Baloo+2:wght@400;600;700', family: "'Baloo 2', cursive" },
    { id: 'fredoka', label: 'Fredoka', category: 'Fun & playful',
      google: 'Fredoka:wght@400;600;700', family: "'Fredoka', sans-serif" },

    { id: 'lexend', label: 'Lexend', category: 'Dyslexia-friendly',
      google: 'Lexend:wght@400;600;700', family: "'Lexend', sans-serif" },
    { id: 'opendyslexic', label: 'OpenDyslexic', category: 'Dyslexia-friendly',
      cdnfonts: 'opendyslexic', family: "'Open Dyslexic', sans-serif" }
  ];

  var CATEGORY_ORDER = ['Best for long-form reading', 'Fun & playful', 'Dyslexia-friendly'];
  var loadedFontIds = {};

  function getOption(id) {
    for (var i = 0; i < FONT_OPTIONS.length; i++) {
      if (FONT_OPTIONS[i].id === id) return FONT_OPTIONS[i];
    }
    return FONT_OPTIONS[0];
  }

  function loadFontAssets(option) {
    if (!option || option.id === 'default' || loadedFontIds[option.id]) return;
    loadedFontIds[option.id] = true;

    if (option.google) {
      if (!document.getElementById('gf-preconnect-1')) {
        var pc1 = document.createElement('link');
        pc1.id = 'gf-preconnect-1';
        pc1.rel = 'preconnect';
        pc1.href = 'https://fonts.googleapis.com';
        var pc2 = document.createElement('link');
        pc2.id = 'gf-preconnect-2';
        pc2.rel = 'preconnect';
        pc2.href = 'https://fonts.gstatic.com';
        pc2.crossOrigin = 'anonymous';
        document.head.appendChild(pc1);
        document.head.appendChild(pc2);
      }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=' + option.google + '&display=swap';
      document.head.appendChild(link);
    } else if (option.cdnfonts) {
      var link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.href = 'https://fonts.cdnfonts.com/css/' + option.cdnfonts;
      document.head.appendChild(link2);
    }
  }

  function injectOverrideStyle() {
    if (document.getElementById('notes-font-override')) return;
    var style = document.createElement('style');
    style.id = 'notes-font-override';
    document.head.appendChild(style);
    return style;
  }

  function applyFont(id) {
    var option = getOption(id);
    loadFontAssets(option);
    var style = document.getElementById('notes-font-override');
    if (!style) style = injectOverrideStyle();

    document.documentElement.setAttribute('data-notes-font', option.id);

    if (option.id === 'default') {
      style.textContent = '';
    } else {
      style.textContent =
        'html[data-notes-font="' + option.id + '"] body,\n' +
        'html[data-notes-font="' + option.id + '"] *:not(.material-icons):not([class*="icon-"]) {\n' +
        '  font-family: ' + option.family + ' !important;\n' +
        '}';
    }
  }

  function savePreference(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
  }

  function loadPreference() {
    try { return localStorage.getItem(STORAGE_KEY) || 'default'; } catch (e) { return 'default'; }
  }

  function buildPanel() {
    var panel = document.createElement('div');
    panel.id = 'font-picker-panel';
    panel.style.cssText = [
      'position:fixed', 'bottom:64px', 'right:20px', 'z-index:999998',
      'background:#111118', 'color:#e8e8f0', 'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:14px', 'padding:14px', 'width:230px', 'max-height:60vh',
      'overflow-y:auto', 'font-family:sans-serif', 'font-size:13px',
      'box-shadow:0 8px 28px rgba(0,0,0,0.45)', 'display:none'
    ].join(';');

    var title = document.createElement('div');
    title.textContent = 'Reading font';
    title.style.cssText = 'font-weight:700;margin-bottom:10px;font-size:12px;letter-spacing:.03em;color:#a8a1ff;text-transform:uppercase;';
    panel.appendChild(title);

    var defaultOpt = getOption('default');
    panel.appendChild(buildOptionRow(defaultOpt));

    CATEGORY_ORDER.forEach(function(cat) {
      var heading = document.createElement('div');
      heading.textContent = cat;
      heading.style.cssText = 'margin:12px 0 6px;font-size:11px;font-weight:700;color:#8888a8;text-transform:uppercase;letter-spacing:.03em;';
      panel.appendChild(heading);

      FONT_OPTIONS.filter(function(o) { return o.category === cat; }).forEach(function(o) {
        panel.appendChild(buildOptionRow(o));
      });
    });

    return panel;
  }

  function buildOptionRow(option) {
    var row = document.createElement('button');
    row.type = 'button';
    row.textContent = option.label;
    row.dataset.fontId = option.id;
    row.style.cssText = [
      'display:block', 'width:100%', 'text-align:left', 'background:transparent',
      'border:none', 'color:#e8e8f0', 'padding:7px 8px', 'border-radius:8px',
      'cursor:pointer', 'font-size:13px', 'margin-bottom:2px', 'transition:background .15s'
    ].join(';');
    row.addEventListener('mouseenter', function() { row.style.background = 'rgba(255,255,255,0.08)'; });
    row.addEventListener('mouseleave', function() {
      row.style.background = row.dataset.active === 'true' ? 'rgba(108,99,255,0.25)' : 'transparent';
    });
    row.addEventListener('click', function() {
      applyFont(option.id);
      savePreference(option.id);
      updateActiveRow(option.id);
    });
    return row;
  }

  function updateActiveRow(activeId) {
    var rows = document.querySelectorAll('#font-picker-panel button[data-font-id]');
    rows.forEach(function(row) {
      var isActive = row.dataset.fontId === activeId;
      row.dataset.active = isActive ? 'true' : 'false';
      row.style.background = isActive ? 'rgba(108,99,255,0.25)' : 'transparent';
      row.style.fontWeight = isActive ? '700' : '400';
    });
  }

  function buildToggleButton(panel) {
    var btn = document.createElement('button');
    btn.id = 'font-toggle-btn';
    btn.type = 'button';
    btn.title = 'Change reading font';
    btn.textContent = 'Aa 🔤';
    btn.setAttribute('aria-label', 'Change reading font');
    btn.style.cssText = [
      'position:fixed', 'bottom:20px', 'right:20px', 'z-index:999998',
      'background:#111118', 'color:#e8e8f0', 'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:100px', 'padding:10px 16px', 'font-family:sans-serif', 'font-size:13px',
      'font-weight:600', 'cursor:pointer', 'box-shadow:0 4px 16px rgba(0,0,0,0.35)',
      'opacity:0.85', 'transition:opacity .2s'
    ].join(';');
    btn.addEventListener('mouseenter', function() { btn.style.opacity = '1'; });
    btn.addEventListener('mouseleave', function() { btn.style.opacity = '0.85'; });
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function(e) {
      if (panel.style.display !== 'none' && !panel.contains(e.target) && e.target !== btn) {
        panel.style.display = 'none';
      }
    });
    return btn;
  }

  function init() {
    injectOverrideStyle();
    var panel = buildPanel();
    var btn = buildToggleButton(panel);
    document.body.appendChild(panel);
    document.body.appendChild(btn);

    var saved = loadPreference();
    applyFont(saved);
    updateActiveRow(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
