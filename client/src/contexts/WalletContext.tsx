import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWallets } from '@massalabs/wallet-provider';

interface WalletContextType {
  provider: any | null;
  account: { address: string; name?: string } | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<any | null>(null);
  const [account, setAccount] = useState<{ address: string; name?: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const wallets = await getWallets();
      
      if (wallets.length === 0) {
        throw new Error('No wallet found. Please install MassaStation or Bearby wallet.');
      }

      const wallet = wallets[0];
      
      const connected = await wallet.connect();
      if (!connected) {
        throw new Error('Failed to connect to wallet');
      }

      const accounts = await wallet.accounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }

      const selectedAccount = accounts[0];

      setProvider(wallet);
      setAccount({ address: selectedAccount.address });
      localStorage.setItem('walletConnected', 'true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (provider && typeof provider.disconnect === 'function') {
      await provider.disconnect();
    }
    setProvider(null);
    setAccount(null);
    localStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true') {
      connectWallet();
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        provider,
        account,
        isConnecting,
        isConnected: !!account,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
