import React from 'react';

const statuses = ["Applied", "Screen", "Interviewing", "Offer", "Rejected"];

const StatusSlider = ({ status, onChangeStatus }) => {
  const handleStatusChange = (newStatus) => {
    onChangeStatus(newStatus);
  };

  const getStatusIndex = (status) => {
    return statuses.indexOf(status);
  };

  const currentIndex = getStatusIndex(status);

  const getBarColor = () => {
    if (status === "Offer") return 'bg-green-500';
    if (status === "Rejected") return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-2 bg-gray-300 rounded-full mb-4 mt-2">
        <div className={`absolute top-0 h-2 rounded-full ${getBarColor()}`} style={{ width: `${(currentIndex) / (statuses.length - 1) * 100}%` }}></div>
        <div className="absolute flex justify-between w-full" style={{ top: '-4px' }}>
          {statuses.map((s, index) => (
            <div
              key={s}
              className={`w-4 h-4 rounded-full cursor-pointer ${index <= currentIndex ? getBarColor() : 'bg-gray-300'}`}
              onClick={() => handleStatusChange(s)}
            ></div>
          ))}
        </div>
      </div>
      <div className="flex justify-between w-full px-2">
        {statuses.map((s) => (
          <span key={s} className="text-xs text-gray-600">{s}</span>
        ))}
      </div>
    </div>
  );
};

export default StatusSlider;
