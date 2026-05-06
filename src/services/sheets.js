// Google Sheets API v4 via REST fetch — no GIS/GAPI scripts required.
// Auth: OAuth 2.0 implicit-redirect flow (works in PWA standalone mode).
// Token is persisted in localStorage so the user doesn't need to reconnect every session.

const CLIENT_ID  = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCOPES     = 'https://www.googleapis.com/auth/spreadsheets';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

const SHEET_ID_KEY      = 'vsc_sheet_id';
const TOKEN_KEY         = 'vsc_gtoken';
const TOKEN_EXP_KEY     = 'vsc_gtoken_exp';
const SPREADSHEET_TITLE = 'Vejez Sin Culpas';

const HEADERS = [
  'Fecha','Mascota','Observación 1','Observación 2','Estado ánimo',
  'Tipo actividad','Reacción actividad','Registro 1','Registro 2','Registro 3',
  'Pregunta del día','Respuesta','Modo',
];

// ── Token management ──────────────────────────────────────────────────────────

let _token = null;

function getToken() {
  if (_token) return _token;
  const stored = localStorage.getItem(TOKEN_KEY);
  const exp    = parseInt(localStorage.getItem(TOKEN_EXP_KEY) || '0', 10);
  if (stored && exp > Date.now()) { _token = stored; return _token; }
  return null;
}

function saveToken(token, expiresInSeconds) {
  _token = token;
  const exp = Date.now() + (expiresInSeconds - 300) * 1000; // 5-min buffer
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXP_KEY, String(exp));
}

export function isSignedIn() { return !!getToken(); }

export function signOut() {
  _token = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXP_KEY);
}

export function getSheetUrl() {
  const id = localStorage.getItem(SHEET_ID_KEY);
  return id ? `https://docs.google.com/spreadsheets/d/${id}` : null;
}

// ── OAuth redirect flow ───────────────────────────────────────────────────────
// Navigates the main window to Google, which redirects back with #access_token.
// Works reliably in PWA standalone mode (no popups needed).

export function redirectToSignIn() {
  localStorage.setItem('vsc_auth_return', '1');
  const params = new URLSearchParams({
    client_id:    CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'token',
    scope:        SCOPES,
    prompt:       'select_account',
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// Called once on app startup. Returns true if we just came back from Google auth.
export function handleOAuthCallback() {
  if (!window.location.hash.includes('access_token')) return false;
  const params    = new URLSearchParams(window.location.hash.slice(1));
  const token     = params.get('access_token');
  const expiresIn = parseInt(params.get('expires_in') || '3600', 10);
  if (!token) return false;
  saveToken(token, expiresIn);
  // Clean the hash from the URL bar
  window.history.replaceState({}, '', window.location.pathname);
  return true;
}

// ── REST helper ───────────────────────────────────────────────────────────────

async function api(method, url, body = null) {
  const token = getToken();
  if (!token) throw new Error('Not signed in');
  const res = await fetch(url, {
    method,
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `HTTP ${res.status}`;
    // 401 means token expired — clear it so isSignedIn() returns false
    if (res.status === 401) { _token = null; localStorage.removeItem(TOKEN_KEY); }
    throw new Error(msg);
  }
  return res.json();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function q(name) { return `'${name.replace(/'/g, "''")}'`; }

function fmtDate(isoOrDate) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function entryToRow(profile, entry) {
  return [
    entry.date ? fmtDate(entry.date) : fmtDate(new Date()),
    profile.name,
    entry.obs1             || '',
    entry.obs2             || '',
    entry.mood             || '',
    entry.activityType     || '',
    entry.activityReaction || '',
    entry.reg1             || '',
    entry.reg2             || '',
    entry.reg3             || '',
    entry.question         || '',
    entry.questionAnswer   || '',
    entry.mode             || 'normal',
  ];
}

// ── Spreadsheet ───────────────────────────────────────────────────────────────

const confirmedTabs = new Set();

async function findOrCreateSpreadsheet() {
  const storedId = localStorage.getItem(SHEET_ID_KEY);
  if (storedId) {
    try {
      await api('GET', `${SHEETS_API}/${storedId}?fields=spreadsheetId`);
      return storedId;
    } catch {
      localStorage.removeItem(SHEET_ID_KEY);
    }
  }
  const resp = await api('POST', SHEETS_API, {
    properties: { title: SPREADSHEET_TITLE },
  });
  localStorage.setItem(SHEET_ID_KEY, resp.spreadsheetId);
  return resp.spreadsheetId;
}

async function findOrCreatePetTab(spreadsheetId, petName) {
  if (confirmedTabs.has(petName)) return;

  const meta   = await api('GET', `${SHEETS_API}/${spreadsheetId}?fields=sheets.properties`);
  const sheets = meta.sheets || [];
  const found  = sheets.find((s) => s.properties.title === petName);

  if (!found) {
    const addResp = await api('POST', `${SHEETS_API}/${spreadsheetId}:batchUpdate`, {
      requests: [{ addSheet: { properties: { title: petName } } }],
    });
    const newSheetId = addResp.replies[0].addSheet.properties.sheetId;

    // Write header row
    await api('PUT',
      `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`${q(petName)}!A1:M1`)}?valueInputOption=USER_ENTERED`,
      { values: [HEADERS] },
    );

    // Format header: terracotta bg + bold white text
    await api('POST', `${SHEETS_API}/${spreadsheetId}:batchUpdate`, {
      requests: [{
        repeatCell: {
          range: { sheetId: newSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 13 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.77, green: 0.44, blue: 0.29 },
              textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)',
        },
      }],
    });
  }

  confirmedTabs.add(petName);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function appendEntry(profile, data) {
  if (!getToken()) return; // silently skip — entry is already saved locally
  const spreadsheetId = await findOrCreateSpreadsheet();
  await findOrCreatePetTab(spreadsheetId, profile.name);
  await api('POST',
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`${q(profile.name)}!A:M`)}:append?valueInputOption=USER_ENTERED`,
    { values: [entryToRow(profile, data)] },
  );
}

export async function syncLocalEntries(profile, localEntries) {
  if (!getToken()) throw new Error('Not signed in');
  if (!localEntries.length) return 0;

  const spreadsheetId = await findOrCreateSpreadsheet();
  await findOrCreatePetTab(spreadsheetId, profile.name);

  const existing   = await api('GET',
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`${q(profile.name)}!A2:A`)}`,
  );
  const sheetCount = (existing.values || []).length;
  const localCount = localEntries.length;
  if (sheetCount >= localCount) return 0;

  const toUpload = [...localEntries].reverse().slice(sheetCount);
  await api('POST',
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`${q(profile.name)}!A:M`)}:append?valueInputOption=USER_ENTERED`,
    { values: toUpload.map((e) => entryToRow(profile, e)) },
  );
  return toUpload.length;
}

export async function fetchEntries(profile) {
  if (!getToken()) throw new Error('Not signed in');
  const spreadsheetId = await findOrCreateSpreadsheet();
  await findOrCreatePetTab(spreadsheetId, profile.name);

  const resp = await api('GET',
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`${q(profile.name)}!A2:M`)}`,
  );
  return resp.values || [];
}

// Legacy stubs — kept so existing callers don't break during transition
export async function initSheets() { return !!CLIENT_ID; }
export async function signIn() { redirectToSignIn(); return new Promise(() => {}); }
