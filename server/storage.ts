import {
  type User,
  type InsertUser,
  type Artwork,
  type InsertArtwork,
  type Exhibition,
  type InsertExhibition,
  type ContactMessage,
  type InsertContactMessage
} from "../shared/schema.js";
import { supabase } from "./supabase.js";

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
    const { data } = await supabase.from('site_settings').select('value').eq('key', key).single();
    return data ? (data.value as T) : defaultValue;
  }

  private async setSetting<T>(key: string, value: T): Promise<void> {
    await supabase.from('site_settings').upsert({ key, value: value as any }, { onConflict: 'key' });
  }

  // Helpers to map DB snake_case to Domain camelCase
  private mapArtwork(dbArtwork: any): Artwork {
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

  private mapExhibition(dbExhibition: any): Exhibition {
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
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data } = await supabase.from('users').select('*').eq('username', username).single();
    return data || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase.from('users').insert(insertUser).select().single();
    if (error) throw error;
    return data;
  }

  async getArtworks(): Promise<Artwork[]> {
    const { data } = await supabase.from('artworks')
      .select('*')
      .eq('is_visible', true)
      .order('order', { ascending: true });
    return (data || []).map(this.mapArtwork);
  }

  async getArtwork(id: number): Promise<Artwork | undefined> {
    const { data } = await supabase.from('artworks').select('*').eq('id', id).single();
    return data ? this.mapArtwork(data) : undefined;
  }

  async createArtwork(insertArtwork: InsertArtwork): Promise<Artwork> {
    const { data, error } = await supabase.from('artworks').insert({
      ...insertArtwork,
      category: insertArtwork.category || 'Autres',
      is_visible: insertArtwork.is_visible ?? true,
      show_in_slider: insertArtwork.show_in_slider ?? true,
      order: insertArtwork.order ?? 0,
      additional_images: insertArtwork.additional_images || []
    }).select().single();

    if (error) throw error;
    return this.mapArtwork(data);
  }

  async setArtworks(list: Artwork[]): Promise<void> {
    console.warn("setArtworks called but ignored in DatabaseStorage mode");
  }

  async getExhibitions(): Promise<Exhibition[]> {
    const { data } = await supabase.from('exhibitions').select('*').order('order', { ascending: true });
    return (data || []).map(this.mapExhibition);
  }

  async getExhibition(id: number): Promise<Exhibition | undefined> {
    const { data } = await supabase.from('exhibitions').select('*').eq('id', id).single();
    return data ? this.mapExhibition(data) : undefined;
  }

  async createExhibition(insertExhibition: InsertExhibition): Promise<Exhibition> {
    const { data, error } = await supabase.from('exhibitions').insert({
      ...insertExhibition,
      gallery_images: insertExhibition.gallery_images || [],
      video_url: insertExhibition.video_url || null,
      order: insertExhibition.order ?? 0
    }).select().single();

    if (error) throw error;
    return this.mapExhibition(data);
  }

  async setExhibitions(list: Exhibition[]): Promise<void> {
    console.warn("setExhibitions called but ignored in DatabaseStorage mode");
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await supabase.from('contact_messages').insert(insertMessage).select().single();
    if (error) throw error;
    return data;
  }

  async deleteArtwork(id: number): Promise<boolean> {
    const { error } = await supabase.from('artworks').delete().eq('id', id);
    return !error;
  }

  async updateExhibitionGallery(id: number, galleryImages: { url: string; caption: string }[]): Promise<Exhibition | undefined> {
    const { data, error } = await supabase.from('exhibitions')
      .update({ gallery_images: galleryImages })
      .eq('id', id)
      .select()
      .single();

    if (error) return undefined;
    return this.mapExhibition(data);
  }

  async deleteExhibition(id: number): Promise<boolean> {
    const { error } = await supabase.from('exhibitions').delete().eq('id', id);
    return !error;
  }

  async reorderArtworks(newOrder: { id: number, order: number }[]): Promise<void> {
    for (const { id, order } of newOrder) {
      await supabase.from('artworks').update({ order }).eq('id', id);
    }
  }

  async reorderExhibitions(newOrder: { id: number, order: number }[]): Promise<void> {
    for (const { id, order } of newOrder) {
      await supabase.from('exhibitions').update({ order }).eq('id', id);
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
