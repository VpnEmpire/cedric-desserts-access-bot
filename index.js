const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN отсутствует!");

const bot = new TelegramBot(token, { polling: false });

// Эта ссылка больше не работает, QuickPay отключён
// Вместо неё используем create-payment
// const PAY_LINK = "...";

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
              [
                {
                  text: "Оплатить доступ (1490 ₽)",
                  callback_data: "PAY"
                }
              ]
            ]
          }
        }
      );
    }

    // Кнопка Pay
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;

      // создаём оплату НА ТВОЁМ БЭКЕНДЕ
      const response = await axios.post(
        "https://cedric-desserts-access-bot.vercel.app/api/create-payment",
        { chatId }
      );

      const payUrl = response.data.confirmation_url;

      await bot.sendMessage(
        chatId,
        `Перейди по ссылке для оплаты:\n\n${payUrl}`
      );
    }
  } catch (err) {
    console.error("Ошибка обработки:", err);
  }
}

module.exports = { handleUpdate };
