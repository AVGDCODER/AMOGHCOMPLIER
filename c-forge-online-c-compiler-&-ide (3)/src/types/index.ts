/**
 * Type definitions for C-Forge Online C Compiler & IDE
 */

export type CompilerEngine = 'gcc-head-c' | 'gcc-13.2.0-c' | 'gcc-12.3.0-c' | 'clang-head-c' | 'clang-17.0.1-c';

export type CStandard = '-std=c2x' | '-std=c17' | '-std=c11' | '-std=c99' | '-std=c89';

export type OptimizationLevel = '-O0' | '-O1' | '-O2' | '-O3' | '-Os';

export interface CompilerConfig {
  compiler: CompilerEngine;
  standard: CStandard;
  optimization: OptimizationLevel;
  warnings: {
    all: boolean; // -Wall
    extra: boolean; // -Wextra
    pedantic: boolean; // -pedantic
    error: boolean; // -Werror
  };
  linkMath: boolean; // -lm
  customFlags: string;
}

export interface DiagnosticItem {
  id: string;
  type: 'error' | 'warning' | 'note' | 'info';
  file: string;
  line: number;
  column: number;
  message: string;
  raw: string;
}

export interface CompilationResult {
  status: string; // "0" for success
  exitCode: number;
  signal?: string;
  programOutput: string;
  programError: string;
  compilerOutput: string;
  compilerError: string;
  compilerMessage: string;
  diagnostics: DiagnosticItem[];
  executionTimeMs: number;
  timestamp: number;
  success: boolean;
  asmOutput?: string;
}

export type EditorThemeId = 'one-dark' | 'monokai' | 'dracula' | 'nord' | 'cyber-noir';

export interface EditorThemeOption {
  id: EditorThemeId;
  name: string;
  description: string;
  bgHex: string;
  accentHex: string;
}

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  isMain?: boolean;
}

export interface SnippetExample {
  id: string;
  title: string;
  category: 'Beginner' | 'Data Structures' | 'Algorithms' | 'Pointers & Memory' | 'Low-Level';
  description: string;
  code: string;
  stdin?: string;
}
