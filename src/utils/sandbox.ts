export function generatePreviewHtml(compiledOutput: {
  js?: string;
  css?: string;
  html?: string;
  framework?: string;
}): string {
  const { js, css, html, framework } = compiledOutput;

  let runtimeScripts = '';
  if (framework === 'react') {
    runtimeScripts = `
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>`;
  } else if (framework === 'vue') {
    runtimeScripts = `
      <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>`;
  } else if (framework === 'svelte') {
    runtimeScripts = `
      <script src="https://unpkg.com/svelte@4/compiler.cjs.js"><\/script>`;
  }

  const cssBlock = css ? `<style>${css}</style>` : '';
  const bodyContent = html || '<div id="app"></div>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  ${cssBlock}
  ${runtimeScripts}
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; }
    #app { padding: 16px; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  ${bodyContent}
  ${js ? `<script type="${framework === 'react' ? 'text/babel' : 'text/javascript'}">${js}<\/script>` : ''}
</body>
</html>`;
}

export function generateErrorHtml(error: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compilation Error</title>
  <style>
    body { margin: 0; padding: 40px; font-family: 'SF Mono', 'Fira Code', monospace; background: #0d1117; color: #f85149; }
    .error-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 16px; }
    .error-message { white-space: pre-wrap; word-break: break-word; line-height: 1.6; font-size: 0.9rem; color: #c9d1d9; }
  </style>
</head>
<body>
  <div class="error-title">Compilation Error</div>
  <div class="error-message">${error.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
</body>
</html>`;
}
