import { CompilationResult, CompilerConfig, DiagnosticItem } from '../types';

/**
 * Parses GCC/Clang diagnostic output into structured items
 */
export function parseDiagnostics(text: string): DiagnosticItem[] {
  if (!text) return [];

  const items: DiagnosticItem[] = [];
  const lines = text.split('\n');

  // Match pattern: <file>:<line>:<col>: <type>: <message>
  // e.g.: prog.c:12:5: error: expected ';' before 'return'
  // e.g.: prog.c:8:9: warning: unused variable 'a' [-Wunused-variable]
  const diagnosticRegex = /^(?:.*?\/)?([^:]+):(\d+):(\d+):\s*(error|warning|note|fatal error):\s*(.+)$/i;

  lines.forEach((line, index) => {
    const match = line.match(diagnosticRegex);
    if (match) {
      const file = match[1];
      const lineNum = parseInt(match[2], 10);
      const colNum = parseInt(match[3], 10);
      const rawType = match[4].toLowerCase();
      const message = match[5].trim();

      const type: 'error' | 'warning' | 'note' | 'info' = 
        rawType.includes('error') ? 'error' :
        rawType.includes('warning') ? 'warning' :
        rawType.includes('note') ? 'note' : 'info';

      items.push({
        id: `diag-${index}-${lineNum}-${colNum}`,
        file,
        line: lineNum,
        column: colNum,
        type,
        message,
        raw: line,
      });
    }
  });

  return items;
}

/**
 * Normalizes compiler ID to target C language compilers on Wandbox
 */
export function normalizeCompiler(compiler: string): string {
  if (!compiler) return 'gcc-head-c';
  if (compiler === 'gcc-head' || compiler === 'gcc') return 'gcc-head-c';
  if (compiler === 'gcc-13.2.0') return 'gcc-13.2.0-c';
  if (compiler === 'gcc-12.3.0') return 'gcc-12.3.0-c';
  if (compiler === 'clang-head' || compiler === 'clang') return 'clang-head-c';
  if (compiler === 'clang-16.0.0' || compiler === 'clang-17.0.1') return 'clang-head-c';
  if (!compiler.endsWith('-c')) return `${compiler}-c`;
  return compiler;
}

/**
 * Builds list of individual compiler flags
 */
export function buildCompilerOptionList(config: CompilerConfig): string[] {
  const options: string[] = [];

  // Language standard
  if (config.standard) {
    options.push(config.standard);
  }

  // Optimization level
  if (config.optimization) {
    options.push(config.optimization);
  }

  // Warnings
  if (config.warnings?.all) options.push('-Wall');
  if (config.warnings?.extra) options.push('-Wextra');
  if (config.warnings?.pedantic) options.push('-pedantic');
  if (config.warnings?.error) options.push('-Werror');

  // Link math library if requested
  if (config.linkMath) {
    options.push('-lm');
  }

  // Custom user flags (split by space)
  if (config.customFlags && config.customFlags.trim()) {
    const flags = config.customFlags.trim().split(/\s+/).filter(Boolean);
    options.push(...flags);
  }

  return options;
}

/**
 * Builds compiler option string from CompilerConfig (display format)
 */
export function buildCompilerOptions(config: CompilerConfig): string {
  return buildCompilerOptionList(config).join(' ');
}

/**
 * Execute C code against compiler service
 */
export async function executeCCode(
  code: string,
  stdin: string,
  config: CompilerConfig
): Promise<CompilationResult> {
  const startTime = performance.now();
  const optionList = buildCompilerOptionList(config);
  const compilerOptionsRaw = optionList.join('\n');
  const normalizedCompiler = normalizeCompiler(config.compiler);

  const payload: Record<string, any> = {
    compiler: normalizedCompiler,
    code,
    stdin: stdin || '',
    'compiler-option-raw': compilerOptionsRaw,
  };

  let responseData: any = null;

  // 1. First attempt: Use local Vite proxy with a 15-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch('/api/wandbox/api/compile.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      responseData = await res.json();
    }
  } catch (err) {
    console.warn('Local proxy call failed, attempting direct public endpoint fallback...', err);
  }

  // 2. Fallback attempt: Direct Wandbox call (enabled by Wandbox CORS headers)
  if (!responseData) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const directRes = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (directRes.ok) {
        responseData = await directRes.json();
      } else {
        throw new Error(`Compiler service returned HTTP status: ${directRes.status}`);
      }
    } catch (fallbackErr: any) {
      const endTime = performance.now();
      const errorMsg = fallbackErr?.message || 'Network error connecting to compiler service.';


      return {
        status: '1',
        exitCode: 1,
        programOutput: '',
        programError: '',
        compilerOutput: '',
        compilerError: errorMsg,
        compilerMessage: `Compilation failed to start: ${errorMsg}\nPlease check your network connection.`,
        diagnostics: [
          {
            id: 'net-err',
            type: 'error',
            file: 'system',
            line: 1,
            column: 1,
            message: errorMsg,
            raw: errorMsg,
          },
        ],
        executionTimeMs: Math.round(endTime - startTime),
        timestamp: Date.now(),
        success: false,
      };
    }
  }

  const endTime = performance.now();
  const executionTimeMs = Math.round(endTime - startTime);

  const rawStatus = responseData.status ?? '0';
  const exitCode = parseInt(rawStatus, 10) || 0;
  const compilerMessage = responseData.compiler_message || responseData.compiler_error || '';
  const programOutput = responseData.program_output || responseData.program_message || '';
  const programError = responseData.program_error || '';

  const diagnostics = parseDiagnostics(compilerMessage);
  const hasErrors = diagnostics.some((d) => d.type === 'error') || exitCode !== 0;

  return {
    status: rawStatus,
    exitCode,
    signal: responseData.signal,
    programOutput,
    programError,
    compilerOutput: responseData.compiler_output || '',
    compilerError: responseData.compiler_error || '',
    compilerMessage,
    diagnostics,
    executionTimeMs,
    timestamp: Date.now(),
    success: exitCode === 0 && !hasErrors,
  };
}

/**
 * Quick format C code indentation
 */
export function formatCCode(code: string): string {
  const lines = code.split('\n');
  let indentLevel = 0;
  const indentSize = 4;
  const formattedLines: string[] = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();

    if (!line) {
      formattedLines.push('');
      continue;
    }

    // Decrease indent for closing brace at the start of line
    if (line.startsWith('}') || line.startsWith('*/')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Preprocessor directives stay at column 0
    if (line.startsWith('#')) {
      formattedLines.push(line);
      continue;
    }

    const currentIndent = ' '.repeat(indentLevel * indentSize);
    formattedLines.push(currentIndent + line);

    // Count open braces minus close braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    indentLevel += openBraces - closeBraces;
    if (indentLevel < 0) indentLevel = 0;
  }

  return formattedLines.join('\n');
}
