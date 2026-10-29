import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + Enter / ⌘ + Enter', action: 'Compile and run C code' },
    { key: 'Ctrl + S / ⌘ + S', action: 'Save current code into browser storage' },
    { key: 'Ctrl + Shift + F', action: 'Auto-format C code indentation' },
    { key: 'Ctrl + L', action: 'Clear terminal output' },
    { key: 'Esc', action: 'Close active modal / dialog' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="shortcuts-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-emerald-400" />
            <h2 id="shortcuts-modal-title" className="text-base font-semibold text-neutral-100">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-md hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-900/50"
            >
              <span className="text-xs text-neutral-300">{sc.action}</span>
              <kbd className="px-2 py-1 text-xs font-mono font-medium text-emerald-400 bg-neutral-950 border border-neutral-800 rounded shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
