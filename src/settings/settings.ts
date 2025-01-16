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
    // e.g., Fetch from localStorage, file, or database
  }

  saveSettings(): void {
    // Example: Save settings to local storage or a file
    console.log("Settings saved:", this.settings);
    // Add logic to save settings to a persistent source if needed
    // e.g., Save to localStorage, file, or database
  }

  updateSetting(key: keyof WargameSettings, value: any): void {
    // Update the setting with the new value and save
    if (key in this.settings) {
      this.settings[key] = value;
      this.saveSettings();
      console.log(`Setting "${key}" updated to:`, value);
    } else {
      console.log(`Error: Setting "${key}" does not exist.`);
    }
  }

  resetToDefaults(): void {
    // Reset settings to the default configuration
    this.settings = DEFAULT_SETTINGS;
    this.saveSettings();
    console.log("Settings reset to defaults.");
  }

  // New Method to Update Categories
  updateCategories(newCategories: Record<string, string[]>): void {
    this.settings.categories = newCategories;
    this.saveSettings();
    console.log("Categories updated:", newCategories);
  }

  // New Method to Toggle Icons
  toggleIcons(): void {
    this.settings.enableIcons = !this.settings.enableIcons;
    this.saveSettings();
    console.log(`Icons enabled: ${this.settings.enableIcons}`);
  }

  // New Method to Change Theme
  changeTheme(newTheme: string): void {
    this.settings.theme = newTheme;
    this.saveSettings();
    console.log(`Theme changed to: ${newTheme}`);
  }

  // New Method to Set Export Format
  setExportFormat(newFormat: "pdf" | "markdown"): void {
    this.settings.exportFormat = newFormat;
    this.saveSettings();
    console.log(`Export format set to: ${newFormat}`);
  }

  // New Method to Update Rule Format
  setRuleFormat(newFormat: string): void {
    this.settings.ruleFormat = newFormat;
    this.saveSettings();
    console.log(`Rule format set to: ${newFormat}`);
  }
}
