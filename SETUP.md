# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the Application**
   ```bash
   npm run start:dev
   ```

4. **Access the Application**
   Open your browser and navigate to: `http://localhost:3000`

## Paystack Configuration

1. Sign up for a Paystack account at https://paystack.com
2. Go to Settings > API Keys & Webhooks
3. Copy your Test Secret Key
4. Add it to your `.env` file as `PAYSTACK_SECRET_KEY`

## Testing Payments

Use these test card details:
- **Card Number**: 4084084084084081
- **CVV**: 408
- **Expiry**: Any future date (e.g., 12/25)
- **PIN**: 0000
- **OTP**: 123456

## Features Implemented

✅ Chat interface with device-based session management
✅ Menu browsing and item selection
✅ Order placement and management
✅ Order history viewing
✅ Current order viewing
✅ Order cancellation
✅ Paystack payment integration
✅ Payment success notification
✅ Order scheduling (optional feature)
✅ Input validation

## Project Structure

- `src/` - Backend NestJS application
  - `entities/` - Database entities
  - `chat/` - Chat module (main chatbot logic)
  - `order/` - Order management module
  - `menu/` - Menu management module
  - `payment/` - Payment integration module
- `public/` - Frontend files (HTML, CSS, JavaScript)
- `restaurant.db` - SQLite database (auto-created)

## API Endpoints

### Chat
- `POST /chat/message` - Send message to chatbot
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
- `GET /payment/callback?reference=xxx` - Payment callback

## Troubleshooting

1. **Database errors**: Delete `restaurant.db` and restart the application
2. **Payment errors**: Verify your Paystack secret key in `.env`
3. **Port already in use**: Change port in `src/main.ts` or kill the process using port 3000
