import { DEFAULT_SETTINGS, WargameSettings } from "./settings";

export class WargameSettingsManager {
  settings: WargameSettings;

  constructor() {
    this.settings = DEFAULT_SETTINGS;
  }

  loadSettings(): void {
    // Example: Load settings from local storage or a file
    console.log("Settings loaded:", this.settings);
    // Add logic to fetch settings from a persistent source if needed
  }

  saveSettings(): void {
    // Example: Save settings to local storage or a file
    console.log("Settings saved:", this.settings);
    // Add logic to save settings to a persistent source if needed
  }

  updateSetting(key: keyof WargameSettings, value: any): void {
    this.settings[key] = value;
    this.saveSettings();
    console.log(`Setting "${key}" updated to:`, value);
  }

  resetToDefaults(): void {
    this.settings = DEFAULT_SETTINGS;
    this.saveSettings();
    console.log("Settings reset to defaults.");
  }
}
