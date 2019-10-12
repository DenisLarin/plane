import React, {Component} from 'react';
import {connect} from 'react-redux';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import {addStation, removeStation} from './../../store/actions/index'
import stationIMG from '../../assets/iconfinder_radar_3383443.png'
import './addMarkerWindow.scss'
import StationButton from "../../components/StationButton/StationButton";

//https://docs.mapbox.com/mapbox-gl-js/example/drag-a-point/

class AddMarkerWindow extends Component {
    state = {
        totalCoast: 0,
    };
    //добавление мертвой зоны
    addDeadZone = (map, station, center, geoJson) => {
        const deadZoneradius = this.meterToPixel(station.blindSpot * 1000, center.lat, map.getZoom());
        map.addSource(`${station.name}-deadZone`, {
            "type": "geojson",
            "data": geoJson
        });
        map.addLayer({
            'id': `${station.name}-deadZoneLayer`,
            'type': 'circle',
            'source': `${station.name}-deadZone`,
            "paint": {
                "circle-radius": deadZoneradius,
                "circle-color": 'red',
                "circle-opacity": 0.6,
            }
        },station.name);
    };
    //добавление активной зоны
    addRangeZone = (map, station, center, geoJson) => {
        const radius = this.meterToPixel(station.range * 1000, center.lat, map.getZoom());
        map.addSource(`${station.name}-rangeZone`, {
            "type": "geojson",
            "data": geoJson
        });
        map.addLayer({
            'id': `${station.name}-rangeZoneLayer`,
            'type': 'circle',
            'source': `${station.name}-rangeZone`,
            "paint": {
                "circle-radius": radius,
                "circle-color": 'green',
                "circle-opacity": 0.5,
            }
        },station.name);
    };
    //добавление иконки и надписи
    addIconWithImage = (map, station) => {
        map.addLayer({
            id: station.name,
            type: "symbol",
            source: `${station.name}-point`,
            "layout": {
                "icon-image": "station",
                "icon-size": 0.2,
                "text-field": station.name,
                "text-offset": [-0.5, 2],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 15,
                "text-transform": "uppercase",
                "text-letter-spacing": 0.05,
            },
        });
    };

    //слушители карты
    addEventListeners = (map, station, center, geoJson)=>{
        map.on('click', station.name, e => {
            this.onStationClickHandler(station);
        });
        map.on('zoom', e => {
            if (map.getLayer(`${station.name}-deadZoneLayer`) && map.getLayer(`${station.name}-rangeZoneLayer`)) {
                const deadZoneradius = this.meterToPixel(station.blindSpot * 1000, center.lat, map.getZoom());
                map.setPaintProperty(`${station.name}-deadZoneLayer`, "circle-radius", deadZoneradius)
                const rangeRadius = this.meterToPixel(station.range * 1000, center.lat, map.getZoom());
                map.setPaintProperty(`${station.name}-rangeZoneLayer`, "circle-radius", rangeRadius)
            }
        });
        const canvas = map.getCanvasContainer();
        map.on('mouseenter', station.name, function () {
            canvas.style.cursor = 'move';
        });
        map.on('mouseleave', station.name, function () {
            canvas.style.cursor = '';
        });
        const onMove = e => {
            if (station.point && (e.point.x === station.point.x && e.point.y === station.point.y)){
                return;
            }
            console.log("move");
            const coords = e.lngLat;
            canvas.style.cursor = 'grabbing';
            const stationName = station.name;
            // const deadZone =  map.getSource(`${stationName}-deadZone`);
            const point =  map.getSource(`${stationName}-point`);
            // const range =  map.getSource(`${stationName}-rangeZone`);
            geoJson.features[0].geometry.coordinates = [coords.lng, coords.lat];
            point.setData(geoJson);
        };
        const onUp = e => {
            const newCenter = {lat: geoJson.features[0].geometry.coordinates[0],lng: geoJson.features[0].geometry.coordinates[1]}
            this.addRangeZone(map, station, center, geoJson);
            this.addDeadZone(map, station, center, geoJson)

            console.log(geoJson);
            map.off('mousemove', onMove);
            map.off('touchmove', onMove);
        };
        map.on('mousedown', station.name, e => {
            e.preventDefault();
            canvas.style.cursor = 'grab';

            map.removeLayer(`${station.name}-deadZoneLayer`);
            map.removeLayer(`${station.name}-rangeZoneLayer`);
            map.removeSource(`${station.name}-deadZone`);
            map.removeSource(`${station.name}-rangeZone`);

            map.on('mousemove', onMove);
            map.once('mouseup', onUp);
        });
        map.on('touchstart', 'point', e => {
            if (e.points.length !== 1) return;
            e.preventDefault();
            map.on('touchmove', onMove);
            map.once('touchend', onUp);
        });
    };

    meterToPixel = (meters, latitude, zoomLevel) => {
        const earthCircumference = 40075017;
        const latitudeRadians = latitude * (Math.PI / 180);
        const meterPerPixel = earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoomLevel + 8)
        return meters / meterPerPixel;
    };



    //main
    addStationButtonClickHandler = (station) => {
        const map = this.props.map;
        if (!map) {
            return
        }

        const center = map.centerBetweenTowns;
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
                    "coordinates": [center.lng, center.lat]
                }
            }]
        };
        map.addSource(`${station.name}-point`, {
            "type": "geojson",
            "data": geoJson
        });

        //иконка + текст
        this.addIconWithImage(map, station);

        //радиус действия зоны
        this.addRangeZone(map, station, center, geoJson);

        //радиус мертвой зоны
        this.addDeadZone(map, station, center, geoJson);



        //установка слушателей
        this.addEventListeners(map, station,center,geoJson);

        this.props.addStation(station);
        this.setState(state=>{
            return {totalCoast: state.totalCoast+station.coast}
        });

    };
    onStationClickHandler = (station) => {
        const map = this.props.map;
        map.removeLayer(station.name);
        map.removeSource(`${station.name}-point`);
        map.removeLayer(`${station.name}-deadZoneLayer`);
        map.removeLayer(`${station.name}-rangeZoneLayer`);
        map.removeSource(`${station.name}-deadZone`);
        map.removeSource(`${station.name}-rangeZone`);
        this.props.removeStation(station);
        this.setState(state=>{
           return {totalCoast: state.totalCoast-station.coast};
        });
    };

    render() {
        if (!this.props.map)
            return null;
        const selectedStations = this.props.stations;
        let buttons = null;
        let avaliebleStations = this.props.avaliebleStations;
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
                <p>Current coast: {this.state.totalCoast}</p>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        addStation: (station) => dispatch(addStation(station)),
        removeStation: (station) => dispatch(removeStation(station))
    }
};
const mapStateToProps = state => {
    return {
        map: state.mapReducer.map,
        stations: state.mapReducer.stations,
        avaliebleStations: state.dataReducer.stations
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMarkerWindow);
