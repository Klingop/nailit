require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');
const OpenAI = require('openai');

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || 'gpt-4.1';
const appBaseUrl = process.env.APP_BASE_URL || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const paypalClientId = process.env.PAYPAL_CLIENT_ID || '';
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
const paypalApiBase = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';
const dbFilePath = path.resolve(__dirname, process.env.DB_FILE_PATH || './data/nailit.db');

const businesses = [
    {
        trade: 'sanitaer',
        name: 'Meyer Sanitair Notdienst',
        city: 'Berlin Mitte',
        distanceKm: 4,
        availability: 'Heute verfuegbar',
        specialty: 'Rohrleck, Feuchtigkeit, Bad',
        score: '98 Match'
    },
    {
        trade: 'sanitaer',
        name: 'AquaFix Haustechnik',
        city: 'Berlin Prenzlauer Berg',
        distanceKm: 7,
        availability: 'In 3 Stunden',
        specialty: 'Leitungen und Armaturen',
        score: '94 Match'
    },
    {
        trade: 'sanitaer',
        name: 'Klarfluss Service',
        city: 'Berlin Friedrichshain',
        distanceKm: 9,
        availability: 'Morgen frueh',
        specialty: 'Abfluss und Wasserschaden',
        score: '91 Match'
    },
    {
        trade: 'dach',
        name: 'Norddach Meisterbetrieb',
        city: 'Berlin Spandau',
        distanceKm: 11,
        availability: 'Heute verfuegbar',
        specialty: 'Undichte Daecher und Sturmschaeden',
        score: '96 Match'
    },
    {
        trade: 'dach',
        name: 'Dachwacht Berlin',
        city: 'Berlin Tempelhof',
        distanceKm: 8,
        availability: 'Morgen',
        specialty: 'Leckageortung und Reparatur',
        score: '92 Match'
    },
    {
        trade: 'dach',
        name: 'FirstRoof Solutions',
        city: 'Berlin Neukoelln',
        distanceKm: 13,
        availability: 'In 24 Stunden',
        specialty: 'Flachdach und Abdichtung',
        score: '89 Match'
    },
    {
        trade: 'elektro',
        name: 'Voltwerk Elektroservice',
        city: 'Berlin Wedding',
        distanceKm: 5,
        availability: 'Heute verfuegbar',
        specialty: 'Kurzschluss und Ausfall',
        score: '97 Match'
    },
    {
        trade: 'elektro',
        name: 'Lichtpunkt Technik',
        city: 'Berlin Charlottenburg',
        distanceKm: 9,
        availability: 'In 5 Stunden',
        specialty: 'Sicherungskasten und Leitungen',
        score: '93 Match'
    },
    {
        trade: 'elektro',
        name: 'Elektro Urban',
        city: 'Berlin Kreuzberg',
        distanceKm: 6,
        availability: 'Morgen frueh',
        specialty: 'Wohnungs- und Hausinstallationen',
        score: '90 Match'
    },
    {
        trade: 'maler',
        name: 'Raumfarbe Pro',
        city: 'Berlin Steglitz',
        distanceKm: 10,
        availability: 'Diese Woche',
        specialty: 'Wand, Decke, Feuchtigkeitsfolgen',
        score: '91 Match'
    },
    {
        trade: 'maler',
        name: 'Malerteam Weiss',
        city: 'Berlin Mitte',
        distanceKm: 4,
        availability: 'In 2 Tagen',
        specialty: 'Innenanstrich und Sanierung',
        score: '89 Match'
    },
    {
        trade: 'maler',
        name: 'Renovio Innenausbau',
        city: 'Berlin Lichtenberg',
        distanceKm: 12,
        availability: 'Naechste Woche',
        specialty: 'Wand- und Oberflaechensanierung',
        score: '86 Match'
    },
    {
        trade: 'allround',
        name: 'Haushelden Service',
        city: 'Berlin',
        distanceKm: 6,
        availability: 'Heute verfuegbar',
        specialty: 'Koordination mehrerer Gewerke',
        score: '88 Match'
    },
    {
        trade: 'allround',
        name: 'Fixwerk Objektservice',
        city: 'Berlin',
        distanceKm: 8,
        availability: 'Morgen',
        specialty: 'Allround-Reparaturen',
        score: '85 Match'
    },
    {
        trade: 'allround',
        name: 'Projektbau 360',
        city: 'Berlin',
        distanceKm: 14,
        availability: 'In 2 Tagen',
        specialty: 'Komplexe Problemfaelle',
        score: '83 Match'
    }
];

const client = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.pragma('journal_mode = WAL');
db.exec(`
    CREATE TABLE IF NOT EXISTS chat_threads (
        scope TEXT NOT NULL,
        business_name TEXT NOT NULL,
        messages_json TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (scope, business_name)
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        trade TEXT DEFAULT '',
        radius TEXT DEFAULT '',
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS learned_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        trade TEXT NOT NULL,
        priority TEXT NOT NULL,
        source TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS learned_keywords (
        keyword TEXT PRIMARY KEY,
        trade TEXT NOT NULL,
        weight REAL NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
    );
`);

const getChatThreadStatement = db.prepare(`
    SELECT messages_json, updated_at
    FROM chat_threads
    WHERE scope = ? AND business_name = ?
`);

const upsertChatThreadStatement = db.prepare(`
    INSERT INTO chat_threads (scope, business_name, messages_json, updated_at)
    VALUES (@scope, @businessName, @messagesJson, @updatedAt)
    ON CONFLICT(scope, business_name) DO UPDATE SET
        messages_json = excluded.messages_json,
        updated_at = excluded.updated_at
`);

const getUserByEmailStatement = db.prepare(`
    SELECT role, name, email, phone, password_hash, trade, radius, created_at
    FROM users
    WHERE email = ?
`);

