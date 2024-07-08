import React, { useState } from 'react';
import axios from 'axios';

function PCA() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null); // To store file content
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/pca', formData, {
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
    <div style={styles.container}>
      <h1>Principal Component Analysis (PCA)</h1>
      <p>
        <strong>Theoretical Explanation:</strong> PCA is a dimensionality reduction technique used to reduce the number of variables in a dataset while preserving as much information as possible. It works by identifying the principal components, which are the directions of maximum variance in the data.
      </p>
      <p>
        <strong>Type of Input Data:</strong> A CSV file with columns of features. For example, a dataset of digit images represented as pixel values.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes the principal components of the dataset, which can be used for further analysis or visualization.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Upload CSV file:
          <input type="file" onChange={handleFileChange} style={styles.input} />
        </label>
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      {fileContent && (
        <div className="file-content" style={styles.fileContent}>
          <h2>Uploaded File Content</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                {fileContent[0].map((header, index) => (
                  <th key={index} style={styles.th}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileContent.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={styles.td}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && (
        <div style={styles.error}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {result && (
        <div style={styles.results}>
          <h2>Results</h2>
          <img src={`data:image/png;base64,${result.image_base64}`} alt="PCA Scatter Plot" style={styles.image} />
          <div style={styles.explanations}>
            <h3>Explanation of Results:</h3>
            <p>
              <strong>Principal Components:</strong> The principal components are the directions in which the data varies the most. In the scatter plot, each point represents a data point in terms of its principal components.
            </p>
            <p>
              <strong>Variance Explained:</strong> The principal components are ordered by the amount of variance they explain. The first principal component explains the most variance, followed by the second, and so on.
            </p>
            <p>
              <strong>Interpretation:</strong> By examining the scatter plot, you can see how the data points are distributed along the principal components. This can help you understand the structure of the data and identify patterns.
            </p>
          </div>
          <div style={styles.explanations}>
            <h3>List of Principal Components:</h3>
            <pre>{JSON.stringify(result.principal_components, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '10px'
  },
  input: {
    display: 'block',
    marginTop: '5px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: '20px'
  },
  results: {
    marginTop: '20px'
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: '20px'
  },
  explanations: {
    backgroundColor: '#F9F9F9',
    padding: '20px',
    borderRadius: '5px'
  },
  fileContent: {
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default PCA;
