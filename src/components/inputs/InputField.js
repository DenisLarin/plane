import React from 'react';

function InputField(props) {
    return (
        <input id={props.id} type={props.type} placeholder={props.placeholder} value={props.value} onChange={(event) => props.onChange(props.id, event)}/>
    );
}

export default InputField;
