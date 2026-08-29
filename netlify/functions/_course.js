const crypto = require('crypto');

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable.`);
  return value;
}

async function authenticatedUser(event) {
  const authorization = event.headers.authorization || event.headers.Authorization;
  if (!authorization?.startsWith('Bearer ')) return null;
  const response = await fetch(`${required('SUPABASE_URL')}/auth/v1/user`, {
    headers: { apikey: required('SUPABASE_ANON_KEY'), Authorization: authorization }
  });
  return response.ok ? response.json() : null;
}

async function supabase(path, options = {}) {
  return fetch(`${required('SUPABASE_URL')}${path}`, {
    ...options,
    headers: { apikey: required('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${required('SUPABASE_SERVICE_ROLE_KEY')}`, ...(options.headers || {}) }
  });
}

async function hasCourseAccess(userId) {
  const response = await supabase(`/rest/v1/user_entitlements?user_id=eq.${encodeURIComponent(userId)}&product_key=eq.full-course&status=eq.active&select=id`, {
    headers: { Accept: 'application/json' }
  });
  return response.ok && (await response.json()).length > 0;
}

function stripeSignatureIsValid(payload, signature) {
  const secret = required('STRIPE_WEBHOOK_SECRET');
  const parts = Object.fromEntries((signature || '').split(',').map((item) => item.split('=')));
  if (!parts.t || !parts.v1) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${payload}`, 'utf8').digest('hex');
  const actual = Buffer.from(parts.v1);
  const expectedBuffer = Buffer.from(expected);
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(expectedBuffer, actual);
}

module.exports = { json, required, authenticatedUser, supabase, hasCourseAccess, stripeSignatureIsValid };
