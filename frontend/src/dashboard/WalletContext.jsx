import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getEthereum, getAccounts, requestAccounts, getBalance, switchChain } from "./lib/web3";

const WalletContext = createContext(null);
export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const hasProvider = !!getEthereum();

  const refreshBalance = useCallback(async (addr) => {
    if (!addr) return;
    setBalance(await getBalance(addr));
  }, []);

  // Pick up an already-authorized wallet on load.
  useEffect(() => {
    let alive = true;
    getAccounts().then(({ address: a, chainId: c }) => {
      if (!alive || !a) return;
      setAddress(a);
      setChainId(c);
      refreshBalance(a);
    });
    return () => { alive = false; };
  }, [refreshBalance]);

  // React to wallet account/chain changes.
  useEffect(() => {
    const eth = getEthereum();
    if (!eth?.on) return;
    const onAccounts = (accs) => {
      const a = accs?.[0] || null;
      setAddress(a);
      if (a) refreshBalance(a); else setBalance(null);
    };
    const onChain = (c) => { setChainId(c); if (address) refreshBalance(address); };
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, [address, refreshBalance]);

  const connect = useCallback(async () => {
    setError(null);
    if (!getEthereum()) { setError("NO_PROVIDER"); return; }
    setConnecting(true);
    try {
      const { address: a, chainId: c } = await requestAccounts();
      setAddress(a);
      setChainId(c);
      await refreshBalance(a);
    } catch (e) {
      setError(e?.code === 4001 ? "REJECTED" : "FAILED");
    } finally {
      setConnecting(false);
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setError(null);
  }, []);

  const changeChain = useCallback(async (idHex) => {
    try {
      await switchChain(idHex);
      setChainId(idHex);
      if (address) refreshBalance(address);
    } catch (e) {
      setError("CHAIN");
    }
  }, [address, refreshBalance]);

  return (
    <WalletContext.Provider value={{ address, chainId, balance, connecting, error, hasProvider, connect, disconnect, changeChain, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
}
