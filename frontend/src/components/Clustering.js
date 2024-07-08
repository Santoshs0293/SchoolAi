import React, { useState } from 'react';
import axios from 'axios';

function Clustering() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null); // To store file content
  const [k, setK] = useState(3);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    readFileContent(uploadedFile); // Read the file content when file changes
  };

  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const rows = content.split('\n').map(row => row.split(','));
      setFileContent(rows);
    };
    reader.readAsText(file);
  };

  const handleKChange = (e) => {
    setK(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('k', k);

    try {
      const response = await axios.post('http://localhost:5000/clustering', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Error processing file:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="Clustering">
      <h1>Clustering</h1>
      <p>
        <strong>Theoretical Explanation:</strong> Clustering is an unsupervised learning technique used to group similar data points together. It works by identifying patterns and structures in the data without using labeled examples.
      </p>
      <p>
        <strong>Type of Input Data:</strong> A CSV file with columns of features. For example, a dataset of customer spending habits.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes the assigned cluster for each data point, grouped by clusters.
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Upload CSV file:
          <input type="file" onChange={handleFileChange} />
        </label>
        <label>
          Number of clusters (k):
          <input type="number" value={k} onChange={handleKChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {fileContent && (
        <div className="file-content">
          <h2>Uploaded File Content</h2>
          <table>
            <thead>
              <tr>
                {fileContent[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileContent.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && (
        <div className="error">
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {result && (
        <div className="results">
          <h2>Results</h2>
          <img src={`data:image/png;base64,${result.image_base64}`} alt="Clustering Scatter Plot" />
          {Object.keys(result.clusters).map(cluster => (
            <div key={cluster}>
              <h3>Cluster {cluster}</h3>
              <pre>{JSON.stringify(result.clusters[cluster], null, 2)}</pre>
            </div>
          ))}
          <div className="explanations">
            <h3>Explanation of Results:</h3>
            <p>
              <strong>Cluster Assignments:</strong> Each data point is assigned to a cluster. The data points within the same cluster are more similar to each other than to those in other clusters.
            </p>
            <p>
              <strong>Number of Clusters (k):</strong> The value of k represents the number of clusters that the data is grouped into. Choosing the right number of clusters is crucial for meaningful results.
            </p>
            <p>
              <strong>Interpretation:</strong> By examining the data points in each cluster, you can identify patterns and similarities that may not be immediately apparent. For example, in a customer dataset, one cluster might represent high spenders, while another cluster might represent occasional shoppers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clustering;
