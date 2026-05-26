// Dependency-free Web3 wallet access via the injected EIP-1193 provider
// (MetaMask / Rabby / Coinbase extension, etc.). Used to connect a wallet
// for on-chain perpetuals trading from the Terminal.

export const PERP_CHAINS = [
  { id: "0xa4b1", dec: 42161, name: "Arbitrum One", short: "Arbitrum", native: "ETH" },
  { id: "0x2105", dec: 8453, name: "Base", short: "Base", native: "ETH" },
  { id: "0xa", dec: 10, name: "Optimism", short: "Optimism", native: "ETH" },
  { id: "0x1", dec: 1, name: "Ethereum", short: "Ethereum", native: "ETH" },
];

export const CHAIN_BY_ID = PERP_CHAINS.reduce((a, c) => ({ ...a, [c.id.toLowerCase()]: c }), {});

export const WALLETS = [
  { id: "metamask", label: "MetaMask", flag: "isMetaMask" },
  { id: "rabby", label: "Rabby", flag: "isRabby" },
  { id: "coinbase", label: "Coinbase Wallet", flag: "isCoinbaseWallet" },
  { id: "injected", label: "Browser Wallet", flag: null },
];

export function getEthereum() {
  return typeof window !== "undefined" ? window.ethereum : null;
}

export function chainName(chainId) {
  if (!chainId) return "Unknown";
  return CHAIN_BY_ID[String(chainId).toLowerCase()]?.name || `Chain ${parseInt(chainId, 16) || chainId}`;
}

export function shortAddr(a) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

export function formatEth(weiHex) {
  try {
    const wei = BigInt(weiHex);
    const whole = wei / 1000000000000000000n;
    const frac = (wei % 1000000000000000000n).toString().padStart(18, "0").slice(0, 4);
    return `${whole}.${frac}`;
  } catch {
    return "0.0000";
  }
}

export async function requestAccounts() {
  const eth = getEthereum();
  if (!eth) throw new Error("NO_PROVIDER");
  const accounts = await eth.request({ method: "eth_requestAccounts" });
  const chainId = await eth.request({ method: "eth_chainId" });
  return { address: accounts?.[0] || null, chainId };
}

export async function getAccounts() {
  const eth = getEthereum();
  if (!eth) return { address: null, chainId: null };
  try {
    const accounts = await eth.request({ method: "eth_accounts" });
    const chainId = accounts?.length ? await eth.request({ method: "eth_chainId" }) : null;
    return { address: accounts?.[0] || null, chainId };
  } catch {
    return { address: null, chainId: null };
  }
}

export async function getBalance(address) {
  const eth = getEthereum();
  if (!eth || !address) return "0.0000";
  try {
    const wei = await eth.request({ method: "eth_getBalance", params: [address, "latest"] });
    return formatEth(wei);
  } catch {
    return "0.0000";
  }
}

export async function switchChain(chainIdHex) {
  const eth = getEthereum();
  if (!eth) throw new Error("NO_PROVIDER");
  await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainIdHex }] });
}
