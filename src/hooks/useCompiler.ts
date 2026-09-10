import { useState, useCallback, useRef } from 'react';
import { compile, type CompileResult } from '../services/compilers';
import { generatePreviewHtml, generateErrorHtml } from '../utils/sandbox';

export type CompileStatus = 'idle' | 'compiling' | 'success' | 'error';

export function useCompiler() {
  const [status, setStatus] = useState<CompileStatus>('idle');
  const [output, setOutput] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<CompileResult | null>(null);
  const previewRef = useRef<HTMLIFrameElement | null>(null);

  const run = useCallback(async (code: string, language: string, filename: string) => {
    setStatus('compiling');
    setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] Compiling ${filename}...`]);

    try {
      const result = await compile(code, language, filename);
      setLastResult(result);

      if (result.success) {
        setStatus('success');
        setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] Compilation successful.`]);

        if (result.warnings && result.warnings.length > 0) {
          result.warnings.forEach(w => {
            setOutput(prev => [...prev, `⚠ Warning: ${w}`]);
          });
        }

        const html = generatePreviewHtml({
          js: result.js,
          css: result.css,
          html: result.html,
          framework: result.framework,
        });

        if (previewRef.current) {
          previewRef.current.srcdoc = html;
        }
      } else {
        setStatus('error');
        setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error: ${result.error}`]);

        if (previewRef.current) {
          previewRef.current.srcdoc = generateErrorHtml(result.error || 'Unknown compilation error');
        }
      }
    } catch (e: any) {
      setStatus('error');
      setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] Fatal error: ${e.message}`]);
      if (previewRef.current) {
        previewRef.current.srcdoc = generateErrorHtml(e.message);
      }
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([]);
    setStatus('idle');
    setLastResult(null);
  }, []);

  return {
    status,
    output,
    lastResult,
    previewRef,
    run,
    clearOutput,
  };
}
