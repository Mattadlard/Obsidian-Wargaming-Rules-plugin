import { Plugin, Menu, MarkdownView, Notice, Setting, App } from 'obsidian';

export default class EnhancedWargameRulesPlugin extends Plugin {
    iconList: string[] = [
        'fa-solid fa-sword',
        'fa-solid fa-shield',
        'fa-solid fa-dice',
        'fa-solid fa-helmet',
    ];
    customIconFolder: string = ''; // Store the user's custom folder path for icons

    async onload() {
        console.log('Enhanced Wargame Rules Plugin loaded');

        // Add a command to insert a combat rule template with an icon
        this.addCommand({
            id: 'insert-combat-rule-with-icon',
            name: 'Insert Combat Rule with Icon',
            callback: () => this.insertCombatRuleWithIcon(),
        });

        // Add a command to manage icons
        this.addCommand({
            id: 'choose-icon-for-rule',
            name: 'Choose Icon for Rule',
            callback: () => this.chooseIconForRule(),
        });
        
        // Add settings tab for plugin options
        this.addSettingTab(new WargameRulesSettingTab(this.app, this));
    }

    // Function to insert a combat rule template with selected icon
    async insertCombatRuleWithIcon() {
        const icon = await this.chooseIconForRule(); // Let user choose an icon
        if (!icon) {
            new Notice("No icon selected!");
            return;
        }

        const editor = this.app.workspace.getActiveViewOfType(MarkdownView).editor;
        editor.replaceSelection(`
## Combat Resolution
**Icon:** ![Icon](${icon})

**Action Type:** [Action Type]  
**Required Dice Roll:** [Dice Type]  
**Modifiers:** [List of Modifiers]  
**Success Criteria:** [Success Threshold]  
**Special Abilities:** [List of Special Abilities or Notes]
        `);
    }

    // Function to let user choose an icon from the list or custom folder
    async chooseIconForRule(): Promise<string | null> {
        return new Promise((resolve) => {
            const menu = new Menu(this.app);
            this.iconList.forEach((iconName) => {
                menu.addItem(iconName, () => {
                    resolve(iconName);  // Resolve the promise with selected icon name
                });
            });

            // Include custom icons
            if (this.customIconFolder) {
                this.getCustomIconsFromFolder(this.customIconFolder).then((customIcons) => {
                    customIcons.forEach((iconPath) => {
                        menu.addItem(`Custom Icon: ${iconPath}`, () => {
                            resolve(iconPath);  // Resolve with the path of the custom icon
                        });
                    });
                    menu.open();
                });
            } else {
                menu.open();
            }
        });
    }

    // Function to fetch custom icons from user-defined folder
    async getCustomIconsFromFolder(folderPath: string): Promise<string[]> {
        const files = this.app.vault.getFiles().filter(file => file.path.startsWith(folderPath) && (file.path.endsWith('.svg') || file.path.endsWith('.png')));
        return files.map(file => file.path);  // Return an array of custom icon file paths
    }

    // Function to insert a PNG image link into the rule
    insertImageForRule() {
        const editor = this.app.workspace.getActiveViewOfType(MarkdownView).editor;
        const imagePath = this.chooseImageFromFolder(); // Let user pick an image
        if (imagePath) {
            editor.replaceSelection(`
## Special Rule Example

**Image:** ![Rule Image](${imagePath})

Description of rule goes here...
            `);
        } else {
            new Notice('No image selected!');
        }
    }

    // Function to let the user choose an image from assets/images folder
    chooseImageFromFolder(): string | null {
        const imageFolderPath = 'assets/images/';
        const files = this.app.vault.getFiles().filter(file => file.path.startsWith(imageFolderPath));
        
        if (files.length === 0) {
            new Notice('No images found in assets/images folder!');
            return null;
        }

        const imageChoices = files.map(file => file.path);
        const selectedImage = this.selectImage(imageChoices);

        return selectedImage ? selectedImage : null;
    }

    // Helper function to simulate image selection
    selectImage(files: string[]): string | null {
        // Simulate a selection (you may replace this with an actual UI for better experience)
        if (files.length > 0) {
            return files[0]; // Pick the first image as default for simplicity
        }
        return null;
    }
}

// Define the settings tab
class WargameRulesSettingTab extends PluginSettingTab {
    plugin: EnhancedWargameRulesPlugin;

    constructor(app: App, plugin: EnhancedWargameRulesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Wargame Rules Plugin Settings' });

        new Setting(containerEl)
            .setName('Rules Folder')
            .setDesc('Folder path where your rules are stored.')
            .addText(text => text
                .setPlaceholder('rules')
                .setValue(this.plugin.settings.rulesFolder)
                .onChange(async (value) => {
                    this.plugin.settings.rulesFolder = value.trim();
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Custom Icon Folder')
            .setDesc('Specify a folder path for your custom icons.')
            .addText(text => text
                .setPlaceholder('assets/icons')
                .setValue(this.plugin.customIconFolder)
                .onChange(async (value) => {
                    this.plugin.customIconFolder = value.trim();
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Include Table of Contents')
            .setDesc('Include a Table of Contents in the PDF.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeTOC)
                .onChange(async (value) => {
                    this.plugin.settings.includeTOC = value;
                    await this.plugin.saveSettings();
                }));
    }
}
