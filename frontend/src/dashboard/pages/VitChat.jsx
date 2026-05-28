import { useEffect, useRef, useState } from "react";
import {
  Search, UserPlus, Send, Check, CheckCheck, X, Smile, ChevronLeft,
  Reply, Copy as CopyIcon,
} from "lucide-react";
import { PageHead } from "../ui";
import { VITCHAT_ME, VITCHAT_FRIENDS, VITCHAT_REQUESTS, VITCHAT_THREAD } from "../data";

const STATUS_COLOR = { online: "#1FB8A6", dnd: "#F23645", offline: "#6B7686", invisible: "#6B7686" };
// Quick reactions surfaced in the per-message action bar.
const QUICK_REACTIONS = ["👍", "❤️", "😂", "🔥", "🎯", "😮", "😢"];
// Small picker grid for inserting emoji into the input.
const EMOJI_PICKER = [
  "😀", "😂", "🥰", "😎", "🤔", "😅", "😭", "🥹",
  "😘", "🤗", "🤩", "🥳", "🤯", "😱", "😴", "🫡",
  "🙏", "👀", "💯", "🔥", "✨", "⭐", "💎", "🚀",
  "📈", "📉", "💰", "💸", "🎯", "🏆", "⚡", "💪",
  "👍", "👎", "❤️", "🧡", "💛", "💚", "💙", "💜",
];
const AUTO_REPLIES = [
  "nice 👀", "let's see 🚀", "haha for real 😂", "I'm in 🔥",
  "good call 💯", "tracking that too 📈", "what's the entry?",
  "love it ❤️", "thx for the heads up 🙏", "watching now",
];

const fmtTime = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const seedThread = (raw) => raw.map((m, i) => ({ ...m, status: m.fromMe ? (i < raw.length - 2 ? "seen" : "delivered") : undefined, reactions: m.reactions || {}, replyTo: m.replyTo || null }));

