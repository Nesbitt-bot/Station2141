type colorScheme = 'light' | 'dark' | 'auto';

class StackColorScheme {
    private localStorageKey = 'StackColorScheme';
    private currentScheme: colorScheme;
    private systemPreferScheme: colorScheme;

    constructor(toggleEl: HTMLElement) {
        this.bindMatchMedia();
        this.currentScheme = this.getSavedScheme();
        if (window.matchMedia('(prefers-color-scheme: dark)').matches === true)
            this.systemPreferScheme = 'dark'
        else
            this.systemPreferScheme = 'light';

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);

        if (toggleEl)
            this.bindClick(toggleEl);

        this.updateToggle(toggleEl);

        if (document.body.style.transition == '')
            document.body.style.setProperty('transition', 'background-color .3s ease');
    }

    private saveScheme() {
        localStorage.setItem(this.localStorageKey, this.currentScheme);
    }

    private bindClick(toggleEl: HTMLElement) {
        toggleEl.addEventListener('click', () => {
            if (this.currentScheme == 'light') this.currentScheme = 'dark';
            else if (this.currentScheme == 'dark') this.currentScheme = 'auto';
            else this.currentScheme = 'light';

            this.setBodyClass();
            this.saveScheme();
            this.updateToggle(toggleEl);
        })

        toggleEl.addEventListener('keydown', (e) => {
            if (e.key == 'Enter' || e.key == ' ') {
                e.preventDefault();
                toggleEl.click();
            }
        });
    }

    private updateToggle(toggleEl: HTMLElement) {
        if (!toggleEl) return;
        const label = toggleEl.dataset[`${this.currentScheme}Label`] || this.currentScheme;
        const currentLabel = toggleEl.querySelector('[data-color-scheme-label]');
        if (currentLabel) currentLabel.textContent = label;
        toggleEl.dataset.mode = this.currentScheme;
        toggleEl.setAttribute('aria-label', `${toggleEl.dataset.themeLabel}: ${label}`);
    }

    private isDark() {
        return (this.currentScheme == 'dark' || this.currentScheme == 'auto' && this.systemPreferScheme == 'dark');
    }

    private dispatchEvent(colorScheme: colorScheme) {
        const event = new CustomEvent('onColorSchemeChange', {
            detail: colorScheme
        });
        window.dispatchEvent(event);
    }

    private setBodyClass() {
        if (this.isDark()) {
            document.documentElement.dataset.scheme = 'dark';
        }
        else {
            document.documentElement.dataset.scheme = 'light';
        }

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);
    }

    private getSavedScheme(): colorScheme {
        const savedScheme = localStorage.getItem(this.localStorageKey);

        if (savedScheme == 'light' || savedScheme == 'dark' || savedScheme == 'auto') return savedScheme;
        else return 'auto';
    }

    private bindMatchMedia() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                this.systemPreferScheme = 'dark';
            }
            else {
                this.systemPreferScheme = 'light';
            }
            this.setBodyClass();
        });
    }
}

export default StackColorScheme;
