const initialState = {
    jobs: []
};

const jobsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_JOBS':
            return { ...state, jobs: action.payload };
        case 'ADD_JOB':
            return { ...state, jobs: [...state.jobs, action.payload] };
        case 'UPDATE_JOB_STATUS':
            return {
                ...state,
                jobs: state.jobs.map(job =>
                    job._id === action.payload.id ? action.payload.updatedJob : job
                )
            };
        default:
            return state;
    }
};

export default jobsReducer;
