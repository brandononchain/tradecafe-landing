import { useState } from "react";
import { Copy, Check, RefreshCw, Trash2, Plug, ShieldCheck, Wallet, Building2, Landmark } from "lucide-react";
import Modal from "./Modal";
import WalletPanel from "./WalletPanel";
import { BrandLogo } from "../lib/brandLogos";
import { API_EXCHANGES, API_BROKERS, TRADE_ACCOUNT, EXCHANGE_GUIDES } from "../data";

const maskKey = (k) => (k ? `${k.slice(0, 9)}${"•".repeat(6)}` : "—");
const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const normMode = (m) => (m === "api" ? "exchange" : m);

const MODES = [
  { id: "exchange", label: "Exchange", icon: Building2, hint: "Crypto CEX" },
  { id: "broker", label: "Broker", icon: Landmark, hint: "TradFi / FX" },
  { id: "web3", label: "Web3", icon: Wallet, hint: "On-chain" },
];

export default function TradeAccountModal({ onClose, initialMode = "exchange" }) {
  const [mode, setMode] = useState(normMode(initialMode));

  return (
    <Modal title="Connect an account" sub="Crypto exchange, TradFi broker, or Web3 wallet" width={540} onClose={onClose}>
      {/* Connection mode */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.025] border border-white/[0.05] mb-5">
        {MODES.map((m) => {
          const Ic = m.icon;
          const on = mode === m.id;
          return (
            <button key={m.id} onClick={() => setMode(m.id)} data-testid={`conn-mode-${m.id}`}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg transition-colors ${on ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/55 hover:text-white/85"}`}>
              <Ic className="w-4 h-4" strokeWidth={2} />
              <span className="text-[12px] font-semibold leading-none">{m.label}</span>
              <span className="font-mono text-[8.5px] tracking-[0.08em] uppercase opacity-70">{m.hint}</span>
            </button>
          );
        })}
      </div>

      {mode === "web3" && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-4 h-4 text-tradeTeal" strokeWidth={2} />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55">On-chain perpetuals</span>
          </div>
          <WalletPanel />
        </>
      )}

      {mode === "exchange" && <ApiConnect kind="exchange" providers={API_EXCHANGES} />}
      {mode === "broker" && <ApiConnect kind="broker" providers={API_BROKERS} />}
    </Modal>
  );
}

