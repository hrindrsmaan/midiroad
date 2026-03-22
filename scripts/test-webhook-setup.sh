#!/bin/bash

# Script to verify webhook setup for local development

echo "🔍 Checking webhook configuration..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Source the .env file
set -a
source .env
set +a

echo "Checking environment variables:"
echo ""

# Check STRIPE_SECRET_KEY
if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_YOUR_STRIPE_SECRET_KEY_HERE" ]; then
    echo "❌ STRIPE_SECRET_KEY is not set properly"
else
    echo "✅ STRIPE_SECRET_KEY is set"
fi

# Check STRIPE_WEBHOOK_SECRET
if [ -z "$STRIPE_WEBHOOK_SECRET" ] || [ "$STRIPE_WEBHOOK_SECRET" = "whsec_YOUR_WEBHOOK_SECRET_HERE" ]; then
    echo "❌ STRIPE_WEBHOOK_SECRET is not set properly"
    echo "   Run: stripe listen --forward-to localhost:3000/api/webhook"
else
    echo "✅ STRIPE_WEBHOOK_SECRET is set"
fi

# Check RESEND_API_KEY
if [ -z "$RESEND_API_KEY" ] || [ "$RESEND_API_KEY" = "re_YOUR_RESEND_API_KEY_HERE" ]; then
    echo "❌ RESEND_API_KEY is not set properly"
    echo "   Sign up at: https://resend.com/signup"
else
    echo "✅ RESEND_API_KEY is set"
fi

# Check BASE_URL
if [ -z "$BASE_URL" ]; then
    echo "⚠️  BASE_URL is not set (will default to http://localhost:3000)"
else
    echo "✅ BASE_URL is set to: $BASE_URL"
fi

echo ""
echo "📝 Next steps:"
echo ""

if [ -z "$STRIPE_WEBHOOK_SECRET" ] || [ "$STRIPE_WEBHOOK_SECRET" = "whsec_YOUR_WEBHOOK_SECRET_HERE" ]; then
    echo "1. Install Stripe CLI: brew install stripe/stripe-cli/stripe"
    echo "2. Login: stripe login"
    echo "3. Forward webhooks: stripe listen --forward-to localhost:3000/api/webhook"
    echo "4. Copy the webhook secret to .env file"
    echo "5. Restart your Next.js server"
fi

if [ -z "$RESEND_API_KEY" ] || [ "$RESEND_API_KEY" = "re_YOUR_RESEND_API_KEY_HERE" ]; then
    echo ""
    echo "For email delivery:"
    echo "1. Sign up at https://resend.com/signup"
    echo "2. Get your API key from https://resend.com/api-keys"
    echo "3. Add it to .env file"
    echo "4. Restart your Next.js server"
fi

echo ""
echo "See SETUP_EMAIL.md for detailed instructions"
