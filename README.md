# 🏰 Mystic Realms - 1v1 Card Battle Game

A browser-based card battle game inspired by Dungeons & Dragons mechanics, built entirely with vanilla HTML5, CSS3, and modern JavaScript (ES6+). No backend or external libraries required!

## 📁 Project Structure

```
/workspace/
├── index.html          # Main HTML entry point
├── style.css           # All game styles
├── main.js             # Application entry point & game loop
├── data/
│   └── cards.js        # Card definitions (26 unique cards)
├── game/
│   ├── state.js        # Game state management
│   └── engine.js       # Core game logic & turn management
├── ui/
│   └── renderer.js     # DOM rendering & UI updates
└── ai/
    └── opponent.js     # Rule-based AI opponent
```

## 🎮 How to Play

### Quick Start
1. **Open the game**: Simply open `index.html` in any modern web browser
   - Or run a local server: `python3 -m http.server 8080` and visit `http://localhost:8080`

2. **Game Objective**: Reduce your opponent's HP from 20 to 0 before they do the same!

3. **Basic Gameplay**:
   - Each turn you gain 1 additional max mana (starts at 1, caps at 10)
   - Mana refreshes fully each turn
   - Draw 1 card per turn
   - Click cards to play them (costs mana)
   - Click "End Turn" when done

### Card Types

| Type | Color | Description |
|------|-------|-------------|
| 🔮 Spell | Purple | Direct damage, healing, or utility effects |
| ⚔️ Monster | Red | Creatures with attack/defense stats |
| 🛡️ Item | Gold | Equipment that provides buffs |
| ✨ Ability | Green | Special powers and combat techniques |

### Card Effects

- **Damage**: Deal direct damage to opponent
- **Heal**: Restore your HP
- **Draw**: Draw additional cards
- **Mana**: Gain extra mana this turn
- **Buff**: Temporarily increase attack or defense

## 🎯 Features

### Core Mechanics
- ✅ Turn-based 1v1 gameplay
- ✅ 20 HP per player
- ✅ Mana system (1-10, refreshes each turn)
- ✅ 20-card deck per player
- ✅ Maximum 7 cards in hand
- ✅ Draw 1 card per turn

### AI Opponent
- ✅ Smart card evaluation system
- ✅ Prioritizes lethal damage
- ✅ Heals when low on HP
- ✅ Manages mana efficiently
- ✅ Unpredictable decision-making (random factor)

### UI/UX
- ✅ Responsive design (mobile-friendly)
- ✅ Hover tooltips on cards
- ✅ Animated turn indicator
- ✅ Battle log with action history
- ✅ HP/Mana bars with smooth transitions
- ✅ Win/Loss modal with restart option
- ✅ Visual feedback for playable/unplayable cards

## 🃏 Sample Cards

### Spells
- **Arcane Bolt** (1 mana): Deal 2 damage
- **Fireball** (3 mana): Deal 5 damage
- **Healing Light** (2 mana): Restore 4 HP
- **Arcane Intellect** (2 mana): Draw 2 cards

### Monsters
- **Goblin Raider** (1 mana): 2 ATK / 1 DEF
- **Orc Warrior** (3 mana): 4 ATK / 3 DEF
- **Dragon Whelp** (4 mana): 5 ATK / 4 DEF
- **Dark Knight** (5 mana): 6 ATK / 5 DEF

### Items
- **Health Potion** (1 mana): Restore 3 HP
- **Steel Sword** (3 mana): +3 Attack for 3 turns
- **Chain Mail** (2 mana): +2 Defense for 3 turns

### Abilities
- **Power Strike** (2 mana): Deal 4 damage
- **Battle Cry** (2 mana): +2 Attack for 2 turns
- **Meditate** (0 mana): Draw 1 card (FREE!)

## 🛠️ Technical Details

### Architecture
- **Module Pattern**: ES6 modules for clean separation of concerns
- **State Management**: Centralized game state with pure functions
- **Event-Driven**: Callback-based communication between components
- **No Global Pollution**: All code wrapped in modules/classes

### Key Files Explained

#### `data/cards.js`
Contains all 26 card definitions as plain JavaScript objects. Easy to extend with new cards!

#### `game/state.js`
Manages player data, turn logic, buff systems, and game status. Exports pure functions for state manipulation.

#### `game/engine.js`
The GameEngine class orchestrates gameplay: validates moves, processes turns, handles AI integration, and manages game over conditions.

#### `ai/opponent.js`
Rule-based AI with scoring system that evaluates:
- Lethal potential
- HP thresholds
- Mana efficiency
- Card value ratios
- Random variation for unpredictability

#### `ui/renderer.js`
Handles all DOM operations efficiently. Uses event delegation and minimal re-rendering.

#### `main.js`
Bootstraps the application, wires up event handlers, and manages the game loop.

## 🚀 Extending the Game

### Adding New Cards
Edit `data/cards.js`:
```javascript
{
    id: 'your-card-id',
    name: 'Your Card Name',
    type: 'spell', // spell, monster, item, ability
    cost: 2,
    effect: { type: 'damage', value: 4 },
    description: 'Deal 4 damage to opponent'
}
```

### Adding New Effect Types
1. Add effect handler in `game/state.js` → `applyCardEffect()`
2. Update AI evaluation in `ai/opponent.js` → `evaluateCard()`

### Balancing Tips
- Damage spells: ~1.5-2 HP per mana
- Healing: ~2 HP per mana
- Card draw: ~1 card per 2 mana
- Buffs: ~1 stat point per mana per turn

### Future Enhancements Ideas
- **Multiplayer**: Add WebSocket backend for real-time PvP
- **Deck Builder**: Let players customize their 20-card deck
- **More Card Types**: Enchantments, traps, artifacts
- **Board State**: Implement monster combat mechanics
- **Achievements**: Track wins, combos, special plays
- **Sound Effects**: Add audio for actions and events
- **Animations**: Card play animations, damage effects
- **Difficulty Levels**: Adjust AI aggression parameters

## ⚖️ D&D Fan Content Guidelines

This game follows fan content guidelines:
- ❌ No official WotC trademarks or logos
- ❌ No official D&D names (Beholder, Mind Flayer, etc.)
- ❌ No copied mechanics verbatim
- ✅ Generic fantasy names (Goblin, Orc, Dragon)
- ✅ Original card effects inspired by but not copying D&D
- ✅ Clearly labeled as fan creation

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires ES6 module support.

## 🐛 Troubleshooting

**Game doesn't load?**
- Make sure you're using a local server (not file:// protocol)
- Check browser console for errors (F12)
- Clear browser cache

**AI not playing?**
- Check that all JS files loaded correctly
- Verify no CORS errors in console

**Cards not clickable?**
- Ensure it's your turn (check turn indicator)
- Verify you have enough mana (blue bar)

## 📄 License

This is a fan-made project for educational purposes. All card names and mechanics are original creations inspired by generic fantasy tropes.

---

**Enjoy battling in Mystic Realms! 🎲⚔️🐉**