/* ===== API-based connector (exchanges + brokers) ===== */
function ApiConnect({ kind, providers }) {
  const isBroker = kind === "broker";
  const firstEnabled = providers.find((p) => p.enabled) || providers[0];
  const [provider, setProvider] = useState(firstEnabled.id);
  const [account, setAccount] = useState(!isBroker && TRADE_ACCOUNT.connected ? { ...TRADE_ACCOUNT } : null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [acctId, setAcctId] = useState("");
  const [wallet, setWallet] = useState(account ? { w: TRADE_ACCOUNT.wallet, u: TRADE_ACCOUNT.unrealized, a: TRADE_ACCOUNT.available } : null);
  const [syncing, setSyncing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const pObj = providers.find((p) => p.id === provider) || providers[0];
  const needsPass = !!pObj.passphrase;
  const needsAcct = !!pObj.account;
  const canSubmit = apiKey.trim() && apiSecret.trim() && (!needsPass || passphrase.trim()) && (!needsAcct || acctId.trim());

  const sync = () => {
    setSyncing(true);
    setTimeout(() => {
      setWallet({
        w: 1180 + Math.round(Math.random() * 80),
        u: Math.round((Math.random() * 60 - 30) * 100) / 100,
        a: 1080 + Math.round(Math.random() * 80),
      });
      setSyncing(false);
    }, 700);
  };

  const submitKeys = () => {
    if (!canSubmit) return;
    setAccount({ ...TRADE_ACCOUNT, exchange: provider, apiKey: apiKey.trim(), status: "Active" });
    setWallet({ w: 0, u: 0, a: 0 });
    setApiKey(""); setApiSecret(""); setPassphrase(""); setAcctId("");
  };

  const removeKeys = () => { setAccount(null); setWallet(null); setConfirmRemove(false); };

  return (
    <div className="relative">
      {/* Provider grid */}
      <div className="mb-5">
        <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/40 mb-2.5">
          {isBroker ? "Select your broker" : "Select your exchange"}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {providers.map((p) => {
            const on = p.id === provider;
            return (
              <button key={p.id} disabled={!p.enabled}
                onClick={() => p.enabled && setProvider(p.id)}
                data-testid={`provider-${p.id}`}
                className={`relative flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl border text-left transition-colors ${
                  !p.enabled ? "opacity-40 cursor-not-allowed border-white/[0.05]" :
                  on ? "bg-tradeTeal/10 border-tradeTeal/40" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14]"}`}>
                <BrandLogo id={p.id} size={30} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-medium text-white/85 truncate leading-tight">{p.label}</span>
                  {!p.enabled && <span className="font-mono text-[8.5px] tracking-[0.06em] uppercase text-white/35">Soon</span>}
                </span>
                {on && <Check className="w-3.5 h-3.5 text-tradeTeal shrink-0" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status card (crypto exchange account state) */}
      {!isBroker && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">Trading API account</span>
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
              No account connected yet. Add your {pObj.label} API keys below.
            </div>
          )}
        </div>
      )}

      {/* Credentials form */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <BrandLogo id={provider} size={24} />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">
            {account ? `Update ${pObj.label} keys` : `Connect ${pObj.label}`}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {needsAcct && <Field label={isBroker ? "Account ID" : "Sub-account ID"} value={acctId} onChange={setAcctId} placeholder={isBroker ? "e.g. 001-011-1234567-001" : "Account ID"} />}
          <Field label={isBroker ? "API Token" : "API Key"} value={apiKey} onChange={setApiKey} placeholder={isBroker ? "API Token" : "API Key"} />
          <Field label={isBroker ? "API Secret" : "API Secret"} value={apiSecret} onChange={setApiSecret} placeholder="API Secret" type="password" />
          {needsPass && <Field label="Passphrase" value={passphrase} onChange={setPassphrase} placeholder="Passphrase" type="password" />}
          <button className="tc-btn tc-btn-primary w-full" disabled={!canSubmit}
            style={!canSubmit ? { opacity: 0.5, pointerEvents: "none" } : undefined} onClick={submitKeys} data-testid="update-keys">
            <Plug className="w-3.5 h-3.5" strokeWidth={2} /> {account ? "Update keys" : "Connect account"}
          </button>
        </div>
      </div>

      {/* Guide */}
      {!account && EXCHANGE_GUIDES[provider] ? (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50 mb-2.5">{EXCHANGE_GUIDES[provider].title}</div>
          <ol className="flex flex-col gap-1.5 list-decimal pl-4">
            {EXCHANGE_GUIDES[provider].steps.map((s, i) => (
              <li key={i} className="text-[11.5px] text-white/55 leading-[1.45]">{s}</li>
            ))}
          </ol>
          <div className="flex items-start gap-2 mt-3 text-[11px] text-white/45">
            <ShieldCheck className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2} /> {EXCHANGE_GUIDES[provider].note}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11.5px] text-white/50">
          <ShieldCheck className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2} />
          Keys are stored encrypted and used for trading only — never withdrawals. Use read + trade permissions and bind an IP where supported.
        </div>
      )}

      {confirmRemove && (
        <div className="absolute inset-0 rounded-2xl bg-black/70 flex items-center justify-center p-6 z-20">
          <div className="w-full max-w-[320px] p-5 rounded-xl bg-surface border border-white/[0.07] text-center">
            <Trash2 className="w-6 h-6 text-[#FF8A82] mx-auto mb-3" strokeWidth={1.8} />
            <div className="text-[14px] font-semibold text-tradeWhite mb-1.5">Remove API keys?</div>
            <p className="text-[12px] text-white/50 mb-4">This disconnects TradeCafe from your account. You can reconnect anytime.</p>
            <div className="flex gap-2.5">
              <button className="tc-btn tc-btn-ghost flex-1" onClick={() => setConfirmRemove(false)}>Cancel</button>
              <button className="tc-btn flex-1" style={{ color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" }} onClick={removeKeys}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="font-mono text-[8.5px] tracking-[0.1em] uppercase text-white/40 mb-1.5">{label}</div>
      <div className={`font-heading text-[17px] font-bold tracking-[-0.02em] ${tone === "pos" ? "text-tradeTeal" : tone === "neg" ? "text-[#FF8A82]" : "text-tradeWhite"}`}>{value}</div>
    </div>
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
