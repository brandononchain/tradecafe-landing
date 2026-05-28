import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, MessageSquare, Download, Link2 } from "lucide-react";
import Modal from "./Modal";
import ProofCard from "../../components/ProofCard";
import { useTheme } from "../ThemeContext";
import { ACCOUNT } from "../data";

export default function SharePnlModal({ data, onClose }) {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [copied, setCopied] = useState(false);
  const code = (ACCOUNT.username || "TRADER").slice(0, 7).toUpperCase();
  const link = `https://tradecafe.ai/r/${code}?s=${encodeURIComponent(data.sym)}`;

  const copy = () => {
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Modal title="Share your PnL" sub="Verified card with your referral link" width={460} onClose={onClose}
      footer={
        <>
          <button className="tc-btn tc-btn-ghost flex-1" onClick={() => navigate("/app/vitchat")}>
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} /> Share to VITchat
          </button>
          <button className="tc-btn tc-btn-primary flex-1" onClick={copy} data-testid="copy-pnl-link">
            {copied ? <><Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Copied</> : <><Copy className="w-3.5 h-3.5" strokeWidth={2} /> Copy link</>}
          </button>
        </>
      }
    >
      <div className="flex justify-center mb-4">
        <ProofCard {...data} handle={`@${ACCOUNT.username}`} code={code} light={mode === "light"} />
      </div>
      <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <Link2 className="w-3.5 h-3.5 text-white/40 shrink-0" strokeWidth={2} />
        <span className="font-mono text-[11px] text-white/55 truncate flex-1">{link}</span>
        <button className="tc-iconbtn" style={{ width: 28, height: 28 }} title="Download image"><Download className="w-3.5 h-3.5" /></button>
      </div>
    </Modal>
  );
}
