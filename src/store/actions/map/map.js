import * as mapActions from './../actionTypes/map'

export const addStation = (station)=>{

    return{
        type: mapActions.ADD_STATION,
        station: station
    }
};
export const removeStation = (station)=>{
    return{
        type: mapActions.REMOVE_STATION,
        station: station
    }
};
export const setStationData = (data)=>{
    return{
        type: mapActions.ADD_STATION_DATA,
        data: data
    }
}
