const body = document.body;
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
const revealElements = document.querySelectorAll('.reveal');
const aiIssueForm = document.getElementById('aiIssueForm');
const issueMedia = document.getElementById('issueMedia');
const uploadHint = document.getElementById('uploadHint');
const heroServiceSearch = document.getElementById('heroServiceSearch');
const heroServiceInput = document.getElementById('heroServiceInput');
const heroPhotoInput = document.getElementById('heroPhotoInput');
const heroPhotoTrigger = document.getElementById('heroPhotoTrigger');
const contractorSearchForm = document.getElementById('contractorSearchForm');
const contractorSearchInput = document.getElementById('contractorSearchInput');
const contractorTradeFilter = document.getElementById('contractorTradeFilter');
const contractorCityFilter = document.getElementById('contractorCityFilter');
const contractorResetButton = document.getElementById('contractorResetButton');
const contractorResultCount = document.getElementById('contractorResultCount');
const contractorEmptyState = document.getElementById('contractorEmptyState');
const contractorsGrid = document.getElementById('contractorsGrid');
let contractorCards = Array.from(document.querySelectorAll('.contractor-card'));
const navAuthLinks = document.querySelectorAll('.nav-auth [data-auth-view]');
const authTabs = document.querySelectorAll('.auth-tab');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const accountsSection = document.getElementById('accounts');
const authModalClose = document.getElementById('authModalClose');
const authModalBackdrop = document.getElementById('authModalBackdrop');
const registerBusinessFields = document.getElementById('registerBusinessFields');
const registerSuccess = document.getElementById('registerSuccess');
const registerError = document.getElementById('registerError');
const loginSuccess = document.getElementById('loginSuccess');
const loginError = document.getElementById('loginError');
const aiDiagnoseModal = document.getElementById('ai-diagnose');
const aiDiagnoseClose = document.getElementById('aiDiagnoseClose');
const aiDiagnoseBackdrop = document.getElementById('aiDiagnoseBackdrop');
const contractorChatModal = document.getElementById('contractorChatModal');
const contractorChatBackdrop = document.getElementById('contractorChatBackdrop');
const contractorChatClose = document.getElementById('contractorChatClose');
const contractorChatTitle = document.getElementById('contractorChatTitle');
const contractorChatSubtitle = document.getElementById('contractorChatSubtitle');
const contractorChatMessages = document.getElementById('contractorChatMessages');
const contractorChatForm = document.getElementById('contractorChatForm');
const contractorChatInput = document.getElementById('contractorChatInput');
const contractorChatStatus = document.getElementById('contractorChatStatus');
const appointmentToggle = document.getElementById('appointmentToggle');
const appointmentHelper = document.getElementById('appointmentHelper');
const appointmentPanel = document.getElementById('appointmentPanel');
const appointmentDate = document.getElementById('appointmentDate');
const appointmentTime = document.getElementById('appointmentTime');
const appointmentDuration = document.getElementById('appointmentDuration');
const appointmentPriceField = document.getElementById('appointmentPriceField');
const appointmentPrice = document.getElementById('appointmentPrice');
const appointmentNote = document.getElementById('appointmentNote');
const appointmentSend = document.getElementById('appointmentSend');
const appointmentCancel = document.getElementById('appointmentCancel');
const paymentModal = document.getElementById('paymentModal');
const paymentBackdrop = document.getElementById('paymentBackdrop');
const paymentClose = document.getElementById('paymentClose');
const paymentForm = document.getElementById('paymentForm');
const paymentBusiness = document.getElementById('paymentBusiness');
const paymentAmount = document.getElementById('paymentAmount');
const paymentStatus = document.getElementById('paymentStatus');
const paymentCancel = document.getElementById('paymentCancel');
const paymentProviderHint = document.getElementById('paymentProviderHint');
const paymentTransferDetails = document.getElementById('paymentTransferDetails');
const paymentDemoPanel = document.getElementById('paymentDemoPanel');
const paymentDemoTitle = document.getElementById('paymentDemoTitle');
const paymentDemoText = document.getElementById('paymentDemoText');
const paymentDemoConfirm = document.getElementById('paymentDemoConfirm');
const paymentDemoCancel = document.getElementById('paymentDemoCancel');
const directoryBackLink = document.getElementById('directoryBackLink');
const navUserStatus = document.getElementById('navUserStatus');
const navUserName = document.getElementById('navUserName');
const navUserRole = document.getElementById('navUserRole');
const logoutButton = document.getElementById('logoutButton');
const sessionPanel = document.getElementById('sessionPanel');
const sessionTitle = document.getElementById('sessionTitle');
const sessionSummary = document.getElementById('sessionSummary');
const analysisTitle = document.getElementById('analysisTitle');
const analysisSummary = document.getElementById('analysisSummary');
const analysisTrade = document.getElementById('analysisTrade');
const analysisPriority = document.getElementById('analysisPriority');
const analysisConfidence = document.getElementById('analysisConfidence');
const analysisTags = document.getElementById('analysisTags');
const matchList = document.getElementById('matchList');
const issueDescription = document.getElementById('issueDescription');
const mergedDescriptionPreview = document.getElementById('mergedDescriptionPreview');
const issueLocation = document.getElementById('issueLocation');
const propertyType = document.getElementById('propertyType');
const urgencyField = document.getElementById('urgency');
const aiSubmitButton = aiIssueForm?.querySelector('button[type="submit"]');
const contractorSection = document.getElementById('contractors');
const isContractorsPage = window.location.pathname.endsWith('/contractors.html') || window.location.pathname.endsWith('contractors.html');
const isDirectChatPage = window.location.pathname.endsWith('/direct-chat.html') || window.location.pathname.endsWith('direct-chat.html');
const DIRECT_CHAT_SCOPE = 'direct-shared';

const SEARCH_ALIASES = {
    elektriker: ['elektro', 'elektrik', 'strom', 'steckdose', 'sicherung'],
    elektro: ['elektriker', 'elektrik', 'strom', 'steckdose', 'sicherung'],
    sanitar: ['sanitaer', 'sanitar', 'installateur', 'klempner', 'wasser', 'rohr'],
    sanitaer: ['sanitar', 'installateur', 'klempner', 'wasser', 'rohr'],
    installateur: ['sanitaer', 'sanitar', 'klempner', 'wasser', 'rohr'],
    klempner: ['sanitaer', 'sanitar', 'installateur', 'wasser', 'rohr'],
    dachdecker: ['dach', 'dachsanierung', 'dachrinne', 'ziegel'],
    dach: ['dachdecker', 'dachsanierung', 'dachrinne', 'ziegel'],
    maler: ['streichen', 'farbe', 'wand', 'fassade'],
    heizung: ['sanitaer', 'heizungsinstallation', 'waermepumpe'],
    klima: ['heizung', 'klimaanlage', 'lueftung']
};

const TRADE_LABELS = {
    sanitaer: 'Sanitaer',
    dach: 'Dach',
    elektro: 'Elektro',
    maler: 'Maler',
    allround: 'Allround'
};

const STORAGE_KEYS = {
    accounts: 'nailit.accounts',
    session: 'nailit.session',
    chats: 'nailit.chats'
};

let activeChatBusiness = null;
let activePaymentOfferId = null;
let liveChatEventSource = null;
let liveChatSubscriptionKey = '';
let liveChatPollInterval = null;
let paymentConfig = {
    stripeCheckoutUrl: '',
    paypalCheckoutUrl: '',
    stripeEnabled: false,
    paypalEnabled: false,
    bankTransfer: {
        holder: 'Nailit Services GmbH',
        iban: 'DE12500105170648489890',
        bic: 'INGDDEFFXXX',
        bank: 'Nailit Partnerbank'
    }
};

const PAYMENT_METHODS = {
    stripe: 'Stripe Checkout',
    paypal: 'PayPal',
    applepay: 'Apple Pay',
    invoice: 'Rechnung',
    transfer: 'Bankueberweisung',
    klarna: 'Klarna'
};

const IMMEDIATE_PAYMENT_METHODS = new Set(['stripe', 'paypal', 'applepay', 'klarna']);
const TRACKED_SETTLEMENT_METHODS = new Set(['invoice', 'transfer']);
const EXTERNAL_CHECKOUT_METHODS = new Set(['stripe', 'paypal']);
const LOCAL_DEMO_CHECKOUT_METHODS = new Set(['stripe', 'paypal', 'applepay', 'klarna']);

const businesses = {
    sanitaer: [
        {
            name: 'Meyer Sanitair Notdienst',
            city: 'Berlin Mitte',
            distance: '4 km',
            availability: 'Heute verfuegbar',
            specialty: 'Rohrleck, Feuchtigkeit, Bad',
            score: '98 Match'
        },
        {
            name: 'AquaFix Haustechnik',
            city: 'Berlin Prenzlauer Berg',
            distance: '7 km',
            availability: 'In 3 Stunden',
            specialty: 'Leitungen und Armaturen',
            score: '94 Match'
        },
        {
            name: 'Klarfluss Service',
            city: 'Berlin Friedrichshain',
            distance: '9 km',
            availability: 'Morgen frueh',
            specialty: 'Abfluss und Wasserschaden',
            score: '91 Match'
        }
    ],
    dach: [
        {
            name: 'Norddach Meisterbetrieb',
            city: 'Berlin Spandau',
            distance: '11 km',
            availability: 'Heute verfuegbar',
            specialty: 'Undichte Daecher und Sturmschaeden',
            score: '96 Match'
        },
        {
            name: 'Dachwacht Berlin',
            city: 'Berlin Tempelhof',
            distance: '8 km',
            availability: 'Morgen',
            specialty: 'Leckageortung und Reparatur',
            score: '92 Match'
        },
        {
            name: 'FirstRoof Solutions',
            city: 'Berlin Neukoelln',
            distance: '13 km',
            availability: 'In 24 Stunden',
            specialty: 'Flachdach und Abdichtung',
            score: '89 Match'
        }
    ],
    elektro: [
        {
            name: 'Voltwerk Elektroservice',
            city: 'Berlin Wedding',
            distance: '5 km',
            availability: 'Heute verfuegbar',
            specialty: 'Kurzschluss und Ausfall',
            score: '97 Match'
        },
        {
            name: 'Lichtpunkt Technik',
            city: 'Berlin Charlottenburg',
            distance: '9 km',
            availability: 'In 5 Stunden',
            specialty: 'Sicherungskasten und Leitungen',
            score: '93 Match'
        },
        {
            name: 'Elektro Urban',
            city: 'Berlin Kreuzberg',
            distance: '6 km',
            availability: 'Morgen frueh',
            specialty: 'Wohnungs- und Hausinstallationen',
            score: '90 Match'
        }
    ],
    maler: [
        {
            name: 'Raumfarbe Pro',
            city: 'Berlin Steglitz',
            distance: '10 km',
            availability: 'Diese Woche',
            specialty: 'Wand, Decke, Feuchtigkeitsfolgen',
            score: '91 Match'
        },
        {
            name: 'Malerteam Weiss',
            city: 'Berlin Mitte',
            distance: '4 km',
            availability: 'In 2 Tagen',
            specialty: 'Innenanstrich und Sanierung',
            score: '89 Match'
        },
        {
            name: 'Renovio Innenausbau',
            city: 'Berlin Lichtenberg',
            distance: '12 km',
            availability: 'Naechste Woche',
            specialty: 'Wand- und Oberflaechensanierung',
            score: '86 Match'
        }
    ],
    allround: [
        {
            name: 'Haushelden Service',
            city: 'Berlin',
            distance: '6 km',
            availability: 'Heute verfuegbar',
            specialty: 'Koordination mehrerer Gewerke',
            score: '88 Match'
        },
        {
            name: 'Fixwerk Objektservice',
            city: 'Berlin',
            distance: '8 km',
            availability: 'Morgen',
            specialty: 'Allround-Reparaturen',
            score: '85 Match'
        },
        {
            name: 'Projektbau 360',
            city: 'Berlin',
            distance: '14 km',
            availability: 'In 2 Tagen',
            specialty: 'Komplexe Problemfaelle',
            score: '83 Match'
        }
    ]
};

const keywordRules = [
    {
        trade: 'sanitaer',
        title: 'Wasser- oder Rohrproblem erkannt',
        summary: 'Die Beschreibung deutet auf ein Sanitairproblem mit moeglicher Leckage, Feuchtigkeit oder defekter Leitung hin.',
        keywords: ['wasser', 'rohr', 'leck', 'tropf', 'abfluss', 'waschbecken', 'bad', 'feucht'],
        tags: ['Leckage', 'Feuchtigkeit', 'Sanitaer'],
        confidence: '94%',
        defaultPriority: 'Hoch'
    },
    {
        trade: 'dach',
        title: 'Dach- oder Aussenhuellenproblem erkannt',
        summary: 'Die Beschreibung enthaelt Hinweise auf Dachleck, Regenwassereintritt oder Beschaedigung an der Aussenhuelle.',
        keywords: ['dach', 'regen', 'ziegel', 'sturm', 'dachrinne', 'undicht'],
        tags: ['Dach', 'Aussenbereich', 'Wassereintritt'],
        confidence: '91%',
        defaultPriority: 'Hoch'
    },
    {
        trade: 'elektro',
        title: 'Elektrikproblem erkannt',
        summary: 'Die KI wuerde hier einen elektrischen Defekt, Ausfall oder eine potenzielle Sicherheitslage vermuten.',
        keywords: ['strom', 'elektr', 'sicherung', 'funken', 'licht', 'steckdose', 'kabel'],
        tags: ['Elektrik', 'Sicherheit', 'Ausfall'],
        confidence: '92%',
        defaultPriority: 'Hoch'
    },
    {
        trade: 'maler',
        title: 'Oberflaechen- oder Schaeden an Wand/Decke erkannt',
        summary: 'Die Beschreibung passt zu sichtbaren Spuren an Wand, Decke oder Oberflaechen und koennte Renovierungs- oder Sanierungsbedarf ausloesen.',
        keywords: ['wand', 'decke', 'farbe', 'schimmel', 'riss', 'fleck', 'putz'],
        tags: ['Wand', 'Decke', 'Sanierung'],
        confidence: '87%',
        defaultPriority: 'Mittel'
    }
];

const setMenuState = (isOpen) => {
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navLinks.classList.toggle('active', isOpen);
    body.classList.toggle('menu-open', isOpen);
};

const syncModalBodyState = () => {
    const anyModalOpen = [aiDiagnoseModal, accountsSection, contractorChatModal, paymentModal].some((modal) => modal && !modal.classList.contains('is-hidden'));
    body.classList.toggle('modal-open', anyModalOpen);
};

const openAiDiagnoseModal = () => {
    if (!aiDiagnoseModal) {
        return;
    }

    aiDiagnoseModal.classList.remove('is-hidden');
    syncModalBodyState();
    aiDiagnoseModal.querySelectorAll('.reveal').forEach((element) => {
        element.classList.add('active');
    });
};

