import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const signature = req.headers["yookassa-signature"];

  const hash = crypto
    .createHmac("sha256", process.env.SECRET_WEBHOOK_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== hash) {
    return res.status(400).json({ error: true });
  }

  console.log("Webhook Юкассы:", req.body);

  return res.status(200).json({ ok: true });
}
