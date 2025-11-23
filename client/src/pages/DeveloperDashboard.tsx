import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatsCard } from '@/components/StatsCard';
import { AdCard } from '@/components/AdCard';
import { CodeSnippetGenerator } from '@/components/CodeSnippetGenerator';
import {
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  Search,
  Filter,
  Code,
  BarChart3,
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import type { AdCampaign, AdCategory } from '@shared/schema';

const categories: AdCategory[] = ['Tech', 'AI', 'Crypto', 'Gaming', 'Finance', 'Education', 'Health', 'Entertainment'];

export default function DeveloperDashboard() {
  const { account } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAd, setSelectedAd] = useState<AdCampaign | null>(null);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);

  const [availableAds] = useState<AdCampaign[]>([
    {
      id: '1',
      hosterId: 'host1',
      title: 'Premium Crypto Trading Platform',
      description: 'Trade cryptocurrencies with zero fees. Advanced charts, real-time data, and secure wallet integration.',
      imageUrl: '',
      videoUrl: null,
      htmlSnippet: null,
      category: 'Crypto',
      targetUrl: 'https://example.com',
      budget: 1000,
      spent: 450,
      costPerClick: 0.15,
      costPerImpression: null,
      pricingModel: 'cpc',
      status: 'active',
      impressions: 125000,
      clicks: 3500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      hosterId: 'host2',
      title: 'AI-Powered Analytics Tool',
      description: 'Transform your data into insights with our AI-powered analytics platform. Real-time dashboards and predictions.',
      imageUrl: '',
      videoUrl: null,
      htmlSnippet: null,
      category: 'AI',
      targetUrl: 'https://example.com',
      budget: 500,
      spent: 200,
      costPerClick: null,
      costPerImpression: 0.002,
      pricingModel: 'cpm',
      status: 'active',
      impressions: 85000,
      clicks: 1200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      hosterId: 'host3',
      title: 'Blockchain Gaming Platform',
      description: 'Play-to-earn gaming with true asset ownership. Join thousands of players earning crypto while gaming.',
      imageUrl: '',
      videoUrl: null,
      htmlSnippet: null,
      category: 'Gaming',
      targetUrl: 'https://example.com',
      budget: 750,
      spent: 320,
      costPerClick: 0.12,
      costPerImpression: null,
      pricingModel: 'cpc',
      status: 'active',
      impressions: 95000,
      clicks: 2100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [myEarnings] = useState([
    {
      adId: '1',
      adTitle: 'Premium Crypto Trading Platform',
      earned: 125.50,
      impressions: 45000,
      clicks: 1200,
    },
    {
      adId: '2',
      adTitle: 'AI-Powered Analytics Tool',
      earned: 78.30,
      impressions: 32000,
      clicks: 850,
    },
  ]);

  const totalEarned = myEarnings.reduce((sum, e) => sum + e.earned, 0);
  const totalImpressions = myEarnings.reduce((sum, e) => sum + e.impressions, 0);
  const totalClicks = myEarnings.reduce((sum, e) => sum + e.clicks, 0);

  const filteredAds = availableAds.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleIntegrate = (ad: AdCampaign) => {
    setSelectedAd(ad);
    setShowIntegrationModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-2">Developer Dashboard</h1>
            <p className="text-muted-foreground">
              Browse ads, integrate, and track your earnings
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Earned"
            value={totalEarned.toFixed(2)}
            suffix="MAS"
            icon={DollarSign}
            trend={{ value: 15.2, isPositive: true }}
          />
          <StatsCard
            title="Total Impressions"
            value={totalImpressions.toLocaleString()}
            icon={Eye}
          />
          <StatsCard
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            icon={MousePointerClick}
          />
          <StatsCard
            title="Average CTR"
            value={((totalClicks / totalImpressions) * 100).toFixed(2)}
            suffix="%"
            icon={TrendingUp}
          />
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList>
            <TabsTrigger value="marketplace">Ad Marketplace</TabsTrigger>
            <TabsTrigger value="my-ads">My Integrated Ads</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Ads</CardTitle>
                <CardDescription>
                  Browse and integrate high-paying ad campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-ads"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-filter-category">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAds.map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      onIntegrate={handleIntegrate}
                      showEarnings
                    />
                  ))}
                </div>

                {filteredAds.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No ads found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-ads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Integrated Ads</CardTitle>
                <CardDescription>
                  Ads you've integrated into your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEarnings.map((earning) => {
                    const ad = availableAds.find(a => a.id === earning.adId);
                    return ad ? (
                      <AdCard
                        key={ad.id}
                        ad={ad}
                        onViewDetails={(ad) => {
                          setSelectedAd(ad);
                          setShowIntegrationModal(true);
                        }}
                      />
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Earnings Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed earnings from each integrated ad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myEarnings.map((earning, index) => (
                    <motion.div
                      key={earning.adId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">{earning.adTitle}</h4>
                            <span className="text-2xl font-bold text-primary">
                              {earning.earned.toFixed(2)} MAS
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Impressions</p>
                              <p className="font-semibold">{earning.impressions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Clicks</p>
                              <p className="font-semibold">{earning.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">CTR</p>
                              <p className="font-semibold">
                                {((earning.clicks / earning.impressions) * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showIntegrationModal} onOpenChange={setShowIntegrationModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <Code className="h-6 w-6" />
              {selectedAd?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="font-semibold mb-2">Ad Details</h3>
                <p className="text-muted-foreground">{selectedAd.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{selectedAd.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pricing</p>
                  <p className="font-semibold">
                    {selectedAd.pricingModel === 'cpc' ? 'CPC' : 'CPM'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="font-semibold text-primary">
                    {selectedAd.pricingModel === 'cpc'
                      ? `${selectedAd.costPerClick} MAS/click`
                      : `${(selectedAd.costPerImpression! * 1000).toFixed(2)} MAS/1K`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold">{selectedAd.budget} MAS</p>
                </div>
              </div>

              <CodeSnippetGenerator adId={selectedAd.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
