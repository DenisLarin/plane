import React, {Component} from 'react';
import MapScreen from "../map/MapScreen";
import AddMarkerWindow from "../addMarkerWindow/AddMarkerWindow";

class AppScreen extends Component {
    render() {
        return (
            <div>
                <MapScreen/>
                <AddMarkerWindow/>
            </div>
        );
    }
}

export default AppScreen;
