import { FETCH_JOBS, ADD_JOB, UPDATE_JOB_STATUS, DELETE_JOB } from './types';

export const setJobs = (jobs) => ({
    type: FETCH_JOBS,
    payload: jobs
});

export const addJob = (job) => ({
    type: ADD_JOB,
    payload: job
});

export const updateJobStatus = (id, updatedJob) => ({
    type: UPDATE_JOB_STATUS,
    payload: { id, updatedJob }
});

export const deleteJob = (id) => ({
    type: DELETE_JOB,
    payload: id
});

// Async action creators using thunk
export const fetchJobs = () => (dispatch) => {
    fetch('http://localhost:5000/jobs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            return response.json();
        })
        .then(data => {
            dispatch(setJobs(data));
        })
        .catch(error => console.error('Error fetching jobs:', error));
};

export const createJob = (jobData) => {
    return (dispatch) => {
        fetch('http://localhost:5000/jobs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jobData)
        })
        .then(response => response.json())
        .then(newJob => dispatch(addJob(newJob)))
        .catch(error => console.error('Error adding job:', error));
    };
};

// Action to change job status
export const changeJobStatus = (id, status) => (dispatch) => {
    fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(updatedJob => {
        dispatch({
            type: UPDATE_JOB_STATUS,
            payload: { id, updatedJob }
        });
    })
    .catch(error => console.error('Update error:', error));
};

// Action to delete job
export const removeJob = (id) => (dispatch) => {
    fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        dispatch(deleteJob(id));
    })
    .catch(error => console.error('Delete error:', error));
};
