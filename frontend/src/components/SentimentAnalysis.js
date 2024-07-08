import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function SentimentAnalysis() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/sentiment-analysis', { text });
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Error processing text:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  const getChartData = () => {
    return {
      labels: ['Polarity', 'Subjectivity'],
      datasets: [
        {
          label: 'Sentiment Analysis',
          data: [result.polarity, result.subjectivity],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="SentimentAnalysis" style={styles.container}>
      <h1>Sentiment Analysis</h1>
      <p>
        <strong>Theoretical Explanation:</strong> Sentiment analysis is the process of determining the emotional tone behind a series of words. It is used to gain an understanding of the attitudes, opinions, and emotions expressed within an online mention.
      </p>
      <p>
        <strong>Type of Input Data:</strong> A text input which can be a sentence, paragraph, or any string of text.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes the polarity and subjectivity of the text. Polarity indicates how positive or negative the text is, while subjectivity indicates how subjective or objective the text is.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Enter text:
          <input type="text" value={text} onChange={handleTextChange} style={styles.input} />
        </label>
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      {error && (
        <div style={styles.error}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {result && (
        <div style={styles.results}>
          <h2>Results</h2>
          <p><strong>Polarity:</strong> {result.polarity}</p>
          <p><strong>Subjectivity:</strong> {result.subjectivity}</p>
          <div style={styles.chartContainer}>
            <Bar data={getChartData()} />
          </div>
          <div style={styles.explanations}>
            <h3>Explanation of Results:</h3>
            <p>
              <strong>Polarity:</strong> Polarity ranges from -1 to 1. A score of -1 means the text is very negative, a score of 1 means the text is very positive, and a score of 0 means the text is neutral.
            </p>
            <p>
              <strong>Subjectivity:</strong> Subjectivity ranges from 0 to 1. A score of 0 means the text is very objective (fact-based), and a score of 1 means the text is very subjective (opinion-based).
            </p>
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
  chartContainer: {
    marginTop: '20px',
    marginBottom: '20px'
  },
  explanations: {
    backgroundColor: '#F9F9F9',
    padding: '20px',
    borderRadius: '5px'
  }
};

export default SentimentAnalysis;
