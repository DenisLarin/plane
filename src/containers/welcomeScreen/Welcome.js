import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {setTowns, setStations} from './../../store/actions/index'
import './welcomeScreen.scss'
import EnterTowns from "./enterTowns/EnterTowns";
import EnterStations from "./enterStations/enterStations";
import Container from "../../hoc/Container";
import BetaApplicationModal from "../../components/betaApplicationModal/BetaApplicationModal";


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        addTowns: (towns) => dispatch(setTowns(towns)),
        addStations: (stations) => dispatch(setStations(stations))
    };
}

class Welcome extends Component {
    state = {
        town: {
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
        station: {
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
        },
        warning: '',
        defaultStations: [
            {
                name: "alpha",
                range: 400,
                blindSpot: 150,
                coast: 100
            },
            {
                name: "romeo",
                range: 400,
                blindSpot: 200,
                coast: 80
            },
            {
                name: "home",
                range: 200,
                blindSpot: 100,
                coast: 50
            },
            {
                name: "grizzly",
                range: 150,
                blindSpot: 0,
                coast: 40
            }
            ,
            {
                name: "new",
                range: 400,
                blindSpot: 150,
                coast: 0
            },
        ],
        defaultsTowns: [
            "Kazan",
            "Ufa",
            "Perm",
            "Kurgan"
        ],
        isModalShow: true,

        loadDefault: true
    };

    componentDidMount() {
        this.saveValues();
    }
    


    onModalCloseHandler = () => {
        this.setState({isModalShow: false})
    };

    //TODO убрать второе условие!!!
    saveValues = () => {
        if (this.state.warning || this.state.loadDefault) {
            this.props.addTowns(this.state.defaultsTowns);
            this.props.addStations(this.state.defaultStations);
            return <Redirect to="/map"/>
        }
        const towns = [];
        const stations = [];
        let isError = false;
        this.state.town.inputs.map(town => {
            if (town.value === "") {
                isError = true;
                this.setState(state => {
                    return {
                        ...state,
                        warning: "You haven't entered value. If you want use default value press button again"
                    }
                });
            }
            towns.push(town.value);
        });
        if (isError)
            return null;
        this.state.station.inputs.map(station => {
            const stationLine = station.value
            const split = stationLine.split(' ');
            if (split.length !== 4) {
                isError = true
                this.setState(state => {
                    return {
                        ...state,
                        warning: "You haven't entered value. If you want use default value press button again"
                    }
                });
            }
            ;
            const currentStation = {name: split[0], range: split[1], blindSpot: split[2], coast: Number(split[3])}
            stations.push(currentStation);
        });
        if (isError)
            return null
        if (this.state.warning === '') {
            this.props.addTowns(towns);
            this.props.addStations(stations);
            return <Redirect to="/map"/>
        }
    };
    onChangeTextInputHandler = (id, event, key) => {
        const inputValue = event.target.value;
        const newInputData = this.state[key].inputs[id];
        newInputData.value = inputValue;
        this.setState(state => {
            return {
                ...state,
                warning: ""
            }
        });
    };

    render() {
        if (this.state.warning) {
            var warning = <><p style={{color: 'red'}}>{this.state.warning}</p>
                <p>Stations:<br/></p>
                <pre>{JSON.stringify(this.state.defaultStations, null, '\t')}</pre>
                <p>Towns:<br/></p>
                <pre>{JSON.stringify(this.state.defaultsTowns, null, '\t')}</pre>
            </>
        }
        return (
            <div className="welcomeScreen">
                <Container className="container">
                    <BetaApplicationModal onReadModal={this.onModalCloseHandler} isShow={this.state.isModalShow}/>
                    <div>
                        <h1>Welcome to Plane App</h1>
                        <h3>Enter Towns, before use the app</h3>
                        <EnterTowns inputs={this.state.town.inputs}
                                    onChange={(id, event) => this.onChangeTextInputHandler(id, event, "town")}/>
                        <h3>Enter Stations ("station name" "station range" "station blindSpot" "station coast") with <b
                            style={{textDecoration: 'underline', color: "red"}}>space</b> between values</h3>
                        <EnterStations inputs={this.state.station.inputs}
                                       onChange={(id, event) => this.onChangeTextInputHandler(id, event, "station")}/>
                        <button onClick={this.saveValues}>Save Values</button>
                    </div>
                    {warning}
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
