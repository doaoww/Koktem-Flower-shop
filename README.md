# 🌸 Кокtem Flower Shop
Интернет-магазин цветов с полным циклом заказа — от каталога до уведомления администратора в Telegram.

## Демо
[flower-shop.vercel.app](https://flower-shop.vercel.app)

## Стек технологий
- **Next.js 15** (App Router)
- **React 19** (hooks, context, reducer)
- **TypeScript**
- **Tailwind CSS**
- **Telegram Bot API**

## Функциональность
- Каталог товаров с фильтрацией по категориям и поиском
- Карточка каждого товара с детальной страницей
- Корзина с управлением количеством (сохраняется в localStorage)
- Оформление заказа с валидацией формы
- Уведомление администратора о новом заказе через Telegram бот
- Скелетон-загрузка, обработка ошибок, адаптивный дизайн

## Структура проекта
```
src/
├── app/
│   ├── page.tsx              # Главная страница
│   ├── catalog/page.tsx      # Каталог товаров
│   ├── product/[id]/page.tsx # Страница товара
│   ├── cart/page.tsx         # Корзина
│   ├── checkout/page.tsx     # Оформление заказа
│   └── api/
│       ├── products/         # GET /api/products
│       └── orders/           # POST /api/orders
├── components/               # UI компоненты
├── context/                  # CartContext (useReducer)
├── lib/                      # Утилиты, Telegram helper
└── types/                    # TypeScript интерфейсы
```

## Запуск локально
1. Клонируй репозиторий:
```bash
git clone https://github.com/doaoww/Koktem-Flower-shop.git
cd Koktem-Flower-shop
```

2. Установи зависимости:
```bash
npm install
```

3. Создай `.env.local` в корне:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

4. Запусти:
```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

## Настройка Telegram уведомлений
1. Создай бота через [@BotFather](https://t.me/BotFather) → `/newbot`
2. Напиши своему боту любое сообщение
3. Получи `chat_id`: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Вставь токен и chat_id в `.env.local`

При каждом новом заказе в Telegram придёт сообщение с именем клиента, телефоном, адресом, составом заказа и суммой.

## Деплой

Проект задеплоен на [Vercel](https://vercel.com). Переменные окружения добавлены через Project Settings → Environment Variables.
