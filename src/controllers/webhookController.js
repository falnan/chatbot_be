import chatController from "./chatController.js";
import listController from "./listController.js";
import "dotenv/config";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

export function GET(req, res) {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
}

export async function POST(req, res) {
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const sender = message.from;
    const messageType = message.type;

    if (messageType === "text") {
      const text = message.text.body;
      console.log(`💬 Pesan teks dari ${sender}: ${text}`);
      await chatController(sender, text);
      return res.sendStatus(200);
    } else if (messageType === "interactive") {
      const interactiveType = message.interactive.type;

      if (interactiveType === "list_reply") {
        await listController(sender, listId);
      }
      if (interactiveType === "button_reply") {
        const buttonId = message.interactive.button_reply.id;
        await listController(sender, buttonId);
      }
      return res.sendStatus(200);
    }
  } catch (error) {
    console.error("Error di webhookController", error.message);
    return res.sendStatus(500);
  }
}
