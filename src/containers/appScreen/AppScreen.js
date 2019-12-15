import React, {Component} from 'react';
import MapScreen from "../map/MapScreen";
import AddMarkerWindow from "../addMarkerWindow/AddMarkerWindow";
import TaskWindow from '../tasksWindow/TaskWindow';
import MAPVALUES from "../map/MAPVALUES";

class AppScreen extends Component {
    render() {
        return (
            <div>
                <MapScreen/>
                <AddMarkerWindow/>
                <TaskWindow/>
            </div>
        );
    }
}

export default AppScreen;
