import React, { useState } from 'react';
import { X, BookOpen, Search, ArrowRight, Code } from 'lucide-react';
import { SnippetExample } from '../types';
import { SNIPPET_EXAMPLES } from '../services/snippets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnippet: (snippet: SnippetExample) => void;
}

export const SnippetsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectSnippet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Beginner', 'Data Structures', 'Algorithms', 'Pointers & Memory', 'Low-Level'];

  const filteredSnippets = SNIPPET_EXAMPLES.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        role="dialog"
        aria-labelledby="snippets-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 id="snippets-modal-title" className="text-base font-semibold text-neutral-100">
                Example C Programs & Algorithms
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-md hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-900/50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search algorithms, data structures, concepts..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 placeholder:text-neutral-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No example C programs matching your search query.
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="group p-4 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/40 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 font-mono">{snippet.category}</span>
                    <span className="text-neutral-600 text-xs" aria-hidden="true">·</span>
                    <h3 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                      {snippet.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {snippet.description}
                  </p>
                  {snippet.stdin && (
                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 mt-1">
                      <span>Includes sample stdin:</span>
                      <code className="text-emerald-400 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                        {snippet.stdin}
                      </code>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectSnippet(snippet);
                    onClose();
                  }}
                  className="px-3 py-2 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Load Program</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
