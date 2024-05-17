import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addJob } from '../actions/jobs';

const AddJobForm = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !company) {
      alert("Please fill in both the job title and company.");
      return;
    }
    const newJob = {
      title,
      company,
      status: 'Applied'
    };
    dispatch(addJob(newJob));
    setTitle('');
    setCompany('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700">Job Title</label>
        <input
          type="text"
          id="title"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="company" className="block text-gray-700">Company</label>
        <input
          type="text"
          id="company"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Job
      </button>
    </form>
  );
};

export default AddJobForm;
