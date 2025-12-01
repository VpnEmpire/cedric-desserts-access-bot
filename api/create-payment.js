export default async function handler(req, res) {
  try {
    const { chatId } = req.body;

    // ✔ ТВОЯ РАБОЧАЯ ССЫЛКА ДЛЯ ОПЛАТЫ (НЕ API, БЕЗ ОШИБОК)
    const PAY_LINK = "https://yoomoney.ru/quickpay/confirm.xml?receiver=1167570&quickpay-form=shop&targets=Оплата%20доступа&paymentType=AC&sum=1490";

    res.status(200).json({
      confirmation_url: PAY_LINK
    });

  } catch (error) {
    console.error("create-payment error:", error);
    res.status(500).json({ error: "server_error" });
  }
}
