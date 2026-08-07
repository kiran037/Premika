import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { StoreRepository } from "@/repositories/store.repository";
import { SeoService } from "@/services/seo.service";
import { GlobalSeoInput } from "@/lib/validations/seo";
import {
  StoreSettingsInput,
  StoreContactsInput,
  SocialLinkInput,
} from "@/lib/validations/admin-store.schema";

const cachedGetStoreSettings = cache(
  unstable_cache(
    async () => {
      const settings = await StoreRepository.getStoreSettings();
      if (!settings) {
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
    },
    ["service-store-settings"],
    { revalidate: 300, tags: ["store-settings"] }
  )
);

const cachedGetStoreContacts = cache(
  unstable_cache(
    async () => {
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
    },
    ["service-store-contacts"],
    { revalidate: 300, tags: ["store-contacts"] }
  )
);

const cachedGetSocialLinks = cache(
  unstable_cache(
    async () => StoreRepository.getSocialLinks(),
    ["service-social-links"],
    { revalidate: 300, tags: ["social-links"] }
  )
);

export class StoreService {
  // Settings & Branding
  static async getStoreSettings() {
    return cachedGetStoreSettings();
  }

  static async updateStoreSettings(input: StoreSettingsInput) {
    const res = await StoreRepository.upsertStoreSettings(input);
    try {
      revalidateTag("store-settings");
    } catch {}
    return res;
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
    return cachedGetStoreContacts();
  }

  static async updateStoreContacts(input: StoreContactsInput) {
    const res = await StoreRepository.upsertStoreContacts(input);
    try {
      revalidateTag("store-contacts");
    } catch {}
    return res;
  }

  // Social Links
  static async getSocialLinks() {
    return cachedGetSocialLinks();
  }

  static async createSocialLink(input: SocialLinkInput) {
    const res = await StoreRepository.createSocialLink(input);
    try {
      revalidateTag("social-links");
    } catch {}
    return res;
  }

  static async updateSocialLink(id: string, input: SocialLinkInput) {
    const existing = await StoreRepository.getSocialLinkById(id);
    if (!existing) {
      throw new Error("Social link not found");
    }
    const res = await StoreRepository.updateSocialLink(id, input);
    try {
      revalidateTag("social-links");
    } catch {}
    return res;
  }

  static async deleteSocialLink(id: string) {
    const existing = await StoreRepository.getSocialLinkById(id);
    if (!existing) {
      throw new Error("Social link not found");
    }
    const res = await StoreRepository.deleteSocialLink(id);
    try {
      revalidateTag("social-links");
    } catch {}
    return res;
  }
}
