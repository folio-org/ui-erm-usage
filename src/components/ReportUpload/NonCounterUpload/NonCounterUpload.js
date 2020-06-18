import React from 'react';

import FileUploadCard from './FileUploadCard';

function NonCounterUpload(props) {
  const handleSubmit = (e) => {
    console.log(e);
  };

  return (
    <FileUploadCard onSubmit={handleSubmit} {...props} />
  );
}

export default NonCounterUpload;
