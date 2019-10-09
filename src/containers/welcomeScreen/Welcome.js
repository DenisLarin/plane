import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setTowns} from './../../store/actions/index'
import './welcomeScreen.scss'
import EnterTowns from "./enterTowns/EnterTowns";
import EnterStations from "./enterStations/enterStations";

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        addTowns: (towns)=>dispatch(setTowns(towns))
    };
}

class Welcome extends Component {
    state={
        town:{
            inputs: [
                {
                    type: "text",
                    placeholder: 'enter town 1',
                    id: 0,
                    value: "",
                },
                {
                    type: "text",
                    placeholder: 'enter town 2',
                    id: 1,
                    value: "",
                },
                {
                    type: "text",
                    placeholder: 'enter town 3',
                    id: 2,
                    value: "",
                },
                {
                    type: "text",
                    placeholder: 'enter town 4',
                    id: 3,
                    value: "",
                },
            ],
        },
        station:{
            inputs: [
                {
                    type: "text",
                    placeholder: 'enter station 1',
                    id: 0,
                    value: "",
                },
                {
                    type: "text",
                    placeholder: 'enter station 2',
                    id: 1,
                    value: "",
                },
                {
                    type: "text",
                    placeholder: 'enter station 3',
                    id: 2,
                    value: "",
                },
                {
                    type: "text",
                    placeholder: 'enter station 4',
                    id: 3,
                    value: "",
                },
            ],
        }
    };
    saveValues = () => {

    };
    onChangeTextInputHandler = (id, event, key) => {
        const inputValue = event.target.value;
        const newInputData = this.state[key].inputs[id];
        newInputData.value = inputValue;
        this.setState(state=>{
            return  {
                ...state
            }
        });
    };
    render() {
        return (
            <div className="welcomeScreen">
                <h1>Welcome to Plane App</h1>
                <h3>Enter Towns, before use the app</h3>
                <EnterTowns inputs={this.state.town.inputs} onChange={(id, event)=>this.onChangeTextInputHandler(id, event, "town")}/>
                <h3>Enter Stations ("station name" "station range" "station blindSpot" "station coast") with <b style={{textDecoration: 'underline', color: "red"}}>space</b> between values</h3>
                <EnterStations inputs={this.state.station.inputs} onChange={(id, event)=>this.onChangeTextInputHandler(id, event, "station")}/>
                <button onClick={this.saveValues}/>
            </div>
        );
    }
}
export default Welcome
