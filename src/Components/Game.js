import React from 'react';
import { firebaseContext } from '../Context/firebaseContext';
import Hand from './Hand';
import CardPile from './CardPile';
import { withRouter, Link, Switch, Route } from 'react-router-dom';

class Game extends React.Component {
    static contextType = firebaseContext;
    constructor(props) {
        super(props);
        this.state = { style: this.computeStyles() };
    }

    componentDidMount() {
        console.log(this.props.match);
        this.context.docListener(this.gamePath, this.gameLoaded);
        this.context.collectionListener(this.gamePath + "/deck", this.deckLoaded);
        this.context.collectionListener(this.gamePath + "/played", this.playedLoaded)
        this.context.collectionListener(this.gamePath + "/discards", this.discardsLoaded)
    }

    deckLoaded = deck => {
        this.setState({ deck });
    }

    playedLoaded = played => {
        this.setState({ played });
        console.log(played.length);
    }

    discardsLoaded = discards => {
        this.setState({ discards });
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
        return (<div style={this.state.style} >
            <Link style={{ gridColumn: '1' }} to="/">Home</Link>
            <div style={{ gridColumn: '2/3' }} >
                Clocks: {this.state.clocks} </div>
            <div style={{ gridColumn: '3/4 ' }}>
                Bombs: {this.state.bombs}
            </div>
            <div style={{ gridColumn: '4/7' }} >
                Remaining cards: {this.state.remainingCards} </div>
            <Link style={{ gridColumn: '1/3' }} to={`/${this.gamePath}/played`}>Played</Link>
            <Link style={{ gridColumn: '3/5' }} to={`/${this.gamePath}/discards`}>Discards</Link>
            <Link style={{ gridColumn: '5/7' }} to={`/${this.gamePath}`}>Hands</Link>
            <Switch>
                <Route exact path={`/${this.gamePath}`}>
                    {this.hands()}
                </Route>
                <Route exact path={`/${this.gamePath}/played`}>
                    <CardPile cards={this.state.played} />
                </Route>
                <Route exact path={`/${this.gamePath}/discards`}>
                    <CardPile cards={this.state.discards} />
                </Route>
            </Switch>
        </div >);
    }

    async deal() {
        console.log(this);
        const card = this.state.deck[0];
        await Promise.all([
            this.context.deleteDocument(`${this.gamePath}/deck/${card.id}`),
            this.context.updateDoc(this.gamePath, { remainingCards: this.state.remainingCards - 1 })
        ]);
        delete card.id;
        return card;
    }

    async discard(card, cardPath) {
        delete card.id;
        await Promise.all([
            this.context.createDoc(`${this.gamePath}/discards`, card),
            this.context.deleteDocument(cardPath)
        ]);
    }

    async play(card, cardPath) {
        const playedInSuit = this.state.played.filter(playedCard => playedCard.color === card.color);
        if (card.number === 1 + playedInSuit.length) {
            delete card.id;
            await Promise.all([
                this.context.createDoc(`${this.gamePath}/played`, card),
                this.context.deleteDocument(cardPath)
            ]);
        } else {
            await this.addBomb();
            this.discard(card, cardPath);
        }
    }

    get gamePath() {
        const { params } = this.props.match;
        const { gameId } = params;
        return `games/${gameId}`;
    }

    hands() {
        return this.playerNames().map(playerName =>
            <Hand gameId={this.gamePath}
                userId={playerName}
                key={playerName}
                canTell={this.state.clocks > 0}
                subtractClocks={this.subtractClock}
                addClock={this.addClock}
                deal={() => this.deal()}
                discard={(card, cardPath) => this.discard(card, cardPath)}
                play={(card, cardPath) => this.play(card, cardPath)}
            />)
    }

    async updateClocks(increment) {
        const clocks = Math.min(8, Math.max(this.state.clocks + increment, 0));
        await this.context.updateDoc(this.gamePath, { clocks });
    }

    async addBomb() {
        const bombs = this.state.bombs - 1;
        await this.context.updateDoc(this.gamePath, { bombs });
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

export default withRouter(Game);