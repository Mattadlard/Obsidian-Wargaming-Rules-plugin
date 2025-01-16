import { Modal, App, Notice } from 'obsidian';
import { WargameSettings } from '../wargameSettings';

export class RuleCategoryManager extends Modal {
  settings: WargameSettings;

  constructor(app: App, settings: WargameSettings) {
    super(app);
    this.settings = settings;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'Manage Categories and Units' });

    // Display existing categories
    Object.keys(this.settings.categories).forEach((category) => {
      const categoryEl = contentEl.createDiv({ cls: 'rule-category' });
      categoryEl.createEl('h3', { text: category });
      const list = categoryEl.createEl('ul');

      this.settings.categories[category].forEach((sub) => {
        const item = list.createEl('li', { text: sub });
        item.onclick = () => {
          new Notice(`Selected: ${sub}`);
        };
      });

      if (category !== 'Custom') {
        // Button to add a new unit/category
        const addButton = categoryEl.createEl('button', { text: 'Add New Subcategory' });
        addButton.onclick = () => {
          const newSubcategory = prompt(`Add new subcategory to ${category}:`);
          if (newSubcategory) {
            this.settings.categories[category].push(newSubcategory);
            this.settings.categories[category].sort();
            this.renderCategories();
          }
        };
      }
    });

    // Option to add a completely new category
    const addCategoryButton = contentEl.createEl('button', { text: 'Add New Category' });
    addCategoryButton.onclick = () => {
      const newCategory = prompt('Enter new category name:');
      if (newCategory) {
        this.settings.categories[newCategory] = [];
        this.renderCategories();
      }
    };
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  renderCategories() {
    // Redraw the modal to reflect the latest categories
    this.onOpen();
  }
}
