/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ClipboardList, 
  FileText,
  Sparkles,
  Eraser
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { decodeAssignment } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const decoded = await decodeAssignment(input);
      setResult(decoded);
      // Scroll to result after a short delay for animation
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Failed to decode assignment. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">Assignment Decoder</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="hidden sm:inline">Academic Assistant</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Intro */}
        <div className="mb-10 text-center sm:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Stop guessing. Start working.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl"
          >
            Paste your complex assignment prompt below. We'll break it down into a clear plan, deliverables, and actionable steps.
          </motion.p>
        </div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8"
        >
          <form onSubmit={handleDecode} className="space-y-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your assignment prompt here (e.g., 'Write a 1500-word analysis of the impact of the printing press on 16th-century European literacy...')"
                className="w-full min-h-[200px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y text-slate-800 placeholder:text-slate-400"
                disabled={isLoading}
              />
              {input && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                  title="Clear input"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Powered by AI for academic clarity</span>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "w-full sm:w-auto px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md",
                  !input.trim() || isLoading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Decoding...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Decode Assignment
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div ref={resultRef}>
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2">Decoded Results</span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 prose-strong:font-semibold">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-indigo-900">
                              <FileText className="w-5 h-5 text-indigo-600" />
                              {children}
                            </h3>
                          ),
                          h2: ({ children }) => {
                            const text = React.Children.toArray(children).join('');
                            return (
                              <h3 className="text-xl font-bold flex items-center gap-2 mt-8 mb-4 text-indigo-900">
                                {text.includes('Explanation') && <BookOpen className="w-5 h-5 text-indigo-600" />}
                                {text.includes('Deliverables') && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                                {text.includes('Plan') && <ClipboardList className="w-5 h-5 text-blue-600" />}
                                {text.includes('Information') && <AlertCircle className="w-5 h-5 text-amber-600" />}
                                {text.includes('Questions') && <HelpCircle className="w-5 h-5 text-purple-600" />}
                                {children}
                              </h3>
                            );
                          },
                          ul: ({ children }) => <ul className="space-y-2 my-4 list-none pl-0">{children}</ul>,
                          ol: ({ children }) => <ol className="space-y-3 my-4 list-decimal pl-5">{children}</ol>,
                          li: ({ children, ...props }) => {
                            // Check if it's an unordered list (Deliverables or Plan usually)
                            const isUnordered = !props.className?.includes('decimal');
                            return (
                              <li className={cn("text-slate-700", isUnordered && "flex items-start gap-3")}>
                                {isUnordered && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />}
                                <span>{children}</span>
                              </li>
                            );
                          }
                        }}
                      >
                        {result}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 italic">
                      Note: This decoder clarifies instructions but does not complete the work.
                    </p>
                    <button 
                      onClick={() => window.print()}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Save as PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Empty State / Tips */}
        {!result && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="p-5 rounded-xl border border-dashed border-slate-300 text-center">
              <div className="bg-indigo-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Paste Prompt</h4>
              <p className="text-xs text-slate-500">Copy the full text from your syllabus or LMS.</p>
            </div>
            <div className="p-5 rounded-xl border border-dashed border-slate-300 text-center">
              <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Get Clarity</h4>
              <p className="text-xs text-slate-500">We extract the core tasks and deliverables.</p>
            </div>
            <div className="p-5 rounded-xl border border-dashed border-slate-300 text-center">
              <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Follow Plan</h4>
              <p className="text-xs text-slate-500">Use the step-by-step guide to finish on time.</p>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-12 text-center border-t border-slate-200 mt-12">
        <p className="text-sm text-slate-400">
          Designed for university students to improve academic workflow.
        </p>
      </footer>
    </div>
  );
}
