const { json, required, authenticatedUser } = require('./_course');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  try {
    const user = await authenticatedUser(event);
    if (!user) return json(401, { error: 'Sign in required.' });
    const priceId = required('STRIPE_FULL_COURSE_PRICE_ID');
    const origin = event.headers.origin || process.env.URL;
    const form = new URLSearchParams({
      mode: 'payment',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      customer_email: user.email,
      client_reference_id: user.id,
      'metadata[supabase_user_id]': user.id,
      success_url: `${origin}/Splash-draftv3-parrot.html?checkout=success`,
      cancel_url: `${origin}/Splash-draftv3-parrot.html?checkout=cancelled`
    });
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${required('STRIPE_SECRET_KEY')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form
    });
    const session = await response.json();
    if (!response.ok) throw new Error(session.error?.message || 'Stripe could not create checkout.');
    return json(200, { url: session.url });
  } catch (error) {
    console.error('[create-checkout-session]', error);
    return json(500, { error: error.message || 'Unable to start checkout.' });
  }
};
