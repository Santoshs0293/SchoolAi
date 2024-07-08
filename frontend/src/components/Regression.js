import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Regression() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null); // To store file content
  const [testSize, setTestSize] = useState(0.2); // To store test size
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    readFileContent(uploadedFile); // Read the file content when file changes
  };

  const handleTestSizeChange = (e) => {
    setTestSize(e.target.value);
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
    formData.append('test_size', testSize); // Include test size in the form data

    try {
      const response = await axios.post('http://localhost:5000/regression', formData, {
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

  const data = result ? {
    labels: result.predictions.map((_, index) => `Data Point ${index + 1}`),
    datasets: [
      {
        label: 'Actual Values',
        data: result.actuals,
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Predicted Values',
        data: result.predictions,
        borderColor: 'red',
        fill: false,
      },
    ],
  } : null;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Actual vs Predicted Values',
      },
    },
  };

  return (
    <div className="Regression" style={styles.container}>
      <h1>Regression Analysis</h1>
      <p>
        <strong>Theoretical Explanation:</strong> Regression is a method used to predict a target variable (like house prices) based on one or more input features (like number of rooms, area, and price per square foot).
      </p>
      <p>
        <strong>Type of Input Data:</strong> The input data is a CSV file containing features and target values. Each row represents a data point, and each column represents a feature or the target value.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes the Mean Squared Error (MSE), which measures how close the predicted values are to the actual values. A lower MSE indicates better model performance. The graph below shows a comparison between the actual and predicted values.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Upload CSV file:
          <input type="file" onChange={handleFileChange} style={styles.input} />
        </label>
        <label style={styles.label}>
          Test Size (greater than 0 and less than 1):
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="0.99"
            value={testSize}
            onChange={handleTestSizeChange}
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>Run Regression</button>
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
        <div className="error" style={styles.error}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {result && (
        <div className="results" style={styles.results}>
          <h2>Results</h2>
          <p><strong>Mean Squared Error:</strong> {result.mse}</p>
          <Line data={data} options={options} />
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
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ced4da',
    borderRadius: '4px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
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
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  error: {
    color: 'red',
    marginTop: '20px'
  },
  results: {
    marginTop: '20px'
  }
};

export default Regression;