const insertUserStatement = db.prepare(`
    INSERT INTO users (role, name, email, phone, password_hash, trade, radius, created_at)
    VALUES (@role, @name, @email, @phone, @passwordHash, @trade, @radius, @createdAt)
`);

const insertLearnedCaseStatement = db.prepare(`
    INSERT INTO learned_cases (description, trade, priority, source, created_at)
    VALUES (@description, @trade, @priority, @source, @createdAt)
`);

const upsertLearnedKeywordStatement = db.prepare(`
    INSERT INTO learned_keywords (keyword, trade, weight, updated_at)
    VALUES (@keyword, @trade, @weight, @updatedAt)
    ON CONFLICT(keyword) DO UPDATE SET
        trade = excluded.trade,
        weight = learned_keywords.weight + excluded.weight,
        updated_at = excluded.updated_at
`);

const getLearnedKeywordsStatement = db.prepare(`
    SELECT keyword, trade, weight
    FROM learned_keywords
    ORDER BY weight DESC
    LIMIT 500
`);

const getRecentLearnedCasesStatement = db.prepare(`
    SELECT description, trade, priority, source, created_at
    FROM learned_cases
    ORDER BY id DESC
    LIMIT ?
`);

const getLearningCaseCountStatement = db.prepare(`
    SELECT COUNT(*) AS total
    FROM learned_cases
`);

const getLearningCasesByTradeStatement = db.prepare(`
    SELECT trade, COUNT(*) AS count
    FROM learned_cases
    GROUP BY trade
    ORDER BY count DESC
`);

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
    const [salt, originalHash] = String(storedHash || '').split(':');

    if (!salt || !originalHash) {
        return false;
    }

    const nextHashBuffer = crypto.scryptSync(password, salt, 64);
    const originalHashBuffer = Buffer.from(originalHash, 'hex');

    if (originalHashBuffer.length !== nextHashBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(nextHashBuffer, originalHashBuffer);
};

const sanitizeUserProfile = (user) => {
    if (!user) {
        return null;
    }

    return {
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        trade: user.trade || '',
        radius: user.radius || '',
        createdAt: user.created_at
    };
};

const liveChatClients = new Map();

const getLiveChatKey = (scope, businessName) => {
    return `${String(scope)}::${String(businessName)}`;
};

const sendLiveChatEvent = (response, payload) => {
    response.write(`event: thread\n`);
    response.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const broadcastLiveChatThread = ({ scope, businessName, messages, updatedAt }) => {
    const clientKey = getLiveChatKey(scope, businessName);
    const clients = liveChatClients.get(clientKey);

    if (!clients?.size) {
        return;
    }

    const payload = {
        scope,
        businessName,
        messages,
        updatedAt
    };

    clients.forEach((clientResponse) => {
        sendLiveChatEvent(clientResponse, payload);
    });
};

const paymentConfig = {
    stripeCheckoutUrl: process.env.STRIPE_PAYMENT_LINK || '',
    paypalCheckoutUrl: process.env.PAYPAL_CHECKOUT_URL || '',
    stripeEnabled: Boolean(stripeSecretKey),
    paypalEnabled: Boolean(paypalClientId && paypalClientSecret) || Boolean(process.env.PAYPAL_CHECKOUT_URL),
    persistence: {
        provider: 'sqlite',
        file: dbFilePath
    },
    bankTransfer: {
        holder: process.env.BANK_TRANSFER_HOLDER || 'Nailit Services GmbH',
        iban: process.env.BANK_TRANSFER_IBAN || 'DE12500105170648489890',
        bic: process.env.BANK_TRANSFER_BIC || 'INGDDEFFXXX',
        bank: process.env.BANK_TRANSFER_BANK || 'Nailit Partnerbank'
    }
};

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.get('/api/payments/config', (req, res) => {
    res.json(paymentConfig);
});

app.post('/api/auth/register', (req, res) => {
    const role = String(req.body?.role || '').trim();
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const phone = String(req.body?.phone || '').trim();
    const password = String(req.body?.password || '');
    const trade = String(req.body?.trade || '').trim();
    const radius = String(req.body?.radius || '').trim();

    if (!['kunde', 'betrieb'].includes(role) || !name || !email || !phone || !password) {
        return res.status(400).json({ error: 'role, name, email, phone und password sind erforderlich.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Das Passwort muss mindestens 8 Zeichen lang sein.' });
    }

    if (role === 'betrieb' && (!trade || !radius)) {
        return res.status(400).json({ error: 'Fuer Betriebskonten sind trade und radius erforderlich.' });
    }

    const existingUser = getUserByEmailStatement.get(email);
    if (existingUser) {
        return res.status(409).json({ error: 'Mit dieser E-Mail existiert bereits ein Konto.' });
    }

    const createdAt = new Date().toISOString();
    insertUserStatement.run({
        role,
        name,
        email,
        phone,
        passwordHash: hashPassword(password),
        trade,
        radius,
        createdAt
    });

    const createdUser = getUserByEmailStatement.get(email);
    return res.status(201).json({
        user: sanitizeUserProfile(createdUser)
    });
});

app.post('/api/auth/login', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
        return res.status(400).json({ error: 'email und password sind erforderlich.' });
    }

    const user = getUserByEmailStatement.get(email);

    if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: 'Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort pruefen.' });
    }

    return res.json({
        user: sanitizeUserProfile(user)
    });
});

app.post('/api/auth/forgot-password', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();

    if (!email) {
        return res.status(400).json({ error: 'email ist erforderlich.' });
    }

    const user = getUserByEmailStatement.get(email);

    if (user) {
        console.log(`Passwort-Reset angefragt fuer ${email} (Placeholder ohne Mailversand).`);
    }

    return res.json({
        ok: true,
        message: 'Wenn ein Konto mit dieser E-Mail existiert, wurden die naechsten Schritte zum Passwort-Reset ausgeliefert.'
    });
});

