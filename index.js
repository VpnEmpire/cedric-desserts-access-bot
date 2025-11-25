const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN; 
if (!token) {
  throw new Error("Нет переменной окружения BOT_TOKEN!");
}

// создаём бота БЕЗ polling — только webhook
const bot = new TelegramBot(token, { polling: false });

// Главная обработка webhook
async function handleUpdate(update) {
  try {
    if (update.message) {
      const chatId = update.message.chat.id;

      if (update.message.text === "/start") {
        await bot.sendMessage(
          chatId,
          "Добро пожаловать! 🎂\nЧтобы получить доступ к секретным десертам — нажмите кнопку ниже.",
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Оплатить доступ", callback_data: "HOW_TO_PAY" }]
              ]
            }
          }
        );
      }
    }

    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;

      if (update.callback_query.data === "HOW_TO_PAY") {
        await bot.sendMessage(
          chatId,
          "Чтобы оплатить доступ, перейдите по ссылке 👇\n(тут позже добавим Юкассу)"
        );
      }
    }
  } catch (error) {
    console.error("Ошибка в handleUpdate:", error);
  }
}

module.exports = { handleUpdate };
