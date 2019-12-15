import * as mapActions from './../../actions/actionTypes/map'


const initState = {
    stations: []
};

const addStation = (state, station) => {
    const stations = [...state.stations, station];

    return {...state, stations: stations}
};
const addStationData = (state, {data, stationName}) => {
    let stations = [...state.stations];
    stations = stations.map(item=>{
        if(item.name === stationName){
            item.cordinatesData = data
        }
        return item;
    });
    return {stations: stations};
}

const removeStation = (state, station) => {
  const stations = state.stations.filter(e=>{
      return e.name !== station.name;
  });
  return {map: state.map, stations: stations};
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case mapActions.ADD_STATION:
            return addStation(state, action.station);
        case mapActions.REMOVE_STATION:
            return removeStation(state, action.station);
        case mapActions.ADD_STATION_DATA:
            return addStationData(state, action.data);
        default:
            return state
    }
};
export default reducer;