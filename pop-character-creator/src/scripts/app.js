const characterClasses = [];
const attributes = {};
let selectedClass = '';
let characterAttributes = null;

// Load and manage character creation data
let characterData = null;

// Load the character creation data
async function loadCharacterData() {
    try {
        const response = await fetch('/assets/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        characterData = await response.json();
        console.log('Character data loaded:', characterData); // Debug log
        
        if (characterData && characterData.base_stats) {
            console.log('Base stats found:', characterData.base_stats); // Debug log
            displayBaseStats();
            initializeForm();
        }
    } catch (error) {
        console.error('Error loading character data:', error);
    }
}

// Helper function to get choice title from ID
function getChoiceTitleById(id) {
    if (!characterData || !id) return 'unknown choice';
    
    try {
        let choice = null;
        if (id.startsWith('1')) {
            choice = characterData.stage_1_options.find(option => option.id === id);
        } else if (id.startsWith('2')) {
            choice = characterData.stage_2_options.find(option => option.id === id);
        } else if (id.startsWith('3')) {
            choice = characterData.stage_3_options.find(option => option.id === id);
        } else if (id.startsWith('4')) {
            choice = characterData.stage_4_options.find(option => option.id === id);
        }
        return choice ? choice.title : `unknown choice (${id})`;
    } catch (error) {
        console.error('Error getting choice title:', error);
        return `unknown choice (${id})`;
    }
}

// Display initial base stats
function displayBaseStats() {
    if (!characterData || !characterData.base_stats) {
        console.error('No character data or base stats available');
        return;
    }
    
    const baseStats = characterData.base_stats;
    console.log('Displaying base stats:', baseStats); // Debug log

    // Set initial attributes
    const strength = document.getElementById('strength');
    const agility = document.getElementById('agility');
    const intelligence = document.getElementById('intelligence');
    const charisma = document.getElementById('charisma');

    if (strength) strength.textContent = baseStats.attributes.Strength;
    if (agility) agility.textContent = baseStats.attributes.Agility;
    if (intelligence) intelligence.textContent = baseStats.attributes.Intelligence;
    if (charisma) charisma.textContent = baseStats.attributes.Charisma;

    // Set initial skills
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        skillsList.innerHTML = '';
        Object.entries(baseStats.skills).forEach(([skill, value]) => {
            const li = document.createElement('li');
            li.textContent = `${skill}: ${value}`;
            skillsList.appendChild(li);
        });
    }

    // Set initial weapon proficiencies
    const proficienciesList = document.getElementById('proficiencies-list');
    if (proficienciesList) {
        proficienciesList.innerHTML = '';
        Object.entries(baseStats.weapon_proficiencies).forEach(([prof, value]) => {
            const li = document.createElement('li');
            li.textContent = `${prof}: ${value}`;
            proficienciesList.appendChild(li);
        });
    }

    // Set initial resources
    const resourcesList = document.getElementById('resources-list');
    if (resourcesList) {
        resourcesList.innerHTML = '';
        Object.entries(baseStats.resources).forEach(([resource, value]) => {
            const li = document.createElement('li');
            li.textContent = `${resource}: ${value}`;
            resourcesList.appendChild(li);
        });
    }

    // Set initial faction relations
    const relationsList = document.getElementById('relations-list');
    if (relationsList) {
        relationsList.innerHTML = '';
        Object.entries(baseStats.faction_relations).forEach(([faction, value]) => {
            if (value !== 0) {
                const li = document.createElement('li');
                li.textContent = `${faction}: ${value}`;
                relationsList.appendChild(li);
            }
        });
    }
}