const closeAiDiagnoseModal = () => {
    if (!aiDiagnoseModal) {
        return;
    }

    aiDiagnoseModal.classList.add('is-hidden');
    syncModalBodyState();
};

const closeAuthModal = () => {
    if (!accountsSection) {
        return;
    }

    accountsSection.classList.add('is-hidden');
    syncModalBodyState();
};

const getPaymentMethodLabel = (paymentMethod) => PAYMENT_METHODS[paymentMethod] || 'Zahlung';

const getActiveChatActor = () => {
    const session = getSession();

    if (session?.role === 'betrieb') {
        return {
            role: 'betrieb',
            sender: 'business',
            name: session.name || 'Betrieb'
        };
    }

    return {
        role: 'kunde',
        sender: 'customer',
        name: session?.name || 'Gast'
    };
};

const formatLongDate = (value) => {
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(value));
};

const getPaidAmount = (message) => {
    return Math.max(0, Number(message?.amountPaid || 0));
};

const getOutstandingAmount = (message) => {
    return Math.max(0, Number(message?.amount || 0) - getPaidAmount(message));
};

const getNextPartialAmount = (message) => {
    const outstandingAmount = getOutstandingAmount(message);

    if (outstandingAmount <= 0) {
        return 0;
    }

    if (!getPaidAmount(message)) {
        return Math.min(outstandingAmount, Math.max(1, Math.round(Number(message.amount || 0) / 2)));
    }

    return outstandingAmount;
};

const getOfferStatusLabel = (message) => {
    if (message.status === 'cancelled') {
        return 'Storniert';
    }

    if (message.status === 'checkout') {
        return 'Checkout offen';
    }

    if (message.status === 'paid') {
        return 'Bezahlt';
    }

    if (message.status === 'partial') {
        return 'Teilzahlung';
    }

    if (message.status === 'pending' && message.paymentMethod === 'invoice') {
        return 'Rechnung gesendet';
    }

    if (message.status === 'pending' && message.paymentMethod === 'transfer') {
        return 'Wartet auf Ueberweisung';
    }

    return 'Offen';
};

const getOfferStatusNote = (message) => {
    if (message.status === 'cancelled') {
        return message.cancelledAt
            ? `Angebot am ${formatLongDate(message.cancelledAt)} storniert.${getPaidAmount(message) ? ` Bereits bezahlt: ${formatCurrency(getPaidAmount(message))}.` : ''}`
            : 'Angebot wurde storniert.';
    }

    if (message.status === 'checkout') {
        return `${getPaymentMethodLabel(message.paymentMethod)} wurde geoeffnet. Nach der Rueckkehr wird der Chat automatisch aktualisiert.`;
    }

    if (message.paymentMethod === 'invoice' && message.invoiceNumber) {
        return `Rechnung ${message.invoiceNumber} wurde erstellt. Faellig bis ${formatLongDate(message.invoiceDueAt)}.`;
    }

    if (message.paymentMethod === 'transfer') {
        return `Bitte ueberweise ${formatCurrency(getOutstandingAmount(message) || message.amount)} unter Angabe der Referenz ${message.invoiceNumber}. Die Bankdaten stehen im PDF und direkt hier im Chat.`;
    }

    if (message.status === 'partial') {
        return `${formatCurrency(getPaidAmount(message))} von ${formatCurrency(message.amount)} wurden bereits bezahlt. Restbetrag: ${formatCurrency(getOutstandingAmount(message))}.`;
    }

    if (message.status === 'paid' && message.providerRedirected) {
        return 'Ein externer Checkout wurde geoeffnet und die Zahlung im Demo-Chat bestaetigt.';
    }

    return '';
};

const formatAppointmentDateTime = (value) => {
    const parsedValue = new Date(value);

    if (Number.isNaN(parsedValue.getTime())) {
        return 'Termin offen';
    }

    return new Intl.DateTimeFormat('de-DE', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(parsedValue);
};

const formatDurationMinutes = (value) => {
    const minutes = Number(value || 0);

    if (!minutes) {
        return 'Flexibel';
    }

    if (minutes >= 60 && minutes % 60 === 0) {
        const hours = minutes / 60;
        return `${hours} Std.`;
    }

    return `${minutes} Min.`;
};

const getSuggestedAppointmentAmount = (business) => {
    const demoOffer = getDemoOfferDetails(business);
    return Math.max(49, Math.round(Number(demoOffer.amount || 0) * 0.35));
};

const createAppointmentMessage = ({ business, scheduledAt, durationMinutes, note, price = 0, createdByRole, createdByName, status = 'proposed' }) => {
    return {
        type: 'appointment',
        sender: createdByRole === 'betrieb' ? 'business' : 'customer',
        author: createdByName,
        appointmentId: `appointment-${Date.now()}-${Math.round(Math.random() * 1000)}`,
        businessName: business.name,
        scheduledAt,
        durationMinutes: Number(durationMinutes || 0),
        note,
        price: Math.max(0, Number(price || 0)),
        status,
        createdByRole,
        createdByName,
        timestamp: new Date().toISOString()
    };
};

const createAppointmentOfferMessage = ({ business, appointment, amount = Number(appointment.price || 0) }) => {
    const normalizedAmount = Math.max(0, Number(amount || 0));

    return {
        type: 'offer',
        sender: 'business',
        author: business.name,
        offerId: `offer-${Date.now()}`,
        linkedAppointmentId: appointment.appointmentId,
        title: `Terminreservierung ${formatAppointmentDateTime(appointment.scheduledAt)}`,
        description: appointment.note
            ? `Bestaetigter Termin. Hinweis: ${appointment.note}`
            : 'Bestaetigter Vor-Ort-Termin inklusive Reservierung ueber den Direktchat.',
        amount: normalizedAmount,
        status: 'open',
        amountPaid: 0,
        paymentMethod: '',
        timestamp: new Date().toISOString()
    };
};

const updateAppointmentMessage = (appointmentId, transform, options = {}) => {
    const businessName = options.businessName || activeChatBusiness?.name;
    const scope = options.scope || getCurrentChatScope();

    if (!businessName) {
        return null;
    }

    let updatedAppointment = null;
    const updatedThread = getChatThread(businessName, scope).map((message) => {
        if (message.type === 'appointment' && message.appointmentId === appointmentId) {
            updatedAppointment = transform(message);
            return updatedAppointment;
        }

        return message;
    });

    if (!updatedAppointment) {
        return null;
    }

    saveChatThread(businessName, updatedThread, { scope });
    return updatedAppointment;
};

const getLinkedOfferForAppointment = (appointment, businessName = activeChatBusiness?.name, scope = getCurrentChatScope()) => {
    if (!appointment?.linkedOfferId || !businessName) {
        return null;
    }

    return getChatThread(businessName, scope).find((message) => {
        return message.type === 'offer' && message.offerId === appointment.linkedOfferId;
    }) || null;
};

const getAppointmentStateClass = (appointment, linkedOffer = getLinkedOfferForAppointment(appointment)) => {
    if (linkedOffer?.status === 'paid') {
        return 'paid';
    }

    if (appointment.status === 'declined') {
        return 'declined';
    }

    if (linkedOffer && ['partial', 'pending', 'checkout'].includes(linkedOffer.status)) {
        return 'pending';
    }

    if (appointment.status === 'accepted') {
        return 'accepted';
    }

    return 'proposed';
};

const getAppointmentStatusLabel = (appointment, linkedOffer = getLinkedOfferForAppointment(appointment)) => {
    if (linkedOffer?.status === 'paid') {
        return 'Bezahlt';
    }

    if (linkedOffer?.status === 'partial') {
        return 'Teilweise bezahlt';
    }

    if (linkedOffer?.status === 'pending') {
        return 'Wartet auf Zahlung';
    }

    if (linkedOffer?.status === 'checkout') {
        return 'Checkout offen';
    }

    if (appointment.status === 'declined') {
        return 'Abgelehnt';
    }

    if (appointment.status === 'accepted') {
        return 'Bestaetigt';
    }

    return 'Vorgeschlagen';
};

const getAppointmentStatusNote = (appointment, linkedOffer = getLinkedOfferForAppointment(appointment)) => {
    if (appointment.status === 'declined') {
        return appointment.createdByRole === 'betrieb'
            ? 'Der Terminvorschlag wurde auf Kundenseite abgelehnt.'
            : 'Der Betrieb hat diesen Terminvorschlag abgelehnt.';
    }

    if (linkedOffer?.status === 'paid') {
        return `${formatCurrency(linkedOffer.amount)} wurden bezahlt. Der Termin ist damit verbindlich bestaetigt.`;
    }

    if (linkedOffer?.status === 'partial') {
        return `${formatCurrency(getPaidAmount(linkedOffer))} wurden bereits bezahlt. Restbetrag: ${formatCurrency(getOutstandingAmount(linkedOffer))}.`;
    }

    if (linkedOffer?.status === 'pending') {
        return `Termin bestaetigt. Die Zahlung ueber ${formatCurrency(linkedOffer.amount)} wurde angelegt und wartet noch auf Abschluss.`;
    }

    if (linkedOffer?.status === 'checkout') {
        return `Der Termin wurde bestaetigt. Die Zahlung ueber ${getPaymentMethodLabel(linkedOffer.paymentMethod)} ist gerade im Checkout offen.`;
    }

    if (appointment.status === 'accepted') {
        return appointment.price > 0
            ? `Termin bestaetigt. Die Reservierung von ${formatCurrency(appointment.price)} kann direkt im Chat bezahlt werden.`
            : 'Termin wurde im Direktchat bestaetigt.';
    }

    return appointment.createdByRole === 'betrieb'
        ? 'Der Betrieb hat einen konkreten Termin in den Chat gelegt.'
        : 'Der Terminvorschlag wurde an den Betrieb geschickt.';
};

const renderAppointmentActions = (appointment) => {
    const actor = getActiveChatActor();
    const linkedOffer = getLinkedOfferForAppointment(appointment);
    const actions = [];

    if (appointment.status === 'proposed' && actor.role !== appointment.createdByRole) {
        actions.push(`<button type="button" class="btn btn-primary" data-appointment-accept="${escapeHtml(appointment.appointmentId)}"><i class="fas fa-calendar-check"></i> Termin annehmen</button>`);
        actions.push(`<button type="button" class="btn btn-secondary chat-offer-action-danger" data-appointment-decline="${escapeHtml(appointment.appointmentId)}"><i class="fas fa-calendar-xmark"></i> Ablehnen</button>`);
    }

    if (appointment.status === 'accepted' && linkedOffer && !['paid', 'cancelled'].includes(linkedOffer.status) && actor.role !== 'betrieb') {
        actions.push(`<button type="button" class="btn btn-secondary" data-offer-id="${escapeHtml(linkedOffer.offerId)}"><i class="fas fa-credit-card"></i> Jetzt bezahlen</button>`);
    }

    return actions.join('');
};

const seedAppointmentDefaults = () => {
    const nextHour = new Date();
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 2);

    if (appointmentDate && !appointmentDate.value) {
        appointmentDate.value = nextHour.toISOString().slice(0, 10);
    }

    if (appointmentTime && !appointmentTime.value) {
        appointmentTime.value = `${String(nextHour.getHours()).padStart(2, '0')}:00`;
    }

    if (appointmentDuration && !appointmentDuration.value) {
        appointmentDuration.value = '60';
    }
};

const resetAppointmentComposer = () => {
    if (appointmentDate) {
        appointmentDate.value = '';
    }

    if (appointmentTime) {
        appointmentTime.value = '';
    }

    if (appointmentDuration) {
        appointmentDuration.value = '60';
    }

    if (appointmentPrice) {
        appointmentPrice.value = '';
    }

    if (appointmentNote) {
        appointmentNote.value = '';
    }
};

const setAppointmentPanelOpen = (isOpen) => {
    if (!appointmentPanel) {
        return;
    }

    appointmentPanel.classList.toggle('is-hidden', !isOpen);
    appointmentToggle?.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
        seedAppointmentDefaults();
        window.setTimeout(() => {
            appointmentDate?.focus();
        }, 80);
    }
};

const updateAppointmentComposer = () => {
    const actor = getActiveChatActor();
    const isBusinessActor = actor.role === 'betrieb';

    appointmentPriceField?.classList.toggle('is-hidden', !isBusinessActor);

    if (appointmentToggle) {
        appointmentToggle.innerHTML = isBusinessActor
            ? '<i class="fas fa-calendar-plus"></i> Termin mit Preis senden'
            : '<i class="fas fa-calendar-plus"></i> Terminvorschlag senden';
    }

    if (appointmentHelper) {
        appointmentHelper.textContent = isBusinessActor
            ? 'Betriebe koennen hier konkrete Termine und eine zahlbare Reservierung in den Chat legen.'
            : 'Kunden koennen hier konkrete Terminfenster anfragen. Die Bestaetigung und Zahlung laufen danach direkt im Chat.';
    }
};

const simulateBusinessAppointmentResponse = (appointment, business = activeChatBusiness) => {
    if (!business) {
        return;
    }

    const currentThread = getChatThread(business.name);
    const existingAppointment = currentThread.find((message) => {
        return message.type === 'appointment' && message.appointmentId === appointment.appointmentId;
    });

    if (!existingAppointment || existingAppointment.status !== 'proposed') {
        return;
    }

    const quotedAmount = existingAppointment.price || getSuggestedAppointmentAmount(business);
    const offerMessage = createAppointmentOfferMessage({
        business,
        appointment: {
            ...existingAppointment,
            price: quotedAmount
        },
        amount: quotedAmount
    });
    const now = new Date().toISOString();
    const updatedThread = currentThread.map((message) => {
        if (message.type === 'appointment' && message.appointmentId === appointment.appointmentId) {
            return {
                ...message,
                status: 'accepted',
                acceptedAt: now,
                acceptedByRole: 'betrieb',
                acceptedByName: business.name,
                price: quotedAmount,
                linkedOfferId: offerMessage.offerId
            };
        }

        return message;
    });

    updatedThread.push({
        sender: 'business',
        author: business.name,
        text: `Wir haben den Termin am ${formatAppointmentDateTime(existingAppointment.scheduledAt)} bestaetigt. Die Reservierung kannst du jetzt direkt hier im Chat bezahlen.`,
        timestamp: now
    });
    updatedThread.push(offerMessage);
    saveChatThread(business.name, updatedThread);

    if (contractorChatStatus && activeChatBusiness?.name === business.name) {
        contractorChatStatus.textContent = `Termin fuer ${business.name} wurde bestaetigt und zur Zahlung freigegeben.`;
    }

    if (activeChatBusiness?.name === business.name) {
        renderChatThread();
    }
};

const toPdfText = (value) => {
    return String(value || '')
        .normalize('NFKD')
        .replace(/[^\x20-\x7E]/g, '')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
};

