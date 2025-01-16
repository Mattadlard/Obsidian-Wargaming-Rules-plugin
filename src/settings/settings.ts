export interface WargameSettings {
    ruleFormat: string;
    enableIcons: boolean;
    theme: string;
}

export const DEFAULT_SETTINGS: WargameSettings = {
    ruleFormat: 'PDF',
    enableIcons: true,
    theme: 'light',
};

export class WargameSettingsManager {
    settings: WargameSettings;

    constructor() {
        this.settings = DEFAULT_SETTINGS;
    }

    loadSettings() {
        // Load settings from storage (Example, could be enhanced for actual storage logic)
        console.log('Settings loaded:', this.settings);
    }

    saveSettings() {
        // Save settings to storage (Example, could be enhanced for actual storage logic)
        console.log('Settings saved:', this.settings);
    }
}
