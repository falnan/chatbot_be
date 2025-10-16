import axios from "axios";
import "dotenv/config";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

subscribeApp();
async function subscribeApp() {
  const url = `https://graph.facebook.com/v24.0/2084926932324494/subscribed_apps`;

  try {
    const response = await axios.post(
      url,
      {}, // body kosong sesuai curl aslinya
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Berhasil subscribe:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal subscribe:", error.response?.data || error.message);
    throw error;
  }
}
