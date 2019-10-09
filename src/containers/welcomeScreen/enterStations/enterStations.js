import React from 'react';
import InputField from "../../../components/inputs/InputField";
import './enterStations.scss'


function EnterStations(props) {
    const {inputs} = props
    const renderInputs = inputs.map(input => {
        return <InputField key={input.id} id={input.id} type={input.type} placeholder={input.placeholder}
                           value={input.value} onChange={props.onChange}/>
    });
    return (
        <div className="enterStations">
            {renderInputs}
        </div>
    );
}

export default EnterStations;
