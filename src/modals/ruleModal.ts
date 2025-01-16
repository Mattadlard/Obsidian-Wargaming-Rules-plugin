import { App, Modal } from "obsidian";

export class RuleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "Rule Categories" });

    // Sample categories (fetch from settings in a real implementation)
    const categories = {
      Combat: ["Melee", "Ranged", "Magic"],
      Units: ["Infantry", "Cavalry", "Artillery"],
    };

    Object.keys(categories).forEach((category) => {
      const categoryEl = contentEl.createDiv({ cls: "rule-category" });
      categoryEl.createEl("h3", { text: category });
      const list = categoryEl.createEl("ul");

      categories[category].forEach((sub) => {
        const item = list.createEl("li", { text: sub });
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
