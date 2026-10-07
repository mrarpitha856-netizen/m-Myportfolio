/**
 * Portfolio JavaScript
 * Features:
 * - Vertical Navigation Bar with ScrollSpy active link indicators
 * - Accessible Mobile Drawer with Backdrop and Keyboard (Esc) trap
 * - Night Mode toggle synchronized between sidebar & mobile header
 * - Automatic CSS media query detection (prefers-color-scheme)
 * - 8-Bit Web Audio Synthesizer with on/off sound toggle
 * - Interactive Retro Terminal Chatbot
 */

let sfxEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initVerticalSidebar();
    initScrollSpy();
    initSoundToggle();
    initTerminalChat();
    initSkillsSection();
});

/**
 * 0. Skills Section: Tab Filtering + XP Bar Animation
 */
function initSkillsSection() {
    // ── Tab filtering ────────────────────────────────────────
    const tabs = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab style
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const selected = tab.getAttribute('data-tab');

            // Show / hide cards based on category
            skillCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (selected === 'all' || cat === selected) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            play8BitSound(440);
        });
    });

    // ── XP bar animation on scroll into view ────────────────
    const xpFills = document.querySelectorAll('.skill-xp-fill');
    const powerFill = document.querySelector('.power-level-fill');

    function animateXP(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each skill XP bar to its target width
                xpFills.forEach(fill => {
                    const target = fill.getAttribute('data-xp');
                    if (target) {
                        fill.style.width = `${target}%`;
                    }
                });
                // Animate overall power bar
                if (powerFill) {
                    powerFill.style.width = '85%';
                }
            }
        });
    }

    const skillsSection = document.getElementById('skills');
    if (skillsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(animateXP, { threshold: 0.15 });
        observer.observe(skillsSection);
    } else {
        // Fallback: animate immediately if no IntersectionObserver
        xpFills.forEach(fill => {
            const target = fill.getAttribute('data-xp');
            if (target) fill.style.width = `${target}%`;
        });
        if (powerFill) powerFill.style.width = '85%';
    }
}

/**
 * 1. Night Mode & Theme Management
 */
function initThemeManager() {
    const sidebarThemeBtn = document.getElementById('theme-toggle');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

    const storedTheme = localStorage.getItem('portfolio-theme'); // 'dark' | 'light' | null

    function getSystemTheme() {
        return mediaQueryDark.matches ? 'dark' : 'light';
    }

    function applyTheme(theme, isUserManual = false) {
        if (isUserManual) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('portfolio-theme');
        }

        const effectiveTheme = theme || getSystemTheme();
        const isDark = effectiveTheme === 'dark';

        // Update sidebar button state
        if (sidebarThemeBtn) {
            sidebarThemeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            sidebarThemeBtn.setAttribute('title', `Theme: ${effectiveTheme.toUpperCase()} (Click to toggle)`);
        }

        // Update mobile button state
        if (mobileThemeBtn) {
            mobileThemeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            mobileThemeBtn.setAttribute('title', `Theme: ${effectiveTheme.toUpperCase()}`);
        }

        // Update label
        if (themeLabel) {
            themeLabel.textContent = isDark ? 'MODE: NIGHT' : 'MODE: DAY';
        }
    }

    // Initialize initial state
    if (storedTheme === 'dark' || storedTheme === 'light') {
        applyTheme(storedTheme, true);
    } else {
        applyTheme(getSystemTheme(), false);
    }

    // Listen for OS / Browser Theme changes via Media Query
    mediaQueryDark.addEventListener('change', (e) => {
        const hasManualOverride = localStorage.getItem('portfolio-theme');
        if (!hasManualOverride) {
            applyTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    // Toggle handler
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || getSystemTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        play8BitSound(newTheme === 'dark' ? 240 : 520);
        applyTheme(newTheme, true);
    }

    if (sidebarThemeBtn) sidebarThemeBtn.addEventListener('click', toggleTheme);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);
}

/**
 * 2. Vertical Sidebar & Mobile Drawer Navigation
 */
function initVerticalSidebar() {
    const sidebar = document.getElementById('vertical-navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const backdrop = document.getElementById('sidebar-backdrop');
    const navLinks = document.querySelectorAll('.sidebar-link');

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('sidebar-open');
        if (backdrop) backdrop.classList.add('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
        sidebar.setAttribute('aria-hidden', 'false');
        play8BitSound(600);
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('sidebar-open');
        if (backdrop) backdrop.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('sidebar-open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', () => {
            play8BitSound(300);
            closeSidebar();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
            closeSidebar();
        }
    });

    // Close mobile drawer when clicking any link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            play8BitSound(480);
            if (window.innerWidth < 1024) {
                closeSidebar();
            }
        });
    });
}

