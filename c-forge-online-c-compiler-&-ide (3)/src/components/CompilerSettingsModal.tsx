import React from 'react';
import { X, Sliders, Check, HelpCircle } from 'lucide-react';
import { CompilerConfig, CompilerEngine, CStandard, OptimizationLevel } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: CompilerConfig;
  onChange: (config: CompilerConfig) => void;
}

export const CompilerSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onChange,
}) => {
  if (!isOpen) return null;

  const compilers: { id: CompilerEngine; label: string; desc: string }[] = [
    { id: 'gcc-head-c', label: 'GNU GCC (Head / Latest)', desc: 'Bleeding-edge GCC compiler build' },
    { id: 'gcc-13.2.0-c', label: 'GNU GCC 13.2.0', desc: 'Industry standard stable GCC release' },
    { id: 'gcc-12.3.0-c', label: 'GNU GCC 12.3.0', desc: 'Stable GNU GCC compiler release' },
    { id: 'clang-head-c', label: 'LLVM Clang (Head / Latest)', desc: 'High-speed modern Clang diagnostics' },
    { id: 'clang-17.0.1-c', label: 'LLVM Clang 17.0.1', desc: 'Proven stable Clang compiler toolchain' },
  ];

  const standards: { id: CStandard; label: string; year: string }[] = [
    { id: '-std=c2x', label: 'C23 (Draft)', year: '2023 - Modern attributes, nullptr, constexpr' },
    { id: '-std=c17', label: 'C17 (Default)', year: '2017 - Current standard bugfix revision' },
    { id: '-std=c11', label: 'C11', year: '2011 - Threads, generics, atomics, bounds check' },
    { id: '-std=c99', label: 'C99', year: '1999 - Inline functions, variable-length arrays' },
    { id: '-std=c89', label: 'C89 / ANSI C', year: '1989 - Original ANSI standard' },
  ];

  const optimizations: { id: OptimizationLevel; label: string; desc: string }[] = [
    { id: '-O0', label: '-O0', desc: 'No optimization (Fast compile, best debugging)' },
    { id: '-O1', label: '-O1', desc: 'Basic optimization' },
    { id: '-O2', label: '-O2', desc: 'Standard production optimization (Recommended)' },
    { id: '-O3', label: '-O3', desc: 'Aggressive optimization (Loop vectorization)' },
    { id: '-Os', label: '-Os', desc: 'Optimize strictly for binary code size' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-labelledby="compiler-settings-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 id="compiler-settings-title" className="text-base font-semibold text-neutral-100">
              Compiler Toolchain & Flags
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-md hover:bg-neutral-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Compiler Engine */}
          <section>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Compiler Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {compilers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange({ ...config, compiler: c.id })}
                  className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                    config.compiler === c.id
                      ? 'bg-neutral-800 border-emerald-500/80 text-white shadow-xs'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium text-neutral-100">{c.label}</span>
                    {config.compiler === c.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-xs text-neutral-400 mt-1">{c.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* C Standard */}
          <section>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              C Language Standard
            </label>
            <div className="space-y-1.5">
              {standards.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChange({ ...config, standard: s.id })}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg border text-left transition-all ${
                    config.standard === s.id
                      ? 'bg-neutral-800 border-emerald-500/80 text-white'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-mono text-emerald-400 font-semibold">{s.id}</code>
                    <span className="text-xs text-neutral-300">{s.year}</span>
                  </div>
                  {config.standard === s.id && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </section>

          {/* Optimization Level */}
          <section>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Optimization Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {optimizations.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ ...config, optimization: opt.id })}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    config.optimization === opt.id
                      ? 'bg-neutral-800 border-emerald-500 text-emerald-300 font-medium'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{opt.label}</div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">{opt.desc.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Warnings & Diagnostics */}
          <section>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Diagnostics & Warning Flags
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer hover:border-neutral-700">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium text-neutral-200">-Wall</span>
                  <span className="text-[11px] text-neutral-400">Enable all common compiler warnings</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.warnings.all}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      warnings: { ...config.warnings, all: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded-sm border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer hover:border-neutral-700">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium text-neutral-200">-Wextra</span>
                  <span className="text-[11px] text-neutral-400">Enable additional diagnostic warnings</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.warnings.extra}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      warnings: { ...config.warnings, extra: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded-sm border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer hover:border-neutral-700">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium text-neutral-200">-pedantic</span>
                  <span className="text-[11px] text-neutral-400">Strict ANSI/ISO compliance warnings</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.warnings.pedantic}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      warnings: { ...config.warnings, pedantic: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded-sm border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer hover:border-neutral-700">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium text-neutral-200">-Werror</span>
                  <span className="text-[11px] text-neutral-400">Treat all compiler warnings as fatal errors</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.warnings.error}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      warnings: { ...config.warnings, error: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded-sm border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
                />
              </label>
            </div>
          </section>

          {/* Libraries & Custom Flags */}
          <section className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer hover:border-neutral-700">
              <div className="flex flex-col">
                <span className="text-xs font-mono font-medium text-neutral-200">-lm</span>
                <span className="text-[11px] text-neutral-400">Link standard Math library (for math.h)</span>
              </div>
              <input
                type="checkbox"
                checked={config.linkMath}
                onChange={(e) => onChange({ ...config, linkMath: e.target.checked })}
                className="w-4 h-4 rounded-sm border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
              />
            </label>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Custom Compiler Flags (Raw)
              </label>
              <input
                type="text"
                value={config.customFlags}
                onChange={(e) => onChange({ ...config, customFlags: e.target.value })}
                placeholder="e.g. -DDEBUG -DVERSION=1"
                className="w-full px-3.5 py-2 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-neutral-800 bg-neutral-900/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