app.get('/api/chat-threads', (req, res) => {
    const scope = String(req.query.scope || '').trim();
    const businessName = String(req.query.business || '').trim();

    if (!scope || !businessName) {
        return res.status(400).json({ error: 'scope und business sind erforderlich.' });
    }

    const row = getChatThreadStatement.get(scope, businessName);
    const messages = row ? JSON.parse(row.messages_json) : [];

    return res.json({
        scope,
        businessName,
        messages,
        updatedAt: row?.updated_at || null
    });
});

app.get('/api/chat-threads/stream', (req, res) => {
    const scope = String(req.query.scope || '').trim();
    const businessName = String(req.query.business || '').trim();

    if (!scope || !businessName) {
        return res.status(400).json({ error: 'scope und business sind erforderlich.' });
    }

    const clientKey = getLiveChatKey(scope, businessName);
    const existingClients = liveChatClients.get(clientKey) || new Set();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    existingClients.add(res);
    liveChatClients.set(clientKey, existingClients);

    const row = getChatThreadStatement.get(scope, businessName);
    const messages = row ? JSON.parse(row.messages_json) : [];
    sendLiveChatEvent(res, {
        scope,
        businessName,
        messages,
        updatedAt: row?.updated_at || null
    });

    const keepAlive = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 15000);

    req.on('close', () => {
        clearInterval(keepAlive);
        existingClients.delete(res);

        if (!existingClients.size) {
            liveChatClients.delete(clientKey);
        }
    });
});

app.put('/api/chat-threads', (req, res) => {
    const { scope, businessName, messages } = req.body || {};

    if (!scope || !businessName || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'scope, businessName und messages sind erforderlich.' });
    }

    const updatedAt = new Date().toISOString();
    upsertChatThreadStatement.run({
        scope: String(scope),
        businessName: String(businessName),
        messagesJson: JSON.stringify(messages),
        updatedAt
    });

    broadcastLiveChatThread({
        scope: String(scope),
        businessName: String(businessName),
        messages,
        updatedAt
    });

    return res.json({ ok: true, updatedAt });
});

const getAppUrl = (req) => {
    return appBaseUrl || `${req.protocol}://${req.get('host')}`;
};

const createStripeCheckoutSession = async ({ amount, title, offerId, businessName, scope, appUrl }) => {
    const unitAmount = Math.max(1, Math.round(Number(amount || 0) * 100));
    const encodedTitle = String(title || 'Nailit Auftrag').trim() || 'Nailit Auftrag';
    const encodedBusinessName = String(businessName || 'Nailit Partner').trim() || 'Nailit Partner';
    const successUrl = `${appUrl}/contractors.html?checkout=success&provider=stripe&offer=${encodeURIComponent(offerId)}&business=${encodeURIComponent(encodedBusinessName)}&scope=${encodeURIComponent(scope)}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/contractors.html?checkout=cancel&provider=stripe&offer=${encodeURIComponent(offerId)}&business=${encodeURIComponent(encodedBusinessName)}&scope=${encodeURIComponent(scope)}`;
    const formData = new URLSearchParams();

    formData.set('mode', 'payment');
    formData.set('success_url', successUrl);
    formData.set('cancel_url', cancelUrl);
    formData.set('line_items[0][quantity]', '1');
    formData.set('line_items[0][price_data][currency]', 'eur');
    formData.set('line_items[0][price_data][unit_amount]', String(unitAmount));
    formData.set('line_items[0][price_data][product_data][name]', encodedTitle);
    formData.set('line_items[0][price_data][product_data][description]', `Direktchat-Angebot von ${encodedBusinessName}`);
    formData.set('metadata[offerId]', String(offerId || 'unknown-offer'));
    formData.set('metadata[businessName]', encodedBusinessName);

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });

    const payload = await response.json();

    if (!response.ok) {
        const errorMessage = payload?.error?.message || 'Stripe Checkout Session konnte nicht erstellt werden.';
        throw new Error(errorMessage);
    }

    return payload;
};

const getStripeSessionStatus = async (sessionId) => {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
        headers: {
            Authorization: `Bearer ${stripeSecretKey}`
        }
    });

    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload?.error?.message || 'Stripe Session konnte nicht geprueft werden.');
    }

    return payload;
};

const getPaypalAccessToken = async () => {
    const authValue = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
    const response = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${authValue}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' })
    });
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload?.error_description || 'PayPal Access Token konnte nicht erstellt werden.');
    }

    return payload.access_token;
};

const createPaypalOrder = async ({ amount, title, offerId, businessName, scope, appUrl }) => {
    const accessToken = await getPaypalAccessToken();
    const response = await fetch(`${paypalApiBase}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: String(offerId),
                    description: `Direktchat-Angebot von ${businessName}`,
                    amount: {
                        currency_code: 'EUR',
                        value: Number(amount || 0).toFixed(2)
                    },
                    custom_id: String(scope),
                    invoice_id: String(offerId),
                    items: [
                        {
                            name: String(title || 'Nailit Auftrag'),
                            quantity: '1',
                            unit_amount: {
                                currency_code: 'EUR',
                                value: Number(amount || 0).toFixed(2)
                            }
                        }
                    ]
                }
            ],
            application_context: {
                brand_name: 'Nailit',
                user_action: 'PAY_NOW',
                return_url: `${appUrl}/contractors.html?checkout=success&provider=paypal&offer=${encodeURIComponent(offerId)}&business=${encodeURIComponent(businessName)}&scope=${encodeURIComponent(scope)}`,
                cancel_url: `${appUrl}/contractors.html?checkout=cancel&provider=paypal&offer=${encodeURIComponent(offerId)}&business=${encodeURIComponent(businessName)}&scope=${encodeURIComponent(scope)}`
            }
        })
    });
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload?.message || 'PayPal Bestellung konnte nicht erstellt werden.');
    }

    return payload;
};

const capturePaypalOrder = async (orderId) => {
    const accessToken = await getPaypalAccessToken();
    const response = await fetch(`${paypalApiBase}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload?.message || 'PayPal Zahlung konnte nicht bestaetigt werden.');
    }

    return payload;
};

