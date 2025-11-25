const TelegramBot = require('node-telegram-bot-api');

const token = '8511041890:AAGm0cQDDfQ4iiC0RjA4A2kc5AHYMlsbnxY';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! 🎂 Чтобы получить доступ к секретным рецептам — нажмите кнопку "Оплатить доступ".');
});
