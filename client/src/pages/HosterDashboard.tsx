import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/StatsCard';
import { FileUpload } from '@/components/FileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  Plus,
  Pause,
  Play,
  StopCircle,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import type { AdCategory, PricingModel, AdStatus } from '@shared/schema';

const categories: AdCategory[] = ['Tech', 'AI', 'Crypto', 'Gaming', 'Finance', 'Education', 'Health', 'Entertainment'];

export default function HosterDashboard() {
  const { account } = useWallet();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as AdCategory | '',
    targetUrl: '',
    budget: '',
    pricingModel: 'cpc' as PricingModel,
    costPerClick: '',
    costPerImpression: '',
  });

  const [campaigns] = useState([
    {
      id: '1',
      title: 'Premium Crypto Trading Platform',
      status: 'active' as AdStatus,
      budget: 1000,
      spent: 450,
      impressions: 125000,
      clicks: 3500,
      category: 'Crypto' as AdCategory,
      pricingModel: 'cpc' as PricingModel,
      costPerClick: 0.15,
    },
    {
      id: '2',
      title: 'AI-Powered Analytics Tool',
      status: 'paused' as AdStatus,
      budget: 500,
      spent: 200,
      impressions: 85000,
      clicks: 1200,
      category: 'AI' as AdCategory,
      pricingModel: 'cpm' as PricingModel,
      costPerImpression: 0.002,
    },
  ]);

  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);

  const handleCreateCampaign = async () => {
    try {
      console.log('Creating campaign:', formData, selectedFile);
      
      toast({
        title: 'Campaign created successfully!',
        description: 'Your ad is now live on the network.',
      });
      
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        targetUrl: '',
        budget: '',
        pricingModel: 'cpc',
        costPerClick: '',
        costPerImpression: '',
      });
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: AdStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'paused': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'stopped': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-3xl mb-2">Hoster Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your advertising campaigns
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowCreateModal(true)}
              className="gap-2"
              data-testid="button-create-campaign"
            >
              <Plus className="h-5 w-5" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Spent"
            value={`${totalSpent.toFixed(2)}`}
            suffix="MAS"
            icon={DollarSign}
          />
          <StatsCard
            title="Total Impressions"
            value={totalImpressions.toLocaleString()}
            icon={Eye}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            icon={MousePointerClick}
            trend={{ value: 8.3, isPositive: true }}
          />
          <StatsCard
            title="Average CTR"
            value={((totalClicks / totalImpressions) * 100).toFixed(2)}
            suffix="%"
            icon={TrendingUp}
          />
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid gap-6">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card data-testid={`card-campaign-${campaign.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{campaign.title}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary">{campaign.category}</Badge>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline">
                              {campaign.pricingModel.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {campaign.status === 'active' ? (
                            <Button size="icon" variant="outline" data-testid={`button-pause-${campaign.id}`}>
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="icon" variant="outline" data-testid={`button-play-${campaign.id}`}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="icon" variant="outline" data-testid={`button-stop-${campaign.id}`}>
                            <StopCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" data-testid={`button-settings-${campaign.id}`}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Impressions</p>
                          <p className="text-2xl font-bold">{campaign.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Clicks</p>
                          <p className="text-2xl font-bold">{campaign.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">CTR</p>
                          <p className="text-2xl font-bold">
                            {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cost</p>
                          <p className="text-2xl font-bold">
                            {campaign.pricingModel === 'cpc' 
                              ? `${campaign.costPerClick} MAS/click`
                              : `${(campaign.costPerImpression! * 1000).toFixed(2)} MAS/1K`
                            }
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget Usage</span>
                          <span className="font-medium">
                            {campaign.spent.toFixed(2)} / {campaign.budget} MAS
                            ({((campaign.spent / campaign.budget) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Campaign Performance
                </CardTitle>
                <CardDescription>
                  Detailed analytics and insights for your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Analytics charts will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Create Ad Campaign</DialogTitle>
            <DialogDescription>
              Launch a new advertising campaign on the Massa network
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                placeholder="Enter campaign title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-campaign-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your ad campaign"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="textarea-campaign-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as AdCategory })}
              >
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FileUpload
              label="Ad Creative (Image or Video)"
              description="Upload your ad image or video"
              onFileSelect={setSelectedFile}
              currentFile={selectedFile || undefined}
              onRemove={() => setSelectedFile(null)}
            />

            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL *</Label>
              <Input
                id="targetUrl"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                data-testid="input-target-url"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (MAS) *</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  data-testid="input-budget"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricingModel">Pricing Model *</Label>
                <Select
                  value={formData.pricingModel}
                  onValueChange={(value) => setFormData({ ...formData, pricingModel: value as PricingModel })}
                >
                  <SelectTrigger data-testid="select-pricing-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpc">CPC (Cost Per Click)</SelectItem>
                    <SelectItem value="cpm">CPM (Cost Per 1000 Impressions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.pricingModel === 'cpc' ? (
              <div className="space-y-2">
                <Label htmlFor="costPerClick">Cost Per Click (MAS) *</Label>
                <Input
                  id="costPerClick"
                  type="number"
                  step="0.01"
                  placeholder="0.10"
                  value={formData.costPerClick}
                  onChange={(e) => setFormData({ ...formData, costPerClick: e.target.value })}
                  data-testid="input-cost-per-click"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="costPerImpression">Cost Per 1000 Impressions (MAS) *</Label>
                <Input
                  id="costPerImpression"
                  type="number"
                  step="0.001"
                  placeholder="2.00"
                  value={formData.costPerImpression}
                  onChange={(e) => setFormData({ ...formData, costPerImpression: e.target.value })}
                  data-testid="input-cost-per-impression"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} data-testid="button-submit-campaign">
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
