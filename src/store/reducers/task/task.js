import * as tasksActions from './../../actions/actionTypes/tasks'


const initState = {
    tasks: [
        {
            name: "Расположение всех станиций, чтобы они покрываили все города",
            subtasks: [
                {name: "расположите на карте 4 станции", complete: false},
                {name: "Станиции покрывают все города", complete: false}
            ],
            complete: false
        }
    ],
};

const changeTaskStatus = (state, {level, subLevel ,newStatus}) => {
    const currentLevelTask = state.tasks[level];
    if (currentLevelTask.subtasks[subLevel].complete !== newStatus) {
        currentLevelTask.subtasks[subLevel].complete = newStatus;
        const tasks = {...state.tasks};
        tasks[level] = currentLevelTask;
        const isAll = tasks[level].subtasks.filter(item=>{
            return !item.complete
        });
        if (isAll.length === 0){
            tasks[level].complete = true;
        }
        return {tasks};
    }
    return state;
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case tasksActions.CHANGE_TASK_STATUS:
            return changeTaskStatus(state, action.task);
        default:
            return state
    }
};
export default reducer