import { GoogleGenAI } from "@google/genai";
import { menuTemplate } from "../../templates/menuTemplate.js";
import "dotenv/config";

const ai = new GoogleGenAI({});
const categories = menuTemplate.map((item) => item.id);
categories.unshift("salam");
categories.push("lainnya");
const categoriesString = categories.join(",");

export default async function classifyMessage(message) {
  try {
    const response = await ai.models.generateContent({
      // model: "gemini-2.5-flash",
      model: "gemini-2.0-flash-lite",
      contents: `
      Kamu adalah sistem klasifikasi pesan.
      Tentukan kategori pesan berikut ke dalam salah satu dari:
      ${categoriesString}

      Jawab hanya dengan 1 kategori, tanpa penjelasan.

      Pesan: ${message}
      Contoh jawaban: lainnya
    `,
    });

    const rawText = response.text || "";
    console.log(rawText);
    const cleaned = rawText
      .trim()
      .replace(/^["']|["']$/g, "")
      .toLowerCase();
    const matchedCategory = categories.find(
      (cat) => cleaned === cat.toLocaleLowerCase()
    );
    const finalCategory = matchedCategory || "lainnya";
    return finalCategory;
    // return {
    //   success: true,
    //   data: finalCategory,
    // };
  } catch (error) {
    console.error(" Error di classifyMessage:", error.message);
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
