import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, Paperclip, Headphones } from "lucide-react";
import { SUPPORT_THREAD } from "../data";

export default function ChatWidget() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState(SUPPORT_THREAD);
  const [draft, setDraft] = useState("");
  // Pages with their own fixed bottom UI — keep the support FAB out of the way
  // on small screens (still available on desktop).
  const conflicts = pathname.startsWith("/app/vitchat") || pathname.startsWith("/app/terminal");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const t = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setThread((th) => [...th, { id: `u${th.length}`, fromMe: true, text, t }]);
    setDraft("");
    setTimeout(() => {
      setThread((th) => [...th, { id: `b${th.length}`, fromMe: false, text: "Thanks — a specialist will follow up shortly. Is there anything else I can help with?", t }]);
    }, 1100);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-[70] w-[330px] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-surface border border-white/[0.06] shadow-2xl overflow-hidden flex flex-col" style={{ height: 460 }} data-testid="chat-widget-panel">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.05]">
            <span className="w-8 h-8 rounded-lg bg-tradeTeal/15 border border-tradeTeal/25 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-tradeTeal" strokeWidth={2} />
            </span>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-tradeWhite">TradeCafe Support</div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/45"><span className="w-1.5 h-1.5 rounded-full bg-tradeTeal" /> Online · replies in minutes</div>
            </div>
            <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={() => setOpen(false)} aria-label="Close chat"><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
            {thread.map((m) => (
              <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-[12.5px] leading-[1.45] ${m.fromMe ? "bg-tradeTeal/15 text-white rounded-br-md" : "bg-white/[0.04] text-white/85 rounded-bl-md"}`}>
                  {m.text}
                  <span className="block font-mono text-[9px] text-white/35 mt-1">{m.t}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2.5 border-t border-white/[0.05] flex items-center gap-2">
            <button className="tc-iconbtn" style={{ width: 34, height: 34 }} title="Attach photo / video"><Paperclip className="w-4 h-4" /></button>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…" className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[12.5px] text-white outline-none focus:border-tradeTeal/40" />
            <button className="tc-btn tc-btn-primary" style={{ padding: "8px 12px" }} onClick={send}><Send className="w-4 h-4" strokeWidth={2} /></button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full items-center justify-center shadow-xl transition-transform hover:scale-105 ${conflicts ? "hidden lg:flex" : "flex"}`}
        style={{ background: "linear-gradient(135deg, var(--tc-accent-light), var(--tc-accent))", color: "#042024" }}
        aria-label="Support chat"
        data-testid="chat-widget-toggle"
      >
        {open ? <X className="w-6 h-6" strokeWidth={2.2} /> : <MessageCircle className="w-6 h-6" strokeWidth={2.2} />}
      </button>
    </>
  );
}
