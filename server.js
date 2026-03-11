require('dotenv').config();

const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

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

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

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