(function() {
  if (sessionStorage.getItem('notes_auth') !== 'true') {
    document.documentElement.style.display = 'none';
    
    // Determine relative path back to root index.html
    var pathname = window.location.pathname;
    var target = '../index.html';
    
    // Handle root vs subfolder depth dynamically
    if (pathname.endsWith('index.html')) {
      var parts = pathname.split(/[/\\]/).filter(Boolean);
      if (parts.length > 1 && parts[parts.length - 1] === 'index.html' && parts[parts.length - 2] !== 'my-html-notes') {
        target = '../index.html';
      }
    }
    
    window.location.href = target;
  }
})();
