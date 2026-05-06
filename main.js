/**
 * Main Entry Point
 * Initializes and runs the Mystic Realms card game
 */

import { createGameState, PLAYER_TYPES } from './game/state.js';
import { createGameEngine } from './game/engine.js';
import { createUIRenderer } from './ui/renderer.js';
import { AIOpponent } from './ai/opponent.js';

/**
 * Main game application class
 */
class MysticRealms {
    constructor() {
        this.state = null;
        this.engine = null;
        this.renderer = null;
        this.ai = null;
        this.isProcessing = false;
    }

    /**
     * Initialize the game
     */
    init() {
        console.log('🏰 Initializing Mystic Realms...');
        
        // Create instances
        this.state = createGameState();
        this.engine = createGameEngine(this.state);
        this.renderer = createUIRenderer().init();
        this.ai = new AIOpponent();
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Set up engine callbacks
        this.setupEngineCallbacks();
        
        // Start the game
        console.log('🎴 Starting game...');
        this.engine.init();
        
        console.log('✅ Game initialized successfully!');
        console.log('📊 Initial state:', JSON.stringify({
            status: this.state.status,
            currentPlayer: this.state.currentPlayer,
            playerHandSize: this.state.players.human?.hand?.length || 0,
            aiHandSize: this.state.players.ai?.hand?.length || 0
        }, null, 2));
    }

    /**
     * Set up UI event handlers
     */
    setupEventHandlers() {
        // Card click handler
        this.renderer.onCardClick = (cardIndex) => {
            this.handleCardClick(cardIndex);
        };

        // End turn button
        this.renderer.onEndTurnClick = () => {
            this.handleEndTurn();
        };

        // Restart button
        this.renderer.onRestartClick = () => {
            this.handleRestart();
        };
    }

    /**
     * Set up engine event callbacks
     */
    setupEngineCallbacks() {
        // State changed callback
        this.engine.on('onStateChanged', (state) => {
            this.renderer.render(state);
        });

        // Log update callback
        this.engine.on('onLogUpdate', (history) => {
            this.renderer.renderBattleLog(history);
        });

        // Game over callback
        this.engine.on('onGameOver', (winner) => {
            this.handleGameOver(winner);
        });
    }

    /**
     * Handle card click from UI
     */
    async handleCardClick(cardIndex) {
        if (this.isProcessing) return;
        if (!this.engine.isHumanTurn()) return;
        if (!this.engine.isGameActive()) return;

        this.isProcessing = true;
        
        try {
            const result = this.engine.playCard(cardIndex);
            
            if (!result.success) {
                console.warn('Cannot play card:', result.error);
            }
            
            // If AI's turn now, let it process
            if (this.engine.isGameActive() && !this.engine.isHumanTurn()) {
                await this.engine.processAITurn(this.ai);
            }
        } catch (error) {
            console.error('Error playing card:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Handle end turn button click
     */
    async handleEndTurn() {
        if (this.isProcessing) return;
        if (!this.engine.isHumanTurn()) return;

        this.isProcessing = true;
        
        try {
            const success = this.engine.endTurn();
            
            if (success && this.engine.isGameActive()) {
                // AI will automatically process its turn via state change
                await this.engine.processAITurn(this.ai);
            }
        } catch (error) {
            console.error('Error ending turn:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Handle game over
     */
    handleGameOver(winner) {
        this.renderer.showGameOver(winner);
    }

    /**
     * Handle restart button click
     */
    handleRestart() {
        this.renderer.hideGameOver();
        this.engine.init();
    }
}

/**
 * Start the game when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    const game = new MysticRealms();
    game.init();
    
    // Expose game instance for debugging (optional)
    window.mysticRealms = game;
});

// Export for potential module usage
export { MysticRealms };