const createPdfBlob = (lines) => {
    const content = ['BT', '/F1 12 Tf', '50 790 Td', '16 TL'];

    lines.forEach((line, index) => {
        if (index > 0) {
            content.push('T*');
        }

        content.push(`(${toPdfText(line)}) Tj`);
    });

    content.push('ET');
    const stream = `${content.join('\n')}\n`;
    const objects = [
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
        '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
        '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
        `4 0 obj << /Length ${stream.length} >> stream\n${stream}endstream endobj`,
        '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj'
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((object) => {
        offsets.push(pdf.length);
        pdf += `${object}\n`;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';

    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });

    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    return new Blob([pdf], { type: 'application/pdf' });
};

const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const createInvoiceData = ({ business, offer, paymentMethod }) => {
    const session = getSession();
    const now = new Date();
    const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const invoiceNumber = `NIT-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(now.getTime()).slice(-4)}`;

    return {
        invoiceNumber,
        invoiceCreatedAt: now.toISOString(),
        invoiceDueAt: dueDate.toISOString(),
        customerName: session?.name || 'Gastkunde',
        customerEmail: session?.email || 'gast@nailit.local',
        businessName: business.name,
        businessCity: business.city,
        paymentMethod,
        transferHolder: paymentConfig.bankTransfer.holder,
        transferIban: paymentConfig.bankTransfer.iban,
        transferBic: paymentConfig.bankTransfer.bic,
        transferBank: paymentConfig.bankTransfer.bank,
        offerTitle: offer.title,
        offerAmount: offer.amount
    };
};

const downloadOfferInvoice = (message) => {
    const invoiceLines = [
        'Nailit - Rechnungsbestaetigung',
        '',
        `Rechnungsnummer: ${message.invoiceNumber || 'offen'}`,
        `Datum: ${formatLongDate(message.invoiceCreatedAt || message.timestamp)}`,
        `Faellig am: ${formatLongDate(message.invoiceDueAt || message.timestamp)}`,
        '',
        `Kunde: ${message.customerName || 'Gastkunde'}`,
        `E-Mail: ${message.customerEmail || 'gast@nailit.local'}`,
        `Betrieb: ${message.businessName || activeChatBusiness?.name || 'Handwerksbetrieb'}`,
        `Ort: ${message.businessCity || activeChatBusiness?.city || 'Deutschland'}`,
        '',
        `Leistung: ${message.title}`,
        `Beschreibung: ${message.description}`,
        `Betrag: ${formatCurrency(message.amount)}`,
        `Bereits bezahlt: ${formatCurrency(getPaidAmount(message))}`,
        `Restbetrag: ${formatCurrency(getOutstandingAmount(message))}`,
        `Zahlungsart: ${getPaymentMethodLabel(message.paymentMethod)}`,
        `Status: ${getOfferStatusLabel(message)}`,
        ''
    ];

    if (message.paymentMethod === 'transfer') {
        invoiceLines.push(`Kontoinhaber: ${message.transferHolder || paymentConfig.bankTransfer.holder}`);
        invoiceLines.push(`IBAN: ${message.transferIban || paymentConfig.bankTransfer.iban}`);
        invoiceLines.push(`BIC: ${message.transferBic || paymentConfig.bankTransfer.bic}`);
        invoiceLines.push(`Bank: ${message.transferBank || paymentConfig.bankTransfer.bank}`);
        invoiceLines.push(`Verwendungszweck: ${message.invoiceNumber}`);
        invoiceLines.push('');
    }

    invoiceLines.push('Vielen Dank fuer die Nutzung von Nailit.');

    downloadBlob(createPdfBlob(invoiceLines), `${message.invoiceNumber || 'nailit-rechnung'}.pdf`);
};

const getProviderCheckoutUrl = (paymentMethod) => {
    if (paymentMethod === 'stripe') {
        return paymentConfig.stripeCheckoutUrl;
    }

    if (paymentMethod === 'paypal') {
        return paymentConfig.paypalCheckoutUrl;
    }

    return '';
};

const hasLivePaymentSupport = (paymentMethod) => {
    if (paymentMethod === 'stripe') {
        return Boolean(paymentConfig.stripeEnabled || paymentConfig.stripeCheckoutUrl);
    }

    if (paymentMethod === 'paypal') {
        return Boolean(paymentConfig.paypalEnabled || paymentConfig.paypalCheckoutUrl);
    }

    return false;
};

const shouldUseLocalDemoCheckout = (paymentMethod, providerUrl = '') => {
    if (!LOCAL_DEMO_CHECKOUT_METHODS.has(paymentMethod)) {
        return false;
    }

    return !providerUrl && !hasLivePaymentSupport(paymentMethod);
};

const getLocalDemoCheckoutCopy = (paymentMethod) => {
    if (paymentMethod === 'stripe') {
        return {
            title: 'Stripe lokal testen',
            text: 'Stripe ist in dieser Vorschau nicht live verbunden. Du kannst die Zahlung hier lokal bestaetigen und den kompletten Chat- und Status-Flow testen.'
        };
    }

    if (paymentMethod === 'paypal') {
        return {
            title: 'PayPal lokal testen',
            text: 'PayPal ist in dieser Vorschau nicht live verbunden. Mit der Demo-Bestaetigung pruefst du trotzdem Rueckmeldung, Statuswechsel und Chat-Aktualisierung.'
        };
    }

    if (paymentMethod === 'applepay') {
        return {
            title: 'Apple Pay lokal testen',
            text: 'Apple Pay ist aktuell als lokaler Demo-Flow hinterlegt. Nach der Bestaetigung wird das Angebot in Nailit direkt als bezahlt markiert.'
        };
    }

    return {
        title: 'Klarna lokal testen',
        text: 'Klarna ist aktuell als lokaler Demo-Flow hinterlegt. So kannst du den Bezahlstatus in Nailit pruefen, ohne einen externen Provider anzubinden.'
    };
};

const updatePaymentDemoState = () => {
    if (!paymentForm || !paymentDemoPanel) {
        return;
    }

    const selectedMethod = String(new FormData(paymentForm).get('paymentMethod') || 'stripe');
    const providerUrl = getProviderCheckoutUrl(selectedMethod);
    const showDemoPanel = shouldUseLocalDemoCheckout(selectedMethod, providerUrl);

    paymentDemoPanel.classList.toggle('is-hidden', !showDemoPanel);

    if (showDemoPanel) {
        const copy = getLocalDemoCheckoutCopy(selectedMethod);
        if (paymentDemoTitle) {
            paymentDemoTitle.textContent = copy.title;
        }
        if (paymentDemoText) {
            paymentDemoText.textContent = copy.text;
        }
    }
};

const createStripeCheckoutSession = async ({ offer, business }) => {
    const scope = getCurrentChatScope();
    const response = await fetch('/api/payments/stripe/checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: offer.amount,
            title: offer.title,
            offerId: offer.offerId,
            businessName: business.name,
            scope
        })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || 'Stripe Checkout konnte nicht gestartet werden.');
    }

    return payload;
};

const verifyStripeCheckoutSession = async (sessionId) => {
    const response = await fetch(`/api/payments/stripe/session-status?sessionId=${encodeURIComponent(sessionId)}`);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || 'Stripe Session konnte nicht geprueft werden.');
    }

    return payload;
};

const createPaypalOrder = async ({ offer, business }) => {
    const response = await fetch('/api/payments/paypal/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: offer.amount,
            title: offer.title,
            offerId: offer.offerId,
            businessName: business.name,
            scope: getCurrentChatScope()
        })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || 'PayPal Bestellung konnte nicht gestartet werden.');
    }

    return payload;
};

const capturePaypalOrder = async (orderId) => {
    const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || 'PayPal Zahlung konnte nicht bestaetigt werden.');
    }

    return payload;
};

const getProviderHintText = (selectedMethod) => {
    if (selectedMethod === 'stripe') {
        if (paymentConfig.stripeEnabled) {
            return 'Stripe ist live konfiguriert. Beim Bestaetigen wird eine echte Checkout Session auf dem Server erstellt.';
        }

        return paymentConfig.stripeCheckoutUrl
            ? 'Stripe verwendet aktuell einen statischen Fallback-Link. Mit STRIPE_SECRET_KEY wird stattdessen automatisch eine echte Checkout Session erzeugt.'
            : 'Stripe ist vorbereitet. Fuer echte Checkout Sessions muss nur noch STRIPE_SECRET_KEY in der .env gesetzt werden.';
    }

    if (selectedMethod === 'paypal') {
        return paymentConfig.paypalEnabled
            ? 'PayPal ist live konfiguriert und wird beim Bestaetigen in einem neuen Tab geoeffnet.'
            : paymentConfig.paypalCheckoutUrl
                ? 'PayPal verwendet aktuell einen statischen Fallback-Link. Mit API-Credentials kann Nailit Bestellungen serverseitig erstellen und nach Rueckkehr automatisch bestaetigen.'
                : 'PayPal ist vorbereitet. In der lokalen Vorschau kannst du den Flow direkt in Nailit testen.';
    }

    if (selectedMethod === 'applepay') {
        return 'Apple Pay ist aktuell als lokaler Nailit-Checkout hinterlegt. Fuer einen echten Wallet-Flow braucht es spaeter eine Provider-Anbindung.';
    }

    if (selectedMethod === 'klarna') {
        return 'Klarna ist aktuell als lokaler Nailit-Checkout hinterlegt. Fuer einen echten Klarna-Flow braucht es spaeter eine Provider-Anbindung.';
    }

    if (selectedMethod === 'invoice') {
        return 'Nach der Auswahl wird die Rechnung direkt im Chat abgelegt und kann als PDF heruntergeladen werden.';
    }

    if (selectedMethod === 'transfer') {
        return 'Die Ueberweisung erzeugt eine Referenz und zeigt die Bankdaten direkt in Nailit an.';
    }

    return `${getPaymentMethodLabel(selectedMethod)} wird direkt im Chat als Zahlungsart gespeichert.`;
};

const getOfferStateClass = (message) => {
    if (message.status === 'partial') {
        return 'partial';
    }

    if (message.status === 'cancelled') {
        return 'cancelled';
    }

    return message.status;
};

const renderOfferActions = (message) => {
    const actions = [];
    const outstandingAmount = getOutstandingAmount(message);
    const canTrackSettlement = TRACKED_SETTLEMENT_METHODS.has(message.paymentMethod) && !['paid', 'cancelled'].includes(message.status);

    if (message.status === 'open') {
        actions.push(`<button type="button" class="btn btn-primary chat-offer-pay-btn" data-offer-id="${escapeHtml(message.offerId)}"><i class="fas fa-credit-card"></i> Zahlungsart waehlen</button>`);
    } else {
        const settledLabel = message.status === 'checkout'
            ? `${getPaymentMethodLabel(message.paymentMethod)} Checkout geoeffnet`
            : message.status === 'pending'
            ? (message.paymentMethod === 'invoice' ? 'Rechnung im Chat bereitgestellt' : 'Ueberweisung wartet auf Zahlungseingang')
            : message.status === 'partial'
                ? `Teilzahlung erfasst: ${formatCurrency(getPaidAmount(message))}`
                : message.status === 'cancelled'
                    ? 'Angebot storniert'
                    : `Zahlung per ${getPaymentMethodLabel(message.paymentMethod)} bestaetigt`;
        const iconClass = message.status === 'cancelled'
            ? 'fa-ban'
            : message.status === 'partial' || message.status === 'pending' || message.status === 'checkout'
                ? 'fa-hourglass-half'
                : 'fa-circle-check';

        actions.push(`<div class="chat-offer-paid${message.status === 'pending' || message.status === 'partial' || message.status === 'checkout' ? ' is-pending' : ''}${message.status === 'cancelled' ? ' is-cancelled' : ''}"><i class="fas ${iconClass}"></i> ${escapeHtml(settledLabel)}</div>`);
    }

    if (canTrackSettlement && outstandingAmount > 0) {
        const partialAmount = getNextPartialAmount(message);

        if (partialAmount > 0 && partialAmount < outstandingAmount) {
            actions.push(`<button type="button" class="btn btn-secondary" data-offer-partial="${escapeHtml(message.offerId)}"><i class="fas fa-coins"></i> Anzahlung ${escapeHtml(formatCurrency(partialAmount))}</button>`);
        }

        actions.push(`<button type="button" class="btn btn-secondary" data-offer-complete="${escapeHtml(message.offerId)}"><i class="fas fa-check-double"></i> Rest als bezahlt</button>`);
    }

    if (!['paid', 'cancelled', 'checkout'].includes(message.status)) {
        actions.push(`<button type="button" class="btn btn-secondary chat-offer-action-danger" data-offer-cancel="${escapeHtml(message.offerId)}"><i class="fas fa-ban"></i> Stornieren</button>`);
    }

    if (message.invoiceNumber) {
        actions.push(`<button type="button" class="btn btn-secondary" data-download-invoice="${escapeHtml(message.offerId)}"><i class="fas fa-file-pdf"></i> PDF-Rechnung</button>`);
    }

    if (message.paymentMethod === 'transfer') {
        actions.push(`<button type="button" class="btn btn-secondary" data-copy-transfer="${escapeHtml(message.offerId)}"><i class="fas fa-copy"></i> IBAN kopieren</button>`);
    }

    return actions.join('');
};

const updatePaymentMethodDetails = () => {
    if (!paymentForm) {
        return;
    }

    const selectedMethod = String(new FormData(paymentForm).get('paymentMethod') || 'stripe');
    const providerUrl = getProviderCheckoutUrl(selectedMethod);

    if (paymentProviderHint) {
        paymentProviderHint.textContent = providerUrl && selectedMethod === 'paypal'
            ? `${getProviderHintText(selectedMethod)} Ein externer Checkout-Link ist bereits hinterlegt.`
            : getProviderHintText(selectedMethod);
    }

    if (paymentTransferDetails) {
        if (selectedMethod === 'transfer') {
            paymentTransferDetails.classList.remove('is-hidden');
            paymentTransferDetails.innerHTML = `
                <strong>Bankdaten fuer die Ueberweisung</strong>
                <div class="payment-transfer-grid">
                    <div>
                        <span>Kontoinhaber</span>
                        <strong>${escapeHtml(paymentConfig.bankTransfer.holder)}</strong>
                    </div>
                    <div>
                        <span>Bank</span>
                        <strong>${escapeHtml(paymentConfig.bankTransfer.bank)}</strong>
                    </div>
                    <div>
                        <span>IBAN</span>
                        <strong>${escapeHtml(paymentConfig.bankTransfer.iban)}</strong>
                    </div>
                    <div>
                        <span>BIC</span>
                        <strong>${escapeHtml(paymentConfig.bankTransfer.bic)}</strong>
                    </div>
                </div>
            `;
        } else {
            paymentTransferDetails.classList.add('is-hidden');
            paymentTransferDetails.innerHTML = '';
        }
    }

    updatePaymentDemoState();
};

