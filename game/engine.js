/**
 * Game Engine
 * Core game logic and turn management
 */

import { 
    PLAYER_TYPES, 
    GAME_STATUS,
    startGame, 
    playCard as playCardAction,
    nextTurn as nextTurnAction,
    checkGameOver,
    getCurrentPlayer,
    getOpponent
} from './state.js';

/**
 * Main game engine class
 */
export class GameEngine {
    constructor(state) {
        this.state = state;
        this.callbacks = {
            onStateChanged: null,
            onGameOver: null,
            onLogUpdate: null
        };
    }

    /**
     * Initialize the game
     */
    init() {
        startGame(this.state);
        this.notifyStateChanged();
        return this.state;
    }

    /**
     * Register callbacks
     */
    on(event, callback) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
        }
    }

    /**
     * Notify listeners of state change
     */
    notifyStateChanged() {
        if (this.callbacks.onStateChanged) {
            this.callbacks.onStateChanged(this.state);
        }
    }

    /**
     * Notify log update
     */
    notifyLogUpdate() {
        if (this.callbacks.onLogUpdate) {
            this.callbacks.onLogUpdate(this.state.history);
        }
    }

    /**
     * Play a card for the current player
     */
    playCard(cardIndex) {
        if (this.state.status !== GAME_STATUS.PLAYING) {
            return { success: false, error: 'Game not in progress' };
        }

        if (this.state.currentPlayer !== PLAYER_TYPES.HUMAN) {
            return { success: false, error: 'Not your turn' };
        }

        const result = playCardAction(this.state, PLAYER_TYPES.HUMAN, cardIndex);
        
        if (result.success) {
            this.notifyStateChanged();
            this.notifyLogUpdate();
            
            // Check for game over
            const gameOverResult = checkGameOver(this.state);
            if (gameOverResult.gameOver) {
                this.handleGameOver(gameOverResult.winner);
            }
        }

        return result;
    }

    /**
     * End current turn
     */
    endTurn() {
        if (this.state.status !== GAME_STATUS.PLAYING) {
            return false;
        }

        if (this.state.currentPlayer !== PLAYER_TYPES.HUMAN) {
            return false;
        }

        // Switch to opponent's turn
        nextTurnAction(this.state);
        this.notifyStateChanged();
        this.notifyLogUpdate();

        return true;
    }

    /**
     * Process AI turn
     */
    async processAITurn(aiModule) {
        if (this.state.status !== GAME_STATUS.PLAYING) {
            return;
        }

        if (this.state.currentPlayer !== PLAYER_TYPES.AI) {
            return;
        }

        // Small delay for better UX
        await this.delay(500);

        const ai = aiModule || new (await import('../ai/opponent.js')).AIOpponent();
        const cardsToPlay = ai.decideCardsToPlay(this.state);

        for (const cardIndex of cardsToPlay) {
            if (this.state.status !== GAME_STATUS.PLAYING) {
                break;
            }

            playCardAction(this.state, PLAYER_TYPES.AI, cardIndex);
            this.notifyStateChanged();
            this.notifyLogUpdate();

            // Check for game over after each card
            const gameOverResult = checkGameOver(this.state);
            if (gameOverResult.gameOver) {
                this.handleGameOver(gameOverResult.winner);
                return;
            }

            await this.delay(600);
        }

        // End AI turn
        if (this.state.status === GAME_STATUS.PLAYING) {
            nextTurnAction(this.state);
            this.notifyStateChanged();
            this.notifyLogUpdate();
        }
    }

    /**
     * Handle game over
     */
    handleGameOver(winner) {
        this.state.status = GAME_STATUS.GAME_OVER;
        this.notifyStateChanged();
        
        if (this.callbacks.onGameOver) {
            const winnerName = winner === PLAYER_TYPES.HUMAN ? 'You' : 'Opponent';
            this.callbacks.onGameOver(winner);
        }
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get current game state
     */
    getState() {
        return this.state;
    }

    /**
     * Check if it's human's turn
     */
    isHumanTurn() {
        return this.state.currentPlayer === PLAYER_TYPES.HUMAN;
    }

    /**
     * Check if game is active
     */
    isGameActive() {
        return this.state.status === GAME_STATUS.PLAYING;
    }
}

/**
 * Create a new game engine instance
 */
export function createGameEngine(state) {
    return new GameEngine(state);
}
