# Restaurant Chatbot

A restaurant ordering chatbot built with **NestJS (TypeScript)** on the backend and a simple **HTML/CSS/JavaScript** frontend. It lets users browse menu items, place and manage orders, and complete payment via Paystack.

## Tech Stack

- **Backend framework:** NestJS 11
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** SQLite
- **Validation:** class-validator + class-transformer
- **Payments:** Paystack (via Axios)
- **Frontend:** Static HTML/CSS/Vanilla JavaScript

## Features

- Interactive chat-based ordering flow
- Menu browsing and item selection by number
- After each item added, the menu remains visible for continued selection
- Quick shortcuts while ordering:
   - `99` checkout order
   - `97` view current order
   - `98` view order history
   - `0` cancel order
- Device-based session tracking (no login required)
- Paystack payment initialization and verification
- Render deployment support with health/config endpoint

## Prerequisites

- Node.js 18+ (recommended)
- npm
- Paystack account (test key for development)

## Environment Variables

Create a `.env` file in the project root and set:

```env
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
FRONTEND_URL=http://localhost:3000
PORT=3000
```

### Notes

- `PAYSTACK_SECRET_KEY` is required for payment initialization.
- `FRONTEND_URL` should be your deployed URL in production (for example, Render URL).
- On Render, set these values in the service Environment tab.

## Installation

```bash
npm install
```

## Running the App

- Development (watch mode):

```bash
npm run start:dev
```

- Build:

```bash
npm run build
```

- Production:

```bash
npm run start:prod
```

- Optional local ts-node + nodemon script:

```bash
npm run dev:nodemon
```

Open the app at `http://localhost:3000`.

## Chat Flow

When the chatbot starts, use:

- `1` → place an order (show menu)
- `99` → checkout
- `98` → order history
- `97` → current order
- `0` → cancel current order

### Ordering Behavior

After each successful item selection:

- item is added to current order,
- order summary is shown,
- full menu is shown again,
- user can continue selecting items or use shortcuts.

## API Endpoints

### App

- `GET /` - Serve chatbot UI
- `GET /health` - Health and runtime config status

### Chat

- `POST /chat/message` - Process chat message
- `GET /chat/init/:deviceId` - Initialize session
- `POST /chat/payment/initialize` - Initialize payment for placed order
- `POST /chat/schedule` - Schedule an order

### Orders

- `GET /orders/current/:sessionId`
- `POST /orders/add-item`
- `POST /orders/checkout/:sessionId`
- `POST /orders/cancel/:sessionId`
- `GET /orders/history/:sessionId`
- `POST /orders/schedule`

### Menu

- `GET /menu`
- `GET /menu/:id`

### Payment

- `POST /payment/initialize`
- `GET /payment/verify?reference=...`
- `GET /payment/callback?reference=...`

## Project Structure

```text
src/
   app.module.ts
   main.ts
   app.controller.ts
   chat/
   order/
   menu/
   payment/
   entities/
public/
   index.html
   styles.css
   app.js
restaurant.db
```

## Deployment (Render)

1. Deploy the service.
2. Set environment variables:
    - `PAYSTACK_SECRET_KEY`
    - `FRONTEND_URL` (your Render app URL)
3. Redeploy and verify:
    - `GET /health`
    - payment initialization logs in Render

For deployment troubleshooting details, see `DEPLOYMENT_CHECKLIST.md`.

## Paystack Test Card

- Card Number: `4084084084084081`
- CVV: `408`
- Expiry: any future date
- PIN: `0000`
- OTP: `123456`

## License

ISC