app.post('/api/payments/stripe/checkout-session', async (req, res) => {
    const { amount, title, offerId, businessName, scope } = req.body || {};

    if (!stripeSecretKey) {
        return res.status(503).json({
            error: 'STRIPE_SECRET_KEY fehlt. Lege ihn in der .env an, um echte Stripe-Checkout-Sessions zu aktivieren.'
        });
    }

    if (!amount || !title || !offerId || !businessName || !scope) {
        return res.status(400).json({ error: 'amount, title, offerId, businessName und scope sind fuer Stripe Checkout erforderlich.' });
    }

    try {
        const session = await createStripeCheckoutSession({
            amount,
            title,
            offerId,
            businessName,
            scope,
            appUrl: getAppUrl(req)
        });

        return res.json({
            id: session.id,
            url: session.url
        });
    } catch (error) {
        console.error('Stripe checkout session failed:', error);
        return res.status(502).json({
            error: error.message || 'Stripe Checkout Session konnte nicht gestartet werden.'
        });
    }
});

app.get('/api/payments/stripe/session-status', async (req, res) => {
    const sessionId = String(req.query.sessionId || '').trim();

    if (!stripeSecretKey) {
        return res.status(503).json({ error: 'STRIPE_SECRET_KEY fehlt.' });
    }

    if (!sessionId) {
        return res.status(400).json({ error: 'sessionId ist erforderlich.' });
    }

    try {
        const session = await getStripeSessionStatus(sessionId);
        return res.json({
            id: session.id,
            paymentStatus: session.payment_status,
            status: session.status,
            metadata: session.metadata || {}
        });
    } catch (error) {
        return res.status(502).json({ error: error.message || 'Stripe Session konnte nicht geprueft werden.' });
    }
});

app.post('/api/payments/paypal/order', async (req, res) => {
    const { amount, title, offerId, businessName, scope } = req.body || {};

    if (!(paypalClientId && paypalClientSecret)) {
        return res.status(503).json({ error: 'PAYPAL_CLIENT_ID oder PAYPAL_CLIENT_SECRET fehlt.' });
    }

    if (!amount || !title || !offerId || !businessName || !scope) {
        return res.status(400).json({ error: 'amount, title, offerId, businessName und scope sind fuer PayPal erforderlich.' });
    }

    try {
        const order = await createPaypalOrder({
            amount,
            title,
            offerId,
            businessName,
            scope,
            appUrl: getAppUrl(req)
        });
        const approveLink = Array.isArray(order.links)
            ? order.links.find((link) => link.rel === 'approve')?.href || ''
            : '';

        return res.json({
            id: order.id,
            approveUrl: approveLink,
            status: order.status
        });
    } catch (error) {
        return res.status(502).json({ error: error.message || 'PayPal Bestellung konnte nicht gestartet werden.' });
    }
});

app.post('/api/payments/paypal/capture-order', async (req, res) => {
    const { orderId } = req.body || {};

    if (!(paypalClientId && paypalClientSecret)) {
        return res.status(503).json({ error: 'PAYPAL_CLIENT_ID oder PAYPAL_CLIENT_SECRET fehlt.' });
    }

    if (!orderId) {
        return res.status(400).json({ error: 'orderId ist erforderlich.' });
    }

    try {
        const capture = await capturePaypalOrder(orderId);
        return res.json({
            id: capture.id,
            status: capture.status,
            capture
        });
    } catch (error) {
        return res.status(502).json({ error: error.message || 'PayPal Capture fehlgeschlagen.' });
    }
});

const rankBusinesses = (trade, priority) => {
    const pool = businesses.filter((business) => business.trade === trade);
    const fallbackPool = pool.length ? pool : businesses.filter((business) => business.trade === 'allround');

    const prioritized = [...fallbackPool].sort((left, right) => {
        const urgencyBoost = priority === 'Notfall' || priority === 'Hoch';
        if (urgencyBoost && left.availability !== right.availability) {
            const leftToday = Number(left.availability.includes('Heute'));
            const rightToday = Number(right.availability.includes('Heute'));
            return rightToday - leftToday;
        }

        return left.distanceKm - right.distanceKm;
    });

    return prioritized.slice(0, 3).map((business) => ({
        name: business.name,
        city: business.city,
        distance: `${business.distanceKm} km`,
        availability: business.availability,
        specialty: business.specialty,
        score: business.score
    }));
};

const TRADE_KEYWORDS = {
    sanitaer: [
        'wasserhahn', 'armatur', 'spuele', 'waschbecken', 'wc', 'toilette', 'dusche', 'badewanne',
        'abfluss', 'rohr', 'wasser', 'leck', 'tropf', 'heizung', 'boiler', 'ventil',
        'heizkoerper', 'thermostat', 'waermepumpe', 'kessel', 'radiator', 'entlueften',
        'klimaanlage', 'klima', 'splitgeraet', 'kaelte', 'lueftung', 'luftfilter'
    ],
    elektro: [
        'steckdose', 'strom', 'sicherung', 'sicherungskasten', 'kabel', 'schalter', 'lampe',
        'licht', 'kurzschluss', 'spannung', 'fi-schalter', 'verteiler', 'elektrik',
        'klingel', 'rauchmelder', 'netzteil', 'leitungsschaden', 'unterverteilung'
    ],
    dach: [
        'dach', 'ziegel', 'dachrinne', 'sturm', 'regen', 'gaube', 'abdichtung', 'flachdach',
        'dachfenster', 'dachstuhl'
    ],
    maler: [
        'wand', 'decke', 'farbe', 'lack', 'putz', 'tapete', 'fassade', 'schimmel', 'riss', 'anstrich',
        'spachtel', 'grundierung', 'innenanstrich', 'aussenanstrich'
    ]
};

