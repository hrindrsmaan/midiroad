# Email Setup Guide

Your checkout is working, but emails aren't being sent because the webhook and email service aren't configured yet. Follow these steps:

## 1. Set up Resend (Email Service)

1. **Sign up for Resend:**
   - Go to https://resend.com/signup
   - Create a free account

2. **Get your API key:**
   - Go to https://resend.com/api-keys
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Update `.env`:**
   ```
   RESEND_API_KEY=re_your_actual_key_here
   ```

## 2. Set up Stripe Webhook for Local Development

You have two options:

### Option A: Use Stripe CLI (Recommended for Testing)

1. **Install Stripe CLI:**

   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe:**

   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

   This will output a webhook signing secret like `whsec_...`

4. **Copy the webhook secret to `.env`:**

   ```
   STRIPE_WEBHOOK_SECRET=whsec_the_secret_from_stripe_cli
   ```

5. **Keep the `stripe listen` command running** in a separate terminal while testing.

6. **Restart your Next.js dev server** to load the new environment variables.

### Option B: Use ngrok (For Public Testing)

1. **Install ngrok:**

   ```bash
   brew install ngrok
   ```

2. **Start ngrok:**

   ```bash
   ngrok http 3000
   ```

3. **Configure webhook in Stripe Dashboard:**
   - Go to https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Enter your ngrok URL + `/api/webhook` (e.g., `https://abc123.ngrok.io/api/webhook`)
   - Select event: `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the "Signing secret" and add it to `.env`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
     ```

4. **Update BASE_URL in `.env`:**

   ```
   BASE_URL=https://abc123.ngrok.io
   ```

5. **Restart your Next.js dev server**

## 3. Test the Complete Flow

1. Make sure both your Next.js server and Stripe CLI (if using Option A) are running
2. Complete a test purchase at http://localhost:3000
3. Check your terminal for webhook logs
4. Check the email address used in checkout for the delivery email

## Troubleshooting

- **No webhook events received:** Make sure `stripe listen` is running
- **Webhook signature verification failed:** Restart your dev server after setting `STRIPE_WEBHOOK_SECRET`
- **Email not sent:** Check that `RESEND_API_KEY` is valid and server has been restarted
- **Check terminal logs:** Look for "Payment completed for:" or error messages in your Next.js terminal
