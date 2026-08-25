import type { APIRoute } from 'astro';

// Runs on-demand (Node adapter), not prerendered — this is the one route
// that needs a live server per request. Keep it that way rather than
// switching the whole site to output:'server'; see astro.config.mjs.
export const prerender = false;

const REQUIRED_FIELDS = ['projectType', 'location', 'size', 'timeline', 'name', 'phone', 'email'] as const;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();

  // Spam defense #1: honeypot. Real users never see or fill this field.
  if (String(form.get('company') ?? '').trim() !== '') {
    // Respond as if it succeeded so bots don't learn to avoid the honeypot.
    return json({ ok: true });
  }

  // Spam defense #2: time-trap. A submission faster than ~2.5s after the
  // form rendered almost certainly wasn't filled out by a human.
  const renderedAt = Number(form.get('renderedAt') ?? 0);
  if (renderedAt && Date.now() - renderedAt < 2500) {
    return json({ ok: false, error: 'Submitted too quickly.' }, 422);
  }

  const payload: Record<string, string> = {};
  for (const field of REQUIRED_FIELDS) {
    const value = String(form.get(field) ?? '').trim();
    if (!value) return json({ ok: false, error: `Missing required field: ${field}` }, 422);
    payload[field] = value;
  }
  payload.budget = String(form.get('budget') ?? '');
  payload.details = String(form.get('details') ?? '');

  if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
    return json({ ok: false, error: 'Invalid email address.' }, 422);
  }

  try {
    await notify(payload);
  } catch (err) {
    console.error('[api/lead] notify() failed', err);
    // The lead is still logged below even if notification delivery failed —
    // fail soft to the user rather than losing the enquiry entirely.
  }

  console.info('[api/lead] New enquiry:', payload);
  return json({ ok: true });
};

async function notify(payload: Record<string, string>) {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;
  if (!resendKey || !notifyEmail) {
    // No notification backend configured — see .env.example. The
    // enquiry is still captured in server logs (console.info above).
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PBJ Infra Website <leads@pbjinfra.com>',
      to: notifyEmail,
      subject: `New project enquiry — ${payload.projectType} in ${payload.location}`,
      text: Object.entries(payload)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n'),
    }),
  });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
