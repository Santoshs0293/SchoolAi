import React, { useState } from 'react';
import axios from 'axios';

const plotTypes = ['pie', 'bar', 'hist', 'scatter', 'box'];

const plotExplanations = {
  pie: "A pie chart is a circular statistical graphic which is divided into slices to illustrate numerical proportion. Each slice of the pie represents a category of data, and the size of each slice is proportional to the quantity it represents.",
  bar: "A bar chart represents data with rectangular bars with lengths proportional to the values that they represent. It is used to compare different categories of data.",
  hist: "A histogram is an approximate representation of the distribution of numerical data. It is an estimate of the probability distribution of a continuous variable (quantitative variable) and was first introduced by Karl Pearson.",
  scatter: "A scatter plot uses dots to represent values for two different numeric variables. It is used to observe relationships between variables.",
  box: "A box plot displays the distribution of data based on a five-number summary: minimum, first quartile (Q1), median, third quartile (Q3), and maximum. It is a standardized way of displaying the dataset based on a five-number summary."
};

function DataVisualization() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [plotType, setPlotType] = useState('pie');
  const [plotImage, setPlotImage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(selectedFile);
  };

  const handlePlotTypeChange = (e) => {
    setPlotType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('plot_type', plotType);

    try {
      const response = await axios.post('http://localhost:5000/api/visualize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPlotImage(response.data.plot_image);
      setError(null);
    } catch (error) {
      console.error("Error generating plot:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="DataVisualization" style={styles.container}>
      <h1>Data Visualization</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Upload CSV file:
          <input type="file" onChange={handleFileChange} style={styles.input} />
        </label>
        <label style={styles.label}>
          Select plot type:
          <select value={plotType} onChange={handlePlotTypeChange} style={styles.select}>
            {plotTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <button type="submit" style={styles.button}>Generate Plot</button>
      </form>
      {fileContent && (
        <div style={styles.fileContent}>
          <h2>Uploaded CSV Content</h2>
          <pre>{fileContent}</pre>
        </div>
      )}
      {error && (
        <div style={styles.error}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {plotImage && (
        <div style={styles.results}>
          <h2>Generated Plot</h2>
          <img src={`data:image/png;base64,${plotImage}`} alt="Generated Plot" style={styles.image} />
          <div style={styles.explanation}>
            <h3>Explanation</h3>
            <p>{plotExplanations[plotType]}</p>
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
  select: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '5px',
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
    textAlign: 'left'
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
    height: 'auto'
  },
  explanation: {
    marginTop: '20px',
    textAlign: 'left'
  }
};

export default DataVisualization;
