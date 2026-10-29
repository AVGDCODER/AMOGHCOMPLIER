import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { EditorThemeId } from '../types';
import { THEME_OPTIONS } from '../services/themes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: EditorThemeId;
  onSelectTheme: (theme: EditorThemeId) => void;
}

export const ThemeSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="theme-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-emerald-400" />
            <h2 id="theme-modal-title" className="text-base font-semibold text-neutral-100">
              Dark Mode Editor Themes
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
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                onSelectTheme(theme.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                currentTheme === theme.id
                  ? 'bg-neutral-800 border-emerald-500/80 text-white shadow-xs'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-5 h-5 rounded-md border border-neutral-700 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: theme.bgHex }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.accentHex }}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-200">{theme.name}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{theme.description}</div>
                </div>
              </div>

              {currentTheme === theme.id && (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
