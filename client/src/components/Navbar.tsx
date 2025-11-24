import { Link, useLocation } from 'wouter';
import { Wallet, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useWallet } from '@/contexts/WalletContext';
import { WalletConnectionModal } from './WalletConnectionModal';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [location] = useLocation();
  const { account, isConnected, disconnectWallet } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/docs', label: 'Docs' },
    { href: '/innovation', label: 'Innovation' },
  ];

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/">
                <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-3 py-2 -ml-3 cursor-pointer" data-testid="link-home">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-display font-bold text-lg">M</span>
                  </div>
                  <span className="font-display font-bold text-xl">Massa DeAds</span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`px-4 py-2 rounded-lg font-medium transition-colors hover-elevate active-elevate-2 cursor-pointer ${
                        location === link.href
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                      data-testid={`link-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {isConnected ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-mono text-sm">
                    {truncateAddress(account!.address)}
                  </div>
                  <Button
                    variant="outline"
                    onClick={disconnectWallet}
                    data-testid="button-disconnect-wallet"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowWalletModal(true)}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
                  data-testid="button-connect-wallet"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`block px-4 py-2 rounded-lg hover-elevate active-elevate-2 cursor-pointer ${
                        location === link.href
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </div>
                  </Link>
                ))}
                
                {isConnected ? (
                  <>
                    <div className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-mono text-sm">
                      {truncateAddress(account!.address)}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={disconnectWallet}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setShowWalletModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <WalletConnectionModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
}
