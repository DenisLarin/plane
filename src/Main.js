import React, {Component} from 'react';
import Map from "./containers/map/MapScreen";
import AddMarkerWindow from "./containers/addMarkerWindow/AddMarkerWindow";

class Main extends Component {
    render() {
        return (
            <div>
                <Map/>
                <AddMarkerWindow/>
            </div>
        );
    }
}

export default Main;