// Display details for a stage's selected choice
function displayChoiceDetails(choiceId, stageElement) {
    if (!characterData || !stageElement) return;
    
    const contentDiv = stageElement.querySelector('.choice-content');
    if (!contentDiv) return;
    
    let selectedChoice = null;

    // Find the selected choice in the appropriate stage
    if (choiceId.startsWith('1')) {
        selectedChoice = characterData.stage_1_options.find(option => option.id === choiceId);
        stage = 'Background';
    } else if (choiceId.startsWith('2')) {
        selectedChoice = characterData.stage_2_options.find(option => option.id === choiceId);
        stage = 'Early Life';
    } else if (choiceId.startsWith('3')) {
        selectedChoice = characterData.stage_3_options.find(option => option.id === choiceId);
        stage = 'Adulthood';
    } else if (choiceId.startsWith('4')) {
        selectedChoice = characterData.stage_4_options.find(option => option.id === choiceId);
        stage = 'Reason for Adventure';
    }

    if (!selectedChoice) {
        detailsPanel.innerHTML = '<p class="no-selection">Select an option to see its details</p>';
        return;
    }

    // Create the details content
    const content = document.createElement('div');
    content.className = 'choice-details';

    // Add title and stage
    content.innerHTML = `
        <h4>${selectedChoice.title}</h4>
        <p><strong>Stage:</strong> ${stage}</p>
    `;

    // Add attributes if any
    if (selectedChoice.attributes || (selectedChoice.base && selectedChoice.base.attributes)) {
        const attrs = selectedChoice.attributes || selectedChoice.base.attributes;
        const attrDiv = document.createElement('div');
        attrDiv.className = 'detail-group';
        attrDiv.innerHTML = '<h5>Attributes</h5><ul>';
        Object.entries(attrs).forEach(([attr, value]) => {
            attrDiv.innerHTML += `<li>${attr}: +${value}</li>`;
        });
        attrDiv.innerHTML += '</ul>';
        content.appendChild(attrDiv);
    }

    // Add skills if any
    if (selectedChoice.skills || (selectedChoice.base && selectedChoice.base.skills)) {
        const skills = selectedChoice.skills || selectedChoice.base.skills;
        const skillsDiv = document.createElement('div');
        skillsDiv.className = 'detail-group';
        skillsDiv.innerHTML = '<h5>Skills</h5><ul>';
        Object.entries(skills).forEach(([skill, value]) => {
            skillsDiv.innerHTML += `<li>${skill}: +${value}</li>`;
        });
        skillsDiv.innerHTML += '</ul>';
        content.appendChild(skillsDiv);
    }

    // Add weapon proficiencies if any
    if (selectedChoice.weapon_proficiencies) {
        const profDiv = document.createElement('div');
        profDiv.className = 'detail-group';
        profDiv.innerHTML = '<h5>Weapon Proficiencies</h5><ul>';
        Object.entries(selectedChoice.weapon_proficiencies).forEach(([prof, value]) => {
            profDiv.innerHTML += `<li>${prof}: +${value}</li>`;
        });
        profDiv.innerHTML += '</ul>';
        content.appendChild(profDiv);
    }

    // Add resources if any
    if (selectedChoice.resources) {
        const resourcesDiv = document.createElement('div');
        resourcesDiv.className = 'detail-group';
        resourcesDiv.innerHTML = '<h5>Resources</h5><ul>';
        Object.entries(selectedChoice.resources).forEach(([resource, value]) => {
            resourcesDiv.innerHTML += `<li>${resource}: ${value >= 0 ? '+' : ''}${value}</li>`;
        });
        resourcesDiv.innerHTML += '</ul>';
        content.appendChild(resourcesDiv);
    }

    // Add faction relations if any
    if (selectedChoice.faction_relations || (selectedChoice.base && selectedChoice.base.relations)) {
        const relations = selectedChoice.faction_relations || selectedChoice.base.relations;
        const relationsDiv = document.createElement('div');
        relationsDiv.className = 'detail-group';
        relationsDiv.innerHTML = '<h5>Faction Relations</h5><ul>';
        Object.entries(relations).forEach(([faction, value]) => {
            relationsDiv.innerHTML += `<li>${faction}: ${value >= 0 ? '+' : ''}${value}</li>`;
        });
        relationsDiv.innerHTML += '</ul>';
        content.appendChild(relationsDiv);
    }

    // Add bonus items if any
    if (selectedChoice.bonus_items) {
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'detail-group';
        itemsDiv.innerHTML = '<h5>Starting Items</h5><ul>';
        selectedChoice.bonus_items.forEach(item => {
            let itemText = item.name;
            if (item.quantity && item.quantity > 1) {
                itemText = `${item.name} (x${item.quantity})`;
            }
            if (item.effect) {
                itemText += ` - ${item.effect}`;
            }
            if (item.note) {
                itemText += ` (${item.note})`;
            }
            itemsDiv.innerHTML += `<li>${itemText}</li>`;
        });
        itemsDiv.innerHTML += '</ul>';
        content.appendChild(itemsDiv);
    }

    // Add mechanics if any
    if (selectedChoice.mechanics) {
        const mechanicsDiv = document.createElement('div');
        mechanicsDiv.className = 'detail-group';
        mechanicsDiv.innerHTML = '<h5>Mechanics</h5><ul>';
        Object.entries(selectedChoice.mechanics).forEach(([mechanic, value]) => {
            mechanicsDiv.innerHTML += `<li>${mechanic}: ${value}</li>`;
        });
        mechanicsDiv.innerHTML += '</ul>';
        content.appendChild(mechanicsDiv);
    }

    // Add conditional bonuses for stage 4 options
    if (selectedChoice.conditional_bonuses) {
        const conditionalsDiv = document.createElement('div');
        conditionalsDiv.className = 'detail-group';
        conditionalsDiv.innerHTML = '<h5>Conditional Bonuses</h5><ul>';
        Object.entries(selectedChoice.conditional_bonuses).forEach(([condition, bonuses]) => {
            let bonusText = `When choosing ${getChoiceTitleById(condition)}: `;
            const bonusList = [];
            Object.entries(bonuses).forEach(([type, value]) => {
                if (type === 'bonus_items' && Array.isArray(value)) {
                    value.forEach(item => {
                        let itemText = item.name;
                        if (item.effect) itemText += ` - ${item.effect}`;
                        if (item.note) itemText += ` (${item.note})`;
                        bonusList.push(itemText);
                    });
                } else if (typeof value === 'object') {
                    Object.entries(value).forEach(([subtype, subvalue]) => {
                        bonusList.push(`${subtype} ${subvalue >= 0 ? '+' : ''}${subvalue}`);
                    });
                } else if (typeof value === 'number') {
                    bonusList.push(`${type} ${value >= 0 ? '+' : ''}${value}`);
                }
            });
            conditionalsDiv.innerHTML += `<li>${bonusText}${bonusList.join(', ')}</li>`;
        });
        conditionalsDiv.innerHTML += '</ul>';
        content.appendChild(conditionalsDiv);
    }

    detailsPanel.appendChild(content);
}

// Update the choice display for the specified stage
function updateStageDisplay(stageId, choiceId) {
    const stageElement = document.getElementById(`${stageId}-details`);
    if (!stageElement) return;

    const contentDiv = stageElement.querySelector('.choice-content');
    if (!contentDiv) return;

    if (!choiceId) {
        contentDiv.innerHTML = `<p class="no-selection">No ${stageId.replace('-', ' ')} selected</p>`;
        return;
    }

    let selectedChoice = null;
    if (stageId === 'background') {
        selectedChoice = characterData.stage_1_options.find(option => option.id === choiceId);
    } else if (stageId === 'early-life') {
        selectedChoice = characterData.stage_2_options.find(option => option.id === choiceId);
    } else if (stageId === 'adulthood') {
        selectedChoice = characterData.stage_3_options.find(option => option.id === choiceId);
    } else if (stageId === 'reason') {
        selectedChoice = characterData.stage_4_options.find(option => option.id === choiceId);
    }

    if (!selectedChoice) {
        contentDiv.innerHTML = `<p class="no-selection">Invalid choice</p>`;
        return;
    }

    // Create the content
    contentDiv.innerHTML = `<h4>${selectedChoice.title}</h4>`;

    // Function to create a detail group if properties exist
    const createDetailGroup = (title, properties, formatter) => {
        if (!properties || Object.keys(properties).length === 0) return '';
        
        const items = Object.entries(properties).map(([key, value]) => {
            return `<li>${formatter ? formatter(key, value) : `${key}: ${value}`}</li>`;
        }).join('');
        
        return `
            <div class="detail-group">
                <h5>${title}</h5>
                <ul>${items}</ul>
            </div>
        `;
    };

    // Handle base properties for stage 4 options
    const attributes = selectedChoice.base ? selectedChoice.base.attributes : selectedChoice.attributes;
    const skills = selectedChoice.base ? selectedChoice.base.skills : selectedChoice.skills;
    const relations = selectedChoice.base ? selectedChoice.base.relations : selectedChoice.faction_relations;

    // Add each group of stats
    if (attributes) {
        contentDiv.innerHTML += createDetailGroup('Attributes', attributes, (key, value) => `${key}: +${value}`);
    }
    
    if (skills) {
        contentDiv.innerHTML += createDetailGroup('Skills', skills, (key, value) => `${key}: +${value}`);
    }

    if (selectedChoice.weapon_proficiencies) {
        contentDiv.innerHTML += createDetailGroup('Weapon Proficiencies', selectedChoice.weapon_proficiencies, (key, value) => `${key}: +${value}`);
    }

    if (selectedChoice.resources) {
        contentDiv.innerHTML += createDetailGroup('Resources', selectedChoice.resources, (key, value) => `${key}: ${value >= 0 ? '+' : ''}${value}`);
    }

    if (relations) {
        contentDiv.innerHTML += createDetailGroup('Faction Relations', relations, (key, value) => `${key}: ${value >= 0 ? '+' : ''}${value}`);
    }

    if (selectedChoice.bonus_items) {
        const itemsList = selectedChoice.bonus_items.map(item => {
            let itemText = item.name;
            if (item.quantity && item.quantity > 1) {
                itemText = `${item.name} (x${item.quantity})`;
            }
            if (item.effect) {
                itemText += ` - ${item.effect}`;
            }
            if (item.note) {
                itemText += ` (${item.note})`;
            }
            return `<li>${itemText}</li>`;
        }).join('');
        
        contentDiv.innerHTML += `
            <div class="detail-group">
                <h5>Starting Items</h5>
                <ul>${itemsList}</ul>
            </div>
        `;
    }

    if (selectedChoice.mechanics) {
        contentDiv.innerHTML += createDetailGroup('Mechanics', selectedChoice.mechanics);
    }

    // Add conditional bonuses for stage 4
    if (selectedChoice.conditional_bonuses) {
        const bonusesList = Object.entries(selectedChoice.conditional_bonuses).map(([condition, bonuses]) => {
            const bonusDescriptions = [];
            Object.entries(bonuses).forEach(([type, value]) => {
                if (type === 'bonus_items' && Array.isArray(value)) {
                    value.forEach(item => {
                        let itemText = item.name;
                        if (item.effect) itemText += ` - ${item.effect}`;
                        if (item.note) itemText += ` (${item.note})`;
                        bonusDescriptions.push(itemText);
                    });
                } else if (typeof value === 'object') {
                    Object.entries(value).forEach(([subtype, subvalue]) => {
                        bonusDescriptions.push(`${subtype} ${subvalue >= 0 ? '+' : ''}${subvalue}`);
                    });
                } else if (typeof value === 'number') {
                    bonusDescriptions.push(`${type} ${value >= 0 ? '+' : ''}${value}`);
                }
            });
            return `<li>With ${getChoiceTitleById(condition)}: ${bonusDescriptions.join(', ')}</li>`;
        }).join('');

        contentDiv.innerHTML += `
            <div class="detail-group">
                <h5>Conditional Bonuses</h5>
                <ul>${bonusesList}</ul>
            </div>
        `;
    }
}

