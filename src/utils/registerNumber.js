import axios from "axios";
import "dotenv/config";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

const PIN = "981674";
const CERTIFICATE =
  "CmUKIQjljr7248bwAhIGZW50OndhIghGYWxuYURldlC/+8LHBhpAIp5HmKDCggFnJRzsbgOwSP+18L1LBKuWsbM1bPRbKNDbdKZOM1CKtRKy0SieqN0ETyUJ7jA09/9CMoIAEikpCRIwbRAStcP1jOvxWrO0mqRqLpdf5+VUzPQpXnN6iko63F6x3R2Xy6cIgFbU+tI01nyJ";

async function registerNumber() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/register`,
      {
        messaging_product: "whatsapp",
        pin: PIN,
        certificate: CERTIFICATE,
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Registration success:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌ Registration failed:", error.response.data);
    } else {
      console.error("⚠️ Error:", error.message);
    }
  }
}

registerNumber();
