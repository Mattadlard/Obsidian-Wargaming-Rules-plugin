import { Modal, App, Notice } from 'obsidian';

export class RuleModal extends Modal {
  categories: Record<string, string[]>;

  constructor(app: App, categories: Record<string, string[]>) {
    super(app);
    this.categories = categories;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Manage Rule Categories' });

    Object.keys(this.categories).forEach((category) => {
      const categoryEl = contentEl.createDiv({ cls: 'rule-category' });
      categoryEl.createEl('h3', { text: category });
      const list = categoryEl.createEl('ul');

      this.categories[category].forEach((sub) => {
        const item = list.createEl('li', { text: sub });
        item.onclick = () => {
          new Notice(`Selected: ${sub}`);
        };
      });
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
