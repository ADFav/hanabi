import React from "react";
import Card from "./Card";
import MyCard from './MyCard';

import { firebaseContext } from "../Context/firebaseContext";

/*Props:
  userId: a path to the Firebase collection of cards
*/

class Hand extends React.Component {
  static contextType = firebaseContext;

  componentDidMount() {
    try {
      if (this.props && this.props.userId) {
        const handPath = this.props.gameId + "/" + this.props.userId + "-hand";
        this.context.collectionListener(handPath, cards => this.setState({ cards }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (<div style={{ display: "contents" }}>
      <span style={{ alignSelf: "center" }}>{this.props.userId}</span>
      {this.cards()}
    </div>)
  }

  cards() {
    if (this.state && this.state.cards && this.state.cards.length > 0) {
      return this.state.cards.map(card => this.createCardComponent(card));
    }
  }

  async addToHand(card) {
    const handPath = this.props.gameId + "/" + this.props.userId + "-hand";
    await this.context.createDoc(handPath, card);
  }

  createCardComponent(card) {
    if (this.isMyHand) {
      const play = async () => {
        const newCard = await this.props.deal();
        const handPath = this.props.gameId + "/" + this.props.userId + "-hand";
        const cardPath = `${handPath}/${card.id}`
        await Promise.all([
          this.props.play(card, cardPath),
          this.context.deleteDocument(cardPath)
        ]);
        this.addToHand(newCard);
      };
      const discard = async () => {
        const newCard = await this.props.deal();
        const handPath = this.props.gameId + "/" + this.props.userId + "-hand";
        const cardPath = `${handPath}/${card.id}`
        await this.props.discard(card, cardPath);
        console.log(cardPath);
        await this.context.deleteDocument(cardPath);
        this.addToHand(newCard);
        this.props.addClock();
      };
      return <MyCard
        {...card}
        play={play}
        discard={discard}
        key={card.id} />
    } else {
      const cardPath = this.props.gameId + "/" + this.props.userId + "-hand/" + card.id;
      const knowledge = card.knowledge;
      const tell = newKnowledge => {
        this.context.updateDoc(cardPath, { knowledge: newKnowledge })
        this.props.subtractClocks();
      }
      const tellColor = () => {
        knowledge.color = true;
        tell(knowledge);
      };
      const tellNumber = () => {
        knowledge.number = true;
        tell(knowledge);
      };
      return <Card {...card}
        key={card.id}
        canTell={this.props.canTell}
        tellColor={tellColor}
        tellNumber={tellNumber} />
    }
  }

  get isMyHand() {
    return this.props.userId === 'afav';
  }

  styles() {
    return {
      display: "inline-block"
    };
  }
}

export default Hand;