// Helper function to format effects text
function formatEffects(choice) {
    if (!choice) return '';
    
    let effects = [];
    
    // Add attributes
    const attributes = choice.attributes || (choice.base && choice.base.attributes);
    if (attributes) {
        Object.entries(attributes).forEach(([attr, value]) => {
            effects.push(`${attr}: ${value >= 0 ? '+' : ''}${value}`);
        });
    }
    
    // Add skills
    const skills = choice.skills || (choice.base && choice.base.skills);
    if (skills) {
        effects.push('');  // Add a blank line before skills
        Object.entries(skills).forEach(([skill, value]) => {
            effects.push(`${skill}: ${value >= 0 ? '+' : ''}${value}`);
        });
    }
    
    // Add weapon proficiencies
    const proficiencies = choice.weapon_proficiencies || (choice.base && choice.base.weapon_proficiencies);
    if (proficiencies) {
        effects.push('');  // Add a blank line before proficiencies
        Object.entries(proficiencies).forEach(([prof, value]) => {
            effects.push(`${prof}: ${value >= 0 ? '+' : ''}${value}`);
        });
    }
    
    // Add resources
    const resources = choice.resources || (choice.base && choice.base.resources);
    if (resources) {
        effects.push('');  // Add a blank line before resources
        Object.entries(resources).forEach(([resource, value]) => {
            effects.push(`${resource}: ${value}`);
        });
    }
    
    // Add faction relations
    const relations = choice.faction_relations || (choice.base && choice.base.relations);
    if (relations) {
        effects.push('');  // Add a blank line before relations
        Object.entries(relations).forEach(([faction, value]) => {
            if (value !== 0) {
                effects.push(`${faction} relation: ${value >= 0 ? '+' : ''}${value}`);
            }
        });
    }

    // Add bonus items
    if (choice.bonus_items) {
        effects.push('');  // Add a blank line before bonus items
        choice.bonus_items.forEach(item => {
            let itemText = item.name;
            if (item.quantity && item.quantity > 1) {
                itemText = `${item.name} (x${item.quantity})`;
            }
            if (item.effect) {
                itemText += ` - ${item.effect}`;
            }
            effects.push(`Bonus item: ${itemText}`);
        });
    }

    // Add notes
    const notes = choice.notes || (choice.base && choice.base.notes);
    if (notes) {
        effects.push('');  // Add a blank line before notes
        effects.push('Notes:');
        if (Array.isArray(notes)) {
            notes.forEach(note => effects.push(`• ${note}`));
        } else {
            effects.push(`• ${notes}`);
        }
    }
    
    return effects.join('\n');
}

// Update details when an option is selected
function updateOptionDetails(selectElement, stage) {
    const selectedValue = selectElement.value;
    let choice = null;
    const notesList = document.getElementById('notes-list');
    
    switch(stage) {
        case 'gender':
            const genderStats = characterData.gender_stats[selectedValue === 'male' ? 'male' : 'female_custom_faces'];
            if (genderStats && genderStats.attributes) {
                let effects = [];
                Object.entries(genderStats.attributes).forEach(([attr, value]) => {
                    effects.push(`${attr}: ${value >= 0 ? '+' : ''}${value}`);
                });
                document.getElementById('gender-effects').textContent = effects.join(', ');
            } else {
                document.getElementById('gender-effects').textContent = 'No effects';
            }
            break;
        case 'father':
            choice = characterData.stage_1_options.find(option => option.id === selectedValue);
            document.getElementById('father-effects').textContent = 
                choice ? formatEffects(choice) : '';
            if (choice && choice.notes) {
                updateNotesList(choice.notes);
            }
            break;
        case 'early-life':
            choice = characterData.stage_2_options.find(option => option.id === selectedValue);
            document.getElementById('early-life-effects').textContent = 
                choice ? formatEffects(choice) : '';
            if (choice && choice.notes) {
                updateNotesList(choice.notes);
            }
            break;
        case 'adulthood':
            choice = characterData.stage_3_options.find(option => option.id === selectedValue);
            document.getElementById('adulthood-effects').textContent = 
                choice ? formatEffects(choice) : '';
            if (choice && choice.notes) {
                updateNotesList(choice.notes);
            }
            break;
        case 'reason':
            choice = characterData.stage_4_options.find(option => option.id === selectedValue);
            if (choice) {
                // Get base effects
                let effects = formatEffects(choice);
                
                // Get conditional effects based on adulthood choice
                const adulthood = document.getElementById('adulthood').value;
                if (adulthood && choice.conditional_bonuses && choice.conditional_bonuses[adulthood]) {
                    effects += '\n\nConditional Bonuses:\n' + 
                             formatEffects(choice.conditional_bonuses[adulthood]);
                }
                document.getElementById('reason-effects').textContent = effects;
                
                // Update notes for both base and conditional notes
                let allNotes = [];
                if (choice.base && choice.base.notes) {
                    allNotes = allNotes.concat(choice.base.notes);
                }
                if (choice.notes) {
                    allNotes = allNotes.concat(choice.notes);
                }
                if (allNotes.length > 0) {
                    updateNotesList(allNotes);
                }
            } else {
                document.getElementById('reason-effects').textContent = '';
            }
            break;
    }
}

