🌸 Кокtem Flower Shop

> A full-stack flower shop e-commerce web application built as a portfolio project. Features AI-powered bouquet consultation, Google authentication, real-time order tracking, and instant Telegram notifications for the shop administrator.

🔗 **Live:** [koktem-flower-shop.vercel.app](https://koktem-flower-shop.vercel.app)

---

## 📖 How the Website Works

### For Customers

**1. Browse the Catalog**
Visit `/catalog` to explore 20+ flower arrangements, bouquets, plants, and gift sets. Filter by category (Bouquets, Single Flowers, Plants, Gifts) and by occasion (Birthday, Date, Sorry, Mom, Wedding). Use the search bar to find products by name. Each product card shows the price, a "Best Seller" badge if applicable, and an out-of-stock overlay.

**2. Get AI Recommendations**
Click the 💬 floating button in the bottom-right corner to open the AI Floral Consultant — powered by Google Gemini. Describe what you're looking for in plain language:
> *"Something gentle for a girl who loves minimalism and pastel tones"*

The AI knows the full catalog and will suggest specific products with prices.

**3. Add to Cart & Wishlist**
- Click **"В корзину"** on any card to add it to your cart. The navbar updates instantly with the item count.
- Click the ❤️ icon to save a product to your Wishlist for later.
- Cart state persists in `localStorage` — items stay even after refreshing the page.
- Wishlist is stored in `localStorage` for guests, and linked to your account when signed in.

**4. Sign In (Optional but Recommended)**
Click **"Войти"** in the navbar to sign in with Google. After signing in:
- Your name, phone, and delivery address are saved to your profile at `/profile`
- These details auto-fill the checkout form on your next order
- Your orders are linked to your account

**5. Place an Order**
Go to `/cart` and click **"Оформить заказ"**. Fill in the checkout form at `/checkout`:
- Full name
- Phone number (validated — must be 11 digits, Kazakh or Russian format)
- Delivery address (validated — must include city, street, and apartment)
- Delivery date (today or future only)
- Delivery time slot (morning / afternoon / evening)
- Optional card message (up to 120 characters)
- Optional comment for the courier

Click **"Подтвердить заказ"** — the order is saved to the database and the shop admin instantly receives a Telegram notification with all order details.

**6. Track Your Order**
After placing an order, you are redirected to `/order/[id]` — a live status page that refreshes every 30 seconds:

✅ Заказ принят
✅ Собираем букет
🚚 Курьер в пути     ← current status
⬜ Доставлено
---

### For the Shop Administrator

**Telegram Notifications**
Every new order triggers an instant message to the admin's Telegram:

```
🌸 НОВЫЙ ЗАКАЗ #A3F2B1

👤 Клиент: Айгерим Сейткали
📞 Телефон: +7 (777) 123-45-67
📍 Адрес: Алматы, ул. Абая 10, кв. 5
📅 Дата доставки: 28.04.2026 · 12:00–15:00
💬 Комментарий: Красивую упаковку, пожалуйста

🛒 Состав заказа:
  • Букет «Розовая нежность» × 1 — 8 500 ₸

💰 Итого: 8 500 ₸
🕐 Время заказа: 27.04.2026, 14:32

**Updating Order Status**
Use the admin API to move an order through delivery stages:

```bash
curl -X PATCH https://your-site.vercel.app/api/admin/orders/A3F2B1 \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your-admin-secret" \
  -d '{"status": "DELIVERING"}'
```

Statuses: `PENDING` → `PREPARING` → `DELIVERING` → `DELIVERED`

The customer's tracking page updates automatically.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma |
| Auth | NextAuth v5 + Google OAuth |
| AI | Google Gemini 2.5 Flash Lite |
| Notifications | Telegram Bot API |
| Deployment | Vercel |

---

## ✨ Features

- 🗂 Catalog with category + occasion filters and live search
- 🤖 AI floral consultant (Gemini) — recommends products from real catalog
- 🛒 Shopping cart — quantity controls, persisted in `localStorage`
- ❤️ Wishlist — save products for later
- 🔐 Google OAuth authentication via NextAuth v5
- 👤 User profile — saved name, phone, address; auto-fills checkout
- 📋 Checkout form with full client-side validation
- 📦 Order saved to PostgreSQL (Neon) via Prisma
- 📲 Instant Telegram notification to admin on new order
- 📍 Real-time order status tracker (polls every 30s)
- 💳 Admin API to update delivery status with secret key auth
- 💀 Loading skeletons for async content
- 📱 Fully responsive, mobile-first design

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Home — hero, benefits, featured products
│   ├── catalog/page.tsx           # Catalog with filters and search
│   ├── product/[id]/page.tsx      # Product detail page
│   ├── cart/page.tsx              # Shopping cart
│   ├── checkout/page.tsx          # Checkout form with validation
│   ├── order/[id]/page.tsx        # Live order status tracker
│   ├── wishlist/page.tsx          # Saved favorites
│   ├── profile/page.tsx           # User profile editor
│   └── api/
│       ├── products/              # GET /api/products, /api/products/[id]
│       ├── orders/                # POST /api/orders, GET /api/orders/[id]
│       ├── admin/orders/[id]/     # PATCH — update order status
│       ├── ai-consultant/         # POST — Gemini AI chat
│       ├── user/profile/          # GET / PATCH — user profile
│       └── auth/[...nextauth]/    # NextAuth route handlers
├── components/
│   ├── Navbar.tsx                 # Sticky nav with cart + wishlist counters
│   ├── Footer.tsx
│   ├── ProductCard.tsx            # Card with add-to-cart + wishlist toggle
│   ├── ProductSkeleton.tsx        # Animated loading skeleton
│   ├── FrequentlyBought.tsx       # Add-on products section on product page
│   ├── AiConsultant.tsx           # Floating Gemini chat widget
│   ├── AuthButton.tsx             # Google sign-in / sign-out dropdown
│   └── SessionProviderWrapper.tsx # Client-side NextAuth session provider
├── context/
│   ├── CartContext.tsx            # Global cart — useReducer + localStorage
│   └── WishlistContext.tsx        # Global wishlist — useReducer + localStorage
├── lib/
│   ├── prisma.ts                  # Prisma singleton (prevents hot-reload issues)
│   └── telegram.ts                # Telegram sendMessage helper
├── types/
│   ├── index.ts                   # Product, Order, CartItem, Category, Occasion
│   └── next-auth.d.ts             # Extends Session with user.id
└── data/
    └── products.json              # 20 products used for database seeding
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js 18+
- A PostgreSQL database — free tier at [neon.tech](https://neon.tech)
- Google Cloud project with OAuth 2.0 credentials
- Telegram bot token from [@BotFather](https://t.me/BotFather)
- Google AI Studio API key from [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/doaoww/Koktem-Flower-shop.git
cd Koktem-Flower-shop
npm install
```

### 2. Configure environment variables

Create `.env.local`:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...your-neon-connection-string...

# NextAuth
NEXTAUTH_SECRET=your-random-32-char-string
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=your-chat-id

# Google Gemini AI (aistudio.google.com)
GEMINI_API_KEY=your-gemini-api-key

# Admin API
ADMIN_SECRET=your-chosen-secret-key
```

Create `.env` (required for Prisma CLI tools):

```env
DATABASE_URL=postgresql://...same-connection-string...
```

### 3. Set up the database

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub (`.env.local` is git-ignored — secrets are safe)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Add all environment variables under **Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon connection string |
| `NEXTAUTH_SECRET` | 32-char random string |
| `NEXTAUTH_URL` | `https://your-site.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console |
| `TELEGRAM_BOT_TOKEN` | From BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | Your Telegram chat ID |
| `GEMINI_API_KEY` | Google AI Studio |
| `ADMIN_SECRET` | Your chosen key |

4. In Google Cloud Console add your Vercel URL to authorized redirect URIs:
```
https://your-site.vercel.app/api/auth/callback/google
```

5. Click **Deploy**

---

## 🗂 Managing Products

**Prisma Studio** — visual database UI, no code needed:
```bash
npx prisma studio
# Opens at localhost:5555
```

**Re-seed** after editing `prisma/seed.ts`:
```bash
npx prisma db seed
```

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed database with products
```

---

## 👩‍💻 Author

**doaoww** — [github.com/doaoww](https://github.com/doaoww)

Built as a full-stack portfolio project demonstrating Next.js App Router, TypeScript, Prisma ORM, NextAuth, AI integration, and real-world e-commerce patterns.
```

```bash
git add README.md
git commit -m "docs: comprehensive README with how it works section"
git push
```