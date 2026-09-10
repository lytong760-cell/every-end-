declare module '@babel/standalone' {
  export function transform(code: string, options?: any): any;
}

declare module '@vue/compiler-sfc' {
  export interface SFCDescriptor {
    template?: { content: string };
    script?: { content: string };
    styles: { content: string }[];
  }
  export interface ParseResult {
    descriptor: SFCDescriptor;
    errors: string[];
  }
  export function parse(source: string): ParseResult;
  export function compileTemplate(options: {
    source: string;
    filename: string;
    id: string;
    compilerOptions: any;
  }): { code: string };
}

declare module 'svelte/compiler' {
  export interface CompileResult {
    js: { code: string }[];
    css?: { code: string };
    error?: string;
  }
  export function compile(source: string, options?: any): CompileResult;
}
