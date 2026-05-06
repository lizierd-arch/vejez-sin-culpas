// Google Sheets API v4 — Google Identity Services (GIS)
// One spreadsheet per user account, one tab per pet.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY   = import.meta.env.VITE_GOOGLE_API_KEY   || '';
const SCOPES    = 'https://www.googleapis.com/auth/spreadsheets';

const SHEET_ID_KEY      = 'vsc_sheet_id';
const SPREADSHEET_TITLE = 'Vejez Sin Culpas';

const HEADERS = [
  'Fecha','Mascota','Observación 1','Observación 2','Estado ánimo',
  'Tipo actividad','Reacción actividad','Registro 1','Registro 2','Registro 3',
  'Pregunta del día','Respuesta','Modo',
];

let tokenClient = null;
let accessToken = null;

// Tab names confirmed to exist — cleared on page load, OK since we re-verify then
const confirmedTabs = new Set();

// ── Helpers ───────────────────────────────────────────────────────────────────

// Wraps a sheet name in single quotes for use in A1 notation ranges.
// Required when the name contains spaces or special characters.
function q(name) { return `'${name.replace(/'/g, "''")}'`; }

function fmtDate(isoOrDate) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function entryToRow(profile, entry) {
  return [
    entry.date ? fmtDate(entry.date) : fmtDate(new Date()),
    profile.name,
    entry.obs1            || '',
    entry.obs2            || '',
    entry.mood            || '',
    entry.activityType    || '',
    entry.activityReaction|| '',
    entry.reg1            || '',
    entry.reg2            || '',
    entry.reg3            || '',
    entry.question        || '',
    entry.questionAnswer  || '',
    entry.mode            || 'normal',
  ];
}

// ── Script loaders ────────────────────────────────────────────────────────────
function loadGIS() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

function loadGAPI() {
  return new Promise((resolve) => {
    if (window.gapi?.client) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
        resolve();
      });
    };
    document.head.appendChild(s);
  });
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function initSheets() {
  if (!CLIENT_ID || !API_KEY) return false;
  await Promise.all([loadGIS(), loadGAPI()]);
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: () => {},
  });
  return true;
}

export function signIn() {
  return new Promise((resolve, reject) => {
    if (!tokenClient) { reject(new Error('GIS not initialised')); return; }

    // Timeout: if the popup is blocked or ignored, don't hang forever
    const timer = setTimeout(() => reject(new Error('timeout')), 90000);

    tokenClient.callback = (resp) => {
      clearTimeout(timer);
      if (resp.error) { reject(new Error(resp.error)); return; }
      accessToken = resp.access_token;
      window.gapi.client.setToken({ access_token: accessToken });
      resolve(accessToken);
    };
    tokenClient.error_callback = (err) => {
      clearTimeout(timer);
      reject(new Error(err?.type || 'popup_closed'));
    };
    // Empty prompt: Google decides — no forced consent screen on every login
    tokenClient.requestAccessToken({ prompt: '' });
  });
}

export function isSignedIn() { return !!accessToken; }

export function getSheetUrl() {
  const id = localStorage.getItem(SHEET_ID_KEY);
  return id ? `https://docs.google.com/spreadsheets/d/${id}` : null;
}

// ── Spreadsheet ───────────────────────────────────────────────────────────────
async function findOrCreateSpreadsheet() {
  const storedId = localStorage.getItem(SHEET_ID_KEY);
  if (storedId) {
    try {
      await window.gapi.client.sheets.spreadsheets.get({ spreadsheetId: storedId });
      return storedId;
    } catch {
      localStorage.removeItem(SHEET_ID_KEY);
    }
  }
  const resp = await window.gapi.client.sheets.spreadsheets.create({
    resource: { properties: { title: SPREADSHEET_TITLE } },
  });
  const id = resp.result.spreadsheetId;
  localStorage.setItem(SHEET_ID_KEY, id);
  return id;
}

// ── Pet tab ───────────────────────────────────────────────────────────────────
async function findOrCreatePetTab(spreadsheetId, petName) {
  if (confirmedTabs.has(petName)) return petName;

  const meta   = await window.gapi.client.sheets.spreadsheets.get({ spreadsheetId });
  const sheets = meta.result.sheets || [];
  const found  = sheets.find((s) => s.properties.title === petName);

  if (!found) {
    // Create tab
    const addResp = await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests: [{ addSheet: { properties: { title: petName } } }] },
    });

    // The sheetId comes back in the addSheet reply — no need for a second GET
    const newSheetId = addResp.result.replies[0].addSheet.properties.sheetId;

    // Write header row
    await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${q(petName)}!A1:M1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [HEADERS] },
    });

    // Format header: terracotta bg + bold white text
    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
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
      },
    });
  }

  confirmedTabs.add(petName);
  return petName;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Append a single entry to the pet's tab. */
export async function appendEntry(profile, data) {
  if (!accessToken) throw new Error('Not signed in');
  const spreadsheetId = await findOrCreateSpreadsheet();
  await findOrCreatePetTab(spreadsheetId, profile.name);

  await window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${q(profile.name)}!A:M`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [entryToRow(profile, data)] },
  });
}

/** Upload every local entry that isn't yet in the Sheet.
 *  Strategy: compare row count in Sheet vs local entries.
 *  If Sheet has fewer rows, append the difference (oldest-first). */
export async function syncLocalEntries(profile, localEntries) {
  if (!accessToken) throw new Error('Not signed in');
  if (!localEntries.length) return 0;

  const spreadsheetId = await findOrCreateSpreadsheet();
  await findOrCreatePetTab(spreadsheetId, profile.name);

  // Count existing data rows in Sheet (excluding header)
  const existing = await window.gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${q(profile.name)}!A2:A`,
  });
  const sheetCount = (existing.result.values || []).length;
  const localCount = localEntries.length;

  if (sheetCount >= localCount) return 0; // already in sync

  // Entries are stored newest-first locally; upload the oldest ones that Sheet is missing
  const toUpload = [...localEntries].reverse().slice(sheetCount);
  const rows     = toUpload.map((e) => entryToRow(profile, e));

  await window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${q(profile.name)}!A:M`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: rows },
  });

  return toUpload.length;
}

/** Fetch all entries for a pet from its tab. */
export async function fetchEntries(profile) {
  if (!accessToken) throw new Error('Not signed in');
  const spreadsheetId = await findOrCreateSpreadsheet();
  await findOrCreatePetTab(spreadsheetId, profile.name);

  const resp = await window.gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${q(profile.name)}!A2:M`,
  });
  return resp.result.values || [];
}
