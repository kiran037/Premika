import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { SeoRepository } from "@/repositories/seo.repository";
import { SeoSettings, NewSeoSettings } from "@/db/schema/seo";
import { globalSeoSchema, GlobalSeoInput } from "@/lib/validations/seo";

const cachedGetSeoSettings = cache(
  unstable_cache(
    async (): Promise<SeoSettings> => SeoRepository.getSeoSettings(),
    ["service-seo-settings"],
    { revalidate: 300, tags: ["seo-settings"] }
  )
);

export class SeoService {
  /**
   * Retrieve global SEO settings
   */
  static async getSeoSettings(): Promise<SeoSettings> {
    return cachedGetSeoSettings();
  }

  /**
   * Update global SEO settings with Zod validation
   */
  static async updateSeoSettings(input: GlobalSeoInput): Promise<SeoSettings> {
    const validatedData = globalSeoSchema.parse(input);

    const updatePayload: Partial<NewSeoSettings> = {
      ...(validatedData.siteName !== undefined && { siteName: validatedData.siteName }),
      ...(validatedData.titleTemplate !== undefined && { titleTemplate: validatedData.titleTemplate }),
      ...(validatedData.defaultMetaTitle !== undefined && { defaultMetaTitle: validatedData.defaultMetaTitle }),
      ...(validatedData.defaultMetaDescription !== undefined && { defaultMetaDescription: validatedData.defaultMetaDescription }),
      ...(validatedData.defaultKeywords !== undefined && { defaultKeywords: validatedData.defaultKeywords }),
      ...(validatedData.defaultOgImage !== undefined && { defaultOgImage: validatedData.defaultOgImage }),
      ...(validatedData.twitterHandle !== undefined && { twitterHandle: validatedData.twitterHandle }),
      ...(validatedData.googleVerification !== undefined && { googleVerification: validatedData.googleVerification }),
      ...(validatedData.bingVerification !== undefined && { bingVerification: validatedData.bingVerification }),
      ...(validatedData.defaultRobots !== undefined && { defaultRobots: validatedData.defaultRobots }),
      ...(validatedData.canonicalDomain !== undefined && { canonicalDomain: validatedData.canonicalDomain }),
    };

    const res = await SeoRepository.updateSeoSettings(updatePayload);
    try {
      revalidateTag("seo-settings");
    } catch {}
    return res;
  }
}
