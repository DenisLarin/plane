import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import {connect} from 'react-redux'
import {addMap} from './../../store/actions/index'
import './map.css'
import './mapExtensions.css'

class MapScreen extends Component {
    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXNsYXJpbiIsImEiOiJjazB2bjJ5cnQwNmNmM25ueHprc2JvdzRwIn0.NHSA0JPYqDe1rw5MdQuouA';
        var map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [56.076361, 56.516010],
            zoom: 5,
        });
        const kazanPopup = new mapboxgl.Popup({ offset: 25 })
            .setText('Казань');
        const kazanMarker = new mapboxgl.Marker({
            draggable: false
        })
            .setLngLat([49.108795, 55.796289])
            .setPopup(kazanPopup)
            .addTo(map);
        const ufaPopup = new mapboxgl.Popup({ offset: 25 })
            .setText('Уфа');
        const ufaMarker = new mapboxgl.Marker({
            draggable: false
        })
            .setLngLat([ 55.958727,54.735147])
            .setPopup(ufaPopup)
            .addTo(map);
        const permPopup = new mapboxgl.Popup({ offset: 25 })
            .setText('Пермь');
        const permMarker = new mapboxgl.Marker({
            draggable: false
        })
            .setLngLat([56.229434,58.010450])
            .setPopup(permPopup)
            .addTo(map);
        const kurganPopup = new mapboxgl.Popup({ offset: 25 })
            .setText('Курган');
        const kurganMarker = new mapboxgl.Marker({
            draggable: false
        })
            .setLngLat([ 65.341118,55.441004])
            .setPopup(kurganPopup)
            .addTo(map);

        this.props.addMap(map)
    }

    render() {
        const fullScreen = {
            width: "100vw",
            height: '100vh'
        }
        return (
            <div style={fullScreen} ref={el => this.mapContainer = el}></div>
        );
    }
}
const mapDispatchToProps = dispatch =>{
    return{
        addMap: (map)=>dispatch(addMap(map))
    }
};
// const mapStateToProps = state =>{
//     return{
//
//     }
// };

export default connect(null,mapDispatchToProps)(MapScreen);





