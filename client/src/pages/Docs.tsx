import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const sections = [
  {
    title: 'Product Overview',
    description:
      'Massa DeAds is the fully autonomous ad network described in the project brief: advertisers upload creatives, developers integrate a DeWeb snippet, and the smart contract manages auctions, fraud checks, and payouts.',
    bullets: [
      'Supports CPC and CPM bids',
      'Funds locked in escrow and deducted on-chain',
      'Publishers receive daily automatic payouts',
    ],
  },
  {
    title: 'Advertiser Flow',
    description:
      'Create a campaign with title, creative URI, targeting, and market rates. The contract picks the best publisher per request and reports impressions/clicks for analytics.',
    bullets: [
      'Upload image/video/HTML assets (Creative URI field)',
      'Set CPC or CPM bids and category targeting',
      'Pause or stop campaigns instantly with refunds of unused budget',
    ],
  },
  {
    title: 'Developer Flow',
    description:
      'Publishers register once, grab the integration snippet, and start earning automatically. The UI lets them preview ads, copy code, and monitor reputation/fraud alerts.',
    bullets: [
      'Integration snippets for vanilla JS, React, Vue, Python widgets, etc.',
      'Proof-of-click guard checks wallet, timestamp, IP hash, and duplicate clicks',
      'Daily payout automation mirrored in the Innovation Hub',
    ],
  },
];

const extraFeatures = [
  {
    title: 'Proof-of-Click Guardian',
    detail:
      'Implements the anti-fraud rules from the specification: unique wallet, timestamp spacing, hashed IP, and automatic banning after repeated spam.',
  },
  {
    title: 'Ad NFT Marketplace',
    detail:
      'Every campaign can be wrapped as an NFT representing budget + targeting. That NFT is tradable, unlocking the “Ad Marketplace” stretch goal.',
  },
  {
    title: 'Docs-first DX',
    detail:
      'This page summarizes the entire narrative for hackathon judges, with quick links to dashboards, the innovation hub, and deployment steps.',
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-4">
          <Badge>Documentation</Badge>
          <h1 className="font-display text-4xl font-bold">Massa DeAds Playbook</h1>
          <p className="text-muted-foreground">
            Everything judges need to know—directly mapped from the <em>projecct</em> blueprint.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/hoster/dashboard">Advertiser Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/developer/dashboard">Developer Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/innovation">Innovation Hub</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <div className="grid gap-6 md:grid-cols-3">
          {extraFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Cheatsheet</CardTitle>
            <CardDescription>
              Reference <code>DEPLOYMENT.md</code> after the hackathon to deploy the contract + DeWeb frontend.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Smart Contract</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Install deps: <code>cd contract && npm install</code></li>
                <li>Build: <code>npm run build</code></li>
                <li>Deploy: <code>npm run deploy</code> (needs .env keys)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Update <code>client/.env</code> with the deployed contract</li>
                <li>Run locally: <code>npm run dev</code></li>
                <li>Build for DeWeb: <code>npm run build</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

