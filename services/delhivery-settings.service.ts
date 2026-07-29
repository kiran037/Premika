import { DelhiverySettingsRepository } from "@/repositories/delhivery-settings.repository";
import { DelhiverySettingsInput } from "@/lib/validations/admin-delhivery.schema";

export class DelhiverySettingsService {
  /**
   * Fetch Delhivery shipping settings with sensible defaults if unconfigured
   */
  static async getSettings() {
    const settings = await DelhiverySettingsRepository.getSettings();
    if (!settings) {
      return {
        id: "",
        pickupName: "Premika Main Warehouse",
        pickupPhone: "+91 98765 43210",
        pickupEmail: "shipping@premika.shop",
        pickupAddressLine1: "123 Fashion Hub, Sector 5",
        pickupAddressLine2: "Industrial Area",
        pickupCity: "Mumbai",
        pickupState: "Maharashtra",
        pickupPincode: "400001",
        pickupCountry: "India",
        isActive: true,
      };
    }
    return settings;
  }

  /**
   * Update or create Delhivery shipping & pickup settings
   */
  static async updateSettings(input: DelhiverySettingsInput) {
    return DelhiverySettingsRepository.upsertSettings(input);
  }
}
