import React from 'react';
import styles from './stationButton.module.scss'
function StationButton(props) {
    return (
        <button className={styles.stationButton} onClick={props.onClick}>{props.name}</button>
    );
}

export default StationButton;