// Helper function to update the notes list
function updateNotesList(notes) {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;
    
    // Clear existing notes
    notesList.innerHTML = '';
    
    // Add new notes
    if (Array.isArray(notes)) {
        notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            notesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = notes;
        notesList.appendChild(li);
    }
    
    // Show the notes section if there are notes
    const notesSection = document.querySelector('.notes');
    if (notesSection) {
        notesSection.style.display = notes.length > 0 ? 'block' : 'none';
    }
}

// Initialize form - update to include new event listeners
function initializeForm() {
    if (!characterData) return;
    
    // Add event listener for gender change
    document.getElementById('gender').addEventListener('change', function(e) {
        populateDropdowns(e.target.value);
    });
    
    // Initial population based on default gender
    populateDropdowns(document.getElementById('gender').value);
    
    // Add event listeners for all select elements
    document.getElementById('gender').addEventListener('change', 
        (e) => updateOptionDetails(e.target, 'gender'));
    document.getElementById('father').addEventListener('change', 
        (e) => updateOptionDetails(e.target, 'father'));
    document.getElementById('early-life').addEventListener('change', 
        (e) => updateOptionDetails(e.target, 'early-life'));
    document.getElementById('adulthood').addEventListener('change', 
        (e) => updateOptionDetails(e.target, 'adulthood'));
    document.getElementById('reason').addEventListener('change', 
        (e) => updateOptionDetails(e.target, 'reason'));

    // Get all select elements
    const genderSelect = document.getElementById('gender');
    const backgroundSelect = document.getElementById('father');
    const earlyLifeSelect = document.getElementById('early-life');
    const adulthoodSelect = document.getElementById('adulthood');
    const reasonSelect = document.getElementById('reason');

    // Add event listeners for stats updates and choice display updates
    genderSelect.addEventListener('change', handleGenderChange);
    backgroundSelect.addEventListener('change', (e) => {
        updateStats();
        updateStageDisplay('background', e.target.value);
    });
    earlyLifeSelect.addEventListener('change', (e) => {
        updateStats();
        updateStageDisplay('early-life', e.target.value);
    });
    adulthoodSelect.addEventListener('change', (e) => {
        updateStats();
        updateStageDisplay('adulthood', e.target.value);
    });
    reasonSelect.addEventListener('change', (e) => {
        updateStats();
        updateStageDisplay('reason', e.target.value);
    });

    // Initial population of options based on current gender
    const gender = genderSelect.value;
    populateBackgroundOptions(gender);
    populateEarlyLifeOptions();
    populateAdulthoodOptions(gender);
    populateReasonOptions();
}

// Populate background options based on gender
function populateBackgroundOptions(gender) {
    const backgroundSelect = document.getElementById('father');
    
    // Clear existing options except the first one
    while (backgroundSelect.options.length > 1) {
        backgroundSelect.remove(1);
    }

    // Filter and add background options based on gender
    characterData.stage_1_options.forEach(option => {
        // Check if option is valid for the selected gender
        if (!option.requirements?.gender || option.requirements.gender === gender) {
            const element = document.createElement('option');
            element.value = option.id;
            element.textContent = option.title;
            backgroundSelect.appendChild(element);
        }
    });
}

// Populate early life options (stage 2)
function populateEarlyLifeOptions() {
    const earlyLifeSelect = document.getElementById('early-life');
    
    // Clear existing options except the first one
    while (earlyLifeSelect.options.length > 1) {
        earlyLifeSelect.remove(1);
    }

    // Add early life options
    characterData.stage_2_options.forEach(option => {
        const element = document.createElement('option');
        element.value = option.id;
        element.textContent = option.title;
        earlyLifeSelect.appendChild(element);
    });
}

// Populate adulthood options (stage 3)
function populateAdulthoodOptions(gender) {
    const adulthoodSelect = document.getElementById('adulthood');
    
    // Clear existing options except the first one
    while (adulthoodSelect.options.length > 1) {
        adulthoodSelect.remove(1);
    }

    // Add adulthood options based on gender
    characterData.stage_3_options.forEach(option => {
        // Check if option is valid for the selected gender
        if (!option.gender_restriction || option.gender_restriction === gender) {
            const element = document.createElement('option');
            element.value = option.id;
            element.textContent = option.title;
            adulthoodSelect.appendChild(element);
        }
    });
}

// Populate reason for adventure options (stage 4)
function populateReasonOptions() {
    const reasonSelect = document.getElementById('reason');
    
    // Clear existing options except the first one
    while (reasonSelect.options.length > 1) {
        reasonSelect.remove(1);
    }

    // Add reason options
    characterData.stage_4_options.forEach(option => {
        const element = document.createElement('option');
        element.value = option.id;
        element.textContent = option.title;
        reasonSelect.appendChild(element);
    });
}

// Handle gender change
function handleGenderChange(event) {
    const gender = event.target.value;
    populateBackgroundOptions(gender);
    populateAdulthoodOptions(gender);
    updateStats();
}

