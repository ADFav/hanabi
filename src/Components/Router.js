import React from 'react';
import { firebaseContext } from '../Context/firebaseContext';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import Login from "./Login";
import Game from "./Game";
import GameSelector from "./GameSelector"
import Register from './Register';
import Logout from './Logout';
import GameCreator from './GameCreator';

class Router extends React.Component {
    static contextType = firebaseContext;
    constructor(props) {
        super(props);
        this.state = { loggedIn: false };
    }

    componentDidMount() {
        if (this.context.auth.currentUser) {
            this.setState({ loggedIn: true });
        }
        this.context.registerAuthListener(user => {
            const loggedIn = user !== null;
            this.setState({ loggedIn });
        });
    }

    render() {
        if (this.state.loggedIn) {
            return (<BrowserRouter>
                <Logout />
                <Switch>
                    <Route path="/register">
                        <Redirect to="/"/>
                    </Route>
                    <Route exact path="/">
                        <GameSelector />
                    </Route>
                    <Route path="/games/:gameId">
                        <Game />
                    </Route>
                    <Route path="/newGame">
                        <GameCreator />
                    </Route>
                </Switch>
            </BrowserRouter>
            )
        } else {
            return (
                <BrowserRouter>
                    <Switch>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route>
                            <Login />
                        </Route>
                    </Switch>
                </BrowserRouter>
            )
        }
    }
}

export default Router;