import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchJobs, changeJobStatus, removeJob } from '../actions/jobs';
import FilterComponent from './FilterComponent';
import StatusSlider from './StatusSlider';
import AddJobForm from './AddJobForm';
import SearchBar from './SearchBar'; // Import SearchBar component
import DateRangePicker from './DateRangePicker'; // Import DateRangePicker component
import Sidebar from './Sidebar'; // Import Sidebar component
import { FaTrash } from 'react-icons/fa'; // Import trash icon

const Dashboard = ({ jobs, fetchJobs, changeJobStatus, removeJob }) => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    filterJobs('All', searchTerm, startDate, endDate);
  }, [jobs, searchTerm, startDate, endDate]);

  const handleStatusChange = (id, newStatus) => {
    changeJobStatus(id, newStatus);
  };

  const handleDeleteJob = (id) => {
    removeJob(id);
  };

  const getNextStatus = (currentStatus) => {
    const statuses = ["Applied", "Screen", "Interviewing", "Offer", "Rejected"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[currentIndex + 1] || currentStatus;
  };

  const onFilterChange = (status) => {
    filterJobs(status, searchTerm, startDate, endDate);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterJobs('All', term, startDate, endDate);
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    filterJobs('All', searchTerm, start, end);
  };

  const filterJobs = (status, searchTerm, startDate, endDate) => {
    let filtered = jobs;

    if (status !== 'All') {
      filtered = filtered.filter(job => job.status === status);
    }

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(job => {
        const appliedDate = new Date(job.dateApplied);
        return appliedDate >= startDate && appliedDate <= endDate;
      });
    }

    setFilteredJobs(filtered);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="background flex-1">
        <div className="dashboard-container">
          <h1 className="text-3xl font-bold text-center mb-8">Your Submitted Applications</h1>
          <AddJobForm />
          <div className="search-filter-container">
            <FilterComponent onFilterChange={onFilterChange} />
            <SearchBar onSearch={handleSearch} />
            <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="grid grid-cols-1 gap-6 w-full">
            {filteredJobs.map(job => (
              <div key={job._id} className="job-card relative">
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
                {(job.status === "Offer" || job.status === "Rejected") && (
                  <FaTrash
                    className="absolute top-4 right-4 text-red-500 cursor-pointer"
                    onClick={() => handleDeleteJob(job._id)}
                  />
                )}
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
  changeJobStatus,
  removeJob
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
