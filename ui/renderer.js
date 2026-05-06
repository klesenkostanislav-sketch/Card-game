/**
 * UI Renderer
 * Handles all DOM updates and visual rendering
 */

import { PLAYER_TYPES, GAME_STATUS } from '../game/state.js';

export class UIRenderer {
    constructor() {
        this.elements = {};
        this.tooltipElement = null;
    }

    /**
     * Initialize DOM element references
     */
    init() {
        // Player areas
        this.elements.playerHand = document.getElementById('player-hand');
        this.elements.opponentHand = document.getElementById('opponent-hand');
        
        if (!this.elements.playerHand) {
            console.error('❌ player-hand element not found in DOM!');
        }
        if (!this.elements.opponentHand) {
            console.error('❌ opponent-hand element not found in DOM!');
        }
        
        // Stats
        this.elements.playerHp = document.getElementById('player-hp');
        this.elements.playerHpBar = document.getElementById('player-hp-bar');
        this.elements.playerMana = document.getElementById('player-mana');
        this.elements.playerManaBar = document.getElementById('player-mana-bar');
        this.elements.playerDeckCount = document.getElementById('player-deck-count');
        this.elements.playerHandCount = document.getElementById('player-hand-count');
        
        this.elements.opponentHp = document.getElementById('opponent-hp');
        this.elements.opponentHpBar = document.getElementById('opponent-hp-bar');
        this.elements.opponentMana = document.getElementById('opponent-mana');
        this.elements.opponentManaBar = document.getElementById('opponent-mana-bar');
        this.elements.opponentDeckCount = document.getElementById('opponent-deck-count');
        this.elements.opponentHandCount = document.getElementById('opponent-hand-count');
        
        // Controls
        this.elements.turnText = document.getElementById('turn-text');
        this.elements.turnIndicator = document.getElementById('turn-indicator');
        this.elements.endTurnBtn = document.getElementById('end-turn-btn');
        this.elements.battleLog = document.getElementById('battle-log');
        
        // Modal
        this.elements.gameOverModal = document.getElementById('game-over-modal');
        this.elements.gameOverTitle = document.getElementById('game-over-title');
        this.elements.gameOverMessage = document.getElementById('game-over-message');
        this.elements.restartBtn = document.getElementById('restart-btn');
        
        // Tooltip
        this.tooltipElement = document.getElementById('tooltip');
        
        console.log('✅ UI Renderer initialized. Elements:', Object.keys(this.elements).length);
        
        return this;
    }

    /**
     * Render complete game state
     */
    render(state) {
        if (!state || !state.players) {
            console.error('Cannot render: invalid state');
            return;
        }
        
        this.renderPlayerStats(state, PLAYER_TYPES.HUMAN);
        this.renderPlayerStats(state, PLAYER_TYPES.AI);
        this.renderHand(state, PLAYER_TYPES.HUMAN);
        this.renderOpponentHand(state);
        this.renderTurnIndicator(state);
        this.renderControls(state);
        this.renderBattleLog(state.history);
        
        console.log('✅ State rendered. Player hand size:', state.players[PLAYER_TYPES.HUMAN]?.hand?.length || 0);
    }

    /**
     * Render player statistics
     */
    renderPlayerStats(state, playerType) {
        const player = state.players[playerType];
        const isHuman = playerType === PLAYER_TYPES.HUMAN;
        const prefix = isHuman ? 'player' : 'opponent';
        
        // HP
        const hpPercent = (player.hp / player.maxHp) * 100;
        this.elements[`${prefix}Hp`].textContent = `${player.hp}/${player.maxHp}`;
        this.elements[`${prefix}HpBar`].style.width = `${hpPercent}%`;
        
        // Mana
        const manaPercent = (player.mana / player.maxMana) * 100;
        this.elements[`${prefix}Mana`].textContent = `${player.mana}/${player.maxMana}`;
        this.elements[`${prefix}ManaBar`].style.width = `${manaPercent}%`;
        
        // Deck and hand counts
        if (isHuman) {
            this.elements.playerDeckCount.textContent = player.deck.length;
            this.elements.playerHandCount.textContent = player.hand.length;
        } else {
            this.elements.opponentDeckCount.textContent = player.deck.length;
            this.elements.opponentHandCount.textContent = player.hand.length;
        }
    }

    /**
     * Render human player's hand
     */
    renderHand(state, playerType) {
        const player = state.players[playerType];
        const container = this.elements.playerHand;
        
        if (!container) {
            console.error('Player hand container not found!');
            return;
        }
        
        container.innerHTML = '';
        
        if (!player || !player.hand) {
            console.warn('Player or player.hand is undefined');
            return;
        }
        
        player.hand.forEach((card, index) => {
            const cardEl = this.createCardElement(card, index, true);
            
            // Check if playable
            if (player.mana < card.cost || state.currentPlayer !== PLAYER_TYPES.HUMAN) {
                cardEl.classList.add('unplayable');
            } else {
                // Add visual feedback for playable cards
                cardEl.classList.add('playable');
            }
            
            container.appendChild(cardEl);
        });
    }

