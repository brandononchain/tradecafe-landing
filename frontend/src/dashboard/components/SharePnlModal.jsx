import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Download, ImageIcon, Check, Send } from "lucide-react";
import Modal from "./Modal";
import { ACCOUNT } from "../data";
import { pnlSvg, svgToPngBlob } from "../lib/pnlCard";

const now = () => {
  const d = new Date();
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
};

export default function SharePnlModal({ data, onClose }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const code = (ACCOUNT.username || "TRADER").slice(0, 8).toUpperCase();
  const link = `https://tradecafe.ai/r/${code}?s=${encodeURIComponent(data.sym)}`;
  const text = `${data.dir} ${data.sym} ${data.pnl} on TradeCafe 🚀 — Trade smarter with AI.`;

  const svg = useMemo(
    () => pnlSvg({ ...data, handle: `@${ACCOUNT.username}`, code, link, entryTime: data.entryTime || now(), exitTime: data.exitTime || now() }),
    [data, code, link]
  );
  const svgUrl = useMemo(() => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg), [svg]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 1800); };
  const openShare = (url) => window.open(url, "_blank", "noopener,noreferrer");

  const shareX = () => openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`);
  const shareTG = () => openShare(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);

  const nativeShare = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: "My TradeCafe PnL", text, url: link }); return; }
    } catch { /* ignore */ }
    try { await navigator.clipboard.writeText(link); flash("Link copied"); } catch { flash("Copy the link below"); }
  };

  const download = async () => {
    try {
      const blob = await svgToPngBlob(svg);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `tradecafe-${data.sym}-pnl.png`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      flash("Image saved");
    } catch {
      const a = document.createElement("a");
      a.href = svgUrl; a.download = `tradecafe-${data.sym}-pnl.svg`; a.click();
      flash("Saved as SVG");
    }
  };

  const copyImage = async () => {
    try {
      const blob = await svgToPngBlob(svg);
      await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
      flash("Image copied");
    } catch {
      try { await navigator.clipboard.writeText(link); flash("Link copied"); } catch { flash("Copy unsupported"); }
    }
  };

  return (
    <Modal title="Share your PnL" sub="Preview looks right? Pick a channel below." width={420} onClose={onClose}>
      {/* preview — exactly what gets shared */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 50px rgba(0,180,166,0.1)" }}>
        <img src={svgUrl} alt="PnL card" className="w-full block" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="tc-btn tc-btn-primary" style={{ padding: "10px 0" }} onClick={nativeShare} data-testid="pnl-share">
          <Share2 className="w-3.5 h-3.5" strokeWidth={2} /> Share
        </button>
        <button className="tc-btn tc-btn-ghost" style={{ padding: "10px 0" }} onClick={download} data-testid="pnl-download">
          <Download className="w-3.5 h-3.5" strokeWidth={2} /> Download
        </button>
        <button className="tc-btn tc-btn-ghost" style={{ padding: "10px 0" }} onClick={copyImage} data-testid="pnl-copy-image">
          <ImageIcon className="w-3.5 h-3.5" strokeWidth={2} /> Copy
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40">Or share on</span>
        <button onClick={shareX} aria-label="Share on X" data-testid="pnl-x"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/[0.08] hover:border-tradeTeal/40 hover:text-tradeTeal text-white/80 transition-colors">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
        </button>
        <button onClick={shareTG} aria-label="Share on Telegram" data-testid="pnl-tg"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/[0.08] hover:border-tradeTeal/40 hover:text-tradeTeal text-white/80 transition-colors">
          <Send className="w-4 h-4" strokeWidth={2} />
        </button>
        <button onClick={() => navigate("/app/vitchat")} aria-label="Share to VITchat"
          className="px-3 h-9 rounded-full flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-tradeTeal/40 hover:text-tradeTeal text-white/80 transition-colors text-[12px]">
          VITchat
        </button>
      </div>

      {toast && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-tradeTeal">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> {toast}
        </div>
      )}
    </Modal>
  );
}
