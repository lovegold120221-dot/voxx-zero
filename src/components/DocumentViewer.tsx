import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Eye, Download, Copy, FileText, Globe } from 'lucide-react';

interface DocumentViewerProps {
  title: string;
  content: string;
  fileType?: string;
  onClose: () => void;
  personaName: string;
}

export function DocumentViewer({
  title,
  content,
  fileType = 'html',
  onClose,
  personaName,
}: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    const ext = fileType === 'html' ? '.html' : '.txt';
    const blob = new Blob([content], { type: fileType === 'html' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const OutputIcon = fileType === 'html' ? Globe : FileText;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col h-[100dvh]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(208,167,139,0.04),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 w-full bg-[#050505]/95 backdrop-blur-md border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between z-10 shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-zinc-500 hover:text-[#d0a78b] hover:bg-zinc-850/50 transition-all"
          aria-label="Close"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center flex flex-col items-center">
          <h1 className="text-sm font-semibold tracking-wide text-[#d0a78b]">{personaName}</h1>
          <p className="text-[9px] text-zinc-500 tracking-[0.2em] lowercase -mt-0.5">document workspace</p>
        </div>

        <div className="w-9" />
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-5xl mx-auto w-full space-y-6 flex flex-col justify-between">
        <div className="space-y-6 flex-1 flex flex-col">
          {/* File Card */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-[24px] overflow-hidden flex-1 flex flex-col">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/40 bg-zinc-900/60">
              <div className="w-10 h-10 rounded-xl bg-[#d0a78b]/10 flex items-center justify-center">
                <OutputIcon className="w-5 h-5 text-[#d0a78b]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {title}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  {fileType === 'html' ? 'Web Document' : 'Text File'}
                </p>
              </div>
            </div>

            {/* Document Preview Pane */}
            <div className="p-5 flex-1 flex flex-col min-h-[350px]">
              {showPreview && fileType === 'html' ? (
                <div className="flex-1 rounded-[16px] overflow-hidden border border-zinc-800 shadow-2xl relative bg-white">
                  <iframe
                    srcDoc={content}
                    className="w-full h-full bg-white border-0"
                    sandbox="allow-scripts"
                    title="Document Preview"
                  />
                </div>
              ) : (
                <div className="flex-1 bg-[#0a0a0c] rounded-[16px] p-4 border border-zinc-800/50 overflow-y-auto max-h-[500px]">
                  <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono select-text">
                    {content}
                  </pre>
                </div>
              )}

              {/* View Toggle (Only if HTML) */}
              {fileType === 'html' && (
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowPreview(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      showPreview
                        ? 'bg-[#d0a78b] text-black shadow-lg shadow-[#d0a78b]/10'
                        : 'bg-zinc-800/40 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Visual Preview
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !showPreview
                        ? 'bg-[#d0a78b] text-black shadow-lg shadow-[#d0a78b]/10'
                        : 'bg-zinc-800/40 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Source Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex gap-3 pt-4 border-t border-zinc-900/60 mt-auto shrink-0 w-full">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:border-zinc-700 hover:text-zinc-200 transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied code
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy source code
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#d0a78b] text-black text-sm font-semibold hover:bg-[#ebd0bc] transition-all shadow-lg shadow-[#d0a78b]/10 active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Download document
          </button>
        </div>
      </div>
    </motion.div>
  );
}
