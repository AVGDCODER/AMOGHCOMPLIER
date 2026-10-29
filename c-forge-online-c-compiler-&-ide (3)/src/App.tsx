/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CodeFile,
  CompilerConfig,
  CompilationResult,
  EditorThemeId,
  SnippetExample,
} from './types';
import { executeCCode, normalizeCompiler } from './services/compiler';
import { SNIPPET_EXAMPLES } from './services/snippets';
import { Navbar } from './components/Navbar';
import { EditorPanel } from './components/EditorPanel';
import { TerminalPanel } from './components/TerminalPanel';
import { CompilerSettingsModal } from './components/CompilerSettingsModal';
import { SnippetsModal } from './components/SnippetsModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { ShortcutsModal } from './components/ShortcutsModal';

const DEFAULT_C_CODE = `/*
 * AMOGH COMPILER - Online C IDE
 * BUILT BY AMOGHAVARSHA G DIXIT
 * UVCE & IIT MADRAS
 *
 * Fast, modern C code development & execution.
 */
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int main(void) {
    printf("==========================================\\n");
    printf("     Welcome to AMOGH COMPILER!           \\n");
    printf("     BUILT BY AMOGHAVARSHA G DIXIT        \\n");
    printf("          UVCE & IIT MADRAS               \\n");
    printf("==========================================\\n\\n");

    const char* project = "AMOGH COMPILER";
    const char* author = "AMOGHAVARSHA G DIXIT (UVCE & IIT MADRAS)";
    int release_year = 2026;
    double sqrt_val = sqrt(2048.0);

    printf("Environment: GNU GCC & LLVM Clang Toolchains\\n");
    printf("Project    : %s\\n", project);
    printf("Author     : %s\\n", author);
    printf("Year       : %d\\n", release_year);
    printf("Math Check : sqrt(2048) = %.4f\\n\\n", sqrt_val);

    // Compute factorials up to 10
    printf("Factorial Sequence:\\n");
    long long fact = 1;
    for (int i = 1; i <= 10; i++) {
        fact *= i;
        printf("  %2d! = %10lld\\n", i, fact);
    }

    printf("\\nProgram executed successfully with code 0.\\n");
    return 0;
}
`;

const INITIAL_CONFIG: CompilerConfig = {
  compiler: 'gcc-head-c',
  standard: '-std=c17',
  optimization: '-O2',
  warnings: {
    all: true,
    extra: false,
    pedantic: false,
    error: false,
  },
  linkMath: true,
  customFlags: '',
};