// Update character stats based on selections
function updateStats() {
    if (!characterData) return;

    const gender = document.getElementById('gender').value;
    const background = document.getElementById('father').value;
    const earlyLife = document.getElementById('early-life').value;
    const adulthood = document.getElementById('adulthood').value;
    const reason = document.getElementById('reason').value;

    // Start with base stats and starting faction relations
    let stats = {
        attributes: { ...characterData.base_stats.attributes },
        skills: { ...characterData.base_stats.skills },
        weapon_proficiencies: { ...characterData.base_stats.weapon_proficiencies },
        resources: { ...characterData.base_stats.resources },
        faction_relations: { ...characterData.base_stats.faction_relations },
        bonus_items: []
    };

    // Add starting faction relations
    if (characterData.faction_starting_relations) {
        characterData.faction_starting_relations.forEach(relation => {
            stats.faction_relations[relation.faction] = (stats.faction_relations[relation.faction] || 0) + relation.relation;
        });
    }

    // Apply gender bonuses
    if (gender === 'male' && characterData.gender_stats.male) {
        updateStatsFromChoice(stats, characterData.gender_stats.male);
    } else if (gender === 'female') {
        updateStatsFromChoice(stats, characterData.gender_stats.female_custom_faces);
    }

    // Apply background choice (stage 1)
    if (background) {
        const backgroundChoice = characterData.stage_1_options.find(option => option.id === background);
        if (backgroundChoice) {
            updateStatsFromChoice(stats, backgroundChoice);
        }
    }

    // Apply early life choice (stage 2)
    if (earlyLife) {
        const earlyLifeChoice = characterData.stage_2_options.find(option => option.id === earlyLife);
        if (earlyLifeChoice) {
            updateStatsFromChoice(stats, earlyLifeChoice);
        }
    }

    // Apply adulthood choice (stage 3)
    if (adulthood) {
        const adulthoodChoice = characterData.stage_3_options.find(option => option.id === adulthood);
        if (adulthoodChoice) {
            updateStatsFromChoice(stats, adulthoodChoice);
        }
    }

    // Apply reason choice (stage 4) and conditional bonuses
    if (reason) {
        const reasonChoice = characterData.stage_4_options.find(option => option.id === reason);
        if (reasonChoice) {
            // Apply base bonuses from the reason choice
            if (reasonChoice.base) {
                updateStatsFromChoice(stats, reasonChoice.base);
            }

            // Apply conditional bonuses based on background and adulthood choices
            if (reasonChoice.conditional_bonuses) {
                // Check for background conditional bonuses
                if (background && reasonChoice.conditional_bonuses[background]) {
                    updateStatsFromChoice(stats, reasonChoice.conditional_bonuses[background]);
                }
                // Check for adulthood conditional bonuses
                if (adulthood && reasonChoice.conditional_bonuses[adulthood]) {
                    updateStatsFromChoice(stats, reasonChoice.conditional_bonuses[adulthood]);
                }
            }
        }
    }

    // Update the display
    updateStatsDisplay(stats);
}

// Helper function to update stats from a choice
function updateStatsFromChoice(stats, choice) {
    // Update attributes
    // Handle direct attributes and nested attributes in 'base'
    if (choice.attributes) {
        Object.entries(choice.attributes).forEach(([attr, value]) => {
            stats.attributes[attr] = (stats.attributes[attr] || 0) + value;
        });
    }
    // Handle nested attributes in conditional bonuses
    if (choice.conditional_bonuses) {
        Object.values(choice.conditional_bonuses).forEach(bonuses => {
            if (bonuses.attributes) {
                Object.entries(bonuses.attributes).forEach(([attr, value]) => {
                    stats.attributes[attr] = (stats.attributes[attr] || 0) + value;
                });
            }
        });
    }

    // Update skills
    if (choice.skills) {
        Object.entries(choice.skills).forEach(([skill, value]) => {
            stats.skills[skill] = (stats.skills[skill] || 0) + value;
        });
    }

    // Update weapon proficiencies
    if (choice.weapon_proficiencies) {
        Object.entries(choice.weapon_proficiencies).forEach(([prof, value]) => {
            stats.weapon_proficiencies[prof] = (stats.weapon_proficiencies[prof] || 0) + value;
        });
    }

    // Update resources
    if (choice.resources) {
        Object.entries(choice.resources).forEach(([resource, value]) => {
            stats.resources[resource] = (stats.resources[resource] || 0) + value;
        });
    }

    // Update faction relations (both direct and nested in 'relations')
    // Handle direct faction_relations and relations
    if (choice.faction_relations) {
        Object.entries(choice.faction_relations).forEach(([faction, value]) => {
            stats.faction_relations[faction] = (stats.faction_relations[faction] || 0) + value;
        });
    }
    if (choice.relations) {
        Object.entries(choice.relations).forEach(([faction, value]) => {
            stats.faction_relations[faction] = (stats.faction_relations[faction] || 0) + value;
        });
    }
    // Handle nested relations in conditional bonuses
    if (choice.conditional_bonuses) {
        Object.values(choice.conditional_bonuses).forEach(bonuses => {
            if (bonuses.relations) {
                Object.entries(bonuses.relations).forEach(([faction, value]) => {
                    stats.faction_relations[faction] = (stats.faction_relations[faction] || 0) + value;
                });
            }
        });
    }

    // Add bonus items
    if (choice.bonus_items) {
        stats.bonus_items.push(...choice.bonus_items);
    }

    // Handle special notes and mechanics if needed
    if (choice.mechanics) {
        stats.mechanics = { ...stats.mechanics, ...choice.mechanics };
    }
}

// Update the display of all stats
function updateStatsDisplay(stats) {
    // Update attributes
    document.getElementById('strength').textContent = stats.attributes.Strength;
    document.getElementById('agility').textContent = stats.attributes.Agility;
    document.getElementById('intelligence').textContent = stats.attributes.Intelligence;
    document.getElementById('charisma').textContent = stats.attributes.Charisma;

    // Update skills
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    Object.entries(stats.skills).forEach(([skill, value]) => {
        if (value > 0) {
            const li = document.createElement('li');
            li.textContent = `${skill}: ${value}`;
            skillsList.appendChild(li);
        }
    });

    // Update proficiencies
    const proficienciesList = document.getElementById('proficiencies-list');
    proficienciesList.innerHTML = '';
    Object.entries(stats.weapon_proficiencies).forEach(([prof, value]) => {
        if (value > 0) {
            const li = document.createElement('li');
            li.textContent = `${prof}: ${value}`;
            proficienciesList.appendChild(li);
        }
    });

    // Update resources
    const resourcesList = document.getElementById('resources-list');
    resourcesList.innerHTML = '';
    
    // Always show Gold, Honor, and Renown
    const priorityResources = ['Gold', 'Honor', 'Renown'];
    priorityResources.forEach(resource => {
        const li = document.createElement('li');
        li.textContent = `${resource}: ${stats.resources[resource] || 0}`;
        resourcesList.appendChild(li);
    });
    
    // Show other resources if they exist
    Object.entries(stats.resources).forEach(([resource, value]) => {
        if (!priorityResources.includes(resource) && value !== 0) {
            const li = document.createElement('li');
            li.textContent = `${resource}: ${value}`;
            resourcesList.appendChild(li);
        }
    });

    // Update faction relations
    const relationsList = document.getElementById('relations-list');
    relationsList.innerHTML = '';
    Object.entries(stats.faction_relations).forEach(([faction, value]) => {
        if (value !== 0) {
            const li = document.createElement('li');
            li.textContent = `${faction}: ${value}`;
            relationsList.appendChild(li);
        }
    });

    // Update bonus items
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    if (stats.bonus_items && stats.bonus_items.length > 0) {
        stats.bonus_items.forEach(item => {
            const li = document.createElement('li');
            let itemText = item.name;
            if (item.quantity && item.quantity > 1) {
                itemText = `${item.name} (x${item.quantity})`;
            }
            if (item.effect) {
                itemText += ` - ${item.effect}`;
            }
            if (item.note) {
                itemText += ` (${item.note})`;
            }
            li.textContent = itemText;
            itemsList.appendChild(li);
        });
    }

    // Update mechanics
    const mechanicsList = document.getElementById('mechanics-list');
    mechanicsList.innerHTML = '';
    if (stats.mechanics) {
        Object.entries(stats.mechanics).forEach(([mechanic, value]) => {
            const li = document.createElement('li');
            li.textContent = `${mechanic}: ${value}`;
            mechanicsList.appendChild(li);
        });
    }
}

