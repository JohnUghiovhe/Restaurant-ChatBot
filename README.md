# Restaurant Chatbot

A TypeScript/NestJS-based restaurant chatbot that assists customers in placing orders for their preferred meals. The chatbot provides an interactive chat interface where customers can browse menu items, place orders, view order history, and make payments via Paystack.

## Features

- 💬 Interactive chat interface
- 🍽️ Menu browsing and item selection
- 🛒 Order management (place, view, cancel)
- 📜 Order history
- 💳 Paystack payment integration
- 📅 Optional order scheduling
- 🔒 Device-based session management (no authentication required)
- ✅ Input validation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Paystack test account (for payment integration)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Paystack secret key:
```
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
FRONTEND_URL=http://localhost:3000
```

## Running the Application

1. Start the development server:
```bash
npm run start:dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Chatbot Options

When you land on the chatbot page, you'll see the following options:

- **Select 1** - Place an order (browse menu items)
- **Select 99** - Checkout order
- **Select 98** - See order history
- **Select 97** - See current order
- **Select 0** - Cancel order

### Placing an Order

1. Select option `1` to view available menu items
2. Select a menu item by its number
3. The item will be added to your current order
4. You can add more items or proceed to checkout

### Checkout and Payment

1. Select option `99` to checkout your order
2. If you have items in your cart, the order will be placed
3. You'll be prompted to enter your email for payment
4. You'll be redirected to Paystack to complete the payment
5. After successful payment, you'll be redirected back with a confirmation

### Viewing Orders

- **Select 98** - View all your placed orders (order history)
- **Select 97** - View your current pending order

### Canceling Orders

- **Select 0** - Cancel your current pending order

## API Endpoints

### Chat
- `POST /chat/message` - Send a message to the chatbot
- `GET /chat/init/:deviceId` - Initialize chat session

### Orders
- `GET /orders/current/:sessionId` - Get current order
- `POST /orders/add-item` - Add item to order
- `POST /orders/checkout/:sessionId` - Checkout order
- `POST /orders/cancel/:sessionId` - Cancel order
- `GET /orders/history/:sessionId` - Get order history
- `POST /orders/schedule` - Schedule an order

### Menu
- `GET /menu` - Get all menu items
- `GET /menu/:id` - Get specific menu item

### Payment
- `POST /payment/initialize` - Initialize payment
- `GET /payment/verify?reference=xxx` - Verify payment

## Database

The application uses SQLite database (stored as `restaurant.db`). The database is automatically created and seeded with sample menu items on first run.

## Project Structure

```
restaurant-chatbot/
├── src/
│   ├── entities/          # Database entities
│   ├── chat/              # Chat module
│   ├── order/             # Order module
│   ├── menu/              # Menu module
│   ├── payment/           # Payment module
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── public/                # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .env.example           # Environment variables template
└── README.md
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Typed JavaScript
- **TypeORM** - ORM for database operations
- **SQLite** - Lightweight database
- **Paystack** - Payment gateway
- **HTML/CSS/JavaScript** - Frontend interface

## Testing with Paystack

1. Get your test API keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
2. Use test card numbers:
   - **Card Number**: 4084084084084081
   - **CVV**: 408
   - **Expiry**: Any future date
   - **PIN**: 0000
   - **OTP**: 123456

## License

ISC

## Author