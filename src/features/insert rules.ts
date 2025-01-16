import { getFontAwesomeIcon } from '../icons/fontAwesome';

export function insertRule() {
    const iconClass = getFontAwesomeIcon('attack'); // Example: Getting the icon for "attack"
    const ruleText = `Use this icon for attack: <i class="${iconClass}"></i>`;
    console.log('Inserted Rule:', ruleText);
}
