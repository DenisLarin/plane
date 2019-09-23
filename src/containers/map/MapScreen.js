import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

class MapScreen extends Component {
    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXNsYXJpbiIsImEiOiJjazB2bjJ5cnQwNmNmM25ueHprc2JvdzRwIn0.NHSA0JPYqDe1rw5MdQuouA';
        var map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [37.622504,55.753215],
            zoom: 10
        });
    }

    render() {
        const fullScreen = {
            width: "100vw",
            height: "100vh"
        }
        return (
            <div style={fullScreen} ref={el=>this.mapContainer = el}>

            </div>
        );
    }
}

export default MapScreen;





