import { initCronJob } from "@/app/component/CornJob";


let isInitialized = false;

if (typeof window === 'undefined' && !isInitialized) {
    // Only run on server-side and if not already initialized
    initCronJob();
    isInitialized = true;
    console.log('Cron job initialization completed');
}