// Function to find the best options for a given attribute
function findBestOptionsForAttribute(attributeName) {
    if (!characterData) return null;
    
    // Helper function to get attribute bonus from an option
    function getAttributeBonus(option, stage) {
        let total = 0;
        
        // Check direct attributes
        if (option.attributes && option.attributes[attributeName]) {
            total += option.attributes[attributeName];
        }
        
        // Check base attributes
        if (option.base && option.base.attributes && option.base.attributes[attributeName]) {
            total += option.base.attributes[attributeName];
        }
        
        return total;
    }
    
    // Find best gender
    let bestGender = 'male';
    let bestGenderBonus = 0;
    const maleBonus = characterData.gender_stats.male.attributes[attributeName] || 0;
    const femaleBonus = characterData.gender_stats.female_custom_faces.attributes[attributeName] || 0;
    if (femaleBonus > maleBonus) {
        bestGender = 'female';
        bestGenderBonus = femaleBonus;
    } else {
        bestGenderBonus = maleBonus;
    }
    
    // Find best background (stage 1)
    let bestBackground = '';
    let bestBackgroundBonus = -999;
    characterData.stage_1_options.forEach(option => {
        // Check gender requirements
        if (option.requirements && option.requirements.gender && 
            option.requirements.gender !== bestGender) {
            return;
        }
        const bonus = getAttributeBonus(option);
        if (bonus > bestBackgroundBonus) {
            bestBackgroundBonus = bonus;
            bestBackground = option.id;
        }
    });
    
    // Find best early life (stage 2)
    let bestEarlyLife = '';
    let bestEarlyLifeBonus = -999;
    characterData.stage_2_options.forEach(option => {
        const bonus = getAttributeBonus(option);
        if (bonus > bestEarlyLifeBonus) {
            bestEarlyLifeBonus = bonus;
            bestEarlyLife = option.id;
        }
    });
    
    // Find best adulthood (stage 3)
    let bestAdulthood = '';
    let bestAdulthoodBonus = -999;
    characterData.stage_3_options.forEach(option => {
        // Check gender restrictions
        if (option.gender_restriction && option.gender_restriction !== bestGender) {
            return;
        }
        const bonus = getAttributeBonus(option);
        if (bonus > bestAdulthoodBonus) {
            bestAdulthoodBonus = bonus;
            bestAdulthood = option.id;
        }
    });
    
    // Find best reason (stage 4)
    let bestReason = '';
    let bestReasonBonus = -999;
    characterData.stage_4_options.forEach(option => {
        let bonus = getAttributeBonus(option);
        
        // Check conditional bonuses
        if (option.conditional_bonuses) {
            if (option.conditional_bonuses[bestBackground]) {
                bonus += getAttributeBonus(option.conditional_bonuses[bestBackground]);
            }
            if (option.conditional_bonuses[bestAdulthood]) {
                bonus += getAttributeBonus(option.conditional_bonuses[bestAdulthood]);
            }
        }
        
        if (bonus > bestReasonBonus) {
            bestReasonBonus = bonus;
            bestReason = option.id;
        }
    });
    
    // Calculate total bonus
    const totalBonus = bestGenderBonus + bestBackgroundBonus + 
                      bestEarlyLifeBonus + bestAdulthoodBonus + bestReasonBonus;
    
    return {
        gender: bestGender,
        background: bestBackground,
        earlyLife: bestEarlyLife,
        adulthood: bestAdulthood,
        reason: bestReason,
        totalBonus: totalBonus
    };
}

// Function to populate dropdowns based on gender
function populateDropdowns(gender) {
    // Populate background options
    populateBackgroundOptions(gender);
    
    // Populate early life options
    populateEarlyLifeOptions();
    
    // Populate adulthood options
    populateAdulthoodOptions(gender);
    
    // Populate reason options
    populateReasonOptions();
}

