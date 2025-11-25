const TelegramBot = require("node-telegram-bot-api");

module.exports = async (req, res) => {
  try {
    const token = process.env.BOT_TOKEN;
    const bot = new TelegramBot(token);

    const body = req.body;

    if (body.event === "payment.waiting_for_capture") {
      return res.status(200).json({ ok: true });
    }

    if (body.event === "payment.succeeded") {
      const chatId = body.object.metadata.chatId;

      await bot.sendMessage(
        chatId,
        "🎉 Оплата прошла успешно!\n\nВот доступ к закрытому каналу:\nhttps://t.me/+8xj6svJzs0YzODcy"
      );

      return res.status(200).json({ ok: true });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Ошибка webhook ЮKassa:", err);
    res.status(500).json({ error: true });
  }
};

