import axios from "axios";
import "dotenv/config";
import { menuTemplate } from "../../../templates/menuTemplate.js";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

export async function sendMessage(to) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: `👋 Hai. Saya *Zapin AI*, asisten digital yang siap membantu Anda mendapatkan informasi  seputar layanan BP3MI. Anda dapat bertanya langsung, misalnya: 

💬_Bagaimana cara mengajukan izin penelitian?_

Atau, Anda juga dapat mengakses layanan resmi melalui menu di bawah ini.`,
          },
          footer: {
            text: "Zapin AI - Asisten Digital BP3MI Riau",
          },
          action: {
            button: "Lihat Layanan",
            sections: [
              {
                title: "Layanan Utama",
                rows: menuTemplate,
              },
            ],
          },
        },
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
    console.error(" Error di sendGreeting:", error.message);
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

sendMessage("6282285567722");
