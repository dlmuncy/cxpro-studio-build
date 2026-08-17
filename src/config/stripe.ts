// Live Stripe Payment Link Configuration for CXPro Production
// You can override these via Render Environment Variables or paste your live Stripe Payment Links directly below.

export const STRIPE_PAYMENT_LINKS = {
  // 1. Student / QA & AI Contractor Plan ($49.99/mo)
  student: (typeof process !== 'undefined' && process.env?.VITE_STRIPE_STUDENT_LINK) || 'https://buy.stripe.com/test_student_handshake_49_cxpro',

  // 2. Starter Plan ($149/mo)
  starter: (typeof process !== 'undefined' && process.env?.VITE_STRIPE_STARTER_LINK) || 'https://buy.stripe.com/test_starter_plan_cxpro',

  // 3. Professional Plan ($349/mo)
  professional: (typeof process !== 'undefined' && process.env?.VITE_STRIPE_PRO_LINK) || 'https://buy.stripe.com/test_professional_plan_cxpro',

  // 4. Enterprise Legal Team ($699/mo)
  enterprise: (typeof process !== 'undefined' && process.env?.VITE_STRIPE_ENTERPRISE_LINK) || 'https://buy.stripe.com/test_enterprise_plan_cxpro'
};

export const getStripeCheckoutUrl = (tier: 'student' | 'starter' | 'professional' | 'enterprise'): string => {
  return STRIPE_PAYMENT_LINKS[tier] || STRIPE_PAYMENT_LINKS.professional;
};
