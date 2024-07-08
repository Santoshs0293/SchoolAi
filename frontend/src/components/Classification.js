import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function Classification() {
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
      const response = await axios.post('http://localhost:5000/classification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);  // Log the response
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Error processing file:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  const data = result ? {
    labels: result.classes,
    datasets: [
      {
        label: 'Precision',
        data: result.precision,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Recall',
        data: result.recall,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'F1-Score',
        data: result.f1_score,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
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
        text: 'Classification Metrics',
      },
    },
  };

  return (
    <div className="Classification">
      <h1>Classification</h1>
      <p>
        <strong>Theoretical Explanation:</strong> Classification is a supervised learning technique used to predict the categorical labels of new observations based on past observations. It works by training a model using a labeled dataset and then using this model to classify new data points.
      </p>
      <p>
        <strong>Type of Input Data:</strong> A CSV file with columns of features and one column of labels (categories). For example, a dataset of flower measurements and their species.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes the accuracy of the model and a detailed classification report that shows precision, recall, f1-score, and support for each class.
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Upload CSV file:
          <input type="file" onChange={handleFileChange} />
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
          <p><strong>Accuracy:</strong> {result.accuracy}</p>
          <Bar data={data} options={options} />
          <pre>{result.report}</pre>
          <div className="explanations">
            <h3>Explanation of Results:</h3>
            <p>
              <strong>Accuracy:</strong> The ratio of correctly predicted instances to the total instances.
            </p>
            <p>
              <strong>Precision:</strong> The ratio of correctly predicted positive observations to the total predicted positives.
            </p>
            <p>
              <strong>Recall:</strong> The ratio of correctly predicted positive observations to all observations in the actual class.
            </p>
            <p>
              <strong>F1-Score:</strong> The weighted average of Precision and Recall.
            </p>
            <p>
              <strong>Support:</strong> The number of actual occurrences of the class in the specified dataset.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classification;