    /**
     * Render opponent's hand (cards face down)
     */
    renderOpponentHand(state) {
        const player = state.players[PLAYER_TYPES.AI];
        const container = this.elements.opponentHand;
        
        container.innerHTML = '';
        
        player.hand.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.index = index;
            container.appendChild(cardEl);
        });
    }

    /**
     * Create card DOM element
     */
    createCardElement(card, index, isInteractive) {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.type}`;
        cardEl.dataset.index = index;
        cardEl.dataset.cardId = card.id;
        
        cardEl.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type">${card.type}</div>
            <div class="card-content">
                <p>${card.description}</p>
                ${card.attack || card.defense ? `
                    <div class="card-stats">
                        ${card.attack ? `<span class="stat attack">⚔️ ${card.attack}</span>` : ''}
                        ${card.defense ? `<span class="stat defense">🛡️ ${card.defense}</span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
        if (isInteractive) {
            // Click to play
            cardEl.addEventListener('click', () => {
                if (!cardEl.classList.contains('unplayable') && this._onCardClick) {
                    this._onCardClick(index);
                }
            });
            
            // Hover tooltip
            cardEl.addEventListener('mouseenter', (e) => {
                this.showTooltip(card, e);
            });
            
            cardEl.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            cardEl.addEventListener('mousemove', (e) => {
                this.moveTooltip(e);
            });
        }
        
        return cardEl;
    }

    /**
     * Render turn indicator
     */
    renderTurnIndicator(state) {
        const isHumanTurn = state.currentPlayer === PLAYER_TYPES.HUMAN;
        this.elements.turnText.textContent = isHumanTurn ? 'Your Turn' : "Opponent's Turn";
        
        if (isHumanTurn) {
            this.elements.turnIndicator.classList.remove('opponent-turn');
        } else {
            this.elements.turnIndicator.classList.add('opponent-turn');
        }
    }

    /**
     * Render controls state
     */
    renderControls(state) {
        const isHumanTurn = state.currentPlayer === PLAYER_TYPES.HUMAN;
        const isGameActive = state.status === GAME_STATUS.PLAYING;
        
        this.elements.endTurnBtn.disabled = !isHumanTurn || !isGameActive;
    }

    /**
     * Render battle log
     */
    renderBattleLog(history) {
        // Only show last 20 entries
        const recentHistory = history.slice(-20);
        
        this.elements.battleLog.innerHTML = recentHistory.map(entry => `
            <div class="log-entry">
                <strong>[${entry.timestamp}]</strong> ${entry.message}
            </div>
        `).join('');
        
        // Auto-scroll to bottom
        this.elements.battleLog.scrollTop = this.elements.battleLog.scrollHeight;
    }

    /**
     * Show tooltip for card
     */
    showTooltip(card, event) {
        this.tooltipElement.innerHTML = `
            <h3>${card.name}</h3>
            <p><span class="cost">Cost: ${card.cost} mana</span></p>
            <p>${card.description}</p>
            ${card.attack ? `<p>Attack: ${card.attack}</p>` : ''}
            ${card.defense && !card.effect ? `<p>Defense: ${card.defense}</p>` : ''}
            ${card.effect ? `<p>Type: ${card.effect.type}</p>` : ''}
        `;
        
        this.tooltipElement.classList.add('visible');
        this.moveTooltip(event);
    }

    /**
     * Move tooltip with mouse
     */
    moveTooltip(event) {
        const x = event.clientX + 15;
        const y = event.clientY + 15;
        
        // Prevent tooltip from going off screen
        const rect = this.tooltipElement.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 20;
        const maxY = window.innerHeight - rect.height - 20;
        
        this.tooltipElement.style.left = `${Math.min(x, maxX)}px`;
        this.tooltipElement.style.top = `${Math.min(y, maxY)}px`;
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltipElement.classList.remove('visible');
    }

    /**
     * Show game over modal
     */
    showGameOver(winner) {
        const isWin = winner === PLAYER_TYPES.HUMAN;
        this.elements.gameOverTitle.textContent = isWin ? '🎉 Victory!' : '💀 Defeat';
        this.elements.gameOverMessage.textContent = isWin 
            ? 'Congratulations! You have defeated your opponent!'
            : 'The battle is lost. Try again!';
        
        this.elements.gameOverModal.classList.remove('hidden');
    }

    /**
     * Hide game over modal
     */
    hideGameOver() {
        this.elements.gameOverModal.classList.add('hidden');
    }

    /**
     * Set card click handler
     */
    set onCardClick(handler) {
        this._onCardClick = handler;
    }

    get onCardClick() {
        return this._onCardClick;
    }

    /**
     * Set end turn click handler
     */
    set onEndTurnClick(handler) {
        this.elements.endTurnBtn.addEventListener('click', handler);
    }

    /**
     * Set restart click handler
     */
    set onRestartClick(handler) {
        this.elements.restartBtn.addEventListener('click', handler);
    }
}

/**
 * Create UI renderer instance
 */
export function createUIRenderer() {
    return new UIRenderer();
}
