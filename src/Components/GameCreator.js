import React from 'react';
import { firebaseContext } from '../Context/firebaseContext';

class GameCreator extends React.Component {
    static contextType = firebaseContext;
    constructor(props) {
        super(props);
        this.state = { players: ['', '','','','']};
    }

    async createGame() {
        const yourUserName = this.context.auth.currentUser.displayName;
        this.setState(state => this.state.map((name, index) => index === 0 ? yourUserName : name));
        const players = this.state.players.filter(name => name.length > 0);
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

    updatePlayer2(event) {
        const player2Name = event.target.value;
        this.setState(state => state.map((name, index) => index === 1 ? player2Name : name));
    }

    updatePlayer3(event) {
        const player3Name = event.target.value;
        this.setState(state => state.map((name, index) => index === 2 ? player3Name : name));
    }

    updatePlayer4(event) {
        const player4Name = event.target.value;
        this.setState(state => state.map((name, index) => index === 3 ? player4Name : name));
    }

    updatePlayer5(event) {
        const player5Name = event.target.value;
        this.setState(state => state.map((name, index) => index === 4 ? player5Name : name));
    }

    render() {
        const yourUserName = this.context.auth.currentUser.displayName;
        return (<div >
            <strong > Player 1 </strong><input value={yourUserName} disabled /> <br />
            <strong > Player 2 </strong><input onChange={e => this.updatePlayer2(e)} /> < br />
            <strong > Player 3 </strong><input onChange={e => this.updatePlayer3(e)} /> < br />
            <strong > Player 4 </strong><input onChange={e => this.updatePlayer4(e)} /> < br />
            <strong > Player 5 </strong><input onChange={e => this.updatePlayer5(e)} /> < br />
            <button onClick={() => this.createGame()} >
                Add Game
                </button>
        </div>
        );
    }
}

export default GameCreator;