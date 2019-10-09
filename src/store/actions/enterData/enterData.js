import * as enterDataActions from '../actionTypes/enterData'
import axios from 'axios'

export const setStations = (stations) => {
    return {
        type: enterDataActions.SET_STATIONS,
        stations: stations
    }
};
const addTown = (town) => {
    return{
        type: enterDataActions.SET_TOWNS,
        town: town
    }
};
export const setTowns = (towns) => {
    return dispatch => {

        towns.map(town => {
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${town}, Russia.json?limit=1&access_token=pk.eyJ1IjoiZGVuaXNsYXJpbiIsImEiOiJjazB2bjJ5cnQwNmNmM25ueHprc2JvdzRwIn0.NHSA0JPYqDe1rw5MdQuouA`).then(response => {
                const coordinates = response.data.features[0].center
                const currentTown = {
                    coordinates,
                    name: town
                };
                dispatch(addTown(currentTown))
            }).catch(err => {
                console.log(err);
            })
        });
    }
};
