document.addEventListener('DOMContentLoaded', function() {
    // Sélecteurs globaux
    const nav = document.getElementById('main-nav');
    const figures = document.querySelectorAll('figure');
    const cards = document.querySelectorAll('.project-card');
    const langSelector = document.querySelector('.language-selector');
    const selectedLang = langSelector.querySelector('.selected-lang');
    const langDropdown = langSelector.querySelector('.lang-dropdown');
    const selectedLangImg = document.getElementById('selected-lang-img');

    // Fonctions utilitaires
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function changeLanguage(lang) {
        document.body.className = 'lang-' + lang;
        selectedLangImg.src = langDropdown.querySelector(`[data-lang="${lang}"] img`).src;

        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        history.pushState({}, '', url);

        document.querySelectorAll('a:not(.redirection)').forEach(link => {
            let href = new URL(link.href);
            href.searchParams.set('lang', lang);
            link.href = href.toString();
        });

        setupInternalNavigation();
    }

    function setupInternalNavigation() {
        document.querySelectorAll('.redirection').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Navigation smooth scroll
    nav.addEventListener('click', function(e) {
        if (e.target.classList.contains('redirection') || e.target.closest('.redirection')) {
            e.preventDefault();
            const link = e.target.closest('.redirection');
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Animation des éléments
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    figures.forEach(figure => observer.observe(figure));
    cards.forEach(card => observer.observe(card));

    // Gestion des contacts
    document.querySelectorAll('.contact-container').forEach(container => {
        container.addEventListener('click', function(e) {
            const target = e.target.closest('[data-copy]');
            if (!target) return;

            const textToCopy = target.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const tooltip = this.querySelector('.tooltip');
                tooltip.style.display = 'block';
                setTimeout(() => tooltip.style.display = 'none', 2000);
            }).catch(err => console.error('Erreur lors de la copie :', err));
        });
    });

    // Sélecteur de langue
    selectedLang.addEventListener('click', () => {
        langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });

    langDropdown.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', function() {
            changeLanguage(this.getAttribute('data-lang'));
            langDropdown.style.display = 'none';
        });
    });

    document.addEventListener('click', function(e) {
        if (!langSelector.contains(e.target)) {
            langDropdown.style.display = 'none';
        }
    });

    // Gestion des dialogues
    const openButtons = document.querySelectorAll('[id^="open_"][id$="_dialog"]');
    const dialogs = document.querySelectorAll('dialog');

    openButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const dialogId = button.id.replace('open_', '').replace('_dialog', '');
            const dialog = document.getElementById(`info_${dialogId}`);
            
            if (dialog) {
                dialog.showModal();
            }
        });
    });

    dialogs.forEach(dialog => {
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        const closeButton = dialog.querySelector('.closeDialog');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.close();
            });
        }
    });

    // Initialisation
    const lang = getUrlParameter('lang');
    if (lang) changeLanguage(lang);
    setupInternalNavigation();
});
