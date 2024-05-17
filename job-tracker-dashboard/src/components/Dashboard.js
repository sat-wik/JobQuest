import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchJobs, changeJobStatus } from '../actions/jobs';
import FilterComponent from './FilterComponent';
import StatusSlider from './StatusSlider';
import AddJobForm from './AddJobForm';
import Sidebar from './Sidebar'; // Import Sidebar component

const Dashboard = ({ jobs, fetchJobs, changeJobStatus }) => {
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const handleStatusChange = (id, newStatus) => {
    changeJobStatus(id, newStatus);
  };

  const getNextStatus = (currentStatus) => {
    const statuses = ["Applied", "Screen", "Interviewing", "Offer", "Rejected"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[currentIndex + 1] || currentStatus;
  };

  const onFilterChange = (status) => {
    if (status === "All") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.status === status));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="background flex-1">
        <div className="dashboard-container">
          <h1 className="text-3xl font-bold text-center mb-8">Your Submitted Applications</h1>
          <AddJobForm />
          <FilterComponent onFilterChange={onFilterChange} />
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <h5 className="job-card-title">{job.title}</h5>
                <p className="job-card-company">{job.company}</p>
                <p className="job-card-details">Applied on: {job.dateApplied}</p>
                <StatusSlider status={job.status} onChangeStatus={(newStatus) => handleStatusChange(job._id, newStatus)} />
                <button
                  onClick={() => handleStatusChange(job._id, getNextStatus(job.status))}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Next Status
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  jobs: state.jobs.jobs
});

const mapDispatchToProps = {
  fetchJobs,
  changeJobStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
