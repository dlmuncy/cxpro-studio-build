// Live Production Stripe Payment Link Configuration for CXPro
export const STRIPE_PAYMENT_LINKS = {
  // 1. Student / QA & AI Contractor Plan ($49.99/mo)
  student: 'https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w',

  // 2. Starter Plan ($149/mo)
  starter: 'https://buy.stripe.com/4gM28sb6gbTP39NfIFcjS0G',

  // 3. Professional Plan ($349/mo)
  professional: 'https://buy.stripe.com/00waEY2zK3nj39NfIFcjS0H',

  // 4. Enterprise Legal Team ($699/mo)
  enterprise: 'https://buy.stripe.com/4gM5kE3DOf617q3541cjS0I'
};

export const getStripeCheckoutUrl = (tier: 'student' | 'starter' | 'professional' | 'enterprise'): string => {
  return STRIPE_PAYMENT_LINKS[tier] || STRIPE_PAYMENT_LINKS.professional;
};
