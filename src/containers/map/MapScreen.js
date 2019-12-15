import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import {connect} from 'react-redux'
import './map.css'
import './mapExtensions.css'
import MAP from './MAPVALUES'

class MapScreen extends Component {
    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXNsYXJpbiIsImEiOiJjazB2bjJ5cnQwNmNmM25ueHprc2JvdzRwIn0.NHSA0JPYqDe1rw5MdQuouA';
        var map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 5,
            doubleClickZoom: true
        });
        let maxX = -90;
        let minX = 90;
        let maxY = 0;
        let minY = 180;
        this.props.towns.map(town => {
            if (town.coordinates[0] > maxX){
                maxX = town.coordinates[0]
            }
            if (town.coordinates[0] < minX){
                minX = town.coordinates[0]
            }
            if (town.coordinates[1] > maxY){
                maxY = town.coordinates[1]
            }
            if (town.coordinates[1] < minY){
                minY = town.coordinates[1]
            }
            const popup = new mapboxgl.Popup({ offset: 25 })
                            .setText(town.name);
                        const marker = new mapboxgl.Marker({
                            draggable: false
                        })
                            .setLngLat(town.coordinates)
                            .setPopup(popup)
                            .addTo(map);
        });
        const mapCenterX = (maxX+minX)/2;
        const mapCenterY = (maxY+minY)/2;
        map.setCenter([mapCenterX,mapCenterY]);
        map.centerBetweenTowns = map.getCenter();
        MAP.setMap(map);
    }

    render() {
        const fullScreen = {
            width: "100vw",
            height: '100vh'
        };
        return (
            <div style={fullScreen} ref={el => this.mapContainer = el}></div>
        );
    }
}
const mapStateToProps = state =>{
    return{
        towns: state.dataReducer.towns
    }
};

export default connect(mapStateToProps,null)(MapScreen);





