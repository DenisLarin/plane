import React, {Component} from 'react';
import {connect} from 'react-redux';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

class SelectParamsWindow extends Component {
    render() {
        return (
            <div>
                <h1>выбор параметров</h1>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectParamsWindow);
