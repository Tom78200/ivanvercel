import {
  users,
  artworks,
  exhibitions,
  contactMessages,
  siteSettings,
  type User,
  type InsertUser,
  type Artwork,
  type InsertArtwork,
  type Exhibition,
  type InsertExhibition,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface FeaturedWork {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
  year?: string;
  technique?: string;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getArtworks(): Promise<Artwork[]>;
  getArtwork(id: number): Promise<Artwork | undefined>;
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;
  setArtworks(list: Artwork[]): Promise<void>;

  getExhibitions(): Promise<Exhibition[]>;
  getExhibition(id: number): Promise<Exhibition | undefined>;
  createExhibition(exhibition: InsertExhibition): Promise<Exhibition>;
  setExhibitions(list: Exhibition[]): Promise<void>;
  reorderExhibitions(newOrder: { id: number, order: number }[]): Promise<void>;

  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  deleteArtwork(id: number): Promise<boolean>;

  updateExhibitionGallery(id: number, galleryImages: { url: string; caption: string }[]): Promise<Exhibition | undefined>;

  deleteExhibition(id: number): Promise<boolean>;

  reorderArtworks(newOrder: { id: number, order: number }[]): Promise<void>;

  getSlots(): Promise<(number | null)[]>;
  setSlots(slots: (number | null)[]): Promise<void>;

  getFeatured(): Promise<number[]>;
  setFeatured(featured: number[]): Promise<void>;

  getFeaturedWorks(): Promise<FeaturedWork[]>;
  addFeaturedWork(work: FeaturedWork): Promise<void>;
  updateFeaturedWork(id: number, data: Partial<FeaturedWork>): Promise<void>;
  deleteFeaturedWork(id: number): Promise<void>;
  getFeaturedWorksOrder(): Promise<number[]>;
  setFeaturedWorksOrder(ids: number[]): Promise<void>;

  getHours(): Promise<string[]>;
  setHours(hours: string[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Helper for site settings
  private async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting ? (setting.value as T) : defaultValue;
  }

  private async setSetting<T>(key: string, value: T): Promise<void> {
    await db.insert(siteSettings)
      .values({ key, value: value as any })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: value as any }
      });
  }

  // Helpers to map DB snake_case to Domain camelCase
  private mapArtwork(dbArtwork: typeof artworks.$inferSelect): Artwork {
    return {
      id: dbArtwork.id,
      title: dbArtwork.title,
      imageUrl: dbArtwork.image_url,
      dimensions: dbArtwork.dimensions,
      technique: dbArtwork.technique,
      year: dbArtwork.year,
      description: dbArtwork.description,
      category: dbArtwork.category,
      additionalImages: dbArtwork.additional_images as string[] | null,
      isVisible: dbArtwork.is_visible,
      showInSlider: dbArtwork.show_in_slider,
      order: dbArtwork.order
    };
  }

  private mapExhibition(dbExhibition: typeof exhibitions.$inferSelect): Exhibition {
    return {
      id: dbExhibition.id,
      title: dbExhibition.title,
      location: dbExhibition.location,
      year: dbExhibition.year,
      imageUrl: dbExhibition.image_url,
      description: dbExhibition.description,
      theme: dbExhibition.theme,
      galleryImages: dbExhibition.gallery_images as any[] | null,
      videoUrl: dbExhibition.video_url,
      order: dbExhibition.order
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getArtworks(): Promise<Artwork[]> {
    const dbArtworks = await db.select().from(artworks)
      .where(eq(artworks.is_visible, true))
      .orderBy(asc(artworks.order));
    return dbArtworks.map(this.mapArtwork);
  }

  async getArtwork(id: number): Promise<Artwork | undefined> {
    const [artwork] = await db.select().from(artworks).where(eq(artworks.id, id));
    return artwork ? this.mapArtwork(artwork) : undefined;
  }

  async createArtwork(insertArtwork: InsertArtwork): Promise<Artwork> {
    const [artwork] = await db.insert(artworks).values({
      ...insertArtwork,
      category: insertArtwork.category || 'Autres',
      is_visible: insertArtwork.is_visible ?? true,
      show_in_slider: insertArtwork.show_in_slider ?? true,
      order: insertArtwork.order ?? 0,
      additional_images: insertArtwork.additional_images || []
    }).returning();
    return this.mapArtwork(artwork);
  }

  async setArtworks(list: Artwork[]): Promise<void> {
    console.warn("setArtworks called but ignored in DatabaseStorage mode");
  }

  async getExhibitions(): Promise<Exhibition[]> {
    const dbExhibitions = await db.select().from(exhibitions).orderBy(asc(exhibitions.order));
    return dbExhibitions.map(this.mapExhibition);
  }

  async getExhibition(id: number): Promise<Exhibition | undefined> {
    const [exhibition] = await db.select().from(exhibitions).where(eq(exhibitions.id, id));
    return exhibition ? this.mapExhibition(exhibition) : undefined;
  }

  async createExhibition(insertExhibition: InsertExhibition): Promise<Exhibition> {
    const [exhibition] = await db.insert(exhibitions).values({
      ...insertExhibition,
      gallery_images: insertExhibition.gallery_images || [],
      video_url: insertExhibition.video_url || null,
      order: insertExhibition.order ?? 0
    }).returning();
    return this.mapExhibition(exhibition);
  }

  async setExhibitions(list: Exhibition[]): Promise<void> {
    console.warn("setExhibitions called but ignored in DatabaseStorage mode");
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  async deleteArtwork(id: number): Promise<boolean> {
    const [deleted] = await db.delete(artworks).where(eq(artworks.id, id)).returning();
    return !!deleted;
  }

  async updateExhibitionGallery(id: number, galleryImages: { url: string; caption: string }[]): Promise<Exhibition | undefined> {
    const [updated] = await db.update(exhibitions)
      .set({ gallery_images: galleryImages })
      .where(eq(exhibitions.id, id))
      .returning();
    return updated ? this.mapExhibition(updated) : undefined;
  }

  async deleteExhibition(id: number): Promise<boolean> {
    const [deleted] = await db.delete(exhibitions).where(eq(exhibitions.id, id)).returning();
    return !!deleted;
  }

  async reorderArtworks(newOrder: { id: number, order: number }[]): Promise<void> {
    // This could be optimized with a single query or transaction
    for (const { id, order } of newOrder) {
      await db.update(artworks).set({ order }).where(eq(artworks.id, id));
    }
  }

  async reorderExhibitions(newOrder: { id: number, order: number }[]): Promise<void> {
    for (const { id, order } of newOrder) {
      await db.update(exhibitions).set({ order }).where(eq(exhibitions.id, id));
    }
  }

  async getSlots(): Promise<(number | null)[]> {
    return await this.getSetting<(number | null)[]>("slots", [null, null, null]);
  }

  async setSlots(slots: (number | null)[]): Promise<void> {
    await this.setSetting("slots", slots);
  }

  async getFeatured(): Promise<number[]> {
    return await this.getSetting<number[]>("featured", []);
  }

  async setFeatured(featured: number[]): Promise<void> {
    await this.setSetting("featured", featured);
  }

  async getFeaturedWorks(): Promise<FeaturedWork[]> {
    return await this.getSetting<FeaturedWork[]>("featured_works", []);
  }

  async addFeaturedWork(work: FeaturedWork): Promise<void> {
    const works = await this.getFeaturedWorks();
    works.push(work);
    await this.setSetting("featured_works", works);

    // Maintain order
    const order = await this.getFeaturedWorksOrder();
    if (!order.includes(work.id)) {
      order.push(work.id);
      await this.setFeaturedWorksOrder(order);
    }
  }

  async updateFeaturedWork(id: number, data: Partial<FeaturedWork>): Promise<void> {
    const works = await this.getFeaturedWorks();
    const idx = works.findIndex(w => w.id === id);
    if (idx !== -1) {
      works[idx] = { ...works[idx], ...data };
      await this.setSetting("featured_works", works);
    }
  }

  async deleteFeaturedWork(id: number): Promise<void> {
    let works = await this.getFeaturedWorks();
    works = works.filter(w => w.id !== id);
    await this.setSetting("featured_works", works);

    let order = await this.getFeaturedWorksOrder();
    order = order.filter(x => x !== id);
    await this.setFeaturedWorksOrder(order);
  }

  async getFeaturedWorksOrder(): Promise<number[]> {
    return await this.getSetting<number[]>("featured_works_order", []);
  }

  async setFeaturedWorksOrder(ids: number[]): Promise<void> {
    await this.setSetting("featured_works_order", ids);
  }

  async getHours(): Promise<string[]> {
    return await this.getSetting<string[]>("hours", [
      "Lundi - Vendredi : 9h00 - 18h00",
      "Samedi : Sur rendez-vous",
      "Dimanche : Fermé"
    ]);
  }

  async setHours(hours: string[]): Promise<void> {
    await this.setSetting("hours", hours);
  }
}

export const storage = new DatabaseStorage();
