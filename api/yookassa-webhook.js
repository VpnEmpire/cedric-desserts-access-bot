const TelegramBot = require("node-telegram-bot-api");

module.exports = async (req, res) => {
  try {
    const token = process.env.BOT_TOKEN;
    const bot = new TelegramBot(token, { polling: false });

    if (req.method !== "POST") return res.status(200).send("OK");

    const event = req.body;

    // Проверяем успешный платёж
    if (event.event === "payment.succeeded") {
      const chatId = event.object.metadata.chatId;

      await bot.sendMessage(
        chatId,
        "🎉 Платёж получен! Вот ссылка на закрытый канал с рецептами:\n\nhttps://t.me/+8xj6svJzs0YzODcy"
      );
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Ошибка webhook:", err);
    res.status(500).json({ ok: false });
  }
};
