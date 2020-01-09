import React, {Component} from 'react'
import classes from './taskWindow.module.scss';
import {connect} from "react-redux";

class TaskWindow extends Component {
    state = {
        level: 0,
    };

    render() {
        const currentTaks = this.props.tasks[this.state.level];
        if (!currentTaks) {
            return null;
        }
        const subTasks = currentTaks.subtasks.map(item => {
            const style = item.complete ? {color: 'green'} : {color: 'red'};
            return <li className={classes.subtask} style={style} key={item.name}>{item.name}</li>;
        });

        return (
            <div className={classes.taskWindow}>
                <h1 className={classes.header}>{currentTaks.name}</h1>
                <ul>
                    {subTasks}
                </ul>
                {currentTaks.complete ?
                    <button>Следующая задача</button> : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        tasks: state.tasksReducer.tasks
    }
};

export default connect(mapStateToProps)(TaskWindow);