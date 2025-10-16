// controllers/listController.js
import axios from "axios";
import { menuTemplate } from "../../templates/menuTemplate.js";
import "dotenv/config";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

export default async function listController(sender, selectedId) {
  try {
    const selectedItem = menuTemplate.find((item) => item.id === selectedId);
    if (!selectedItem) {
      await sendText(sender, "⚠️ Maaf, pilihan Anda tidak dikenali.");
      return;
    }

    // ✅ Kirim jawaban dari template
    await sendText(sender, selectedItem.answer || selectedItem.description);
  } catch (error) {
    console.error("❌ Error di listController:", error.message);
  }
}

// 📤 Fungsi kirim teks sederhana
async function sendText(to, message) {
  await axios.post(
    `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}