const loadPaymentConfig = async () => {
    try {
        const response = await fetch('/api/payments/config');

        if (!response.ok) {
            return;
        }

        const config = await response.json();
        if (config && typeof config === 'object') {
            paymentConfig = {
                ...paymentConfig,
                ...config,
                bankTransfer: {
                    ...paymentConfig.bankTransfer,
                    ...(config.bankTransfer || {})
                }
            };
        }
    } catch (error) {
        // Static preview via Python server has no payment config endpoint.
    } finally {
        updatePaymentMethodDetails();
    }
};

const closePaymentModal = () => {
    paymentModal?.classList.add('is-hidden');

    if (paymentStatus) {
        paymentStatus.textContent = '';
    }

    if (paymentDemoConfirm) {
        paymentDemoConfirm.onclick = null;
    }

    if (paymentDemoCancel) {
        paymentDemoCancel.onclick = null;
    }

    activePaymentOfferId = null;
    syncModalBodyState();
};

const finalizePaymentFlow = ({ paymentMethod, existingOffer, providerUrl = '', externalReference = '', invoiceData = {}, usedDemoCheckout = false }) => {
    if (!activeChatBusiness || !activePaymentOfferId) {
        return;
    }

    const isImmediatePayment = IMMEDIATE_PAYMENT_METHODS.has(paymentMethod);
    const isExternalCheckout = EXTERNAL_CHECKOUT_METHODS.has(paymentMethod);
    const markPaidImmediately = usedDemoCheckout || !isExternalCheckout;

    const updatedThread = getChatThread(activeChatBusiness.name).map((message) => {
        if (message.type === 'offer' && message.offerId === activePaymentOfferId) {
            return {
                ...message,
                status: isExternalCheckout && !markPaidImmediately ? 'checkout' : isImmediatePayment ? 'paid' : 'pending',
                paymentMethod,
                amountPaid: markPaidImmediately && isImmediatePayment ? Number(message.amount || 0) : getPaidAmount(message),
                paidAt: markPaidImmediately && isImmediatePayment ? new Date().toISOString() : '',
                providerRedirected: Boolean(providerUrl),
                externalReference,
                checkoutRequestedAt: isExternalCheckout && !markPaidImmediately ? new Date().toISOString() : '',
                providerDemoCompletedAt: usedDemoCheckout ? new Date().toISOString() : message.providerDemoCompletedAt,
                ...invoiceData
            };
        }

        return message;
    });

    updatedThread.push({
        sender: 'business',
        author: activeChatBusiness.name,
        text: isExternalCheckout && !markPaidImmediately
            ? `${getPaymentMethodLabel(paymentMethod)} wurde geoeffnet. Nach deiner Rueckkehr aktualisiert Nailit den Chat automatisch.`
            : paymentMethod === 'invoice'
                ? `Danke. Wir haben dir die Rechnung ${invoiceData.invoiceNumber} direkt in den Chat gelegt. Du kannst sie sofort als PDF herunterladen.`
                : paymentMethod === 'transfer'
                    ? `Danke. Bitte ueberweise den Betrag mit der Referenz ${invoiceData.invoiceNumber}. Die Bankdaten und die PDF-Rechnung stehen jetzt im Chat bereit.`
                    : usedDemoCheckout
                        ? `Die Demo-Zahlung per ${getPaymentMethodLabel(paymentMethod)} wurde direkt in Nailit bestaetigt.`
                        : `Danke. Die Zahlung per ${getPaymentMethodLabel(paymentMethod)} ist eingegangen. Wir bestaetigen den Einsatz jetzt direkt ueber Nailit.`,
        timestamp: new Date().toISOString()
    });

    saveChatThread(activeChatBusiness.name, updatedThread);

    if (contractorChatStatus) {
        contractorChatStatus.textContent = isExternalCheckout && !markPaidImmediately
            ? `${getPaymentMethodLabel(paymentMethod)} wurde geoeffnet. Nach deiner Rueckkehr wird der Status aktualisiert.`
            : paymentMethod === 'invoice'
                ? `Rechnung ${invoiceData.invoiceNumber} fuer ${activeChatBusiness.name} wurde erstellt.`
                : paymentMethod === 'transfer'
                    ? `Ueberweisungsdaten fuer ${activeChatBusiness.name} wurden bereitgestellt.`
                    : usedDemoCheckout
                        ? `${getPaymentMethodLabel(paymentMethod)} wurde lokal erfolgreich simuliert.`
                        : `Zahlung fuer ${activeChatBusiness.name} wurde per ${getPaymentMethodLabel(paymentMethod)} bestaetigt.`;
    }

    closePaymentModal();
    renderChatThread();
};

const openPaymentModal = (offerId) => {
    if (!paymentModal || !activeChatBusiness) {
        return;
    }

    const offer = getChatThread(activeChatBusiness.name).find((message) => message.type === 'offer' && message.offerId === offerId);

    if (!offer) {
        return;
    }

    activePaymentOfferId = offerId;

    if (paymentBusiness) {
        paymentBusiness.textContent = activeChatBusiness.name;
    }

    if (paymentAmount) {
        paymentAmount.textContent = formatCurrency(offer.amount);
    }

    if (paymentStatus) {
        paymentStatus.textContent = '';
    }

    if (paymentDemoConfirm) {
        paymentDemoConfirm.onclick = null;
    }

    if (paymentDemoCancel) {
        paymentDemoCancel.onclick = null;
    }

    const preferredMethod = offer.paymentMethod || 'stripe';
    const selectedOption = paymentForm?.querySelector(`input[name="paymentMethod"][value="${preferredMethod}"]`);
    if (selectedOption) {
        selectedOption.checked = true;
    }

    updatePaymentMethodDetails();

    paymentModal.classList.remove('is-hidden');
    syncModalBodyState();

    window.setTimeout(() => {
        selectedOption?.focus();
    }, 120);
};

const renderChatThread = () => {
    if (!contractorChatMessages || !activeChatBusiness) {
        return;
    }

    const messages = ensureChatThread(activeChatBusiness);

    contractorChatMessages.innerHTML = messages.length
        ? messages.map((message) => {
            if (message.type === 'appointment') {
                const linkedOffer = getLinkedOfferForAppointment(message);
                const appointmentActions = renderAppointmentActions(message);

                return `
                    <article class="chat-message is-${message.sender}" data-appointment-card="${escapeHtml(message.appointmentId)}">
                        <div class="chat-message-meta">
                            <strong>${escapeHtml(message.author)}</strong>
                            <span>${formatChatTime(message.timestamp)}</span>
                        </div>
                        <div class="chat-appointment-card is-${getAppointmentStateClass(message, linkedOffer)}">
                            <div class="chat-appointment-topline">Termin im Direktchat</div>
                            <h3>${escapeHtml(formatAppointmentDateTime(message.scheduledAt))}</h3>
                            <p>${escapeHtml(message.note || 'Terminabstimmung direkt zwischen Kunde und Betrieb ueber Nailit.')}</p>
                            <div class="chat-appointment-footer">
                                <div>
                                    <span class="chat-offer-label">Status</span>
                                    <strong>${escapeHtml(getAppointmentStatusLabel(message, linkedOffer))}</strong>
                                </div>
                                <div>
                                    <span class="chat-offer-label">Dauer</span>
                                    <strong>${escapeHtml(formatDurationMinutes(message.durationMinutes))}</strong>
                                </div>
                                <div>
                                    <span class="chat-offer-label">Preis</span>
                                    <strong>${message.price > 0 ? escapeHtml(formatCurrency(message.price)) : 'Vor Ort'}</strong>
                                </div>
                                <div>
                                    <span class="chat-offer-label">Erstellt von</span>
                                    <strong>${escapeHtml(message.createdByRole === 'betrieb' ? 'Betrieb' : 'Kunde')}</strong>
                                </div>
                            </div>
                            <div class="chat-appointment-note">${escapeHtml(getAppointmentStatusNote(message, linkedOffer))}</div>
                            ${appointmentActions ? `<div class="chat-offer-actions">${appointmentActions}</div>` : ''}
                        </div>
                    </article>
                `;
            }

            if (message.type === 'offer') {
                return `
                    <article class="chat-message is-${message.sender}" data-offer-card="${escapeHtml(message.offerId)}">
                        <div class="chat-message-meta">
                            <strong>${escapeHtml(message.author)}</strong>
                            <span>${formatChatTime(message.timestamp)}</span>
                        </div>
                        <div class="chat-offer-card is-${getOfferStateClass(message)}">
                            <div class="chat-offer-topline">Angebot im Direktchat</div>
                            <h3>${escapeHtml(message.title)}</h3>
                            <p>${escapeHtml(message.description)}</p>
                            <div class="chat-offer-footer">
                                <div>
                                    <span class="chat-offer-label">Betrag</span>
                                    <strong>${formatCurrency(message.amount)}</strong>
                                </div>
                                <div>
                                    <span class="chat-offer-label">Status</span>
                                    <strong>${getOfferStatusLabel(message)}</strong>
                                </div>
                                <div>
                                    <span class="chat-offer-label">Zahlungsart</span>
                                    <strong>${message.paymentMethod ? escapeHtml(getPaymentMethodLabel(message.paymentMethod)) : 'Waehlen beim Bezahlen'}</strong>
                                </div>
                                <div>
                                    <span class="chat-offer-label">Offen</span>
                                    <strong>${formatCurrency(getOutstandingAmount(message))}</strong>
                                </div>
                            </div>
                            ${getOfferStatusNote(message) ? `<div class="chat-offer-note">${escapeHtml(getOfferStatusNote(message))}</div>` : ''}
                            <div class="chat-offer-actions">${renderOfferActions(message)}</div>
                        </div>
                    </article>
                `;
            }

            return `
                <article class="chat-message is-${message.sender}">
                    <div class="chat-message-bubble">
                        <div class="chat-message-meta">
                            <strong>${escapeHtml(message.author)}</strong>
                            <span>${formatChatTime(message.timestamp)}</span>
                        </div>
                        <div class="chat-message-text">${escapeHtml(message.text)}</div>
                    </div>
                </article>
            `;
        }).join('')
        : '<div class="contractor-chat-empty">Noch keine Nachrichten im Direktchat.</div>';

    contractorChatMessages.scrollTop = contractorChatMessages.scrollHeight;
};

const openContractorChat = (business) => {
    const actor = getActiveChatActor();

    activeChatBusiness = business;

    if (contractorChatTitle) {
        contractorChatTitle.textContent = `Chat mit ${business.name}`;
    }

    if (contractorChatSubtitle) {
        contractorChatSubtitle.textContent = `${business.trade} in ${business.city}. Stimme Termine und Zahlungen direkt im Plattform-Chat ab.`;
    }

    if (contractorChatStatus) {
        contractorChatStatus.textContent = actor.role === 'betrieb'
            ? `Du schreibst als Betrieb ${actor.name}. Lege Termine und zahlbare Reservierungen direkt in den Chat.`
            : `Du schreibst als ${actor.name}. Nachrichten, Termine und Zahlungen werden in dieser Demo lokal gespeichert.`;
    }

    updateAppointmentComposer();
    setAppointmentPanelOpen(false);
    resetAppointmentComposer();

    contractorChatModal?.classList.remove('is-hidden');
    if (contractorChatModal) {
        contractorChatModal.style.display = 'grid';
        contractorChatModal.setAttribute('aria-hidden', 'false');
    }

    if (isContractorsPage) {
        const nextUrl = new URL(window.location.href);
        nextUrl.hash = 'direct-chat';
        window.history.replaceState({}, '', nextUrl.toString());
    }

    syncModalBodyState();
    renderChatThread();
    startLiveChatThreadSync(business.name);
    void syncChatThreadFromServer(business.name).then(() => {
        if (activeChatBusiness?.name === business.name) {
            renderChatThread();
        }
    });

    window.setTimeout(() => {
        contractorChatInput?.focus();
    }, 200);
};

window.openContractorChat = openContractorChat;

const openDirectChatForBusiness = ({ name = '', city = 'Deutschland', trade = 'Handwerk' } = {}) => {
    if (!name) {
        return;
    }

    const matchingBusiness = findBusinessRecord(name);
    const nextBusiness = matchingBusiness || {
        name,
        city,
        trade
    };

    if (!isDirectChatPage) {
        const targetUrl = new URL('direct-chat.html', window.location.href);
        targetUrl.searchParams.set('chatBusiness', nextBusiness.name);
        targetUrl.searchParams.set('chatCity', nextBusiness.city || city || 'Deutschland');
        targetUrl.searchParams.set('chatTrade', nextBusiness.trade || trade || 'Handwerk');
        targetUrl.searchParams.set('scope', DIRECT_CHAT_SCOPE);
        window.location.href = targetUrl.toString();
        return;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('chatBusiness', nextBusiness.name);
    nextUrl.searchParams.set('chatCity', nextBusiness.city || city || 'Deutschland');
    nextUrl.searchParams.set('chatTrade', nextBusiness.trade || trade || 'Handwerk');
    nextUrl.searchParams.set('scope', DIRECT_CHAT_SCOPE);
    window.history.replaceState({}, '', nextUrl.toString());

    openContractorChat(nextBusiness);
};

window.openDirectChatForBusiness = openDirectChatForBusiness;

const getDirectChatHref = ({ name = '', city = 'Deutschland', trade = 'Handwerk' } = {}) => {
    const targetUrl = new URL('direct-chat.html', window.location.href);

    if (name) {
        targetUrl.searchParams.set('chatBusiness', name);
    }

    if (city) {
        targetUrl.searchParams.set('chatCity', city);
    }

    if (trade) {
        targetUrl.searchParams.set('chatTrade', trade);
    }

    targetUrl.searchParams.set('scope', DIRECT_CHAT_SCOPE);

    return `${targetUrl.pathname}${targetUrl.search}`;
};

const closeContractorChat = () => {
    closePaymentModal();
    stopLiveChatThreadSync();
    contractorChatModal?.classList.add('is-hidden');
    if (contractorChatModal) {
        contractorChatModal.style.display = '';
        contractorChatModal.setAttribute('aria-hidden', 'true');
    }

    if (isDirectChatPage) {
        window.location.href = 'contractors.html';
        return;
    }

    if (isContractorsPage) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.delete('chatBusiness');
        nextUrl.searchParams.delete('chatCity');
        nextUrl.searchParams.delete('chatTrade');
        nextUrl.searchParams.delete('scope');
        window.history.replaceState({}, '', nextUrl.toString());
    }

    syncModalBodyState();
};

const goToHomepage = () => {
    window.location.href = 'index.html#home';
};

const readStorage = (key, fallback) => {
    try {
        const rawValue = window.localStorage.getItem(key);
        return rawValue ? JSON.parse(rawValue) : fallback;
    } catch {
        return fallback;
    }
};

const writeStorage = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

const getAccounts = () => {
    return readStorage(STORAGE_KEYS.accounts, []);
};

