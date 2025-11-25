const TelegramBot = require("node-telegram-bot-api");

// — переменные из Vercel (у тебя они уже добавлены)
const token = process.env.BOT_TOKEN;

if (!token) throw new Error("BOT_TOKEN не найден!");

const bot = new TelegramBot(token, { polling: false });

// Ссылка на оплату (1490₽ — фиксированно)
const PAY_LINK = "https://pay.yookassa.ru/quickpay/button?shopId=1167570&sum=1490&label=access";

const PRIVATE_CHANNEL_LINK = "https://t.me/+8xj6sv0hZpY1Mzcy";

// Обработка Telegram обновлений
async function handleUpdate(update) {
  try {
    // Команда /start
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;

      await bot.sendMessage(
        chatId,
        "Добро пожаловать! Чтобы получить доступ к секретным рецептам Cedric Grolet, нажми кнопку ниже:",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Оплатить доступ", callback_data: "PAY" }]
            ]
          }
        }
      );
    }

    // Нажатие на кнопку "Оплатить доступ"
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      if (data === "PAY") {
        await bot.sendMessage(
          chatId,
          "💳 Стоимость доступа: *1490₽*\n\nПерейди по ссылке для оплаты:👇",
          {
            parse_mode: "Markdown",
          }
        );

        await bot.sendMessage(chatId, PAY_LINK);

        await bot.sendMessage(
          chatId,
          "После успешной оплаты бот сам проверит платёж и выдаст доступ ❤️"
        );
      }
    }
  } catch (error) {
    console.error("Ошибка в handleUpdate:", error);
  }
}

module.exports = { handleUpdate };
