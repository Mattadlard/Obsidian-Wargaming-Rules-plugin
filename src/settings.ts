import { WargameSettings } from './wargameSettings';

export const DEFAULT_SETTINGS: WargameSettings = {
  categories: {
    Combat: ['Melee', 'Ranged', 'Magic'],
    Units: ['Infantry', 'Cavalry', 'Artillery'],
  },
  theme: 'default',
  exportFormat: 'pdf',
};
