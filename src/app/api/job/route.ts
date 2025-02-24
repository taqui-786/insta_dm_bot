import { initCronJob } from "@/app/component/CornJob";
import { NextResponse } from "next/server";

export async function GET() {
  initCronJob();
  return NextResponse.json({ message: "Cron job started successfully!" });
}