/**
 * 3. ScrollSpy: Highlight Active Section in Vertical Navigation
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-link');

    if (!sections.length || !navLinks.length) return;

    function handleScroll() {
        const scrollPosition = window.scrollY + 160;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger once on load
}

/**
 * 4. SFX Sound Effects Toggle
 */
function initSoundToggle() {
    const soundBtn = document.getElementById('sound-toggle');
    const soundText = document.getElementById('sound-text');
    const soundIcon = document.getElementById('sound-icon');

    // Retrieve saved sound preference
    const savedSound = localStorage.getItem('portfolio-sfx');
    if (savedSound !== null) {
        sfxEnabled = savedSound === 'true';
    }

    function updateSoundUI() {
        if (soundText) soundText.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: MUTED';
        if (soundIcon) soundIcon.textContent = sfxEnabled ? '🔊' : '🔇';
    }

    updateSoundUI();

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            sfxEnabled = !sfxEnabled;
            localStorage.setItem('portfolio-sfx', String(sfxEnabled));
            updateSoundUI();
            if (sfxEnabled) {
                play8BitSound(660);
            }
        });
    }
}

/**
 * 5. Retro 8-Bit Web Audio Synthesizer
 */
function play8BitSound(frequency = 440) {
    if (!sfxEnabled) return;

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency * 1.3, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    } catch {
        // AudioContext policy blocked or unsupported
    }
}

/**
 * 6. Interactive Terminal Chatbot
 */
function initTerminalChat() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const promptChips = document.querySelectorAll('.prompt-chip');

    if (!chatMessages) return;

    const botResponses = {
        skills: "⚡ Arpitha's core tech stack spans JavaScript/TypeScript, React, Node.js, Python, Java, SQL/PostgreSQL, Docker, and Cloud architectures.",
        projects: "🎮 Featured projects include a full-stack web application with authenticated dashboards, a high-performance cloud API service, and a developer CLI utility!",
        resume: "💾 You can download Arpitha's resume directly via the 'Arpitha_Resume.pdf' link in the hero section or menu!",
        contact: "✉️ You can reach Arpitha directly via the contact form below or connect through LinkedIn and GitHub!",
        default: "👾 Quest log updated! Arpitha is ready for new software engineering challenges, full-stack builds, and team collaborations. Check out the Projects section or send a message via Contact!"
    };

    function appendMessage(sender, text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isUser ? 'msg-user' : 'msg-bot'}`;

        const senderSpan = document.createElement('span');
        senderSpan.className = 'msg-sender';
        senderSpan.textContent = sender;

        const textSpan = document.createElement('span');
        textSpan.className = 'msg-text';
        textSpan.textContent = text;

        msgDiv.appendChild(senderSpan);
        msgDiv.appendChild(textSpan);
        chatMessages.appendChild(msgDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserInput(query) {
        const cleanQuery = query.trim().toLowerCase();
        appendMessage('[YOU]:', query, true);
        play8BitSound(400);

        setTimeout(() => {
            let response = botResponses.default;
            if (cleanQuery.includes('skill') || cleanQuery.includes('stack') || cleanQuery.includes('tech')) {
                response = botResponses.skills;
            } else if (cleanQuery.includes('project') || cleanQuery.includes('work') || cleanQuery.includes('app')) {
                response = botResponses.projects;
            } else if (cleanQuery.includes('resume') || cleanQuery.includes('cv') || cleanQuery.includes('download')) {
                response = botResponses.resume;
            } else if (cleanQuery.includes('contact') || cleanQuery.includes('hire') || cleanQuery.includes('email')) {
                response = botResponses.contact;
            }

            appendMessage('[ARPITHA.AI]:', response, false);
            play8BitSound(750);
        }, 350);
    }

    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            handleUserInput(text);
            chatInput.value = '';
        });
    }

    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const queryType = chip.getAttribute('data-query');
            const queries = {
                skills: "What are Arpitha's core skills?",
                projects: "Tell me about featured projects",
                resume: "How do I download the resume?",
                contact: "How can I contact Arpitha?"
            };
            handleUserInput(queries[queryType] || chip.textContent.trim());
        });
    });
}
