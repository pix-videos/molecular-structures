/**
 * Molecular Structures Viewer
 * Interactive 3D Chemistry Visualization
 */

// Molecule data
const moleculeData = {
    dna: {
        name: 'DNA Helix',
        formula: 'Deoxyribonucleic Acid',
        model: 'https://static.poly.pizza/3bd92894-a0a4-4cc5-ad02-29d29341944f.glb', // DNA model by Zoe XR
        description: 'DNA (deoxyribonucleic acid) is the molecule that carries the genetic instructions for life. Its iconic double helix structure, discovered by Watson and Crick in 1953, consists of two strands wound around each other, connected by base pairs.',
        properties: {
            weight: '~2 trillion Da (human genome)',
            type: 'Nucleic Acid',
            function: 'Genetic Information Storage',
            location: 'Cell Nucleus'
        },
        facts: [
            'If unwound, human DNA would stretch about 6 feet long',
            'Contains approximately 3 billion base pairs',
            '99.9% identical between all humans',
            'Takes about 8 hours to replicate fully'
        ]
    },
    hemoglobin: {
        name: 'Hemoglobin',
        formula: 'C₂₉₅₂H₄₆₆₄O₈₃₂S₈Fe₄',
        model: 'https://static.poly.pizza/d85e26a9-cc20-4b41-a69e-6ce0d4e4c481.glb', // White blood cell model by Poly by Google
        description: 'Hemoglobin is the iron-containing protein in red blood cells that carries oxygen from the lungs to the rest of the body. Each hemoglobin molecule contains four iron atoms, each capable of binding one oxygen molecule.',
        properties: {
            weight: '64,458 Da',
            type: 'Metalloprotein',
            function: 'Oxygen Transport',
            location: 'Red Blood Cells'
        },
        facts: [
            'Contains 4 iron atoms per molecule',
            'Each red blood cell contains ~270 million hemoglobin molecules',
            'Changes color when bound to oxygen (bright red vs dark red)',
            'Makes up about 96% of red blood cell dry content'
        ]
    },
    glucose: {
        name: 'Glucose',
        formula: 'C₆H₁₂O₆',
        model: 'https://static.poly.pizza/6f0cca6d-bb5d-460c-998a-a72b98e899c0.glb', // Crystal model by iPoly3D
        description: 'Glucose is a simple sugar and the primary source of energy for cells. It\'s the most important carbohydrate in biology, serving as both a fuel and a building block for more complex molecules.',
        properties: {
            weight: '180.16 Da',
            type: 'Monosaccharide',
            function: 'Cellular Energy Source',
            location: 'Blood, Cells'
        },
        facts: [
            'Blood glucose levels are tightly regulated around 70-100 mg/dL',
            'The brain uses about 120 grams of glucose per day',
            'Can exist in two forms: alpha and beta glucose',
            'Plants produce it through photosynthesis'
        ]
    },
    caffeine: {
        name: 'Caffeine',
        formula: 'C₈H₁₀N₄O₂',
        model: 'https://static.poly.pizza/dd31a811-8a01-4277-9ead-889cb9019631.glb', // Coffee bean model by Poly by Google
        description: 'Caffeine is the world\'s most widely consumed psychoactive substance. It works by blocking adenosine receptors in the brain, preventing the onset of drowsiness and promoting alertness.',
        properties: {
            weight: '194.19 Da',
            type: 'Alkaloid',
            function: 'Stimulant',
            location: 'Coffee, Tea, Cacao'
        },
        facts: [
            'Discovered in 1819 by German chemist Friedlieb Runge',
            'Half-life in the body is about 5-6 hours',
            'Lethal dose is about 10 grams (150+ cups of coffee)',
            'Found in over 60 plant species worldwide'
        ]
    }
};

// State
let currentView = 'compare';
let selectedMolecule = 'dna';
let slot1Molecule = null;
let slot2Molecule = null;
let nextSlot = 1;
let syncEnabled = false;

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const moleculeCards = document.querySelectorAll('.molecule-card');
const compareView = document.getElementById('compareView');
const singleView = document.getElementById('singleView');
const viewer1 = document.getElementById('viewer1');
const viewer2 = document.getElementById('viewer2');
const singleViewer = document.getElementById('singleViewer');
const syncBtn = document.getElementById('syncRotation');
const resetBtn = document.getElementById('resetBoth');
const comparisonTable = document.getElementById('comparisonTable');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupMoleculeSelection();
    setupControls();
    setupSlotClear();
});

// Setup view navigation
function setupNavigation() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (view === 'compare') {
                compareView.classList.remove('hidden');
                singleView.classList.add('hidden');
                comparisonTable.classList.remove('hidden');
                currentView = 'compare';
            } else {
                compareView.classList.add('hidden');
                singleView.classList.remove('hidden');
                comparisonTable.classList.add('hidden');
                currentView = 'single';
                
                // Load currently selected molecule in single view
                loadSingleView(selectedMolecule);
            }
        });
    });
}

