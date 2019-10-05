import * as mapActions from './../../actions/actionTypes/map'


const initState = {
    map: null,
    stations: []
};

const saveMap = (state, map) => {
    return {map: map, stations: []}
};
const addStation = (state, station) => {
    const stations = [...state.stations,station];

    return {map: state.map, stations: stations}
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case mapActions.SAVE_MAP:
            return saveMap(state, action.map);
            break;
        case mapActions.ADD_STATION:
            return addStation(state, action.station)
        default:
            return state
    }
};
export default reducer;