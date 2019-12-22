import React from 'react';
import { firebaseContext } from '../Context/firebaseContext';
import Hand from './Hand';
import Discards from './Discards';
import Played from './Played';

class Game extends React.Component {
    static contextType = firebaseContext;
    constructor(props) {
        super(props);
        this.state = { style: {} };
        //    bombs: 0, clocks: 0, remainingCards: 50, currentPlayer: '', players: [] };
    }

    componentDidMount() {
        this.context.docListener(this.props.gamePath, this.gameLoaded);
        this.context.collectionListener(this.props.gamePath + "/deck", this.deckLoaded);
        this.context.collectionListener(this.props.gamePath + "/played", this.playedLoaded)
        this.context.collectionListener(this.props.gamePath + "/discards", this.discardsLoaded)
    }

    deckLoaded = deck => {
        this.setState({ deck });
        // console.log(deck);
    }

    playedLoaded = played => {
        this.setState({ played });
        console.log(played);
    }

    discardsLoaded = discards => {
        this.setState({ discards });
        // console.log(discards);
    }

    gameLoaded = game => {
        this.setState({ ...game });
        this.setState({ style: this.computeStyles() })
    }

    computeStyles() {
        const result = {
            width: '480px',
            maxWidth: '90vw',
            margin: 'auto',
            display: 'grid',
            gridTemplateColumns: '10% repeat(5, 1fr)',
            columnGap: '4px',
            rowGap: '4px'
        }
        if (this.state && this.state.players) {
            if (this.playerNames().length >= 4) {
                result.gridTemplateColumns = '10% repeat(4, 1fr)';
                result.columnGap = '40px';
            }
        }
        return result;
    }

    render() {
        return (<div style={this.state.style}>
            <div style={{ gridColumn: '2/7' }}>
                Clocks: {this.state.clocks}
            </div><div style={{ gridColumn: '2/7' }}>
                Bombs: {this.state.bombs}</div>
            <div style={{ gridColumn: '2/7' }}>
                Remaining cards: {this.state.remainingCards}</div>
            {this.hands()}
            <Discards discards={this.state.discards} />
            <Played played={this.state.played} /> 
        </div >
        );
    }

    async deal() {
        console.log(this);
        const card = this.state.deck[0];
        await this.context.deleteDocument(`${this.props.gamePath}/deck/${card.id}`);
        await this.context.updateDoc(this.props.gamePath, { remainingCards: this.state.remainingCards - 1 });
        delete card.id;
        return card;
    }

    async discard(card, cardPath) {
        delete card.id;
        await this.context.createDoc(`${this.props.gamePath}/discards`, card);
        await this.context.deleteDocument(cardPath);
    }

    async play(card, cardPath) {
        delete card.id;
        await this.context.createDoc(`${this.props.gamePath}/played`, card);
        await this.context.deleteDocument(cardPath);
    }

    hands() {
        return this.playerNames().map(playerName =>
            <Hand
                gameId={this.props.gamePath}
                userId={playerName}
                key={playerName}
                canTell={this.state.clocks > 0}
                subtractClocks={this.subtractClock}
                addClock={this.addClock}
                deal={() => this.deal()}
                discard={(card, cardPath) => this.discard(card, cardPath)} />)
    }

    async updateClocks(increment) {
        const clocks = Math.min(8, Math.max(this.state.clocks + increment, 0));
        await this.context.updateDoc(this.props.gamePath, { clocks });
    }

    subtractClock = async () => await this.updateClocks(-1);
    addClock = async () => await this.updateClocks(1);

    playerNames() {
        if (this.state && this.state.players) {
            return Object.keys(this.state.players)
        }
        return [];
    }
}

export default Game;