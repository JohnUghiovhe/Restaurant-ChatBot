# Payment Issue Fixed - Deployment Checklist

## What Was Fixed

### 1. Environment Variables
- ✅ Fixed `.env` file: Changed `URL` to `FRONTEND_URL`
- ✅ Removed leading whitespace from environment variables

### 2. Enhanced Error Handling
- ✅ Added HTTP response status checking in frontend
- ✅ Error messages now display in chat instead of alerts
- ✅ Detailed error logging on both frontend and backend
- ✅ Better error messages from Paystack API

### 3. Configuration Logging
- ✅ Payment service now logs configuration on startup
- ✅ Added `/health` endpoint to verify configuration
- ✅ Payment initialization attempts are logged with details

### 4. Improved UX
- ✅ Users see error messages in chat window
- ✅ Loading message before redirect to Paystack
- ✅ Better validation for orders and amounts

## Deploy to Render - Step by Step

### Step 1: Set Environment Variables on Render

1. Go to https://dashboard.render.com
2. Select your web service (Restaurant Chatbot)
3. Click **"Environment"** in the left sidebar
4. Add these two variables:

   **Variable 1:**
   - Key: `PAYSTACK_SECRET_KEY`
   - Value: `sk_test_74ef5f0fe09b527de422d65dcbf48d5d67a92547`

   **Variable 2:**
   - Key: `FRONTEND_URL`
   - Value: Your Render URL (e.g., `https://restaurant-chatbot-xyz.onrender.com`)
   - ⚠️ **IMPORTANT**: Replace with your actual Render URL!

5. Click **"Save Changes"**
6. Render will automatically redeploy

### Step 2: Verify Configuration

After deployment completes:

1. Visit: `https://your-render-url.onrender.com/health`
2. You should see:
   ```json
   {
     "status": "ok",
     "environment": {
       "hasPaystackKey": true,
       "paystackKeyPrefix": "sk_test...",
       "frontendUrl": "https://your-render-url.onrender.com"
     }
   }
   ```

### Step 3: Check Render Logs

1. In Render dashboard, click **"Logs"** tab
2. Look for this line:
   ```
   Payment Service Configuration: {
     hasSecretKey: true,
     secretKeyPrefix: 'sk_test...',
     frontendUrl: 'https://your-render-url.onrender.com'
   }
   ```

If you see `hasSecretKey: false` or `frontendUrl: 'NOT SET'`, your environment variables are not configured correctly.

### Step 4: Test Payment Flow

1. Open your Render URL in a browser
2. Start a new order (option 1)
3. Add menu items (select numbers 1-4)
4. Checkout (option 99)
5. Enter your email
6. Check browser console (F12) for any errors
7. You should be redirected to Paystack payment page

## Troubleshooting on Render

### Error: "Paystack secret key is not configured"

**Cause**: Environment variable not set

**Solution**:
1. Go to Render → Environment
2. Make sure `PAYSTACK_SECRET_KEY` is added (no spaces)
3. Save and wait for redeploy

### Error: Payment initialization fails after entering email

**Cause**: Multiple possible reasons

**Check**:
1. Open browser console (F12) - look for error messages
2. Check Render logs for detailed error:
   ```
   Payment initialization error: { ... }
   ```
3. Visit `/health` endpoint to verify config
4. Ensure `FRONTEND_URL` matches your actual Render URL

### Error messages to look for in logs:

- **"Invalid response from Paystack"**: API key might be invalid
- **"Amount must be greater than 0"**: Order total is 0 or negative
- **"Order not found"**: Database/session issue
- **"Payment initialization failed: [Paystack error]"**: See the Paystack-specific error message

### Get Your Render URL

If you don't know your Render URL:
1. Go to Render dashboard
2. Click on your web service
3. At the top, you'll see the URL (e.g., `https://restaurant-chatbot-abc123.onrender.com`)
4. Copy this URL and use it for `FRONTEND_URL`

## Testing Locally

Your local setup is already working! The changes are deployed locally and you can test by:

1. Going to http://localhost:3000
2. Following the payment flow
3. Checking console for detailed logs

## Next Steps After Deployment

1. ✅ Verify `/health` endpoint shows correct configuration
2. ✅ Check Render logs for "Payment Service Configuration"
3. ✅ Test complete order and payment flow
4. ✅ Monitor Render logs while testing

## Need Help?

If payment still fails on Render:
1. Share the output from `/health` endpoint
2. Share relevant Render logs (specifically lines with "Payment")
3. Share browser console errors (F12 → Console tab)
4. I can help debug with this information
