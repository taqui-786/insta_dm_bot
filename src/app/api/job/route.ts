import { handleAutoReply } from "@/lib/Instagram";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await handleAutoReply();
    return NextResponse.json({ success: true, message: "Cron job executed successfully" });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { success: false, message: "Cron job failed", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