const SPECIALIZED_AREAS = [
    {
        name: 'heizung-klima',
        trade: 'sanitaer',
        title: 'Heizungs- oder Klimatechnik erkannt',
        summary: 'Die Beschreibung passt zu Heizungs-, Lueftungs- oder Klimatechnik. Passende Sanitair-/SHK-Betriebe wurden ausgewaehlt.',
        confidence: '86%',
        tags: ['SHK', 'Heizung', 'Klima'],
        keywords: [
            'heizkoerper', 'thermostat', 'waermepumpe', 'heizung', 'kessel', 'boiler',
            'klimaanlage', 'klima', 'splitgeraet', 'kuehlung', 'kaelte', 'lueftung'
        ]
    },
    {
        name: 'fliesen',
        trade: 'allround',
        title: 'Fliesen-/Fugenproblem erkannt',
        summary: 'Die Beschreibung deutet auf Fliesen-, Fugen- oder Untergrundschaeden hin. Ein geeigneter Ausbau-/Allround-Betrieb wurde ausgewaehlt.',
        confidence: '84%',
        tags: ['Fliesen', 'Fugen', 'Ausbau'],
        keywords: ['fliese', 'fliesen', 'fuge', 'fugen', 'silikonfuge', 'bodenfliese', 'wandfliese']
    },
    {
        name: 'tischler',
        trade: 'allround',
        title: 'Tischler-/Holzproblem erkannt',
        summary: 'Die Beschreibung passt zu Tueren, Fenstern, Moebeln oder Holzbauteilen. Ein passender Tischler-/Allround-Betrieb wurde ausgewaehlt.',
        confidence: '85%',
        tags: ['Holz', 'Tuer', 'Fenster'],
        keywords: ['tischler', 'schreiner', 'holz', 'tuere', 'fenster', 'schrank', 'schublade', 'parkett']
    },
    {
        name: 'fenster-tueren',
        trade: 'allround',
        title: 'Fenster-/Tuerenproblem erkannt',
        summary: 'Die Beschreibung betrifft Fenster oder Tueren. Ein geeigneter Fenster-/Tischler-/Allround-Betrieb wurde ausgewaehlt.',
        confidence: '85%',
        tags: ['Fenster', 'Tueren', 'Beschlag'],
        keywords: ['fenster', 'tuere', 'haustuer', 'balkontuer', 'beschlag', 'dichtung', 'rollladen', 'rollo', 'scharnier']
    },
    {
        name: 'boden-parkett',
        trade: 'allround',
        title: 'Boden-/Parkettproblem erkannt',
        summary: 'Die Beschreibung deutet auf Boden- oder Parkettschaeden hin. Ein passender Ausbau-/Allround-Betrieb wurde ausgewaehlt.',
        confidence: '84%',
        tags: ['Boden', 'Parkett', 'Belag'],
        keywords: ['parkett', 'laminat', 'boden', 'estrich', 'diele', 'bodenbelag', 'sockelleiste']
    },
    {
        name: 'umzug-montage',
        trade: 'allround',
        title: 'Umzug-/Montageproblem erkannt',
        summary: 'Die Beschreibung passt zu Umzug, Aufbau oder Montage. Ein geeigneter Montage-/Allround-Betrieb wurde ausgewaehlt.',
        confidence: '83%',
        tags: ['Umzug', 'Montage', 'Moebelaufbau'],
        keywords: ['umzug', 'transport', 'moebelaufbau', 'montage', 'demontage', 'aufbau', 'abbau', 'tragen']
    },
    {
        name: 'gartenbau',
        trade: 'allround',
        title: 'Garten-/Aussenbereichsproblem erkannt',
        summary: 'Die Beschreibung betrifft Garten- oder Aussenanlagen. Ein geeigneter Garten-/Allround-Betrieb wurde ausgewaehlt.',
        confidence: '83%',
        tags: ['Garten', 'Aussenbereich', 'Pflege'],
        keywords: ['garten', 'hecke', 'rasen', 'baum', 'terrasse', 'pflaster', 'zaun', 'bewaesserung']
    }
];

const HANDWERK_FEW_SHOTS = [
    {
        problem: 'Wasserhahn tropft, Armatur locker, Wasser tritt aus.',
        trade: 'sanitaer',
        reason: 'Armatur/Rohr/Wasserleck sind klassische Sanitaer-Themen.'
    },
    {
        problem: 'Steckdose knistert, Sicherung fliegt raus, Licht flackert.',
        trade: 'elektro',
        reason: 'Stromkreis, Steckdose und Sicherung sind Elektro-Themen.'
    },
    {
        problem: 'Regenwasser dringt durchs Dach, Ziegel verrutscht.',
        trade: 'dach',
        reason: 'Dachhaut, Ziegel und Regenleck sind Dachdecker-Themen.'
    },
    {
        problem: 'Schimmel und Risse an Wand/Decke nach Feuchtigkeit.',
        trade: 'maler',
        reason: 'Oberflaechen- und Beschichtungsarbeiten sind Maler-Themen.'
    },
    {
        problem: 'Heizkoerper bleibt kalt, Thermostat defekt, Anlage rauscht.',
        trade: 'sanitaer',
        reason: 'Heizung und SHK-Technik sind Sanitair-Fachbereich.'
    },
    {
        problem: 'Klimaanlage kuehlt nicht, Splitgeraet tropft.',
        trade: 'sanitaer',
        reason: 'Klima-/Lueftungstechnik wird dem SHK-Bereich zugeordnet.'
    },
    {
        problem: 'Fliesen gerissen, Fugen brechen auf, Boden hohl klingend.',
        trade: 'allround',
        reason: 'Fliesen-/Ausbauproblem, geeigneter Ausbau- oder Allround-Betrieb.'
    },
    {
        problem: 'Tuer klemmt, Fenster schliesst nicht, Holzrahmen verzogen.',
        trade: 'allround',
        reason: 'Tischler-/Schreinerarbeiten, im System als Allround vermittelt.'
    },
    {
        problem: 'Hecke schneiden, Zaun reparieren, Terrasse neu belegen.',
        trade: 'allround',
        reason: 'Garten- und Aussenarbeiten werden als Allround vermittelt.'
    }
];

