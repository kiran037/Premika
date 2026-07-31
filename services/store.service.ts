import { StoreRepository } from "@/repositories/store.repository";
import { SeoService } from "@/services/seo.service";
import { GlobalSeoInput } from "@/lib/validations/seo";
import {
  StoreSettingsInput,
  StoreContactsInput,
  SocialLinkInput,
} from "@/lib/validations/admin-store.schema";

export class StoreService {
  // Settings & Branding
  static async getStoreSettings() {
    const settings = await StoreRepository.getStoreSettings();
    if (!settings) {
      // Return sensible defaults if database table is initially empty
      return {
        id: "",
        storeName: "Premika",
        storeEmail: "contact@premika.shop",
        storePhone: "+91 98765 43210",
        logo: null,
        favicon: null,
        currency: "INR",
        timezone: "Asia/Kolkata",
        maintenanceMode: false,
      };
    }
    return settings;
  }

  static async updateStoreSettings(input: StoreSettingsInput) {
    return StoreRepository.upsertStoreSettings(input);
  }

  // Global SEO Settings
  static async getSeoSettings() {
    return SeoService.getSeoSettings();
  }

  static async updateSeoSettings(input: GlobalSeoInput) {
    return SeoService.updateSeoSettings(input);
  }

  // Contact Information
  static async getStoreContacts() {
    const contacts = await StoreRepository.getStoreContacts();
    if (!contacts) {
      return {
        id: "",
        address: "123 Fashion Street",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400001",
        supportEmail: "support@premika.shop",
        supportPhone: "+91 98765 43210",
        businessHours: "Mon - Sat: 10:00 AM - 8:00 PM IST",
        googleMapsUrl: "",
      };
    }
    return contacts;
  }

  static async updateStoreContacts(input: StoreContactsInput) {
    return StoreRepository.upsertStoreContacts(input);
  }

  // Social Links
  static async getSocialLinks() {
    return StoreRepository.getSocialLinks();
  }

  static async createSocialLink(input: SocialLinkInput) {
    return StoreRepository.createSocialLink(input);
  }

  static async updateSocialLink(id: string, input: SocialLinkInput) {
    const existing = await StoreRepository.getSocialLinkById(id);
    if (!existing) {
      throw new Error("Social link not found");
    }
    return StoreRepository.updateSocialLink(id, input);
  }

  static async deleteSocialLink(id: string) {
    const existing = await StoreRepository.getSocialLinkById(id);
    if (!existing) {
      throw new Error("Social link not found");
    }
    return StoreRepository.deleteSocialLink(id);
  }
}
