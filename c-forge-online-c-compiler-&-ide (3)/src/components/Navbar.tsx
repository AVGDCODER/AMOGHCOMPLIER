import React from 'react';
import { Play, Loader2, Sparkles, Sliders, BookOpen, Palette, Keyboard, Download } from 'lucide-react';
import { CompilerConfig } from '../types';

interface Props {
  onRun: () => void;
  isRunning: boolean;
  compilerConfig: CompilerConfig;
  onOpenSettings: () => void;
  onOpenSnippets: () => void;
  onOpenThemes: () => void;
  onOpenShortcuts: () => void;
  onDownload: () => void;
}

export const Navbar: React.FC<Props> = ({
  onRun,
  isRunning,
  compilerConfig,
  onOpenSettings,
  onOpenSnippets,
  onOpenThemes,
  onOpenShortcuts,
  onDownload,
}) => {
  const compilerLabel = compilerConfig.compiler.includes('gcc') ? 'GCC' : 'Clang';

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md shrink-0">
      {/* Zone 1: Brand Wordmark & Author Attribution */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold group-hover:border-emerald-500/50 transition-colors shrink-0">
            C
          </span>
          <div className="flex flex-col text-left leading-none">
            <span className="font-bold text-neutral-100 text-sm tracking-tight">AMOGH COMPILER</span>
            <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase mt-1 leading-none">
              BUILT BY AMOGHAVARSHA G DIXIT
            </span>
            <span className="text-[9px] text-neutral-400 font-medium tracking-normal mt-0.5 leading-none">
              UVCE &middot; IIT MADRAS
            </span>
          </div>
        </a>
      </div>

      {/* Zone 2: Navigation Links (Single-line, concise) */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
        <button
          type="button"
          onClick={onOpenSnippets}
          className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Examples</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Compiler ({compilerLabel})</span>
        </button>

        <button
          type="button"
          onClick={onOpenThemes}
          className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Themes</span>
        </button>

        <button
          type="button"
          onClick={onOpenShortcuts}
          className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Shortcuts</span>
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          title="Compile & Run C Code (Ctrl+Enter)"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Compiling...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-emerald-700/60 rounded text-emerald-100 ml-1">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
