import React from 'react';
import { firebaseContext } from '../Context/firebaseContext';

class GameCreator extends React.Component {
    static contextType = firebaseContext;
    constructor(props) {
        super(props);
        this.state = {};
    }

    async createGame(players) {
        const numPlayers = players.length;
        const cardsPerPlayer = (numPlayers >= 4 ? 4 : 5)
        const deck = this.shuffleDeck();
        const dealtCards = deck.splice(0, numPlayers * cardsPerPlayer);
        const playerMap = players.reduce((result, playerName) => ({ ...result, [playerName]: true }), {});
        const game = {
            bombs: 3,
            clocks: 8,
            playOrder: players,
            currentPlayer: players[0],
            players: playerMap,
            remainingCards: deck.length
        }

        const gameId = await this.context.createDoc('games', game);
        const deckPath = `games/${gameId}/deck`;
        this.context.writeBatch(deckPath, deck);
        await Promise.all(players.map(playerId => {
            const handPath = `games/${gameId}/${playerId}-hand`
            const hand = dealtCards.splice(0, cardsPerPlayer);
            return this.createHand(handPath, hand);
        }));
    }

    async createHand(playerHandPath, cards) {
        return this.context.writeBatch(playerHandPath, cards)
    }

    shuffleDeck() {
        const colors = ['red', 'blue', 'green', 'white', 'yellow'];
        const numbers = [1, 1, 1, 2, 2, 3, 3, 4, 4, 5];
        const deck = colors.map(color => numbers.map(number => ({ color, number, knowledge: { color: false, number: false } }))).flat().sort((a, b) => Math.random() - 0.5);
        console.log(deck.length);
        return deck;
    }

    render() {
        return (
            <button onClick={() => this.createGame(['afav', 'eshad', 'jfav'])}>
                Add Game
                    </button>
        );
    }
}

export default GameCreator;