import React, {Component} from 'react';
import {connect} from 'react-redux';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import {addMap, addStation} from './../../store/actions/index'
import './addMarkerWindow.scss'
import StationButton from "../../components/StationButton/StationButton";


class AddMarkerWindow extends Component {
    state = {
        stations: [
            {name: "alpha", range: 400, blindSpot: 150, coast: 100},
            {name: "romeo", range: 400, blindSpot: 200, coast: 80},
            {name: "home", range: 200, blindSpot: 100, coast: 50},
            {name: "grizzly", range: 150, blindSpot: 0, coast: 40},
            {name: "new", range: 400, blindSpot: 150, coast: NaN},
        ]
    };
    addStationButtonClickHandler = (station) => {

        const map = this.props.map;
        if (!map) {
            return
        }

        const center = map.getCenter();
        console.log(center)
        const popup = new mapboxgl.Popup({offset: 25})
            .setText(station.name);
        const marker = new mapboxgl.Marker({
            draggable: true
        }).setLngLat(center).setPopup(popup);
        marker.name = station.name;
        map.addLayer({
            "id": station.name,
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [center.lng, center.lat]
                        },
                        "properties": {
                            "title": marker.name,
                            "icon": "monument"
                        }
                    },]
                }
            },
            "layout": {
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });

       map.on('click', station.name, function (e) {
          console.log(station.name);
       });
        this.props.addStation(marker)
    };
    onStationClickHandler = (stationName)=>{
        console.log(stationName);
    };
    render() {
        const {stations} = this.state;
        if (!this.props.map)
            return null
        const selectedStations = this.props.stations;
        let buttons = null;
        let avaliebleStations = stations;
        selectedStations.map(station => {
            avaliebleStations = avaliebleStations.filter((st) => {
                return st.name != station.name
            })
        });
        buttons = avaliebleStations.map(station => {
            return <StationButton key={station.name} name={station.name}
                                  onClick={() => this.addStationButtonClickHandler(station)}/>
        });
        if (buttons.length == 0){
            buttons = <p style={{textDecoration: "underline", color: "#fff"}}>Выбраны все станции!</p>
        }
        return (
            <div className="addMarkerWindow">
                <h1>Окно добавления станции</h1>
                <div className="buttons">
                    {buttons}
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        addStation: (station) => dispatch(addStation(station))
    }
};
const mapStateToProps = state => {
    return {
        map: state.mapReducer.map,
        stations: state.mapReducer.stations
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMarkerWindow);