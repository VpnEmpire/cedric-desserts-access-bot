const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// ENV
const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN отсутствует!");

// Создаём бота (webhook режим)
const bot = new TelegramBot(token, { polling: false });

async function handleUpdate(update) {
  try {
    // /start
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;

      await bot.sendMessage(
        chatId,
        "Добро пожаловать! Чтобы получить доступ к секретным рецептам — нажми кнопку ниже:",
        {
        reply_markup: {
            inline_keyboard: [
              [{ text: "Оплатить доступ (1490 ₽)", callback_data: "PAY" }]
            ]
          }
        }
      );
    }

    // Нажатие кнопки
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      if (data === "PAY") {
        const response = await axios.post(
          "https://cedric-desserts-access-bot.vercel.app/api/create-payment",
          { chatId }
        );
        
        await bot.sendMessage(
          chatId,
          `Для оплаты перейди по ссылке ниже:\n\n${response.data.confirmation_url}`
        );
      }
    }
  } catch (err) {
    console.error("Ошибка обработки:", err);
  }
}

module.exports = { bot, handleUpdate };