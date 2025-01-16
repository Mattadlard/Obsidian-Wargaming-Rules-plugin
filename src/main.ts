import { Plugin, Modal, App, PluginSettingTab, Setting, Notice } from 'obsidian';
import { getFontAwesomeIcon } from './icons/fontAwesome';
import { insertRule } from './features/insertRule';
import { exportRules } from './features/exportRules';

// Default rule categories
const defaultCategories = {
    Movement: [
        "Ground Movement",
        "Aerial Movement",
        "Naval Movement",
        "Terrain Effects",
        "Speed Modifiers",
        "Formation Movement",
        "Retreat & Fallback",
    ],
    Combat: [
        "Ranged Combat",
        "Close-Combat",
        "Special Attacks",
        "Defence Mechanisms",
    ],
    Morale: [
        "Panic",
        "Rally",
        "Fear",
        "Custom Morale Rules",
    ],
    "Psyonics/Magic": [
        "Spellcasting",
        "Powers",
        "Magic Items",
        "Psyonic Testing",
        "Energy Resources",
        "Summoning Entities",
        "Dispelling & Counterspells",
    ],
    Tests: [
        "Attribute Tests",
        "Morale Checks",
        "Reaction Rolls",
        "Custom Tests",
        "Opposed Rolls",
    ],
    Vehicles: [
        "Land Vehicles",
        "Air Vehicles",
        "Naval Vehicles",
        "Maintenance & Repairs",
        "Boarding Mechanics",
        "Vehicle Damage Tables",
        "Fuel & Resource Management",
    ],
    Animals: [
        "Mounts",
        "Beasts of War",
        "Creature Control",
        "Creature Stats & Abilities",
        "Feeding & Rest",
    ],
};

export default class WargameRulesPlugin extends Plugin {
    categories: Record<string, string[]> = defaultCategories;

    async onload() {
        console.log('WargameRulesPlugin loaded');
        this.categories = await this.loadData() || defaultCategories;

        this.addRibbonIcon('dice', 'Open Rule Categories', () => this.showRuleCategories());
        this.addCommand({
            id: 'insert-rule',
            name: 'Insert Rule',
            callback: () => insertRule(),
        });
        this.addCommand({
            id: 'export-rules',
            name: 'Export Rules to PDF',
            callback: () => exportRules(),
        });

        this.addSettingTab(new WargameRulesSettingTab(this.app, this));
    }

    /**
     * Display a modal with rule categories and subcategories.
     */
    showRuleCategories() {
        new RuleCategoriesModal(this.app, Object.keys(this.categories), this.categories).open();
    }

    /**
     * Insert a rule header into the active note.
     */
    insertRuleHeader(category: string, subcategory: string) {
        const editor = this.app.workspace.activeEditor?.editor;
        if (editor) {
            editor.replaceSelection(`### ${category}: ${subcategory}\n`);
        }
    }

    /**
     * Add a custom category with subcategories.
     */
    addCustomCategory(categoryName: string, subcategories: string[]) {
        if (this.categories[categoryName]) {
            new Notice(`Category "${categoryName}" already exists!`);
        } else {
            this.categories[categoryName] = subcategories;
            this.saveCategories();
            new Notice(`Category "${categoryName}" added.`);
        }
    }

    /**
     * Save categories to plugin data.
     */
    async saveCategories() {
        await this.saveData(this.categories);
    }

    onunload() {
        console.log('WargameRulesPlugin unloaded');
    }
}

class RuleCategoriesModal extends Modal {
    categories: string[];
    ruleCategories: Record<string, string[]>;

    constructor(app: App, categories: string[], ruleCategories: Record<string, string[]>) {
        super(app);
        this.categories = categories;
        this.ruleCategories = ruleCategories;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Rule Categories' });

        this.categories.forEach(category => {
            const categoryEl = contentEl.createEl('div', { cls: 'category' });
            categoryEl.createEl('h3', { text: category });

            const subcategoryList = categoryEl.createEl('ul');
            this.ruleCategories[category].forEach(subcategory => {
                const subcategoryEl = subcategoryList.createEl('li', { text: subcategory });
                subcategoryEl.addEventListener('click', () => {
                    const plugin = this.app.plugins.getPlugin('wargame-rules-plugin') as WargameRulesPlugin;
                    plugin.insertRuleHeader(category, subcategory);
                    this.close();
                });
            });
        });
    }

    onClose() {
        this.contentEl.empty();
    }
}

class WargameRulesSettingTab extends PluginSettingTab {
    plugin: WargameRulesPlugin;

    constructor(app: App, plugin: WargameRulesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Wargame Rules Plugin Settings' });

        new Setting(containerEl)
            .setName('Custom Categories')
            .setDesc('Add or modify rule categories and subcategories.')
            .addButton(btn =>
                btn.setButtonText('Add Category').onClick(() => new AddCustomCategoryModal(this.plugin).open())
            );
    }
}

class AddCustomCategoryModal extends Modal {
    plugin: WargameRulesPlugin;
    categoryInput: HTMLInputElement;
    subcategoriesInput: HTMLTextAreaElement;

    constructor(plugin: WargameRulesPlugin) {
        super(plugin.app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.empty();
        contentEl.createEl('h2', { text: 'Add Custom Category' });

        this.categoryInput = contentEl.createEl('input', { type: 'text', placeholder: 'Category Name' });
        this.subcategoriesInput = contentEl.createEl('textarea', { placeholder: 'Subcategories (one per line)' });

        new Setting(contentEl)
            .setName('Add')
            .addButton(btn =>
                btn.setButtonText('Save').onClick(() => {
                    const categoryName = this.categoryInput.value.trim();
                    const subcategories = this.subcategoriesInput.value.split('\n').map(s => s.trim()).filter(Boolean);
                    if (categoryName && subcategories.length) {
                        this.plugin.addCustomCategory(categoryName, subcategories);
                        this.close();
                    } else {
                        new Notice('Please provide a category name and at least one subcategory.');
                    }
                })
            );
    }

    onClose() {
        this.contentEl.empty();
    }
}
