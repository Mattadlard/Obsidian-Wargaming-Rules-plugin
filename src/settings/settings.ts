// Define the settings interface
export interface WargameSettings {
  categories: Record<string, string[]>; // Rule categories and subcategories
  theme: string; // Plugin theme (e.g., 'light', 'dark', etc.)
  exportFormat: "pdf" | "markdown"; // Export format
  ruleFormat: string; // Rule format preference
  enableIcons: boolean; // Whether to enable icons in the UI
}

// Default settings
export const DEFAULT_SETTINGS: WargameSettings = {
  categories: {
    Combat: [
      "Melee", 
      "Ranged", 
      "Magic", 
      "Aerial Combat", 
      "Naval Warfare", 
      "Psychological Warfare", 
      "Espionage"
    ],
    Units: [
      "Infantry", 
      "Cavalry", 
      "Artillery", 
      "Mechanised Units", 
      "Beasts & Creatures", 
      "Airborne Units", 
      "Naval Units", 
      "Engineers", 
      "Commanders", 
      "Special Forces"
    ],
    Strategies: [
      "Flanking", 
      "Ambush", 
      "Siege Tactics", 
      "Defensive Positions", 
      "Hit-and-Run", 
      "Guerrilla Warfare", 
      "Attrition Warfare"
    ],
    Terrain: [
      "Urban", 
      "Forest", 
      "Desert", 
      "Mountain", 
      "Swamp", 
      "Snow & Ice", 
      "Underwater", 
      "Space Battles"
    ],
    Resources: [
      "Gold & Currency", 
      "Supplies & Ammunition", 
      "Manpower", 
      "Fuel", 
      "Food & Water", 
      "Magical Artefacts", 
      "Strategic Locations"
    ],
    Morale: [
      "Leadership Bonuses", 
      "Unit Fatigue", 
      "Desperation Effects", 
      "Loyalty Mechanics", 
      "Propaganda & Misinformation"
    ],
  },
  theme: "light", // Default theme
  exportFormat: "pdf", // Default export format
  ruleFormat: "pdf", // Default rule format
  enableIcons: true, // Enable icons by default
};
