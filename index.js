const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// ENV переменные
const token = process.env.BOT_TOKEN;
const SHOP_ID = process.env.SHOP_ID;
const YOOKASSA_KEY = process.env.YOOKASSA_KEY;

if (!token) throw new Error("BOT_TOKEN отсутствует!");
if (!SHOP_ID || !YOOKASSA_KEY) throw new Error("ЮKassa ключи отсутствуют!");

const bot = new TelegramBot(token, { polling: false });

// Главная функция — вызывается webhook'ом Telegram
async function handleUpdate(update) {
  try {
    // команда /start
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;

      await bot.sendMessage(
        chatId,
        "Добро пожаловать! Чтобы получить доступ к секретным рецептам — нажмите кнопку:",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Оплатить доступ", callback_data: "PAY" }]
            ]
          }
        }
      );
    }

    // кнопки
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      // кнопка "Оплатить"
      if (data === "PAY") {
        const response = await axios.post(
          "https://cedric-desserts-access-bot.vercel.app/api/create-payment",
          { chatId }
        );

        const url = response.data.confirmation_url;

        await bot.sendMessage(
          chatId,
          `💳 Стоимость доступа: 1490 ₽\n\nПерейдите по ссылке для оплаты:\n${url}`
        );
      }
    }
  } catch (err) {
    console.error("Ошибка в handleUpdate:", err);
  }
}

module.exports = { handleUpdate };
