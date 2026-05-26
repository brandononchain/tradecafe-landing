import { useState } from "react";
import { Wallet, Copy, Check, LogOut, Loader2, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";
import { useWallet } from "../WalletContext";
import { PERP_CHAINS, CHAIN_BY_ID, WALLETS, shortAddr, chainName } from "../lib/web3";

export default function WalletPanel() {
  const { address, chainId, balance, connecting, error, hasProvider, connect, disconnect, changeChain } = useWallet();
  const [copied, setCopied] = useState(false);
  const current = chainId ? CHAIN_BY_ID[String(chainId).toLowerCase()] : null;
  const supported = !!current;

  const copy = () => {
    navigator.clipboard?.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  // No injected wallet available
  if (!hasProvider) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <span className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
          <Wallet className="w-6 h-6 text-white/55" strokeWidth={1.8} />
        </span>
        <div className="text-[14px] font-semibold text-tradeWhite">No Web3 wallet detected</div>
        <p className="text-[12.5px] text-white/50 mt-1.5 max-w-[300px]">Install MetaMask (or another EVM wallet) to connect and trade on-chain perpetuals.</p>
        <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="tc-btn tc-btn-ghost mt-4">
          Get MetaMask <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
        </a>
      </div>
    );
  }

  // Connected
  if (address) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">Connected wallet</span>
          <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> Connected</span>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,var(--tc-accent-light),var(--tc-accent))" }}>
            <Wallet className="w-4 h-4 text-[#042024]" strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[13px] text-tradeWhite">{shortAddr(address)}</div>
            <div className="font-mono text-[10.5px] text-white/45">{balance ?? "…"} {current?.native || "ETH"}</div>
          </div>
          <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={copy} aria-label="Copy address">
            {copied ? <Check className="w-3.5 h-3.5 text-tradeTeal" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div>
          <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mb-2">Network</div>
          {!supported && (
            <div className="flex items-center gap-2 p-2.5 mb-2 rounded-lg bg-[#E8782A]/8 border border-[#E8782A]/20 text-[11.5px] text-white/60">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FFB68A] shrink-0" strokeWidth={2} />
              {chainName(chainId)} — switch to a supported perps network.
            </div>
          )}
          <div className="grid grid-cols-2 gap-1.5">
            {PERP_CHAINS.map((c) => (
              <button key={c.id} onClick={() => changeChain(c.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors ${
                  current?.id === c.id ? "bg-tradeTeal/12 border-tradeTeal/35 text-tradeTeal" : "bg-white/[0.02] border-white/[0.05] text-white/70 hover:border-white/[0.12]"}`}
                data-testid={`chain-${c.dec}`}>
                <span className="text-[12px] font-medium">{c.short}</span>
                {current?.id === c.id && <Check className="w-3 h-3" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-white/45">
          <ShieldCheck className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2} />
          Ready for on-chain perpetuals. TradeCafe never holds your keys — orders are signed in your wallet.
        </div>

        <button className="tc-btn tc-btn-ghost w-full" onClick={disconnect} data-testid="wallet-disconnect">
          <LogOut className="w-3.5 h-3.5" strokeWidth={2} /> Disconnect
        </button>
      </div>
    );
  }

  // Not connected
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12.5px] text-white/55 leading-[1.5]">
        Connect a non-custodial wallet to trade <span className="text-white/80">on-chain perpetuals</span> directly from the Terminal.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {WALLETS.map((w) => (
          <button key={w.id} onClick={connect} disabled={connecting}
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-tradeTeal/30 transition-colors text-left disabled:opacity-50"
            data-testid={`wallet-${w.id}`}>
            <span className="w-7 h-7 rounded-lg bg-tradeTeal/10 border border-tradeTeal/20 flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2} />
            </span>
            <span className="text-[12.5px] font-medium text-white/80">{w.label}</span>
          </button>
        ))}
      </div>
      <button className="tc-btn tc-btn-primary w-full" onClick={connect} disabled={connecting} data-testid="wallet-connect">
        {connecting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Connecting…</> : <><Wallet className="w-3.5 h-3.5" strokeWidth={2} /> Connect wallet</>}
      </button>
      {error === "REJECTED" && <div className="text-[11.5px] text-[#FF8A82] text-center">Connection request was rejected.</div>}
      {error === "FAILED" && <div className="text-[11.5px] text-[#FF8A82] text-center">Couldn’t connect. Please try again.</div>}
    </div>
  );
}