const saveAccounts = (accounts) => {
    writeStorage(STORAGE_KEYS.accounts, accounts);
};

const getSession = () => {
    return readStorage(STORAGE_KEYS.session, null);
};

const saveSession = (session) => {
    writeStorage(STORAGE_KEYS.session, session);
};

const clearSession = () => {
    window.localStorage.removeItem(STORAGE_KEYS.session);
};

const getChatThreads = () => {
    return readStorage(STORAGE_KEYS.chats, {});
};

const saveChatThreads = (threads) => {
    writeStorage(STORAGE_KEYS.chats, threads);
};

const normalizeChatScope = (scopeValue) => {
    return normalizeSearchText(scopeValue || 'guest').replace(/\s+/g, '-');
};

const getRequestedChatScope = () => {
    const params = new URLSearchParams(window.location.search);
    return normalizeChatScope(params.get('scope') || '');
};

const getCurrentChatScope = () => {
    const requestedScope = getRequestedChatScope();

    if (requestedScope) {
        return requestedScope;
    }

    const params = new URLSearchParams(window.location.search);
    const businessName = String(params.get('chatBusiness') || '').trim();

    if (businessName && (isDirectChatPage || isContractorsPage)) {
        return DIRECT_CHAT_SCOPE;
    }

    const session = getSession();
    return normalizeChatScope(session?.email || 'guest');
};

const getChatThreadKey = (businessName, scope = getCurrentChatScope()) => {
    const business = normalizeSearchText(businessName).replace(/\s+/g, '-');
    return `${scope}::${business}`;
};

const getChatThread = (businessName, scope = getCurrentChatScope()) => {
    const threads = getChatThreads();
    return threads[getChatThreadKey(businessName, scope)] || [];
};

const saveChatThreadLocally = (businessName, messages, scope = getCurrentChatScope()) => {
    const threads = getChatThreads();
    threads[getChatThreadKey(businessName, scope)] = messages;
    saveChatThreads(threads);
};

const fetchServerChatThread = async (businessName, scope = getCurrentChatScope()) => {
    try {
        const response = await fetch(`/api/chat-threads?scope=${encodeURIComponent(scope)}&business=${encodeURIComponent(businessName)}`);

        if (!response.ok) {
            return null;
        }

        const payload = await response.json();
        return Array.isArray(payload.messages) ? payload.messages : [];
    } catch {
        return null;
    }
};

const persistChatThreadToServer = async (businessName, messages, scope = getCurrentChatScope()) => {
    try {
        await fetch('/api/chat-threads', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scope,
                businessName,
                messages
            })
        });
    } catch {
        // Local cache remains available if the API is offline.
    }
};

const saveChatThread = (businessName, messages, options = {}) => {
    const scope = options.scope || getCurrentChatScope();
    saveChatThreadLocally(businessName, messages, scope);

    if (options.persist !== false) {
        void persistChatThreadToServer(businessName, messages, scope);
    }
};

const stopLiveChatThreadSync = () => {
    if (liveChatEventSource) {
        liveChatEventSource.close();
    }

    if (liveChatPollInterval) {
        window.clearInterval(liveChatPollInterval);
    }

    liveChatEventSource = null;
    liveChatSubscriptionKey = '';
    liveChatPollInterval = null;
};

const getChatMessageIdentity = (message) => {
    if (message?.appointmentId) {
        return `appointment:${message.appointmentId}`;
    }

    if (message?.offerId) {
        return `offer:${message.offerId}`;
    }

    return [
        message?.type || 'text',
        message?.sender || '',
        message?.author || '',
        message?.text || '',
        message?.timestamp || ''
    ].join('::');
};

const mergeChatThreads = (localMessages = [], serverMessages = []) => {
    const mergedMessages = new Map();

    [...serverMessages, ...localMessages].forEach((message) => {
        if (!message || typeof message !== 'object') {
            return;
        }

        mergedMessages.set(getChatMessageIdentity(message), message);
    });

    return Array.from(mergedMessages.values()).sort((left, right) => {
        const leftTime = new Date(left.timestamp || 0).getTime();
        const rightTime = new Date(right.timestamp || 0).getTime();
        return leftTime - rightTime;
    });
};

const syncChatThreadFromServer = async (businessName, scope = getCurrentChatScope()) => {
    const serverMessages = await fetchServerChatThread(businessName, scope);
    const localMessages = getChatThread(businessName, scope);

    if (Array.isArray(serverMessages) && serverMessages.length) {
        const mergedMessages = mergeChatThreads(localMessages, serverMessages);
        saveChatThreadLocally(businessName, mergedMessages, scope);

        if (mergedMessages.length !== serverMessages.length) {
            void persistChatThreadToServer(businessName, mergedMessages, scope);
        }

        return mergedMessages;
    }

    if (Array.isArray(serverMessages) && !serverMessages.length && localMessages.length) {
        void persistChatThreadToServer(businessName, localMessages, scope);
    }

    return localMessages;
};

const startLiveChatThreadSync = (businessName, scope = getCurrentChatScope()) => {
    if (!businessName || typeof window.EventSource !== 'function') {
        return;
    }

    const subscriptionKey = `${scope}::${businessName}`;

    if (liveChatSubscriptionKey === subscriptionKey && liveChatEventSource) {
        return;
    }

    stopLiveChatThreadSync();

    const streamUrl = `/api/chat-threads/stream?scope=${encodeURIComponent(scope)}&business=${encodeURIComponent(businessName)}`;
    const eventSource = new EventSource(streamUrl);

    eventSource.addEventListener('thread', (event) => {
        let payload = null;

        try {
            payload = JSON.parse(String(event.data || '{}'));
        } catch {
            return;
        }

        if (!payload?.businessName || !Array.isArray(payload.messages)) {
            return;
        }

        const resolvedScope = normalizeChatScope(payload.scope || scope);
        const mergedMessages = mergeChatThreads(getChatThread(payload.businessName, resolvedScope), payload.messages);
        saveChatThreadLocally(payload.businessName, mergedMessages, resolvedScope);

        if (activeChatBusiness?.name === payload.businessName && getCurrentChatScope() === resolvedScope) {
            renderChatThread();
        }
    });

    eventSource.onerror = () => {
        if (activeChatBusiness?.name === businessName && contractorChatStatus) {
            contractorChatStatus.textContent = 'Live-Sync wird neu verbunden...';
        }

        void syncChatThreadFromServer(businessName, scope).then(() => {
            if (activeChatBusiness?.name === businessName) {
                renderChatThread();
            }
        });
    };

    liveChatEventSource = eventSource;
    liveChatSubscriptionKey = subscriptionKey;

    liveChatPollInterval = window.setInterval(() => {
        if (document.hidden) {
            return;
        }

        void syncChatThreadFromServer(businessName, scope).then(() => {
            if (activeChatBusiness?.name === businessName && getCurrentChatScope() === scope) {
                renderChatThread();
            }
        });
    }, 2000);
};

const formatChatTime = (value) => {
    return new Intl.DateTimeFormat('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value));
};

const escapeHtml = (value) => {
    return String(value || '').replace(/[&<>"']/g, (character) => {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character] || character;
    });
};

const createBusinessReply = (business, session) => {
    const firstName = String(session?.name || 'dir').trim().split(/\s+/)[0] || 'dir';
    return `${firstName}, danke fuer deine Nachricht an ${business.name}. Wir pruefen gerade dein Anliegen zu ${business.trade} in ${business.city} und melden uns schnell mit einem Rueckruf- oder Terminfenster.`;
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

const getDemoOfferDetails = (business) => {
    const normalizedTrade = normalizeSearchText(business.trade);
    const offers = {
        sanitar: {
            title: 'Sanitär-Soforthilfe',
            amount: 189,
            description: 'Anfahrt, Erstprüfung und kleine Sofortmaßnahmen inklusive.'
        },
        sanitaer: {
            title: 'Sanitär-Soforthilfe',
            amount: 189,
            description: 'Anfahrt, Erstprüfung und kleine Sofortmaßnahmen inklusive.'
        },
        elektro: {
            title: 'Elektro-Check vor Ort',
            amount: 149,
            description: 'Sicherheitsprüfung, Fehlerdiagnose und erste Einschätzung vor Ort.'
        },
        dach: {
            title: 'Dach-Notdienst Angebot',
            amount: 229,
            description: 'Vor-Ort-Check, Leckageprüfung und temporäre Sicherung des Schadens.'
        },
        handwerk: {
            title: 'Vor-Ort-Angebot',
            amount: 119,
            description: 'Ersttermin inklusive Prüfung und Angebotsbesprechung.'
        }
    };

    return offers[normalizedTrade] || offers.handwerk;
};

const hasOpenOffer = (messages) => {
    return messages.some((message) => message.type === 'offer' && message.status === 'open');
};

const createOfferMessage = (business) => {
    const offer = getDemoOfferDetails(business);

    return {
        type: 'offer',
        sender: 'business',
        author: business.name,
        offerId: `offer-${Date.now()}`,
        title: offer.title,
        description: offer.description,
        amount: offer.amount,
        status: 'open',
        amountPaid: 0,
        paymentMethod: '',
        timestamp: new Date().toISOString()
    };
};

const pushBusinessChatEvent = (text, businessName = activeChatBusiness?.name, options = {}) => {
    if (!businessName || !text) {
        return;
    }

    const scope = options.scope || getCurrentChatScope();

    const updatedThread = [
        ...getChatThread(businessName, scope),
        {
            sender: 'business',
            author: businessName,
            text,
            timestamp: new Date().toISOString()
        }
    ];

    saveChatThread(businessName, updatedThread, { scope });
};

const updateOfferMessage = (offerId, transform, options = {}) => {
    const businessName = options.businessName || activeChatBusiness?.name;
    const scope = options.scope || getCurrentChatScope();

    if (!businessName) {
        return null;
    }

    let updatedOffer = null;
    const updatedThread = getChatThread(businessName, scope).map((message) => {
        if (message.type === 'offer' && message.offerId === offerId) {
            updatedOffer = transform(message);
            return updatedOffer;
        }

        return message;
    });

    if (!updatedOffer) {
        return null;
    }

    saveChatThread(businessName, updatedThread, { scope });
    return updatedOffer;
};

const findBusinessRecord = (businessName) => {
    return Object.entries(businesses).flatMap(([trade, items]) => {
        return items.map((business) => ({
            ...business,
            trade
        }));
    }).find((business) => business.name === businessName) || null;
};

const getDirectChatFallbackBusiness = () => {
    const params = new URLSearchParams(window.location.search);
    const businessName = String(params.get('chatBusiness') || '').trim();
    const city = String(params.get('chatCity') || 'Berlin').trim();
    const trade = String(params.get('chatTrade') || 'Handwerk').trim();

    if (businessName) {
        return findBusinessRecord(businessName) || {
            name: businessName,
            city,
            trade
        };
    }

    if (!isDirectChatPage) {
        return null;
    }

    return {
        name: 'Nailit Service-Team',
        city,
        trade
    };
};

const ensureActiveChatBusiness = () => {
    if (activeChatBusiness) {
        return activeChatBusiness;
    }

    const fallbackBusiness = getDirectChatFallbackBusiness();

    if (!fallbackBusiness) {
        return null;
    }

    openContractorChat(fallbackBusiness);
    return fallbackBusiness;
};

const autoResizeChatInput = () => {
    if (!contractorChatInput) {
        return;
    }

    contractorChatInput.style.height = 'auto';
    contractorChatInput.style.height = `${Math.min(contractorChatInput.scrollHeight, 140)}px`;
};

const clearChatInputs = () => {
    if (contractorChatInput) {
        contractorChatInput.value = '';
        autoResizeChatInput();
    }
};

const submitDirectChatMessage = () => {
    const currentBusiness = activeChatBusiness || ensureActiveChatBusiness();

    if (!currentBusiness) {
        return;
    }

    const actor = getActiveChatActor();
    const text = String(contractorChatInput?.value || '').trim();

    if (!text) {
        contractorChatInput?.focus();
        return;
    }

    const customerMessage = {
        sender: actor.sender,
        author: actor.name,
        text,
        timestamp: new Date().toISOString()
    };

    const nextThread = [...ensureChatThread(currentBusiness), customerMessage];
    saveChatThread(currentBusiness.name, nextThread);
    clearChatInputs();

    if (actor.role === 'betrieb') {
        if (contractorChatStatus) {
            contractorChatStatus.textContent = `Nachricht von ${actor.name} wurde an den Kunden im Direktchat gesendet.`;
        }

        renderChatThread();
        return;
    }

    if (contractorChatStatus) {
        contractorChatStatus.textContent = `${currentBusiness.name} antwortet ueber Nailit...`;
    }

    renderChatThread();

    window.setTimeout(() => {
        const currentThread = getChatThread(currentBusiness.name);
        const updatedThread = [
            ...currentThread,
            {
                sender: 'business',
                author: currentBusiness.name,
                text: createBusinessReply(currentBusiness, { name: actor.name }),
                timestamp: new Date().toISOString()
            }
        ];

        if (!hasOpenOffer(currentThread)) {
            updatedThread.push(createOfferMessage(currentBusiness));
        }

        saveChatThread(currentBusiness.name, updatedThread);

        if (contractorChatStatus) {
            contractorChatStatus.textContent = `Du schreibst als ${actor.name}. Nachrichten werden in dieser Demo lokal gespeichert.`;
        }

        renderChatThread();
    }, 550);
};

const scrollToOfferCard = (offerId) => {
    if (!offerId || !contractorChatMessages) {
        return;
    }

    const offerCard = contractorChatMessages.querySelector(`[data-offer-card="${CSS.escape(offerId)}"]`);
    if (!offerCard) {
        return;
    }

    offerCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    offerCard.classList.add('is-highlighted');
    window.setTimeout(() => {
        offerCard.classList.remove('is-highlighted');
    }, 2200);
};

const processCheckoutReturn = async () => {
    const params = new URLSearchParams(window.location.search);
    const checkoutState = params.get('checkout');
    const provider = params.get('provider');
    const offerId = params.get('offer');
    const businessName = params.get('business');
    const scope = normalizeChatScope(params.get('scope') || getCurrentChatScope());

    if (!checkoutState || !provider || !offerId || !businessName) {
        return;
    }

    await syncChatThreadFromServer(businessName, scope);

    try {
        if (checkoutState === 'success') {
            if (provider === 'stripe' && paymentConfig.stripeEnabled) {
                const sessionId = params.get('session_id');
                if (!sessionId) {
                    throw new Error('Stripe Session-ID fehlt in der Rueckkehr-URL.');
                }

                const session = await verifyStripeCheckoutSession(sessionId);
                if (session.paymentStatus !== 'paid') {
                    throw new Error('Stripe Checkout ist noch nicht als bezahlt bestaetigt.');
                }
            }

            if (provider === 'paypal' && paymentConfig.paypalEnabled) {
                const orderId = params.get('token');
                if (!orderId) {
                    throw new Error('PayPal Order-ID fehlt in der Rueckkehr-URL.');
                }

                const capture = await capturePaypalOrder(orderId);
                if (!String(capture.status || '').toUpperCase().includes('COMPLETED')) {
                    throw new Error('PayPal Zahlung ist noch nicht abgeschlossen.');
                }
            }

            const updatedOffer = updateOfferMessage(offerId, (message) => ({
                ...message,
                status: 'paid',
                amountPaid: Number(message.amount || 0),
                paidAt: new Date().toISOString(),
                providerRedirected: true,
                externalCheckoutComplete: true
            }), { businessName, scope });

            if (updatedOffer) {
                pushBusinessChatEvent(`Die ${getPaymentMethodLabel(provider)}-Zahlung fuer ${updatedOffer.title} wurde nach dem externen Checkout bestaetigt.`, businessName, { scope });
            }
        } else {
            const updatedOffer = updateOfferMessage(offerId, (message) => ({
                ...message,
                status: 'open',
                paymentMethod: '',
                providerRedirected: false,
                externalCheckoutComplete: false,
                checkoutCancelledAt: new Date().toISOString()
            }), { businessName, scope });

            if (updatedOffer) {
                pushBusinessChatEvent(`${getPaymentMethodLabel(provider)} wurde abgebrochen. Das Angebot ${updatedOffer.title} ist wieder offen.`, businessName, { scope });
            }
        }

        const matchingBusiness = findBusinessRecord(businessName);
        if (!activeChatBusiness && matchingBusiness && isContractorsPage) {
            openContractorChat(matchingBusiness);
            window.setTimeout(() => {
                scrollToOfferCard(offerId);
            }, 260);
        } else if (activeChatBusiness?.name === businessName) {
            renderChatThread();
            scrollToOfferCard(offerId);
        }
    } catch (error) {
        if (contractorChatStatus) {
            contractorChatStatus.textContent = error.message || 'Checkout konnte nicht final bestaetigt werden.';
        }
    } finally {
        params.delete('checkout');
        params.delete('provider');
        params.delete('offer');
        params.delete('business');
        params.delete('scope');
        params.delete('session_id');
        params.delete('token');
        params.delete('PayerID');
        const nextSearch = params.toString();
        const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
        window.history.replaceState({}, '', nextUrl);
    }
};

const getAvailabilityIndicator = (availability) => {
    const normalizedAvailability = normalizeSearchText(availability);

    if (normalizedAvailability.includes('heute verfugbar') || normalizedAvailability.includes('sofort')) {
        return {
            state: 'green',
            label: 'Sofort verfügbar',
            detail: availability
        };
    }

    if (normalizedAvailability.includes('stunde') || normalizedAvailability.includes('spater') || normalizedAvailability.includes('spaeter')) {
        return {
            state: 'yellow',
            label: 'Später verfügbar',
            detail: availability
        };
    }

    return {
        state: 'red',
        label: 'Heute nicht verfügbar',
        detail: availability
    };
};

const renderAvailabilityIndicator = (availability) => {
    const indicator = getAvailabilityIndicator(availability);

    return `
        <div class="availability-indicator is-${indicator.state}">
            <span class="availability-dot"></span>
            <strong>${escapeHtml(indicator.label)}</strong>
            <span>${escapeHtml(indicator.detail)}</span>
        </div>
    `;
};

const ensureChatThread = (business) => {
    const existingThread = getChatThread(business.name);

    if (existingThread.length > 0) {
        return existingThread;
    }

    const starterMessage = {
        sender: 'business',
        author: business.name,
        text: `Willkommen im Nailit-Chat. Schreibe hier direkt an ${business.name}, schlage Termine vor und klaere Preise oder Zahlungen direkt im Chat.`,
        timestamp: new Date().toISOString()
    };

    saveChatThread(business.name, [starterMessage]);
    return [starterMessage];
};

const clearMessages = () => {
    registerSuccess.textContent = '';
    registerError.textContent = '';
    loginSuccess.textContent = '';
    loginError.textContent = '';
};

const normalizeRoleLabel = (role) => {
    return role === 'betrieb' ? 'Betrieb' : 'Kunde';
};

const updateAuthUi = () => {
    const session = getSession();

    if (!session) {
        navUserStatus.classList.add('is-hidden');
        navAuthLinks.forEach((link) => {
            link.classList.remove('is-hidden');
        });
        sessionPanel.classList.add('is-hidden');
        sessionTitle.textContent = 'Nicht angemeldet';
        sessionSummary.textContent = 'Registriere dich oder melde dich an, damit die Plattform dein Konto erkennt.';
        return;
    }

    navUserName.textContent = session.name;
    navUserRole.textContent = normalizeRoleLabel(session.role);
    navUserStatus.classList.remove('is-hidden');
    navAuthLinks.forEach((link) => {
        link.classList.add('is-hidden');
    });

    sessionTitle.textContent = `${session.name} ist angemeldet`;
    sessionSummary.textContent = `${normalizeRoleLabel(session.role)}konto aktiv mit ${session.email}.`;
    sessionPanel.classList.remove('is-hidden');
};

const setMessage = (element, message) => {
    element.textContent = message;
};

const setAuthView = (view) => {
    const isRegister = view !== 'login';

    authTabs.forEach((tab) => {
        tab.classList.toggle('is-active', tab.dataset.authView === (isRegister ? 'register' : 'login'));
    });

    if (registerForm) {
        registerForm.classList.toggle('is-active', isRegister);
    }

    if (loginForm) {
        loginForm.classList.toggle('is-active', !isRegister);
    }
};

const openAuthSection = (view) => {
    setAuthView(view);
    clearMessages();

    if (accountsSection) {
        accountsSection.classList.remove('is-hidden');
        syncModalBodyState();
        accountsSection.querySelectorAll('.reveal').forEach((element) => {
            element.classList.add('active');
        });
    }

    window.setTimeout(() => {
        const firstField = view === 'login'
            ? loginForm?.querySelector('input, select, textarea')
            : registerForm?.querySelector('input, select, textarea');

        firstField?.focus();
    }, 250);
};

const updateRegisterRoleFields = () => {
    const selectedRole = registerForm?.querySelector('input[name="registerRole"]:checked');
    const isBusiness = selectedRole && selectedRole.value === 'betrieb';

    if (registerBusinessFields) {
        registerBusinessFields.classList.toggle('is-visible', isBusiness);
    }

    const tradeField = document.getElementById('registerTrade');
    const radiusField = document.getElementById('registerRadius');

    if (tradeField) {
        tradeField.required = isBusiness;
    }

    if (radiusField) {
        radiusField.required = isBusiness;
    }
};

const toggleMenu = () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    setMenuState(!isExpanded);
};

const revealOnScroll = () => {
    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 80) {
            element.classList.add('active');
        }
    });
};

