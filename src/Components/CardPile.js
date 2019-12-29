import React from "react";
import CardPileCard from './CardPileCard';

// import template from "./Card.jsx";

/*Props:
  suit - the color of the card
  number - the number of the card
  knowldege:
    color - boolean if knowledge is known
    number - boolean if number is known
*/

class CardPile extends React.Component {
    render() {
        if (this.props.cards) {
            const suits = ['red', 'white', 'blue', 'green', 'yellow'];
            return suits.map(suit => this.cardPile(suit));
        }
        return <div></div>;
    }

    cardPile(color) {
        const cards = this.props.cards
            .filter(card => card.color === color)
            .sort((card1, card2) => card1.number - card2.number);
        return (<div>
            {cards.map(card => <CardPileCard {...card} key={card.id}/>)}
        </div>);
    }
}

export default CardPile;