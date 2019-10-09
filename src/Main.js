import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom'
import Welcome from "./containers/welcomeScreen/Welcome";
import AppScreen from "./containers/appScreen/AppScreen";

function mapStateToProps(state) {
    return {
        stations: state.dataReducer.stations,
        towns: state.dataReducer.towns,
    };
}

class Main extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.towns.length == 4
    }

    render() {
        let routes = null;
        if (this.props.stations.length >=4 && this.props.towns.length == 4) {
            routes =
                <Switch><Route path="/map" exact component={AppScreen}/>
                    <Redirect to="/map"/>
                </Switch>
        } else {
            routes =
                <Switch>
                    <Route path="/" exact component={Welcome}/>
                    <Redirect to="/"/>
                </Switch>
        }
        return (
            <div>
                {routes}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(Main);
