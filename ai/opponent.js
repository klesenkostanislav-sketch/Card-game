/**
 * AI Opponent
 * Rule-based AI for card playing decisions
 */

import { PLAYER_TYPES, canPlayCard } from './state.js';

export class AIOpponent {
    constructor() {
        this.aggression = 0.7; // Tendency to play damage cards
    }

    /**
     * Decide which cards to play this turn
     * Returns array of card indices to play in order
     */
    decideCardsToPlay(state) {
        const aiPlayer = state.players[PLAYER_TYPES.AI];
        const humanPlayer = state.players[PLAYER_TYPES.HUMAN];
        
        const playableCards = this.getPlayableCards(state, PLAYER_TYPES.AI);
        const cardsToPlay = [];
        
        // Track simulated mana after each play
        let simulatedMana = aiPlayer.mana;
        let simulatedHp = aiPlayer.hp;
        let humanSimulatedHp = humanPlayer.hp;
        
        // Priority order: 
        // 1. Lethal damage (win condition)
        // 2. Healing when low HP
        // 3. Damage spells
        // 4. Buffs
        // 5. Card draw
        // 6. Monsters (if we have mana left)
        
        while (playableCards.length > 0) {
            // Find best card to play with current simulated mana
            const bestCardIndex = this.selectBestCard(
                playableCards,
                aiPlayer,
                humanPlayer,
                simulatedMana,
                simulatedHp,
                humanSimulatedHp
            );
            
            if (bestCardIndex === -1) {
                break; // No more cards we want to play
            }
            
            const card = aiPlayer.hand[bestCardIndex];
            cardsToPlay.push(bestCardIndex);
            
            // Update simulation
            simulatedMana -= card.cost;
            
            if (card.effect) {
                switch (card.effect.type) {
                    case 'damage':
                        humanSimulatedHp -= card.effect.value;
                        break;
                    case 'heal':
                        simulatedHp = Math.min(aiPlayer.maxHp, simulatedHp + card.effect.value);
                        break;
                    case 'mana':
                        simulatedMana = Math.min(aiPlayer.maxMana + 5, simulatedMana + card.effect.value);
                        break;
                }
            }
            
            // Remove played card from consideration
            playableCards.splice(playableCards.indexOf(bestCardIndex), 1);
            
            // Re-evaluate remaining cards with new mana
            const updatedPlayable = this.getPlayableCardsWithMana(state, PLAYER_TYPES.AI, simulatedMana);
            playableCards.length = 0;
            playableCards.push(...updatedPlayable);
        }
        
        return this.adjustIndicesForSequentialPlay(cardsToPlay);
    }

    /**
     * Get all playable card indices
     */
    getPlayableCards(state, playerType) {
        const player = state.players[playerType];
        const playable = [];
        
        player.hand.forEach((card, index) => {
            if (player.mana >= card.cost) {
                playable.push(index);
            }
        });
        
        return playable;
    }

    /**
     * Get playable cards with simulated mana
     */
    getPlayableCardsWithMana(state, playerType, mana) {
        const player = state.players[playerType];
        const playable = [];
        
        player.hand.forEach((card, index) => {
            if (mana >= card.cost) {
                playable.push(index);
            }
        });
        
        return playable;
    }

    /**
     * Select the best card to play based on AI strategy
     */
    selectBestCard(playableIndices, aiPlayer, humanPlayer, currentMana, currentHp, humanCurrentHp) {
        if (playableIndices.length === 0) {
            return -1;
        }

        let bestScore = -Infinity;
        let bestIndex = -1;

        for (const index of playableIndices) {
            const card = aiPlayer.hand[index];
            const score = this.evaluateCard(card, aiPlayer, humanPlayer, currentMana, currentHp, humanCurrentHp);
            
            if (score > bestScore) {
                bestScore = score;
                bestIndex = index;
            }
        }

        return bestIndex;
    }

    /**
     * Evaluate a card's usefulness in current situation
     */
    evaluateCard(card, aiPlayer, humanPlayer, currentMana, currentHp, humanCurrentHp) {
        let score = 0;
        const hpDeficit = aiPlayer.maxHp - currentHp;
        const humanLowHp = humanCurrentHp <= 5;
        const aiLowHp = currentHp <= 8;

        // Check if this could be lethal
        if (card.effect && card.effect.type === 'damage') {
            if (card.effect.value >= humanCurrentHp) {
                return 1000; // LETHAL! Highest priority
            }
        }

        // Damage spells
        if (card.effect && card.effect.type === 'damage') {
            score += card.effect.value * 10;
            
            // Bonus for finishing off opponent
            if (humanLowHp) {
                score += 20;
            }
        }

        // Healing spells
        if (card.effect && card.effect.type === 'heal') {
            if (aiLowHp) {
                score += card.effect.value * 15; // Prioritize healing when low
            } else if (hpDeficit > 0) {
                score += card.effect.value * 8;
            }
        }

        // Mana generation
        if (card.effect && card.effect.type === 'mana') {
            score += card.effect.value * 5;
            // More valuable early when we have less max mana
            if (aiPlayer.maxMana < 5) {
                score += 10;
            }
        }

        // Card draw
        if (card.effect && card.effect.type === 'draw') {
            score += card.effect.value * 7;
            // More valuable when hand is empty
            if (aiPlayer.hand.length <= 2) {
                score += 15;
            }
        }

        // Buffs
        if (card.effect && card.effect.type === 'buff') {
            if (card.effect.stat === 'attack') {
                score += card.effect.value * 6 * card.effect.duration;
            } else if (card.effect.stat === 'defense') {
                score += card.effect.value * 5 * card.effect.duration;
                if (aiLowHp) {
                    score += 10; // Defensive buff more valuable when low HP
                }
            }
        }

        // Monster cards (no immediate effect but board presence)
        if (!card.effect && card.attack && card.defense) {
            score += (card.attack + card.defense) * 3;
            
            // Prefer cheaper monsters early
            if (card.cost <= 2) {
                score += 5;
            }
        }

        // Cost efficiency bonus
        const costEfficiency = this.calculateCostEfficiency(card);
        score += costEfficiency * 2;

        // Small random factor to make AI less predictable
        score += Math.random() * 3;

        return score;
    }

    /**
     * Calculate how much value we get per mana spent
     */
    calculateCostEfficiency(card) {
        if (card.cost === 0) {
            return 5; // Free cards are always efficient
        }

        let totalValue = 0;

        if (card.effect) {
            switch (card.effect.type) {
                case 'damage':
                    totalValue = card.effect.value;
                    break;
                case 'heal':
                    totalValue = card.effect.value;
                    break;
                case 'draw':
                    totalValue = card.effect.value * 1.5;
                    break;
                case 'mana':
                    totalValue = card.effect.value * 0.8;
                    break;
                case 'buff':
                    totalValue = card.effect.value * card.effect.duration * 0.7;
                    break;
            }
        } else if (card.attack && card.defense) {
            totalValue = (card.attack + card.defense) * 0.8;
        }

        return totalValue / card.cost;
    }

    /**
     * Adjust indices because removing cards shifts positions
     */
    adjustIndicesForSequentialPlay(indices) {
        // Sort indices to play in order
        const sorted = [...indices].sort((a, b) => a - b);
        return sorted;
    }
}

/**
 * Create AI opponent instance
 */
export function createAIOpponent() {
    return new AIOpponent();
}
