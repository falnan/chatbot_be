import { PrismaClient } from "@prisma/client";
import axios from "axios";
import "dotenv/config";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

const prisma = new PrismaClient();
const userState = new Map();

export default async function takeUserProfile(to, message) {
  let state = userState.get(to);

  if (!state) {
    state = { step: "ask_name", data: {} };
    userState.set(to, state);
  }

  switch (state.step) {
    case "ask_name":
      state.step = "ask_education";
      userState.set(to, state);
      return await send(
        to,
        `Silahkan isi biodata berikut terlebih dahulu.
        
        Sebutkan nama lengkap: *contoh:Albert Mahrebain*`
      );

    case "ask_education":
      state.data.name = message.trim();
      state.step = "ask_age";
      userState.set(to, state);
      return await send(to, "Pendidikan Terakhir / Jurusan. *contoh:SMA/IPA*");

    case "ask_age":
      state.data.education = message.trim();
      state.step = "completed";
      userState.set(to, state);
      return await send(to, "Tanggal Lahir. *contoh: 1 Januari 2001*");

    case "completed":
      state.data.age = message.trim();
      state.step = "done";
      userState.set(to, state);
      await prisma.user.create({
        data: {
          phone: to,
          name: state.data.name,
          education: state.data.education,
          age: state.data.age,
        },
      });
      userState.delete(to);
      return await send(to, "Data Anda sudah lengkap. Terima kasih!");

    case "done":
  }
}

export async function send(to, message) {
  try {
    const response = await axios.post(
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
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(" Error di takeUserProfile:", error.message);
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
