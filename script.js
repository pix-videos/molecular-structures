/**
 * Molecular Structures Viewer
 * Interactive 3D Chemistry Visualization
 */

// Molecule data
const moleculeData = {
    dna: {
        name: 'DNA Helix',
        formula: 'Deoxyribonucleic Acid',
        model: './models/dna.glb', // Place your DNA GLB model in the models/ folder
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
        model: './models/hemoglobin.glb', // Place your hemoglobin GLB model in the models/ folder
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
        model: './models/glucose.glb', // Place your glucose GLB model in the models/ folder
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
        model: './models/caffeine.glb', // Place your caffeine GLB model in the models/ folder
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
let syncEnabled = false;
let lastFilledSlot = 0; // Track which slot was filled last (for alternating when both are full)
let syncListeners = { viewer1: null, viewer2: null }; // Store sync event listeners

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
                // Find first empty slot, or alternate if both are full
                let targetSlot = 1;
                if (!slot1Molecule) {
                    targetSlot = 1;
                } else if (!slot2Molecule) {
                    targetSlot = 2;
                } else {
                    // Both slots are full - alternate between them
                    targetSlot = lastFilledSlot === 1 ? 2 : 1;
                }
                // Load into the target slot
                loadIntoSlot(moleculeId, targetSlot);
                lastFilledSlot = targetSlot;
            } else {
                loadSingleView(moleculeId);
            }
            
            // Update slot highlights
            updateSlotHighlights();
        });
        
        // Add hover effect to show which slot will be filled
        card.addEventListener('mouseenter', () => {
            if (currentView === 'compare') {
                highlightNextSlot();
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (currentView === 'compare') {
                clearSlotHighlights();
            }
        });
    });
}

// Highlight which slot will be filled next
function highlightNextSlot() {
    clearSlotHighlights();
    let targetSlot = 1;
    if (!slot1Molecule) {
        targetSlot = 1;
    } else if (!slot2Molecule) {
        targetSlot = 2;
    } else {
        // Both slots are full - show which one will be replaced next
        targetSlot = lastFilledSlot === 1 ? 2 : 1;
    }
    const slotEl = document.getElementById(`slot${targetSlot}`);
    if (slotEl) {
        slotEl.classList.add('slot-highlight');
    }
}

// Clear slot highlights
function clearSlotHighlights() {
    document.querySelectorAll('.compare-slot').forEach(slot => {
        slot.classList.remove('slot-highlight');
    });
}

// Update slot highlights based on current state
function updateSlotHighlights() {
    clearSlotHighlights();
}

// Load molecule into comparison slot
function loadIntoSlot(moleculeId, slot) {
    const data = moleculeData[moleculeId];
    if (!data) return;
    
    const viewer = slot === 1 ? viewer1 : viewer2;
    const infoEl = document.getElementById(`info${slot}`);
    const slotEl = document.getElementById(`slot${slot}`);
    
    // Update slot state
    if (slot === 1) {
        slot1Molecule = moleculeId;
    } else {
        slot2Molecule = moleculeId;
    }
    
    // Mark slot as filled first (CSS will hide empty-slot)
    slotEl.classList.add('slot-filled');
    
    // Load model
    viewer.src = data.model;
    console.log(`Loading model into slot ${slot}:`, data.model);
    
    // Force model-viewer to be visible with inline styles
    viewer.style.opacity = '1';
    viewer.style.pointerEvents = 'auto';
    viewer.style.zIndex = '10';
    
    // Wait for model to load and ensure visibility
    viewer.addEventListener('load', () => {
        viewer.style.opacity = '1';
        viewer.style.pointerEvents = 'auto';
        viewer.style.zIndex = '10';
        console.log(`Model loaded in slot ${slot}`);
    });
    
    viewer.addEventListener('error', (e) => {
        console.error(`Error loading model in slot ${slot}:`, e);
    });
    
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
        } else {
            removeSyncRotation();
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
    // Remove existing listeners if any
    removeSyncRotation();
    
    // Create sync functions
    const syncViewer1ToViewer2 = () => {
        if (syncEnabled && slot1Molecule && slot2Molecule) {
            viewer2.cameraOrbit = viewer1.cameraOrbit;
            viewer2.fieldOfView = viewer1.fieldOfView;
        }
    };
    
    const syncViewer2ToViewer1 = () => {
        if (syncEnabled && slot1Molecule && slot2Molecule) {
            viewer1.cameraOrbit = viewer2.cameraOrbit;
            viewer1.fieldOfView = viewer2.fieldOfView;
        }
    };
    
    // Add event listeners and store references
    viewer1.addEventListener('camera-change', syncViewer1ToViewer2);
    viewer2.addEventListener('camera-change', syncViewer2ToViewer1);
    
    syncListeners.viewer1 = syncViewer1ToViewer2;
    syncListeners.viewer2 = syncViewer2ToViewer1;
}

// Remove sync rotation listeners
function removeSyncRotation() {
    if (syncListeners.viewer1) {
        viewer1.removeEventListener('camera-change', syncListeners.viewer1);
        syncListeners.viewer1 = null;
    }
    if (syncListeners.viewer2) {
        viewer2.removeEventListener('camera-change', syncListeners.viewer2);
        syncListeners.viewer2 = null;
    }
}

// Setup slot clear buttons and clickable slots
function setupSlotClear() {
    document.querySelectorAll('.slot-clear').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent slot click
            const slot = index + 1;
            clearSlot(slot);
        });
    });
    
    // Make slots clickable to add molecules
    document.querySelectorAll('.compare-slot').forEach((slotEl, index) => {
        slotEl.addEventListener('click', (e) => {
            // Don't trigger if clicking on clear button or header
            if (e.target.closest('.slot-clear') || e.target.closest('.slot-header')) return;
            
            const slot = index + 1;
            const hasMolecule = (slot === 1 && slot1Molecule) || (slot === 2 && slot2Molecule);
            
            // If slot is empty and a molecule is selected, add it
            if (!hasMolecule && selectedMolecule) {
                loadIntoSlot(selectedMolecule, slot);
            }
            // If slot has a molecule, clicking selects it (for replacement)
            else if (hasMolecule && selectedMolecule) {
                loadIntoSlot(selectedMolecule, slot);
            }
        });
    });
}

// Clear a slot
function clearSlot(slot) {
    const viewer = slot === 1 ? viewer1 : viewer2;
    const infoEl = document.getElementById(`info${slot}`);
    const slotEl = document.getElementById(`slot${slot}`);
    
    // Clear the slot
    viewer.src = '';
    
    // Mark slot as empty (CSS will show empty-slot)
    slotEl.classList.remove('slot-filled');
    
    if (slot === 1) {
        slot1Molecule = null;
    } else {
        slot2Molecule = null;
    }
    
    // Reset last filled slot if we cleared it
    if (lastFilledSlot === slot) {
        lastFilledSlot = slot === 1 ? 2 : 1;
    }
    
    const slotLabel = slot === 1 ? 'Molecule A' : 'Molecule B';
    infoEl.innerHTML = `
        <h4>${slotLabel}</h4>
        <p></p>
    `;
    
    updateComparisonTable();
    updateSlotHighlights();
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

