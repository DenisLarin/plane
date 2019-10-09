import * as enterDataActions from './../../actions/actionTypes/enterData'


const initState = {
    stations: [],
    towns: [],
};
const setTowns = (state, town) => {
    const towns = [...state.towns, town];
    return {...state, towns: towns};
};
const setStations = (state, stations) => {
    return {...state, stations: stations}
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case enterDataActions.SET_TOWNS:
            return setTowns(state, action.town);
        case enterDataActions.SET_STATIONS:
            return setStations(state, action.stations);
        default:
            return state
    }
};
export default reducer;
