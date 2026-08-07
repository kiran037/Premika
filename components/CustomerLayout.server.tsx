import { cache } from "react";
import { unstable_cache } from "next/cache";
import CustomerLayoutWrapper from "@/components/CustomerLayoutWrapper";
import { getStoreInformation } from "@/lib/store/get-store-information";

const getCachedStoreInfo = cache(
  unstable_cache(
    async () => getStoreInformation(),
    ["customer-layout-store-info"],
    { revalidate: 300, tags: ["store-info"] }
  )
);

export default async function CustomerLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeInfo = await getCachedStoreInfo();

  return (
    <CustomerLayoutWrapper storeInfo={storeInfo}>
      {children}
    </CustomerLayoutWrapper>
  );
}
