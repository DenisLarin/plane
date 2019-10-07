import React, {Component} from 'react';
import {connect} from 'react-redux';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import {addMap, addStation} from './../../store/actions/index'
import stationIMG from '../../assets/iconfinder_radar_3383443.png'
import './addMarkerWindow.scss'
import StationButton from "../../components/StationButton/StationButton";

//https://docs.mapbox.com/mapbox-gl-js/example/drag-a-point/

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
        if (map.listImages().filter(e => e === "station").length === 0) {
            map.loadImage(stationIMG, (error, image) => {
                if (error) throw error;
                map.addImage('station', image)
            });
        }
        const geoJson = {
            type: "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [center.lat, center.lng]
                }
            }]
        };
        map.addSource(`${station.name}-point`, {
            "type": "geojson",
            "data": geoJson
        });
        const layer = map.addLayer({
            id: station.name,
            type: "symbol",
            source: `${station.name}-point`,
            "layout": {
                "icon-image": "station",
                "icon-size": 0.2
            }
        });
        this.props.addStation(station)

        map.on('click', station.name, e => {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`станция: ${station.name} цена: ${station.coast}`)
                .addTo(map);
        });
        map.on('dblclick', station.name, e => {
            this.onStationClickHandler(station.name);
        });
        const canvas = map.getCanvasContainer();
        map.on('mouseenter', station.name, function () {
            canvas.style.cursor = 'move';
        });
        map.on('mouseleave', station.name, function () {
            canvas.style.cursor = '';
        });

        const onMove = e => {
            const coords = e.lngLat;
            canvas.style.cursor = 'grabbing';
            geoJson.features[0].geometry.coordinates = [coords.lng, coords.lat];
            map.getSource(`${station.name}-point`).setData(geoJson);
        };
        const onUp = e => {
            const coords = e.lngLat;
            map.off('mousemove', onMove);
            map.off('touchmove', onMove);
        };
        map.on('mousedown', station.name, e => {
            e.preventDefault();
            canvas.style.cursor = 'grab';
            map.on('mousemove', onMove);
            map.once('mouseup', onUp);
        });
        map.on('touchstart', 'point', e=> {
            if (e.points.length !== 1) return;
            e.preventDefault();
            map.on('touchmove', onMove);
            map.once('touchend', onUp);
        });
    };
    onStationClickHandler = (stationName) => {
        console.log(stationName);
    };

    render() {
        const {stations} = this.state;
        if (!this.props.map)
            return null;
        const selectedStations = this.props.stations;
        let buttons = null;
        let avaliebleStations = stations;
        selectedStations.map(station => {
            avaliebleStations = avaliebleStations.filter((st) => {
                return st.name !== station.name
            })
        });
        buttons = avaliebleStations.map(station => {
            return <StationButton key={station.name} name={station.name}
                                  onClick={() => this.addStationButtonClickHandler(station)}/>
        });
        if (buttons.length === 0) {
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