export async function requestPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  const perm = await Notification.requestPermission();
  return perm;
}

export function scheduleLocalReminder(timeStr) {
  // timeStr: "HH:MM"
  localStorage.setItem('vsc_reminder_time', timeStr);
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next - now;

  clearExistingReminder();
  const timerId = setTimeout(() => fireReminder(timeStr), delay);
  // Store serialisable info — actual timer won't survive page reload,
  // so we use the SW for push (when push subscription is set up)
  localStorage.setItem('vsc_reminder_set', JSON.stringify({ timeStr, setAt: Date.now() }));
  return timerId;
}

function clearExistingReminder() {
  const id = localStorage.getItem('vsc_reminder_timer_id');
  if (id) clearTimeout(Number(id));
}

function fireReminder(timeStr) {
  if (Notification.permission === 'granted') {
    new Notification('🐾 Vejez Sin Culpas', {
      body: 'Es hora de tu protocolo diario. Tu mascota te espera.',
      icon: '/icons/icon-192.png',
      tag: 'daily-reminder',
    });
  }
  // Reschedule for tomorrow
  scheduleLocalReminder(timeStr);
}

export function restoreReminder() {
  const stored = localStorage.getItem('vsc_reminder_set');
  if (!stored) return;
  const { timeStr } = JSON.parse(stored);
  if (timeStr) scheduleLocalReminder(timeStr);
}
