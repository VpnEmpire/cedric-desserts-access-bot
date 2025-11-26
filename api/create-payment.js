const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { chatId } = req.body;

    // Данные ЮKassa
    const shopId = process.env.SHOP_ID;          // твой SHOP_ID
    const secretKey = process.env.YOOKASSA_KEY;  // твой секретный ключ

    if (!shopId || !secretKey) {
      return res.status(500).json({
        error: "Отсутствуют SHOP_ID или YOOKASSA_KEY в переменных окружения"
      });
    }

    // Создаём платеж через ЮKassa API
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
        metadata: {
          chatId
        }
      },
      {
        auth: {
          username: shopId,
          password: secretKey
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const confirmationUrl = payment.data.confirmation.confirmation_url;

    res.status(200).json({
      confirmation_url: confirmationUrl
    });

  } catch (error) {
    console.error("Ошибка при создании платежа:", error.response?.data || error);
    res.status(500).json({
      error: "Ошибка при создании платежа",
      details: error.response?.data
    });
  }
};

