import "dotenv/config";

const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;

export function GET(req, res) {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;

  if (mode === "subscribe" && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
}

export function POST(req, res) {
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);
    const sender = message.from;
    const text = message.text?.body || "";
    console.log(`Pesan masuk dari ${sender}: ${text}`);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error di webhook POST", error.message);
    return res.sendStatus(500);
  }
}
