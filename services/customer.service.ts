import { CustomerRepository, CustomerQueryOptions } from "@/repositories/customer.repository";

export class CustomerService {
  /**
   * Admin: List customers with search, segment filters, sorting, and CRM analytics
   */
  static async getAdminCustomersList(options: CustomerQueryOptions = {}) {
    return await CustomerRepository.getAdminCustomers(options);
  }

  /**
   * Admin: Get single customer CRM details by ID
   */
  static async getAdminCustomerById(id: string) {
    return await CustomerRepository.findAdminCustomerById(id);
  }
}
