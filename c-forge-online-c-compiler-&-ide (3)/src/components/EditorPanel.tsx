import React, { useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import {
  Copy,
  Check,
  RotateCcw,
  AlignLeft,
  FileCode,
  Plus,
  X,
  Type,
} from 'lucide-react';
import { CodeFile, EditorThemeId, CompilerConfig } from '../types';
import { getEditorThemeExtension } from '../services/themes';
import { formatCCode } from '../services/compiler';

interface Props {
  files: CodeFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
  onChangeContent: (fileId: string, content: string) => void;
  themeId: EditorThemeId;
  compilerConfig: CompilerConfig;
  onResetCode: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  tabSize: number;
  setTabSize: (size: number) => void;
}

export const EditorPanel: React.FC<Props> = ({
  files,
  activeFileId,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onChangeContent,
  themeId,
  compilerConfig,
  onResetCode,
  fontSize,
  setFontSize,
  tabSize,
  setTabSize,
}) => {
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const extensions = useMemo(() => {
    return [
      cpp(),
      getEditorThemeExtension(themeId),
    ];
  }, [themeId]);

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleFormat = () => {
    if (!activeFile) return;
    const formatted = formatCCode(activeFile.content);
    onChangeContent(activeFile.id, formatted);
  };

  const lineCount = (activeFile?.content || '').split('\n').length;
  const charCount = (activeFile?.content || '').length;

  return (
    <div className="flex flex-col h-full bg-neutral-950 border-r border-neutral-800 overflow-hidden">
      {/* File Tabs & Controls Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800 bg-neutral-900/60 overflow-x-auto gap-2">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-neutral-800 text-neutral-100 border-neutral-700 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border-transparent'
                }`}
                onClick={() => onSelectFile(file.id)}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                <span>{file.name}</span>
                {files.length > 1 && !file.isMain && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 rounded transition-opacity"
                    aria-label={`Close ${file.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={onAddFile}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-md transition-colors"
            title="Create new header or source file"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editor Actions Toolbar */}
        <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
          {/* Font size toggle */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-md px-1.5 py-0.5 text-[11px] font-mono">
            <span className="text-neutral-500 mr-1.5 flex items-center gap-0.5">
              <Type className="w-3 h-3" />
            </span>
            <button
              type="button"
              onClick={() => setFontSize(Math.max(11, fontSize - 1))}
              className="px-1 text-neutral-400 hover:text-neutral-200"
              title="Decrease font size"
            >
              -
            </button>
            <span className="px-1 text-neutral-300 tabular-nums">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize(Math.min(22, fontSize + 1))}
              className="px-1 text-neutral-400 hover:text-neutral-200"
              title="Increase font size"
            >
              +
            </button>
          </div>

          {/* Tab size toggle */}
          <button
            type="button"
            onClick={() => setTabSize(tabSize === 4 ? 2 : 4)}
            className="px-2 py-1 text-[11px] font-mono bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-md transition-colors"
            title="Toggle Tab Indent Spacing"
          >
            Tab: {tabSize}
          </button>

          {/* Auto Format */}
          <button
            type="button"
            onClick={handleFormat}
            className="p-1.5 hover:text-neutral-100 hover:bg-neutral-800 rounded-md transition-colors"
            title="Auto-format code indentation"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 hover:text-neutral-100 hover:bg-neutral-800 rounded-md transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onResetCode}
            className="p-1.5 hover:text-neutral-100 hover:bg-neutral-800 rounded-md transition-colors"
            title="Reset code to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CodeMirror Editor */}
      <div 
        className="flex-1 w-full overflow-hidden"
        style={{ '--editor-font-size': `${fontSize}px` } as React.CSSProperties}
      >
        <CodeMirror
          value={activeFile?.content || ''}
          height="100%"
          theme="dark"
          extensions={extensions}
          onChange={(val) => {
            if (activeFile) {
              onChangeContent(activeFile.id, val);
            }
          }}
          onUpdate={(update) => {
            if (update.selectionSet) {
              const head = update.state.selection.main.head;
              const line = update.state.doc.lineAt(head);
              setCursorPos({
                line: line.number,
                col: head - line.from + 1,
              });
            }
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
            tabSize: tabSize,
          }}
          className="h-full font-mono text-sm"
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-neutral-800 bg-neutral-900/70 text-[11px] font-mono text-neutral-400 shrink-0">
        <div className="flex items-center gap-3">
          <span>
            Ln <span className="tabular-nums text-neutral-200">{cursorPos.line}</span>, Col <span className="tabular-nums text-neutral-200">{cursorPos.col}</span>
          </span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span>
            <span className="tabular-nums text-neutral-200">{lineCount}</span> lines
          </span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span>
            <span className="tabular-nums text-neutral-200">{charCount}</span> chars
          </span>
          <span className="hidden xl:inline text-neutral-600" aria-hidden="true">·</span>
          <span className="hidden xl:inline text-neutral-400">
            Built by Amoghavarsha G Dixit (UVCE &middot; IIT Madras)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-medium">
            {compilerConfig.standard.replace('-std=', '').toUpperCase()}
          </span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span className="text-neutral-400">UTF-8</span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span className="text-neutral-500">Auto-saved</span>
        </div>
      </div>
    </div>
  );
};
