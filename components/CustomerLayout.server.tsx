import CustomerLayoutWrapper from "@/components/CustomerLayoutWrapper";
import { getStoreInformation } from "@/lib/store/get-store-information";
import { StoreService } from "@/services/store.service";

export default async function CustomerLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeInfo = await getStoreInformation();

  let logo: string | null = null;
  try {
    const settings = await StoreService.getStoreSettings();
    if (settings?.logo) {
      logo = settings.logo;
    }
  } catch (e) {
    console.error("Error fetching store settings logo:", e);
  }

  const fullStoreInfo = {
    ...storeInfo,
    logo,
  };

  return (
    <CustomerLayoutWrapper storeInfo={fullStoreInfo}>
      {children}
    </CustomerLayoutWrapper>
  );
}