const getPriorityLabel = (value, fallback) => {
    const labels = {
        notfall: 'Notfall',
        hoch: 'Hoch',
        mittel: 'Mittel',
        niedrig: 'Niedrig'
    };

    return labels[value] || fallback;
};

const detectIssue = (description, urgencyValue, fileName) => {
    const normalizedDescription = description.toLowerCase();
    const normalizedFileName = fileName.toLowerCase();
    const combinedText = `${normalizedDescription} ${normalizedFileName}`;

    const matchedRule = keywordRules.find((rule) => {
        return rule.keywords.some((keyword) => combinedText.includes(keyword));
    });

    const rule = matchedRule || {
        trade: 'allround',
        title: 'Allgemeiner Problemfall erkannt',
        summary: 'Die Anfrage ist noch nicht eindeutig. Die Plattform wuerde zunaechst einen Allround- oder Koordinationsbetrieb empfehlen.',
        tags: ['Allgemein', 'Pruefung', 'Vor-Ort-Check'],
        confidence: '76%',
        defaultPriority: 'Mittel'
    };

    return {
        ...rule,
        priority: getPriorityLabel(urgencyValue, rule.defaultPriority)
    };
};

const renderMatches = (trade) => {
    if (!matchList) return;
    const relevantBusinesses = businesses[trade] || businesses.allround;

    matchList.innerHTML = relevantBusinesses.map((business) => {
        const businessName = escapeHtml(business.name);
        const businessSpecialty = escapeHtml(business.specialty);
        const businessCity = escapeHtml(business.city);
        const businessDistance = escapeHtml(business.distance);
        const businessAvailability = escapeHtml(business.availability);
        const businessScore = escapeHtml(business.score);
        const businessTrade = escapeHtml(trade);
        const directChatHref = escapeHtml(getDirectChatHref({
            name: business.name,
            city: business.city,
            trade
        }));

        return `
            <article class="match-card">
                <div class="match-card-header">
                    <div>
                        <strong>${businessName}</strong>
                        <p>${businessSpecialty}</p>
                    </div>
                    <strong>${businessScore}</strong>
                </div>
                <div class="match-meta">
                    <span>${businessCity}</span>
                    <span>${businessDistance}</span>
                    <span>${businessAvailability}</span>
                </div>
                ${renderAvailabilityIndicator(business.availability)}
                <div class="match-card-actions">
                    <button type="button" class="btn btn-secondary">Profil ansehen</button>
                    <a href="${directChatHref}" class="btn btn-primary contractor-chat-btn" data-chat-business="${businessName}" data-chat-city="${businessCity}" data-chat-trade="${businessTrade}"><i class="fas fa-comments"></i> Direkt chatten</a>
                </div>
            </article>
        `;
    }).join('');
};

const renderTags = (tags, hasFile) => {
    if (!analysisTags) return;
    const fileTag = hasFile ? ['Upload erkannt'] : ['Textanalyse'];
    const allTags = [...tags, ...fileTag];

    analysisTags.innerHTML = allTags.map((tag) => `<span>${tag}</span>`).join('');
};

const setAnalysisResult = (result, hasFile) => {
    if (analysisTitle) analysisTitle.textContent = result.title;
    if (analysisSummary) analysisSummary.textContent = result.summary;
    if (analysisTrade) analysisTrade.textContent = result.trade;
    if (analysisPriority) analysisPriority.textContent = result.priority;
    if (analysisConfidence) analysisConfidence.textContent = result.confidence;
    renderTags(result.tags, hasFile);
    if (Array.isArray(result.matches) && result.matches.length > 0 && matchList) {
        matchList.innerHTML = result.matches.map((business) => {
            const businessName = escapeHtml(business.name);
            const businessSpecialty = escapeHtml(business.specialty);
            const businessCity = escapeHtml(business.city);
            const businessDistance = escapeHtml(business.distance);
            const businessAvailability = escapeHtml(business.availability);
            const businessScore = escapeHtml(business.score);
            const businessTrade = escapeHtml(result.trade);
            const directChatHref = escapeHtml(getDirectChatHref({
                name: business.name,
                city: business.city,
                trade: result.trade
            }));

            return `
                <article class="match-card">
                    <div class="match-card-header">
                        <div>
                            <strong>${businessName}</strong>
                            <p>${businessSpecialty}</p>
                        </div>
                        <strong>${businessScore}</strong>
                    </div>
                    <div class="match-meta">
                        <span>${businessCity}</span>
                        <span>${businessDistance}</span>
                        <span>${businessAvailability}</span>
                    </div>
                    ${renderAvailabilityIndicator(business.availability)}
                    <div class="match-card-actions">
                        <button type="button" class="btn btn-secondary">Profil ansehen</button>
                        <a href="${directChatHref}" class="btn btn-primary contractor-chat-btn" data-chat-business="${businessName}" data-chat-city="${businessCity}" data-chat-trade="${businessTrade}"><i class="fas fa-comments"></i> Direkt chatten</a>
                    </div>
                </article>
            `;
        }).join('');
        return;
    }

    renderMatches(result.trade);
};

const setAnalysisLoading = (isLoading) => {
    if (!aiSubmitButton) {
        return;
    }

    aiSubmitButton.classList.toggle('is-loading', isLoading);
    aiSubmitButton.textContent = isLoading ? 'KI analysiert...' : 'KI-Analyse starten';
};

const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
        reader.readAsDataURL(file);
    });
};

const analyzeWithApi = async ({ description, location, propertyKind, urgency, mediaFile }) => {
    const payload = {
        description,
        location,
        propertyType: propertyKind,
        urgency
    };

    if (mediaFile) {
        payload.imageDataUrl = await fileToDataUrl(mediaFile);
    }

    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || 'Die KI-Analyse konnte nicht ausgefuehrt werden.');
    }

    return response.json();
};

