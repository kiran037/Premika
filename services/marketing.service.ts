import { MarketingRepository } from "@/repositories/marketing.repository";

export class MarketingService {
  static async getMarketingOverview() {
    return MarketingRepository.getOverviewStats();
  }
}
