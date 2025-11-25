const TelegramBot = require("node-telegram-bot-api");

// ENV-переменные из Vercel
const token = process.env.BOT_TOKEN;
const SHOP_ID = process.env.SHOP_ID;
const YOOKASSA_KEY = process.env.YOOKASSA_KEY;
const SECRET_WEBHOOK_KEY = process.env.SECRET_WEBHOOK_KEY;

if (!token) throw new Error("BOT_TOKEN не найден!");

const bot = new TelegramBot(token, { polling: false });

// URL юкассы для оплаты
const PAY_LINK = `https://yoomoney.ru/quickpay/confirm.xml?receiver=${SHOP_ID}&quickpay-form=donate&targets=Оплата%20доступа%20к%20рецептам&paymentType=AC&sum=500`;

const PRIVATE_CHANNEL_LINK = "https://t.me/+8xj6svJzs0YzODcy"; // закрытый канал


// ================== ОБРАБОТКА ОБНОВЛЕНИЙ ОТ TELEGRAM ==================
async function handleUpdate(update) {
  try {
    // /start
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;

      await bot.sendMessage(
        chatId,
        "Добро пожаловать! Чтобы получить доступ к секретным рецептам, нажми кнопку ниже:",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Оплатить доступ", callback_data: "HOW_TO_PAY" }]
            ]
          }
        }
      );
    }

    // Нажатие кнопки
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      if (data === "HOW_TO_PAY") {
        await bot.sendMessage(
          chatId,
          `Для оплаты перейди по ссылке ниже:\n\n💳 *Стоимость: 500₽*\n\n${PAY_LINK}\n\nПосле успешной оплаты бот сам проверит платёж и выдаст доступ ❤️`,
          { parse_mode: "Markdown" }
        );
      }
    }
  } catch (err) {
    console.error("Ошибка handleUpdate:", err);
  }
}


// ================== ОБРАБОТКА WEBHOOK ЮКАССЫ ==================
async function handlePaymentWebhook(req, res) {
  try {
    // Проверяем секретный ключ
    if (req.headers["x-secret"] !== SECRET_WEBHOOK_KEY) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const event = req.body;

    // Юкасса прислала подтверждение
    if (event.event === "payment.succeeded") {
      const chatId = event.object.metadata.chat_id;

      await bot.sendMessage(
        chatId,
        "🎉 Платёж успешно подтверждён!\n\nВот ссылка в закрытый канал:",
      );

      await bot.sendMessage(chatId, PRIVATE_CHANNEL_LINK);

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Ошибка в платежном webhook:", err);
    return res.status(500).json({ ok: false });
  }
}


module.exports = { handleUpdate, handlePaymentWebhook };
