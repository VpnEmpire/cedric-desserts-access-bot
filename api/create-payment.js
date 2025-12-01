const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { chatId } = req.body;

    const shopId = process.env.SHOP_ID;
    const secretKey = process.env.YOOKASSA_KEY;

    if (!shopId || !secretKey) {
      return res.status(500).json({
        error: "Отсутствуют SHOP_ID или YOOKASSA_KEY в переменных окружения"
      });
    }

    // --- FIX BASIC AUTH FOR VERCEL ---
    const authHeader = "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64");

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
          "Authorization": authHeader    // <---- Важное исправление!
        },
        timeout: 15000 // защита от socket hang up
      }
    );

    res.status(200).json({
      confirmation_url: payment.data.confirmation.confirmation_url
    });

  } catch (error) {
    console.error("Ошибка при создании платежа:", error.response?.data || error);
    res.status(500).json({
      error: "Ошибка при создании платежа",
      details: error.response?.data || error.toString()
    });
  }
};
