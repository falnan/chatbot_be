import classifyMessage from "../services/classifyMessage.js";
import sendGreeting from "../services/sendGreeting.js";
import sendMessage from "../services/sendMessage.js";
import sendUnknownMessage from "../services/sendUnknownMessage.js";
import isUserRecentlyActive, {
  recordUserActivity,
} from "../services/userActivity.js";

export default async function chatController(sender, message) {
  const isUserActive = isUserRecentlyActive(sender);
  const classify = await classifyMessage(message);

  if (!isUserActive) await sendGreeting(sender);

  if (classify == "salam") {
    console.log("masuk salam");
  } else if (classify == "lainnya") {
    console.log("masuk lainnya");
    // await sendUnknownMessage(sender);
  } else {
    console.log("masuk pesan umum");
    // await sendMessage(sender);
  }

  console.log("🔎 Hasil klasifikasi:", classify);

  recordUserActivity(sender);
}
