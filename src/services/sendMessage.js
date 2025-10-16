import axios from "axios";
import "dotenv/config";
import { menuTemplate } from "../../templates/menuTemplate.js";
import sendUnknownMessage from "./sendUnknownMessage.js";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

export default async function sendMessage(sender, classify) {
  const menuItem = menuTemplate.find((item) => item.id == classify);
  if (!menuItem) {
    return await sendUnknownMessage(sender);
  }
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: sender,
        type: "text",
        text: { body: menuItem.answer },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(" Error di sendMessage:", error.message);
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.error?.message || error.message,
      details:
        process.env.NODE_ENV === "development"
          ? error.response?.data || error.stack
          : null,
    };
  }
}
