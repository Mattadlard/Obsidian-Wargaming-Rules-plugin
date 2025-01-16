import { Plugin, MarkdownView, TFile, Notice } from 'obsidian';
import { jsPDF } from "jspdf";
import * as marked from 'marked';

const MESSAGES = {
    NO_ACTIVE_FILE: 'No active file to track version for!',
    NO_MARKDOWN_VIEW: 'No active markdown view found!',
    VERSION_SAVED: 'Version saved successfully!',
    NO_VERSION_HISTORY: 'No version history found!',
    NO_BACKLINKS: 'No backlinks found!',
    SAVING_VERSION: 'Saving version...',
    EXPORTING_PDF: 'Exporting PDF...',
    VERSION_SAVE_FAILED: 'Failed to save version. Please try again.',
    EXPORT_FAILED: 'Export failed. Please try again.'
};

const formatMap: Record<string, (text: string) => string> = {
    bold: (text: string) => `**${text}**`,
    italic: (text: string) => `*${text}*`,
    underline: (text: string) => `<u>${text}</u>`
};

export default class AdvancedWargameRulesPlugin extends Plugin {
    settings: PluginSettings;

    async onload() {
        console.log('Advanced Wargame Rules Plugin loaded');

        // Load settings or set defaults
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

        // Add toolbar
        this.addToolbar();

        // Commands
        this.addCommand({
            id: 'export-to-pdf',
            name: 'Export Rules to PDF',
            callback: () => this.exportToPDF('pdf'),
        });

        this.addCommand({
            id: 'export-to-markdown',
            name: 'Export Rules to Markdown',
            callback: () => this.exportToFile('md'),
        });

        this.addCommand({
            id: 'export-to-text',
            name: 'Export Rules to Text',
            callback: () => this.exportToFile('txt'),
        });

        this.addCommand({
            id: 'track-version',
            name: 'Save Current Version',
            callback: () => this.saveVersion(),
        });

        this.addCommand({
            id: 'view-versions',
            name: 'View Version History',
            callback: () => this.viewVersionHistory(),
        });

        this.addCommand({
            id: 'view-backlinks',
            name: 'View Backlinks',
            callback: () => this.viewBacklinks(),
        });

        this.addSettingTab(new AdvancedWargameRulesSettingsTab(this.app, this));
    }

    // Add a toolbar
    addToolbar() {
        const toolbar = this.app.workspace.createLeaf().containerEl.createDiv('rules-toolbar');
        toolbar.addClass('rules-toolbar');

        ['bold', 'italic', 'underline', 'version', 'backlinks'].forEach(action => {
            const button = toolbar.createEl('button', { text: action.toUpperCase() });
            button.onclick = () => this.handleToolbarAction(action);
        });
    }

    // Handle toolbar actions
    handleToolbarAction(action: string) {
        switch (action) {
            case 'bold':
                this.applyFormatting('bold');
                break;
            case 'italic':
                this.applyFormatting('italic');
                break;
            case 'underline':
                this.applyFormatting('underline');
                break;
            case 'version':
                this.saveVersion();
                break;
            case 'backlinks':
                this.viewBacklinks();
                break;
        }
    }

    // Save the current version of the file
    async saveVersion() {
        try {
            new Notice(MESSAGES.SAVING_VERSION);

            const activeFile = this.app.workspace.getActiveFile();
            if (!activeFile) {
                new Notice(MESSAGES.NO_ACTIVE_FILE);
                return;
            }

            const content = await this.app.vault.read(activeFile);
            const versionedFileName = `${activeFile.basename}_v${Date.now()}.md`;
            const versionFolder = this.settings.versionFolder;

            await this.ensureFolderExists(versionFolder);
            await this.app.vault.create(`${versionFolder}/${versionedFileName}`, content);

            new Notice(MESSAGES.VERSION_SAVED);
        } catch (error) {
            console.error('Error saving version:', error);
            new Notice(MESSAGES.VERSION_SAVE_FAILED);
        }
    }

    // View version history
    async viewVersionHistory() {
        const versionFolder = this.settings.versionFolder;
        const files = await this.app.vault.adapter.list(versionFolder);

        if (!files || files.files.length === 0) {
            new Notice(MESSAGES.NO_VERSION_HISTORY);
            return;
        }

        new Notice(`Version files:\n${files.files.join('\n')}`);
    }