const normalizeProblemText = (value) => {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ß/g, 'ss');
};

const LEARNING_STOPWORDS = new Set([
    'der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'aber', 'mit', 'ohne', 'von', 'zum', 'zur',
    'den', 'dem', 'des', 'ist', 'sind', 'war', 'nicht', 'mehr', 'sehr', 'noch', 'bei', 'im', 'in',
    'am', 'an', 'auf', 'aus', 'fuer', 'fur', 'wie', 'wenn', 'weil', 'hier', 'dort', 'bitte'
]);

const learningKeywordCache = {
    loadedAt: 0,
    rows: []
};

const extractLearningTokens = (description) => {
    return normalizeProblemText(description)
        .split(/[^a-z0-9]+/)
        .filter((token) => token && token.length >= 4 && !LEARNING_STOPWORDS.has(token))
        .slice(0, 80);
};

const getLearnedKeywordRows = () => {
    const now = Date.now();

    if (now - learningKeywordCache.loadedAt < 30000 && learningKeywordCache.rows.length) {
        return learningKeywordCache.rows;
    }

    const rows = getLearnedKeywordsStatement.all();
    learningKeywordCache.rows = Array.isArray(rows) ? rows : [];
    learningKeywordCache.loadedAt = now;
    return learningKeywordCache.rows;
};

const getLearnedFewShotExamples = (limit = 6) => {
    const rows = getRecentLearnedCasesStatement.all(limit);

    return rows
        .filter((row) => row?.description)
        .map((row) => {
            return {
                problem: String(row.description).slice(0, 180),
                trade: row.trade,
                priority: row.priority,
                source: row.source
            };
        });
};

const recordLearningExample = ({ description, trade, priority, source = 'analysis', boost = 1 }) => {
    const descriptionText = String(description || '').trim();

    if (!descriptionText || !trade) {
        return;
    }

    const createdAt = new Date().toISOString();
    insertLearnedCaseStatement.run({
        description: descriptionText,
        trade,
        priority: priority || 'Mittel',
        source,
        createdAt
    });

    const uniqueTokens = [...new Set(extractLearningTokens(descriptionText))];

    uniqueTokens.forEach((token) => {
        upsertLearnedKeywordStatement.run({
            keyword: token,
            trade,
            weight: Math.max(0.2, Number(boost) || 1),
            updatedAt: createdAt
        });
    });

    learningKeywordCache.loadedAt = 0;
};

const inferPriorityOverride = (description, basePriority = 'Mittel') => {
    const text = normalizeProblemText(description);

    if (!text) {
        return basePriority;
    }

    const notfallKeywords = [
        'brand', 'rauch', 'funken', 'stromschlag', 'kurzschluss', 'sicherung fliegt',
        'wasser tritt aus', 'rohrbruch', 'ueberflutung', 'gasgeruch', 'gefahr', 'akut'
    ];
    const highKeywords = [
        'stark tropf', 'dichtung kaputt', 'heizung ausgefallen', 'kein strom', 'dringend', 'sofort'
    ];

    if (notfallKeywords.some((keyword) => text.includes(keyword))) {
        return 'Notfall';
    }

    if (highKeywords.some((keyword) => text.includes(keyword)) && basePriority !== 'Notfall') {
        return 'Hoch';
    }

    return basePriority;
};

const inferTradeByKeywords = (description) => {
    const text = normalizeProblemText(description);

    if (!text) {
        return null;
    }

    const scores = {
        sanitaer: 0,
        elektro: 0,
        dach: 0,
        maler: 0
    };

    Object.entries(TRADE_KEYWORDS).forEach(([trade, keywords]) => {
        keywords.forEach((keyword) => {
            if (text.includes(keyword)) {
                scores[trade] += 1;
            }
        });
    });

    SPECIALIZED_AREAS.forEach((area) => {
        area.keywords.forEach((keyword) => {
            if (text.includes(keyword)) {
                scores[area.trade] += 2;
            }
        });
    });

    getLearnedKeywordRows().forEach((row) => {
        if (!row?.keyword || !row?.trade || !scores[row.trade]) {
            return;
        }

        if (text.includes(row.keyword)) {
            scores[row.trade] += Math.min(4, Number(row.weight || 0));
        }
    });

    const ranked = Object.entries(scores).sort((left, right) => right[1] - left[1]);

    if (!ranked.length || ranked[0][1] === 0) {
        return null;
    }

    return ranked[0][0];
};

const inferSpecializedArea = (description) => {
    const text = normalizeProblemText(description);

    if (!text) {
        return null;
    }

    let bestArea = null;
    let bestScore = 0;

    SPECIALIZED_AREAS.forEach((area) => {
        const score = area.keywords.reduce((count, keyword) => {
            return count + (text.includes(keyword) ? 1 : 0);
        }, 0);

        if (score > bestScore) {
            bestScore = score;
            bestArea = area;
        }
    });

    return bestScore > 0 ? bestArea : null;
};

