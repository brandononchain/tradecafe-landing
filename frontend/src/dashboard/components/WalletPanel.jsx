import { useState } from "react";
import { Wallet, Copy, Check, LogOut, Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import { useWallet } from "../WalletContext";
import { EVM_CHAINS, EVM_WALLETS, SOLANA_WALLETS, shortAddr, detectWallet } from "../lib/web3";
import { BrandLogo } from "../lib/brandLogos";

export default function WalletPanel() {
  const { ecosystem, address, chainId, balance, network, nativeSymbol, connecting, error, hasEvm, hasSolana, hasProvider, connect, disconnect, changeChain } = useWallet();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  // No wallet at all
  if (!hasProvider) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <span className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
          <Wallet className="w-6 h-6 text-white/55" strokeWidth={1.8} />
        </span>
        <div className="text-[14px] font-semibold text-tradeWhite">No Web3 wallet detected</div>
        <p className="text-[12.5px] text-white/50 mt-1.5 max-w-[300px]">Install an EVM wallet (MetaMask) or a Solana wallet (Phantom) to trade on-chain perps.</p>
        <div className="flex gap-2 mt-4">
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="tc-btn tc-btn-ghost">MetaMask <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} /></a>
          <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer" className="tc-btn tc-btn-ghost">Phantom <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} /></a>
        </div>
      </div>
    );
  }

  // Connected
  if (address) {
    const isEvm = ecosystem === "evm";
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">Connected · {isEvm ? "EVM" : "Solana"}</span>
          <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> {network?.short || (isEvm ? "EVM" : "Solana")}</span>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: isEvm ? "linear-gradient(135deg,var(--tc-accent-light),var(--tc-accent))" : "linear-gradient(135deg,#9B8AFB,#7C5CFC)" }}>
            <Wallet className="w-4 h-4 text-[#042024]" strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[13px] text-tradeWhite">{shortAddr(address)}</div>
            <div className="font-mono text-[10.5px] text-white/45">{balance ?? "…"} {nativeSymbol}</div>
          </div>
          <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={copy} aria-label="Copy address">
            {copied ? <Check className="w-3.5 h-3.5 text-tradeTeal" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isEvm ? (
          <div>
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mb-2">EVM network</div>
            <div className="grid grid-cols-2 gap-1.5">
              {EVM_CHAINS.map((c) => (
                <button key={c.id} onClick={() => changeChain(c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors ${
                    String(chainId).toLowerCase() === c.id ? "bg-tradeTeal/12 border-tradeTeal/35 text-tradeTeal" : "bg-white/[0.02] border-white/[0.05] text-white/70 hover:border-white/[0.12]"}`}
                  data-testid={`chain-${c.dec}`}>
                  <span className="text-[12px] font-medium">{c.short}</span>
                  {String(chainId).toLowerCase() === c.id && <Check className="w-3 h-3" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <span className="font-mono text-[11px] text-white/55">Cluster</span>
            <span className="text-[12px] text-tradeTeal">Solana Mainnet</span>
          </div>
        )}

        <div className="flex items-start gap-2 text-[11px] text-white/45">
          <ShieldCheck className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2} />
          Ready for on-chain perps across {isEvm ? "EVM chains" : "Solana"}. TradeCafe never holds your keys.
        </div>

        <button className="tc-btn tc-btn-ghost w-full" onClick={disconnect} data-testid="wallet-disconnect">
          <LogOut className="w-3.5 h-3.5" strokeWidth={2} /> Disconnect
        </button>
      </div>
    );
  }

  // Not connected — show both ecosystems
  const Group = ({ title, badge, eco, wallets, enabled }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/45">{title}</span>
        <span className={`font-mono text-[8.5px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded ${enabled ? "bg-tradeTeal/12 text-tradeTeal" : "text-white/30"}`}>{enabled ? "available" : "not detected"}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {wallets.map((w) => {
          const detected = detectWallet(w.id);
          return (
            <button key={w.id} onClick={() => connect(eco)} disabled={connecting || !enabled}
              className="relative flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-tradeTeal/35 hover:bg-white/[0.04] transition-colors text-left disabled:opacity-40 disabled:hover:border-white/[0.06]"
              data-testid={`wallet-${w.id}`}>
              <BrandLogo id={w.id} size={34} />
              <span className="min-w-0">
                <span className="block text-[12.5px] font-medium text-white/85 truncate">{w.label}</span>
                {detected && <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.08em] text-tradeTeal"><Check className="w-2.5 h-2.5" strokeWidth={3} /> Detected</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12.5px] text-white/55 leading-[1.5]">
        Connect a non-custodial wallet — <span className="text-white/80">EVM or Solana</span> — to trade on-chain perpetuals from the Terminal.
      </p>
      <Group title="EVM wallets" eco="evm" wallets={EVM_WALLETS} enabled={hasEvm} />
      <Group title="Solana wallets" eco="solana" wallets={SOLANA_WALLETS} enabled={hasSolana} />
      {connecting && <div className="flex items-center justify-center gap-1.5 text-[12px] text-white/55"><Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Connecting…</div>}
      {error === "REJECTED" && <div className="text-[11.5px] text-[#FF8A82] text-center">Connection request was rejected.</div>}
      {error === "FAILED" && <div className="text-[11.5px] text-[#FF8A82] text-center">Couldn’t connect. Please try again.</div>}
      {error === "NO_PROVIDER" && <div className="text-[11.5px] text-[#FF8A82] text-center">That wallet isn’t installed.</div>}
    </div>
  );
}