// Function to find the best options for a given attribute, skill, weapon proficiency, or resource
function findBestOptions(type, name) {
    if (!characterData) return null;
    
    // Helper function to get bonus from an option
    function getBonus(option) {
        let total = 0;
        
        switch(type) {
            case 'attribute':
                if (name === 'Gold' || name === 'Honor' || name === 'Renown') {
                    // Handle resources
                    if (option.resources && option.resources[name]) {
                        total += option.resources[name];
                    }
                    // Check conditional bonuses for resources
                    if (option.conditional_bonuses) {
                        Object.values(option.conditional_bonuses).forEach(bonus => {
                            if (bonus.resources && bonus.resources[name]) {
                                total += bonus.resources[name];
                            }
                            if (bonus.attributes && bonus.attributes[name]) {
                                total += bonus.attributes[name];
                            }
                        });
                    }
                    // Check base resources
                    if (option.base && option.base.resources && option.base.resources[name]) {
                        total += option.base.resources[name];
                    }
                    // Check base attributes (for Honor/Renown in conditional bonuses)
                    if (option.base && option.base.attributes && option.base.attributes[name]) {
                        total += option.base.attributes[name];
                    }
                } else {
                    // Handle regular attributes
                    if (option.attributes && option.attributes[name]) {
                        total += option.attributes[name];
                    }
                    if (option.base && option.base.attributes && option.base.attributes[name]) {
                        total += option.base.attributes[name];
                    }
                }
                break;
            
            case 'skill':
                if (option.skills && option.skills[name]) {
                    total += option.skills[name];
                }
                if (option.base && option.base.skills && option.base.skills[name]) {
                    total += option.base.skills[name];
                }
                break;
            
            case 'proficiency':
                if (option.weapon_proficiencies && option.weapon_proficiencies[name]) {
                    total += option.weapon_proficiencies[name];
                }
                if (option.base && option.base.weapon_proficiencies && option.base.weapon_proficiencies[name]) {
                    total += option.base.weapon_proficiencies[name];
                }
                break;
        }
        
        return total;
    }
    
    // Find best gender (only relevant for regular attributes)
    let bestGender = 'male';
    let bestGenderBonus = 0;
    if (type === 'attribute' && !['Gold', 'Honor', 'Renown'].includes(name)) {
        const maleBonus = characterData.gender_stats.male.attributes[name] || 0;
        const femaleBonus = characterData.gender_stats.female_custom_faces.attributes[name] || 0;
        if (femaleBonus > maleBonus) {
            bestGender = 'female';
            bestGenderBonus = femaleBonus;
        } else {
            bestGenderBonus = maleBonus;
        }
    }
    
    // Find best options for each stage
    let bestBackground = '';
    let bestBackgroundBonus = -999;
    let bestEarlyLife = '';
    let bestEarlyLifeBonus = -999;
    let bestAdulthood = '';
    let bestAdulthoodBonus = -999;
    let bestReason = '';
    let bestReasonBonus = -999;

    // Background (stage 1)
    characterData.stage_1_options.forEach(option => {
        if (option.requirements && option.requirements.gender && 
            option.requirements.gender !== bestGender) {
            return;
        }
        const bonus = getBonus(option);
        if (bonus > bestBackgroundBonus) {
            bestBackgroundBonus = bonus;
            bestBackground = option.id;
        }
    });
    
    // Early Life (stage 2)
    characterData.stage_2_options.forEach(option => {
        const bonus = getBonus(option);
        if (bonus > bestEarlyLifeBonus) {
            bestEarlyLifeBonus = bonus;
            bestEarlyLife = option.id;
        }
    });
    
    // Adulthood (stage 3)
    characterData.stage_3_options.forEach(option => {
        if (option.gender_restriction && option.gender_restriction !== bestGender) {
            return;
        }
        const bonus = getBonus(option);
        if (bonus > bestAdulthoodBonus) {
            bestAdulthoodBonus = bonus;
            bestAdulthood = option.id;
        }
    });
    
    // Reason (stage 4)
    characterData.stage_4_options.forEach(option => {
        let bonus = getBonus(option);
        
        // Check conditional bonuses
        if (option.conditional_bonuses) {
            if (option.conditional_bonuses[bestBackground]) {
                bonus += getBonus(option.conditional_bonuses[bestBackground]);
            }
            if (option.conditional_bonuses[bestAdulthood]) {
                bonus += getBonus(option.conditional_bonuses[bestAdulthood]);
            }
        }
        
        if (bonus > bestReasonBonus) {
            bestReasonBonus = bonus;
            bestReason = option.id;
        }
    });
    
    // Add base resources for Gold, Honor, and Renown
    if (['Gold', 'Honor', 'Renown'].includes(name)) {
        bestGenderBonus = characterData.base_stats.resources[name] || 0;
    }
    
    // Calculate total bonus
    const totalBonus = bestGenderBonus + bestBackgroundBonus + 
                      bestEarlyLifeBonus + bestAdulthoodBonus + bestReasonBonus;
    
    return {
        gender: bestGender,
        background: bestBackground,
        earlyLife: bestEarlyLife,
        adulthood: bestAdulthood,
        reason: bestReason,
        totalBonus: totalBonus
    };
}

// Apply the optimal choices to the UI
function applyOptimalChoices(choices) {
    if (!characterData) return;

    // Set gender first
    const genderSelect = document.getElementById('gender');
    genderSelect.value = choices.gender;

    // Populate all dropdowns based on the selected gender
    populateDropdowns(choices.gender);

    // Set values for all dropdowns
    document.getElementById('father').value = choices.background;
    document.getElementById('early-life').value = choices.earlyLife;
    document.getElementById('adulthood').value = choices.adulthood;
    document.getElementById('reason').value = choices.reason;

    // Trigger change events to update UI
    ['father', 'early-life', 'adulthood', 'reason'].forEach(id => {
        const event = new Event('change');
        document.getElementById(id).dispatchEvent(event);
    });

    // Update result display
    const resultDiv = document.getElementById('optimization-result');
    const attribute = document.getElementById('optimize-attribute').value;
    const skill = document.getElementById('optimize-skill').value;
    const statName = attribute || skill;
    if (resultDiv) {
        resultDiv.textContent = `Total ${statName} bonus from all choices: +${choices.totalBonus}`;
    }

    // Update overall stats display
    updateStats();
}

// Initialize optimization controls
function initializeOptimizer() {
    const optimizeButton = document.getElementById('find-best-options');
    const attributeSelect = document.getElementById('optimize-attribute');
    const skillSelect = document.getElementById('optimize-skill');
    const proficiencySelect = document.getElementById('optimize-proficiency');
    
    if (optimizeButton) {
        optimizeButton.addEventListener('click', () => {
            const attribute = attributeSelect.value;
            const skill = skillSelect.value;
            const proficiency = proficiencySelect.value;
            
            // Check that only one option is selected
            const selectedCount = [attribute, skill, proficiency].filter(x => x).length;
            if (selectedCount === 0) {
                alert('Please select either an attribute, skill, or weapon proficiency to optimize for.');
                return;
            }
            if (selectedCount > 1) {
                alert('Please select only one stat to optimize for (attribute, skill, or weapon proficiency).');
                return;
            }
            
            let type, name;
            if (attribute) {
                type = 'attribute';
                name = attribute;
            } else if (skill) {
                type = 'skill';
                name = skill;
            } else {
                type = 'proficiency';
                name = proficiency;
            }
            
            const bestChoices = findBestOptions(type, name);
            if (bestChoices) {
                applyOptimalChoices(bestChoices);
            }
        });
    }
    
    // Make dropdowns mutually exclusive
    const dropdowns = [attributeSelect, skillSelect, proficiencySelect];
    dropdowns.forEach(select => {
        select.addEventListener('change', () => {
            if (select.value) {
                dropdowns.forEach(other => {
                    if (other !== select) other.value = '';
                });
            }
        });
    });
}

