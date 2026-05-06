/**
 * Game State Management
 * Handles all game state, player data, and turn management
 */

import { createDeck } from '../data/cards.js';

export const PLAYER_TYPES = {
    HUMAN: 'human',
    AI: 'ai'
};

export const GAME_STATUS = {
    NOT_STARTED: 'not_started',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

/**
 * Create a new player object
 */
export function createPlayer(type, name) {
    return {
        type,
        name,
        hp: 20,
        maxHp: 20,
        mana: 0,
        maxMana: 1,
        deck: createDeck(20),
        hand: [],
        buffs: {
            attack: 0,
            defense: 0
        },
        buffTurns: {
            attack: 0,
            defense: 0
        }
    };
}

/**
 * Initialize game state
 */
export function createGameState() {
    return {
        status: GAME_STATUS.NOT_STARTED,
        currentPlayer: PLAYER_TYPES.HUMAN,
        turnNumber: 1,
        players: {
            [PLAYER_TYPES.HUMAN]: createPlayer(PLAYER_TYPES.HUMAN, 'Hero'),
            [PLAYER_TYPES.AI]: createPlayer(PLAYER_TYPES.AI, 'Opponent')
        },
        history: []
    };
}

/**
 * Start a new game
 */
export function startGame(state) {
    state.status = GAME_STATUS.PLAYING;
    state.currentPlayer = PLAYER_TYPES.HUMAN;
    state.turnNumber = 1;
    
    // Reset players
    state.players[PLAYER_TYPES.HUMAN] = createPlayer(PLAYER_TYPES.HUMAN, 'Hero');
    state.players[PLAYER_TYPES.AI] = createPlayer(PLAYER_TYPES.AI, 'Opponent');
    
    // Draw initial hands (4 cards each)
    for (let i = 0; i < 4; i++) {
        drawCard(state, PLAYER_TYPES.HUMAN);
        drawCard(state, PLAYER_TYPES.AI);
    }
    
    return state;
}

/**
 * Draw a card for a player
 */
export function drawCard(state, playerType) {
    const player = state.players[playerType];
    
    if (player.deck.length === 0) {
        logAction(state, `${player.name} has no cards left to draw!`);
        return false;
    }
    
    if (player.hand.length >= 7) {
        logAction(state, `${player.name}'s hand is full!`);
        return false;
    }
    
    const card = player.deck.pop();
    player.hand.push(card);
    
    return true;
}

/**
 * Get current player object
 */
export function getCurrentPlayer(state) {
    return state.players[state.currentPlayer];
}

/**
 * Get opponent player object
 */
export function getOpponent(state) {
    const opponentType = state.currentPlayer === PLAYER_TYPES.HUMAN 
        ? PLAYER_TYPES.AI 
        : PLAYER_TYPES.HUMAN;
    return state.players[opponentType];
}

/**
 * Check if a card can be played
 */
export function canPlayCard(state, playerType, card) {
    const player = state.players[playerType];
    return player.mana >= card.cost && player.hand.includes(card);
}

/**
 * Play a card
 */
export function playCard(state, playerType, cardIndex) {
    const player = state.players[playerType];
    const opponent = getOpponentForPlayer(state, playerType);
    
    if (cardIndex < 0 || cardIndex >= player.hand.length) {
        return { success: false, error: 'Invalid card index' };
    }
    
    const card = player.hand[cardIndex];
    
    if (!canPlayCard(state, playerType, card)) {
        return { success: false, error: 'Not enough mana' };
    }
    
    // Remove card from hand
    player.hand.splice(cardIndex, 1);
    
    // Pay mana cost
    player.mana -= card.cost;
    
    // Apply card effects
    applyCardEffect(state, playerType, card);
    
    logAction(state, `${player.name} played ${card.name}`);
    
    return { success: true, card };
}

/**
 * Get opponent for a given player type
 */
function getOpponentForPlayer(state, playerType) {
    return state.players[playerType === PLAYER_TYPES.HUMAN ? PLAYER_TYPES.AI : PLAYER_TYPES.HUMAN];
}

/**
 * Apply card effect
 */
export function applyCardEffect(state, playerType, card) {
    const player = state.players[playerType];
    const opponent = getOpponentForPlayer(state, playerType);
    
    if (!card.effect) {
        // Monster cards don't have immediate effects when played
        // They would need a board state to exist on
        logAction(state, `${player.name} summoned ${card.name} (${card.attack}/${card.defense})`);
        return;
    }
    
    const effect = card.effect;
    
    switch (effect.type) {
        case 'damage':
            opponent.hp = Math.max(0, opponent.hp - effect.value);
            logAction(state, `${player.name} dealt ${effect.value} damage to ${opponent.name}!`);
            break;
            
        case 'heal':
            const oldHp = player.hp;
            player.hp = Math.min(player.maxHp + getBuffValue(player, 'defense'), player.hp + effect.value);
            const healed = player.hp - oldHp;
            logAction(state, `${player.name} healed for ${healed} HP!`);
            break;
            
        case 'draw':
            for (let i = 0; i < effect.value; i++) {
                drawCard(state, playerType);
            }
            logAction(state, `${player.name} drew ${effect.value} card(s)!`);
            break;
            
        case 'mana':
            player.mana = Math.min(player.maxMana + 5, player.mana + effect.value);
            logAction(state, `${player.name} gained ${effect.value} mana!`);
            break;
            
        case 'buff':
            player.buffs[effect.stat] += effect.value;
            player.buffTurns[effect.stat] = effect.duration;
            logAction(state, `${player.name} gained +${effect.value} ${effect.stat} for ${effect.duration} turns!`);
            break;
    }
}

/**
 * Get current buff value for a stat
 */
export function getBuffValue(player, stat) {
    return player.buffs[stat] || 0;
}

/**
 * End buffs at end of turn
 */
export function endBuffs(state, playerType) {
    const player = state.players[playerType];
    
    ['attack', 'defense'].forEach(stat => {
        if (player.buffTurns[stat] > 0) {
            player.buffTurns[stat]--;
            if (player.buffTurns[stat] === 0) {
                player.buffs[stat] = 0;
            }
        }
    });
}

/**
 * Switch to next turn
 */
export function nextTurn(state) {
    // End buffs for current player
    endBuffs(state, state.currentPlayer);
    
    // Switch player
    state.currentPlayer = state.currentPlayer === PLAYER_TYPES.HUMAN 
        ? PLAYER_TYPES.AI 
        : PLAYER_TYPES.HUMAN;
    
    // Increment turn number if it's human's turn again
    if (state.currentPlayer === PLAYER_TYPES.HUMAN) {
        state.turnNumber++;
    }
    
    // Setup new turn for current player
    const player = getCurrentPlayer(state);
    
    // Refresh mana (max increases each turn, capped at 10)
    player.maxMana = Math.min(10, player.maxMana + 1);
    player.mana = player.maxMana;
    
    // Draw a card
    drawCard(state, state.currentPlayer);
    
    return state;
}

/**
 * Log an action to history
 */
export function logAction(state, message) {
    const timestamp = `Turn ${state.turnNumber}`;
    state.history.push({ timestamp, message, player: state.currentPlayer });
}

/**
 * Check for game over
 */
export function checkGameOver(state) {
    const human = state.players[PLAYER_TYPES.HUMAN];
    const ai = state.players[PLAYER_TYPES.AI];
    
    if (human.hp <= 0) {
        state.status = GAME_STATUS.GAME_OVER;
        return { gameOver: true, winner: PLAYER_TYPES.AI };
    }
    
    if (ai.hp <= 0) {
        state.status = GAME_STATUS.GAME_OVER;
        return { gameOver: true, winner: PLAYER_TYPES.HUMAN };
    }
    
    return { gameOver: false };
}

/**
 * Get effective attack/defense including buffs
 */
export function getEffectiveStat(player, stat) {
    const baseValue = player.buffs[stat] || 0;
    return baseValue;
}
