document.addEventListener('DOMContentLoaded', function () {
    const langSelector = document.querySelector('.language-selector');
    const selectedLang = langSelector.querySelector('.selected-lang');
    const langDropdown = langSelector.querySelector('.lang-dropdown');
    const selectedLangImg = document.getElementById('selected-lang-img');

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function changeLanguage(lang) {
        document.body.className = 'lang-' + lang;
        selectedLangImg.src = langDropdown.querySelector(`[data-lang="${lang}"] img`).src;

        // Mise à jour de l'URL sans recharger la page
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        history.pushState({}, '', url);

        // Mise à jour des liens (si nécessaire)
        const links = document.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            if (!links[i].classList.contains('redirection')) {
                let href = new URL(links[i].href);
                href.searchParams.set('lang', lang);
                links[i].href = href.toString();
            }
        }

        // Réinitialiser les écouteurs d'événements pour la navigation interne
        setupInternalNavigation();
    }

    function setupInternalNavigation() {
        const internalLinks = document.querySelectorAll('.redirection');
        internalLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    const lang = getUrlParameter('lang');
    if (lang) {
        changeLanguage(lang);
    }

    selectedLang.addEventListener('click', function () {
        langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });

    langDropdown.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            langDropdown.style.display = 'none';
        });
    });

    document.addEventListener('click', function (e) {
        if (!langSelector.contains(e.target)) {
            langDropdown.style.display = 'none';
        }
    });

    // Initialiser la navigation interne
    setupInternalNavigation();
});

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.project-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1 // Déclenche quand 10% de l'élément est visible
    });

    cards.forEach(card => {
        observer.observe(card);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const figures = document.querySelectorAll('figure');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1 // Déclenche quand 10% de l'élément est visible
    });

    figures.forEach(figure => {
        observer.observe(figure);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.contact-container').forEach(container => {
        container.addEventListener('click', function (e) {
            const target = e.target.closest('[data-copy]');
            if (!target) return;

            const textToCopy = target.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const tooltip = this.querySelector('.tooltip');
                tooltip.style.display = 'block';
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie :', err);
            });
        });
    });

    console.log('Script de copie chargé'); // Pour vérifier si le script s'exécute
});

document.addEventListener('DOMContentLoaded', () => {
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
        // Fermeture au clic en dehors
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
        // Bouton de fermeture
        const closeButton = dialog.querySelector('.closeDialog');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.close();
            });
        }
    });
});
