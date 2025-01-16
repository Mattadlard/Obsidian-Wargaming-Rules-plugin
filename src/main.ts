import { Plugin, Setting, Modal, App, PluginSettingTab, Notice } from 'obsidian';
import { getFontAwesomeIcon } from './icons/fontAwesome';
import { insertRule } from './features/insertRule';
import { exportRules } from './features/exportRules';

// Rule categories with subcategories (initial categories)
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
    Terrain: [
        "Weather Effects",
        "Day/Night Cycles",
        "Hazardous Terrain",
        "Fortifications",
        "Dynamic Terrain Changes",
    ],
    Armies: [
        "Unit Stats",
        "Unit Classes",
        "Leadership Effects",
        "Unit Morale",
        "Unit Abilities",
    ],
    Campaigns: [
        "Mission Objectives",
        "Scenario Types",
        "Victory Conditions",
        "Persistent Stats",
        "Resource Management",
    ],
    "Customised Genre-Specific Rules": [
        "Sci-Fi",
        "Fantasy",
        "Modern Warfare",
        "Post-Apocalyptic",
        "Historical",
    ],
};

export default class WargameRulesPlugin extends Plugin {
    categories: Record<string, string[]> = defaultCategories;

    async onload() {
        console.log('WargameRulesPlugin loaded');

        this.addRibbonIcon('dice', 'Open Rule Categories', () => this.showRuleCategories());
        
        this.addCommand({
            id: 'insert-rule',
            name: 'Insert Combat Rule',
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
     * Show a modal with rule categories and subcategories
     */
    showRuleCategories() {
        const categories = Object.keys(this.categories);
        new RuleCategoriesModal(this.app, categories, this.categories).open();
    }

    /**
     * Insert rule header into the active note
     */
    insertRuleHeader(category: string, subcategory: string) {
        const editor = this.app.workspace.activeLeaf?.view?.sourceMode ? this.app.workspace.activeLeaf.view.sourceMode.cmEditor : null;
        if (editor) {
            const header = `### ${category}: ${subcategory}`;
            editor.replaceSelection(header);
        }
    }

    /**
     * Add custom category and subcategories to the plugin
     */
    addCustomCategory(categoryName: string, subcategories: string[]) {
        if (this.categories[categoryName]) {
            new Notice(`Category "${categoryName}" already exists!`);
        } else {
            this.categories[categoryName] = subcategories;
            this.saveCategories();
            new Notice(`Custom Category "${categoryName}" added!`);
        }
    }

    /**
     * Save categories to settings
     */
    saveCategories() {
        this.saveData({ categories: this.categories });
    }

    /**
     * Load categories from settings
     */
    loadCategories() {
        const savedCategories = this.loadData();
        if (savedCategories) {
            this.categories = savedCategories.categories || defaultCategories;
        }
    }

    onunload() {
        console.log('WargameRulesPlugin unloaded');
    }
}

// Modal to display rule categories and subcategories with a search box
class RuleCategoriesModal extends Modal {
    categories: string[];
    ruleCategories: Record<string, string[]>;
    searchInput: HTMLInputElement;

    constructor(app: App, categories: string[], ruleCategories: Record<string, string[]>) {
        super(app);
        this.categories = categories;
        this.ruleCategories = ruleCategories;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        // Add search box
        this.searchInput = contentEl.createEl('input', { type: 'text', placeholder: 'Search categories...' });
        this.searchInput.addEventListener('input', () => this.filterCategories());

        const listContainer = contentEl.createEl('div');
        listContainer.addClass('rule-categories-list');

        // Display categories
        this.categories.forEach((category) => {
            const categoryEl = contentEl.createEl('div');
            categoryEl.addClass('rule-category');
            categoryEl.createEl('h3', { text: category });
            const subcategoryList = contentEl.createEl('ul');

            this.ruleCategories[category].forEach((subcategory) => {
                const subcategoryEl = contentEl.createEl('li', { text: subcategory });
                subcategoryEl.addEventListener('click', () => {
                    this.insertHeader(category, subcategory);
                    this.close();
                });
                subcategoryList.appendChild(subcategoryEl);
            });

            categoryEl.appendChild(subcategoryList);
            listContainer.appendChild(categoryEl);
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    filterCategories() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredCategories = this.categories.filter(category =>
            category.toLowerCase().includes(searchTerm)
        );
        const listContainer = this.contentEl.querySelector('.rule-categories-list');
        if (listContainer) {
            listContainer.empty();
            filteredCategories.forEach((category) => {
                const categoryEl = this.contentEl.createEl('div');
                categoryEl.addClass('rule-category');
                categoryEl.createEl('h3', { text: category });
                const subcategoryList = this.contentEl.createEl('ul');

                this.ruleCategories[category].forEach((subcategory) => {
                    const subcategoryEl = this.contentEl.createEl('li', { text: subcategory });
                    subcategoryEl.addEventListener('click', () => {
                        this.insertHeader(category, subcategory);
                        this.close();
                    });
                    subcategoryList.appendChild(subcategoryEl);
                });

                categoryEl.appendChild(subcategoryList);
                listContainer.appendChild(categoryEl);
            });
        }
    }

    insertHeader(category: string, subcategory: string) {
        const plugin = (this.app.plugins.getPlugin('wargame-rules-plugin') as WargameRulesPlugin);
        plugin.insertRuleHeader(category, subcategory);
    }
}

// Setting tab for customising categories
class WargameRulesSettingTab extends PluginSettingTab {
    plugin: WargameRulesPlugin;

    constructor(app: App, plugin: WargameRulesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Wargame Rules Plugin Settings' });

        new Setting(containerEl)
            .setName('Customize Categories')
            .setDesc('Modify or add new rule categories and subcategories.')
            .addButton((btn) => btn.setButtonText('Add Category').onClick(() => {
                new AddCustomCategoryModal(this.plugin).open();
            }));
    }
}

// Modal for adding a custom category and subcategories
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
        this.subcategoriesInput = contentEl.createEl('textarea', { placeholder: 'Enter subcategories, one per line' });

        new Setting(contentEl)
            .setName('Subcategories')
            .addTextArea((text) => {
                text.setPlaceholder('Subcategory 1\nSubcategory 2\n