export default function App() {
  // Files State
  const [files, setFiles] = useState<CodeFile[]>(() => {
    try {
      const saved = localStorage.getItem('cforge_files');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore parse error
    }
    return [{ id: 'main-c', name: 'main.c', content: DEFAULT_C_CODE, isMain: true }];
  });

  const [activeFileId, setActiveFileId] = useState<string>('main-c');
  const [stdin, setStdin] = useState<string>('');
  const [stdinSteps, setStdinSteps] = useState<string[]>([]);

  // Compiler Configuration (migrates any legacy compiler key)
  const [compilerConfig, setCompilerConfig] = useState<CompilerConfig>(() => {
    try {
      const saved = localStorage.getItem('cforge_compiler_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          parsed.compiler = normalizeCompiler(parsed.compiler);
          return { ...INITIAL_CONFIG, ...parsed };
        }
      }
    } catch {
      // Ignore
    }
    return INITIAL_CONFIG;
  });

  // Editor Appearance
  const [themeId, setThemeId] = useState<EditorThemeId>(() => {
    try {
      const saved = localStorage.getItem('cforge_theme');
      if (saved) return saved as EditorThemeId;
    } catch {
      // Ignore
    }
    return 'one-dark';
  });

  const [fontSize, setFontSize] = useState<number>(14);
  const [tabSize, setTabSize] = useState<number>(4);

  // Split Panel Width (Percentage for Editor Panel)
  const [splitPercent, setSplitPercent] = useState<number>(55);
  const isResizingRef = useRef(false);

  // Execution & Diagnostics
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<CompilationResult | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Auto-save files
  useEffect(() => {
    try {
      localStorage.setItem('cforge_files', JSON.stringify(files));
    } catch {
      // Ignore
    }
  }, [files]);

  // Auto-save compiler config
  useEffect(() => {
    try {
      localStorage.setItem('cforge_compiler_config', JSON.stringify(compilerConfig));
    } catch {
      // Ignore
    }
  }, [compilerConfig]);

  // Auto-save theme
  useEffect(() => {
    try {
      localStorage.setItem('cforge_theme', themeId);
    } catch {
      // Ignore
    }
  }, [themeId]);

  // Active file helper
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Compilation Runner
  const handleRun = useCallback(async () => {
    if (isRunning || !activeFile) return;

    setIsRunning(true);
    try {
      // Wandbox or our local proxy compiles the active code
      const res = await executeCCode(activeFile.content, stdin, compilerConfig);
      setResult(res);
    } catch (err: any) {
      console.error('Run failed:', err);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, activeFile, stdin, compilerConfig]);

  // Interactive Stepwise Input Handler
  const handleSendStepInput = useCallback(async (inputVal: string) => {
    if (!activeFile) return;

    const newSteps = [...stdinSteps, inputVal];
    setStdinSteps(newSteps);
    const newStdin = newSteps.join('\n') + '\n';
    setStdin(newStdin);

    setIsRunning(true);
    try {
      const res = await executeCCode(activeFile.content, newStdin, compilerConfig);
      setResult(res);
    } catch (err: any) {
      console.error('Run failed with step input:', err);
    } finally {
      setIsRunning(false);
    }
  }, [activeFile, stdinSteps, compilerConfig]);

  // Reset interactive input steps and rerun fresh
  const handleResetInputSteps = useCallback(async () => {
    if (!activeFile) return;

    setStdinSteps([]);
    setStdin('');

    setIsRunning(true);
    try {
      const res = await executeCCode(activeFile.content, '', compilerConfig);
      setResult(res);
    } catch (err: any) {
      console.error('Run failed with reset inputs:', err);
    } finally {
      setIsRunning(false);
    }
  }, [activeFile, compilerConfig]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter: Run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }

      // Ctrl+S or Cmd+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        try {
          localStorage.setItem('cforge_files', JSON.stringify(files));
        } catch {
          // Ignore
        }
      }

      // Ctrl+L: Clear terminal
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        setResult(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, files]);

  // Resizable Divider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const totalWidth = window.innerWidth;
      const newPercent = Math.min(Math.max((moveEvent.clientX / totalWidth) * 100, 25), 75);
      setSplitPercent(newPercent);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  // File Management
  const handleAddFile = () => {
    const count = files.length + 1;
    const newName = `module_${count}.c`;
    const newFile: CodeFile = {
      id: `file-${Date.now()}`,
      name: newName,
      content: `/*\\n * ${newName}\\n */\\n#include <stdio.h>\\n\\nvoid helper_func_${count}(void) {\\n    printf("Helper function called\\n");\\n}\\n`,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) {
      const remaining = files.filter((f) => f.id !== id);
      if (remaining.length > 0) {
        setActiveFileId(remaining[0].id);
      }
    }
  };

  const handleChangeContent = (fileId: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content } : f))
    );
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to the default starter template?')) {
      handleChangeContent(activeFileId, DEFAULT_C_CODE);
      setStdin('');
      setStdinSteps([]);
      setResult(null);
    }
  };

  const handleSelectSnippet = (snippet: SnippetExample) => {
    handleChangeContent(activeFileId, snippet.code);
    if (snippet.stdin !== undefined && snippet.stdin.trim().length > 0) {
      setStdin(snippet.stdin);
      // Split into steps
      const steps = snippet.stdin.trim().split(/\s+/).filter(Boolean);
      setStdinSteps(steps);
    } else {
      setStdin('');
      setStdinSteps([]);
    }
    setResult(null);
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/x-csrc;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name || 'main.c';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none">
      {/* 3-Zone Navigation Bar */}
      <Navbar
        onRun={handleRun}
        isRunning={isRunning}
        compilerConfig={compilerConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSnippets={() => setIsSnippetsOpen(true)}
        onOpenThemes={() => setIsThemesOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onDownload={handleDownload}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col md:flex-row w-full overflow-hidden relative">
        {/* Left Side: Code Editor */}
        <div
          className="h-1/2 md:h-full overflow-hidden"
          style={{ width: window.innerWidth > 768 ? `${splitPercent}%` : '100%' }}
        >
          <EditorPanel
            files={files}
            activeFileId={activeFileId}
            onSelectFile={setActiveFileId}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
            onChangeContent={handleChangeContent}
            themeId={themeId}
            compilerConfig={compilerConfig}
            onResetCode={handleResetCode}
            fontSize={fontSize}
            setFontSize={setFontSize}
            tabSize={tabSize}
            setTabSize={setTabSize}
          />
        </div>

        {/* Resizable Divider (Desktop) */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden md:flex w-1.5 hover:w-2 bg-neutral-800 hover:bg-emerald-500 cursor-col-resize transition-all items-center justify-center shrink-0 z-10 group"
          title="Drag to resize panels"
        >
          <div className="w-0.5 h-6 rounded bg-neutral-600 group-hover:bg-white" />
        </div>

        {/* Right Side: Terminal Output, Diagnostics & stdin */}
        <div
          className="h-1/2 md:h-full flex-1 overflow-hidden"
          style={{ width: window.innerWidth > 768 ? `${100 - splitPercent}%` : '100%' }}
        >
          <TerminalPanel
            result={result}
            isRunning={isRunning}
            stdin={stdin}
            setStdin={setStdin}
            stdinSteps={stdinSteps}
            onSendStepInput={handleSendStepInput}
            onResetInputSteps={handleResetInputSteps}
            code={activeFile?.content || ''}
            onClear={() => {
              setResult(null);
              setStdinSteps([]);
              setStdin('');
            }}
            onRun={handleRun}
          />
        </div>
      </main>

      {/* Modals */}
      <CompilerSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={compilerConfig}
        onChange={setCompilerConfig}
      />

      <SnippetsModal
        isOpen={isSnippetsOpen}
        onClose={() => setIsSnippetsOpen(false)}
        onSelectSnippet={handleSelectSnippet}
      />

      <ThemeSelectorModal
        isOpen={isThemesOpen}
        onClose={() => setIsThemesOpen(false)}
        currentTheme={themeId}
        onSelectTheme={setThemeId}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
