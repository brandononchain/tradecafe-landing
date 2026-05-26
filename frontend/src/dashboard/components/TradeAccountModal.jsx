import { useState } from "react";
import { ChevronDown, Copy, Check, RefreshCw, Trash2, Plug, ShieldCheck, Wallet } from "lucide-react";
import Modal from "./Modal";
import WalletPanel from "./WalletPanel";
import { API_EXCHANGES, ACCOUNT_MARKET_TABS, TRADE_ACCOUNT, EXCHANGE_GUIDES } from "../data";

const maskKey = (k) => (k ? `${k.slice(0, 9)}${"•".repeat(6)}` : "—");
const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

export default function TradeAccountModal({ onClose, initialMode = "api" }) {
  const [mode, setMode] = useState(initialMode);
  const [market, setMarket] = useState("crypto");
  const [account, setAccount] = useState(TRADE_ACCOUNT.connected ? { ...TRADE_ACCOUNT } : null);
  const [exchange, setExchange] = useState(TRADE_ACCOUNT.exchange || "bybit");
  const [exOpen, setExOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [wallet, setWallet] = useState(account ? { w: TRADE_ACCOUNT.wallet, u: TRADE_ACCOUNT.unrealized, a: TRADE_ACCOUNT.available } : null);
  const [syncing, setSyncing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const exObj = API_EXCHANGES.find((e) => e.id === exchange) || API_EXCHANGES[0];
  const needsPass = exObj.passphrase;
  const canSubmit = apiKey.trim() && apiSecret.trim() && (!needsPass || passphrase.trim());

  const sync = () => {
    setSyncing(true);
    setTimeout(() => {
      setWallet((w) => ({
        w: 1180 + Math.round(Math.random() * 80),
        u: Math.round((Math.random() * 60 - 30) * 100) / 100,
        a: 1080 + Math.round(Math.random() * 80),
      }));
      setSyncing(false);
    }, 700);
  };

  const submitKeys = () => {
    if (!canSubmit) return;
    setAccount({
      ...TRADE_ACCOUNT,
      exchange,
      apiKey: apiKey.trim(),
      status: "Active",
    });
    setWallet({ w: 0, u: 0, a: 0 });
    setApiKey(""); setApiSecret(""); setPassphrase("");
  };

  const removeKeys = () => {
    setAccount(null);
    setWallet(null);
    setConfirmRemove(false);
  };

  const Stat = ({ label, value, tone }) => (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="font-mono text-[8.5px] tracking-[0.1em] uppercase text-white/40 mb-1.5">{label}</div>
      <div className={`font-heading text-[17px] font-bold tracking-[-0.02em] ${tone === "pos" ? "text-tradeTeal" : tone === "neg" ? "text-[#FF8A82]" : "text-tradeWhite"}`}>{value}</div>
    </div>
  );

  return (
    <Modal title="Trade account" sub="Connect an exchange, broker, or Web3 wallet" width={520} onClose={onClose}>
      {/* Connection mode */}
      <div className="tc-segment mb-5">
        <div className={`tc-segment-btn ${mode === "api" ? "is-active" : ""}`} style={{ padding: "9px 0" }} onClick={() => setMode("api")} data-testid="conn-mode-api">Exchange / Broker</div>
        <div className={`tc-segment-btn ${mode === "web3" ? "is-active" : ""}`} style={{ padding: "9px 0" }} onClick={() => setMode("web3")} data-testid="conn-mode-web3">Web3 Wallet</div>
      </div>

      {mode === "web3" ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-4 h-4 text-tradeTeal" strokeWidth={2} />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55">On-chain perpetuals</span>
          </div>
          <WalletPanel />
        </>
      ) : (
        <>
      {/* Market tabs */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {ACCOUNT_MARKET_TABS.map((m) => (
          <button key={m.id} disabled={!m.enabled} onClick={() => m.enabled && setMarket(m.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
              !m.enabled ? "opacity-40 cursor-not-allowed text-white/40 border-white/[0.04]" :
              market === m.id ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/55 border-white/[0.05]"}`}>
            {m.label}{!m.enabled && " · Soon"}
          </button>
        ))}
      </div>

      {/* Status card */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">Trading API account <span className="text-white/35">(Crypto)</span></span>
          <span className={`tc-chip ${account ? "tc-chip-active" : ""}`}>
            {account && <span className="tc-chip-dot" />} {account ? "Active" : "Not connected"}
          </span>
        </div>

        {account ? (
          <>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Stat label="Current API key" value={<span className="font-mono text-[13px] text-tradeWhite">{maskKey(account.apiKey)}</span>} />
              <Stat label="API key expires" value={<span className="text-[13px] text-tradeWhite">{TRADE_ACCOUNT.apiKeyExpires}</span>} />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <Stat label="Wallet balance" value={syncing ? "…" : fmt(wallet?.w)} />
              <Stat label="Unrealized PnL" value={syncing ? "…" : fmt(wallet?.u)} tone={wallet?.u >= 0 ? "pos" : "neg"} />
              <Stat label="Available" value={syncing ? "…" : fmt(wallet?.a)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="tc-btn tc-btn-ghost" style={{ padding: "8px 12px", fontSize: 12 }} onClick={() => setAccount(null)}>Deactivate account</button>
              <button className="tc-btn tc-btn-ghost" style={{ padding: "8px 12px", fontSize: 12 }} onClick={sync} disabled={syncing}>
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} strokeWidth={2} /> Sync balance
              </button>
              <button className="tc-btn" style={{ padding: "8px 12px", fontSize: 12, color: "#FF8A82", border: "1px solid rgba(242,54,69,0.3)" }} onClick={() => setConfirmRemove(true)}>
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} /> Remove API keys
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center text-[12.5px] text-white/50">
            No trading account connected yet. Add your exchange API keys below.
          </div>
        )}
      </div>

      {/* Update / create keys */}
      <div className="mb-5">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50 mb-3">{account ? "Update API keys" : "Connect exchange (set API keys)"}</div>

        <div className="relative mb-3">
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/40 block mb-1.5">Exchange / Broker</span>
          <button onClick={() => setExOpen((v) => !v)} onBlur={() => setTimeout(() => setExOpen(false), 150)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-tradeTeal/30 transition-colors">
            <span className="text-[13px] text-tradeWhite">{exObj.label}</span>
            <ChevronDown className="w-4 h-4 text-white/40" strokeWidth={2} />
          </button>
          {exOpen && (
            <div className="absolute left-0 right-0 mt-1.5 p-1.5 rounded-xl bg-surface border border-white/[0.06] shadow-xl z-50 max-h-[200px] overflow-y-auto">
              {API_EXCHANGES.map((ex) => (
                <button key={ex.id} disabled={!ex.enabled}
                  onMouseDown={(e) => { e.preventDefault(); if (ex.enabled) { setExchange(ex.id); setExOpen(false); } }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                    !ex.enabled ? "opacity-40 cursor-not-allowed" : ex.id === exchange ? "bg-tradeTeal/10" : "hover:bg-white/[0.04]"}`}>
                  <span className="text-[12.5px] text-white/85">{ex.label}</span>
                  {!ex.enabled && <span className="font-mono text-[9px] text-white/35">Soon</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Field label={account ? "New API Key" : "API Key"} value={apiKey} onChange={setApiKey} placeholder="API Key" />
          <Field label={account ? "New API Secret" : "API Secret"} value={apiSecret} onChange={setApiSecret} placeholder="API Secret" type="password" />
          {needsPass && <Field label="Passphrase" value={passphrase} onChange={setPassphrase} placeholder="Passphrase" type="password" />}
          <button className="tc-btn tc-btn-primary w-full" disabled={!canSubmit}
            style={!canSubmit ? { opacity: 0.5, pointerEvents: "none" } : undefined} onClick={submitKeys} data-testid="update-keys">
            <Plug className="w-3.5 h-3.5" strokeWidth={2} /> {account ? "Update keys" : "Connect account"}
          </button>
        </div>
      </div>

      {/* Guide */}
      {!account && EXCHANGE_GUIDES[exchange] && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50 mb-2.5">{EXCHANGE_GUIDES[exchange].title}</div>
          <ol className="flex flex-col gap-1.5 list-decimal pl-4">
            {EXCHANGE_GUIDES[exchange].steps.map((s, i) => (
              <li key={i} className="text-[11.5px] text-white/55 leading-[1.45]">{s}</li>
            ))}
          </ol>
          <div className="flex items-start gap-2 mt-3 text-[11px] text-white/45">
            <ShieldCheck className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2} /> {EXCHANGE_GUIDES[exchange].note}
          </div>
        </div>
      )}

      {confirmRemove && (
        <div className="absolute inset-0 rounded-2xl bg-black/70 flex items-center justify-center p-6 z-20">
          <div className="w-full max-w-[320px] p-5 rounded-xl bg-surface border border-white/[0.07] text-center">
            <Trash2 className="w-6 h-6 text-[#FF8A82] mx-auto mb-3" strokeWidth={1.8} />
            <div className="text-[14px] font-semibold text-tradeWhite mb-1.5">Remove API keys?</div>
            <p className="text-[12px] text-white/50 mb-4">This disconnects the bot from your exchange. You can reconnect anytime.</p>
            <div className="flex gap-2.5">
              <button className="tc-btn tc-btn-ghost flex-1" onClick={() => setConfirmRemove(false)}>Cancel</button>
              <button className="tc-btn flex-1" style={{ color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" }} onClick={removeKeys}>Remove</button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </Modal>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/40 block mb-1.5">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[13px] text-white outline-none focus:border-tradeTeal/40 transition-colors" />
    </label>
  );
}

export { Copy, Check };
