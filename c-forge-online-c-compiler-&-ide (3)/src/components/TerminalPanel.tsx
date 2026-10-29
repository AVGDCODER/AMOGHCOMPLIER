import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Trash2,
  Play,
  Clock,
  Send,
  RotateCcw,
  CornerDownLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { CompilationResult } from '../types';
import { detectExpectedInputs, codeRequiresStdin, InputStep } from '../services/inputDetector';

interface Props {
  result: CompilationResult | null;
  isRunning: boolean;
  stdin: string;
  setStdin: (val: string) => void;
  stdinSteps: string[];
  onSendStepInput: (input: string) => void;
  onResetInputSteps: () => void;
  code: string;
  onClear: () => void;
  onJumpToLine?: (line: number, col: number) => void;
  onRun: () => void;
}

export const TerminalPanel: React.FC<Props> = ({
  result,
  isRunning,
  stdin,
  setStdin,
  stdinSteps,
  onSendStepInput,
  onResetInputSteps,
  code,
  onClear,
  onJumpToLine,
  onRun,
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'diagnostics' | 'stdin'>('output');
  const [copied, setCopied] = useState(false);
  const [stepInputValue, setStepInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const errorCount = result?.diagnostics.filter((d) => d.type === 'error').length ?? 0;
  const warningCount = result?.diagnostics.filter((d) => d.type === 'warning').length ?? 0;

  // Detect expected input steps from C code
  const expectedSteps: InputStep[] = detectExpectedInputs(code);
  const requiresInput = codeRequiresStdin(code);
  const currentStepIndex = stdinSteps.length;
  const currentExpectedStep = expectedSteps[currentStepIndex];

  // Auto-focus input when waiting for input or tab changes
  useEffect(() => {
    if (activeTab === 'output' && !isRunning) {
      inputRef.current?.focus();
    }
  }, [activeTab, isRunning, currentStepIndex]);

  // Scroll to bottom on new output or input
  useEffect(() => {
    if (activeTab === 'output') {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result, stdinSteps, activeTab]);

  const handleCopyOutput = async () => {
    const textToCopy =
      (result?.programOutput || '') +
      (result?.compilerMessage ? `\n\nCompiler Output:\n${result.compilerMessage}` : '');
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = stepInputValue.trim();
    if (!val) return;

    onSendStepInput(val);
    setStepInputValue('');
  };

  const stdinPresets = [
    { label: 'Numbers: 25 17 +', val: '25 17 +' },
    { label: 'Integer Array: 5 12 7 99 4', val: '5 12 7 99 4' },
    { label: 'Text: Hello World', val: 'Hello World' },
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-950 overflow-hidden">
      {/* Terminal Tab Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Tab 1: Output */}
          <button
            type="button"
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'output'
                ? 'bg-neutral-800 text-neutral-100 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Console Output</span>
            {result && (
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  result.exitCode === 0
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-red-400 bg-red-500/10'
                }`}
              >
                {result.exitCode === 0 ? 'exit 0' : `exit ${result.exitCode}`}
              </span>
            )}
          </button>

          {/* Tab 2: Diagnostics */}
          <button
            type="button"
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'diagnostics'
                ? 'bg-neutral-800 text-neutral-100 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${errorCount > 0 ? 'text-red-400' : 'text-amber-400'}`} />
            <span>Diagnostics</span>
            {(errorCount > 0 || warningCount > 0) && (
              <span className="text-[10px] font-mono px-1 rounded bg-neutral-800 text-neutral-300">
                {errorCount > 0 ? `${errorCount} err` : `${warningCount} warn`}
              </span>
            )}
          </button>

          {/* Tab 3: Raw stdin */}
          <button
            type="button"
            onClick={() => setActiveTab('stdin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'stdin'
                ? 'bg-neutral-800 text-neutral-100 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Raw Input ({stdinSteps.length} step{stdinSteps.length !== 1 ? 's' : ''})</span>
            {stdin.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" title="stdin active" />
            )}
          </button>
        </div>

        {/* Tab Right Controls */}
        <div className="flex items-center gap-1 text-neutral-400">
          {result && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 mr-2">
              <Clock className="w-3 h-3" />
              <span className="tabular-nums">{result.executionTimeMs}ms</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyOutput}
            className="p-1.5 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
            title="Copy output text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="p-1.5 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs select-text flex flex-col justify-between">
        {/* Output Tab */}
        {activeTab === 'output' && (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {isRunning ? (
              <div className="flex flex-col items-center justify-center flex-1 text-neutral-400 gap-3 py-12">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-neutral-300">
                  Compiling and executing with GCC / Clang...
                </p>
              </div>
            ) : !result ? (
              <div className="flex flex-col items-center justify-center flex-1 text-neutral-500 gap-3 py-12">
                <Terminal className="w-8 h-8 text-neutral-700" />
                <div className="text-center space-y-1">
                  <p className="text-xs text-neutral-200 font-bold tracking-tight">AMOGH COMPILER</p>
                  <p className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">
                    BUILT BY AMOGHAVARSHA G DIXIT
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    UVCE &middot; IIT MADRAS
                  </p>
                  <p className="text-[11px] text-neutral-500 pt-1">
                    Click &quot;Run Code&quot; or press Ctrl+Enter to execute.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onRun}
                  className="mt-2 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute Program</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {/* Program Stdout */}
                {result.programOutput && (
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-400 mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Program Output (stdout):</span>
                      </div>
                      {requiresInput && (
                        <span className="text-[10px] text-emerald-400/90 font-normal">
                          Interactive input enabled
                        </span>
                      )}
                    </div>
                    <pre className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800/80 text-neutral-100 whitespace-pre-wrap leading-relaxed font-mono">
                      {result.programOutput}
                    </pre>
                  </div>
                )}

                {/* Program Stderr / Runtime Error */}
                {result.programError && (
                  <div>
                    <div className="text-[11px] font-semibold text-red-400 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span>Runtime Standard Error (stderr):</span>
                    </div>
                    <pre className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-red-200 whitespace-pre-wrap leading-relaxed font-mono">
                      {result.programError}
                    </pre>
                  </div>
                )}

                {/* Compiler Output/Warnings */}
                {result.compilerMessage && (
                  <div>
                    <div className="text-[11px] font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>Compiler Messages & Diagnostics:</span>
                    </div>
                    <pre className="p-3 rounded-lg bg-amber-950/15 border border-amber-900/30 text-amber-200 whitespace-pre-wrap leading-relaxed font-mono">
                      {result.compilerMessage}
                    </pre>
                  </div>
                )}

                {/* Empty Output Case */}
                {!result.programOutput && !result.programError && !result.compilerMessage && (
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 italic">
                    Program compiled and finished with exit code {result.exitCode} (no output produced).
                  </div>
                )}

                {/* Input Steps Feed Summary */}
                {stdinSteps.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-neutral-400">Inputs submitted:</span>
                      {stdinSteps.map((stepVal, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-emerald-400 border border-neutral-700"
                        >
                          Step {idx + 1}: <strong className="text-white">{stepVal}</strong>
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={onResetInputSteps}
                      className="px-2 py-1 text-[10px] text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors flex items-center gap-1 shrink-0"
                      title="Clear input sequence and restart program"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restart Inputs</span>
                    </button>
                  </div>
                )}

                {/* Execution Footer Summary */}
                <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        result.exitCode === 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      Process returned {result.exitCode} (0x{result.exitCode.toString(16)})
                    </span>
                    {result.signal && (
                      <span className="text-red-400">· Signal: {result.signal}</span>
                    )}
                  </div>
                  <span className="tabular-nums">Time: {result.executionTimeMs} ms</span>
                </div>

                <div ref={terminalBottomRef} />
              </div>
            )}

            {/* STEPWISE INTERACTIVE TERMINAL INPUT BAR */}
            <div className="mt-4 pt-3 border-t border-neutral-800 shrink-0">
              {/* Step Notification Banner (when code requires input) */}
              {requiresInput && (
                <div className="mb-2 flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-md bg-emerald-950/30 border border-emerald-800/50 text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {currentExpectedStep ? (
                        <>
                          <strong className="text-white">Step {currentStepIndex + 1}:</strong> {currentExpectedStep.prompt}
                        </>
                      ) : (
                        <>
                          <strong className="text-white">Interactive Terminal:</strong> Enter input value for the program
                        </>
                      )}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono">Press Enter ↵</span>
                </div>
              )}

              {/* Terminal Command Prompt Input Form */}
              <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3 text-emerald-400 font-bold select-none text-xs">
                    ❯
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={stepInputValue}
                    onChange={(e) => setStepInputValue(e.target.value)}
                    placeholder={
                      currentExpectedStep
                        ? `Type input for: ${currentExpectedStep.prompt} and press Enter...`
                        : requiresInput
                        ? 'Type input (e.g. number or text) and press Enter...'
                        : 'Send terminal input to program...'
                    }
                    className="w-full pl-7 pr-16 py-2 bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 focus:border-emerald-500 rounded-lg text-xs font-mono text-neutral-100 placeholder:text-neutral-500 focus:outline-hidden transition-colors shadow-inner"
                  />
                  <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none text-[10px] text-neutral-500 font-mono">
                    <CornerDownLeft className="w-3 h-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!stepInputValue.trim()}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  title="Submit input to C program"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Diagnostics Tab */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-3">
            {!result || result.diagnostics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-neutral-500 gap-2">
                <Check className="w-6 h-6 text-emerald-400" />
                <p className="text-xs text-neutral-400">Zero compiler errors or warnings.</p>
                <p className="text-[11px] text-neutral-600">Your code passed compilation cleanly.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-neutral-400 mb-2 flex items-center justify-between">
                  <span>
                    Detected {result.diagnostics.length} diagnostic issue{result.diagnostics.length !== 1 ? 's' : ''}:
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Click an item to inspect line
                  </span>
                </div>

                {result.diagnostics.map((diag) => (
                  <div
                    key={diag.id}
                    onClick={() => onJumpToLine?.(diag.line, diag.column)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      diag.type === 'error'
                        ? 'bg-red-950/20 border-red-900/40 hover:border-red-500 text-red-200'
                        : diag.type === 'warning'
                        ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-500 text-amber-200'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`uppercase text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            diag.type === 'error'
                              ? 'bg-red-500/20 text-red-400'
                              : diag.type === 'warning'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {diag.type}
                        </span>
                        <span className="text-xs font-mono font-medium text-neutral-200">
                          {diag.file}:{diag.line}:{diag.column}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 hover:underline">
                        Jump to Line →
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-300 whitespace-pre-wrap">
                      {diag.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Standard Input (Raw multiline stdin) Tab */}
        {activeTab === 'stdin' && (
          <div className="h-full flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                <span>Raw multiline text buffer fed directly to <code>stdin</code>:</span>
              </span>
              {stdin && (
                <button
                  type="button"
                  onClick={() => {
                    setStdin('');
                    onResetInputSteps();
                  }}
                  className="text-[11px] text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-neutral-500">Sample inputs:</span>
              {stdinPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setStdin(preset.val);
                    onSendStepInput(preset.val);
                  }}
                  className="px-2 py-1 text-[11px] font-mono bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter standard input here (e.g. numbers, strings, multiline data)..."
              className="flex-1 w-full p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500 resize-none min-h-[160px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
