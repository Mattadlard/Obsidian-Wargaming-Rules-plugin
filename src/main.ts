import { getFontAwesomeIcon } from './icons/fontAwesome';
import { loadIcons } from './features/loadIcons';
import { insertRule } from './features/insertRule';
import { exportRules } from './features/exportRules';

export default class WargameRulesPlugin extends Plugin {
    // List of icon keys; add more as new features or actions are introduced
    iconList: string[] = [
        'attack', // Sword icon, represents offensive actions
        'defense', // Shield icon, represents defensive actions
        'move', // Walking icon, for movement-related mechanics
        'range', // Bullseye icon, for ranged attack mechanics
        // Add more icons here as the plugin evolves
    ];

    async onload() {
        console.log('WargameRulesPlugin loaded'); // Always nice to see this pop up when debugging

        // Add the custom ribbon icons to the UI
        this.addRibbonIcons();

        // Command to insert combat rules into the current note
        this.addCommand({
            id: 'insert-rule',
            name: 'Insert Combat Rule',
            callback: () => insertRule(), 
            // Note: This could be expanded later to let users select specific rule types.
        });

        // Command to export all defined rules to a PDF
        this.addCommand({
            id: 'export-rules',
            name: 'Export Rules to PDF',
            callback: () => exportRules(),
            // Future idea: Add more export formats, like Markdown or Word documents
        });
    }

    // Handles the creation and addition of custom ribbon icons
    addRibbonIcons() {
        const ribbonContainer = document.createElement('div');
        ribbonContainer.classList.add('ribbon-container'); 
        // Styling centralised in ribbon.css; keep it clean and easy to maintain

        this.iconList.forEach((iconType) => {
            const iconClass = getFontAwesomeIcon(iconType); // Gets the CSS class for the icon
            const iconElement = document.createElement('i');
            iconElement.className = iconClass;
            iconElement.title = this.getIconDescription(iconClass); 
            // Tooltip text for user clarity - a small touch, but it helps usability!

            // Future idea: Make icons clickable for specific actions (e.g., inserting related rules)
            ribbonContainer.appendChild(iconElement);
        });

        document.body.appendChild(ribbonContainer); 
        // Note to self: Maybe move this into a specific container in the DOM later.
    }

    // Returns a tooltip description for each icon; fallback is a generic description
    getIconDescription(iconClass: string): string {
        const descriptions: Record<string, string> = {
            'fa-solid fa-sword': 'A mighty sword for combat.',
            'fa-solid fa-shield': 'A shield for protection.',
            'fa-solid fa-dice': 'Dice for strategy or luck.',
            'fa-solid fa-helmet': 'A helmet for warriors.',
            // Add more as new icons are added
        };
        return descriptions[iconClass] || 'An icon for a feature.';
        // Fallback ensures no ugly tooltips like "undefined" appear for missing descriptions
    }

    onunload() {
        // Clean up: Remove the ribbon container from the DOM to prevent clutter
        const ribbonContainer = document.querySelector('.ribbon-container');
        if (ribbonContainer) ribbonContainer.remove();

        console.log('WargameRulesPlugin unloaded'); 
        // A good reminder when disabling or debugging the plugin
    }
}

/*
 * Notes while programming:
 * - The ribbon is a simple and effective way to visually enhance the UI, but consider allowing customisation (e.g., letting users pick which icons appear).
 * - Adding interactivity to the icons (like click actions) would be a fun enhancement.
 * - Export functionality could be improved by supporting more formats or adding user-defined export templates.
 * - Remember: Hugo, my chaos kitten, would probably sit on the keyboard and add a feature no one asked for, like a "random meow" button. To Hugo, whom I love dearly, even if a Chaos Kitten at times.
 */
