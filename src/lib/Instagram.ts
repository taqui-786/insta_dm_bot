"use server";

import { IgApiClient } from "instagram-private-api";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { coolMessages } from "./utils";

const ig = new IgApiClient();
const INSTAGRAM_USERNAME = process.env.IG_USERNAME as string;
const INSTAGRAM_PASSWORD = process.env.IG_PASSWORD as string;
const SESSION_PATH = "./session.json";

// Keep track of processed messages to avoid duplicates
const processedMessageIds = new Set<string>();

// Initialize Instagram client
ig.state.generateDevice(INSTAGRAM_USERNAME);

// Login Function with session management
async function loginToInstagram() {
  try {
    if (existsSync(SESSION_PATH)) {
      const savedSession = JSON.parse(readFileSync(SESSION_PATH, "utf8"));
      await ig.state.deserialize(savedSession);
      
      // Verify session is still valid
      try {
        await ig.user.info(ig.state.cookieUserId);
        return true;
      } catch {
        // Session expired, need to login again
      }
    }

    await ig.simulate.preLoginFlow();
    await ig.account.login(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD);

    const session = await ig.state.serialize();
    writeFileSync(SESSION_PATH, JSON.stringify(session));
    
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return false;
  }
}

// Function to check for new reel messages
async function checkForNewMessages() {
  try {
    const isLoggedIn = await loginToInstagram();
    if (!isLoggedIn) return [];

    const inboxFeed = ig.feed.directInbox();
    const threads = await inboxFeed.items();

    const currentTime = Date.now();
    const thirtySecondsAgo = currentTime - 60000; // 60 seconds window

    const unreadMessages = threads
      .filter(thread => 
        thread.last_permanent_item.item_type === "clip" && 
        Number(thread.last_permanent_item.timestamp) / 1000 >= thirtySecondsAgo &&
        !processedMessageIds.has(thread.last_permanent_item.item_id)
      )
      .map(thread => ({
        threadId: thread.thread_id,
        username: thread.users[0].username,
        messageId: thread.last_permanent_item.item_id,
      }));

    // Add to processed set
    unreadMessages.forEach(msg => processedMessageIds.add(msg.messageId));
    
    // Keep set size manageable
    if (processedMessageIds.size > 1000) {
      const toRemove = [...processedMessageIds].slice(0, 500);
      toRemove.forEach(id => processedMessageIds.delete(id));
    }

    return unreadMessages;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return [];
  }
}

// Function to send a DM
async function sendDM(username: string, message: string) {
  try {
    const isLoggedIn = await loginToInstagram();
    if (!isLoggedIn) return { success: false, message: "Failed to login" };

    const userId = await ig.user.getIdByUsername(username);
    // @ts-ignore
    await ig.entity.directThread([userId]).broadcastText(message);

    return { success: true, message: `Auto-replied to ${username}` };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: "Failed to send DM",
        error:error.message,
      };
    } else {
      console.error("Unknown error:", error);
      return {
        success: false,
        message: "Failed to send DM",
        error:error,
      };
    }
  }
}

// Main handler for API route
export async function handleAutoReply() {
  try {
    const messages = await checkForNewMessages();
    const results = [];

    for (const msg of messages) {
      console.log(`📩 New reel from @${msg.username}`);
      
      // Select random funny reply
      const funnyReply = coolMessages[Math.floor(Math.random() * coolMessages.length)];
      const result = await sendDM(msg.username, funnyReply);
      
      results.push({
        username: msg.username,
        status: result.success ? "sent" : "failed",
        message: result.message,
      });

      console.log(`${result.success ? "✅" : "❌"} Auto-replied to @${msg.username}`);
    }

    return {
      success: true,
      processed: messages.length,
      results,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
   ;
  }
}