export type CompileResult = {
  success: boolean;
  js?: string;
  css?: string;
  html?: string;
  error?: string;
  warnings?: string[];
};

const UNSUPPORTED_LANGUAGES = new Set([
  'python', 'java', 'c', 'cpp', 'csharp', 'go', 'rust',
  'ruby', 'php', 'sql', 'shell', 'swift', 'kotlin', 'lua',
  'haskell', 'clojure', 'elixir', 'erlang', 'fsharp', 'assembly',
  'scala', 'perl', 'ocaml', 'dart', 'r', 'matlab', 'powershell',
  'vb', 'groovy', 'cobol', 'fortran', 'delphi', 'abap', 'sas', 'julia',
]);

function getUnsupportedMessage(language: string): string {
  return `Language "${language}" is not supported for in-browser compilation yet.\n\nSupported languages: JavaScript, TypeScript, JSX, TSX, Vue, Svelte, CSS, HTML.\n\nFor other languages, consider using a backend compilation service.`;
}

export async function compile(code: string, language: string, filename: string): Promise<CompileResult> {
  if (!code.trim()) {
    return { success: false, error: 'Cannot compile empty code.' };
  }

  if (UNSUPPORTED_LANGUAGES.has(language)) {
    return { success: false, error: getUnsupportedMessage(language) };
  }

  try {
    switch (language) {
      case 'javascript':
      case 'jsx':
      case 'typescript':
      case 'tsx':
        return await compileWithBabel(code, language, filename);
      case 'vue':
        return await compileVue(code, filename);
      case 'svelte':
        return await compileSvelte(code, filename);
      case 'css':
        return { success: true, css: code };
      case 'html':
        return { success: true, html: code };
      default:
        return await compileWithBabel(code, 'javascript', filename);
    }
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function compileWithBabel(code: string, language: string, filename: string): Promise<CompileResult> {
  const Babel = await import('@babel/standalone');
  const presets: string[] = [];

  if (language === 'typescript' || language === 'tsx') {
    presets.push('@babel/preset-typescript');
  }
  if (language === 'jsx' || language === 'tsx') {
    presets.push('@babel/preset-react');
  }

  try {
    const result = Babel.transform(code, {
      presets,
      filename,
    });
    return { success: true, js: result.code };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function compileVue(code: string, filename: string): Promise<CompileResult> {
  const [VueCompilerSFC, Babel] = await Promise.all([
    import('@vue/compiler-sfc'),
    import('@babel/standalone'),
  ]);

  const { descriptor, errors } = VueCompilerSFC.parse(code);
  if (errors.length > 0) {
    return { success: false, error: errors.join('\n') };
  }

  let jsCode = '';
  let cssCode = '';

  if (descriptor.template) {
    const compiled = VueCompilerSFC.compileTemplate({
      source: descriptor.template.content,
      filename,
      id: 'xxx',
      compilerOptions: { mode: 'function' },
    });
    jsCode += compiled.code + '\n';
  }

  if (descriptor.script) {
    const scriptResult = Babel.transform(descriptor.script!.content, {
      presets: ['@babel/preset-typescript'],
      filename,
    });
    jsCode += scriptResult.code + '\n';
  }

  if (descriptor.styles.length > 0) {
    cssCode = descriptor.styles.map(s => s.content).join('\n');
  }

  return { success: true, js: jsCode, css: cssCode, framework: 'vue' };
}

async function compileSvelte(code: string, filename: string): Promise<CompileResult> {
  const { compile } = await import('svelte/compiler');
  const result = compile(code, { generate: 'dom', dev: false });

  if (result.js && Array.isArray(result.js) && result.js.length > 0) {
    const jsCode = typeof result.js[0].code === 'string' ? result.js[0].code : '';
    const cssCode = result.css?.code || '';
    return { success: true, js: jsCode, css: cssCode, framework: 'svelte' };
  }

  return { success: false, error: 'Failed to compile Svelte component' };
}

export function getSupportedLanguages(): string[] {
  return ['javascript', 'typescript', 'jsx', 'tsx', 'vue', 'svelte', 'css', 'html'];
}

export function isLanguageSupported(language: string): boolean {
  return !UNSUPPORTED_LANGUAGES.has(language);
}
