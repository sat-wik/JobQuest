import { FETCH_JOBS, ADD_JOB, UPDATE_JOB_STATUS, DELETE_JOB } from '../actions/types';

const initialState = {
  jobs: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case FETCH_JOBS:
      return { ...state, jobs: action.payload };
    case ADD_JOB:
      return { ...state, jobs: [...state.jobs, action.payload] };
    case UPDATE_JOB_STATUS:
      return {
        ...state,
        jobs: state.jobs.map(job => job._id === action.payload.id ? action.payload.updatedJob : job)
      };
    case DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter(job => job._id !== action.payload)
      };
    default:
      return state;
  }
}
