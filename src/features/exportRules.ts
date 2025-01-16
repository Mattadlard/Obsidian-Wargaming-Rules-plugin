import { WargameSettings } from '../settings/settings';

export function exportRules(settings: WargameSettings) {
    console.log(`Exporting rules in ${settings.ruleFormat} format`);

    if (settings.ruleFormat === 'PDF') {
        // Implement PDF export logic here
        console.log('Exporting to PDF...');
    } else if (settings.ruleFormat === 'Text') {
        // Implement Text export logic here
        console.log('Exporting to Text...');
    }
}
