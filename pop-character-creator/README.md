# Pop Character Creator

## Overview
The Pop Character Creator is a web-based tool designed for players of the "Prophesy of Pendor" mod for Mount and Blade: Warband. This application helps users create their character by making informed choices about their character's background, displaying all effects and bonuses in real-time.

## Features
- Clean, modern interface split into two panels
- Comprehensive background choices:
  - Gender selection with attribute modifiers
  - Background selection (e.g., Noble, Merchant, Knight)
  - Early life choices
  - Adulthood profession
  - Reason for adventure
- Detailed stat tracking:
  - Base attributes (Strength, Agility, Intelligence, Charisma)
  - Skills and their levels
  - Weapon proficiencies
  - Resources (Gold, Honor, Renown)
  - Faction relations
  - Starting items and equipment  - Real-time updates:
    - Immediate effect preview for each choice
    - Conditional bonuses based on previous selections
    - Important gameplay notes and mechanics
  - Optimization features:
    - Find the best combination of choices for maximizing any attribute
    - Optimize for specific skills
    - Optimize for weapon proficiencies
    - Automatic application of optimal choices
  - Visual feedback:
    - Clear organization of stats and effects
    - Color-coded sections for easy reading
    - Detailed breakdown of each choice's impact

## Project Structure
```
pop-character-creator
├── src
│   ├── index.html        # Main HTML document
│   ├── styles
│   │   └── main.css      # Styles for the character creator
│   └── scripts
│       └── app.js        # JavaScript functionality
├── assets
│   └── data.json         # Data for character creation
└── README.md             # Project documentation
```

## Getting Started
To set up the Pop Character Creator locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pop-character-creator.git
   ```

2. Navigate to the project directory:
   ```
   cd pop-character-creator
   ```

3. Open `src/index.html` in your web browser to view the character creator.

## Usage
1. Select your character's gender:
   - Male: Bonus to Strength and Charisma
   - Female: Bonus to Agility and Intelligence

2. Choose your background:
   - Each background provides different starting bonuses
   - Some backgrounds are gender-specific
   - Affects starting equipment, skills, and faction relations

3. Select your early life path:
   - Determines additional skills and attributes
   - May provide special equipment or resources

4. Choose your adulthood profession:
   - Further specializes your character
   - Provides profession-specific bonuses and items

5. Pick your reason for adventure:
   - Final set of bonuses and effects
   - May have conditional bonuses based on previous choices
   - Can include special notes about gameplay mechanics

The interface will show:
- On the left: All available choices with detailed breakdowns of their effects
- On the right: Your current character stats, including:
  - Attributes
  - Skills
  - Weapon Proficiencies
  - Resources
  - Faction Relations
  - Starting Items
  - Important Notes

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.