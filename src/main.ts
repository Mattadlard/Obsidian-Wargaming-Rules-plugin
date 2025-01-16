import { App, Plugin, Notice, PluginSettingTab, Setting } from 'obsidian';
import { RuleModal } from './components/RuleModal';
import { WargameSettings, DEFAULT_SETTINGS } from './settings';
import { exportRules } from './utils/exportRules';
import { insertRule } from './utils/insertRule';

export default class WargameRulesPlugin extends Plugin {
  settings: WargameSettings;

  async onload() {
    await this.loadSettings();

    // Command to insert a new rule
    this.addCommand({
      id: 'insert-rule',
      name: 'Insert New Rule',
      callback: () => insertRule(),
    });

    // Command to export rules to PDF
    this.addCommand({
      id: 'export-rules-pdf',
      name: 'Export Rules to PDF',
      callback: () => exportRules(this.settings.categories),
    });

    // Command to manage categories
    this.addCommand({
      id: 'manage-rule-categories',
      name: 'Manage Rule Categories',
      callback: () => this.openCategoryManager(),
    });

    // Add settings tab
    this.addSettingTab(new WargameSettingsTab(this.app, this));
  }

  openCategoryManager() {
    new RuleModal(this.app, this.settings.categories).open();
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...data };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class WargameSettingsTab extends PluginSettingTab {
  plugin: WargameRulesPlugin;

  constructor(app: App, plugin: WargameRulesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

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
  }
}
