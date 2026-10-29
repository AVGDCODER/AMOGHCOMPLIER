import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorThemeId, EditorThemeOption } from '../types';

export const THEME_OPTIONS: EditorThemeOption[] = [
  {
    id: 'one-dark',
    name: 'Obsidian One Dark',
    description: 'Clean balanced dark theme with balanced syntax contrast',
    bgHex: '#0d1117',
    accentHex: '#38bdf8',
  },
  {
    id: 'monokai',
    name: 'Monokai Pro',
    description: 'Vivid warm contrasts inspired by classic code editors',
    bgHex: '#141416',
    accentHex: '#f59e0b',
  },
  {
    id: 'dracula',
    name: 'Dracula Night',
    description: 'Vibrant purple undertones with soft pastel accents',
    bgHex: '#181824',
    accentHex: '#ec4899',
  },
  {
    id: 'nord',
    name: 'Nordic Arctic',
    description: 'Calm slate and frosty arctic blue tones',
    bgHex: '#13171f',
    accentHex: '#14b8a6',
  },
  {
    id: 'cyber-noir',
    name: 'Cyber Noir',
    description: 'Deep pitch black with emerald phosphor radiance',
    bgHex: '#06080d',
    accentHex: '#10b981',
  },
];

export function getEditorThemeExtension(themeId: EditorThemeId): Extension {
  switch (themeId) {
    case 'monokai':
      return EditorView.theme(
        {
          '&': {
            backgroundColor: '#141416',
            color: '#f8f8f2',
          },
          '.cm-content': {
            caretColor: '#f59e0b',
          },
          '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: '#f59e0b',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#3e3d32 !important',
          },
          '.cm-gutters': {
            backgroundColor: '#141416',
            color: '#75715e',
            borderRight: '1px solid #272822',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#ffd866',
          },
        },
        { dark: true }
      );

    case 'dracula':
      return EditorView.theme(
        {
          '&': {
            backgroundColor: '#181824',
            color: '#f8f8f2',
          },
          '.cm-content': {
            caretColor: '#ec4899',
          },
          '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: '#ec4899',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#44475a !important',
          },
          '.cm-gutters': {
            backgroundColor: '#181824',
            color: '#6272a4',
            borderRight: '1px solid rgba(98, 114, 164, 0.2)',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(255, 121, 198, 0.06)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(255, 121, 198, 0.1)',
            color: '#ff79c6',
          },
        },
        { dark: true }
      );

    case 'nord':
      return EditorView.theme(
        {
          '&': {
            backgroundColor: '#13171f',
            color: '#d8dee9',
          },
          '.cm-content': {
            caretColor: '#88c0d0',
          },
          '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: '#88c0d0',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#434c5e !important',
          },
          '.cm-gutters': {
            backgroundColor: '#13171f',
            color: '#4c566a',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(136, 192, 208, 0.06)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(136, 192, 208, 0.1)',
            color: '#88c0d0',
          },
        },
        { dark: true }
      );

    case 'cyber-noir':
      return EditorView.theme(
        {
          '&': {
            backgroundColor: '#06080d',
            color: '#e2e8f0',
          },
          '.cm-content': {
            caretColor: '#10b981',
          },
          '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: '#10b981',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: 'rgba(16, 185, 129, 0.2) !important',
          },
          '.cm-gutters': {
            backgroundColor: '#06080d',
            color: '#334155',
            borderRight: '1px solid #1e293b',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
          },
        },
        { dark: true }
      );

    case 'one-dark':
    default:
      return oneDark;
  }
}
