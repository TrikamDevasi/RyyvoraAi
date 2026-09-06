export function ThemeScript() {
  const code = `
    (function() {
      try {
        var savedTheme = localStorage.getItem('ss_theme');
        var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        var theme = savedTheme || (prefersLight ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default ThemeScript;
