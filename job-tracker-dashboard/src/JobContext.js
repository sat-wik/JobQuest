import React, { createContext, useReducer } from 'react';

// Initial state
const initialState = {
  jobs: [],
};

// Create context
const JobContext = createContext(initialState);

// Reducer function to handle actions
const jobReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, action.payload]
      };
    case 'UPDATE_JOB_STATUS':
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id ? { ...job, status: action.payload.status } : job
        )
      };
    default:
      return state;
  }
};

// Context provider component
export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  return (
    <JobContext.Provider value={{ state, dispatch }}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
