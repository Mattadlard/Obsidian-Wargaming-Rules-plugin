export interface WargameSettings {
  categories: Record<string, string[]>;  // categories and subcategories
  theme: string;
  exportFormat: 'pdf' | 'markdown';
}

export const DEFAULT_SETTINGS: WargameSettings = {
  categories: {
    Combat: ['Melee', 'Ranged', 'Magic'],
    Units: ['Infantry', 'Cavalry', 'Artillery'],
    Custom: [],
  },
  theme: 'default',
  exportFormat: 'pdf',
};
