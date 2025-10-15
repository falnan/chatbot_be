import axios from "axios";
import "dotenv/config";

const phone_number_id = process.env.WHATSAPP_PHONE_NUMBER_ID;
const whatsapp_access_token = process.env.WHATSAPP_ACCESS_TOKEN;

const PIN = "369605";
const CERTIFICATE = `CmUKIQjfwvmhju62AhIGZW50OndhIghGYWxuYUJvdFC5mr3HBhpA5TWcocgsJBIKcbDCI7NxKMQTnvPbIy1bYpFb/btJ29wsKNhbiKz0vbYeZfKzTJrUxsfNszeQQ2FyjRmSCMKcAhIwbVZ0uP3mpp/wWrO0mqRsIJxb4uJdzPMvXnUb9Uo63F5TlIYZPedWEN5Pflb5yLFr`;

async function registerNumber() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phone_number_id}/register`,
      {
        messaging_product: "whatsapp",
        pin: PIN,
        certificate: CERTIFICATE,
      },
      {
        headers: {
          Authorization: `Bearer ${whatsapp_access_token}`,
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
