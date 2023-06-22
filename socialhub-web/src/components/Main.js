import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function Main(props) {
    const { isLoggedIn, handleLoggedIn } = props;

    const showLogin = () => {
        // case1: already log in => Home
        // case2: hasn't logged in => Login
        return isLoggedIn ? (
            // not only the component change, but also the url change
            <Redirect to="/home" />
        ) : (
            <Login handleLoggedIn={handleLoggedIn} />
        );
    };

    const showHome = () => {
        // case1: already log in => Home
        // case2: hasn't logged in => Login
        return isLoggedIn
            ?
            <Home />
            // not only the component change, but also the url change
            : <Redirect to="/login" />;
    };
    return (
        <div className="main">
            <Switch>
                // router is the key-value pair
                <Route exact path="/" render={showLogin} />
                <Route path="/login" render={showLogin} />
                <Route path="/register" component={Register} />
                <Route path="/home" render={showHome} />
            </Switch>
        </div>
    );
}

export default Main;