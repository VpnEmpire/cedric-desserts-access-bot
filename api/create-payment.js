const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { chatId } = req.body;

    const shopId = process.env.SHOP_ID;
    const secretKey = process.env.YOOKASSA_KEY;

    if (!shopId || !secretKey) {
      return res.status(500).json({ error: "Нет SHOP_ID или YOOKASSA_KEY" });
    }

    // BASIC AUTH
    const authString = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    const payment = await axios.post(
      "https://api.yookassa.ru/v3/payments",
      {
        amount: {
          value: "1490.00",
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: "https://t.me/cedric_desserts_access_bot"
        },
        capture: true,
        description: `Оплата доступа (chatId ${chatId})`,
        metadata: { chatId }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${authString}`
        },
        timeout: 15000
      }
    );

    const url = payment.data.confirmation.confirmation_url;

    res.status(200).json({ confirmation_url: url });

  } catch (error) {
    console.error("Ошибка при создании платежа:", error?.response?.data || error);
    res.status(500).json({
      error: "Ошибка при создании платежа",
      details: error?.response?.data
    });
  }
};
