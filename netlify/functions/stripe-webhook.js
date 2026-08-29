const { json, supabase, stripeSignatureIsValid } = require('./_course');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  try {
    const payload = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
    const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    if (!stripeSignatureIsValid(payload, signature)) return json(400, { error: 'Invalid signature.' });
    const stripeEvent = JSON.parse(payload);
    if (stripeEvent.type === 'checkout.session.completed' && stripeEvent.data.object.payment_status === 'paid') {
      const session = stripeEvent.data.object;
      const userId = session.metadata?.supabase_user_id || session.client_reference_id;
      if (!userId) throw new Error('Checkout session has no course user reference.');
      const response = await supabase('/rest/v1/user_entitlements?on_conflict=user_id,product_key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ user_id: userId, product_key: 'full-course', status: 'active', stripe_customer_id: session.customer, stripe_checkout_session_id: session.id })
      });
      if (!response.ok) throw new Error(`Could not save access: ${await response.text()}`);
    }
    return json(200, { received: true });
  } catch (error) {
    console.error('[stripe-webhook]', error);
    return json(500, { error: 'Webhook processing failed.' });
  }
};
