require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const OpenAI = require('openai');

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
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

app.post('/api/analyze', async (req, res) => {
    const { description, location, propertyType, urgency, imageDataUrl } = req.body || {};

    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Bitte eine Problembeschreibung mitsenden.' });
    }

    if (!client) {
        return res.status(503).json({
            error: 'OPENAI_API_KEY fehlt. Lege eine .env mit OPENAI_API_KEY an und starte den Server neu.'
        });
    }

    try {
        const userContent = [
            {
                type: 'input_text',
                text: [
                    `Problembeschreibung: ${description}`,
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
        const matches = rankBusinesses(parsed.trade, parsed.priority);

        return res.json({
            ...parsed,
            matches
        });
    } catch (error) {
        console.error('Analyze route failed:', error);
        return res.status(500).json({
            error: 'Die KI-Auswertung ist fehlgeschlagen. Bitte pruefe API-Key, Modell und Server-Logs.'
        });
    }
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Nailit server listening on http://localhost:${port}`);
});