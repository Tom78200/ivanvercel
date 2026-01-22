import type { Express } from "express";
import dotenv from "dotenv";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertArtworkSchema, insertExhibitionSchema, insertContactMessageSchema } from "../shared/schema.js";
import multer from "multer";
import path from "path";
import type { Request, Response, NextFunction } from "express";
import type { FileFilterCallback } from "multer";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE || !process.env.SUPABASE_BUCKET) {
  throw new Error("Supabase configuration missing. Please set SUPABASE_URL, SUPABASE_SERVICE_ROLE, and SUPABASE_BUCKET.");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
const featuredTable = (process.env.SUPABASE_FEATURED_TABLE || "featured_works");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Seules les images sont autorisées"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

async function uploadBufferToSupabase(originalName: string, mimeType: string, buffer: Buffer): Promise<string> {
  const bucket = process.env.SUPABASE_BUCKET as string;
  const ext = path.extname(originalName) || '.jpg';
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const storagePath = `images/${uniqueName}`;
  const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, { contentType: mimeType, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

// Middleware de protection admin (Ivan uniquement)
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = req.session as any;
  if (session?.isAdmin && session?.adminUser?.username === 'ivan') {
    return next();
  }
  res.status(401).json({ error: "Accès non autorisé" });
}

function extractSupabasePathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.slice(idx + marker.length);
  } catch {
    return null;
  }
}