    // View backlinks
    async viewBacklinks() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            new Notice(MESSAGES.NO_ACTIVE_FILE);
            return;
        }

        const backlinks = this.app.metadataCache.resolvedLinks;
        const currentFileLinks = backlinks[activeFile.path];

        if (!currentFileLinks) {
            new Notice(MESSAGES.NO_BACKLINKS);
            return;
        }

        const backlinksList = Object.keys(currentFileLinks)
            .map(linkPath => {
                const linkedFile = this.app.vault.getAbstractFileByPath(linkPath);
                const linkTitle = linkedFile instanceof TFile ? linkedFile.basename : 'Unknown File';
                return `- [${linkTitle}](${linkPath})`;
            })
            .join('\n');

        new Notice(`Backlinks:\n${backlinksList}`);
    }

    // Export to PDF
    async exportToPDF(format: 'pdf') {
        try {
            new Notice(MESSAGES.EXPORTING_PDF);

            const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
            if (!editor) {
                new Notice(MESSAGES.NO_MARKDOWN_VIEW);
                return;
            }

            const content = editor.getValue();
            const title = this.getNoteTitle();
            const pdf = new jsPDF();

            const styledContent = `
            <style>
                body { font-family: Helvetica, Arial, sans-serif; }
                h1, h2, h3 { font-weight: bold; color: #333; }
                p { line-height: 1.6; margin: 0.5em 0; }
                .code { font-family: 'Courier New', Courier, monospace; }
            </style>
            ${marked(content)}
            `;

            pdf.html(styledContent, {
                x: 10,
                y: 10,
                callback: (doc) => {
                    doc.save(`${title}.pdf`);
                }
            });
        } catch (error) {
            console.error('Error exporting PDF:', error);
            new Notice(MESSAGES.EXPORT_FAILED);
        }
    }

    // Export to selected file format (Markdown or Text)
    async exportToFile(format: 'md' | 'txt') {
        try {
            const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
            if (!editor) {
                new Notice(MESSAGES.NO_MARKDOWN_VIEW);
                return;
            }

            const content = editor.getValue();
            const title = this.getNoteTitle();

            const fileContent = format === 'md' ? content : content.replace(/```[\s\S]*?```/g, ''); // Remove code blocks for plain text
            const fileExtension = format === 'md' ? '.md' : '.txt';

            await this.app.vault.create(`${title}${fileExtension}`, fileContent);
            new Notice(`Exported as ${format.toUpperCase()} successfully!`);
        } catch (error) {
            console.error('Error exporting file:', error);
            new Notice(MESSAGES.EXPORT_FAILED);
        }
    }

    // Apply formatting to selected text
    applyFormatting(action: string) {
        const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
        if (!editor) return;

        const selection = editor.getSelection();
        const formatFunction = formatMap[action];

        if (formatFunction) {
            editor.replaceSelection(formatFunction(selection));
        }
    }

    // Get note title
    getNoteTitle(): string {
        const file = this.app.workspace.getActiveFile();
        return file ? file.basename : 'Untitled';
    }

    // Ensure folder exists
    async ensureFolderExists(folderPath: string) {
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        if (!folder || folder instanceof TFile) {
            await this.app.vault.createFolder(folderPath);
        }
    }
}

// Plugin settings interface
interface PluginSettings {
    versionFolder: string;
}

// Default settings
const DEFAULT_SETTINGS: PluginSettings = {
    versionFolder: 'Wargame Rules Versions'
};

// Settings tab
class AdvancedWargameRulesSettingsTab extends PluginSettingTab {
    plugin: AdvancedWargameRulesPlugin;

    constructor(app: App, plugin: AdvancedWargameRulesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Advanced Wargame Rules Settings' });

        new Setting(containerEl)
            .setName('Version Folder')
            .setDesc('Folder to store version history.')
            .addText(text => text
                .setPlaceholder('Enter folder name')
                .setValue(this.plugin.settings.versionFolder)
                .onChange(async (value) => {
                    this.plugin.settings.versionFolder = value;
                    await this.plugin.saveSettings();
                }));
    }
}
