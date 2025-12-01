const TelegramBot = require("node-telegram-bot-api");

// === ТВОЙ ТОКЕН БОТА ===
const BOT_TOKEN = "8511041890:AAGm0cQDDfQ4iiCORjA4A2kc5AHYMlsbnxY";

// Создаём бота (polling)
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// === Telegram сам применяет ЮKassa Live, которую ты привязала через BotFather ===
const PROVIDER_TOKEN = "Yookassa"; // НЕ МЕНЯТЬ

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    "Добро пожаловать! Чтобы получить доступ к секретным рецептам — нажми кнопку ниже:"
  );

  await bot.sendInvoice(
    chatId,
    "Оплата доступа",
    "После успешной оплаты доступ будет предоставлен автоматически ❤️",
    "cedric_access_1490",           // payload — любой уникальный ID
    PROVIDER_TOKEN,                 // Telegram сам подставляет твой yookassa key
    "cedric-desserts",              // название провайдера (любое)
    "RUB",                          // валюта
    [
      {
        label: "Доступ к рецептам",
        amount: 149000              // 1490₽ → 1490 * 100
      }
    ],
    {
      need_name: false,
      need_phone_number: false,
      need_email: false,
      need_shipping_address: false,
      send_phone_number_to_provider: false,
      send_email_to_provider: false
    }
  );
});

// Подтверждение перед оплатой
bot.on("pre_checkout_query", async (query) => {
  await bot.answerPreCheckoutQuery(query.id, true);
});

// Успешная оплата
bot.on("successful_payment", async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    "🎉 Спасибо за оплату!\n\nВаш доступ к секретным рецептам открыт:\n👉 https://t.me/c/… (вставь свою ссылку)"
  );
});
