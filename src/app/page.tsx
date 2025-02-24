"use client"; 

import { useState } from "react";
import InstagramLoginPage from "./component/InstagramLogin";

export default function Home() {
  const [isCronRunning, setIsCronRunning] = useState(false);

  const handleStartCron = async () => {
    try {
      const response = await fetch("/api/job");
      if (response.ok) {
        setIsCronRunning(true);
      }
    } catch (error) {
      console.error("Failed to start cron job:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <InstagramLoginPage />
      
      <button
        onClick={handleStartCron}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        disabled={isCronRunning}
      >
        {isCronRunning ? "✅ Cron Job Running" : "Start Cron Job"}
      </button>
    </main>
  );
}
