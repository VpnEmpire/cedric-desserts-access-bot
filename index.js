const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN отсутствует!");

const bot = new TelegramBot(token, { polling: false });

// ТВОЯ РАБОЧАЯ ССЫЛКА ЮМАНИ
const PAY_LINK = "https://yoomoney.ru/quickpay/confirm.xml?receiver=301100784648&quickpay-form=shop&targets=Оплата%20доступа&paymentType=AC&sum=1490";

async function handleUpdate(update) {
  try {
    // Команда /start
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;

      await bot.sendMessage(
        chatId,
        "Добро пожаловать! Чтобы получить доступ к секретным рецептам — нажми кнопку ниже:",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Оплатить доступ (1490 ₽)", url: PAY_LINK }]
            ]
          }
        }
      );
    }

    // Webhook обрабатывает только уведомления о платеже
    if (update && update.object) {
      // Здесь будет обработка Webhook ЮMoney — добавим позже
      console.log("Получен webhook от ЮMoney:", update);
    }
  } catch (err) {
    console.error("Ошибка обработки:", err);
  }
}

module.exports = { handleUpdate };
