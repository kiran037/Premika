import { cache } from "react";
import { SeoRepository } from "@/repositories/seo.repository";
import { SeoSettings, NewSeoSettings } from "@/db/schema/seo";
import { globalSeoSchema, GlobalSeoInput } from "@/lib/validations/seo";

export class SeoService {
  /**
   * Retrieve global SEO settings (deduplicated per request turn via React cache)
   */
  static getSeoSettings = cache(async (): Promise<SeoSettings> => {
    return await SeoRepository.getSeoSettings();
  });

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

    return await SeoRepository.updateSeoSettings(updatePayload);
  }
}
