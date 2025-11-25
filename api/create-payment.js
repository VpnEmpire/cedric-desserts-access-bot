const YooKassa = require("yookassa");

const shopId = process.env.SHOP_ID;
const secretKey = process.env.YOOKASSA_KEY;

const yoo = new YooKassa({ shopId, secretKey });

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { chatId } = req.body;

    const payment = await yoo.createPayment({
      amount: {
        value: "1490.00",
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: "https://t.me/cedric_desserts_access_bot",
      },
      description: `Оплата доступа (chatId ${chatId})`,
      metadata: { chatId },
    });

    res.status(200).json({
      confirmation_url: payment.confirmation.confirmation_url,
    });
  } catch (e) {
    console.error("Ошибка создания платежа:", e);
    return res.status(500).json({ error: true });
  }
};
