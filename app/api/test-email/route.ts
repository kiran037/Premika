import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/emailService";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required" },
        { status: 400 }
      );
    }

    const result = await sendTestEmail(email);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send test email" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Test email endpoint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