export default function VitChat() {
  const [activeId, setActiveId] = useState(VITCHAT_FRIENDS[0].id);
  const [q, setQ] = useState("");
  const [view, setView] = useState("chat");
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState(() => seedThread(VITCHAT_THREAD));
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const [openMsgId, setOpenMsgId] = useState(null);   // which msg's action menu is open
  const [replyDraft, setReplyDraft] = useState(null); // msg being replied to
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const scrollerRef = useRef(null);
  const inputRef = useRef(null);

  const friends = VITCHAT_FRIENDS.filter((f) => f.username.toLowerCase().includes(q.toLowerCase()));
  const active = VITCHAT_FRIENDS.find((f) => f.id === activeId);
  const groups = [
    { label: "Online", items: friends.filter((f) => f.status === "online") },
    { label: "Do Not Disturb", items: friends.filter((f) => f.status === "dnd") },
    { label: "Offline", items: friends.filter((f) => f.status === "offline") },
  ];
  const showChat = view !== "requests";

  // Auto-scroll to bottom when messages or typing indicator change.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [thread, typing, replyDraft]);

  // Dismiss open action menus when clicking the message scroller background.
  const closeMenus = () => { setOpenMsgId(null); setEmojiOpen(false); };

  const openConversation = (id) => {
    setActiveId(id); setView("chat"); setMobileChatOpen(true);
    setReplyDraft(null); setOpenMsgId(null);
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const id = `m${Date.now()}`;
    const newMsg = { id, fromMe: true, text, t: fmtTime(), status: "sent", reactions: {}, replyTo: replyDraft?.id || null };
    setThread((t) => [...t, newMsg]);
    setDraft("");
    setReplyDraft(null);
    setEmojiOpen(false);
    // Simulate the read-receipt lifecycle.
    setTimeout(() => setThread((t) => t.map((m) => m.id === id ? { ...m, status: "delivered" } : m)), 420);
    setTimeout(() => setThread((t) => t.map((m) => m.id === id ? { ...m, status: "seen" } : m)), 1200);
    // Friend "typing…" + auto-reply.
    setTimeout(() => setTyping(true), 900);
    setTimeout(() => {
      setTyping(false);
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setThread((t) => [...t, { id: `m${Date.now()}r`, fromMe: false, text: reply, t: fmtTime(), reactions: {}, replyTo: null }]);
    }, 900 + 1200 + Math.random() * 800);
  };

  const toggleReaction = (msgId, emoji) => {
    setThread((t) => t.map((m) => {
      if (m.id !== msgId) return m;
      const r = { ...(m.reactions || {}) };
      if (r[emoji]) {
        if (r[emoji] > 1) r[emoji] -= 1; else delete r[emoji];
      } else {
        r[emoji] = 1;
      }
      return { ...m, reactions: r };
    }));
    setOpenMsgId(null);
  };

  const startReply = (msg) => {
    setReplyDraft(msg);
    setOpenMsgId(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  const copyMessage = (msg) => {
    navigator.clipboard?.writeText(msg.text).catch(() => {});
    setCopiedId(msg.id);
    setOpenMsgId(null);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const insertEmoji = (e) => {
    setDraft((d) => d + e);
    setEmojiOpen(false);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const findMessage = (id) => thread.find((m) => m.id === id);

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
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3 sm:px-4 py-3 border-b border-white/[0.04] shrink-0">
              <button className="tc-iconbtn lg:hidden" style={{ width: 32, height: 32 }} onClick={() => setMobileChatOpen(false)} aria-label="Back"><ChevronLeft className="w-4 h-4" /></button>
              <span className="relative">
                <Avatar name={active.username} sm />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface" style={{ background: STATUS_COLOR[active.status] }} />
              </span>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-tradeWhite truncate">{active.username}</div>
                <div className="font-mono text-[10px] text-white/45 capitalize">{typing ? <span className="text-tradeTeal">typing…</span> : active.status}</div>
              </div>
            </div>

            {/* Message list */}
            <div ref={scrollerRef} onClick={closeMenus}
              className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-2.5"
              data-testid="chat-scroller">
              {thread.map((m) => (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  me={VITCHAT_ME}
                  friend={active}
                  replied={m.replyTo ? findMessage(m.replyTo) : null}
                  isOpen={openMsgId === m.id}
                  copied={copiedId === m.id}
                  onOpen={() => setOpenMsgId((id) => id === m.id ? null : m.id)}
                  onReact={(emoji) => toggleReaction(m.id, emoji)}
                  onReply={() => startReply(m)}
                  onCopy={() => copyMessage(m)}
                />
              ))}
              {typing && <TypingBubble name={active.username} />}
            </div>

            {/* Reply draft preview */}
            {replyDraft && (
              <div className="flex items-stretch gap-2 px-3 sm:px-4 py-2 border-t border-white/[0.04] bg-tradeTeal/[0.04] shrink-0">
                <span className="w-1 rounded-full bg-tradeTeal/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.1em] uppercase text-tradeTeal">
                    <Reply className="w-3 h-3" strokeWidth={2.4} />
                    Reply to {replyDraft.fromMe ? "yourself" : active.username}
                  </div>
                  <div className="text-[12px] text-white/60 truncate mt-0.5">{replyDraft.text}</div>
                </div>
                <button onClick={() => setReplyDraft(null)} className="tc-iconbtn" style={{ width: 26, height: 26 }} aria-label="Cancel reply">
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Input row */}
            <div className="relative p-2.5 sm:p-3 border-t border-white/[0.04] flex items-center gap-2 shrink-0">
              <button onClick={() => setEmojiOpen((v) => !v)} className="tc-iconbtn shrink-0" style={{ width: 36, height: 36 }} aria-label="Emoji">
                <Smile className="w-4 h-4" />
              </button>
              <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); if (e.key === "Escape") setReplyDraft(null); }}
                placeholder={replyDraft ? `Reply to ${active.username}…` : `Message ${active.username}…`}
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[13px] text-white outline-none focus:border-tradeTeal/40"
                data-testid="chat-input" />
              <button className="tc-btn tc-btn-primary shrink-0" style={{ padding: "9px 14px" }} onClick={sendMessage} data-testid="chat-send">
                <Send className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* Emoji picker pop-up */}
              {emojiOpen && (
                <div className="absolute bottom-full left-2.5 sm:left-3 mb-2 z-20 p-2.5 rounded-2xl bg-surface border border-white/[0.08] shadow-2xl w-[296px]" data-testid="emoji-picker">
                  <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40 mb-2 px-1">Pick an emoji</div>
                  <div className="grid grid-cols-8 gap-0.5">
                    {EMOJI_PICKER.map((e) => (
                      <button key={e} onClick={() => insertEmoji(e)}
                        className="text-[20px] leading-none p-1.5 rounded-md hover:bg-white/[0.06] transition-colors">
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Subcomponents
   ============================================================ */

function MessageBubble({ msg, me, friend, replied, isOpen, copied, onOpen, onReact, onReply, onCopy }) {
  const isMe = msg.fromMe;
  const reactions = Object.entries(msg.reactions || {});

  return (
    <div className={`group flex ${isMe ? "justify-end" : "justify-start"}`} data-testid={`msg-${msg.id}`}>
      <div className={`relative max-w-[80%] sm:max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}
        onClick={(e) => e.stopPropagation()}>

        {/* Reply quote */}
        {replied && (
          <button
            className={`mb-1 flex items-stretch gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03] border-l-2 border-tradeTeal/60 text-left max-w-full hover:bg-white/[0.05] transition-colors`}
            onClick={() => {
              const target = document.querySelector(`[data-testid="msg-${replied.id}"]`);
              target?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}>
            <span className="min-w-0">
              <span className="block font-mono text-[9.5px] tracking-[0.1em] uppercase text-tradeTeal">
                {replied.fromMe ? me.username : friend.username}
              </span>
              <span className="block text-[11.5px] text-white/55 truncate max-w-[260px]">{replied.text}</span>
            </span>
          </button>
        )}

        {/* Bubble */}
        <div
          className={`relative px-3.5 py-2 rounded-2xl text-[13.5px] cursor-pointer transition-colors ${
            isMe
              ? `bg-tradeTeal/15 text-white rounded-br-md hover:bg-tradeTeal/[0.22] ${isOpen ? "bg-tradeTeal/[0.22]" : ""}`
              : `bg-white/[0.04] text-white/85 rounded-bl-md hover:bg-white/[0.06] ${isOpen ? "bg-white/[0.07]" : ""}`
          }`}
          onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          <span className="whitespace-pre-wrap break-words">{msg.text}</span>
          <span className="block font-mono text-[9px] text-white/35 mt-1 flex items-center gap-1">
            {msg.t}
            {isMe && <ReadReceipt status={msg.status} />}
            {copied && <span className="text-tradeTeal">· copied</span>}
          </span>

          {/* Action menu (Telegram-style floating toolbar) */}
          {isOpen && (
            <div className={`absolute z-20 -top-12 ${isMe ? "right-0" : "left-0"} flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-surface border border-white/[0.1] shadow-2xl`}
              onClick={(e) => e.stopPropagation()} data-testid="msg-actions">
              {QUICK_REACTIONS.map((e) => (
                <button key={e} onClick={() => onReact(e)}
                  className="text-[18px] leading-none px-1 py-1 rounded-md hover:scale-125 hover:bg-white/[0.05] transition-transform">
                  {e}
                </button>
              ))}
              <span className="w-px h-5 bg-white/[0.12] mx-1" />
              <button onClick={onReply} className="tc-iconbtn" style={{ width: 26, height: 26 }} title="Reply" data-testid="msg-reply">
                <Reply className="w-3 h-3" strokeWidth={2} />
              </button>
              <button onClick={onCopy} className="tc-iconbtn" style={{ width: 26, height: 26 }} title="Copy" data-testid="msg-copy">
                <CopyIcon className="w-3 h-3" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {/* Reactions row */}
        {reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
            {reactions.map(([emoji, count]) => (
              <button key={emoji} onClick={(e) => { e.stopPropagation(); onReact(emoji); }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[12px] hover:border-tradeTeal/40 transition-colors"
                data-testid={`reaction-${emoji}`}>
                <span>{emoji}</span>
                <span className="font-mono text-[10px] text-white/60">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReadReceipt({ status }) {
  if (!status || status === "sent") return <Check className="w-3 h-3 text-white/45" strokeWidth={2.4} />;
  if (status === "delivered") return <CheckCheck className="w-3 h-3 text-white/45" strokeWidth={2.4} />;
  return <CheckCheck className="w-3 h-3 text-tradeTeal" strokeWidth={2.4} />;
}

function TypingBubble({ name }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/[0.04] rounded-bl-md">
        <span className="sr-only">{name} is typing</span>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span className="w-1.5 h-1.5 rounded-full bg-tradeTeal/70" style={{ animation: "tcTypingBounce 1.1s ease-in-out infinite", animationDelay: `${delay}ms` }} />
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
