// Cross-chain wallet access — EVM (EIP-1193 injected) + Solana (Phantom /
// Solflare / Backpack). One small dependency-free layer used to connect a
// wallet for on-chain perpetuals across ecosystems.

/* ============================ Networks ============================ */
export const EVM_CHAINS = [
  { id: "0xa4b1", dec: 42161, name: "Arbitrum One", short: "Arbitrum", native: "ETH", ecosystem: "evm" },
  { id: "0x2105", dec: 8453, name: "Base", short: "Base", native: "ETH", ecosystem: "evm" },
  { id: "0xa", dec: 10, name: "Optimism", short: "Optimism", native: "ETH", ecosystem: "evm" },
  { id: "0x1", dec: 1, name: "Ethereum", short: "Ethereum", native: "ETH", ecosystem: "evm" },
];
export const SOLANA_NET = { id: "solana", name: "Solana", short: "Solana", native: "SOL", ecosystem: "solana" };
export const NETWORKS = [...EVM_CHAINS, SOLANA_NET];
export const CHAIN_BY_ID = EVM_CHAINS.reduce((a, c) => ({ ...a, [c.id.toLowerCase()]: c }), {});

export const EVM_WALLETS = [
  { id: "metamask", label: "MetaMask", brand: "#E2761B", flag: "isMetaMask" },
  { id: "rabby", label: "Rabby", brand: "#7084FF", flag: "isRabby" },
  { id: "coinbase", label: "Coinbase", brand: "#2C5FF6", flag: "isCoinbaseWallet" },
  { id: "injected", label: "Browser Wallet", brand: "#00B4A6", flag: null },
];
export const SOLANA_WALLETS = [
  { id: "phantom", label: "Phantom", brand: "#AB9FF2", flag: "isPhantom" },
  { id: "solflare", label: "Solflare", brand: "#FC8E2B", flag: "isSolflare" },
  { id: "backpack", label: "Backpack", brand: "#E33E3F", flag: "isBackpack" },
];

// Which specific wallet brand is the active injected provider.
export function detectWallet(id) {
  if (typeof window === "undefined") return false;
  const eth = window.ethereum;
  if (id === "metamask") return !!eth?.isMetaMask && !eth?.isRabby;
  if (id === "rabby") return !!eth?.isRabby;
  if (id === "coinbase") return !!eth?.isCoinbaseWallet;
  if (id === "injected") return !!eth;
  if (id === "phantom") return !!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom);
  if (id === "solflare") return !!window.solflare?.isSolflare;
  if (id === "backpack") return !!window.backpack?.isBackpack;
  return false;
}

const SOL_RPC = "https://api.mainnet-beta.solana.com";

/* ============================ Shared ============================== */
export function shortAddr(a) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}
export function chainName(chainId) {
  if (!chainId) return "Unknown";
  if (chainId === "solana") return "Solana";
  return CHAIN_BY_ID[String(chainId).toLowerCase()]?.name || `Chain ${parseInt(chainId, 16) || chainId}`;
}
export function networkFor(ecosystem, chainId) {
  if (ecosystem === "solana") return SOLANA_NET;
  return CHAIN_BY_ID[String(chainId).toLowerCase()] || { short: "Unknown", native: "ETH", ecosystem: "evm" };
}
const toHex = (bytes) => Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");

/* ============================== EVM =============================== */
export function getEthereum() {
  return typeof window !== "undefined" ? window.ethereum : null;
}
export function formatEth(weiHex) {
  try {
    const wei = BigInt(weiHex);
    const whole = wei / 1000000000000000000n;
    const frac = (wei % 1000000000000000000n).toString().padStart(18, "0").slice(0, 4);
    return `${whole}.${frac}`;
  } catch { return "0.0000"; }
}
export async function evmConnect() {
  const eth = getEthereum();
  if (!eth) throw new Error("NO_PROVIDER");
  const accounts = await eth.request({ method: "eth_requestAccounts" });
  const chainId = await eth.request({ method: "eth_chainId" });
  return { address: accounts?.[0] || null, chainId };
}
export async function evmAccounts() {
  const eth = getEthereum();
  if (!eth) return { address: null, chainId: null };
  try {
    const accounts = await eth.request({ method: "eth_accounts" });
    const chainId = accounts?.length ? await eth.request({ method: "eth_chainId" }) : null;
    return { address: accounts?.[0] || null, chainId };
  } catch { return { address: null, chainId: null }; }
}
export async function evmBalance(address) {
  const eth = getEthereum();
  if (!eth || !address) return "0.0000";
  try { return formatEth(await eth.request({ method: "eth_getBalance", params: [address, "latest"] })); }
  catch { return "0.0000"; }
}
export async function evmSwitchChain(chainIdHex) {
  const eth = getEthereum();
  if (!eth) throw new Error("NO_PROVIDER");
  await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainIdHex }] });
}
export async function evmSign(address, message) {
  const eth = getEthereum();
  if (!eth) throw new Error("NO_PROVIDER");
  const hex = "0x" + toHex(new TextEncoder().encode(message));
  return eth.request({ method: "personal_sign", params: [hex, address] });
}
export async function evmSignTypedData(address, typedData) {
  const eth = getEthereum();
  if (!eth) throw new Error("NO_PROVIDER");
  return eth.request({ method: "eth_signTypedData_v4", params: [address, JSON.stringify(typedData)] });
}

/* ============================= Solana ============================= */
export function getSolana() {
  if (typeof window === "undefined") return null;
  return window.phantom?.solana || window.solflare || (window.solana?.isPhantom ? window.solana : window.solana) || null;
}
export async function solConnect(onlyIfTrusted = false) {
  const sol = getSolana();
  if (!sol) throw new Error("NO_PROVIDER");
  const res = await sol.connect(onlyIfTrusted ? { onlyIfTrusted: true } : undefined);
  const pk = res?.publicKey || sol.publicKey;
  return { address: pk?.toString?.() || String(pk) };
}
export async function solBalance(address) {
  if (!address) return "0.0000";
  try {
    const r = await fetch(SOL_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [address] }),
    });
    const j = await r.json();
    return ((j?.result?.value || 0) / 1e9).toFixed(4);
  } catch { return "0.0000"; }
}
export async function solSign(message) {
  const sol = getSolana();
  if (!sol) throw new Error("NO_PROVIDER");
  const enc = new TextEncoder().encode(message);
  const res = await sol.signMessage(enc, "utf8");
  const sig = res?.signature || res;
  return "0x" + toHex(sig instanceof Uint8Array ? sig : new Uint8Array(sig || []));
}
