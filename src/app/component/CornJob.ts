import cron from "node-cron";
import { handleAutoReply } from "../../lib/Instagram";

let job: cron.ScheduledTask | null = null;

async function runTaskWithTimeout<T>(task: () => Promise<T>, timeout: number): Promise<T | null> {
  let timeoutReached = false;

  const timeoutPromise = new Promise<T | null>((resolve) =>
    setTimeout(() => {
      timeoutReached = true;
      console.warn("⚠️ Task timeout reached, but continuing execution...");
      resolve(null); // Instead of rejecting, return `null`
    }, timeout)
  );

  const result = await Promise.race([task(), timeoutPromise]);

  if (timeoutReached) {
    console.warn("⚠️ Task exceeded timeout but was allowed to continue.");
  }

  return result;
}

async function cronTask() {
  console.log("🔄 Running cron job:", new Date().toISOString());

  try {
    const result = await runTaskWithTimeout(handleAutoReply, 30000); // Increased timeout to 10s
    if (result) {
      console.log("✅ Auto-reply job completed");
    } else {
      console.warn("⚠️ Auto-reply job took too long but was not stopped.");
    }
  } catch (error) {
    console.error("❌ Cron job failed:", error instanceof Error ? error.message : error);
  }
}

export function initCronJob() {
  if (job) {
    console.log("🚀 Cron job is already running");
    return;
  }

  console.log("✅ Initializing cron job...");
  job = cron.schedule("*/30 * * * * *", async () => {
    await cronTask();
  });

  
}

export function stopCronJob() {
  if (job) {
    job.stop();
    job = null;
    console.log("🛑 Cron job stopped");
  } else {
    console.log("⚠️ No cron job is running");
  }
}
