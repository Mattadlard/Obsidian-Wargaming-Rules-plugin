

# Obsidian Wargaming Rules Plugin

## Overview
The **Obsidian Wargaming Rules Plugin** is a powerful tool for wargame developers, hobbyists, and enthusiasts to manage, organise, and share tabletop wargaming rules directly from their Obsidian workspace. With built-in support for markdown formatting, custom icons, and export options, the plugin bridges the gap between creative design and functional documentation.

Designed with flexibility and usability in mind, this plugin enhances the workflow for creating and distributing high-quality rulesets for wargaming systems.

---

## Features

### Core Features
- **Insert Rules with Custom Icons**  
  Quickly insert formatted rules with relevant icons, such as attack, defence, movement, or special abilities, using commands or hotkeys.

- **Export Rules to PDF/Text**  
  Effortlessly convert markdown-based rules into professionally styled PDFs or plain text files for distribution.

- **Custom Icon Integration**  
  Utilise an extensive library of Font Awesome icons to enrich your rule documents, making them visually appealing and easy to understand.

- **Dynamic Icon Loading**  
  Load additional custom icons from a user-defined folder, providing unlimited personalisation options.

- **Ribbon Integration**  
  Access key plugin commands from a convenient ribbon interface, designed for ease of use and seamless navigation.

- **Plugin Settings Panel**  
  Customise plugin behaviour, icon sets, and export preferences through an intuitive settings tab.

---

## Installation

### Manual Installation
1. Clone the repository or download it as a ZIP file.
2. Extract the contents to your local machine.
3. Copy the `dist/` folder to your Obsidian vault’s `.obsidian/plugins/obsidian-wargaming-rules-plugin/` directory.
4. Enable the plugin via **Settings > Community Plugins** in Obsidian.

### Community Plugin Browser (Coming Soon)
Once available in the Obsidian plugin repository:
1. Open **Settings > Community Plugins** in Obsidian.
2. Search for "Wargaming Rules Plugin".
3. Click **Install** and then enable the plugin.

---

## Usage

### 1. Inserting Rules with Icons
- Open the command palette (**Ctrl+P** or **Cmd+P**) and search for **Insert Wargaming Rule**.
- Select the type of rule to insert (e.g., Attack, Defence, Movement).
- The rule, along with its associated icon, will be added to your document.

### 2. Exporting Rules
- Open the command palette and search for **Export Rules**.
- Choose between **Export as PDF** or **Export as Text**.
- Specify a file name and export path (if required). The plugin will generate a file with proper formatting and icons.

### 3. Customising Icons
- Navigate to **Settings > Wargaming Rules Plugin**.
- Add, edit, or remove icons using the customisation interface.
- Changes are immediately reflected across all plugin functionalities.

---

## Example Markdown Output

Here’s a sample of how a rulebook might appear when using this plugin:

```markdown
# Wargame Rulebook

## Combat Rules
- **Attack** ![fa-sword](https://fontawesome.com/icons/sword)
  Roll a D20 to determine your attack success.
  
- **Defence** ![fa-shield-alt](https://fontawesome.com/icons/shield-alt)
  Add your armour value to reduce incoming damage.

## Movement Rules
- **Walking** ![fa-walking](https://fontawesome.com/icons/walking)
  Units can move up to 6 tiles per turn, except when encumbered.

## Special Abilities
- **Critical Strike** ![fa-crosshairs](https://fontawesome.com/icons/crosshairs)
  Rolls of 18-20 deal double damage.


----------

File Structure

Here’s the directory structure for the plugin:

obsidian-wargaming-rules-plugin/
│
├── src/
│   ├── main.ts               # Main plugin logic
│   ├── settings/
│   │   ├── settings.ts       # Settings definition and handling
│   │   ├── settingsTab.ts    # Plugin settings tab UI
│   ├── features/
│   │   ├── exportRules.ts    # Handles exporting rules to PDF/Text
│   │   ├── insertRule.ts     # Inserts combat rules with icons
│   │   ├── loadIcons.ts      # Loads custom icons from folder
│   ├── utils/
│   │   ├── pdfUtils.ts       # Utility functions for PDF generation
│   │   ├── markdownUtils.ts  # Markdown formatting helpers
│   │   ├── domUtils.ts       # DOM-related utilities
│   └── icons/
│       ├── fontAwesome.ts    # Font Awesome icons list and handling
│       ├── ribbonIcons.ts    # Ribbon icons UI logic
│
├── styles/
│   ├── ribbon.css            # Ribbon styling for custom icons
│   ├── settings.css          # Plugin settings UI styling
│
├── dist/                     # Compiled output (after build)
├── .obsidian/                # Obsidian-specific files for testing
├── .gitignore                # Ignored files and folders
├── manifest.json             # Obsidian plugin manifest
├── package.json              # Plugin dependencies and metadata
└── README.md                 # Plugin documentation


---

/

Dependencies

The plugin leverages the following libraries and frameworks:

Font Awesome: Provides an extensive collection of icons for visual enhancement.

PDFKit: Enables PDF generation for rule exports.

Obsidian Plugin API: Integrates seamlessly with Obsidian’s ecosystem.



---

Roadmap

Planned future updates:

1. Advanced Styling: Introduce colour schemes, custom fonts, and table formatting for exports.


2. Icon Search Tool: Add a real-time search bar in the settings tab to browse available icons.


3. Multilingual Support: Enable localisation for broader accessibility.


4. Collaborative Features: Support shared rule editing across multiple users.




---

Contributing

Contributions are welcome! To contribute:

1. Fork this repository.


2. Create a feature branch (git checkout -b feature-name).


3. Commit your changes (git commit -m 'Add feature-name').


4. Push to the branch (git push origin feature-name).


5. Open a pull request.




---

License

This project is licensed under the MIT License. See the LICENSE file for full details.


---

Acknowledgements

Font Awesome: For their exceptional icon library.

Obsidian Community: For their feedback and support.

Tabletop Wargaming Community: For inspiring the creation of this plugin.



---

Support

If you encounter any issues or have feature requests, please open a ticket in the Issues section of this repository.


---

Enjoy creating and sharing your wargaming rules with the Obsidian Wargaming Rules Plugin!

