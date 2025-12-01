const TelegramBot = require("node-telegram-bot-api");

// === ТВОЙ ТОКЕН БОТА ===
const BOT_TOKEN = "8511041890:AAGm0cQDDfQ4iiCORjA4A2kc5AHYMlsbnxY";

// Telegram сам использует ЮKassa Live, привязанную через BotFather
const PROVIDER_TOKEN = "Yookassa";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// --- START ---
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

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
});

// --- Нажатие кнопки ---
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "PAY") {
    await bot.sendInvoice(
      chatId,
      "Оплата доступа",
      "После успешной оплаты доступ откроется автоматически ❤️",
      "cedric_access_1490",      // payload
      PROVIDER_TOKEN,            // Telegram → ЮKassa
      "cedric-desserts",         // provider_data
      "RUB",
      [
        {
          label: "Доступ к рецептам",
          amount: 149000 // 1490₽
        }
      ]
    );
  }
});

// --- Проверка перед оплатой ---
bot.on("pre_checkout_query", async (query) => {
  await bot.answerPreCheckoutQuery(query.id, true);
});

// --- Успешная оплата ---
bot.on("successful_payment", async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    "🎉 Спасибо за оплату! Доступ открыт.\n\nВот ссылка:\n👉 https://t.me/c/…"
  );
});
