# Molecular Structures Viewer

An interactive 3D chemistry visualization tool for comparing molecular structures.

![Molecular Viewer](https://img.shields.io/badge/Model--Viewer-3.3.0-6366f1)
![License](https://img.shields.io/badge/License-MIT-green)

## 🧬 Overview

This web application allows users to explore and compare molecular structures through interactive 3D visualization. Features both a comparison view for side-by-side analysis and a single-focus mode for detailed examination.

## ✨ Features

- **Compare View**: Examine two molecules side-by-side
- **Single Focus Mode**: Detailed view of individual molecules
- **Synchronized Rotation**: Link camera controls between viewers
- **Property Comparison Table**: Quick reference for molecular properties
- **Responsive Design**: Works on all device sizes
- **Keyboard Navigation**: Quick access with number keys

## 🔬 Molecules Included

1. **DNA Helix** - The blueprint of life
   - Double helix structure
   - Genetic information storage

2. **Hemoglobin** - Oxygen transporter
   - Complex metalloprotein
   - Contains iron atoms

3. **Glucose** - Cellular fuel
   - Simple sugar structure
   - Energy metabolism

4. **Caffeine** - Molecular stimulant
   - Alkaloid compound
   - Adenosine blocker

## 🛠️ Technologies Used

- [Google Model-Viewer](https://modelviewer.dev/) - 3D model rendering
- HTML5, CSS3, JavaScript (Vanilla)
- Google Fonts (Syne, JetBrains Mono)
- CSS Grid & Flexbox

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/molecular-structures.git
   ```

2. Open `index.html` in a modern web browser

3. Click on molecule cards to load them into comparison slots

## 📁 Project Structure

```
molecular-structures/
├── index.html      # Main HTML file
├── styles.css      # Laboratory-themed styles
├── script.js       # Interactive functionality
└── README.md       # This file
```

## 🎨 Design

The interface features a modern laboratory aesthetic with:
- Deep blue and teal color scheme
- Hexagonal grid background pattern
- Glowing accents and smooth animations
- Syne for headlines (geometric, bold)
- JetBrains Mono for data (technical, readable)

## 📝 Customization

### Adding New Molecules

Add new molecule data in `script.js`:

```javascript
const moleculeData = {
    water: {
        name: 'Water',
        formula: 'H₂O',
        model: 'path/to/water-model.glb',
        description: 'The universal solvent...',
        properties: {
            weight: '18.015 Da',
            type: 'Inorganic Compound',
            function: 'Solvent, Medium',
            location: 'Everywhere'
        },
        facts: [
            'Covers 71% of Earth\'s surface',
            // ...
        ]
    }
};
```

### Free 3D Molecular Model Sources

- [Protein Data Bank (PDB)](https://www.rcsb.org/) - Protein structures
- [PubChem 3D](https://pubchem.ncbi.nlm.nih.gov/) - Small molecules
- [ChemSpider](https://www.chemspider.com/) - Chemical structures
- [Sketchfab](https://sketchfab.com/tags/molecule) - 3D molecule models

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1 | Select DNA |
| 2 | Select Hemoglobin |
| 3 | Select Glucose |
| 4 | Select Caffeine |
| Tab | Toggle Compare/Single view |

## 🧪 View Modes

### Compare View
- Load two molecules for side-by-side comparison
- Sync rotation between viewers
- Comparison table shows key differences

### Single Focus View
- Larger model view
- Detailed properties panel
- Extended facts section

## 📄 License

MIT License - feel free to use this for educational purposes.

## 🙏 Credits

- 3D Models: Placeholder models from [Model-Viewer Examples](https://modelviewer.dev/)
- Fonts: [Google Fonts](https://fonts.google.com/)
- Molecular data: Compiled from public scientific sources

