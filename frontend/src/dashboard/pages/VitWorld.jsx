import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, Globe, Settings2, MessageSquare, UserPlus, X, Check } from "lucide-react";
import { PageHead, Panel } from "../ui";
import GlobeCanvas from "../components/GlobeCanvas";
import { useTheme } from "../ThemeContext";
import { VITWORLD_USERS } from "../data";

const PRIVACY_FIELDS = ["Location", "Username", "Avatar", "Online status"];
const PRIVACY_OPTS = ["Everyone", "Friends", "Nobody"];

export default function VitWorld() {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [selected, setSelected] = useState(null);
  const [requested, setRequested] = useState([]);
  const [q, setQ] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [visible, setVisible] = useState(true);
  const [privacy, setPrivacy] = useState({ Location: "Everyone", Username: "Everyone", Avatar: "Friends", "Online status": "Everyone" });

  const online = VITWORLD_USERS.filter((u) => u.online).length;
  const results = q ? VITWORLD_USERS.filter((u) => u.username.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow="Social" title="VITworld" desc="See where TradeCafe traders are around the globe in real time.">
        <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> {online} online</span>
        <button className="tc-btn tc-btn-ghost" onClick={() => setShowPrivacy(true)}><Settings2 className="w-3.5 h-3.5" strokeWidth={2} /> Privacy</button>
      </PageHead>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Globe */}
        <Panel className="!p-0 overflow-hidden">
          <div className="p-3 border-b border-white/[0.04]">
            <div className="tc-search max-w-[320px]">
              <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
              <input placeholder="Search traders…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            {results.length > 0 && (
              <div className="mt-2 max-w-[320px] rounded-lg bg-white/[0.03] border border-white/[0.05] p-1">
                {results.slice(0, 6).map((u) => (
                  <button key={u.id} onClick={() => { setSelected(u); setQ(""); }} className="w-full flex items-center gap-2 px-2.5 py-2 rounded hover:bg-white/[0.04] text-left">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.online ? "#1FB8A6" : "#6B7686" }} />
                    <span className="text-[12.5px] text-white/85 flex-1">{u.username}</span>
                    <span className="font-mono text-[10px] text-white/40">{u.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative mx-auto" style={{ width: "100%", maxWidth: 520, aspectRatio: "1 / 1" }}>
            <GlobeCanvas users={VITWORLD_USERS} selectedId={selected?.id} onSelect={setSelected} light={mode === "light"} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/30 pointer-events-none">
              Drag to rotate · tap a beam
            </div>
          </div>
        </Panel>

        {/* Profile card / hint */}
        {selected ? (
          <Panel className="flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="tc-avatar" style={{ width: 48, height: 48, fontSize: 18 }}>{selected.username.slice(0, 1).toUpperCase()}</span>
                <div>
                  <div className="text-[15px] font-semibold text-tradeWhite">{selected.username}</div>
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-white/45 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: selected.online ? "#1FB8A6" : "#6B7686" }} />
                    {selected.online ? "Online" : "Offline"} · {selected.country}
                  </div>
                </div>
              </div>
              <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={() => setSelected(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex gap-2.5 mt-5">
              <button className="tc-btn tc-btn-ghost flex-1" onClick={() => navigate("/app/vitchat")}>
                <MessageSquare className="w-4 h-4" strokeWidth={2} /> Message
              </button>
              {requested.includes(selected.id) ? (
                <button className="tc-btn tc-btn-ghost flex-1" disabled style={{ opacity: 0.7 }}>
                  <Check className="w-4 h-4" strokeWidth={2.4} /> Requested
                </button>
              ) : (
                <button className="tc-btn tc-btn-primary flex-1" onClick={() => setRequested((p) => [...p, selected.id])}>
                  <UserPlus className="w-4 h-4" strokeWidth={2} /> Add
                </button>
              )}
            </div>
          </Panel>
        ) : (
          <Panel className="flex flex-col items-center justify-center text-center">
            <span className="tc-soon-ico mb-4"><Globe className="w-7 h-7" strokeWidth={1.6} /></span>
            <div className="text-[14px] font-semibold text-tradeWhite">Explore the network</div>
            <p className="text-[12.5px] text-white/50 mt-2 max-w-[240px]">Tap any beam on the globe to view a trader and connect.</p>
          </Panel>
        )}
      </div>

      {showPrivacy && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPrivacy(false)} />
          <div className="relative w-full max-w-[440px] rounded-2xl bg-surface border border-white/[0.05] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55">VITworld Settings</span>
              <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={() => setShowPrivacy(false)}><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3">
              <span className="text-[13px] font-medium text-white/85">Show me on VITworld</span>
              <button onClick={() => setVisible((v) => !v)} className={`tc-switch ${visible ? "is-on" : ""}`} role="switch" aria-checked={visible}>
                <span className="tc-switch-knob" />
              </button>
            </div>
            {visible && PRIVACY_FIELDS.map((f) => (
              <div key={f} className="flex items-center justify-between py-2.5">
                <span className="text-[12.5px] text-white/70">{f}</span>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  {PRIVACY_OPTS.map((o) => (
                    <button key={o} onClick={() => setPrivacy((p) => ({ ...p, [f]: o }))}
                      className={`px-2.5 py-1 rounded font-mono text-[9.5px] uppercase tracking-[0.08em] transition-colors ${privacy[f] === o ? "bg-tradeTeal/20 text-tradeTeal" : "text-white/45"}`}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