async function deleteSupabasePublicFile(publicUrl: string): Promise<void> {
  const bucket = process.env.SUPABASE_BUCKET as string;
  const pathInBucket = extractSupabasePathFromPublicUrl(publicUrl, bucket);
  if (!pathInBucket) return;
  await supabase.storage.from(bucket).remove([pathInBucket]);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed admin en base si absent
  async function ensureAdminUser() {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1);
      if (error) return;
      if (Array.isArray(data) && data.length > 0) return; // déjà présent
      const rawPass = process.env.ADMIN_PASSWORD;
      const username = process.env.ADMIN_USERNAME || 'ivan';
      if (!rawPass) return; // rien à seeder si pas de mdp fourni
      const hash = await bcrypt.hash(String(rawPass), 10);
      await supabase.from('users').insert({ username, password: hash });
      console.log(`[AUTH] Admin seed créé pour l'utilisateur '${username}'`);
    } catch (e) {
      console.error("[AUTH] Erreur seed admin:", e);
    }
  }

  await ensureAdminUser();
  console.log('[BOOT] Mode 100% Supabase activé');

  // Get all artworks
  app.get("/api/artworks", async (req, res) => {
    try {
      res.setHeader("Cache-Control", "no-store");
      const artworks = await storage.getArtworks();
      res.json(artworks);
    } catch (error) {
      console.error('[ARTWORKS] Error:', error);
      res.status(500).json({ error: "Failed to fetch artworks" });
    }
  });

  // Récupérer les slots
  app.get("/api/artworks/slots", requireAdmin, async (req, res) => {
    const slots = await storage.getSlots();
    res.json(slots);
  });

  // Diagnostic de stockage (admin)
  app.get("/api/storage/diagnostics", requireAdmin, async (_req, res) => {
    try {
      const diagnostics = {
        supabaseConfigured: true,
        hasSupabaseEnv: {
          SUPABASE_URL: !!process.env.SUPABASE_URL,
          SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE,
          SUPABASE_BUCKET: !!process.env.SUPABASE_BUCKET,
        },
        bucket: process.env.SUPABASE_BUCKET || null,
        featuredTable,
        uploadStrategy: "supabase",
      };
      res.json(diagnostics);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Diagnostics failed" });
    }
  });

  // Sauvegarder les slots
  app.put("/api/artworks/slots", requireAdmin, async (req, res) => {
    const slots = req.body;
    if (!Array.isArray(slots) || slots.length !== 3) {
      return res.status(400).json({ error: "Format de slots invalide" });
    }
    await storage.setSlots(slots);
    res.json({ success: true });
  });

  // Get single artwork
  app.get("/api/artworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artwork = await storage.getArtwork(id);
      if (!artwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }
      res.json(artwork);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artwork" });
    }
  });

  // Create artwork
  app.post("/api/artworks", async (req, res) => {
    try {
      const mappedData = {
        title: req.body.title,
        image_url: req.body.imageUrl,
        dimensions: req.body.dimensions,
        technique: req.body.technique,
        year: req.body.year,
        description: req.body.description,
        category: req.body.category,
        is_visible: req.body.isVisible,
        show_in_slider: req.body.showInSlider,
        order: req.body.order
      };
      const validatedData = insertArtworkSchema.parse(mappedData);
      const artwork = await storage.createArtwork(validatedData);
      console.log('[CREATE] Artwork créé:', artwork.id);
      return res.status(201).json(artwork);
    } catch (error) {
      console.error('Erreur création artwork:', error);
      res.status(400).json({ error: "Invalid artwork data" });
    }
  });

  // Add additional images to artwork
  app.post("/api/artworks/:id/additional-images", requireAdmin, upload.array('images', 3), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No images provided" });
      }

      if (files.length > 3) {
        return res.status(400).json({ error: "Maximum 3 additional images allowed" });
      }

      const existingArtwork = await storage.getArtwork(id);
      if (!existingArtwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }

      // Upload des nouvelles images
      const newImageUrls: string[] = [];
      for (const file of files) {
        try {
          const processedBuffer = await sharp(file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();

          const imageUrl = await uploadBufferToSupabase(file.originalname, file.mimetype, processedBuffer);
          newImageUrls.push(imageUrl);
        } catch (e) {
          console.error('Erreur upload image supplémentaire:', e);
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }

      // Mettre à jour l'œuvre avec les nouvelles images
      // Note: storage.createArtwork handles creation, but we need update.
      // DatabaseStorage doesn't have updateArtwork exposed in interface?
      // Let's check interface. It has updateFeaturedWork, updateExhibitionGallery.
      // It seems I missed `updateArtwork` in IStorage?
      // Checking storage.ts...
      // IStorage has: deleteArtwork, reorderArtworks. No updateArtwork.
      // But I can use Drizzle directly here or add it to storage.
      // Since I'm in routes.ts and I have supabase client, I can use supabase client or I should add it to storage.
      // Adding to storage is cleaner but I already wrote storage.ts.
      // I'll use supabase client here for now to avoid rewriting storage.ts again, or I can use `db` if I exported it.
      // I'll use `supabase` client as it's already initialized.

      const currentAdditionalImages = (existingArtwork.additionalImages as string[]) || [];
      const updatedAdditionalImages = [...currentAdditionalImages, ...newImageUrls];

      const { error: updateError } = await supabase
        .from('artworks')
        .update({ additional_images: updatedAdditionalImages })
        .eq('id', id);

      if (updateError) {
        console.error('Erreur mise à jour artwork:', updateError);
        return res.status(500).json({ error: "Failed to update artwork" });
      }

      res.json({
        success: true,
        additionalImages: updatedAdditionalImages,
        newImages: newImageUrls
      });

    } catch (error) {
      console.error('Erreur ajout images supplémentaires:', error);
      res.status(500).json({ error: "Failed to add additional images" });
    }
  });

  // Get all exhibitions
  app.get("/api/exhibitions", async (req, res) => {
    try {
      res.setHeader("Cache-Control", "no-store");
      const exhibitions = await storage.getExhibitions();
      res.json(exhibitions);
    } catch (error) {
      console.error('[EXHIBITIONS] Error:', error);
      res.status(500).json({ error: "Failed to fetch exhibitions" });
    }
  });

  // Réordonner les expositions
  app.put("/api/exhibitions/order", requireAdmin, async (req, res) => {
    try {
      const newOrder = req.body;
      if (!Array.isArray(newOrder)) {
        return res.status(400).json({ error: "Format invalide" });
      }
      await storage.reorderExhibitions(newOrder);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du réordonnancement des expositions" });
    }
  });

  // Get single exhibition
  app.get("/api/exhibitions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exhibition = await storage.getExhibition(id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }
      res.json(exhibition);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exhibition" });
    }
  });

  // Create exhibition
  app.post("/api/exhibitions", requireAdmin, async (req, res) => {
    try {
      const mappedData = {
        ...req.body,
        image_url: req.body.imageUrl,
      };
      const validatedData = insertExhibitionSchema.parse(mappedData);
      const exhibition = await storage.createExhibition(validatedData);
      console.log("[CREATE] Exposition créée:", exhibition.id);
      res.status(201).json(exhibition);
    } catch (error) {
      console.error('[CREATE] Erreur création exposition:', error);
      res.status(400).json({ error: "Invalid exhibition data" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      try {
        const hasSmtp = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
        if (hasSmtp) {
          const nodemailer = await import('nodemailer');
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
            secure: process.env.SMTP_SECURE === '1' || process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER as string, pass: process.env.SMTP_PASS as string },
          });
          await transporter.sendMail({
            from: `Site Ivan Gauthier <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: process.env.SMTP_TO || 'ivangauthier009@gmail.com',
            subject: `Nouveau message de contact: ${validatedData.name}`,
            replyTo: validatedData.email,
            text: `Nom: ${validatedData.name}\nEmail: ${validatedData.email}\n\nMessage:\n${validatedData.message}`,
          });
        }
      } catch (e) {
        console.warn('[CONTACT] Email non envoyé:', (e as any)?.message || e);
      }
      res.status(201).json({ success: true, id: message.id });
    } catch (error) {
      res.status(400).json({ error: "Invalid contact form data" });
    }
  });

  // Delete artwork
  app.delete("/api/artworks/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getArtwork(id);

      if (!existing) {
        return res.status(404).json({ error: "Artwork not found" });
      }

      // Supprimer l'image si elle est sur Supabase
      if (existing.imageUrl && existing.imageUrl.startsWith("http")) {
        try {
          await deleteSupabasePublicFile(existing.imageUrl);
        } catch (e) {
          console.warn('Erreur suppression image Supabase:', e);
        }
      }

      await storage.deleteArtwork(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete artwork" });
    }
  });

  // Upload image
  app.post("/api/upload", requireAdmin, upload.single("image"), async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    try {
      let processed: Buffer;
      if (ext === "jpg" || ext === "jpeg") {
        processed = await sharp(file.buffer).jpeg({ quality: 80 }).toBuffer();
      } else if (ext === "png") {
        processed = await sharp(file.buffer).png({ quality: 80, compressionLevel: 8 }).toBuffer();
      } else {
        processed = file.buffer;
      }
      const publicUrl = await uploadBufferToSupabase(file.originalname, file.mimetype, processed);
      return res.json({ imageUrl: publicUrl });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || "Échec de l'upload" });
    }
  });

  // Mettre à jour la galerie d'une exposition
  app.put("/api/exhibitions/:id/gallery", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const galleryImages = req.body;
      if (!Array.isArray(galleryImages)) {
        return res.status(400).json({ error: "Format de galerie invalide" });
      }

      const existing = await storage.getExhibition(id);
      if (!existing) {
        return res.status(404).json({ error: "Exposition non trouvée" });
      }

      // Déterminer les URLs supprimées (pour nettoyer le bucket)
      const previousUrls = new Set((existing.galleryImages || []).map((g: any) => g.url).filter(Boolean));
      const nextUrls = new Set(galleryImages.map((g: any) => g.url).filter(Boolean));
      const removed: string[] = [];
      previousUrls.forEach((url: string) => { if (!nextUrls.has(url)) removed.push(url); });

      for (const url of removed) {
        try {
          if (typeof url === 'string' && url.startsWith("http")) {
            await deleteSupabasePublicFile(url);
          }
        } catch (e) {
          console.warn("[GALLERY_DELETE] Échec suppression fichier:", url, (e as any)?.message || e);
        }
      }

      const updated = await storage.updateExhibitionGallery(id, galleryImages);
      return res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la galerie" });
    }
  });

  // Supprimer une exposition
  app.delete("/api/exhibitions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getExhibition(id);

      if (existing) {
        // Nettoyer les fichiers du bucket
        try {
          if (existing.imageUrl && existing.imageUrl.startsWith('http')) {
            await deleteSupabasePublicFile(existing.imageUrl);
          }
          if (Array.isArray(existing.galleryImages)) {
            for (const gi of existing.galleryImages) {
              if (gi?.url && gi.url.startsWith('http')) {
                try { await deleteSupabasePublicFile(gi.url); } catch { }
              }
            }
          }
        } catch { }
      }

      await storage.deleteExhibition(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete exhibition" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