const syncFileToAnalysisUpload = (file) => {
    if (!issueMedia || !file) {
        return;
    }

    if (typeof DataTransfer !== 'undefined') {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        issueMedia.files = transfer.files;
        issueMedia.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (uploadHint) {
        uploadHint.textContent = `Ausgewaehlt: ${file.name}`;
    }
};

const syncHeroDescription = () => {
    const value = String(heroServiceInput?.value || '').trim();

    if (issueDescription) {
        issueDescription.value = value;
    }

    if (mergedDescriptionPreview) {
        mergedDescriptionPreview.textContent = value || 'Nutzen Sie die Suchleiste oben, um Ihr Problem zu beschreiben.';
    }
};

const normalizeSearchText = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');

const getSearchTerms = (value) => {
    const normalizedValue = normalizeSearchText(value);

    if (!normalizedValue) {
        return [];
    }

    const tokens = normalizedValue.split(/\s+/).filter(Boolean);
    const terms = new Set([normalizedValue, ...tokens]);

    tokens.forEach((token) => {
        const aliases = SEARCH_ALIASES[token] || [];
        aliases.forEach((alias) => terms.add(normalizeSearchText(alias)));
    });

    if (SEARCH_ALIASES[normalizedValue]) {
        SEARCH_ALIASES[normalizedValue].forEach((alias) => terms.add(normalizeSearchText(alias)));
    }

    return Array.from(terms);
};

const getInferredTradesFromQuery = (value) => {
    const searchTerms = getSearchTerms(value);
    if (!searchTerms.length) {
        return [];
    }

    return Object.keys(TRADE_LABELS).filter((trade) => {
        const normalizedTrade = normalizeSearchText(trade);
        const normalizedLabel = normalizeSearchText(getTradeLabel(trade));
        const aliases = SEARCH_ALIASES[normalizedTrade] || [];
        const normalizedAliases = aliases.map((alias) => normalizeSearchText(alias));

        return searchTerms.some((term) => {
            return term === normalizedTrade
                || term === normalizedLabel
                || normalizedAliases.includes(term);
        });
    });
};

const FILTER_VALUE_MAP = {
    trade: {
        sanitar: 'sanitaer',
        sanitaer: 'sanitaer',
        elektro: 'elektro',
        dach: 'dach',
        maler: 'maler',
        allround: 'allround'
    },
    city: {
        berlin: 'berlin',
        hamburg: 'hamburg',
        munchen: 'munchen',
        muenchen: 'munchen'
    }
};

const getTradeLabel = (trade) => {
    return TRADE_LABELS[normalizeSearchText(trade)] || String(trade || 'Allround');
};

const getDirectoryBusinesses = () => {
    const seenNames = new Set();

    return Object.entries(businesses).flatMap(([trade, items]) => {
        return items.map((business) => ({
            ...business,
            trade
        }));
    }).filter((business) => {
        if (seenNames.has(business.name)) {
            return false;
        }

        seenNames.add(business.name);
        return true;
    });
};

const updateContractorFilterOptions = (directoryBusinesses) => {
    if (contractorTradeFilter) {
        const tradeOptions = Array.from(new Set(directoryBusinesses.map((business) => normalizeSearchText(business.trade))));
        contractorTradeFilter.innerHTML = [
            '<option value="">Alle Gewerke</option>',
            ...tradeOptions.map((trade) => `<option value="${escapeHtml(trade)}">${escapeHtml(getTradeLabel(trade))}</option>`)
        ].join('');
    }

    if (contractorCityFilter) {
        const cityOptions = Array.from(new Set(directoryBusinesses.map((business) => normalizeSearchText(business.city))));
        contractorCityFilter.innerHTML = [
            '<option value="">Alle Staedte</option>',
            ...cityOptions.map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(String(city).charAt(0).toUpperCase() + String(city).slice(1))}</option>`)
        ].join('');
    }
};

const renderContractorDirectory = () => {
    if (!contractorsGrid || !isContractorsPage) {
        return;
    }

    const directoryBusinesses = getDirectoryBusinesses();
    updateContractorFilterOptions(directoryBusinesses);

    contractorsGrid.innerHTML = directoryBusinesses.map((business, index) => {
        const businessName = escapeHtml(business.name);
        const businessTrade = normalizeSearchText(business.trade);
        const businessTradeLabel = escapeHtml(getTradeLabel(business.trade));
        const businessCity = escapeHtml(business.city);
        const businessCityValue = normalizeSearchText(business.city);
        const businessTags = escapeHtml(`${business.trade} ${business.specialty} ${business.city} ${business.distance} ${business.availability}`);
        const businessScore = escapeHtml(business.score || 'Top Match');
        const delayClass = `delay-${(index % 4) + 1}`;
        const directChatHref = escapeHtml(getDirectChatHref({
            name: business.name,
            city: business.city,
            trade: getTradeLabel(business.trade)
        }));

        return `
            <article class="contractor-card reveal ${delayClass}" data-name="${businessName}" data-trade="${escapeHtml(businessTrade)}" data-city="${escapeHtml(businessCityValue)}" data-tags="${businessTags}">
                <div class="contractor-header">
                    <div class="contractor-avatar"><i class="fas fa-building"></i></div>
                    <div>
                        <h3>${businessName}</h3>
                        <div class="contractor-rating"><i class="fas fa-star"></i><span>${businessScore}</span></div>
                    </div>
                </div>
                <p class="contractor-desc">${escapeHtml(business.specialty)}</p>
                <div class="contractor-meta"><span><i class="fas fa-map-marker-alt"></i> ${businessCity}</span><span><i class="fas fa-wrench"></i> ${businessTradeLabel}</span><span><i class="fas fa-route"></i> ${escapeHtml(business.distance)}</span></div>
                ${renderAvailabilityIndicator(business.availability)}
                <div class="contractor-actions">
                    <a href="#" class="btn btn-secondary">Profil ansehen</a>
                    <a href="${directChatHref}" class="btn btn-primary contractor-chat-btn" data-chat-business="${businessName}" data-chat-city="${businessCity}" data-chat-trade="${businessTradeLabel}"><i class="fas fa-comments"></i> Direkt chatten</a>
                </div>
            </article>
        `;
    }).join('');

    contractorCards = Array.from(contractorsGrid.querySelectorAll('.contractor-card'));
    revealOnScroll();
};

const navigateToContractorsPage = ({ query = '', trade = '', city = '' } = {}) => {
    const targetUrl = new URL('contractors.html', window.location.href);

    if (query) {
        targetUrl.searchParams.set('q', query);
    }

    if (trade) {
        targetUrl.searchParams.set('trade', trade);
    }

    if (city) {
        targetUrl.searchParams.set('city', city);
    }

    window.location.href = targetUrl.toString();
};

const applyContractorFiltersFromUrl = () => {
    if (!contractorSearchInput) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    const trade = normalizeSearchText(params.get('trade') || '');
    const city = normalizeSearchText(params.get('city') || '');

    contractorSearchInput.value = query;

    if (contractorTradeFilter) {
        const nextTradeValue = FILTER_VALUE_MAP.trade[trade] || trade;
        contractorTradeFilter.value = Array.from(contractorTradeFilter.options).some((option) => option.value === nextTradeValue)
            ? nextTradeValue
            : '';
    }

    if (contractorCityFilter) {
        const nextCityValue = FILTER_VALUE_MAP.city[city] || city;
        contractorCityFilter.value = Array.from(contractorCityFilter.options).some((option) => option.value === nextCityValue)
            ? nextCityValue
            : '';
    }

    updateContractorSearch();
};

const applyDirectChatFromUrl = () => {
    if (!isContractorsPage && !isDirectChatPage) {
        return;
    }

    const business = getDirectChatFallbackBusiness();

    if (!business) {
        return;
    }

    openContractorChat(business);
};

const runHeroManualSearch = (query) => {
    navigateToContractorsPage({ query });
};

const updateContractorSearch = () => {
    if (!contractorCards.length) {
        return;
    }

    const query = String(contractorSearchInput?.value || '').trim();
    const searchTerms = getSearchTerms(query);
    const inferredTrades = getInferredTradesFromQuery(query);
    const trade = normalizeSearchText(contractorTradeFilter?.value || '');
    const city = normalizeSearchText(contractorCityFilter?.value || '');

    let visibleCount = 0;

    contractorCards.forEach((card) => {
        const searchableText = normalizeSearchText([
            card.dataset.name,
            card.dataset.trade,
            card.dataset.city,
            card.dataset.tags,
            card.textContent
        ].join(' '));

        const cardTrade = normalizeSearchText(card.dataset.trade);
        const cardCity = normalizeSearchText(card.dataset.city);

        const matchesQuery = !searchTerms.length
            || searchTerms.some((term) => searchableText.includes(term))
            || inferredTrades.includes(cardTrade);
        const matchesTrade = !trade || cardTrade === trade;
        const matchesCity = !city || cardCity.includes(city);
        const isVisible = matchesQuery && matchesTrade && matchesCity;

        card.classList.toggle('is-hidden', !isVisible);

        if (isVisible) {
            visibleCount += 1;
        }
    });

    if (contractorResultCount) {
        contractorResultCount.textContent = `${visibleCount} Betrieb${visibleCount === 1 ? '' : 'e'} gefunden`;
    }

    contractorEmptyState?.classList.toggle('is-hidden', visibleCount > 0);
};

hamburger.addEventListener('click', toggleMenu);
hamburger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
    }
});

document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
        setMenuState(false);
    });
});

navAuthLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const view = link.dataset.authView;
        if (!view) {
            return;
        }

        event.preventDefault();
        openAuthSection(view);
    });
});

authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        setAuthView(tab.dataset.authView);
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
        setMenuState(false);
    }
});

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
updateAuthUi();

if (issueMedia) {
    issueMedia.addEventListener('change', () => {
        const file = issueMedia.files[0];
        if (uploadHint) {
            uploadHint.textContent = file ? `Ausgewaehlt: ${file.name}` : 'PNG, JPG oder MP4 fuer den Demo-Flow';
        }
    });
}

if (heroPhotoInput) {
    heroPhotoInput.addEventListener('change', () => {
        const file = heroPhotoInput.files[0];

        if (!file) {
            return;
        }

        openAiDiagnoseModal();
        syncFileToAnalysisUpload(file);
        window.setTimeout(() => {
            issueLocation?.focus();
        }, 250);
    });
}

heroPhotoTrigger?.addEventListener('click', () => {
    openAiDiagnoseModal();
});

contractorSearchInput?.addEventListener('input', updateContractorSearch);
contractorTradeFilter?.addEventListener('change', updateContractorSearch);
contractorCityFilter?.addEventListener('change', updateContractorSearch);
contractorSearchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    updateContractorSearch();
});
contractorResetButton?.addEventListener('click', () => {
    if (contractorSearchInput) {
        contractorSearchInput.value = '';
    }

    if (contractorTradeFilter) {
        contractorTradeFilter.value = '';
    }

    if (contractorCityFilter) {
        contractorCityFilter.value = '';
    }

    updateContractorSearch();
});

updateContractorSearch();
if (!contractorCards.length && isContractorsPage && !document.getElementById('locationOverlay')) {
    renderContractorDirectory();
}
applyContractorFiltersFromUrl();
applyDirectChatFromUrl();
window.addEventListener('load', applyDirectChatFromUrl);
window.addEventListener('pageshow', applyDirectChatFromUrl);

if (heroServiceInput) {
    heroServiceInput.addEventListener('input', syncHeroDescription);
    syncHeroDescription();
}

/* Form submit is now handled inline in index.html */
/*
if (aiIssueForm) {
    aiIssueForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        syncHeroDescription();

        const formData = new FormData(aiIssueForm);
        const description = String(formData.get('issueDescription') || '').trim();
        const location = formData.get('issueLocation') || '';
        const propertyKind = formData.get('propertyType') || '';
        const urgencyValue = formData.get('urgency') || '';
        const mediaFile = issueMedia.files[0] || heroPhotoInput?.files[0];
        const fileName = mediaFile ? mediaFile.name : '';

        if (!description && !mediaFile) {
            if (analysisTitle) analysisTitle.textContent = 'Bitte Problem beschreiben';
            if (analysisSummary) analysisSummary.textContent = 'Nutzen Sie die Suchleiste oben, damit die KI das Problem auswerten kann.';
            heroServiceInput?.focus();
            return;
        }

        try {
            setAnalysisLoading(true);
            if (analysisTitle) analysisTitle.textContent = 'KI analysiert das Problem';
            if (analysisSummary) analysisSummary.textContent = 'ChatGPT bewertet gerade Beschreibung und Bildmaterial und sucht passende Betriebe.';

            const apiResult = await analyzeWithApi({
                description,
                location,
                propertyKind,
                urgency: urgencyValue,
                mediaFile
            });

            setAnalysisResult(apiResult, Boolean(mediaFile));
        } catch (error) {
            const fallbackResult = detectIssue(description, urgencyValue, fileName);
            setAnalysisResult({
                ...fallbackResult,
                summary: `${fallbackResult.summary} ChatGPT war gerade nicht erreichbar, daher wurde das lokale Fallback verwendet.`
            }, Boolean(mediaFile));
            if (analysisSummary) analysisSummary.textContent = `${error.message} Lokales Fallback verwendet.`;
        } finally {
            setAnalysisLoading(false);
            const panel = document.getElementById('analysisPanel');
            if (panel) {
                panel.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    });
}
*/

if (heroServiceSearch) {
    heroServiceSearch.addEventListener('submit', (event) => {
        event.preventDefault();

        const query = String(heroServiceInput?.value || '').trim();

        if (!query) {
            heroServiceInput?.focus();
            return;
        }

        if (issueDescription && query) {
            issueDescription.value = query;
        }

        syncHeroDescription();

        runHeroManualSearch(query);
    });
}

document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-chat-business]');

    if (!trigger) {
        return;
    }

    event.preventDefault();

    openDirectChatForBusiness({
        name: trigger.dataset.chatBusiness,
        city: trigger.dataset.chatCity || 'Deutschland',
        trade: trigger.dataset.chatTrade || 'Handwerk'
    });
});

contractorChatForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    submitDirectChatMessage();
});

contractorChatInput?.addEventListener('input', () => {
    autoResizeChatInput();
});

contractorChatInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        contractorChatForm?.requestSubmit();
    }
});

document.addEventListener('click', (event) => {
    const payTrigger = event.target.closest('[data-offer-id]');
    const appointmentAcceptTrigger = event.target.closest('[data-appointment-accept]');
    const appointmentDeclineTrigger = event.target.closest('[data-appointment-decline]');
    const invoiceTrigger = event.target.closest('[data-download-invoice]');
    const transferTrigger = event.target.closest('[data-copy-transfer]');
    const partialTrigger = event.target.closest('[data-offer-partial]');
    const completeTrigger = event.target.closest('[data-offer-complete]');
    const cancelTrigger = event.target.closest('[data-offer-cancel]');

    if (appointmentAcceptTrigger && activeChatBusiness) {
        event.preventDefault();

        const actor = getActiveChatActor();
        const appointmentMessage = getChatThread(activeChatBusiness.name).find((message) => {
            return message.type === 'appointment' && message.appointmentId === appointmentAcceptTrigger.dataset.appointmentAccept;
        });

        if (!appointmentMessage) {
            return;
        }

        const now = new Date().toISOString();
        const needsOffer = Number(appointmentMessage.price || 0) > 0 && !appointmentMessage.linkedOfferId;
        const offerMessage = needsOffer
            ? createAppointmentOfferMessage({
                business: activeChatBusiness,
                appointment: appointmentMessage,
                amount: appointmentMessage.price
            })
            : null;
        const updatedThread = getChatThread(activeChatBusiness.name).map((message) => {
            if (message.type === 'appointment' && message.appointmentId === appointmentMessage.appointmentId) {
                return {
                    ...message,
                    status: 'accepted',
                    acceptedAt: now,
                    acceptedByRole: actor.role,
                    acceptedByName: actor.name,
                    linkedOfferId: offerMessage?.offerId || message.linkedOfferId
                };
            }

            return message;
        });

        updatedThread.push({
            sender: actor.sender,
            author: actor.name,
            text: offerMessage
                ? `Termin am ${formatAppointmentDateTime(appointmentMessage.scheduledAt)} wurde bestaetigt. Ich habe dir direkt die Reservierung zur Zahlung in den Chat gelegt.`
                : `Termin am ${formatAppointmentDateTime(appointmentMessage.scheduledAt)} wurde bestaetigt.`,
            timestamp: now
        });

        if (offerMessage) {
            updatedThread.push(offerMessage);
        }

        saveChatThread(activeChatBusiness.name, updatedThread);

        if (contractorChatStatus) {
            contractorChatStatus.textContent = offerMessage
                ? `Termin fuer ${activeChatBusiness.name} wurde bestaetigt. Die Zahlung kann jetzt direkt im Chat abgeschlossen werden.`
                : `Termin fuer ${activeChatBusiness.name} wurde bestaetigt.`;
        }

        renderChatThread();
        return;
    }

    if (appointmentDeclineTrigger && activeChatBusiness) {
        event.preventDefault();

        const actor = getActiveChatActor();
        const declinedAppointment = updateAppointmentMessage(appointmentDeclineTrigger.dataset.appointmentDecline, (message) => ({
            ...message,
            status: 'declined',
            declinedAt: new Date().toISOString(),
            declinedByRole: actor.role,
            declinedByName: actor.name
        }));

        if (declinedAppointment) {
            const updatedThread = [
                ...getChatThread(activeChatBusiness.name),
                {
                    sender: actor.sender,
                    author: actor.name,
                    text: `Der Terminvorschlag am ${formatAppointmentDateTime(declinedAppointment.scheduledAt)} wurde abgelehnt.`,
                    timestamp: new Date().toISOString()
                }
            ];

            saveChatThread(activeChatBusiness.name, updatedThread);

            if (contractorChatStatus) {
                contractorChatStatus.textContent = `Terminvorschlag fuer ${activeChatBusiness.name} wurde abgelehnt.`;
            }

            renderChatThread();
        }

        return;
    }

    if (invoiceTrigger && activeChatBusiness) {
        event.preventDefault();

        const offerMessage = getChatThread(activeChatBusiness.name).find((message) => message.type === 'offer' && message.offerId === invoiceTrigger.dataset.downloadInvoice);
        if (offerMessage) {
            downloadOfferInvoice(offerMessage);
        }

        return;
    }

    if (transferTrigger && activeChatBusiness) {
        event.preventDefault();

        const offerMessage = getChatThread(activeChatBusiness.name).find((message) => message.type === 'offer' && message.offerId === transferTrigger.dataset.copyTransfer);
        const iban = offerMessage?.transferIban || paymentConfig.bankTransfer.iban;
        navigator.clipboard?.writeText(iban).catch(() => {});

        if (contractorChatStatus) {
            contractorChatStatus.textContent = `IBAN fuer ${activeChatBusiness.name} wurde in die Zwischenablage kopiert.`;
        }

        return;
    }

    if (partialTrigger && activeChatBusiness) {
        event.preventDefault();

        const updatedOffer = updateOfferMessage(partialTrigger.dataset.offerPartial, (message) => {
            const paymentAmount = getNextPartialAmount(message);
            const totalPaid = Math.min(Number(message.amount || 0), getPaidAmount(message) + paymentAmount);
            const outstandingAmount = Math.max(0, Number(message.amount || 0) - totalPaid);

            return {
                ...message,
                status: outstandingAmount > 0 ? 'partial' : 'paid',
                amountPaid: totalPaid,
                paidAt: outstandingAmount > 0 ? message.paidAt || new Date().toISOString() : new Date().toISOString()
            };
        });

        if (updatedOffer) {
            pushBusinessChatEvent(`Teilzahlung fuer ${updatedOffer.title} erfasst: ${formatCurrency(getPaidAmount(updatedOffer))} von ${formatCurrency(updatedOffer.amount)} sind jetzt bezahlt.`);
            if (contractorChatStatus) {
                contractorChatStatus.textContent = `Teilzahlung fuer ${activeChatBusiness.name} wurde aktualisiert.`;
            }
            renderChatThread();
        }

        return;
    }

    if (completeTrigger && activeChatBusiness) {
        event.preventDefault();

        const updatedOffer = updateOfferMessage(completeTrigger.dataset.offerComplete, (message) => ({
            ...message,
            status: 'paid',
            amountPaid: Number(message.amount || 0),
            paidAt: new Date().toISOString()
        }));

        if (updatedOffer) {
            pushBusinessChatEvent(`Restzahlung fuer ${updatedOffer.title} bestaetigt. Das Angebot ist jetzt vollstaendig bezahlt.`);
            if (contractorChatStatus) {
                contractorChatStatus.textContent = `Angebot fuer ${activeChatBusiness.name} wurde vollstaendig bezahlt markiert.`;
            }
            renderChatThread();
        }

        return;
    }

    if (cancelTrigger && activeChatBusiness) {
        event.preventDefault();

        const updatedOffer = updateOfferMessage(cancelTrigger.dataset.offerCancel, (message) => ({
            ...message,
            status: 'cancelled',
            cancelledAt: new Date().toISOString()
        }));

        if (updatedOffer) {
            pushBusinessChatEvent(`Das Angebot ${updatedOffer.title} wurde im Direktchat storniert.`);
            if (contractorChatStatus) {
                contractorChatStatus.textContent = `Angebot fuer ${activeChatBusiness.name} wurde storniert.`;
            }
            renderChatThread();
        }

        return;
    }

    if (!payTrigger || !activeChatBusiness) {
        return;
    }

    event.preventDefault();

    openPaymentModal(payTrigger.dataset.offerId);
});

paymentForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!activeChatBusiness || !activePaymentOfferId) {
        return;
    }

    const formData = new FormData(paymentForm);
    const paymentMethod = String(formData.get('paymentMethod') || '').trim();

    if (!paymentMethod) {
        if (paymentStatus) {
            paymentStatus.textContent = 'Bitte waehle zuerst eine Zahlungsart aus.';
        }

        return;
    }

    const existingOffer = getChatThread(activeChatBusiness.name).find((message) => message.type === 'offer' && message.offerId === activePaymentOfferId);
    if (!existingOffer) {
        return;
    }

    const invoiceData = createInvoiceData({
        business: activeChatBusiness,
        offer: existingOffer,
        paymentMethod
    });
    let providerUrl = getProviderCheckoutUrl(paymentMethod);
    let externalReference = '';

    if (paymentMethod === 'stripe' && paymentConfig.stripeEnabled) {
        try {
            const session = await createStripeCheckoutSession({
                offer: existingOffer,
                business: activeChatBusiness
            });
            providerUrl = session.url || providerUrl;
            externalReference = session.id || '';
        } catch (error) {
            if (paymentStatus) {
                paymentStatus.textContent = error.message || 'Stripe Checkout konnte nicht gestartet werden.';
            }

            if (!providerUrl) {
                return;
            }
        }
    }

    if (paymentMethod === 'paypal' && paymentConfig.paypalEnabled) {
        try {
            const order = await createPaypalOrder({
                offer: existingOffer,
                business: activeChatBusiness
            });
            providerUrl = order.approveUrl || providerUrl;
            externalReference = order.id || '';
        } catch (error) {
            if (paymentStatus) {
                paymentStatus.textContent = error.message || 'PayPal konnte nicht gestartet werden.';
            }

            if (!providerUrl) {
                return;
            }
        }
    }

    if (providerUrl) {
        window.open(providerUrl, '_blank', 'noopener');
    }

    if (shouldUseLocalDemoCheckout(paymentMethod, providerUrl)) {
        updatePaymentDemoState();

        if (paymentStatus) {
            paymentStatus.textContent = `Lokaler ${getPaymentMethodLabel(paymentMethod)}-Checkout ist bereit. Bestaetige ihn direkt im Dialog.`;
        }

        paymentDemoConfirm?.onclick = () => {
            finalizePaymentFlow({
                paymentMethod,
                existingOffer,
                providerUrl,
                externalReference,
                invoiceData,
                usedDemoCheckout: true
            });
        };

        paymentDemoCancel?.onclick = () => {
            if (paymentStatus) {
                paymentStatus.textContent = `${getPaymentMethodLabel(paymentMethod)} wurde abgebrochen.`;
            }
        };

        return;
    }

    finalizePaymentFlow({
        paymentMethod,
        existingOffer,
        providerUrl,
        externalReference,
        invoiceData,
        usedDemoCheckout: false
    });
});

appointmentToggle?.addEventListener('click', () => {
    const shouldOpen = appointmentPanel?.classList.contains('is-hidden');

    if (shouldOpen) {
        seedAppointmentDefaults();
    }

    setAppointmentPanelOpen(Boolean(shouldOpen));
});

appointmentCancel?.addEventListener('click', () => {
    setAppointmentPanelOpen(false);
    resetAppointmentComposer();
});

appointmentSend?.addEventListener('click', () => {
    if (!activeChatBusiness) {
        return;
    }

    const actor = getActiveChatActor();
    const nextDate = String(appointmentDate?.value || '').trim();
    const nextTime = String(appointmentTime?.value || '').trim();

    if (!nextDate || !nextTime) {
        if (contractorChatStatus) {
            contractorChatStatus.textContent = 'Bitte waehle Datum und Uhrzeit fuer den Termin aus.';
        }

        return;
    }

    const scheduledAt = new Date(`${nextDate}T${nextTime}`);

    if (Number.isNaN(scheduledAt.getTime())) {
        if (contractorChatStatus) {
            contractorChatStatus.textContent = 'Der Terminvorschlag konnte nicht verarbeitet werden.';
        }

        return;
    }

    const durationMinutes = Number(appointmentDuration?.value || 60);
    const note = String(appointmentNote?.value || contractorChatInput?.value || '').trim();
    const price = actor.role === 'betrieb'
        ? Math.max(0, Number(appointmentPrice?.value || 0))
        : 0;
    const appointmentMessage = createAppointmentMessage({
        business: activeChatBusiness,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes,
        note,
        price,
        createdByRole: actor.role,
        createdByName: actor.name
    });
    const nextThread = [...ensureChatThread(activeChatBusiness), appointmentMessage];

    saveChatThread(activeChatBusiness.name, nextThread);
    setAppointmentPanelOpen(false);
    resetAppointmentComposer();

    if (contractorChatStatus) {
        contractorChatStatus.textContent = actor.role === 'betrieb'
            ? `Terminangebot fuer ${activeChatBusiness.name} wurde in den Direktchat gestellt.`
            : `${activeChatBusiness.name} prueft gerade deinen Terminvorschlag...`;
    }

    renderChatThread();

    if (actor.role !== 'betrieb') {
        const business = activeChatBusiness;
        window.setTimeout(() => {
            simulateBusinessAppointmentResponse(appointmentMessage, business);
        }, 650);
    }
});

aiDiagnoseClose?.addEventListener('click', closeAiDiagnoseModal);
aiDiagnoseBackdrop?.addEventListener('click', closeAiDiagnoseModal);
authModalClose?.addEventListener('click', closeAuthModal);
authModalBackdrop?.addEventListener('click', closeAuthModal);
contractorChatClose?.addEventListener('click', closeContractorChat);
contractorChatBackdrop?.addEventListener('click', closeContractorChat);
paymentClose?.addEventListener('click', closePaymentModal);
paymentBackdrop?.addEventListener('click', closePaymentModal);
paymentCancel?.addEventListener('click', closePaymentModal);
paymentDemoCancel?.addEventListener('click', () => {
    if (paymentStatus) {
        paymentStatus.textContent = 'Zahlung wurde nicht bestaetigt.';
    }
});
paymentForm?.querySelectorAll('input[name="paymentMethod"]').forEach((field) => {
    field.addEventListener('change', updatePaymentMethodDetails);
});
directoryBackLink?.addEventListener('click', (event) => {
    event.preventDefault();
    goToHomepage();
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const anyModalOpen = [aiDiagnoseModal, accountsSection, contractorChatModal, paymentModal].some((modal) => modal && !modal.classList.contains('is-hidden'));

        closeAiDiagnoseModal();
        closeAuthModal();
        closePaymentModal();
        closeContractorChat();

        if (!anyModalOpen && isContractorsPage) {
            goToHomepage();
        }
    }
});

window.addEventListener('beforeunload', () => {
    stopLiveChatThreadSync();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden || !activeChatBusiness) {
        return;
    }

    void syncChatThreadFromServer(activeChatBusiness.name).then(() => {
        if (activeChatBusiness) {
            renderChatThread();
        }
    });
});

window.addEventListener('focus', () => {
    if (!activeChatBusiness) {
        return;
    }

    void syncChatThreadFromServer(activeChatBusiness.name).then(() => {
        if (activeChatBusiness) {
            renderChatThread();
        }
    });
});

registerForm?.querySelectorAll('input[name="registerRole"]').forEach((field) => {
    field.addEventListener('change', updateRegisterRoleFields);
});

updateRegisterRoleFields();
loadPaymentConfig();
void processCheckoutReturn();

if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessages();

        const formData = new FormData(registerForm);
        const role = formData.get('registerRole');
        const name = String(formData.get('registerName') || '').trim();
        const email = String(formData.get('registerEmail') || '').trim().toLowerCase();
        const password = String(formData.get('registerPassword') || '');
        const passwordRepeat = String(formData.get('registerPasswordRepeat') || '');
        const trade = String(formData.get('registerTrade') || '').trim();
        const radius = String(formData.get('registerRadius') || '').trim();

        if (!role || !name || !email || !password) {
            setMessage(registerError, 'Bitte alle Pflichtfelder ausfuellen.');
            return;
        }

        if (password.length < 8) {
            setMessage(registerError, 'Das Passwort muss mindestens 8 Zeichen lang sein.');
            return;
        }

        if (password !== passwordRepeat) {
            setMessage(registerError, 'Die Passwoerter stimmen nicht ueberein.');
            return;
        }

        if (role === 'betrieb' && (!trade || !radius)) {
            setMessage(registerError, 'Bitte fuer ein Betriebskonto Gewerk und Einsatzradius angeben.');
            return;
        }

        const accounts = getAccounts();
        const existingAccount = accounts.find((account) => account.email === email);

        if (existingAccount) {
            setMessage(registerError, 'Mit dieser E-Mail existiert bereits ein Konto.');
            setAuthView('login');
            loginForm.querySelector('#loginEmail').value = email;
            return;
        }

        const account = {
            role,
            name,
            email,
            password,
            trade,
            radius,
            createdAt: new Date().toISOString()
        };

        accounts.push(account);
        saveAccounts(accounts);
        saveSession({
            role: account.role,
            name: account.name,
            email: account.email
        });

        registerForm.reset();
        updateRegisterRoleFields();
        updateAuthUi();
        setMessage(registerSuccess, `${normalizeRoleLabel(role)}konto fuer ${name} wurde erstellt und angemeldet.`);
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessages();

        const formData = new FormData(loginForm);
        const email = String(formData.get('loginEmail') || '').trim().toLowerCase();
        const password = String(formData.get('loginPassword') || '');

        const account = getAccounts().find((entry) => {
            return entry.email === email && entry.password === password;
        });

        if (!account) {
            setMessage(loginError, 'Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort pruefen.');
            return;
        }

        saveSession({
            role: account.role,
            name: account.name,
            email: account.email
        });

        loginForm.reset();
        updateAuthUi();
        setMessage(loginSuccess, `${normalizeRoleLabel(account.role)}konto mit ${email} wurde erfolgreich angemeldet.`);
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        clearSession();
        clearMessages();
        openAuthSection('login');
        updateAuthUi();
        setMessage(loginSuccess, 'Du wurdest abgemeldet.');
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(event) {
        const targetSelector = this.getAttribute('href');
        if (targetSelector === '#ai-diagnose') {
            event.preventDefault();
            openAiDiagnoseModal();
            return;
        }

        const target = document.querySelector(targetSelector);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});
