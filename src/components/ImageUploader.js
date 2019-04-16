import React, { useState } from 'react';

export default ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  return (
    <div className="form">
      <h3>Form</h3>
      <input
        type="file"
        className="form-control"
        placeholder="Upload Your Images"
        name="upload"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button id="submit" className="btn btn-default" onClick={() => onSubmit(file)}>
        upload
      </button>
      {/*Upload Form here*/}
    </div>
  )
}