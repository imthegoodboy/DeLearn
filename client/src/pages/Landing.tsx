import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Wallet,
  Zap,
  Shield,
  TrendingUp,
  Code,
  DollarSign,
  Users,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { WalletConnectionModal } from '@/components/WalletConnectionModal';

export default function Landing() {
  const { isConnected } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'Decentralized & Transparent',
      description: 'All transactions on-chain with smart contracts. No intermediaries, no hidden fees.',
    },
    {
      icon: Zap,
      title: 'Autonomous Payments',
      description: 'Automatic daily payouts via smart contracts. Earnings distributed transparently.',
    },
    {
      icon: Code,
      title: 'Easy Integration',
      description: 'Copy-paste code snippets for React, Vue, Next.js, PHP, Python, and more.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Track impressions, clicks, and earnings in real-time. All data on-chain.',
    },
  ];

  const stats = [
    { label: 'Active Campaigns', value: '1,234', icon: Sparkles },
    { label: 'Publishers', value: '5,678', icon: Users },
    { label: 'Total Impressions', value: '2.5M', icon: Eye },
    { label: 'Total Earned', value: '125K MAS', icon: DollarSign },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Connect Wallet',
      description: 'Link your Massa wallet (MassaStation or Bearby) to get started.',
      forHoster: 'Deposit funds to your campaign escrow.',
      forDeveloper: 'Receive automatic payouts to your wallet.',
    },
    {
      step: '2',
      title: 'Create or Browse',
      description: 'Choose your role on the platform.',
      forHoster: 'Create ad campaigns with budget, targeting, and creative assets.',
      forDeveloper: 'Browse available ads and select high-paying campaigns.',
    },
    {
      step: '3',
      title: 'Launch or Integrate',
      description: 'Start earning or get your message out.',
      forHoster: 'Your ads go live instantly across the network.',
      forDeveloper: 'Copy code snippet and integrate into your website.',
    },
  ];

  return (
    <>
      <div className="min-h-screen">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl mb-6">
                Decentralized Advertising
                <br />
                <span className="text-primary">On Massa Blockchain</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Connect advertisers with publishers through transparent, on-chain advertising.
                Autonomous payments, fraud-free delivery, and real-time analytics.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isConnected ? (
                  <>
                    <Link href="/onboarding?role=hoster">
                      <Button size="lg" className="text-lg px-8 py-6 gap-2 bg-gradient-to-r from-primary to-primary/80" data-testid="button-hoster">
                        I'm a Hoster
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/onboarding?role=developer">
                      <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-2" data-testid="button-developer">
                        I'm a Developer
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => setShowWalletModal(true)}
                    className="text-lg px-8 py-6 gap-2 bg-gradient-to-r from-primary to-primary/80"
                    data-testid="button-get-started"
                  >
                    <Wallet className="h-5 w-5" />
                    Connect Wallet to Get Started
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="hover-elevate transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in three simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate transition-all duration-200">
                    <CardContent className="p-8">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <span className="text-3xl font-display font-bold text-primary">
                          {item.step}
                        </span>
                      </div>
                      <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">For Hosters:</p>
                          <p className="text-sm text-muted-foreground">{item.forHoster}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary mb-1">For Developers:</p>
                          <p className="text-sm text-muted-foreground">{item.forDeveloper}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
                Why Massa DeAds?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built on Massa's high-performance blockchain
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary/10 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join the decentralized advertising revolution on Massa blockchain
              </p>
              {!isConnected && (
                <Button
                  size="lg"
                  onClick={() => setShowWalletModal(true)}
                  className="text-lg px-8 py-6 gap-2 bg-gradient-to-r from-primary to-primary/80"
                >
                  <Wallet className="h-5 w-5" />
                  Connect Wallet Now
                </Button>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      <WalletConnectionModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
}
