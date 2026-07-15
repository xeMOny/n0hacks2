import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { apiFetch, ApiError } from '../api/client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_HISTORY_SENT = 12;

export default function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const history = nextMessages.slice(0, -1).slice(-MAX_HISTORY_SENT);
      const data = await apiFetch('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, history }),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('chat.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-[22rem] max-w-[calc(100vw-3rem)] h-[28rem] bg-white rounded-xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden"
          >
            <div className="bg-brand-navy text-white px-4 py-3 flex items-center justify-between shrink-0">
              <span className="font-semibold text-sm">{t('chat.title')}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('chat.close')}
                className="text-white/70 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-mist/40">
              <div className="bg-white border border-slate-200 rounded-lg rounded-tl-none px-3 py-2 text-sm text-slate-700 max-w-[85%]">
                {t('chat.welcome')}
              </div>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-brand-blue text-white ml-auto rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="bg-white border border-slate-200 rounded-lg rounded-tl-none px-3 py-2 text-sm text-slate-400 max-w-[85%]">
                  {t('chat.typing')}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 max-w-[90%]">
                  {error}
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="border-t border-slate-200 p-3 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                disabled={loading}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t('chat.send')}
                className="bg-brand-blue hover:bg-brand-navy disabled:opacity-40 disabled:hover:bg-brand-blue text-white rounded-lg px-3 flex items-center justify-center transition"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('chat.close') : t('chat.launcher_label')}
        className="w-14 h-14 rounded-full bg-brand-blue hover:bg-brand-navy text-white shadow-lg shadow-slate-900/20 flex items-center justify-center transition"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
