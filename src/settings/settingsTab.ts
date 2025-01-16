import { App, PluginSettingTab, Setting } from "obsidian";
import WargameRulesPlugin from "../main";

export class SettingsTab extends PluginSettingTab {
  plugin: WargameRulesPlugin;

  constructor(app: App, plugin: WargameRulesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Wargame Rules Plugin Settings" });

    // Add custom category
    new Setting(containerEl)
      .setName("Add Custom Category")
      .setDesc("Create a new rule category with subcategories.")
      .addText((text) => {
        text.setPlaceholder("Category Name").onChange((value) => {
          if (!value) return;
          this.plugin.settings.categories[value] = [];
          this.plugin.saveSettings();
          new Notice(`Added category: ${value}`);
        });
      });

    // Export format
    new Setting(containerEl)
      .setName("Export Format")
      .setDesc("Choose how to export rules (PDF or Markdown).")
      .addDropdown((dropdown) => {
        dropdown.addOption("pdf", "PDF").addOption("markdown", "Markdown");
        dropdown.setValue(this.plugin.settings.exportFormat);
        dropdown.onChange(async (value) => {
          this.plugin.settings.exportFormat = value as "pdf" | "markdown";
          await this.plugin.saveSettings();
          new Notice(`Export format set to ${value}`);
        });
      });
  }
}
