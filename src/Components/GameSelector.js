import React from 'react';
import { Link } from 'react-router-dom';
import { firebaseContext } from '../Context/firebaseContext';

class GameSelector extends React.Component {
    static contextType = firebaseContext;
    constructor(props) {
        super(props);
        this.state = { games: [] };
        this.userName = 'afav'
    }

    componentDidMount() {
        const setGames = games => this.setState({ games });
        const queries = [
            { field: `players.${this.userName}`, operator: '==', value: true }
        ];
        console.log(this.context);
        this.context.query('games', queries, setGames);
    }

    render() {
        return (
            <div >
                {this.state.games.map(this.gamePreview)}
            </div>
            );
    }

    gamePreview(game) {
        const gamePrviewStyle = {
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            borderRadius: '3px'
        }
        return (
            <Link to={`/games/${game.id}`}>
                <div style={gamePrviewStyle}>
                    <strong>Players</strong> {game.playOrder.join(', ')}<br />
                    <strong>Bombs: </strong> {game.bombs} <br />
                    <strong>Clocks: </strong> {game.clocks} <br />
                    <strong>Cards: </strong> {game.remainingCards} <br />
                </div>
            </Link>);
    }
}

export default GameSelector