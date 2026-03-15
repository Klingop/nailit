(function () {
    const isDirectChatPage = window.location.pathname.endsWith('/direct-chat.html') || window.location.pathname.endsWith('direct-chat.html');

    if (!isDirectChatPage) {
        return;
    }

    const DIRECT_CHAT_SCOPE = 'direct-shared';
    const STORAGE_KEYS = {
        theme: 'nailit-theme'
    };
    const PAYMENT_METHODS = {
        stripe: 'Stripe',
        paypal: 'PayPal',
        invoice: 'Rechnung',
        transfer: 'Überweisung'
    };
    const IMMEDIATE_PAYMENT_METHODS = new Set(['stripe', 'paypal']);
    const EXTERNAL_CHECKOUT_METHODS = new Set(['stripe', 'paypal']);
    const LOCAL_DEMO_CHECKOUT_METHODS = new Set(['stripe', 'paypal']);

    const params = new URLSearchParams(window.location.search);
    const business = {
        name: String(params.get('chatBusiness') || 'Meyer Sanitair Notdienst').trim() || 'Meyer Sanitair Notdienst',
        city: String(params.get('chatCity') || 'Berlin Mitte').trim() || 'Berlin Mitte',
        trade: String(params.get('chatTrade') || 'sanitaer').trim() || 'sanitaer'
    };
    const scope = String(params.get('scope') || DIRECT_CHAT_SCOPE).trim() || DIRECT_CHAT_SCOPE;

    const businessNameEl = document.getElementById('messengerBusinessName');
    const businessMetaEl = document.getElementById('messengerBusinessMeta');
    const statusEl = document.getElementById('messengerStatus');
    const themeToggleEl = document.getElementById('themeToggle');
    const themeIconEl = document.getElementById('themeIcon');
    const threadEl = document.getElementById('messengerThread');
    const composerEl = document.getElementById('messengerComposer');
    const inputEl = document.getElementById('messengerInput');
    const quotePanelEl = document.getElementById('quotePanel');
    const appointmentPanelEl = document.getElementById('appointmentPanel');
    const toggleQuotePanelEl = document.getElementById('toggleQuotePanel');
    const toggleAppointmentPanelEl = document.getElementById('toggleAppointmentPanel');
    const paymentPanelEl = document.getElementById('paymentPanel');
    const quoteTitleEl = document.getElementById('quoteTitle');
    const quoteAmountEl = document.getElementById('quoteAmount');
    const quoteNoteEl = document.getElementById('quoteNote');
    const sendQuoteButtonEl = document.getElementById('sendQuoteButton');
    const cancelQuoteButtonEl = document.getElementById('cancelQuoteButton');
    const appointmentDateEl = document.getElementById('appointmentDate');
    const appointmentTimeEl = document.getElementById('appointmentTime');
    const appointmentDurationEl = document.getElementById('appointmentDuration');
    const appointmentPriceEl = document.getElementById('appointmentPrice');
    const appointmentNoteEl = document.getElementById('appointmentNote');
    const sendAppointmentButtonEl = document.getElementById('sendAppointmentButton');
    const cancelAppointmentButtonEl = document.getElementById('cancelAppointmentButton');
    const paymentFormEl = document.getElementById('paymentForm');
    const paymentBusinessEl = document.getElementById('paymentBusiness');
    const paymentAmountEl = document.getElementById('paymentAmount');
    const paymentProviderHintEl = document.getElementById('paymentProviderHint');
    const paymentTransferDetailsEl = document.getElementById('paymentTransferDetails');
    const paymentDemoPanelEl = document.getElementById('paymentDemoPanel');
    const paymentDemoTitleEl = document.getElementById('paymentDemoTitle');
    const paymentDemoTextEl = document.getElementById('paymentDemoText');
    const paymentDemoConfirmEl = document.getElementById('paymentDemoConfirm');
    const paymentDemoCancelEl = document.getElementById('paymentDemoCancel');
    const paymentStatusEl = document.getElementById('paymentStatus');
    const paymentCancelButtonEl = document.getElementById('paymentCancelButton');

    const state = {
        messages: [],
        stream: null,
        pollTimer: null,
        activePaymentMessageId: '',
        paymentConfig: {
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
        }
    };

    const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character] || character));

    const formatTime = (value) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const formatDateTime = (value) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? 'Termin offen' : new Intl.DateTimeFormat('de-DE', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getRole = () => 'customer';

    const getAuthorName = () => 'Du';

    const formatCurrency = (value) => new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(Number(value || 0));

    const formatLongDate = (value) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? 'offen' : new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const getPaymentMethodLabel = (paymentMethod) => PAYMENT_METHODS[paymentMethod] || 'Zahlung';

    const setTheme = (theme) => {
        const nextTheme = theme === 'dark' ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEYS.theme, nextTheme);

        if (nextTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.removeAttribute('data-theme');
        }

        if (themeIconEl) {
            themeIconEl.className = nextTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    const getTheme = () => localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light';

    const messageKey = (message) => {
        if (message.id) {
            return String(message.id);
        }

        return [
            message.type || 'text',
            message.sender || '',
            message.author || '',
            message.text || '',
            message.title || '',
            message.amount || '',
            message.scheduledAt || '',
            message.timestamp || ''
        ].join('::');
    };

    const mergeMessages = (currentMessages, nextMessages) => {
        const merged = new Map();

        [...(currentMessages || []), ...(nextMessages || [])].forEach((message) => {
            if (!message || typeof message !== 'object') {
                return;
            }

            merged.set(messageKey(message), message);
        });

        return Array.from(merged.values()).sort((left, right) => new Date(left.timestamp || 0) - new Date(right.timestamp || 0));
    };

    const buildStarterThread = () => ([{
        id: `welcome-${business.name}`,
        type: 'text',
        sender: 'business',
        author: business.name,
        text: `Willkommen bei ${business.name}. Schreibe hier direkt mit dem Betrieb und stimme Preise oder Termine im Chat ab.`,
        timestamp: new Date().toISOString()
    }]);

    const getMessageById = (messageId) => state.messages.find((message) => String(message.id || '') === String(messageId || '')) || null;

    const getQuoteStateClass = (message) => {
        if (message.status === 'paid') {
            return 'is-paid';
        }

        if (message.status === 'cancelled') {
            return 'is-cancelled';
        }

        if (message.status === 'pending' || message.status === 'checkout') {
            return 'is-pending';
        }

        return '';
    };

    const getQuoteStatusLabel = (message) => {
        if (message.status === 'paid') {
            return 'Bezahlt';
        }

        if (message.status === 'checkout') {
            return `${getPaymentMethodLabel(message.paymentMethod)} geöffnet`;
        }

        if (message.status === 'pending') {
            return message.paymentMethod === 'invoice' ? 'Rechnung erstellt' : 'Wartet auf Zahlung';
        }

        if (message.status === 'cancelled') {
            return 'Storniert';
        }

        return 'Offen';
    };

    const getQuoteStatusNote = (message) => {
        if (message.status === 'paid') {
            return `Die Zahlung über ${getPaymentMethodLabel(message.paymentMethod)} wurde bestätigt.`;
        }

        if (message.status === 'checkout') {
            return `${getPaymentMethodLabel(message.paymentMethod)} wurde geöffnet. Nach dem Abschluss kann der Status im Chat aktualisiert werden.`;
        }

        if (message.status === 'pending' && message.paymentMethod === 'invoice') {
            return `Rechnung ${message.invoiceNumber || 'offen'} erstellt. Fällig bis ${formatLongDate(message.invoiceDueAt)}.`;
        }

        if (message.status === 'pending' && message.paymentMethod === 'transfer') {
            return `Bitte ${formatCurrency(message.amount)} mit der Referenz ${message.invoiceNumber || 'offen'} überweisen.`;
        }

        return 'Dieses Angebot kann direkt im Chat bezahlt werden.';
    };

    const renderQuoteActions = (message) => {
        const actions = [];

        if (!message.amount || Number(message.amount) <= 0) {
            return '';
        }

        if (!['paid', 'cancelled'].includes(message.status || 'open')) {
            actions.push(`<button type="button" class="btn btn-primary chat-offer-pay-btn" data-pay-quote="${escapeHtml(message.id || '')}"><i class="fas fa-credit-card"></i> ${escapeHtml(message.status === 'pending' ? 'Zahlung ändern' : 'Jetzt bezahlen')}</button>`);
        }

        if (message.paymentMethod === 'transfer' && message.transferIban) {
            actions.push(`<button type="button" class="btn btn-secondary" data-copy-transfer="${escapeHtml(message.id || '')}"><i class="fas fa-copy"></i> IBAN kopieren</button>`);
        }

        return actions.length ? `<div class="chat-offer-actions">${actions.join('')}</div>` : '';
    };

    const fetchThread = async () => {
        const response = await fetch(`/api/chat-threads?scope=${encodeURIComponent(scope)}&business=${encodeURIComponent(business.name)}`);

        if (!response.ok) {
            throw new Error('Chat konnte nicht geladen werden.');
        }

        const payload = await response.json();
        return Array.isArray(payload.messages) ? payload.messages : [];
    };

    const persistThread = async (messages) => {
        const response = await fetch('/api/chat-threads', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scope,
                businessName: business.name,
                messages
            })
        });

        if (!response.ok) {
            throw new Error('Chat konnte nicht gespeichert werden.');
        }
    };

    const autoResizeInput = () => {
        if (!inputEl) {
            return;
        }

        inputEl.style.height = 'auto';
        inputEl.style.height = `${Math.min(inputEl.scrollHeight, 148)}px`;
    };

    const renderTextMessage = (message) => `
        <article class="chat-message is-${escapeHtml(message.sender || 'customer')}">
            <div class="chat-message-bubble">
                <div class="chat-message-meta">
                    <strong>${escapeHtml(message.author || '')}</strong>
                    <span>${escapeHtml(formatTime(message.timestamp))}</span>
                </div>
                <div class="chat-message-text">${escapeHtml(message.text || '')}</div>
            </div>
        </article>
    `;

    const renderQuoteMessage = (message) => {
        const amount = Number(message.amount || 0);
        const amountLabel = amount > 0 ? formatCurrency(amount) : 'Preis offen';
        const paymentLabel = message.paymentMethod ? getPaymentMethodLabel(message.paymentMethod) : 'Noch offen';

        return `
            <article class="chat-message is-${escapeHtml(message.sender || 'customer')}">
                <div class="chat-offer-card ${getQuoteStateClass(message)}">
                    <div class="chat-offer-topline">Preisvorschlag</div>
                    <h3>${escapeHtml(message.title || 'Angebot')}</h3>
                    <p>${escapeHtml(message.note || 'Preis wurde direkt im Chat gesendet.')}</p>
                    <div class="chat-offer-footer messenger-card-footer messenger-card-footer-4">
                        <div>
                            <span class="chat-offer-label">Preis</span>
                            <strong>${escapeHtml(amountLabel)}</strong>
                        </div>
                        <div>
                            <span class="chat-offer-label">Von</span>
                            <strong>${escapeHtml(message.author || '')}</strong>
                        </div>
                        <div>
                            <span class="chat-offer-label">Zeit</span>
                            <strong>${escapeHtml(formatTime(message.timestamp))}</strong>
                        </div>
                        <div>
                            <span class="chat-offer-label">Status</span>
                            <strong>${escapeHtml(getQuoteStatusLabel(message))}</strong>
                        </div>
                    </div>
                    <div class="chat-offer-note">${escapeHtml(getQuoteStatusNote(message))}${message.paymentMethod ? ` Zahlungsart: ${escapeHtml(paymentLabel)}.` : ''}</div>
                    ${renderQuoteActions(message)}
                </div>
            </article>
        `;
    };

    const renderAppointmentMessage = (message) => {
        const price = Number(message.price || 0);
        const priceLabel = price > 0 ? `${price.toFixed(0)} EUR` : 'ohne Preis';

        return `
            <article class="chat-message is-${escapeHtml(message.sender || 'customer')}">
                <div class="chat-appointment-card is-pending">
                    <div class="chat-appointment-topline">Terminvorschlag</div>
                    <h3>${escapeHtml(formatDateTime(message.scheduledAt))}</h3>
                    <p>${escapeHtml(message.note || 'Termin wurde direkt im Chat vorgeschlagen.')}</p>
                    <div class="chat-appointment-footer messenger-card-footer messenger-card-footer-4">
                        <div>
                            <span class="chat-offer-label">Dauer</span>
                            <strong>${escapeHtml(String(message.durationMinutes || 60))} Min.</strong>
                        </div>
                        <div>
                            <span class="chat-offer-label">Preis</span>
                            <strong>${escapeHtml(priceLabel)}</strong>
                        </div>
                        <div>
                            <span class="chat-offer-label">Von</span>
                            <strong>${escapeHtml(message.author || '')}</strong>
                        </div>
                        <div>
                            <span class="chat-offer-label">Gesendet</span>
                            <strong>${escapeHtml(formatTime(message.timestamp))}</strong>
                        </div>
                    </div>
                </div>
            </article>
        `;
    };

    const renderMessage = (message) => {
        if (message.type === 'appointment') {
            return renderAppointmentMessage(message);
        }

        if (message.type === 'quote') {
            return renderQuoteMessage(message);
        }

        return renderTextMessage(message);
    };

    const renderThread = () => {
        if (!threadEl) {
            return;
        }

        threadEl.innerHTML = state.messages.length
            ? state.messages.map(renderMessage).join('')
            : '<div class="messenger-empty">Noch keine Nachrichten vorhanden.</div>';

        threadEl.scrollTop = threadEl.scrollHeight;
    };

    const updateStatus = (message) => {
        if (!statusEl) {
            return;
        }

        if (message) {
            statusEl.textContent = message;
            return;
        }

        statusEl.textContent = `Direkter Chat mit ${business.name}.`;
    };

    const setPanelVisibility = (panel, isVisible) => {
        panel?.classList.toggle('is-hidden', !isVisible);
    };

    const closePanels = () => {
        setPanelVisibility(quotePanelEl, false);
        setPanelVisibility(appointmentPanelEl, false);
        setPanelVisibility(paymentPanelEl, false);
    };

    const getProviderCheckoutUrl = (paymentMethod) => {
        if (paymentMethod === 'stripe') {
            return state.paymentConfig.stripeCheckoutUrl;
        }

        if (paymentMethod === 'paypal') {
            return state.paymentConfig.paypalCheckoutUrl;
        }

        return '';
    };

    const hasLivePaymentSupport = (paymentMethod) => {
        if (paymentMethod === 'stripe') {
            return Boolean(state.paymentConfig.stripeEnabled || state.paymentConfig.stripeCheckoutUrl);
        }

        if (paymentMethod === 'paypal') {
            return Boolean(state.paymentConfig.paypalEnabled || state.paymentConfig.paypalCheckoutUrl);
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
                text: 'Stripe ist hier nicht live verbunden. Du kannst die Zahlung direkt im Chat lokal bestätigen.'
            };
        }

        return {
            title: 'PayPal lokal testen',
            text: 'PayPal ist hier nicht live verbunden. Du kannst die Zahlung direkt im Chat lokal bestätigen.'
        };
    };

    const createInvoiceData = ({ offer, paymentMethod }) => {
        const now = new Date();
        const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const invoiceNumber = `NIT-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(now.getTime()).slice(-4)}`;

        return {
            invoiceNumber,
            invoiceCreatedAt: now.toISOString(),
            invoiceDueAt: dueDate.toISOString(),
            customerName: 'Chatkunde',
            customerEmail: 'chat@nailit.local',
            businessName: business.name,
            businessCity: business.city,
            paymentMethod,
            transferHolder: state.paymentConfig.bankTransfer.holder,
            transferIban: state.paymentConfig.bankTransfer.iban,
            transferBic: state.paymentConfig.bankTransfer.bic,
            transferBank: state.paymentConfig.bankTransfer.bank,
            offerTitle: offer.title,
            offerAmount: offer.amount
        };
    };

    const createStripeCheckoutSession = async ({ offer }) => {
        const response = await fetch('/api/payments/stripe/checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: offer.amount,
                title: offer.title,
                offerId: offer.id,
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

    const createPaypalOrder = async ({ offer }) => {
        const response = await fetch('/api/payments/paypal/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: offer.amount,
                title: offer.title,
                offerId: offer.id,
                businessName: business.name,
                scope
            })
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(payload.error || 'PayPal konnte nicht gestartet werden.');
        }

        return payload;
    };

    const updateMessage = async (messageId, transform, systemText = '') => {
        const nextMessages = state.messages.map((message) => {
            if (String(message.id || '') === String(messageId || '')) {
                return transform(message);
            }

            return message;
        });

        if (systemText) {
            nextMessages.push({
                id: `system-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                type: 'text',
                sender: 'business',
                author: business.name,
                text: systemText,
                timestamp: new Date().toISOString()
            });
        }

        await saveMessages(nextMessages, 'Zahlung wird gespeichert...');
    };

    const closePaymentPanel = () => {
        setPanelVisibility(paymentPanelEl, false);
        state.activePaymentMessageId = '';

        if (paymentStatusEl) {
            paymentStatusEl.textContent = '';
        }

        if (paymentDemoConfirmEl) {
            paymentDemoConfirmEl.onclick = null;
        }

        if (paymentDemoCancelEl) {
            paymentDemoCancelEl.onclick = null;
        }
    };

    const updatePaymentDemoState = () => {
        if (!paymentFormEl || !paymentDemoPanelEl) {
            return;
        }

        const selectedMethod = String(new FormData(paymentFormEl).get('paymentMethod') || 'stripe');
        const providerUrl = getProviderCheckoutUrl(selectedMethod);
        const showDemoPanel = shouldUseLocalDemoCheckout(selectedMethod, providerUrl);

        paymentDemoPanelEl.classList.toggle('is-hidden', !showDemoPanel);

        if (showDemoPanel) {
            const copy = getLocalDemoCheckoutCopy(selectedMethod);

            if (paymentDemoTitleEl) {
                paymentDemoTitleEl.textContent = copy.title;
            }

            if (paymentDemoTextEl) {
                paymentDemoTextEl.textContent = copy.text;
            }
        }
    };

    const updatePaymentMethodDetails = () => {
        if (!paymentFormEl) {
            return;
        }

        const selectedMethod = String(new FormData(paymentFormEl).get('paymentMethod') || 'stripe');

        if (paymentProviderHintEl) {
            if (selectedMethod === 'stripe') {
                paymentProviderHintEl.textContent = hasLivePaymentSupport('stripe')
                    ? 'Stripe ist vorbereitet. Falls ein Live-Key gesetzt ist, wird ein echter Checkout geöffnet.'
                    : 'Stripe läuft aktuell als lokaler Demo-Checkout direkt im Chat.';
            } else if (selectedMethod === 'paypal') {
                paymentProviderHintEl.textContent = hasLivePaymentSupport('paypal')
                    ? 'PayPal ist vorbereitet. Falls Credentials gesetzt sind, wird ein echter Checkout geöffnet.'
                    : 'PayPal läuft aktuell als lokaler Demo-Checkout direkt im Chat.';
            } else if (selectedMethod === 'invoice') {
                paymentProviderHintEl.textContent = 'Die Rechnung wird direkt im Chat erzeugt und das Angebot auf wartend gesetzt.';
            } else {
                paymentProviderHintEl.textContent = 'Die Überweisungsdaten werden direkt im Chat abgelegt.';
            }
        }

        if (paymentTransferDetailsEl) {
            if (selectedMethod === 'transfer') {
                paymentTransferDetailsEl.classList.remove('is-hidden');
                paymentTransferDetailsEl.innerHTML = `
                    <strong>Bankdaten für die Überweisung</strong>
                    <div class="payment-transfer-grid">
                        <div>
                            <span>Kontoinhaber</span>
                            <strong>${escapeHtml(state.paymentConfig.bankTransfer.holder)}</strong>
                        </div>
                        <div>
                            <span>Bank</span>
                            <strong>${escapeHtml(state.paymentConfig.bankTransfer.bank)}</strong>
                        </div>
                        <div>
                            <span>IBAN</span>
                            <strong>${escapeHtml(state.paymentConfig.bankTransfer.iban)}</strong>
                        </div>
                        <div>
                            <span>BIC</span>
                            <strong>${escapeHtml(state.paymentConfig.bankTransfer.bic)}</strong>
                        </div>
                    </div>
                `;
            } else {
                paymentTransferDetailsEl.classList.add('is-hidden');
                paymentTransferDetailsEl.innerHTML = '';
            }
        }

        updatePaymentDemoState();
    };

    const openPaymentPanel = (messageId) => {
        const quoteMessage = getMessageById(messageId);

        if (!quoteMessage || quoteMessage.type !== 'quote') {
            return;
        }

        state.activePaymentMessageId = String(messageId);
        closePanels();
        setPanelVisibility(paymentPanelEl, true);

        if (paymentBusinessEl) {
            paymentBusinessEl.textContent = business.name;
        }

        if (paymentAmountEl) {
            paymentAmountEl.textContent = formatCurrency(quoteMessage.amount || 0);
        }

        const preferredMethod = quoteMessage.paymentMethod || 'stripe';
        const preferredInput = paymentFormEl?.querySelector(`input[name="paymentMethod"][value="${preferredMethod}"]`);

        if (preferredInput instanceof HTMLInputElement) {
            preferredInput.checked = true;
        }

        updatePaymentMethodDetails();
        updateStatus('Zahlungsart für das Angebot wählen.');
    };

    const finalizePaymentFlow = async ({ paymentMethod, providerUrl = '', externalReference = '', usedDemoCheckout = false }) => {
        const existingOffer = getMessageById(state.activePaymentMessageId);

        if (!existingOffer) {
            return;
        }

        const invoiceData = createInvoiceData({
            offer: existingOffer,
            paymentMethod
        });
        const isImmediatePayment = IMMEDIATE_PAYMENT_METHODS.has(paymentMethod);
        const isExternalCheckout = EXTERNAL_CHECKOUT_METHODS.has(paymentMethod);
        const markPaidImmediately = usedDemoCheckout || !isExternalCheckout;

        await updateMessage(state.activePaymentMessageId, (message) => ({
            ...message,
            status: isExternalCheckout && !markPaidImmediately ? 'checkout' : isImmediatePayment ? 'paid' : 'pending',
            paymentMethod,
            amountPaid: markPaidImmediately && isImmediatePayment ? Number(message.amount || 0) : Number(message.amountPaid || 0),
            paidAt: markPaidImmediately && isImmediatePayment ? new Date().toISOString() : message.paidAt || '',
            externalReference,
            providerRedirected: Boolean(providerUrl),
            checkoutRequestedAt: isExternalCheckout && !markPaidImmediately ? new Date().toISOString() : message.checkoutRequestedAt || '',
            ...invoiceData
        }), isExternalCheckout && !markPaidImmediately
            ? `${getPaymentMethodLabel(paymentMethod)} wurde geöffnet. Nach der Rückkehr kann der Status im Chat weitergeführt werden.`
            : paymentMethod === 'invoice'
                ? `Rechnung ${invoiceData.invoiceNumber} wurde direkt im Chat erstellt.`
                : paymentMethod === 'transfer'
                    ? `Die Überweisungsdaten wurden direkt im Chat hinterlegt.`
                    : `Die Zahlung per ${getPaymentMethodLabel(paymentMethod)} wurde im Chat bestätigt.`);

        closePaymentPanel();
        updateStatus();
    };

    const handlePaymentStart = async (event) => {
        event.preventDefault();

        const existingOffer = getMessageById(state.activePaymentMessageId);

        if (!existingOffer) {
            return;
        }

        const paymentMethod = String(new FormData(paymentFormEl || undefined).get('paymentMethod') || 'stripe');
        let providerUrl = getProviderCheckoutUrl(paymentMethod);
        let externalReference = '';

        if (paymentStatusEl) {
            paymentStatusEl.textContent = '';
        }

        if (paymentMethod === 'stripe' && state.paymentConfig.stripeEnabled) {
            try {
                const session = await createStripeCheckoutSession({ offer: existingOffer });
                providerUrl = session.url || providerUrl;
                externalReference = session.id || '';
            } catch (error) {
                if (paymentStatusEl) {
                    paymentStatusEl.textContent = error.message || 'Stripe Checkout konnte nicht gestartet werden.';
                }

                if (!providerUrl) {
                    return;
                }
            }
        }

        if (paymentMethod === 'paypal' && state.paymentConfig.paypalEnabled) {
            try {
                const order = await createPaypalOrder({ offer: existingOffer });
                providerUrl = order.approveUrl || providerUrl;
                externalReference = order.id || '';
            } catch (error) {
                if (paymentStatusEl) {
                    paymentStatusEl.textContent = error.message || 'PayPal konnte nicht gestartet werden.';
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

            if (paymentStatusEl) {
                paymentStatusEl.textContent = `Lokaler ${getPaymentMethodLabel(paymentMethod)}-Checkout ist bereit.`;
            }

            if (paymentDemoConfirmEl) {
                paymentDemoConfirmEl.onclick = () => {
                    void finalizePaymentFlow({
                        paymentMethod,
                        providerUrl,
                        externalReference,
                        usedDemoCheckout: true
                    });
                };
            }

            if (paymentDemoCancelEl) {
                paymentDemoCancelEl.onclick = () => {
                    if (paymentStatusEl) {
                        paymentStatusEl.textContent = `${getPaymentMethodLabel(paymentMethod)} wurde abgebrochen.`;
                    }
                };
            }

            return;
        }

        await finalizePaymentFlow({
            paymentMethod,
            providerUrl,
            externalReference,
            usedDemoCheckout: false
        });
    };

    const copyTransferIban = async (messageId) => {
        const quoteMessage = getMessageById(messageId);
        const iban = quoteMessage?.transferIban || '';

        if (!iban) {
            updateStatus('Keine IBAN vorhanden.');
            return;
        }

        try {
            await navigator.clipboard.writeText(iban);
            updateStatus('IBAN wurde kopiert.');
        } catch {
            updateStatus(`IBAN: ${iban}`);
        }
    };

    const loadPaymentConfig = async () => {
        try {
            const response = await fetch('/api/payments/config');

            if (!response.ok) {
                return;
            }

            const config = await response.json();

            if (config && typeof config === 'object') {
                state.paymentConfig = {
                    ...state.paymentConfig,
                    ...config,
                    bankTransfer: {
                        ...state.paymentConfig.bankTransfer,
                        ...(config.bankTransfer || {})
                    }
                };
            }
        } catch {
            // Local static preview can run without payment config.
        } finally {
            updatePaymentMethodDetails();
        }
    };

    const saveMessages = async (messages, pendingStatus) => {
        state.messages = messages;
        renderThread();
        updateStatus(pendingStatus);
        await persistThread(messages);
        updateStatus();
    };

    const appendMessage = async (message, pendingStatus) => {
        const nextMessages = mergeMessages(state.messages, [message]);
        await saveMessages(nextMessages, pendingStatus);
    };

    const createBaseMessage = (type) => ({
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        type,
        sender: getRole(),
        author: getAuthorName(),
        status: type === 'quote' ? 'open' : undefined,
        timestamp: new Date().toISOString()
    });

    const handleComposerSubmit = async (event) => {
        event.preventDefault();

        const text = String(inputEl?.value || '').trim();

        if (!text) {
            inputEl?.focus();
            return;
        }

        inputEl.value = '';
        autoResizeInput();

        try {
            await appendMessage({
                ...createBaseMessage('text'),
                text
            }, 'Nachricht wird gesendet...');
        } catch (error) {
            updateStatus(error.message || 'Nachricht konnte nicht gesendet werden.');
        }
    };

    const handleQuoteSend = async () => {
        const title = String(quoteTitleEl?.value || '').trim();
        const amount = Math.max(0, Number(quoteAmountEl?.value || 0));
        const note = String(quoteNoteEl?.value || '').trim();

        if (!title && amount <= 0 && !note) {
            updateStatus('Bitte mindestens einen Preis oder Titel eingeben.');
            return;
        }

        try {
            await appendMessage({
                ...createBaseMessage('quote'),
                sender: 'business',
                author: business.name,
                title: title || 'Preisvorschlag',
                amount,
                note
            }, 'Preisvorschlag wird gesendet...');

            if (quoteTitleEl) quoteTitleEl.value = '';
            if (quoteAmountEl) quoteAmountEl.value = '';
            if (quoteNoteEl) quoteNoteEl.value = '';
            closePanels();
        } catch (error) {
            updateStatus(error.message || 'Preis konnte nicht gesendet werden.');
        }
    };

    const handleAppointmentSend = async () => {
        const nextDate = String(appointmentDateEl?.value || '').trim();
        const nextTime = String(appointmentTimeEl?.value || '').trim();

        if (!nextDate || !nextTime) {
            updateStatus('Bitte Datum und Uhrzeit fuer den Termin auswaehlen.');
            return;
        }

        const scheduledAt = new Date(`${nextDate}T${nextTime}`);

        if (Number.isNaN(scheduledAt.getTime())) {
            updateStatus('Termin konnte nicht erstellt werden.');
            return;
        }

        try {
            await appendMessage({
                ...createBaseMessage('appointment'),
                scheduledAt: scheduledAt.toISOString(),
                durationMinutes: Number(appointmentDurationEl?.value || 60),
                price: Math.max(0, Number(appointmentPriceEl?.value || 0)),
                note: String(appointmentNoteEl?.value || '').trim()
            }, 'Termin wird gesendet...');

            if (appointmentDateEl) appointmentDateEl.value = '';
            if (appointmentTimeEl) appointmentTimeEl.value = '';
            if (appointmentPriceEl) appointmentPriceEl.value = '';
            if (appointmentNoteEl) appointmentNoteEl.value = '';
            if (appointmentDurationEl) appointmentDurationEl.value = '60';
            closePanels();
        } catch (error) {
            updateStatus(error.message || 'Termin konnte nicht gesendet werden.');
        }
    };

    const connectLiveSync = () => {
        if (state.stream) {
            state.stream.close();
        }

        state.stream = new EventSource(`/api/chat-threads/stream?scope=${encodeURIComponent(scope)}&business=${encodeURIComponent(business.name)}`);
        state.stream.addEventListener('thread', (event) => {
            try {
                const payload = JSON.parse(String(event.data || '{}'));
                const nextMessages = Array.isArray(payload.messages) ? payload.messages : [];
                state.messages = mergeMessages(state.messages, nextMessages);
                renderThread();
                updateStatus();
            } catch {
                updateStatus('Live-Update konnte nicht verarbeitet werden.');
            }
        });
        state.stream.onerror = () => {
            updateStatus('Live-Chat verbindet neu...');
        };

        if (state.pollTimer) {
            window.clearInterval(state.pollTimer);
        }

        state.pollTimer = window.setInterval(async () => {
            if (document.hidden) {
                return;
            }

            try {
                const nextMessages = await fetchThread();
                state.messages = mergeMessages(state.messages, nextMessages);
                renderThread();
            } catch {
                // Polling is only a fallback.
            }
        }, 2500);
    };

    const init = async () => {
        if (businessNameEl) {
            businessNameEl.textContent = business.name;
        }

        if (businessMetaEl) {
            businessMetaEl.textContent = `${business.trade} in ${business.city}. Direkter Chat mit dem Betrieb.`;
        }

        setTheme(getTheme());
        updateStatus();
        autoResizeInput();
        updatePaymentMethodDetails();

        themeToggleEl?.addEventListener('click', () => {
            setTheme(getTheme() === 'dark' ? 'light' : 'dark');
        });

        toggleQuotePanelEl?.addEventListener('click', () => {
            const shouldOpen = quotePanelEl?.classList.contains('is-hidden');
            closePanels();
            setPanelVisibility(quotePanelEl, Boolean(shouldOpen));
        });

        toggleAppointmentPanelEl?.addEventListener('click', () => {
            const shouldOpen = appointmentPanelEl?.classList.contains('is-hidden');
            closePanels();
            setPanelVisibility(appointmentPanelEl, Boolean(shouldOpen));
        });

        cancelQuoteButtonEl?.addEventListener('click', closePanels);
        cancelAppointmentButtonEl?.addEventListener('click', closePanels);
        paymentCancelButtonEl?.addEventListener('click', closePaymentPanel);
        sendQuoteButtonEl?.addEventListener('click', handleQuoteSend);
        sendAppointmentButtonEl?.addEventListener('click', handleAppointmentSend);
        composerEl?.addEventListener('submit', handleComposerSubmit);
        paymentFormEl?.addEventListener('submit', handlePaymentStart);
        paymentFormEl?.addEventListener('change', updatePaymentMethodDetails);

        inputEl?.addEventListener('input', autoResizeInput);
        inputEl?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                composerEl?.requestSubmit();
            }
        });

        threadEl?.addEventListener('click', (event) => {
            const payButton = event.target.closest('[data-pay-quote]');
            const copyButton = event.target.closest('[data-copy-transfer]');

            if (payButton instanceof HTMLElement) {
                openPaymentPanel(payButton.getAttribute('data-pay-quote') || '');
                return;
            }

            if (copyButton instanceof HTMLElement) {
                void copyTransferIban(copyButton.getAttribute('data-copy-transfer') || '');
            }
        });

        try {
            await loadPaymentConfig();
            const loadedMessages = await fetchThread();
            state.messages = loadedMessages.length ? loadedMessages : buildStarterThread();

            if (!loadedMessages.length) {
                await persistThread(state.messages);
            }

            renderThread();
            connectLiveSync();
        } catch (error) {
            updateStatus(error.message || 'Chat konnte nicht gestartet werden.');
        }
    };

    window.addEventListener('beforeunload', () => {
        if (state.stream) {
            state.stream.close();
        }

        if (state.pollTimer) {
            window.clearInterval(state.pollTimer);
        }
    });

    init();
}());