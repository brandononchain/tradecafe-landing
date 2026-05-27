import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getEthereum, evmConnect, evmAccounts, evmBalance, evmSwitchChain, evmSign, evmSignTypedData,
  getSolana, solConnect, solBalance, solSign, networkFor,
} from "./lib/web3";

const WalletContext = createContext(null);
export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }) {
  const [ecosystem, setEcosystem] = useState(null); // 'evm' | 'solana'
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);     // evm only
  const [balance, setBalance] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const hasEvm = !!getEthereum();
  const hasSolana = !!getSolana();
  const hasProvider = hasEvm || hasSolana;
  const network = address ? networkFor(ecosystem, chainId) : null;
  const nativeSymbol = network?.native || (ecosystem === "solana" ? "SOL" : "ETH");

  const loadBalance = useCallback(async (eco, addr) => {
    if (!addr) return;
    setBalance(await (eco === "solana" ? solBalance(addr) : evmBalance(addr)));
  }, []);

  // Re-attach already-authorized wallets on load (EVM eth_accounts, Solana trusted).
  useEffect(() => {
    let alive = true;
    (async () => {
      const { address: ea, chainId: ec } = await evmAccounts();
      if (alive && ea) { setEcosystem("evm"); setAddress(ea); setChainId(ec); loadBalance("evm", ea); return; }
      if (getSolana()) {
        try {
          const { address: sa } = await solConnect(true);
          if (alive && sa) { setEcosystem("solana"); setAddress(sa); loadBalance("solana", sa); }
        } catch { /* not trusted */ }
      }
    })();
    return () => { alive = false; };
  }, [loadBalance]);

  // EVM account / chain change listeners
  useEffect(() => {
    const eth = getEthereum();
    if (!eth?.on) return;
    const onAccounts = (accs) => {
      if (ecosystem !== "evm") return;
      const a = accs?.[0] || null;
      setAddress(a);
      a ? loadBalance("evm", a) : setBalance(null);
    };
    const onChain = (c) => { if (ecosystem === "evm") { setChainId(c); if (address) loadBalance("evm", address); } };
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    return () => { eth.removeListener?.("accountsChanged", onAccounts); eth.removeListener?.("chainChanged", onChain); };
  }, [ecosystem, address, loadBalance]);

  const connect = useCallback(async (eco) => {
    setError(null);
    if (eco === "solana" ? !getSolana() : !getEthereum()) { setError("NO_PROVIDER"); return; }
    setConnecting(true);
    try {
      if (eco === "solana") {
        const { address: a } = await solConnect();
        setEcosystem("solana"); setAddress(a); setChainId(null);
        await loadBalance("solana", a);
      } else {
        const { address: a, chainId: c } = await evmConnect();
        setEcosystem("evm"); setAddress(a); setChainId(c);
        await loadBalance("evm", a);
      }
    } catch (e) {
      setError(e?.code === 4001 ? "REJECTED" : "FAILED");
    } finally {
      setConnecting(false);
    }
  }, [loadBalance]);

  const disconnect = useCallback(() => {
    if (ecosystem === "solana") { try { getSolana()?.disconnect?.(); } catch { /* ignore */ } }
    setEcosystem(null); setAddress(null); setChainId(null); setBalance(null); setError(null);
  }, [ecosystem]);

  const changeChain = useCallback(async (idHex) => {
    if (ecosystem !== "evm") return;
    try { await evmSwitchChain(idHex); setChainId(idHex); if (address) loadBalance("evm", address); }
    catch { setError("CHAIN"); }
  }, [ecosystem, address, loadBalance]);

  const signMessage = useCallback(async (msg) => {
    if (!address) throw new Error("NOT_CONNECTED");
    return ecosystem === "solana" ? solSign(msg) : evmSign(address, msg);
  }, [ecosystem, address]);

  const signTypedData = useCallback(async (typed) => {
    if (!address) throw new Error("NOT_CONNECTED");
    if (ecosystem !== "evm") throw new Error("EVM_ONLY");
    return evmSignTypedData(address, typed);
  }, [ecosystem, address]);

  return (
    <WalletContext.Provider value={{
      ecosystem, address, chainId, balance, network, nativeSymbol,
      connecting, error, hasEvm, hasSolana, hasProvider,
      connect, disconnect, changeChain, signMessage, signTypedData,
    }}>
      {children}
    </WalletContext.Provider>
  );
}
