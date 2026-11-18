import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { createServer as createViteServer } from 'vite';

interface StoredRsvp {
  id: string;
  name: string;
  adultsCount: number;
  childrenCount: number;
  totalMembers: number;
  attendance: 'joyfully accept' | 'regretfully decline';
  attendingEvents: string[];
  notes: string;
  submittedAt: string;
  sheetForwarded?: boolean;
}

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');

function readStoredRsvps(): StoredRsvp[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredRsvps(records: StoredRsvp[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

async function forwardToGoogleSheetOrForm(record: StoredRsvp): Promise<boolean> {
  const membersSummary =
    record.attendance === 'regretfully decline'
      ? '0 (Unable to attend)'
      : `${record.totalMembers} (Adults: ${record.adultsCount}, Children: ${record.childrenCount})`;

  const eventsSummary =
    record.attendance === 'regretfully decline'
      ? 'Unable to attend'
      : record.attendingEvents.join(', ') || 'None';

  const DEFAULT_SHEET_WEBHOOK_URL =
    'https://script.google.com/macros/s/AKfycbzhM3-VOqbgWsPDSSN_MWm6yvWBql_alcnztJ5NgANJm1PK7PF1EYhQsJ2IWfim6KQ/exec';
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim() || DEFAULT_SHEET_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
        body: JSON.stringify({
          timestamp: record.submittedAt,
          name: record.name,
          members: membersSummary,
          adultsCount: record.adultsCount,
          childrenCount: record.childrenCount,
          totalMembers: record.totalMembers,
          attendance: record.attendance,
          eventTypes: eventsSummary,
          wishes: record.notes,
        }),
      });
      if (res.ok || res.status === 302) return true;
      console.error('Google Sheet webhook non-OK status:', res.status);
    } catch (err) {
      console.error('Google Sheet webhook forwarding error:', err);
    }
  }

  const formActionUrl = process.env.GOOGLE_FORM_ACTION_URL?.trim();
  if (formActionUrl) {
    try {
      const params = new URLSearchParams();
      if (process.env.GOOGLE_FORM_ENTRY_NAME) {
        params.append(process.env.GOOGLE_FORM_ENTRY_NAME, record.name);
      }
      if (process.env.GOOGLE_FORM_ENTRY_MEMBERS) {
        params.append(process.env.GOOGLE_FORM_ENTRY_MEMBERS, membersSummary);
      }
      if (process.env.GOOGLE_FORM_ENTRY_EVENTS) {
        params.append(process.env.GOOGLE_FORM_ENTRY_EVENTS, eventsSummary);
      }
      if (process.env.GOOGLE_FORM_ENTRY_WISHES) {
        params.append(process.env.GOOGLE_FORM_ENTRY_WISHES, record.notes || '');
      }

      const res = await fetch(formActionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (res.ok || res.status === 200 || res.status === 302) return true;
    } catch (err) {
      console.error('Google Form forwarding error:', err);
    }
  }

  return false;
}

function csvEscape(value: string | number): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/rsvps', (_req, res) => {
    const rsvps = readStoredRsvps();
    res.json({ rsvps });
  });

  app.get('/api/rsvps/export.csv', (_req, res) => {
    const rsvps = readStoredRsvps();
    const header = [
      'Timestamp',
      'Full Name',
      'Attendance',
      'Adults',
      'Children',
      'Total Members',
      'Event Types',
      'Wishes',
    ];
    const rows = rsvps.map((r) => [
      r.submittedAt,
      r.name,
      r.attendance === 'joyfully accept' ? 'Joyfully Accepting' : 'Unable to Attend',
      r.adultsCount,
      r.childrenCount,
      r.totalMembers,
      r.attendance === 'regretfully decline'
        ? 'Unable to attend'
        : r.attendingEvents.join(', ') || 'None',
      r.notes,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="shafi-sana-rsvps.csv"');
    res.send(csv);
  });

  app.post('/api/rsvp', async (req, res) => {
    const body = req.body ?? {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      res.status(400).json({ error: 'Full name is required.' });
      return;
    }

    const attendance: 'joyfully accept' | 'regretfully decline' =
      body.attendance === 'regretfully decline' ? 'regretfully decline' : 'joyfully accept';
    const adultsCount =
      attendance === 'regretfully decline'
        ? 0
        : Math.max(1, Number.parseInt(String(body.adultsCount ?? 1), 10) || 1);
    const childrenCount =
      attendance === 'regretfully decline'
        ? 0
        : Math.max(0, Number.parseInt(String(body.childrenCount ?? 0), 10) || 0);
    const attendingEvents: string[] = Array.isArray(body.attendingEvents)
      ? body.attendingEvents.filter((item: unknown): item is string => typeof item === 'string')
      : [];
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

    const record: StoredRsvp = {
      id: `${Date.now()}`,
      name,
      adultsCount,
      childrenCount,
      totalMembers: adultsCount + childrenCount,
      attendance,
      attendingEvents: attendance === 'regretfully decline' ? [] : attendingEvents,
      notes,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    record.sheetForwarded = await forwardToGoogleSheetOrForm(record);

    const existing = readStoredRsvps();
    const updated = [record, ...existing];
    writeStoredRsvps(updated);

    res.status(201).json({ rsvp: record });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
