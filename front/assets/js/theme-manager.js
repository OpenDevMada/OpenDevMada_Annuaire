/**
 * Système de thème pour OpenDev Madagascar
 * Gère le mode sombre/clair avec préférences utilisateur
 */

class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Clair',
                icon: 'fas fa-sun',
                class: '',
                colors: {
                    primary: 'rgb(14, 165, 233)',
                    background: 'rgb(249, 250, 251)',
                    surface: 'rgb(255, 255, 255)',
                    text: 'rgb(17, 24, 39)',
                    textSecondary: 'rgb(107, 114, 128)'
                }
            },
            dark: {
                name: 'Sombre',
                icon: 'fas fa-moon',
                class: 'dark',
                colors: {
                    primary: 'rgb(59, 130, 246)',
                    background: 'rgb(17, 24, 39)',
                    surface: 'rgb(31, 41, 55)',
                    text: 'rgb(243, 244, 246)',
                    textSecondary: 'rgb(156, 163, 175)'
                }
            },
            auto: {
                name: 'Automatique',
                icon: 'fas fa-circle-half-stroke',
                class: 'auto',
                colors: null // Sera calculé dynamiquement
            }
        };

        this.currentTheme = this.getStoredTheme() || 'auto';
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }

    init() {
        // Appliquer le thème initial
        this.applyTheme(this.currentTheme);
        
        // Écouter les changements de préférence système
        this.mediaQuery.addListener((e) => {
            if (this.currentTheme === 'auto') {
                this.applySystemTheme();
            }
        });

        // Créer les contrôles de thème
        this.createThemeControls();
        
        // Ajouter les styles CSS dynamiques
        this.injectThemeStyles();
    }

    getStoredTheme() {
        return localStorage.getItem('opendev-theme') || 'auto';
    }

    setStoredTheme(theme) {
        localStorage.setItem('opendev-theme', theme);
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        this.currentTheme = themeName;
        this.setStoredTheme(themeName);

        // Retirer toutes les classes de thème
        document.documentElement.classList.remove('dark');
        
        if (themeName === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (themeName === 'auto') {
            this.applySystemTheme();
        }

        // Mettre à jour les contrôles
        this.updateThemeControls();
        
        // Déclencher un événement personnalisé
        this.dispatchThemeChange(themeName);
    }

    applySystemTheme() {
        const isDark = this.mediaQuery.matches;
        document.documentElement.classList.toggle('dark', isDark);
    }

    getCurrentEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            return this.mediaQuery.matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    createThemeControls() {
        // Créer le sélecteur de thème dans la navigation
        const nav = document.querySelector('nav .flex');
        if (!nav) return;

        const themeContainer = document.createElement('div');
        themeContainer.className = 'relative';
        themeContainer.innerHTML = `
            <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Changer de thème">
                <i class="fas fa-circle-half-stroke text-gray-600 dark:text-gray-300"></i>
            </button>
            <div id="theme-menu" class="hidden absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[160px]">
                ${Object.entries(this.themes).map(([key, theme]) => `
                    <button class="theme-option w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3" data-theme="${key}">
                        <i class="${theme.icon} text-gray-600 dark:text-gray-300"></i>
                        <span class="text-gray-900 dark:text-gray-100">${theme.name}</span>
                        <i class="fas fa-check text-primary-600 ml-auto hidden theme-check"></i>
                    </button>
                `).join('')}
            </div>
        `;

        nav.appendChild(themeContainer);

        // Événements
        const toggleBtn = document.getElementById('theme-toggle');
        const themeMenu = document.getElementById('theme-menu');
        const themeOptions = document.querySelectorAll('.theme-option');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('hidden');
        });

        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', () => {
            themeMenu.classList.add('hidden');
        });

        // Options de thème
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                themeMenu.classList.add('hidden');
            });
        });

        this.updateThemeControls();
    }

    updateThemeControls() {
        const toggleBtn = document.getElementById('theme-toggle');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        if (toggleBtn) {
            const currentTheme = this.themes[this.currentTheme];
            toggleBtn.innerHTML = `<i class="${currentTheme.icon} text-gray-600 dark:text-gray-300"></i>`;
        }

        // Mettre à jour les coches
        themeOptions.forEach(option => {
            const check = option.querySelector('.theme-check');
            if (option.dataset.theme === this.currentTheme) {
                check.classList.remove('hidden');
            } else {
                check.classList.add('hidden');
            }
        });
    }

    injectThemeStyles() {
        const style = document.createElement('style');
        style.id = 'theme-styles';
        style.textContent = `
            /* Transitions de thème */
            html {
                transition: background-color 0.3s ease, color 0.3s ease;
            }
            
            * {
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }

            /* Styles pour le mode sombre */
            .dark {
                color-scheme: dark;
            }

            /* Variables CSS personnalisées */
            :root {
                --theme-primary: ${this.themes.light.colors.primary};
                --theme-bg: ${this.themes.light.colors.background};
                --theme-surface: ${this.themes.light.colors.surface};
                --theme-text: ${this.themes.light.colors.text};
                --theme-text-secondary: ${this.themes.light.colors.textSecondary};
            }

            .dark {
                --theme-primary: ${this.themes.dark.colors.primary};
                --theme-bg: ${this.themes.dark.colors.background};
                --theme-surface: ${this.themes.dark.colors.surface};
                --theme-text: ${this.themes.dark.colors.text};
                --theme-text-secondary: ${this.themes.dark.colors.textSecondary};
            }

            /* Classes utilitaires pour le thème */
            .theme-bg {
                background-color: var(--theme-bg);
            }

            .theme-surface {
                background-color: var(--theme-surface);
            }

            .theme-text {
                color: var(--theme-text);
            }

            .theme-text-secondary {
                color: var(--theme-text-secondary);
            }

            .theme-primary {
                color: var(--theme-primary);
            }

            .theme-primary-bg {
                background-color: var(--theme-primary);
            }

            /* Amélioration des contrastes en mode sombre */
            .dark .bg-gray-50 {
                background-color: rgb(31, 41, 55);
            }

            .dark .bg-gray-100 {
                background-color: rgb(55, 65, 81);
            }

            .dark .bg-white {
                background-color: rgb(31, 41, 55);
            }

            .dark .text-gray-900 {
                color: rgb(243, 244, 246);
            }

            .dark .text-gray-700 {
                color: rgb(209, 213, 219);
            }

            .dark .text-gray-600 {
                color: rgb(156, 163, 175);
            }

            .dark .border-gray-200 {
                border-color: rgb(55, 65, 81);
            }

            .dark .border-gray-300 {
                border-color: rgb(75, 85, 99);
            }

            /* Animations de transition */
            @keyframes theme-transition {
                from { opacity: 0.8; }
                to { opacity: 1; }
            }

            .theme-transition {
                animation: theme-transition 0.3s ease;
            }

            /* Scrollbar en mode sombre */
            .dark ::-webkit-scrollbar {
                width: 8px;
            }

            .dark ::-webkit-scrollbar-track {
                background: rgb(31, 41, 55);
            }

            .dark ::-webkit-scrollbar-thumb {
                background: rgb(75, 85, 99);
                border-radius: 4px;
            }

            .dark ::-webkit-scrollbar-thumb:hover {
                background: rgb(107, 114, 128);
            }
        `;
        
        document.head.appendChild(style);
    }

    dispatchThemeChange(theme) {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: theme,
                effectiveTheme: this.getCurrentEffectiveTheme(),
                colors: this.themes[this.getCurrentEffectiveTheme()].colors
            }
        });
        document.dispatchEvent(event);
    }

    // API publique
    getTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (this.themes[theme]) {
            this.applyTheme(theme);
        }
    }

    getEffectiveTheme() {
        return this.getCurrentEffectiveTheme();
    }

    isDark() {
        return this.getCurrentEffectiveTheme() === 'dark';
    }

    // Méthodes utilitaires pour les développeurs
    onThemeChange(callback) {
        document.addEventListener('themechange', callback);
    }

    offThemeChange(callback) {
        document.removeEventListener('themechange', callback);
    }
}

// Plugin pour charger le thème rapidement (éviter le flash)
(function() {
    const storedTheme = localStorage.getItem('opendev-theme') || 'auto';
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (storedTheme === 'auto' && isDarkMode)) {
        document.documentElement.classList.add('dark');
    }
})();

// Initialiser le gestionnaire de thème
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    
    // Exposer globalement pour usage facile
    window.ThemeManager = themeManager;
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}