import { useState } from "react";
import { Search, UserPlus, Send, Check, X, Smile, ChevronLeft } from "lucide-react";
import { PageHead } from "../ui";
import { VITCHAT_ME, VITCHAT_FRIENDS, VITCHAT_REQUESTS, VITCHAT_THREAD } from "../data";

const STATUS_COLOR = { online: "#1FB8A6", dnd: "#F23645", offline: "#6B7686", invisible: "#6B7686" };
const REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];

export default function VitChat() {
  const [activeId, setActiveId] = useState(VITCHAT_FRIENDS[0].id);
  const [q, setQ] = useState("");
  const [view, setView] = useState("chat"); // chat | requests
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState(VITCHAT_THREAD);
  const [mobileChatOpen, setMobileChatOpen] = useState(false); // mobile single-pane nav

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setThread((t) => [...t, { id: `m${t.length + 1}`, fromMe: true, text, t: now }]);
    setDraft("");
  };
  const openConversation = (id) => { setActiveId(id); setView("chat"); setMobileChatOpen(true); };

  const friends = VITCHAT_FRIENDS.filter((f) => f.username.toLowerCase().includes(q.toLowerCase()));
  const active = VITCHAT_FRIENDS.find((f) => f.id === activeId);
  const groups = [
    { label: "Online", items: friends.filter((f) => f.status === "online") },
    { label: "Do Not Disturb", items: friends.filter((f) => f.status === "dnd") },
    { label: "Offline", items: friends.filter((f) => f.status === "offline") },
  ];
  const showChat = view !== "requests"; // right pane is chat unless requests

  return (
    <div className="tc-fade flex flex-col gap-3 lg:gap-6 h-full min-h-0">
      <div className={mobileChatOpen ? "hidden lg:block" : "block"}>
        <PageHead eyebrow="Community" title="VITchat" desc="Message fellow traders, share setups, and grow your circle.">
          <button className="tc-btn tc-btn-ghost" onClick={() => setView(view === "requests" ? "chat" : "requests")}>
            <UserPlus className="w-3.5 h-3.5" strokeWidth={2} /> Requests
            {VITCHAT_REQUESTS.length > 0 && <span className="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-tradeTeal/15 text-tradeTeal">{VITCHAT_REQUESTS.length}</span>}
          </button>
        </PageHead>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-4 lg:grid lg:grid-cols-[300px_1fr] lg:gap-4">
        {/* Friend list */}
        <div className={`tc-panel !p-3 flex-col min-h-0 ${mobileChatOpen ? "hidden lg:flex" : "flex flex-1 lg:flex-none"}`}>
          <div className="flex items-center gap-2.5 p-2 mb-2">
            <Avatar name={VITCHAT_ME.username} />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-tradeWhite truncate">{VITCHAT_ME.username}</div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/45">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR.online }} /> Online
              </div>
            </div>
          </div>
          <div className="tc-search mb-3">
            <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
            <input placeholder="Search friends…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
            {groups.map((g) => g.items.length > 0 && (
              <div key={g.label}>
                <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/35 px-2 mb-1">{g.label} · {g.items.length}</div>
                {g.items.map((f) => (
                  <button key={f.id} onClick={() => openConversation(f.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors ${activeId === f.id && view === "chat" ? "bg-tradeTeal/10" : "hover:bg-white/[0.03]"}`}>
                    <span className="relative shrink-0">
                      <Avatar name={f.username} sm />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface" style={{ background: STATUS_COLOR[f.status] }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-medium text-white/85 truncate">{f.username}</span>
                      <span className="block text-[11px] text-white/45 truncate">{f.last}</span>
                    </span>
                    {f.unread > 0 && <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-tradeTeal text-[#042024] shrink-0">{f.unread}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Chat / requests */}
        {!showChat ? (
          <div className={`tc-panel min-h-0 overflow-y-auto ${mobileChatOpen ? "flex-1 lg:flex-none" : "hidden lg:block"}`}>
            <div className="flex items-center gap-2 mb-4">
              <button className="tc-iconbtn lg:hidden" style={{ width: 32, height: 32 }} onClick={() => setView("chat")}><ChevronLeft className="w-4 h-4" /></button>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">Friend Requests</span>
            </div>
            <div className="flex flex-col gap-2">
              {VITCHAT_REQUESTS.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <Avatar name={r.username} sm />
                  <span className="flex-1 text-[13px] text-white/85">{r.username}</span>
                  <button className="tc-btn tc-btn-primary" style={{ padding: "7px 12px", fontSize: 12 }}><Check className="w-3.5 h-3.5" /> Accept</button>
                  <button className="tc-iconbtn" style={{ width: 32, height: 32 }}><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`tc-panel flex-col !p-0 overflow-hidden min-h-0 ${mobileChatOpen ? "flex flex-1 lg:flex-none" : "hidden lg:flex"}`}>
            <div className="flex items-center gap-2.5 px-3 sm:px-4 py-3 border-b border-white/[0.04] shrink-0">
              <button className="tc-iconbtn lg:hidden" style={{ width: 32, height: 32 }} onClick={() => setMobileChatOpen(false)} aria-label="Back"><ChevronLeft className="w-4 h-4" /></button>
              <span className="relative"><Avatar name={active.username} sm />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface" style={{ background: STATUS_COLOR[active.status] }} /></span>
              <div>
                <div className="text-[13px] font-semibold text-tradeWhite">{active.username}</div>
                <div className="font-mono text-[10px] text-white/45 capitalize">{active.status}</div>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
              {thread.map((m) => (
                <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] sm:max-w-[75%] px-3.5 py-2 rounded-2xl text-[13px] ${m.fromMe ? "bg-tradeTeal/15 text-white rounded-br-md" : "bg-white/[0.04] text-white/85 rounded-bl-md"}`}>
                    {m.text}
                    <span className="block font-mono text-[9px] text-white/35 mt-1">{m.t}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 py-1.5 border-t border-white/[0.04] flex items-center gap-1.5 shrink-0">
              {REACTIONS.map((r) => <button key={r} className="text-[15px] opacity-70 hover:opacity-100 transition-opacity">{r}</button>)}
            </div>
            <div className="p-2.5 sm:p-3 border-t border-white/[0.04] flex items-center gap-2 shrink-0">
              <button className="tc-iconbtn shrink-0" style={{ width: 36, height: 36 }}><Smile className="w-4 h-4" /></button>
              <input value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder={`Message ${active.username}…`}
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[13px] text-white outline-none focus:border-tradeTeal/40" />
              <button className="tc-btn tc-btn-primary shrink-0" style={{ padding: "9px 14px" }} onClick={sendMessage}><Send className="w-4 h-4" strokeWidth={2} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ name, sm }) {
  const size = sm ? 34 : 40;
  return (
    <span className="tc-avatar" style={{ width: size, height: size, fontSize: sm ? 13 : 15 }}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