const buildFallbackAnalysis = ({ description, urgency }) => {
    const text = normalizeProblemText(description);
    const urgencyText = normalizeProblemText(urgency);
    const urgencyMap = {
        notfall: 'Notfall',
        hoch: 'Hoch',
        mittel: 'Mittel',
        niedrig: 'Niedrig'
    };

    const mappedPriority = urgencyMap[urgencyText] || 'Mittel';
    const resolvedPriority = inferPriorityOverride(text, mappedPriority);

    const specializedArea = inferSpecializedArea(text);
    if (specializedArea) {
        return {
            title: specializedArea.title,
            summary: specializedArea.summary,
            trade: specializedArea.trade,
            priority: resolvedPriority,
            confidence: specializedArea.confidence,
            tags: specializedArea.tags,
            source: 'fallback'
        };
    }

    const rules = [
        {
            trade: 'sanitaer',
            title: 'Sanitaerproblem erkannt',
            summary: 'Die Beschreibung deutet auf ein Wasser-, Rohr- oder Armaturenproblem hin. Ein Sanitairbetrieb ist hier die passende Wahl.',
            confidence: '88%',
            tags: ['Wasser', 'Leitung', 'Sanitaer'],
            keywords: TRADE_KEYWORDS.sanitaer
        },
        {
            trade: 'elektro',
            title: 'Elektroproblem erkannt',
            summary: 'Die Beschreibung deutet auf ein elektrisches Problem hin. Ein Elektrobetrieb sollte das schnell pruefen.',
            confidence: '85%',
            tags: ['Strom', 'Sicherheit', 'Elektro'],
            keywords: TRADE_KEYWORDS.elektro
        },
        {
            trade: 'dach',
            title: 'Dachproblem erkannt',
            summary: 'Die Beschreibung deutet auf ein Dach- oder Aussenschaden-Thema hin. Ein Dachdeckerbetrieb ist hier passend.',
            confidence: '84%',
            tags: ['Dach', 'Regen', 'Aussen'],
            keywords: TRADE_KEYWORDS.dach
        },
        {
            trade: 'maler',
            title: 'Oberflaechenschaden erkannt',
            summary: 'Die Beschreibung passt zu Wand-, Decken- oder Oberflaechenschaeden. Ein Malerbetrieb kann den Schaden instand setzen.',
            confidence: '81%',
            tags: ['Wand', 'Decke', 'Sanierung'],
            keywords: TRADE_KEYWORDS.maler
        }
    ];

    const match = rules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)));

    if (match) {
        return {
            title: match.title,
            summary: match.summary,
            trade: match.trade,
            priority: resolvedPriority,
            confidence: match.confidence,
            tags: match.tags,
            source: 'fallback'
        };
    }

    const inferredTrade = inferTradeByKeywords(text);
    if (inferredTrade) {
        return {
            title: 'Problem erkannt',
            summary: 'Die Beschreibung passt zu einem klaren Handwerksfall. Es wurden passende Fachbetriebe fuer dieses Gewerk ausgewaehlt.',
            trade: inferredTrade,
            priority: resolvedPriority,
            confidence: '82%',
            tags: ['Automatische Zuordnung', 'Fachbetrieb'],
            source: 'fallback'
        };
    }

    return {
        title: 'Allround-Pruefung empfohlen',
        summary: 'Das Problem ist noch nicht eindeutig zuordenbar. Ein Allround-Betrieb kann den Schaden vor Ort pruefen und das passende Gewerk festlegen.',
        trade: 'allround',
        priority: resolvedPriority,
        confidence: '75%',
        tags: ['Pruefung', 'Allround', 'Vor-Ort-Check'],
        source: 'fallback'
    };
};

app.post('/api/analyze', async (req, res) => {
    const { description, location, propertyType, urgency, imageDataUrl } = req.body || {};
    const descriptionText = typeof description === 'string' ? description.trim() : '';

    if (!descriptionText && !imageDataUrl) {
        return res.status(400).json({ error: 'Bitte eine Problembeschreibung oder ein Foto mitsenden.' });
    }

    if (!client) {
        const fallbackAnalysis = buildFallbackAnalysis({ description: descriptionText, urgency });
        recordLearningExample({
            description: descriptionText,
            trade: fallbackAnalysis.trade,
            priority: fallbackAnalysis.priority,
            source: 'fallback-auto',
            boost: 1
        });
        return res.json({
            ...fallbackAnalysis,
            matches: rankBusinesses(fallbackAnalysis.trade, fallbackAnalysis.priority)
        });
    }

    try {
        const userContent = [
            {
                type: 'input_text',
                text: [
                    `Problembeschreibung: ${descriptionText || 'Keine Textbeschreibung (nur Fotoanalyse).'}`,
                    `Ort: ${location || 'nicht angegeben'}`,
                    `Objektart: ${propertyType || 'nicht angegeben'}`,
                    `Dringlichkeit: ${urgency || 'nicht angegeben'}`,
                    'Analysiere das Problem fuer eine Handwerker-Vermittlungsplattform.'
                ].join('\n')
            }
        ];

        if (imageDataUrl) {
            userContent.push({
                type: 'input_image',
                image_url: imageDataUrl
            });
        }

        const response = await client.responses.create({
            model,
            input: [
                {
                    role: 'system',
                    content: [
                        {
                            type: 'input_text',
                            text: [
                                'Du analysierst Schaeden und Serviceanfragen fuer eine deutsche Plattform.',
                                'Ordne das Problem einem Gewerk zu.',
                                'Erlaubte Gewerke: sanitaer, dach, elektro, maler, allround.',
                                `Lernbeispiele: ${HANDWERK_FEW_SHOTS.map((example) => `${example.problem} => ${example.trade} (${example.reason})`).join(' | ')}`,
                                `Neue Fallbeispiele: ${getLearnedFewShotExamples(6).map((example) => `${example.problem} => ${example.trade} (Prio ${example.priority}, ${example.source})`).join(' | ') || 'keine'}`,
                                'Antworte ausschliesslich als valides JSON passend zum Schema.'
                            ].join(' ')
                        }
                    ]
                },
                {
                    role: 'user',
                    content: userContent
                }
            ],
            text: {
                format: {
                    type: 'json_schema',
                    name: 'issue_analysis',
                    strict: true,
                    schema: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            title: { type: 'string' },
                            summary: { type: 'string' },
                            trade: {
                                type: 'string',
                                enum: ['sanitaer', 'dach', 'elektro', 'maler', 'allround']
                            },
                            priority: {
                                type: 'string',
                                enum: ['Notfall', 'Hoch', 'Mittel', 'Niedrig']
                            },
                            confidence: { type: 'string' },
                            tags: {
                                type: 'array',
                                items: { type: 'string' }
                            }
                        },
                        required: ['title', 'summary', 'trade', 'priority', 'confidence', 'tags']
                    }
                }
            }
        });

        const parsed = JSON.parse(response.output_text);
        const keywordTrade = inferTradeByKeywords(descriptionText);
        const resolvedTrade = keywordTrade || parsed.trade;
        const resolvedPriority = inferPriorityOverride(descriptionText, parsed.priority || 'Mittel');
        const matches = rankBusinesses(resolvedTrade, resolvedPriority);

        const summaryWithGuardrail = keywordTrade && keywordTrade !== parsed.trade
            ? `${parsed.summary} Die Zuordnung wurde anhand klarer Problembegriffe auf das passende Gewerk praezisiert.`
            : parsed.summary;

        const finalSummary = resolvedPriority !== parsed.priority
            ? `${summaryWithGuardrail} Die Prioritaet wurde wegen klarer Risikosignale automatisch auf ${resolvedPriority} gesetzt.`
            : summaryWithGuardrail;

        recordLearningExample({
            description: descriptionText,
            trade: resolvedTrade,
            priority: resolvedPriority,
            source: 'model-auto',
            boost: 1
        });

        return res.json({
            ...parsed,
            trade: resolvedTrade,
            priority: resolvedPriority,
            summary: finalSummary,
            matches
        });
    } catch (error) {
        console.error('Analyze route failed:', error);
        const fallbackAnalysis = buildFallbackAnalysis({ description: descriptionText, urgency });
        recordLearningExample({
            description: descriptionText,
            trade: fallbackAnalysis.trade,
            priority: fallbackAnalysis.priority,
            source: 'fallback-error',
            boost: 1
        });
        return res.json({
            ...fallbackAnalysis,
            summary: `${fallbackAnalysis.summary} (KI-Fallback aktiv, weil der KI-Dienst gerade nicht erreichbar war.)`,
            matches: rankBusinesses(fallbackAnalysis.trade, fallbackAnalysis.priority)
        });
    }
});

