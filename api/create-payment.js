import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const { amount, description } = req.body;

  const idempotenceKey = crypto.randomUUID();

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        "Authorization":
          "Basic " +
          Buffer.from(
            `${process.env.SHOP_ID}:${process.env.YOOKASSA_KEY}`
          ).toString("base64"),
      },
      body: JSON.stringify({
        amount: {
          value: amount,
          currency: "RUB",
        },
        confirmation: {
          type: "redirect",
          return_url: "https://t.me/cedric_desserts_access_bot",
        },
        capture: true,
        description: description,
      }),
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("ЮKassa error:", error);
    return res.status(500).json({ error: true });
  }
}
