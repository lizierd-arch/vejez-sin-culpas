const CSV_HEADERS = [
  'Fecha', 'Observación', 'Cómo se sentía', 'Estado de ánimo',
  'Tipo de actividad', 'Reacción', 'Registro 1', 'Registro 2', 'Registro 3',
  'Pregunta del día', 'Respuesta', 'Modo',
];

function cell(v) {
  const s = String(v || '');
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

function entryToRow(entry) {
  const date = new Date(entry.date).toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  return [
    date,
    entry.obs1 || '',
    entry.obs2 || '',
    entry.mood || '',
    entry.activityType || '',
    entry.activityReaction || '',
    entry.reg1 || '',
    entry.reg2 || '',
    entry.reg3 || '',
    entry.question || '',
    entry.questionAnswer || '',
    entry.mode || 'normal',
  ].map(cell).join(',');
}

export async function exportToCSV(profile, entries) {
  if (!entries.length) return false;

  // Oldest first in the file
  const rows = [CSV_HEADERS.join(','), ...[...entries].reverse().map(entryToRow)];
  const csv  = rows.join('\n');
  // BOM so Excel opens it with proper encoding
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const name = `vejez-sin-culpas-${profile.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
  const file = new File([blob], name, { type: 'text/csv' });

  // Web Share API — works on Android/iOS (shows native share sheet)
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: `Registros de ${profile.name}` });
    return true;
  }

  // Desktop fallback: trigger download
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}