// Setup molecule card selection
function setupMoleculeSelection() {
    moleculeCards.forEach(card => {
        card.addEventListener('click', () => {
            const moleculeId = card.dataset.molecule;
            selectedMolecule = moleculeId;
            
            // Update active state
            moleculeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            if (currentView === 'compare') {
                // Load into next available slot
                loadIntoSlot(moleculeId, nextSlot);
                nextSlot = nextSlot === 1 ? 2 : 1;
            } else {
                loadSingleView(moleculeId);
            }
        });
    });
}

// Load molecule into comparison slot
function loadIntoSlot(moleculeId, slot) {
    const data = moleculeData[moleculeId];
    if (!data) return;
    
    const viewer = slot === 1 ? viewer1 : viewer2;
    const infoEl = document.getElementById(`info${slot}`);
    
    // Update slot state
    if (slot === 1) {
        slot1Molecule = moleculeId;
    } else {
        slot2Molecule = moleculeId;
    }
    
    // Load model
    viewer.src = data.model;
    
    // Update slot info
    infoEl.innerHTML = `
        <h4>${data.name}</h4>
        <p>${data.formula}</p>
    `;
    
    // Update comparison table
    updateComparisonTable();
}

// Update comparison table
function updateComparisonTable() {
    const data1 = slot1Molecule ? moleculeData[slot1Molecule] : null;
    const data2 = slot2Molecule ? moleculeData[slot2Molecule] : null;
    
    document.getElementById('tableHeader1').textContent = data1 ? data1.name : 'Molecule A';
    document.getElementById('tableHeader2').textContent = data2 ? data2.name : 'Molecule B';
    
    document.getElementById('weight1').textContent = data1 ? data1.properties.weight : '—';
    document.getElementById('weight2').textContent = data2 ? data2.properties.weight : '—';
    
    document.getElementById('type1').textContent = data1 ? data1.properties.type : '—';
    document.getElementById('type2').textContent = data2 ? data2.properties.type : '—';
    
    document.getElementById('function1').textContent = data1 ? data1.properties.function : '—';
    document.getElementById('function2').textContent = data2 ? data2.properties.function : '—';
    
    document.getElementById('location1').textContent = data1 ? data1.properties.location : '—';
    document.getElementById('location2').textContent = data2 ? data2.properties.location : '—';
}

// Load single view
function loadSingleView(moleculeId) {
    const data = moleculeData[moleculeId];
    if (!data) return;
    
    singleViewer.src = data.model;
    
    document.getElementById('singleTitle').textContent = data.name;
    document.getElementById('singleFormula').textContent = data.formula;
    document.getElementById('singleDescription').textContent = data.description;
    
    // Properties
    const propsEl = document.getElementById('singleProperties');
    propsEl.innerHTML = Object.entries(data.properties).map(([key, value]) => `
        <div class="property-item">
            <span class="property-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <span class="property-value">${value}</span>
        </div>
    `).join('');
    
    // Facts
    const factsEl = document.getElementById('singleFacts');
    factsEl.innerHTML = data.facts.map(fact => `
        <li>${fact}</li>
    `).join('');
}

// Setup control buttons
function setupControls() {
    // Sync rotation
    syncBtn.addEventListener('click', () => {
        syncEnabled = !syncEnabled;
        syncBtn.classList.toggle('active', syncEnabled);
        
        if (syncEnabled) {
            setupSyncRotation();
        }
    });
    
    // Reset views
    resetBtn.addEventListener('click', () => {
        viewer1.cameraOrbit = 'auto auto auto';
        viewer1.cameraTarget = 'auto auto auto';
        viewer1.fieldOfView = 'auto';
        
        viewer2.cameraOrbit = 'auto auto auto';
        viewer2.cameraTarget = 'auto auto auto';
        viewer2.fieldOfView = 'auto';
    });
}

// Sync rotation between viewers
function setupSyncRotation() {
    viewer1.addEventListener('camera-change', () => {
        if (syncEnabled) {
            viewer2.cameraOrbit = viewer1.cameraOrbit;
            viewer2.fieldOfView = viewer1.fieldOfView;
        }
    });
    
    viewer2.addEventListener('camera-change', () => {
        if (syncEnabled) {
            viewer1.cameraOrbit = viewer2.cameraOrbit;
            viewer1.fieldOfView = viewer2.fieldOfView;
        }
    });
}

// Setup slot clear buttons
function setupSlotClear() {
    document.querySelectorAll('.slot-clear').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const slot = index + 1;
            const viewer = slot === 1 ? viewer1 : viewer2;
            const infoEl = document.getElementById(`info${slot}`);
            
            // Clear the slot
            viewer.src = '';
            
            if (slot === 1) {
                slot1Molecule = null;
            } else {
                slot2Molecule = null;
            }
            
            infoEl.innerHTML = `
                <h4>Select a molecule</h4>
                <p>Click on a molecule card above to load it here</p>
            `;
            
            updateComparisonTable();
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const molecules = ['dna', 'hemoglobin', 'glucose', 'caffeine'];
    const keys = ['1', '2', '3', '4'];
    
    const index = keys.indexOf(e.key);
    if (index !== -1) {
        moleculeCards[index].click();
    }
    
    // Toggle view with Tab
    if (e.key === 'Tab' && e.target === document.body) {
        e.preventDefault();
        const nextView = currentView === 'compare' ? 'single' : 'compare';
        document.querySelector(`[data-view="${nextView}"]`).click();
    }
});

