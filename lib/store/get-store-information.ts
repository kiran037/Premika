import { db } from "@/db/client";
import { storeSettings, storeContacts, socialLinks } from "@/db/schema/store";
import { asc } from "drizzle-orm";

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  isActive: boolean;
  sortOrder: string;
}

export interface StoreInformation {
  storeName: string;
  storeEmail: string;
  supportEmail: string;
  supportPhone: string;
  businessHours: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  googleMapsUrl: string | null;
  formattedAddress: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  socialLinks: SocialLinkItem[];
}

const DEFAULT_STORE_INFO: StoreInformation = {
  storeName: "Premika Store",
  storeEmail: "premika.shop@gmail.com",
  supportEmail: "premika.shop@gmail.com",
  supportPhone: "+919599215195",
  businessHours: "9 AM - 6 PM IST (Mon-Fri)",
  address: null,
  city: null,
  state: null,
  country: "India",
  postalCode: null,
  googleMapsUrl: null,
  formattedAddress: "Online Store Based in India",
  facebookUrl: "https://www.facebook.com/",
  instagramUrl: "https://www.instagram.com/premika.store",
  twitterUrl: "https://twitter.com/",
  socialLinks: [],
};

export async function getStoreInformation(): Promise<StoreInformation> {
  if (typeof window !== "undefined") {
    return DEFAULT_STORE_INFO;
  }

  try {
    const [settings] = await db.select().from(storeSettings).limit(1);
    const [contacts] = await db.select().from(storeContacts).limit(1);
    const links = await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));

    const storeName = settings?.storeName || DEFAULT_STORE_INFO.storeName;
    const storeEmail = settings?.storeEmail || DEFAULT_STORE_INFO.storeEmail;
    const supportEmail = contacts?.supportEmail || settings?.storeEmail || DEFAULT_STORE_INFO.supportEmail;
    const supportPhone = contacts?.supportPhone || settings?.storePhone || DEFAULT_STORE_INFO.supportPhone;
    const businessHours = contacts?.businessHours || DEFAULT_STORE_INFO.businessHours;

    const address = contacts?.address || null;
    const city = contacts?.city || null;
    const state = contacts?.state || null;
    const country = contacts?.country || "India";
    const postalCode = contacts?.postalCode || null;
    const googleMapsUrl = contacts?.googleMapsUrl || null;

    const addressParts = [address, city, state, postalCode, country].filter(Boolean);
    const formattedAddress =
      addressParts.length > 0 ? addressParts.join(", ") : DEFAULT_STORE_INFO.formattedAddress;

    const activeLinks = (links || []).filter((l) => l.isActive);

    const getUrlByPlatform = (aliases: string[]) => {
      const found = activeLinks.find((l) =>
        aliases.some((alias) => l.platform.trim().toLowerCase() === alias.toLowerCase())
      );
      return found?.url || null;
    };

    const facebookUrl = getUrlByPlatform(["facebook", "fb"]) || DEFAULT_STORE_INFO.facebookUrl;
    const instagramUrl =
      getUrlByPlatform(["instagram", "insta", "ig"]) || DEFAULT_STORE_INFO.instagramUrl;
    const twitterUrl = getUrlByPlatform(["twitter", "x", "twitter/x"]);

    return {
      storeName,
      storeEmail,
      supportEmail,
      supportPhone,
      businessHours,
      address,
      city,
      state,
      country,
      postalCode,
      googleMapsUrl,
      formattedAddress,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      socialLinks: links || [],
    };
  } catch (err) {
    console.error("Error in getStoreInformation:", err);
    return DEFAULT_STORE_INFO;
  }
}

export default getStoreInformation;
