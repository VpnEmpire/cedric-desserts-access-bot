const crypto = require("crypto");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const SHOP_ID = process.env.SHOP_ID;
  const YOOKASSA_KEY = process.env.YOOKASSA_KEY;

  const chatId = req.body.chatId;

  const idempotenceKey = crypto.randomUUID();

  const payload = {
    amount: {
      value: "1490.00",
      currency: "RUB"
    },
    confirmation: {
      type: "redirect",
      return_url: "https://t.me/cedric_desserts_access_bot"
    },
    description: `Оплата доступа, чат ${chatId}`,
    metadata: { chatId }
  };

  const auth = Buffer.from(`${SHOP_ID}:${YOOKASSA_KEY}`).toString("base64");

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Idempotence-Key": idempotenceKey,
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  return res.status(200).json({
    payment_id: data.id,
    confirmation_url: data.confirmation.confirmation_url
  });
};
