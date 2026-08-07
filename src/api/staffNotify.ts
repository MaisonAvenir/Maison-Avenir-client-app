/**
 * Fires a best-effort ping to a Zapier webhook so staff get an email whenever a customer
 * changes something in the app. Never throws — a failed notification shouldn't block the
 * customer's own action from succeeding.
 */
const STAFF_NOTIFY_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/28483571/46w9x3o/';

export function notifyStaff(customerName: string, field: string, values: string): void {
  fetch(STAFF_NOTIFY_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName, field, values }),
  }).catch(() => {
    // Best-effort — no retry, no user-facing error.
  });
}
