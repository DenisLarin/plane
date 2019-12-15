import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from "./Main";
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom'

//redux
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import Map from './store/reducers/map/map'
import EnterData from './store/reducers/enterData/enterData'
import TaskData from './store/reducers/task/task'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    mapReducer: Map,
    dataReducer: EnterData,
    tasksReducer: TaskData,
});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));


const app = (
    <Provider store={store}>
        <BrowserRouter>
            <Main/>
        </BrowserRouter>
    </Provider>
)


ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
