import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdCard } from '@/components/AdCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CodeSnippetGenerator } from '@/components/CodeSnippetGenerator';
import { Search, Filter, Code } from 'lucide-react';
import type { AdCampaign, AdCategory } from '@shared/schema';

const categories: AdCategory[] = ['Tech', 'AI', 'Crypto', 'Gaming', 'Finance', 'Education', 'Health', 'Entertainment'];

export default function Marketplace() {
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
    {
      id: '4',
      hosterId: 'host4',
      title: 'DeFi Yield Optimizer',
      description: 'Maximize your DeFi yields with automated strategies. Stake, farm, and earn with optimal returns.',
      imageUrl: '',
      videoUrl: null,
      htmlSnippet: null,
      category: 'Finance',
      targetUrl: 'https://example.com',
      budget: 600,
      spent: 180,
      costPerClick: 0.18,
      costPerImpression: null,
      pricingModel: 'cpc',
      status: 'active',
      impressions: 68000,
      clicks: 1500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

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
    <>
      <div className="min-h-screen bg-background">
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">
                Ad Marketplace
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse available ad campaigns and integrate them into your website
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Available Campaigns</CardTitle>
              <CardDescription>
                Find the perfect ads for your audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-marketplace"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-filter-marketplace">
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
        </div>
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
    </>
  );
}
