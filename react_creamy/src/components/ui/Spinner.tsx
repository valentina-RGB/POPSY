import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="tw-flex tw-items-center tw-justify-center">
      <div className="tw-border-t-4 tw-border-blue-500 tw-border-solid tw-w-8 tw-h-8 tw-rounded-full tw-animate-spin"></div>
    </div>
  );
};

export default Spinner;