app.post('/api/analyze/feedback', (req, res) => {
    const description = String(req.body?.description || '').trim();
    const trade = String(req.body?.trade || '').trim();
    const priority = String(req.body?.priority || 'Mittel').trim();
    const allowedTrades = new Set(['sanitaer', 'dach', 'elektro', 'maler', 'allround']);
    const allowedPriorities = new Set(['Notfall', 'Hoch', 'Mittel', 'Niedrig']);

    if (!description || !allowedTrades.has(trade)) {
        return res.status(400).json({ error: 'description und gueltiges trade sind erforderlich.' });
    }

    recordLearningExample({
        description,
        trade,
        priority: allowedPriorities.has(priority) ? priority : 'Mittel',
        source: 'user-feedback',
        boost: 3
    });

    return res.json({ ok: true });
});

app.get('/api/analyze/learning-stats', (req, res) => {
    const total = getLearningCaseCountStatement.get()?.total || 0;
    const byTrade = getLearningCasesByTradeStatement.all();
    const topKeywords = getLearnedKeywordRows().slice(0, 15);

    return res.json({
        totalCases: total,
        byTrade,
        topKeywords
    });
});

/* ── Analysis follow-up chat ── */
app.post('/api/analysis-chat', async (req, res) => {
    const { messages, context, imageDataUrl } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Keine Chat-Nachrichten uebermittelt.' });
    }

    if (!client) {
        const trade = context?.trade === 'sanitaer' ? 'Sanitaer' : (context?.trade || 'Allround');
        return res.json({
            reply: `Ich habe dein Anliegen aufgenommen und auf ${trade} eingeordnet. Du kannst direkt mit den vorgeschlagenen Betrieben chatten, ein Angebot anfragen und den passenden Termin abstimmen.`
        });
    }

    try {
        const systemPrompt = [
            'Du bist der Nailit KI-Assistent fuer eine deutsche Handwerker-Vermittlungsplattform.',
            'Du hilfst Nutzern, ihren Schaden zu verstehen und den passenden Handwerker zu finden.',
            'Antworte freundlich, hilfreich und auf Deutsch.',
            'Halte Antworten praegnant (max 3-4 Saetze), ausser der Nutzer fragt nach Details.',
            'Erlaubte Gewerke: Sanitaer, Dachdecker, Elektro, Maler, Allround.',
        ];

        if (context) {
            systemPrompt.push(
                'Bisherige Analyse: ' + JSON.stringify({
                    title: context.title,
                    summary: context.summary,
                    trade: context.trade,
                    priority: context.priority,
                    confidence: context.confidence,
                    tags: context.tags
                })
            );
        }

        const inputMessages = [
            {
                role: 'system',
                content: [{ type: 'input_text', text: systemPrompt.join(' ') }]
            }
        ];

        // Add first user message with image if available
        let firstUserAdded = false;
        for (const msg of messages) {
            const content = [];

            if (msg.role === 'user' && !firstUserAdded && imageDataUrl) {
                content.push({ type: 'input_image', image_url: imageDataUrl });
                firstUserAdded = true;
            }

            content.push({ type: 'input_text', text: msg.content });

            inputMessages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content
            });
        }

        const response = await client.responses.create({
            model,
            input: inputMessages
        });

        return res.json({ reply: response.output_text });

    } catch (error) {
        console.error('Analysis chat failed:', error);
        return res.json({
            reply: 'Die Live-KI ist gerade ausgelastet. Du kannst trotzdem mit den vorgeschlagenen Betrieben chatten und direkt ein Angebot anfragen.'
        });
    }
});

app.get('*', (req, res) => {
    // Let static files (analysis.html, contractors.html, etc.) be served first
    // This catch-all only handles unmatched routes for SPA fallback
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Nailit server listening on http://localhost:${port}`);
});