import { handleAutoReply } from "@/lib/Instagram";
import { NextResponse } from "next/server";




export async function GET() {
  try {
    // Get current hour in IST (India Standard Time)
    const currentHour = new Date().getUTCHours() + 5.5; // Convert UTC to IST
    const hour = Math.floor(currentHour % 24); // Normalize to 24-hour format

    // Check if time is between 12 AM and 7 AM IST
    if (hour >= 0 && hour < 7) {
      return NextResponse.json({ 
        success: true, 
        message: "Night time suspended - Service runs between 7 AM and 12 AM IST" 
      });
    }

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
