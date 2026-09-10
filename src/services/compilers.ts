import * as Babel from '@babel/standalone';
import * as Vue from 'vue';
import * as VueCompilerSFC from '@vue/compiler-sfc';
import * as SvelteCompiler from 'svelte/compiler';

export type CompileResult = {
  success: boolean;
  js?: string;
  css?: string;
  html?: string;
  error?: string;
  warnings?: string[];
};

const LANGUAGE_COMPILERS: Record<string, (code: string) => CompileResult> = {};

function registerCompiler(language: string, compiler: (code: string) => CompileResult) {
  LANGUAGE_COMPILERS[language] = compiler;
}

registerCompiler('javascript', (code) => {
  try {
    const result = Babel.transform(code, {
      presets: [],
      filename: 'input.js',
    });
    return { success: true, js: result.code };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});

registerCompiler('typescript', (code) => {
  try {
    const result = Babel.transform(code, {
      presets: ['@babel/preset-typescript'],
      filename: 'input.ts',
    });
    return { success: true, js: result.code };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});

registerCompiler('jsx', (code) => {
  try {
    const result = Babel.transform(code, {
      presets: ['@babel/preset-react'],
      filename: 'input.jsx',
    });
    return { success: true, js: result.code };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});

registerCompiler('tsx', (code) => {
  try {
    const result = Babel.transform(code, {
      presets: ['@babel/preset-typescript', '@babel/preset-react'],
      filename: 'input.tsx',
    });
    return { success: true, js: result.code };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});

registerCompiler('vue', (code) => {
  try {
    const { descriptor, errors } = VueCompilerSFC.parse(code);
    if (errors.length > 0) {
      return { success: false, error: errors.join('\n') };
    }

    let jsCode = '';
    let cssCode = '';

    if (descriptor.template) {
      const compiled = VueCompilerSFC.compileTemplate({
        source: descriptor.template.content,
        filename: 'Component.vue',
        id: 'xxx',
        compilerOptions: {
          mode: 'function',
        },
      });
      jsCode += compiled.code + '\n';
    }

    if (descriptor.script) {
      const script = descriptor.script!.content;
      const scriptResult = Babel.transform(script, {
        presets: ['@babel/preset-typescript'],
        filename: 'Component.vue',
      });
      jsCode += scriptResult.code + '\n';
    }

    if (descriptor.styles.length > 0) {
      cssCode = descriptor.styles.map(s => s.content).join('\n');
    }

    return { success: true, js: jsCode, css: cssCode, framework: 'vue' };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});

registerCompiler('svelte', (code) => {
  try {
    const result = SvelteCompiler.compile(code, { generate: 'dom', dev: false });
    if (result.js && Array.isArray(result.js) && result.js.length > 0) {
      const jsCode = typeof result.js[0].code === 'string' ? result.js[0].code : '';
      const cssCode = result.css?.code || '';
      return { success: true, js: jsCode, css: cssCode, framework: 'svelte' };
    }
    return { success: false, error: 'Failed to compile Svelte component' };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});

registerCompiler('css', (code) => {
  return { success: true, css: code };
});

registerCompiler('html', (code) => {
  return { success: true, html: code };
});

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

export function compile(code: string, language: string, filename: string): CompileResult {
  if (!code.trim()) {
    return { success: false, error: 'Cannot compile empty code.' };
  }

  if (UNSUPPORTED_LANGUAGES.has(language)) {
    return { success: false, error: getUnsupportedMessage(language) };
  }

  const compiler = LANGUAGE_COMPILERS[language] || LANGUAGE_COMPILERS['javascript'];
  return compiler(code);
}

export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_COMPILERS);
}

export function isLanguageSupported(language: string): boolean {
  return language in LANGUAGE_COMPILERS || !UNSUPPORTED_LANGUAGES.has(language);
}
