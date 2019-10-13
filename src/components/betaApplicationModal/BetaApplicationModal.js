import React from 'react';
import './betaApplicationModal.scss'
function BetaApplicationModal(props) {
    let className = "betaApplicationModal";
    if (props.isShow){
       className = "betaApplicationModal show"
    }
    return (
        <div className={className}>
            <h1>The application is in development</h1>
            <h2>Report bugs by email <a href="mailto:mr.larindenis@gmail.com">mr.larindenis@gmail.com</a></h2>
            <p>This is a courseWork</p>
            <p>The purpose of the work: placement of radar stations to cover the area of 4 cities</p>
            <p>{props.warning}</p>
            <button onClick={props.onReadModal}>I've read it</button>
        </div>
    );
}

export default BetaApplicationModal;