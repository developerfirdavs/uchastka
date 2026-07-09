import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
import asyncio

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация
bot = Bot(token="8313431544:AAFrdPHMZJUUGdbdmPlI7M3XvP51rMvjbTA")  # Замените на реальный токен
dp = Dispatcher()

@dp.message(Command("chatid"))
async def cmd_chatid(message: types.Message):
    chat_info = (
        f"🆔 Chat ID: <code>{message.chat.id}</code>\n"
        f"💬 Тип чата: {message.chat.type}\n"
        f"👤 Имя: {message.chat.first_name or message.chat.title}"
    )
    await message.reply(chat_info, parse_mode="HTML")

async def main():
    await dp.start_polling(bot, skip_updates=True)

if __name__ == "__main__":
    asyncio.run(main())
