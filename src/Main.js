import React, {Component} from 'react';
import Map from "./containers/map/MapScreen";
import AddMarkerWindow from "./containers/addMarkerWindow/AddMarkerWindow";
import Welcome from "./containers/welcomeScreen/Welcome";

class Main extends Component {
    render() {
        return (
            <div>
                <Welcome/>
                {/*<Map/>*/}
                {/*<AddMarkerWindow/>*/}
            </div>
        );
    }
}

export default Main;
