// Live Production Stripe Payment Link Configuration for CXPro
export const STRIPE_PAYMENT_LINKS = {
  // Monthly (full price, month-to-month)
  monthly: {
    student: 'https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w',
    starter: 'https://buy.stripe.com/4gM28sb6gbTP39NfIFcjS0G',
    professional: 'https://buy.stripe.com/00waEY2zK3nj39NfIFcjS0H',
    enterprise: 'https://buy.stripe.com/4gM5kE3DOf617q3541cjS0I'
  },
  // Annual (20% discount, billed monthly at reduced rate)
  annual: {
    student: 'https://buy.stripe.com/7sY14oeis3nj11FfIFcjS0w',
    starter: 'https://buy.stripe.com/7sYdRa4HS6zvbGj685cjS0K',
    professional: 'https://buy.stripe.com/eVqaEYfmw4rn5hVaolcjS0L',
    enterprise: 'https://buy.stripe.com/00w00kfmw0b7cKneEBcjS0J'
  }
};

export const getStripeCheckoutUrl = (
  tier: 'student' | 'starter' | 'professional' | 'enterprise',
  cycle: 'monthly' | 'annual' = 'monthly'
): string => {
  const cycleLinks = STRIPE_PAYMENT_LINKS[cycle] || STRIPE_PAYMENT_LINKS.monthly;
  return cycleLinks[tier] || cycleLinks.professional;
};
