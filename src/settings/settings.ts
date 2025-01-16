import { WargameSettings } from './wargameSettings';
import { RuleCategoryManager } from './components/RuleCategoryManager';

export class WargameSettingsTab extends PluginSettingTab {
  plugin: WargameRulesPlugin;

  constructor(app: App, plugin: WargameRulesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    // Display current export format setting
    new Setting(containerEl)
      .setName('Export Format')
      .setDesc('Choose the format for exporting rules.')
      .addDropdown((dropdown) => {
        dropdown.addOption('pdf', 'PDF');
        dropdown.addOption('markdown', 'Markdown');
        dropdown.setValue(this.plugin.settings.exportFormat);
        dropdown.onChange(async (value) => {
          this.plugin.settings.exportFormat = value;
          await this.plugin.saveSettings();
        });
      });

    // Button to manage categories
    new Setting(containerEl)
      .setName('Manage Categories')
      .setDesc('Add, remove, and manage rule categories and subcategories.')
      .addButton((button) => {
        button.setButtonText('Open Category Manager').onClick(() => {
          new RuleCategoryManager(this.app, this.plugin.settings).open();
        });
      });
  }
}
