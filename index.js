const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ACCESS_CHANNEL = process.env.ACCESS_CHANNEL; // например: -1002359874567

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// /start
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

// Нажатие кнопки
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "pay") {
    try {
      const res = await axios.post(
        "https://cedric-desserts-access-bot.vercel.app/api/create-payment",
        { chatId }
      );

      await bot.sendMessage(chatId, `Перейдите для оплаты:\n${res.data.url}`);
    } catch (e) {
      console.error(e);
      await bot.sendMessage(chatId, "Ошибка при создании платежа.");
    }
  }
});

// Вызывается вебхуком после оплаты
async function giveAccess(chatId) {
  try {
    await bot.sendMessage(chatId, "🎉 Оплата подтверждена! Доступ открыт.");

    await bot.sendMessage(
      chatId,
      "Вот ссылка на закрытый канал:\nhttps://t.me/c/XXXXXXXXXX"
    );

    // Если хочешь автодобавление:
    await bot.inviteChatMember(ACCESS_CHANNEL, chatId);
  } catch (err) {
    console.error("Ошибка выдачи доступа:", err);
  }
}

module.exports = { bot, giveAccess };
