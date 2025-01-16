import { WargameSettingsManager } from './settings';
import { Setting } from 'obsidian';

export class SettingsTab {
    settingsManager: WargameSettingsManager;

    constructor(settingsManager: WargameSettingsManager) {
        this.settingsManager = settingsManager;
    }

    renderTab(container: HTMLElement) {
        container.createEl('h2', { text: 'Wargame Rules Plugin Settings' });

        new Setting(container)
            .setName('Enable Icons')
            .setDesc('Enable custom icons in ribbon.')
            .addToggle(toggle => toggle.setValue(this.settingsManager.settings.enableIcons).onChange(value => {
                this.settingsManager.settings.enableIcons = value;
                this.settingsManager.saveSettings();
            }));

        new Setting(container)
            .setName('Rule Format')
            .setDesc('Choose the format for exported rules.')
            .addText(text => text.setValue(this.settingsManager.settings.ruleFormat).onChange(value => {
                this.settingsManager.settings.ruleFormat = value;
                this.settingsManager.saveSettings();
            }));

        new Setting(container)
            .setName('Theme')
            .setDesc('Choose the theme for the plugin.')
            .addDropdown(dropdown => dropdown.addOption('light', 'Light').addOption('dark', 'Dark').setValue(this.settingsManager.settings.theme).onChange(value => {
                this.settingsManager.settings.theme = value;
                this.settingsManager.saveSettings();
            }));
    }
}
