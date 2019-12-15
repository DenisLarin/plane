import * as tasksActions from './../actionTypes/tasks'

export const changeTaskStatus = (level, subLevel, newStatus) =>{
    return{
        type: tasksActions.CHANGE_TASK_STATUS,
        task: {level, subLevel ,newStatus}
    }
};
