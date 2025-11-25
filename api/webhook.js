import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN отсутствует в переменных окружения!");
}

const bot = new TelegramBot(token, { polling: false });

// 🔥 Главная функция для Vercel
export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const update = req.body;

      if (update.message && update.message.text === "/start") {
        const chatId = update.message.chat.id;
        bot.sendMessage(
          chatId,
          "Добро пожаловать! Чтобы получить доступ к секретным рецептам, нажмите кнопку “Оплатить доступ”",
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Оплатить доступ", callback_data: "PAY" }]
              ]
            }
          }
        );
      }

      if (update.callback_query) {
        const chatId = update.callback_query.message.chat.id;
        const data = update.callback_query.data;

        if (data === "PAY") {
          bot.sendMessage(
            chatId,
            "Для оплаты перейдите по ссылке ЮKassa (мы подключим позже)\n➡️ Например: https://example.com/pay"
          );
        }
      }

      return res.status(200).json({ ok: true });
    }

    res.status(200).send("Webhook работает.");
  } catch (error) {
    console.error("Ошибка webhook:", error);
    res.status(500).json({ error: error.message });
  }
}
