// Unified cross-chain perp order router. One entry point — placeOrder() —
// builds and signs the right payload for whatever wallet/chain is connected:
//   • EVM   → EIP-712 typed order (eth_signTypedData_v4)
//   • Solana → canonical signed order intent (signMessage)
// so the Terminal calls a single function regardless of venue.

// Representative perp venue per network (label + EIP-712 verifying contract
// for EVM, program id for Solana). Swap for real venue config when wiring.
const VENUES = {
  Arbitrum: { name: "GMX v2", contract: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB" },
  Base: { name: "Avantis", contract: "0x8a311D7048c35985aa31C131B9A13e03a5f7422d" },
  Optimism: { name: "Synthetix Perps", contract: "0x6C5b1a8B4b1b1B1b1B1b1B1b1B1b1B1b1B1b1B1b" },
  Ethereum: { name: "Hyperliquid", contract: "0x0000000000000000000000000000000000000000" },
  Solana: { name: "Drift", program: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcrYwcc" },
};
const FALLBACK = { name: "TradeCafe Perps", contract: "0x0000000000000000000000000000000000000000" };

export function venueFor(network) {
  if (!network) return FALLBACK;
  return VENUES[network.short] || FALLBACK;
}

function buildEvmTypedData({ trader, market, isLong, leverage, sizeUsd }, network, venue) {
  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Order: [
        { name: "trader", type: "address" },
        { name: "market", type: "string" },
        { name: "isLong", type: "bool" },
        { name: "leverage", type: "uint256" },
        { name: "sizeUsd", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "expiry", type: "uint256" },
      ],
    },
    primaryType: "Order",
    domain: { name: "TradeCafe Perps", version: "1", chainId: network?.dec || 1, verifyingContract: venue.contract },
    message: {
      trader,
      market,
      isLong,
      leverage: String(leverage),
      sizeUsd: String(Math.round(sizeUsd || 0)),
      nonce: String(Date.now()),
      expiry: String(Math.floor(Date.now() / 1000) + 300),
    },
  };
}

function buildSolanaIntent({ trader, market, isLong, leverage, sizeUsd }, venue) {
  return {
    protocol: venue.name,
    program: venue.program,
    trader,
    market,
    side: isLong ? "long" : "short",
    leverage,
    sizeUsd: Math.round(sizeUsd || 0),
    nonce: Date.now(),
    expiry: Math.floor(Date.now() / 1000) + 300,
  };
}

/**
 * placeOrder(wallet, params) — wallet is the useWallet() context.
 * params: { symbol, side: 'buy'|'sell', leverage, sizeUsd }
 * returns { ok, venue, kind, signature } | { ok:false, error }
 */
export async function placeOrder(wallet, params) {
  const { ecosystem, address, network, signMessage, signTypedData } = wallet || {};
  if (!address) return { ok: false, error: "NOT_CONNECTED" };
  const venue = venueFor(network);
  const order = {
    trader: address,
    market: params.symbol,
    isLong: params.side === "buy",
    leverage: params.leverage,
    sizeUsd: params.sizeUsd,
  };
  try {
    if (ecosystem === "solana") {
      const intent = buildSolanaIntent(order, venue);
      const signature = await signMessage(JSON.stringify(intent));
      return { ok: true, venue: venue.name, kind: "solana-intent", signature };
    }
    const typed = buildEvmTypedData(order, network, venue);
    const signature = await signTypedData(typed);
    return { ok: true, venue: venue.name, kind: "eip712", signature };
  } catch (e) {
    return { ok: false, error: e?.code === 4001 ? "REJECTED" : "FAILED" };
  }
}
