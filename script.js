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

const STORAGE_KEYS = {
    accounts: 'nailit.accounts',
    session: 'nailit.session'
};

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
    const anyModalOpen = [aiDiagnoseModal, accountsSection].some((modal) => modal && !modal.classList.contains('is-hidden'));
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
        return `
            <article class="match-card">
                <div class="match-card-header">
                    <div>
                        <strong>${business.name}</strong>
                        <p>${business.specialty}</p>
                    </div>
                    <strong>${business.score}</strong>
                </div>
                <div class="match-meta">
                    <span>${business.city}</span>
                    <span>${business.distance}</span>
                    <span>${business.availability}</span>
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
            return `
                <article class="match-card">
                    <div class="match-card-header">
                        <div>
                            <strong>${business.name}</strong>
                            <p>${business.specialty}</p>
                        </div>
                        <strong>${business.score}</strong>
                    </div>
                    <div class="match-meta">
                        <span>${business.city}</span>
                        <span>${business.distance}</span>
                        <span>${business.availability}</span>
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
        const selectedPhoto = heroPhotoInput?.files[0];

        if (issueDescription && query) {
            issueDescription.value = query;
        }

        syncHeroDescription();

        if (selectedPhoto) {
            syncFileToAnalysisUpload(selectedPhoto);
        }

        openAiDiagnoseModal();

        window.setTimeout(() => {
            issueLocation?.focus();
        }, 250);
    });
}

aiDiagnoseClose?.addEventListener('click', closeAiDiagnoseModal);
aiDiagnoseBackdrop?.addEventListener('click', closeAiDiagnoseModal);
authModalClose?.addEventListener('click', closeAuthModal);
authModalBackdrop?.addEventListener('click', closeAuthModal);

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeAiDiagnoseModal();
        closeAuthModal();
    }
});

registerForm?.querySelectorAll('input[name="registerRole"]').forEach((field) => {
    field.addEventListener('change', updateRegisterRoleFields);
});

updateRegisterRoleFields();

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
