import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertUserSchema, insertAdCampaignSchema, insertAdInteractionSchema } from "@shared/schema";
import cors from "cors";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors());

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByWalletAddress(userData.walletAddress);
      if (existingUser) {
        return res.status(400).json({ error: "User with this wallet address already exists" });
      }

      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const user = await storage.getUserByWalletAddress(req.params.address);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/campaigns", upload.single('adFile'), async (req, res) => {
    try {
      const campaignData = {
        ...req.body,
        budget: parseFloat(req.body.budget),
        costPerClick: req.body.costPerClick ? parseFloat(req.body.costPerClick) : null,
        costPerImpression: req.body.costPerImpression ? parseFloat(req.body.costPerImpression) : null,
      };

      if (req.file) {
        const fileUrl = `/uploads/${req.file.filename}`;
        if (req.file.mimetype.startsWith('image/')) {
          campaignData.imageUrl = fileUrl;
        } else if (req.file.mimetype.startsWith('video/')) {
          campaignData.videoUrl = fileUrl;
        }
      }

      const validatedData = insertAdCampaignSchema.parse(campaignData);
      const campaign = await storage.createAdCampaign(validatedData);
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllActiveAdCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/campaigns/hoster/:hosterId", async (req, res) => {
    try {
      const campaigns = await storage.getAdCampaignsByHosterId(req.params.hosterId);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getAdCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const updates = req.body;
      const campaign = await storage.updateAdCampaign(req.params.id, updates);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAdCampaign(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/earnings/developer/:developerId", async (req, res) => {
    try {
      const earnings = await storage.getDeveloperEarningsByDeveloperId(req.params.developerId);
      res.json(earnings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/interactions", async (req, res) => {
    try {
      const interactionData = insertAdInteractionSchema.parse(req.body);
      const interaction = await storage.createAdInteraction(interactionData);

      const campaign = await storage.getAdCampaign(interactionData.adCampaignId);
      if (campaign) {
        const updates: any = {};
        if (interactionData.interactionType === 'impression') {
          updates.impressions = campaign.impressions + 1;
          if (campaign.pricingModel === 'cpm' && campaign.costPerImpression) {
            updates.spent = campaign.spent + campaign.costPerImpression;
          }
        } else if (interactionData.interactionType === 'click') {
          updates.clicks = campaign.clicks + 1;
          if (campaign.pricingModel === 'cpc' && campaign.costPerClick) {
            updates.spent = campaign.spent + campaign.costPerClick;
          }
        }
        await storage.updateAdCampaign(interactionData.adCampaignId, updates);

        if (interactionData.developerId) {
          let earning = await storage.getDeveloperEarning(
            interactionData.developerId,
            interactionData.adCampaignId
          );

          if (!earning) {
            earning = await storage.createDeveloperEarning({
              developerId: interactionData.developerId,
              adCampaignId: interactionData.adCampaignId,
            });
          }

          const earningUpdates: any = {};
          if (interactionData.interactionType === 'impression') {
            earningUpdates.impressions = earning.impressions + 1;
            if (campaign.pricingModel === 'cpm' && campaign.costPerImpression) {
              earningUpdates.totalEarned = earning.totalEarned + campaign.costPerImpression;
            }
          } else if (interactionData.interactionType === 'click') {
            earningUpdates.clicks = earning.clicks + 1;
            if (campaign.pricingModel === 'cpc' && campaign.costPerClick) {
              earningUpdates.totalEarned = earning.totalEarned + campaign.costPerClick;
            }
          }
          await storage.updateDeveloperEarning(earning.id, earningUpdates);
        }
      }

      res.json(interaction);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
