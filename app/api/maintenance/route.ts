import { NextResponse } from "next/server";
import { StoreService } from "@/services/store.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await StoreService.getStoreSettings();
    return NextResponse.json(
      { maintenanceMode: !!settings?.maintenanceMode },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in maintenance API route:", error);
    return NextResponse.json(
      { maintenanceMode: false },
      { status: 200 }
    );
  }
}
