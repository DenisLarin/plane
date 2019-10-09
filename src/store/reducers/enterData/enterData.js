import * as enterDataActions from './../../actions/actionTypes/enterData'


const initState = {
    stations: [],
    towns: [],
};
const setTowns = (state, town) => {
    const towns = [...state.towns, town];
    return {...state, towns: towns};
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case enterDataActions.SET_TOWNS:
            return setTowns(state, action.town);
        default:
            return state
    }
};
export default reducer;
