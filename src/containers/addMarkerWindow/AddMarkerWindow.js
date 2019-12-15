import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addStation, removeStation, changeTaskStatus, setStationData} from './../../store/actions/index'
import stationIMG from '../../assets/iconfinder_radar_3383443.png'
import './addMarkerWindow.scss'
import StationButton from "../../components/StationButton/StationButton";
import MAPVALUES from "../map/MAPVALUES";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'


const LATTOKM = 111.134861111;
const LONTOKM = 111.321377778;


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
                "circle-radius": deadZoneradius * 2,
                "circle-color": 'red',
                "circle-opacity": 0.6,
            }
        }, station.name);
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
                "circle-radius": radius * 2,
                "circle-color": 'green',
                "circle-opacity": 0.5,
            }
        }, station.name);
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
    addEventListeners = (map, station, center, geoJson) => {
        let isMove = false;
        map.on('click', station.name, e => {
            this.onStationClickHandler(station);
        });
        map.on('zoom', e => {
            if (map.getLayer(`${station.name}-deadZoneLayer`) && map.getLayer(`${station.name}-rangeZoneLayer`)) {
                const deadZoneradius = this.meterToPixel(station.blindSpot * 1000, center.lat, map.getZoom());
                map.setPaintProperty(`${station.name}-deadZoneLayer`, "circle-radius", deadZoneradius * 2)
                const rangeRadius = this.meterToPixel(station.range * 1000, center.lat, map.getZoom());
                map.setPaintProperty(`${station.name}-rangeZoneLayer`, "circle-radius", rangeRadius * 2)
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
            if (station.point && (e.point.x === station.point.x && e.point.y === station.point.y)) {
                return;
            }
            if (!isMove) {
                isMove = true;
            }
            const coords = e.lngLat;
            canvas.style.cursor = 'grabbing';
            const stationName = station.name;
            const deadZone = map.getSource(`${stationName}-deadZone`);
            const point = map.getSource(`${stationName}-point`);
            const range = map.getSource(`${stationName}-rangeZone`);
            geoJson.features[0].geometry.coordinates = [coords.lng, coords.lat];
            point.setData(geoJson);
            deadZone.setData(geoJson);
            range.setData(geoJson);

        };
        const onUp = e => {
            // const newCenter = {lat: geoJson.features[0].geometry.coordinates[0],lng: geoJson.features[0].geometry.coordinates[1]}
            // this.addRangeZone(map, station, center, geoJson);
            // this.addDeadZone(map, station, center, geoJson)
            if (isMove) {
                this.props.setStationData({stationName: station.name, data: e.lngLat});
                this.checkStationsPositions();
            }


            map.off('mousemove', onMove);
            map.off('touchmove', onMove);
        };
        map.on('mousedown', station.name, e => {
            e.preventDefault();
            canvas.style.cursor = 'grab';
            // map.removeLayer(`${station.name}-deadZoneLayer`);
            // map.removeLayer(`${station.name}-rangeZoneLayer`);
            // map.removeSource(`${station.name}-deadZone`);
            // map.removeSource(`${station.name}-rangeZone`);

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
        const meterPerPixel = earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoomLevel + 8);
        return meters / meterPerPixel;
    };


    //проверка позиционирования станций

    checkStationsPositions = () => {
        if (this.props.stations.length < 1) {
            return;
        }
        const stations = this.props.stations;
        const stationInTheTown = []
        const towns = this.props.towns;
        towns.forEach(item=>{
            item.isCover = false;
        })
        let isConnecting = false;
        let isInTown = 0;

        const map = MAPVALUES.getMap();

        stations.forEach(station => {
            //координаты центра станции
            const lat = station.cordinatesData.lat; //широта (верх/низ)
            const lng = station.cordinatesData.lng; //долгота (лево/право)

            //растояние в градусную меру
            const rangeLat = station.range / LATTOKM;
            const rangeLng = station.range * 1.5 / LONTOKM;

            const deadLat = station.blindSpot / LATTOKM;
            const deadLng = station.blindSpot * 1.5 / LONTOKM;


            //координаты зон
            const leftRange = lng - Math.abs(rangeLng);
            const rightRange = lng + rangeLng;
            const bottomRange = lat - Math.abs(rangeLat);
            const topRange = lat + rangeLat;

            const leftDead = lng - Math.abs(deadLng);
            const rightDead = lng + deadLng;
            const bottomDead = lat - Math.abs(deadLat);
            const topDead = lat + deadLat;
            towns.forEach(town => {
                const townLat = town.coordinates[1];
                const townLng = town.coordinates[0];
                if ((townLng >= leftRange && townLng <= rightRange && townLat >= bottomRange && townLat <= topRange) && !(townLng >= leftDead && townLng <= rightDead && townLat >= bottomDead && townLat <= topDead)) {
                    if(!town.isCover){
                        isInTown++;
                    }
                    town.isCover = true;
                    console.debug(`станция ${station.name} принадлежит городу ${town.name}`);
                    console.log(town);
                    let stinT = [];
                    if (stationInTheTown.length > 0) {
                        stinT = stationInTheTown.filter(item => {
                            return item.station.name === station.name;
                        });
                    }
                    if (stinT.length > 0) {
                        stinT[0]['towns'].push(town);
                    } else {
                        stationInTheTown.push({station: station, 'towns': [town]});
                    }
                }
            });
        });
        if (isInTown >= 4) {
            console.log("все города покрыты");

            console.log(stationInTheTown);
            let howMachStationHasConnection = 0;

            for (let i = 0; i < stationInTheTown.length; i++) {
                let isConnecting = false;
                const station = stationInTheTown[i].station;
                //координаты центра станции
                const lat = station.cordinatesData.lat; //широта (верх/низ)
                const lng = station.cordinatesData.lng; //долгота (лево/право)

                //растояние в градусную меру
                const rangeLat = station.range/ LATTOKM;
                const rangeLng = station.range * 1.7 / LONTOKM;

                const deadLat = station.blindSpot / LATTOKM;
                const deadLng = station.blindSpot / LONTOKM;


                //координаты зон
                const leftRange = lng - Math.abs(rangeLng);
                const rightRange = lng + rangeLng;
                const bottomRange = lat - Math.abs(rangeLat);
                const topRange = lat + rangeLat;

                const leftDead = lng - Math.abs(deadLng);
                const rightDead = lng + deadLng;
                const bottomDead = lat - Math.abs(deadLat);
                const topDead = lat + deadLat;

                for (let j = 0; j < stationInTheTown.length; j++) {
                    if (j === i) {
                        continue;
                    }
                    if (isConnecting) {
                        break;
                    }
                    const secondStation = stationInTheTown[j].station;
                    console.log("secondStation", secondStation);

                    const lat2 = secondStation.cordinatesData.lat; //широта (верх/низ)
                    const lng2 = secondStation.cordinatesData.lng; //долгота (лево/право)

                    //растояние в градусную меру
                    const rangeLat2 = secondStation.range / LATTOKM;
                    const rangeLng2 = secondStation.range * 1.7/ LONTOKM;

                    const deadLat2 = secondStation.blindSpot / LATTOKM;
                    const deadLng2 = secondStation.blindSpot / LONTOKM;


                    //координаты зон
                    const leftRange2 = lng2 - Math.abs(rangeLng2);
                    const rightRange2 = lng2 + rangeLng2;
                    const bottomRange2 = lat2 - Math.abs(rangeLat2);
                    const topRange2 = lat2 + rangeLat2;




                    const totalX = Math.abs(rightRange2 - leftRange);
                    const totalY = Math.abs(topRange2 - bottomRange);

                    const firstDx = rangeLng * 2;
                    const secondDx = rangeLng2 * 2;
                    const firstDy = rangeLat * 2;
                    const secondDy = rangeLat2 * 2;

                    const totalDx = Math.abs(firstDx + secondDx);
                    const totalDy = Math.abs(firstDy + secondDy);


                    console.group("координаты");
                    console.log("totalX",totalX);
                    console.log("totalY",totalY);
                    console.log("firstDx",firstDx);
                    console.log("firstDy",firstDy);
                    console.log("secondDx",secondDx);
                    console.log("secondDy",secondDy);
                    console.log("totalDx",totalDx);
                    console.log("totalDy",totalDy);
                    console.groupEnd();
                    console.log(totalDx-totalX);
                    console.log(totalDy-totalY);
                    if (totalDx > totalX && totalDy > totalY) {
                        console.log(`station ${stationInTheTown[i].station.name} has connect with ${stationInTheTown[j].station.name}`);
                        isConnecting = true;
                    }
                }
                if (isConnecting) {
                    howMachStationHasConnection++;
                } else {
                    break;
                }
            }
            if (howMachStationHasConnection !== stationInTheTown.length) {
                console.log("not");
                return;
            } else {
                console.log("good");
            }
        } else {
            console.log("not all towns");
            return;
        }
    };

    //main
    addStationButtonClickHandler = (station) => {
        const map = MAPVALUES.getMap();
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
        this.addEventListeners(map, station, center, geoJson);

        this.props.addStation(station);
        this.props.setStationData({stationName: station.name, data: center});


        //task level 0, subtask 0
        if (this.props.stations.length + 1 >= 4) {
            this.props.changeTaskStatus(0, 0, true);
        }

        this.setState(state => {
            return {totalCoast: state.totalCoast + station.coast}
        });
        MAPVALUES.setMap(map);

    };
    //удаление станции
    onStationClickHandler = (station) => {
        const map = MAPVALUES.getMap();
        map.removeLayer(station.name);
        map.removeSource(`${station.name}-point`);
        map.removeLayer(`${station.name}-deadZoneLayer`);
        map.removeSource(`${station.name}-deadZone`);
        map.removeLayer(`${station.name}-rangeZoneLayer`);
        map.removeSource(`${station.name}-rangeZone`);
        this.props.removeStation(station);

        if (this.props.stations.length - 1 < 4) {
            this.props.changeTaskStatus(0, 0, false);
        }

        this.setState(state => {
            return {totalCoast: state.totalCoast - station.coast};
        });
        MAPVALUES.setMap(map);
    };

    render() {
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
        removeStation: (station) => dispatch(removeStation(station)),
        changeTaskStatus: (level, subLevel, newStatus) => dispatch(changeTaskStatus(level, subLevel, newStatus)),
        setStationData: (data) => dispatch(setStationData(data))
    }
};
const mapStateToProps = state => {
    return {
        stations: state.mapReducer.stations,
        avaliebleStations: state.dataReducer.stations,
        towns: state.dataReducer.towns
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMarkerWindow);
