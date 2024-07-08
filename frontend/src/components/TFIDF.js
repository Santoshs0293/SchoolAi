import React, { useState } from 'react';
import axios from 'axios';

function TFIDF() {
  const [texts, setTexts] = useState(['']);
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTextChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleAddTextBox = () => {
    setTexts([...texts, '']);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }
    formData.append('texts', JSON.stringify(texts));

    try {
      const response = await axios.post('http://localhost:5000/tfidf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Error processing texts/files:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="TFIDF" style={styles.container}>
      <h1>TF-IDF Calculation</h1>
      <p>
        <strong>Theoretical Explanation:</strong> TF-IDF (Term Frequency-Inverse Document Frequency) is a numerical statistic used to reflect how important a word is to a document in a collection or corpus. It is often used as a weighting factor in information retrieval and text mining.
      </p>
      <p>
        <strong>Type of Input Data:</strong> Provide text inputs directly or upload text files. Each text input/file should contain a document from which TF-IDF will be calculated.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes the TF-IDF scores of terms across all documents.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {texts.map((text, index) => (
          <div key={index} style={styles.textContainer}>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              style={styles.textarea}
              placeholder={`Document ${index + 1}`}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddTextBox} style={styles.button}>Add Text</button>
        <div style={styles.textContainer}>
          <label style={styles.label}>
            Upload text files:
            <input type="file" onChange={handleFileChange} style={styles.input} multiple />
          </label>
        </div>
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
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Term</th>
                {result.tfidf_scores.map((_, index) => (
                  <th key={index}>Document {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.feature_names.map((term, index) => (
                <tr key={index}>
                  <td>{term}</td>
                  {result.tfidf_scores.map((scores, docIndex) => (
                    <td key={docIndex}>{scores[index].toFixed(3)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
  textContainer: {
    marginBottom: '10px'
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    fontSize: '14px'
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
    cursor: 'pointer',
    marginRight: '10px'
  },
  error: {
    color: 'red',
    marginTop: '20px'
  },
  results: {
    marginTop: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2'
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px'
  }
};

export default TFIDF;
