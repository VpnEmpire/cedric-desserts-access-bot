const TelegramBot = require("node-telegram-bot-api");

// Токен берём из переменной окружения Vercel
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN не найден! Задай его в настройках Vercel.");
}

// Вебхук — polling отключён
const bot = new TelegramBot(token, { polling: false });

// Эту функцию вызывает webhook.js
async function handleUpdate(update) {
  try {
    // /start
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;

      await bot.sendMessage(
        chatId,
        "Добро пожаловать! Чтобы получить доступ к секретным рецептам Седрика и другим десертам, нажми кнопку ниже:",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Оплатить доступ", callback_data: "HOW_TO_PAY" }]
            ]
          }
        }
      );
    }

    // Нажатие на кнопку
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      if (data === "HOW_TO_PAY") {
        await bot.sendMessage(
          chatId,
          "Для оплаты перейди по ссылке (ЮKassa / бот / сайт — сюда вставишь свою оплату):\n\n" +
          "https://t.me/cedric_desserts_access_bot\n\n" +
          "После оплаты я дам тебе доступ в закрытый канал с рецептами. ❤️"
        );
      }
    }
  } catch (error) {
    console.error("Ошибка в handleUpdate:", error);
  }
}

module.exports = { handleUpdate };
