/**
 * Card Data - D&D inspired fantasy card definitions
 * All names are generic/fan-safe to avoid copyright issues
 */

export const CARDS = [
    // SPELLS - Direct damage and effects
    {
        id: 'arcane-bolt',
        name: 'Arcane Bolt',
        type: 'spell',
        cost: 1,
        effect: { type: 'damage', value: 2 },
        description: 'Deal 2 damage to opponent'
    },
    {
        id: 'fireball',
        name: 'Fireball',
        type: 'spell',
        cost: 3,
        effect: { type: 'damage', value: 5 },
        description: 'Deal 5 damage to opponent'
    },
    {
        id: 'lightning-strike',
        name: 'Lightning Strike',
        type: 'spell',
        cost: 2,
        effect: { type: 'damage', value: 3 },
        description: 'Deal 3 damage to opponent'
    },
    {
        id: 'frost-blast',
        name: 'Frost Blast',
        type: 'spell',
        cost: 2,
        effect: { type: 'damage', value: 3 },
        description: 'Deal 3 damage to opponent'
    },
    {
        id: 'shadow-bolt',
        name: 'Shadow Bolt',
        type: 'spell',
        cost: 1,
        effect: { type: 'damage', value: 2 },
        description: 'Deal 2 damage to opponent'
    },
    
    // HEALING SPELLS
    {
        id: 'healing-light',
        name: 'Healing Light',
        type: 'spell',
        cost: 2,
        effect: { type: 'heal', value: 4 },
        description: 'Restore 4 HP'
    },
    {
        id: 'greater-heal',
        name: 'Greater Heal',
        type: 'spell',
        cost: 4,
        effect: { type: 'heal', value: 7 },
        description: 'Restore 7 HP'
    },
    {
        id: 'minor-heal',
        name: 'Minor Heal',
        type: 'spell',
        cost: 1,
        effect: { type: 'heal', value: 2 },
        description: 'Restore 2 HP'
    },
    
    // UTILITY SPELLS
    {
        id: 'arcane-intellect',
        name: 'Arcane Intellect',
        type: 'spell',
        cost: 2,
        effect: { type: 'draw', value: 2 },
        description: 'Draw 2 cards'
    },
    {
        id: 'mana-crystal',
        name: 'Mana Crystal',
        type: 'spell',
        cost: 1,
        effect: { type: 'mana', value: 2 },
        description: 'Gain 2 mana this turn'
    },
    {
        id: 'shield-barrier',
        name: 'Shield Barrier',
        type: 'spell',
        cost: 2,
        effect: { type: 'buff', stat: 'defense', value: 3, duration: 2 },
        description: 'Gain +3 defense for 2 turns'
    },
    
    // MONSTERS - Creatures with attack and defense
    {
        id: 'goblin-raider',
        name: 'Goblin Raider',
        type: 'monster',
        cost: 1,
        attack: 2,
        defense: 1,
        description: 'A swift goblin warrior'
    },
    {
        id: 'orc-warrior',
        name: 'Orc Warrior',
        type: 'monster',
        cost: 3,
        attack: 4,
        defense: 3,
        description: 'A fierce orc fighter'
    },
    {
        id: 'skeleton-soldier',
        name: 'Skeleton Soldier',
        type: 'monster',
        cost: 2,
        attack: 3,
        defense: 2,
        description: 'An undead warrior'
    },
    {
        id: 'dark-knight',
        name: 'Dark Knight',
        type: 'monster',
        cost: 5,
        attack: 6,
        defense: 5,
        description: 'A powerful armored knight'
    },
    {
        id: 'wolf-pup',
        name: 'Wolf Pup',
        type: 'monster',
        cost: 1,
        attack: 2,
        defense: 1,
        description: 'A loyal canine companion'
    },
    {
        id: 'dragon-whelp',
        name: 'Dragon Whelp',
        type: 'monster',
        cost: 4,
        attack: 5,
        defense: 4,
        description: 'A young dragon'
    },
    {
        id: 'troll-berserker',
        name: 'Troll Berserker',
        type: 'monster',
        cost: 4,
        attack: 5,
        defense: 3,
        description: 'A raging troll warrior'
    },
    {
        id: 'specter',
        name: 'Specter',
        type: 'monster',
        cost: 3,
        attack: 4,
        defense: 2,
        description: 'A ghostly apparition'
    },
    
    // ITEMS - Equipment and artifacts
    {
        id: 'chain-mail',
        name: 'Chain Mail',
        type: 'item',
        cost: 2,
        effect: { type: 'buff', stat: 'defense', value: 2, duration: 3 },
        description: '+2 defense for 3 turns'
    },
    {
        id: 'steel-sword',
        name: 'Steel Sword',
        type: 'item',
        cost: 3,
        effect: { type: 'buff', stat: 'attack', value: 3, duration: 3 },
        description: '+3 attack for 3 turns'
    },
    {
        id: 'magic-wand',
        name: 'Magic Wand',
        type: 'item',
        cost: 2,
        effect: { type: 'damage', value: 3 },
        description: 'Deal 3 damage'
    },
    {
        id: 'health-potion',
        name: 'Health Potion',
        type: 'item',
        cost: 1,
        effect: { type: 'heal', value: 3 },
        description: 'Restore 3 HP'
    },
    {
        id: 'mana-potion',
        name: 'Mana Potion',
        type: 'item',
        cost: 1,
        effect: { type: 'mana', value: 3 },
        description: 'Gain 3 mana'
    },
    {
        id: 'iron-shield',
        name: 'Iron Shield',
        type: 'item',
        cost: 2,
        effect: { type: 'buff', stat: 'defense', value: 3, duration: 2 },
        description: '+3 defense for 2 turns'
    },
    
    // ABILITIES - Special powers
    {
        id: 'battle-cry',
        name: 'Battle Cry',
        type: 'ability',
        cost: 2,
        effect: { type: 'buff', stat: 'attack', value: 2, duration: 2 },
        description: '+2 attack for 2 turns'
    },
    {
        id: 'defensive-stance',
        name: 'Defensive Stance',
        type: 'ability',
        cost: 1,
        effect: { type: 'buff', stat: 'defense', value: 2, duration: 2 },
        description: '+2 defense for 2 turns'
    },
    {
        id: 'power-strike',
        name: 'Power Strike',
        type: 'ability',
        cost: 2,
        effect: { type: 'damage', value: 4 },
        description: 'Deal 4 damage'
    },
    {
        id: 'quick-draw',
        name: 'Quick Draw',
        type: 'ability',
        cost: 1,
        effect: { type: 'draw', value: 1 },
        description: 'Draw 1 card'
    },
    {
        id: 'berserker-rage',
        name: 'Berserker Rage',
        type: 'ability',
        cost: 3,
        effect: { type: 'buff', stat: 'attack', value: 4, duration: 1 },
        description: '+4 attack for 1 turn'
    },
    {
        id: 'meditate',
        name: 'Meditate',
        type: 'ability',
        cost: 0,
        effect: { type: 'draw', value: 1 },
        description: 'Draw 1 card (Free!)'
    }
];

/**
 * Create a deep copy of a card
 */
export function createCard(cardId) {
    const template = CARDS.find(c => c.id === cardId);
    if (!template) {
        console.error(`Card not found: ${cardId}`);
        return null;
    }
    return JSON.parse(JSON.stringify(template));
}

/**
 * Get all card IDs
 */
export function getAllCardIds() {
    return CARDS.map(c => c.id);
}

/**
 * Get cards by type
 */
export function getCardsByType(type) {
    return CARDS.filter(c => c.type === type);
}

/**
 * Create a shuffled deck from all cards
 */
export function createDeck(count = 20) {
    const allIds = getAllCardIds();
    const deck = [];
    
    for (let i = 0; i < count; i++) {
        const randomId = allIds[Math.floor(Math.random() * allIds.length)];
        deck.push(createCard(randomId));
    }
    
    return shuffleArray(deck);
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
