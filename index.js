const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// =======================
// ENV (только из Vercel!)
// =======================
const BOT_TOKEN = process.env.BOT_TOKEN;
const SHOP_ID = process.env.SHOP_ID;
const YOOKASSA_KEY = process.env.YOOKASSA_KEY;
const ACCESS_CHANNEL = process.env.ACCESS_CHANNEL;   // например: -1001234567890

if (!BOT_TOKEN || !SHOP_ID || !YOOKASSA_KEY) {
  throw new Error("❌ Не заполнены ENV переменные в Vercel!");
}

// Запуск бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// =======================
// /start
// =======================
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    "Добро пожаловать! Чтобы получить доступ к секретным рецептам — нажми кнопку ниже:",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Оплатить доступ (1490 ₽)", callback_data: "pay" }]
        ]
      }
    }
  );
});

// =======================
// Обработка кнопки
// =======================
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "pay") {
    try {
      // Создание платежа в ЮKassa
      const payment = await axios.post(
        "https://api.yookassa.ru/v3/payments",
        {
          amount: {
            value: "1490.00",
            currency: "RUB"
          },
          confirmation: {
            type: "redirect",
            return_url: "https://t.me/" + query.message.chat.username
          },
          capture: true,
          description: `Оплата доступа (chatId ${chatId})`,
          metadata: { chatId }
        },
        {
          auth: {
            username: SHOP_ID,
            password: YOOKASSA_KEY
          }
        }
      );

      const url = payment.data.confirmation.confirmation_url;

      await bot.sendMessage(
        chatId,
        `Для оплаты перейди по ссылке ниже:\n\n${url}`
      );

    } catch (err) {
      console.error("Ошибка при создании платежа:", err.response?.data || err);
      await bot.sendMessage(chatId, "⚠ Ошибка при создании платежа.");
    }
  }
});

// =======================
// Добавление в закрытый канал
// (вызывается из вебхука на Vercel)
// =======================

async function giveAccess(chatId) {
  try {
    await bot.sendMessage(chatId, "🎉 Оплата подтверждена! Доступ открыт.");

    await bot.inviteChatMember(ACCESS_CHANNEL, chatId);

    await bot.sendMessage(
      chatId,
      `👉 Переходи в закрытый канал:\nhttps://t.me/${ACCESS_CHANNEL.replace("-100", "")}`
    );
  } catch (e) {
    console.error("Ошибка добавления в канал:", e);
  }
}

module.exports = { bot, giveAccess };
