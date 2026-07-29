import CustomerLayoutWrapper from "@/components/CustomerLayoutWrapper";
import { getStoreInformation } from "@/lib/store/get-store-information";
import { db } from "@/db/client";
import { storeSettings } from "@/db/schema/store";

export default async function CustomerLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeInfo = await getStoreInformation();

  let logo: string | null = null;
  try {
    const [settings] = await db.select().from(storeSettings).limit(1);
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
