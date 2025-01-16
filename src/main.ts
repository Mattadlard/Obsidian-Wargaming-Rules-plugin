import { getFontAwesomeIcon } from './icons/fontAwesome';
import { loadIcons } from './features/loadIcons';
import { insertRule } from './features/insertRule';
import { exportRules } from './features/exportRules';

export default class WargameRulesPlugin extends Plugin {
    iconList: string[] = [
        'attack', // Sword
        'defense', // Shield
        'move', // Walking
        'range', // Bullseye
        // More icons can be added here
    ];

    async onload() {
        console.log('WargameRulesPlugin loaded');
        this.addRibbonIcons();
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
    }

    addRibbonIcons() {
        const ribbonContainer = document.createElement('div');
        ribbonContainer.classList.add('ribbon-container');

        this.iconList.forEach((iconType) => {
            const iconClass = getFontAwesomeIcon(iconType);
            const iconElement = document.createElement('i');
            iconElement.className = iconClass;
            iconElement.title = this.getIconDescription(iconClass);
            ribbonContainer.appendChild(iconElement);
        });

        document.body.appendChild(ribbonContainer);
    }

    getIconDescription(iconClass: string): string {
        const descriptions: Record<string, string> = {
            'fa-solid fa-sword': 'A mighty sword for combat and glory.',
            'fa-solid fa-shield': 'A shield for protection and defence.',
            'fa-solid fa-dice': 'Dice representing chance or strategy.',
            'fa-solid fa-helmet': 'A sturdy helmet for your warriors.',
        };
        return descriptions[iconClass] || 'An icon representing a feature.';
    }

    onunload() {
        const ribbonContainer = document.querySelector('.ribbon-container');
        if (ribbonContainer) {
            ribbonContainer.remove();
        }
        console.log('WargameRulesPlugin unloaded');
    }
}