// Initialize target attributes feature
function initializeTargetAttributes() {
    const findClosestButton = document.getElementById('find-closest-match');
    if (!findClosestButton) return;

    findClosestButton.addEventListener('click', () => {
        const targetAttributes = {
            Strength: parseInt(document.getElementById('target-strength').value) || 6,
            Agility: parseInt(document.getElementById('target-agility').value) || 5,
            Intelligence: parseInt(document.getElementById('target-intelligence').value) || 4,
            Charisma: parseInt(document.getElementById('target-charisma').value) || 5
        };

        const bestChoices = findClosestAttributeMatch(targetAttributes);
        if (bestChoices) {
            // Apply the choices to the UI
            applyOptimalChoices({
                gender: bestChoices.gender,
                background: bestChoices.background,
                earlyLife: bestChoices.earlyLife,
                adulthood: bestChoices.adulthood,
                reason: bestChoices.reason
            });

            // Show the results
            const resultDiv = document.getElementById('target-result');
            if (resultDiv) {
                // First update the actual character choices and stats
                updateStats();
                
                // Now show the comparison between target and actual
                const finalStats = bestChoices.finalStats;
                const targetStats = bestChoices.targetStats;
                
                let resultHTML = '<h4>Target vs Actual Attributes:</h4>';
                resultHTML += '<div class="attribute-comparison">';
                ['Strength', 'Agility', 'Intelligence', 'Charisma'].forEach(attr => {
                    const actualValue = parseInt(document.getElementById(attr.toLowerCase()).textContent);
                    const targetValue = targetStats[attr];
                    const diff = actualValue - targetValue;
                    const diffClass = diff === 0 ? 'match' : (diff > 0 ? 'above' : 'below');
                    resultHTML += `
                        <div class="attribute">
                            <span>${attr}: ${actualValue} / Target: ${targetValue}</span>
                            <span class="${diffClass}">(${diff >= 0 ? '+' : ''}${diff} from target)</span>
                        </div>`;
                });
                resultHTML += '</div>';
                
                resultDiv.innerHTML = resultHTML;
            }
        }
    });

    // Set initial values from base stats
    if (characterData && characterData.base_stats) {
        document.getElementById('target-strength').value = characterData.base_stats.attributes.Strength;
        document.getElementById('target-agility').value = characterData.base_stats.attributes.Agility;
        document.getElementById('target-intelligence').value = characterData.base_stats.attributes.Intelligence;
        document.getElementById('target-charisma').value = characterData.base_stats.attributes.Charisma;
    }
}

// On window load
window.onload = async function() {
    await loadCharacterData();
    if (characterData) {
        initializeForm();
        initializeOptimizer();
        initializeTargetAttributes();
    }
};

// Function to find choices that result in closest match to target attributes
function findClosestAttributeMatch(targetAttributes) {
    if (!characterData) return null;

    // Helper function to get total attributes for a given set of choices
    function calculateTotalAttributes(gender, background, earlyLife, adulthood, reason) {
        let total = { ...characterData.base_stats.attributes };

        // Add gender bonuses
        const genderStats = gender === 'male' ? 
            characterData.gender_stats.male : 
            characterData.gender_stats.female_custom_faces;
        
        if (genderStats.attributes) {
            Object.entries(genderStats.attributes).forEach(([attr, value]) => {
                total[attr] = (total[attr] || 0) + value;
            });
        }

        // Add background bonuses
        const backgroundChoice = characterData.stage_1_options.find(o => o.id === background);
        if (backgroundChoice && backgroundChoice.attributes) {
            Object.entries(backgroundChoice.attributes).forEach(([attr, value]) => {
                total[attr] = (total[attr] || 0) + value;
            });
        }

        // Add early life bonuses
        const earlyLifeChoice = characterData.stage_2_options.find(o => o.id === earlyLife);
        if (earlyLifeChoice && earlyLifeChoice.attributes) {
            Object.entries(earlyLifeChoice.attributes).forEach(([attr, value]) => {
                total[attr] = (total[attr] || 0) + value;
            });
        }

        // Add adulthood bonuses
        const adulthoodChoice = characterData.stage_3_options.find(o => o.id === adulthood);
        if (adulthoodChoice && adulthoodChoice.attributes) {
            Object.entries(adulthoodChoice.attributes).forEach(([attr, value]) => {
                total[attr] = (total[attr] || 0) + value;
            });
        }

        // Add reason bonuses
        const reasonChoice = characterData.stage_4_options.find(o => o.id === reason);
        if (reasonChoice) {
            // Add base attributes
            if (reasonChoice.base && reasonChoice.base.attributes) {
                Object.entries(reasonChoice.base.attributes).forEach(([attr, value]) => {
                    total[attr] = (total[attr] || 0) + value;
                });
            }

            // Add conditional bonuses
            if (reasonChoice.conditional_bonuses) {
                if (reasonChoice.conditional_bonuses[background] && 
                    reasonChoice.conditional_bonuses[background].attributes) {
                    Object.entries(reasonChoice.conditional_bonuses[background].attributes).forEach(([attr, value]) => {
                        total[attr] = (total[attr] || 0) + value;
                    });
                }
                if (reasonChoice.conditional_bonuses[adulthood] && 
                    reasonChoice.conditional_bonuses[adulthood].attributes) {
                    Object.entries(reasonChoice.conditional_bonuses[adulthood].attributes).forEach(([attr, value]) => {
                        total[attr] = (total[attr] || 0) + value;
                    });
                }
            }
        }

        return total;
    }

    // Helper function to calculate Manhattan distance between two attribute sets
    function calculateDistance(attrs1, attrs2) {
        return Math.abs(attrs1.Strength - attrs2.Strength) +
               Math.abs(attrs1.Agility - attrs2.Agility) +
               Math.abs(attrs1.Intelligence - attrs2.Intelligence) +
               Math.abs(attrs1.Charisma - attrs2.Charisma);
    }

    let bestChoices = null;
    let bestDistance = Infinity;
    let bestStats = null;

    // Try each gender
    ['male', 'female'].forEach(gender => {
        // Try each valid background for this gender
        characterData.stage_1_options.forEach(background => {
            if (background.requirements?.gender && background.requirements.gender !== gender) return;

            characterData.stage_2_options.forEach(earlyLife => {
                characterData.stage_3_options.forEach(adulthood => {
                    if (adulthood.gender_restriction && adulthood.gender_restriction !== gender) return;

                    characterData.stage_4_options.forEach(reason => {
                        const currentStats = calculateTotalAttributes(
                            gender,
                            background.id,
                            earlyLife.id,
                            adulthood.id,
                            reason.id
                        );

                        const distance = calculateDistance(currentStats, targetAttributes);

                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestStats = currentStats;
                            bestChoices = {
                                gender: gender,
                                background: background.id,
                                earlyLife: earlyLife.id,
                                adulthood: adulthood.id,
                                reason: reason.id,
                                finalStats: currentStats,
                                targetStats: targetAttributes
                            };
                        }
                    });
                });
            });
        });
    });

    return bestChoices;
}